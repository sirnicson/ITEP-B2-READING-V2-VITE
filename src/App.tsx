import { useCallback, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Flag, RotateCcw, Send } from 'lucide-react';
import { QuestionNavigator } from './components/QuestionNavigator';
import { SubmitDialog } from './components/SubmitDialog';
import { Timer } from './components/Timer';
import { TEST_CONFIG } from './data/testData';
import { useCountdown } from './hooks/useCountdown';
import type { DisplayedOptionOrders, ReadingSection, Responses, TestPhase, TestStatus } from './types/test';

type WarmupStage = 'flashcards' | 'matching' | 'gapfill';

function shuffle<T>(values: T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function buildOptionOrders(): DisplayedOptionOrders {
  return Object.fromEntries(
    TEST_CONFIG.sections.flatMap((section) =>
      section.questions.map((question) => [
        question.id,
        (TEST_CONFIG.randomization.answerOptions ? shuffle(question.options) : question.options).map((option) => option.id),
      ]),
    ),
  );
}

export default function App() {
  const [status, setStatus] = useState<TestStatus>('intro');
  const [phase, setPhase] = useState<TestPhase>('warmup');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [displayedOptionOrders, setDisplayedOptionOrders] = useState<DisplayedOptionOrders>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const section = TEST_CONFIG.sections[sectionIndex];
  const question = section.questions[questionIndex];
  const allQuestions = useMemo(() => TEST_CONFIG.sections.flatMap((item) => item.questions), []);
  const answered = useMemo(() => new Set(Object.keys(responses)), [responses]);
  const unansweredCount = allQuestions.length - answered.size;

  const submitTest = useCallback(() => {
    setShowSubmitDialog(false);
    setStatus('submitted');
  }, []);

  const timerRunning = status === 'active' && phase === 'reading';
  const { secondsLeft, reset: resetTimer } = useCountdown(TEST_CONFIG.durationSeconds, timerRunning, submitTest);

  const score = useMemo(
    () => allQuestions.reduce((total, item) => total + (responses[item.id] === item.correctOptionId ? TEST_CONFIG.scoring.pointsPerQuestion : 0), 0),
    [allQuestions, responses],
  );

  function startTest() {
    setDisplayedOptionOrders(buildOptionOrders());
    setStatus('active');
    setPhase('warmup');
  }

  function restartTest() {
    setStatus('intro');
    setPhase('warmup');
    setSectionIndex(0);
    setQuestionIndex(0);
    setResponses({});
    setFlagged(new Set());
    setDisplayedOptionOrders({});
    setShowSubmitDialog(false);
    resetTimer();
  }

  function completeWarmup() {
    setQuestionIndex(0);
    setPhase('reading');
  }

  function finishSection() {
    if (sectionIndex < TEST_CONFIG.sections.length - 1) {
      setSectionIndex((current) => current + 1);
      setQuestionIndex(0);
      setPhase('warmup');
    } else {
      setShowSubmitDialog(true);
    }
  }

  function toggleFlag() {
    setFlagged((current) => {
      const next = new Set(current);
      next.has(question.id) ? next.delete(question.id) : next.add(question.id);
      return next;
    });
  }

  if (status === 'intro') {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
        <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="bg-slate-950 px-7 py-8 text-white sm:px-10">
            <img src={`${import.meta.env.BASE_URL}itep-logo.png`} alt="iTEP logo" className="mb-5 h-16 w-auto" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Practice assessment</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{TEST_CONFIG.title}</h1>
            <p className="mt-3 text-slate-300">{TEST_CONFIG.subtitle}</p>
          </div>
          <div className="space-y-6 p-7 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['30 minutes', 'Reading time'],
                ['30 questions', 'Multiple choice'],
                ['3 readings', 'Entry to Standard B2'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-950">{value}</p>
                  <p className="mt-1 text-sm text-slate-600">{label}</p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="font-bold text-slate-950">Instructions</h2>
              <ul className="mt-2 space-y-2 text-slate-600">
                {TEST_CONFIG.instructions.map((instruction) => <li key={instruction}>• {instruction}</li>)}
              </ul>
            </div>
            <button onClick={startTest} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 font-bold text-white hover:bg-blue-800">
              Start test <ArrowRight size={19} />
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (status === 'submitted') {
    const maximumScore = allQuestions.length * TEST_CONFIG.scoring.pointsPerQuestion;
    const percentage = Math.round((score / maximumScore) * 100);
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 p-5">
        <section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-200 sm:p-10">
          <CheckCircle2 className="mx-auto text-emerald-600" size={64} />
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Test complete</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Your score is {score} / {maximumScore}</h1>
          <p className="mt-3 text-lg text-slate-600">{percentage}% correct · {answered.size} questions answered</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {TEST_CONFIG.sections.map((item) => {
              const sectionScore = item.questions.filter((q) => responses[q.id] === q.correctOptionId).length;
              return (
                <div key={item.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">{item.difficulty}</p>
                  <p className="mt-1 font-bold">{sectionScore} / {item.questions.length}</p>
                </div>
              );
            })}
          </div>
          <button onClick={restartTest} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800">
            <RotateCcw size={18} /> Restart module
          </button>
        </section>
      </main>
    );
  }

  if (phase === 'warmup') {
    return <WarmupScreen key={section.id} section={section} secondsLeft={secondsLeft} onComplete={completeWarmup} />;
  }

  const orderedOptions = (displayedOptionOrders[question.id] ?? question.options.map((option) => option.id))
    .map((id) => question.options.find((option) => option.id === id))
    .filter((option) => option !== undefined);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-slate-950 px-4 py-3 text-white shadow-lg sm:px-6">
        <div>
          <p className="font-bold">{TEST_CONFIG.title}</p>
          <p className="text-xs text-slate-400">{section.difficulty} · Reading {sectionIndex + 1} of {TEST_CONFIG.sections.length}</p>
        </div>
        <Timer seconds={secondsLeft} />
      </header>

      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            Question <strong className="text-slate-950">{questionIndex + 1}</strong> of {section.questions.length}
            <span className="mx-2 text-slate-300">|</span>
            {section.questions.filter((item) => answered.has(item.id)).length} answered in this reading
          </div>
          <button onClick={() => setShowSubmitDialog(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">
            <Send size={16} /> Submit test
          </button>
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-[1500px] grow lg:grid-cols-[minmax(0,1.25fr)_minmax(390px,0.75fr)]">
        <section className="passage-scrollbar max-h-[calc(100vh-214px)] overflow-y-auto border-b border-slate-200 p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">{section.difficulty}</span>
              <span className="text-sm text-slate-500">{section.contextLabel} · Suggested {section.suggestedMinutes} minutes</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-950">{section.title}</h1>
            <article className="mt-6 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-5 text-[1.02rem] leading-8 text-slate-700 sm:p-7">
              {section.passage}
            </article>
          </div>
        </section>

        <section className="passage-scrollbar max-h-[calc(100vh-214px)] overflow-y-auto bg-slate-50 p-5 sm:p-8">
          <div className="mx-auto max-w-xl">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">{question.type.replace('-', ' ')}</p>
            <h2 className="mt-2 text-xl font-bold leading-8 text-slate-950">{question.stem}</h2>
            {question.context && <div className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-sm italic leading-7 text-slate-600">{question.context}</div>}
            <div className="mt-6 space-y-3">
              {orderedOptions.map((option, optionIndex) => {
                const selected = responses[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setResponses((current) => ({ ...current, [question.id]: option.id }))}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${selected ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/40'}`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm font-bold ${selected ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-400 text-slate-600'}`}>
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="pt-0.5 leading-6 text-slate-800">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="sticky bottom-0 z-20 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] sm:px-6">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <QuestionNavigator
            questionIds={section.questions.map((item) => item.id)}
            currentId={question.id}
            answered={answered}
            flagged={flagged}
            onSelect={(id) => setQuestionIndex(section.questions.findIndex((item) => item.id === id))}
          />
          <div className="flex flex-wrap gap-2">
            <button disabled={questionIndex === 0} onClick={() => setQuestionIndex((index) => index - 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 disabled:opacity-40">
              <ArrowLeft size={17} /> Back
            </button>
            <button onClick={toggleFlag} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-semibold ${flagged.has(question.id) ? 'border-amber-400 bg-amber-100 text-amber-900' : 'border-slate-300 text-slate-700'}`}>
              <Flag size={17} fill={flagged.has(question.id) ? 'currentColor' : 'none'} /> {flagged.has(question.id) ? 'Flagged' : 'Flag'}
            </button>
            {questionIndex < section.questions.length - 1 ? (
              <button onClick={() => setQuestionIndex((index) => index + 1)} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2 font-bold text-white">
                Next <ArrowRight size={17} />
              </button>
            ) : (
              <button onClick={finishSection} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 font-bold text-white">
                {sectionIndex < TEST_CONFIG.sections.length - 1 ? 'Next warm-up' : 'Finish test'} <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>
      </footer>

      {showSubmitDialog && <SubmitDialog unanswered={unansweredCount} onCancel={() => setShowSubmitDialog(false)} onConfirm={submitTest} />}
    </div>
  );
}

function WarmupScreen({ section, secondsLeft, onComplete }: { section: ReadingSection; secondsLeft: number; onComplete: () => void }) {
  const [stage, setStage] = useState<WarmupStage>('flashcards');
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [gaps, setGaps] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [passed, setPassed] = useState(false);
  const matchingWords = useMemo(() => shuffle(section.warmup.vocabulary), [section]);
  const matchingMeanings = useMemo(() => shuffle(section.warmup.vocabulary), [section]);
  const gapWordBank = useMemo(() => shuffle(section.warmup.vocabulary), [section]);

  function checkStage() {
    const items = stage === 'matching' ? section.warmup.vocabulary : section.warmup.gapFill;
    const correct = stage === 'matching'
      ? section.warmup.vocabulary.filter((item) => matches[item.id] === item.id).length
      : section.warmup.gapFill.filter((item) => gaps[item.id] === item.correctVocabularyId).length;
    setChecked(true);
    setPassed(correct / items.length >= section.warmup.passThreshold);
  }

  function nextStage() {
    setChecked(false);
    setPassed(false);
    setStage(stage === 'flashcards' ? 'matching' : 'gapfill');
  }

  function retry() {
    if (stage === 'matching') setMatches({});
    if (stage === 'gapfill') setGaps({});
    setChecked(false);
    setPassed(false);
  }

  const selectionCount = stage === 'matching' ? Object.keys(matches).length : Object.keys(gaps).length;
  const itemCount = stage === 'matching' ? section.warmup.vocabulary.length : section.warmup.gapFill.length;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 px-4 py-4 text-white sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">{section.difficulty} warm-up</p>
            <h1 className="text-2xl font-bold">{section.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-900 px-3 py-1 text-sm font-semibold text-emerald-200">Timer paused</span>
            <Timer seconds={secondsLeft} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-5 flex gap-2">
          {section.warmup.stages.map((item, index) => (
            <span key={item} className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${item === stage ? 'bg-blue-700 text-white' : 'bg-white text-slate-500'}`}>
              {index + 1}. {item}
            </span>
          ))}
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          {stage === 'flashcards' && (
            <>
              <h2 className="text-2xl font-bold">Learn the key vocabulary</h2>
              <p className="mt-2 text-slate-600">Select each card to reveal its meaning.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {section.warmup.vocabulary.map((item) => {
                  const isRevealed = revealed.has(item.id);
                  return (
                    <button key={item.id} onClick={() => setRevealed((current) => new Set(current).add(item.id))} className="min-h-40 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
                      <div className="flex justify-between gap-3">
                        <p className="text-lg font-bold">{item.term}</p>
                        <span className="text-xs font-semibold uppercase text-slate-500">{item.partOfSpeech}</span>
                      </div>
                      {isRevealed ? (
                        <div className="mt-3 text-sm">
                          <p className="font-semibold">{item.meaning}</p>
                          <p className="mt-1 text-slate-500">{item.turkishMeaning}</p>
                          <p className="mt-3 leading-6 text-slate-700">{item.simpleMeaning}</p>
                        </div>
                      ) : <p className="mt-8 text-sm font-semibold text-amber-800">Reveal meaning</p>}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end">
                <button disabled={revealed.size < section.warmup.vocabulary.length} onClick={nextStage} className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:bg-slate-300">Continue to matching</button>
              </div>
            </>
          )}

          {stage === 'matching' && (
            <>
              <h2 className="text-2xl font-bold">Match each word to its meaning</h2>
              <p className="mt-2 text-slate-600">The words and meanings are independently randomized for this attempt.</p>
              <div className="mt-6 space-y-3">
                {matchingWords.map((item) => (
                  <div key={item.id} className="grid gap-2 rounded-xl bg-slate-50 p-4 sm:grid-cols-[220px_1fr] sm:items-center">
                    <label htmlFor={`match-${item.id}`} className="font-bold">{item.term}</label>
                    <select id={`match-${item.id}`} value={matches[item.id] ?? ''} disabled={checked} onChange={(event) => setMatches((current) => ({ ...current, [item.id]: event.target.value }))} className="rounded-lg border border-slate-300 bg-white p-3">
                      <option value="">Choose a meaning</option>
                      {matchingMeanings.map((meaning) => <option key={meaning.id} value={meaning.id}>{meaning.meaning}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}

          {stage === 'gapfill' && (
            <>
              <h2 className="text-2xl font-bold">Complete the sentences in context</h2>
              <p className="mt-2 text-slate-600">The word bank is randomized; sentence order remains fixed.</p>
              <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-900">{gapWordBank.map((item) => item.term).join(' · ')}</div>
              <div className="mt-6 space-y-3">
                {section.warmup.gapFill.map((item, index) => {
                  const [before, after] = item.sentence.split('___');
                  return (
                    <div key={item.id} className="rounded-xl bg-slate-50 p-4 leading-8">
                      <span className="mr-2 font-bold text-blue-700">{index + 1}.</span>{before}
                      <select value={gaps[item.id] ?? ''} disabled={checked} onChange={(event) => setGaps((current) => ({ ...current, [item.id]: event.target.value }))} className="mx-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
                        <option value="">Choose</option>
                        {gapWordBank.map((word) => <option key={word.id} value={word.id}>{word.term}</option>)}
                      </select>
                      {after}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {stage !== 'flashcards' && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
              <p className={`font-semibold ${checked ? passed ? 'text-emerald-700' : 'text-amber-700' : 'text-slate-600'}`}>
                {checked ? passed ? 'Threshold met. You may continue.' : `Try again. You need ${Math.ceil(itemCount * section.warmup.passThreshold)} correct.` : `${selectionCount} of ${itemCount} completed`}
              </p>
              {!checked ? (
                <button disabled={selectionCount < itemCount} onClick={checkStage} className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:bg-slate-300">Check answers</button>
              ) : passed ? (
                <button onClick={stage === 'matching' ? nextStage : onComplete} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">
                  {stage === 'matching' ? 'Continue to gap-fill' : 'Open reading and resume timer'}
                </button>
              ) : (
                <button onClick={retry} className="rounded-xl bg-amber-600 px-5 py-3 font-bold text-white">Try again</button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
