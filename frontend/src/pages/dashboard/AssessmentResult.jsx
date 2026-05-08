import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function AssessmentResult() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
        };
        const { data } = await axios.get(`/api/assessments/${id}`, config);
        setAssessment(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssessment();
  }, [id]);

  if (!assessment) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const isPass = assessment.percentage >= 60;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-light mb-4">Assessment Complete</h1>
        <p className="text-brand-light/60">Here is how you performed in {assessment.topic}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`glass-card p-8 flex flex-col items-center justify-center col-span-1 md:col-span-1 border-t-4 ${isPass ? 'border-t-green-500' : 'border-t-red-500'}`}>
          <Trophy className={`w-16 h-16 mb-4 ${isPass ? 'text-green-400' : 'text-red-400'}`} />
          <h2 className="text-5xl font-bold text-brand-light mb-2">{assessment.percentage}%</h2>
          <p className="text-brand-light/60 font-medium uppercase tracking-wide">{isPass ? 'Passed' : 'Needs Review'}</p>
        </div>

        <div className="glass-card p-8 col-span-1 md:col-span-2 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-brand-light mb-6">Performance Breakdown</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-brand-primary/20 p-4 rounded-xl border border-brand-accent/10">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-brand-light/70 font-medium">Correct</span>
              </div>
              <p className="text-3xl font-bold text-brand-light">{assessment.score}</p>
            </div>
            <div className="bg-brand-primary/20 p-4 rounded-xl border border-brand-accent/10">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-brand-light/70 font-medium">Incorrect</span>
              </div>
              <p className="text-3xl font-bold text-brand-light">{assessment.totalQuestions - assessment.score}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <h3 className="text-2xl font-bold text-brand-light mb-8">Detailed Review</h3>
        <div className="space-y-8">
          {assessment.questions.map((q, idx) => {
            const isCorrect = q.userAnswer === q.correctAnswer;
            return (
              <div key={idx} className="border-b border-brand-accent/10 pb-8 last:border-0 last:pb-0">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`mt-1 flex-shrink-0 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-brand-light mb-4">{q.questionText}</h4>
                    <div className="space-y-3">
                      {q.options.map((opt, oIdx) => {
                        let bgClass = "bg-brand-primary/10 border-brand-accent/10 text-brand-light/70";
                        if (opt === q.correctAnswer) {
                          bgClass = "bg-green-500/20 border-green-500/50 text-green-200";
                        } else if (opt === q.userAnswer && !isCorrect) {
                          bgClass = "bg-red-500/20 border-red-500/50 text-red-200";
                        }

                        return (
                          <div key={oIdx} className={`p-4 rounded-lg border ${bgClass}`}>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Link to="/dashboard" className="flex items-center gap-2 bg-brand-primary/40 text-brand-light border border-brand-accent/30 hover:bg-brand-primary/60 px-8 py-4 rounded-xl font-bold transition-colors">
          Return to Dashboard <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
