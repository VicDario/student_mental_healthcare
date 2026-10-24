export default function SideMenu({ label, items }) {
  return (
    <aside className="rounded-sm border border-border bg-page p-4">
      <nav aria-label={label}>
        <ul className="max-[900px]:flex max-[900px]:flex-wrap max-[900px]:gap-2">
          {items.map((item, index) => (
            <li key={item}>
              <span
                aria-current={index === 0 ? "page" : undefined}
                className={`block rounded-sm px-3 py-[9px] text-sm font-medium ${
                  index === 0
                    ? "bg-forest-700 text-white"
                    : "mt-1 cursor-not-allowed bg-subtle text-muted max-[900px]:mt-0"
                }`}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-3.5 text-xs leading-normal text-muted">
        Las secciones sin enlace están en desarrollo.
      </p>
    </aside>
  );
}
