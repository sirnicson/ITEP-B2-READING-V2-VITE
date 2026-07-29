import { Clock3 } from 'lucide-react';

interface TimerProps { seconds: number; }

export function Timer({ seconds }: TimerProps) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  const urgent = seconds <= 300;

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-lg font-bold ${urgent ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-white'}`} aria-live="polite">
      <Clock3 size={19} aria-hidden="true" />
      <span>{minutes}:{remaining.toString().padStart(2, '0')}</span>
    </div>
  );
}
