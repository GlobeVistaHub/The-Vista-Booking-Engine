import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasResend: !!process.env.RESEND_API_KEY,
    keyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 5) : null
  });
}
