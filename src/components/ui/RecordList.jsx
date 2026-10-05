import { Children } from 'react'

export default function RecordList({ emptyMessage, children }) {
  if (Children.count(children) === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-[0.88rem] text-muted">
        {emptyMessage}
      </p>
    )
  }

  return <ul className="flex flex-col gap-2.5">{children}</ul>
}
