import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();

    // Use free Google Translate TTS API for extremely fast, reliable, & high quality multi-lingual output
    // Trim text to avoid Google Translate length limits
    const chunk = text.substring(0, 200).trim();
    
    // Choose voice language ('ar' for Arabic female, 'en' for English)
    const voiceLang = lang === 'ar' ? 'ar' : 'en';

    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&q=${encodeURIComponent(chunk)}&tl=${voiceLang}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Google TTS Rejection:", response.status);
      return NextResponse.json({ error: "TTS generation failed" }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
