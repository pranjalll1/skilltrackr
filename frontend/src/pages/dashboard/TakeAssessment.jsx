import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

export default function TakeAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
        };
        const { data } = await axios.get(`/api/assessments/${id}`, config);
        if (data.completed) {
          navigate(`/dashboard/assessments/${id}/result`);
        } else {
          setAssessment(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssessment();
  }, [id, navigate]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      };
      
      const formattedAnswers = assessment.questions.map((_, index) => answers[index] || null);

      await axios.put(`/api/assessments/${id}`, { answers: formattedAnswers }, config);
      navigate(`/dashboard/assessments/${id}/result`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  }, [assessment, answers, id, navigate, submitting]);

  useEffect(() => {
    if (!assessment) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, timeLeft, handleSubmit]);

  if (!assessment) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const q = assessment.questions[currentQuestion];
  const isLastQuestion = currentQuestion === assessment.questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-light">{assessment.topic}</h1>
          <p className="text-brand-secondary text-sm font-medium uppercase tracking-wider">{assessment.difficulty} Level</p>
        </div>
        
        <div className={`glass-card px-6 py-3 flex items-center gap-3 ${timeLeft < 60 ? 'border-red-500/50 text-red-400' : 'text-brand-light'}`}>
          <Clock className="w-5 h-5" />
          <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="glass-card p-8 min-h-[400px] flex flex-col">
        <div className="mb-8">
          <div className="flex justify-between text-brand-light/60 text-sm font-medium mb-4">
            <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
            <span>{Math.round(((currentQuestion) / assessment.questions.length) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-brand-primary/20 rounded-full h-2">
            <div 
              className="bg-brand-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-medium text-brand-light mb-8 leading-relaxed">
          {q.questionText}
        </h2>

        <div className="space-y-4 flex-grow">
          {q.options.map((option, idx) => {
            const isSelected = answers[currentQuestion] === option;
            return (
              <button
                key={idx}
                onClick={() => setAnswers({ ...answers, [currentQuestion]: option })}
                className={`w-full text-left p-5 rounded-xl border transition-all flex items-center gap-4 ${
                  isSelected 
                    ? 'bg-brand-primary/40 border-brand-accent text-brand-light shadow-[0_0_15px_rgba(255,133,187,0.2)]' 
                    : 'bg-brand-primary/10 border-brand-accent/20 text-brand-light/80 hover:border-brand-accent/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-accent bg-brand-accent' : 'border-brand-light/30'}`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-brand-dark" />}
                </div>
                <span className="text-lg">{option}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between mt-12 pt-6 border-t border-brand-accent/10">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-brand-light/70 hover:text-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-brand-accent text-brand-dark font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(255,133,187,0.3)] disabled:opacity-70"
            >
              <CheckCircle className="w-5 h-5" /> Submit Test
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(assessment.questions.length - 1, prev + 1))}
              className="flex items-center gap-2 px-6 py-3 bg-brand-primary/40 text-brand-secondary border border-brand-accent/30 rounded-lg hover:bg-brand-primary/60 transition-colors"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
