import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text } from '@react-email/components';
import * as React from 'react';

export default function PaymentFailed({
  customerName = "Valued Customer",
}: { customerName?: string }) {
  return (
    <Html>
      <Head />
      <Preview>Action Required: Auto-Bath Payment Failed</Preview>
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
              We attempted to process your booking, but unfortunately, your <strong style={{color: '#FF6600'}}>payment method was declined</strong>.
            </Text>
            
            <Text style={paragraph}>
              Your desired time slot has been released back to the public. If you would still like to secure your booking, please return to our website and try again with a different payment method.
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
