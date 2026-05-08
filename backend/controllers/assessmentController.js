const Assessment = require('../models/Assessment');
const { GoogleGenAI } = require('@google/genai');

// Helper for Mock AI
const generateMockQuestions = (topic, difficulty) => {
  return [
    {
      questionText: `What is the primary purpose of ${topic}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A'
    },
    {
      questionText: `Which of the following describes a ${difficulty} concept in ${topic}?`,
      options: ['Concept X', 'Concept Y', 'Concept Z', 'Concept W'],
      correctAnswer: 'Concept Y'
    },
    {
      questionText: `How do you implement ${topic} in practice?`,
      options: ['Method 1', 'Method 2', 'Method 3', 'Method 4'],
      correctAnswer: 'Method 3'
    }
  ];
};

const generateAssessment = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    
    if (!topic || !difficulty) {
      return res.status(400).json({ message: 'Topic and difficulty are required' });
    }

    let questions = [];

    // Try Gemini if API key exists
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate exactly 5 multiple choice questions about "${topic}" at a "${difficulty}" difficulty level. Return strictly in JSON format as an array of objects. Each object must have "questionText" (string), "options" (array of exactly 4 strings), and "correctAnswer" (string, must exactly match one of the options). Do not include markdown code blocks in the output, just the raw JSON.`;
      
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const rawText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        questions = JSON.parse(rawText);
      } catch (err) {
        console.error('Gemini error, falling back to mock:', err);
        questions = generateMockQuestions(topic, difficulty);
      }
    } else {
      // Fallback to mock data
      questions = generateMockQuestions(topic, difficulty);
    }

    const assessment = await Assessment.create({
      user: req.user._id,
      topic,
      difficulty,
      questions,
      totalQuestions: questions.length
    });

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    
    // Ensure user owns it
    if (assessment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body; // array of answers corresponding to questions index
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    
    let score = 0;
    
    assessment.questions.forEach((q, index) => {
      q.userAnswer = answers[index] || null;
      if (q.userAnswer === q.correctAnswer) {
        score += 1;
      }
    });

    assessment.score = score;
    assessment.percentage = Math.round((score / assessment.totalQuestions) * 100);
    assessment.completed = true;

    await assessment.save();

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id }).sort('-createdAt');
    
    const completedAssessments = assessments.filter(a => a.completed);
    const totalTests = completedAssessments.length;
    
    const avgScore = totalTests > 0 
      ? Math.round(completedAssessments.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests)
      : 0;

    const recentAssessments = assessments.slice(0, 5);
    
    // Format chart data (e.g., last 7 tests)
    const chartData = completedAssessments.slice(0, 7).reverse().map((a, i) => ({
      name: `Test ${i + 1}`,
      topic: a.topic,
      score: a.percentage
    }));

    res.json({
      totalTests,
      avgScore,
      recentAssessments,
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id }).sort('-createdAt');
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateAssessment,
  getAssessment,
  submitAssessment,
  getDashboardStats,
  getAllAssessments
};
