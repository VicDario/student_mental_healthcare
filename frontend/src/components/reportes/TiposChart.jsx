export default function TiposChart({ items }) {
  const mayor = Math.max(1, ...items.map((item) => item.cantidad));

  return (
    <div className="rounded-sm border border-border bg-card p-5">
      {items.map(({ label, cantidad }) => (
        <div key={label} className="mb-3.5 flex items-center gap-3.5 last:mb-0">
          <span className="flex-[0_0_130px] text-sm text-muted max-[560px]:flex-[0_0_96px] max-[560px]:text-[13px]">
            {label}
          </span>
          <div className="h-[22px] flex-auto rounded-xs bg-subtle">
            <div
              className="h-[22px] rounded-xs bg-forest-700"
              style={{ width: `${Math.round((cantidad / mayor) * 100)}%` }}
            />
          </div>
          <span className="flex-[0_0_40px] text-right text-sm font-medium text-body">{cantidad}</span>
        </div>
      ))}
    </div>
  );
}
