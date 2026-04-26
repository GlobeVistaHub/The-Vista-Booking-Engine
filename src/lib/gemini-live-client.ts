import { VISTA_ALEXA_PERSONA } from '@/data/vista_knowledge';

export type LiveClientState = 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'error';

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private nextPlayTime: number = 0;
  
  public onStateChange: (state: LiveClientState) => void = () => {};
  public onTextReceived: (text: string) => void = () => {};
  public onError: (err: string) => void = () => {};

  async connect() {
    this.onStateChange('connecting');
    try {
      const res = await fetch('/api/gemini-token');
      const data = await res.json();
      if (!data.key) throw new Error('Failed to get API key');

      const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${data.key}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.ws?.send(JSON.stringify({
          setup: {
            model: "models/gemini-2.0-flash",
            generationConfig: {
              responseModalities: ["AUDIO"]
            },
            systemInstruction: {
              parts: [{ text: `${VISTA_ALEXA_PERSONA}\n\n## LIVE INVENTORY\n${data.inventoryString}\n\nCRITICAL RULE: You are interacting via live voice. Keep responses concise (1-2 sentences). Never use markdown, bold, or lists.` }]
            }
          }
        }));
        
        this.onStateChange('connected');
        this.startMicrophone();
      };

      this.ws.onmessage = async (event) => {
        let msg;
        if (event.data instanceof Blob) {
          const text = await event.data.text();
          msg = JSON.parse(text);
        } else {
          msg = JSON.parse(event.data);
        }

        if (msg.error) {
          console.error("WS API Error:", msg.error.message);
          this.onError("Voice Engine Error: " + msg.error.message);
          this.disconnect();
          return;
        }

        if (msg.serverContent?.modelTurn?.parts) {
          for (const part of msg.serverContent.modelTurn.parts) {
            if (part.inlineData?.mimeType?.startsWith('audio/pcm')) {
              this.onStateChange('speaking');
              this.playAudioChunk(part.inlineData.data);
            }
            if (part.text) {
              this.onTextReceived(part.text);
            }
          }
        }
        
        if (msg.serverContent?.turnComplete) {
           setTimeout(() => {
             // Reset back to listening after a small delay to ensure audio finished
             if (this.ws?.readyState === WebSocket.OPEN) {
               this.onStateChange('listening');
             }
           }, 1000);
        }
      };

      this.ws.onerror = (e) => {
        console.error("WebSocket Error:", e);
        this.onError("Connection error");
        this.disconnect();
      };

      this.ws.onclose = (event) => {
        console.warn(`WebSocket closed: Code ${event.code}, Reason: ${event.reason}`);
        if (event.code === 1006) {
          this.onError("Connection closed unexpectedly. Check your internet or API Quota.");
        }
        this.disconnect();
      };

    } catch (err: any) {
      console.error(err);
      this.onError(err.message);
      this.disconnect();
    }
  }

  private async startMicrophone() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Use ScriptProcessorNode for easy raw PCM capture
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      this.processor.onaudioprocess = (e) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }

        // Convert Int16Array to Base64
        const buffer = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < buffer.byteLength; i++) {
          binary += String.fromCharCode(buffer[i]);
        }
        const base64 = btoa(binary);

        this.ws.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{
              mimeType: "audio/pcm;rate=16000",
              data: base64
            }]
          }
        }));
      };
      
      this.onStateChange('listening');
    } catch (err) {
      console.error("Microphone error", err);
      this.onError("Could not access microphone");
      this.disconnect();
    }
  }

  private playAudioChunk(base64: string) {
    if (!this.audioContext) return;
    
    // Decode base64 to Int16Array (Gemini outputs 24kHz PCM)
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      view[i] = binary.charCodeAt(i);
    }
    const int16Array = new Int16Array(buffer);
    
    // Convert to Float32Array
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 0x7FFF;
    }

    const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 24000); // 24kHz
    audioBuffer.copyToChannel(float32Array, 0);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const currentTime = this.audioContext.currentTime;
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime;
    }
    source.start(this.nextPlayTime);
    this.nextPlayTime += audioBuffer.duration;
  }

  disconnect() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.onStateChange('idle');
  }
}
