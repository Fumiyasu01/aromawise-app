import React, { useState } from 'react';
import Feedback from '../Feedback';
import './SettingsSection.css';

const Support: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'エッセンシャルオイルの使用期限はどのくらいですか？',
      answer: '一般的に、未開封で3年、開封後は1年が目安です。柑橘系のオイルは酸化しやすいため、開封後6ヶ月以内の使用をおすすめします。'
    },
    {
      question: 'オイルの保管方法を教えてください',
      answer: '直射日光を避け、涼しく乾燥した場所で保管してください。冷蔵庫での保管も可能ですが、使用前に室温に戻してください。'
    },
    {
      question: '妊娠中でも使えるオイルはありますか？',
      answer: 'ラベンダー、レモン、ジンジャーなど一部のオイルは適切に希釈すれば使用可能ですが、必ず医師に相談してください。'
    },
    {
      question: 'ペットがいても安全に使えますか？',
      answer: '特に猫は多くのエッセンシャルオイルに敏感です。ティーツリー、ペパーミント、柑橘系オイルは避け、使用時は十分な換気を心がけてください。'
    },
    {
      question: 'アプリのデータは安全ですか？',
      answer: 'すべてのデータはお使いのデバイスにローカル保存されます。クラウド同期は現在準備中です。'
    }
  ];

  return (
    <div className="settings-section">
      <h2 className="section-title">💬 サポート</h2>
      <p className="section-description">
        お困りのことがあれば、お気軽にお問い合わせください。
      </p>

      <div className="support-section">
        <h3>フィードバック</h3>
        <p>アプリの改善のため、ご意見・ご要望をお聞かせください。</p>
        <button className="btn-primary" onClick={() => setShowFeedback(true)}>
          フィードバックを送る
        </button>
      </div>

      <div className="support-section">
        <h3>よくある質問</h3>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="faq-arrow">{expandedFaq === index ? '−' : '＋'}</span>
              </button>
              {expandedFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="support-section">
        <h3>お問い合わせ</h3>
        <div className="contact-info">
          <div className="contact-item">
            <h4>📧 メール</h4>
            <p>support@aromawise.app</p>
            <small>通常1-2営業日以内に返信いたします</small>
          </div>
          <div className="contact-item">
            <h4>🐦 Twitter</h4>
            <p>@AromaWiseApp</p>
            <small>最新情報やアップデートをお知らせします</small>
          </div>
        </div>
      </div>

      <div className="support-section">
        <h3>リソース</h3>
        <div className="resource-links">
          <a href="#" className="resource-link">
            📚 使い方ガイド
          </a>
          <a href="#" className="resource-link">
            🎥 チュートリアル動画
          </a>
          <a href="#" className="resource-link">
            📖 エッセンシャルオイル入門
          </a>
        </div>
      </div>

      {showFeedback && (
        <Feedback onClose={() => setShowFeedback(false)} />
      )}
    </div>
  );
};

export default Support;