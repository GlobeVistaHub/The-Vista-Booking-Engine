const https = require('https');

const data = JSON.stringify({
  bookingRef: "VST-PRO-9999",
  guestName: "Vista VIP Guest",
  guestEmail: "guest@example.com",
  propertyName: "The Sapphire Estate",
  checkIn: "2026-12-01",
  checkOut: "2026-12-05",
  totalPrice: 2500,
  htmlDossier: "<h1>VISTA LUXURY DOSSIER</h1><p>Welcome to your Sapphire Estate stay.</p>"
});

const options = {
  hostname: 'globevistahub.app.n8n.cloud',
  port: 443,
  path: '/webhook-test/payment-success',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
