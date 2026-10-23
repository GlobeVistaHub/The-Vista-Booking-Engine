import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'BK8xezNRY4Wb144YDpBV';

    if (!apiKey) {
      console.error('Missing ELEVENLABS_API_KEY');
      return NextResponse.json({ error: 'TTS Configuration error' }, { status: 500 });
    }

    const elevenlabs = new ElevenLabsClient({
      apiKey: apiKey,
    });

    // Convert text to speech
    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text: text,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });

    return new NextResponse(audioStream as any, {
      headers: { 'Content-Type': 'audio/mpeg' }
    });
  } catch (error: any) {
    // This will print the EXACT error from ElevenLabs in your terminal
    console.error('--- ELEVENLABS CRITICAL ERROR ---');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Body:', error.body);
    console.error('---------------------------------');
    
    return NextResponse.json({ 
      error: error.message || 'Error generating speech',
      details: error.body || 'No details provided'
    }, { status: error.status || 500 });
  }
}