import React, { useState, useEffect } from 'react';
import { analytics } from '../utils/analytics';
import './SatisfactionSurvey.css';

interface SatisfactionSurveyProps {
  onClose: () => void;
}

const SatisfactionSurvey: React.FC<SatisfactionSurveyProps> = ({ onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      id: 0,
      type: 'rating',
      question: 'AromaWiseの使いやすさはいかがですか？',
      scale: 5 as const,
      labels: ['とても悪い', '悪い', '普通', '良い', 'とても良い']
    },
    {
      id: 1,
      type: 'rating',
      question: '推奨されるオイルの精度はいかがですか？',
      scale: 5 as const,
      labels: ['全く役立たない', 'あまり役立たない', '普通', '役立つ', 'とても役立つ']
    },
    {
      id: 2,
      type: 'multiple',
      question: '最も使用している機能はどれですか？',
      options: [
        'オイル検索',
        'レシピ閲覧',
        'ブレンド作成',
        '推奨システム',
        'お気に入り管理'
      ]
    },
    {
      id: 3,
      type: 'rating',
      question: 'アプリの情報量についてどう思いますか？',
      scale: 5 as const,
      labels: ['少なすぎる', '少し少ない', 'ちょうど良い', '少し多い', '多すぎる']
    },
    {
      id: 4,
      type: 'text',
      question: '改善してほしい点があれば教えてください',
      placeholder: '任意でご記入ください'
    }
  ];

  useEffect(() => {
    // サーベイ表示をアナリティクスに記録
    analytics.trackInteraction('navigation', { action: 'survey_start' }, 'satisfaction_survey');
  }, []);

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    
    // アナリティクスに記録
    analytics.trackInteraction('navigation', {
      action: 'survey_answer',
      questionId: currentQuestion,
      answer
    }, 'satisfaction_survey');
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    // サーベイ結果を保存
    const surveyResult = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      answers,
      userAgent: navigator.userAgent,
      sessionId: analytics.generateReport().overview.totalSessions
    };

    const existingSurveys = JSON.parse(localStorage.getItem('aromawise_surveys') || '[]');
    existingSurveys.push(surveyResult);
    localStorage.setItem('aromawise_surveys', JSON.stringify(existingSurveys));

    // 次回表示日を設定（30日後）
    const nextSurveyDate = new Date();
    nextSurveyDate.setDate(nextSurveyDate.getDate() + 30);
    localStorage.setItem('aromawise_next_survey', nextSurveyDate.toISOString());

    // アナリティクスに記録
    analytics.trackInteraction('navigation', {
      action: 'survey_complete',
      totalQuestions: questions.length,
      completionRate: 100
    }, 'satisfaction_survey');

    setCompleted(true);

    // 3秒後に閉じる
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    switch (question.type) {
      case 'rating':
        return (
          <div className="rating-question">
            <h3>{question.question}</h3>
            <div className="rating-scale">
              {Array.from({ length: question.scale || 5 }, (_, i) => (
                <button
                  key={i}
                  className={`rating-btn ${answers[currentQuestion] === i + 1 ? 'selected' : ''}`}
                  onClick={() => handleAnswer(i + 1)}
                >
                  <span className="rating-number">{i + 1}</span>
                  <span className="rating-label">{question.labels?.[i] || ''}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'multiple':
        return (
          <div className="multiple-question">
            <h3>{question.question}</h3>
            <div className="options">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${answers[currentQuestion] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="text-question">
            <h3>{question.question}</h3>
            <textarea
              className="text-input"
              placeholder={question.placeholder || ''}
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              rows={4}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (completed) {
    return (
      <div className="survey-overlay">
        <div className="survey-modal completed">
          <div className="completion-content">
            <div className="success-icon">🎉</div>
            <h3>ありがとうございました！</h3>
            <p>貴重なご意見をいただき、ありがとうございます。</p>
            <p>いただいたフィードバックはアプリの改善に活用させていただきます。</p>
            <div className="auto-close">3秒後に自動で閉じます...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-overlay">
      <div className="survey-modal">
        <div className="survey-header">
          <h2>📊 満足度調査</h2>
          <div className="progress-info">
            <span>{currentQuestion + 1} / {questions.length}</span>
          </div>
          <button onClick={onClose} className="survey-close">×</button>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="survey-content">
          {renderQuestion()}
        </div>

        <div className="survey-actions">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-secondary"
          >
            前へ
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers.hasOwnProperty(currentQuestion)}
            className="btn-primary"
          >
            {currentQuestion === questions.length - 1 ? '完了' : '次へ'}
          </button>
        </div>

        <div className="survey-footer">
          <p>📱 ご協力いただきありがとうございます</p>
        </div>
      </div>
    </div>
  );
};

export default SatisfactionSurvey;