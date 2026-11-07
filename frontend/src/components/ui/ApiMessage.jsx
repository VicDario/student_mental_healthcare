// Muestra el resultado de una llamada a la API: éxito o el error con sus campos
export default function ApiMessage({ error, success }) {
  if (error) {
    return (
      <div role="alert" className="mb-4 rounded-sm border border-crisis-border bg-crisis-bg px-4 py-3 text-[0.875rem] text-crisis-text">
        <strong className="block">{error.message}</strong>
        {error.errors?.length > 1 && (
          <ul className="mt-1 list-disc pl-5">
            {error.errors.map((item) => (
              <li key={`${item.field}-${item.message}`}>{item.message}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (success) {
    return (
      <p role="status" className="mb-4 rounded-sm border border-forest-200 bg-forest-50 px-4 py-3 text-[0.875rem] text-forest-800">
        {success}
      </p>
    )
  }

  return null
}
