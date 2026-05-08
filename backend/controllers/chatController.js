const Chat = require('../models/Chat');
const { GoogleGenAI } = require('@google/genai');

const SYSTEM_PROMPT = `You are SavvyBot, an educational AI assistant for the Savvy AI platform. 
ONLY answer questions related to education, assessments, interviews, programming, and quizzes. 
If a user asks something unrelated (e.g., weather, casual chat, generating irrelevant content), politely decline and remind them you are strictly an educational assistant. 
Keep responses professional, helpful, concise, and do not use emojis.`;

// Fallback logic if API key is missing
const generateMockResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('react') || lowerMsg.includes('code') || lowerMsg.includes('study')) {
    return "That's a great educational topic! As a mock SavvyBot, I confirm this is relevant to programming or studying.";
  }
  return "I am SavvyBot. I am strictly an educational assistant. Please ask me about assessments, programming, or study topics.";
};

const getChatHistory = async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id, messages: [] });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = new Chat({ user: req.user._id, messages: [] });
    }

    // Save user message
    chat.messages.push({ role: 'user', content: message });
    
    let botResponse = '';

    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // Construct history for Gemini
      const contents = chat.messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));
      
      // Inject system prompt manually by prepending it to the first user message
      // Note: @google/genai might have a specific systemInstruction field depending on version.
      // For simplicity in standard text generation, we will prepend it.
      const prompt = `System Instruction: ${SYSTEM_PROMPT}\n\nUser Question: ${message}`;
      
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        botResponse = response.text().trim();
      } catch (err) {
        console.error('Gemini chat error:', err);
        botResponse = generateMockResponse(message);
      }
    } else {
      botResponse = generateMockResponse(message);
    }

    // Save bot message
    chat.messages.push({ role: 'model', content: botResponse });
    await chat.save();

    res.json({ response: botResponse, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatHistory,
  sendMessage
};
