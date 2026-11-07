import { api } from '../../api/client'
import { formatDate } from '../../utils/labels'
import Button from '../ui/Button'

// Notificaciones del estudiante (GET /api/notifications). Se marcan como leídas una a una
export default function MisAvisos({ notifications, onChange }) {
  async function markAsRead(id) {
    await api(`/notifications/${id}/read`, { method: 'PATCH' })
    onChange()
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {notifications.map((notification) => (
        <li
          key={notification.id}
          className={`rounded-md border px-4 py-3 text-[0.9rem] ${notification.read ? 'border-border bg-page text-muted' : 'border-forest-200 bg-forest-50 text-body'}`}
        >
          <p>{notification.message}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] text-muted">
            <time dateTime={notification.createdAt}>{formatDate(notification.createdAt, true)}</time>
            {!notification.read && (
              <Button variant="secondary" className="px-3! py-1! text-[0.8125rem]!" onClick={() => markAsRead(notification.id)}>
                Marcar como leído
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
