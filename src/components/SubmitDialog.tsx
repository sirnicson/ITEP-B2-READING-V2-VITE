interface Props {
  unanswered: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SubmitDialog({ unanswered, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="submit-title">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="submit-title" className="text-xl font-bold text-slate-950">Submit your test?</h2>
        <p className="mt-3 text-slate-600">
          {unanswered > 0 ? `You still have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}.` : 'You have answered all questions.'}
          {' '}You cannot change your responses after submission.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">Return to test</button>
          <button onClick={onConfirm} className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">Submit test</button>
        </div>
      </div>
    </div>
  );
}
