type EmptyStateProps = { text: string; icon?: unknown; action?: { label: string; onClick: () => void } };

export function EmptyState({ text, action }: EmptyStateProps) {
  return (
    <div className="hairline px-6 py-16 text-center">
      <p className="index-tag">/00/</p>
      <p className="mx-auto mt-3 max-w-sm text-base font-semibold text-[var(--ink-soft)]">{text}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-line mt-6">
          {action.label}
        </button>
      )}
    </div>
  );
}
