export function AICardSkeleton() {
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--color-ai-bg)", border: "1px solid var(--color-ai-border)" }}>
      {['100%', '90%', '78%'].map((w, i) => (
        <div
          key={i}
          style={{
            width: w,
            height: '12px',
            borderRadius: '6px',
            marginBottom: '8px',
            background: 'linear-gradient(to right, #EBE4F4, #D8CCF0, #EBE4F4)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
      ))}
      <p className="text-xs font-medium mt-3" style={{ color: "var(--color-ai-text)" }}>
        Generating neighbourhood report…
      </p>
    </div>
  );
}

export function AICard({ title, content, scores }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--color-ai-bg)", border: "1px solid var(--color-ai-border)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: "var(--color-ai-text)" }}>✦</span>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ai-text)" }}>
          AI {title}
        </p>
      </div>

      <p className="text-sm mb-4" style={{ color: "var(--color-text)", lineHeight: "1.6" }}>
        {content}
      </p>

      {scores && (
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(scores).map(([label, score]) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold" style={{ color: "var(--color-ai-text)" }}>{score}</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}