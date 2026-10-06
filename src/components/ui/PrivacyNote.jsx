export default function PrivacyNote({ title, children }) {
  return (
    <p className="mt-6 rounded-sm border border-border-subtle bg-forest-50 px-4 py-3.5 text-[0.8125rem] leading-normal text-muted">
      <strong className="text-forest-900">{title}.</strong> {children}
    </p>
  )
}
