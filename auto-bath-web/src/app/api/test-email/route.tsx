import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as React from 'react';
import BookingConfirmation from '@/emails/BookingConfirmation';

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'Auto-Bath Booking <onboarding@resend.dev>',
      to: 'seifeldinsherif73@gmail.com',
      subject: 'Vercel Diagnostic Email with Template',
      react: <BookingConfirmation 
        customerName="Test User"
        serviceName="Test Service"
        vehicle="Test Vehicle"
        date="Oct 6"
        price="100.00"
      />
    });
    
    if (error) {
      return NextResponse.json({ success: false, error });
    }
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, exception: err.message, stack: err.stack });
  }
}
