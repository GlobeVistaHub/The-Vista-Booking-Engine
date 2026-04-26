const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const key = "AIzaSyDmmMRyGOrCS5zQhsWvNOU4bdrgD1rQM64";
  console.log("Testing with Key:", key.substring(0, 5) + "...");
  
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    const result = await model.generateContent("Hi");
    const response = await result.response;
    console.log("SUCCESS! AI Responded:", response.text());
  } catch (err) {
    console.error("DIAGNOSTIC FAILURE:", err.message);
    if (err.stack) console.error(err.stack);
  }
}

test();
