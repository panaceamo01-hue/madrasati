import { useState } from 'react';
import type { KnowledgeQuestion, Level } from '../types';
import {
  KNOWLEDGE_BRANCHES,
  KNOWLEDGE_ROUND_SIZE,
  drawKnowledgeQuestions,
  knowledgeRemaining,
  type KnowledgeBranch,
} from '../data/knowledge-quiz';
import { playCorrect, playWin, playWrong } from '../lib/sound';
import { shuffle } from '../lib/shuffle';
import { GameResult } from './GameResult';

interface Props {
  level: Level;
  best: number;
  onFinish: (score: number) => boolean;
  onReplay: () => void;
}

interface RoundQuestion {
  question: string;
  options: { text: string; correct: boolean }[];
}

function toRoundQuestions(bank: KnowledgeQuestion[]): RoundQuestion[] {
  return bank.map((item) => ({
    question: item.question,
    options: shuffle(
      item.options.map((text, index) => ({ text, correct: index === item.answer })),
    ),
  }));
}

export function KnowledgeGame({ best, onFinish, onReplay }: Props) {
  const [branch, setBranch] = useState<KnowledgeBranch | null>(null);
  const [questions, setQuestions] = useState<RoundQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ score: number; newBest: boolean } | null>(null);

  const branchMeta = branch ? KNOWLEDGE_BRANCHES.find((item) => item.id === branch) : null;
  const question = questions[index];
  const isLast = index === questions.length - 1;

  function chooseBranch(id: KnowledgeBranch) {
    setQuestions(toRoundQuestions(drawKnowledgeQuestions(id)));
    setBranch(id);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setResult(null);
  }

  function pick(optionIndex: number) {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (question.options[optionIndex].correct) {
      setScore((value) => value + 10);
      playCorrect();
    } else {
      playWrong();
    }
  }

  function next() {
    if (picked === null) return;
    if (isLast) {
      const newBest = onFinish(score);
      setResult({ score, newBest });
      playWin();
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  }

  function backToBranches() {
    setBranch(null);
    setQuestions([]);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setResult(null);
  }

  // اختيار الفرع أولًا: كل فرع فيه 100 سؤال، وكل جولة 10 أسئلة جديدة بلا تكرار.
  if (!branch || !branchMeta) {
    return (
      <div className="game-board">
        <p className="value-situation" style={{ textAlign: 'center' }}>
          🎓 اختر فرعًا — في كل فرع 100 سؤال، وكل جولة 10 أسئلة جديدة لم تُعرض عليك من
          قبل، حتى تنتهي المئة فتبدأ دورة جديدة.
        </p>
        <div className="games-grid">
          {KNOWLEDGE_BRANCHES.map((item) => {
            const remaining = knowledgeRemaining(item.id);
            return (
              <div className="game-card" key={item.id}>
                <span className="emoji" aria-hidden="true">
                  {item.emoji}
                </span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="best">
                  {remaining > 0
                    ? `🆕 تبقى ${remaining} سؤالًا جديدًا`
                    : '🎉 أكملت المئة — دورة جديدة تبدأ الآن'}
                </span>
                <button className="btn primary small" onClick={() => chooseBranch(item.id)}>
                  ابدأ الجولة
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <>
        <GameResult
          emoji={branchMeta.emoji}
          title={`${branchMeta.name} — تحدي المعرفة`}
          score={result.score}
          best={Math.max(best, result.score)}
          newBest={result.newBest}
          onReplay={onReplay}
        />
        <div className="game-actions" style={{ justifyContent: 'center' }}>
          <button className="btn primary" onClick={backToBranches}>
            🎓 جولة جديدة — اختر فرعًا
          </button>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
          {knowledgeRemaining(branch) > 0
            ? `تبقى ${knowledgeRemaining(branch)} سؤالًا جديدًا في فرع ${branchMeta.name} — الجولة التالية بأسئلة لم تُعرض عليك بعد.`
            : `أكملت أسئلة فرع ${branchMeta.name} كلها — الجولة التالية تبدأ دورة جديدة مخلوطة.`}
        </p>
      </>
    );
  }

  const answeredCorrectly = picked !== null && question.options[picked].correct;

  return (
    <>
      <div className="game-hud">
        <span className="hud-pill">
          السؤال: {index + 1} / {questions.length}
        </span>
        <span className="hud-pill score">النقاط: {score}</span>
        <span className="spacer" />
        <span className="hud-pill">
          {branchMeta.emoji} {branchMeta.name}
        </span>
        <button className="hud-pill" onClick={backToBranches} style={{ cursor: 'pointer' }}>
          غيّر الفرع
        </button>
      </div>
      <div className="game-board">
        <div
          className="progress gold"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={index + 1}
        >
          <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="value-situation">{question.question}</p>
        <div className="value-options">
          {question.options.map((option, optionIndex) => {
            let className = 'answer-btn';
            if (picked !== null) {
              if (option.correct) className += ' ok';
              else if (picked === optionIndex) className += ' bad';
            }
            return (
              <button
                key={option.text}
                className={className}
                onClick={() => pick(optionIndex)}
                disabled={picked !== null}
              >
                {option.text}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`value-moral${answeredCorrectly ? ' good' : ''}`}>
            <strong>{answeredCorrectly ? '✅ أحسنت!' : '🤔 الإجابة الصحيحة موضحة بالأخضر'}</strong>
            <p>
              {answeredCorrectly
                ? 'إجابة صحيحة، واصل التقدم!'
                : `الإجابة الصحيحة هي: ${question.options.find((option) => option.correct)?.text}`}
            </p>
          </div>
        )}
        <div className="game-actions">
          <button className="btn primary" onClick={next} disabled={picked === null}>
            {isLast ? 'أنهِ الجولة' : 'السؤال التالي'}
          </button>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
          كل جولة {KNOWLEDGE_ROUND_SIZE} أسئلة جديدة من 100 — لا تكرار حتى تنتهي المئة.
        </p>
      </div>
    </>
  );
}
