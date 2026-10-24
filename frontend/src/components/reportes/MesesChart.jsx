export default function MesesChart({ items }) {
  const mayor = Math.max(1, ...items.map((item) => item.cantidad));

  return (
    <div className="flex h-[220px] items-end justify-between gap-3 rounded-sm border border-border bg-card p-5 max-[560px]:h-[180px] max-[560px]:gap-1.5 max-[560px]:px-2.5 max-[560px]:py-3.5">
      {items.map(({ label, cantidad }) => (
        <div key={label} className="flex-[1_1_0] text-center text-[13px] max-[560px]:text-[11px]">
          <p className="mb-1.5 font-medium text-body">{cantidad}</p>
          <div
            className="mb-2 rounded-t-xs bg-forest-500"
            style={{ height: `${Math.round((cantidad / mayor) * 130) + 4}px` }}
          />
          <p className="text-muted">{label}</p>
        </div>
      ))}
    </div>
  );
}
