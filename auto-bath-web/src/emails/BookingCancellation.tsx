import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text } from '@react-email/components';
import * as React from 'react';

interface BookingCancellationProps {
  customerName: string;
  serviceName: string;
  date: string;
}

export default function BookingCancellation({
  customerName = "Valued Customer",
  serviceName = "Premium Auto Detailing",
  date = "TBD",
}: BookingCancellationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Auto-Bath Booking has been Cancelled</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={heading}>AUTO<span style={orangeText}>-</span>BATH</Heading>
          </Section>
          
          <Hr style={hr} />
          
          <Section style={content}>
            <Text style={paragraph}>
              Hello {customerName},
            </Text>
            <Text style={paragraph}>
              This email is to confirm that your booking for <strong style={{color: '#fff'}}>{serviceName}</strong> on <strong style={{color: '#fff'}}>{date}</strong> has been successfully cancelled.
            </Text>
            
            <Text style={paragraph}>
              If this cancellation was made within our 48-hour policy window, a full refund will be processed to your original payment method within 5-10 business days.
            </Text>

            <Text style={paragraph}>
              We hope to serve you again in the future.
            </Text>
          </Section>

          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 Auto-Bath Detailing, Melbourne, VIC.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// STYLES
const main = { backgroundColor: '#050505', fontFamily: 'sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '600px' };
const header = { textAlign: 'center' as const, paddingBottom: '20px' };
const heading = { color: '#ffffff', fontSize: '32px', fontWeight: '800', letterSpacing: '4px', margin: '0' };
const orangeText = { color: '#FF6600' };
const hr = { borderColor: '#333333', margin: '20px 0' };
const content = { padding: '20px 0' };
const paragraph = { color: '#aaaaaa', fontSize: '16px', lineHeight: '26px', marginBottom: '24px' };
const footer = { textAlign: 'center' as const };
const footerText = { color: '#555555', fontSize: '12px' };
