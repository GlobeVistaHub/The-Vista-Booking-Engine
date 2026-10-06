import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'Auto-Bath Booking <onboarding@resend.dev>',
      to: 'seifeldinsherif73@gmail.com',
      subject: 'Vercel Diagnostic Email',
      html: '<p>This is a test from Vercel.</p>'
    });
    
    if (error) {
      return NextResponse.json({ success: false, error });
    }
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, exception: err.message });
  }
}
