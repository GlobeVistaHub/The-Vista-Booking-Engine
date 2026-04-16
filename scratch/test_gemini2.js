const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const models = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-base', 'gemini-pro', 'gemini-3.1-pro'];
  
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent('Hi');
      console.log(`[OK] ${m}:`, result.response.text());
    } catch (err) {
      console.error(`[FAIL] ${m}:`, err.message);
    }
  }
}

test();
