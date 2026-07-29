interface Props {
  questionIds: string[];
  currentId: string;
  answered: Set<string>;
  flagged: Set<string>;
  onSelect: (questionId: string) => void;
}

export function QuestionNavigator({ questionIds, currentId, answered, flagged, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Question navigator">
      {questionIds.map((questionId, index) => {
        const isCurrent = questionId === currentId;
        const isAnswered = answered.has(questionId);
        const isFlagged = flagged.has(questionId);
        return (
          <button
            key={questionId}
            type="button"
            onClick={() => onSelect(questionId)}
            aria-label={`Question ${index + 1}${isAnswered ? ', answered' : ''}${isFlagged ? ', flagged' : ''}`}
            className={`relative h-9 w-9 rounded-md border text-xs font-bold transition ${
              isCurrent
                ? 'border-blue-700 bg-blue-700 text-white'
                : isAnswered
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {index + 1}
            {isFlagged && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />}
          </button>
        );
      })}
    </div>
  );
}
