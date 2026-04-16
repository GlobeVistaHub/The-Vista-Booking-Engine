const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hello');
    console.log('Gemini 1.5 Flash Response:', result.response.text());
  } catch (err) {
    console.error('Gemini 1.5 Flash Error:', err.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Hello');
    console.log('Gemini 2.0 Flash Response:', result.response.text());
  } catch (err) {
    console.error('Gemini 2.0 Flash Error:', err.message);
  }
}

test();
