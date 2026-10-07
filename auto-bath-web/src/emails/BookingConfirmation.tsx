import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text, Img } from '@react-email/components';
import * as React from 'react';

interface BookingConfirmationProps {
  customerName: string;
  serviceName: string;
  vehicle: string;
  date: string;
  price: string;
}

export default function BookingConfirmation({
  customerName = "Valued Customer",
  serviceName = "Premium Auto Detailing",
  vehicle = "Your Vehicle",
  date = "TBD",
  price = "$0.00",
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Auto-Bath Detailing Booking is Confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={heading}>AUTO<span style={orangeText}>-</span>BATH</Heading>
            <Text style={subheading}>Melbourne's Premier Detailer</Text>
          </Section>
          
          <Hr style={hr} />
          
          <Section style={content}>
            <Text style={paragraph}>
              Hello {customerName},
            </Text>
            <Text style={paragraph}>
              Thank you for trusting Auto-Bath with your {vehicle}. Your booking has been securely confirmed. Our master detailers are preparing for your arrival.
            </Text>
            
            <Section style={detailsBox}>
              <Text style={detailLabel}>SERVICE BOOKED</Text>
              <Text style={detailValue}>{serviceName}</Text>
              
              <Text style={detailLabel}>SCHEDULED FOR</Text>
              <Text style={detailValue}>{date}</Text>
              
              <Text style={detailLabel}>AMOUNT PAID</Text>
              <Text style={detailValue}>${price} AUD</Text>
            </Section>

            <Text style={paragraph}>
              <strong style={{color: "#FF6600"}}>Preparation Policy:</strong> Please ensure your vehicle is completely emptied of all personal belongings prior to arrival. If you need to cancel or reschedule, you must do so at least 48 hours in advance to receive a refund.
            </Text>

            <Section style={{ textAlign: 'center', marginTop: '32px' }}>
              <a href="https://auto-bath.com.au/my-bookings" style={button}>
                Manage Your Booking
              </a>
            </Section>
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

// STYLES (Cyber-Luxury Theme)
const main = {
  backgroundColor: '#050505',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center' as const,
  paddingBottom: '20px',
};

const heading = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '800',
  letterSpacing: '4px',
  margin: '0',
};

const orangeText = {
  color: '#FF6600',
};

const subheading = {
  color: '#00C2D4',
  fontSize: '12px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '8px 0 0 0',
};

const hr = {
  borderColor: '#333333',
  margin: '20px 0',
};

const content = {
  padding: '20px 0',
};

const paragraph = {
  color: '#aaaaaa',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '24px',
};

const detailsBox = {
  backgroundColor: '#111111',
  border: '1px solid #333333',
  borderLeft: '4px solid #FF6600',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '32px',
};

const detailLabel = {
  color: '#555555',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: '0 0 4px 0',
};

const detailValue = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
};

const footer = {
  textAlign: 'center' as const,
};

const footerText = {
  color: '#555555',
  fontSize: '12px',
};

const button = {
  backgroundColor: '#FF6600',
  borderRadius: '4px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 'bold',
  lineHeight: '1',
  padding: '16px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};
