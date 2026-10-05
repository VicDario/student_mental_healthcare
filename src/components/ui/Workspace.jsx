export default function Workspace({ balanced = false, children }) {
  const columns = balanced
    ? 'min-[900px]:grid-cols-2'
    : 'min-[900px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'

  return <div className={`grid gap-6 min-[900px]:items-start ${columns}`}>{children}</div>
}
