export const ROLES = ['student', 'teacher', 'counselor', 'professional', 'admin']

export const CATALOG_TYPES = ['support_type', 'campus', 'unit']

export const URGENCY_LEVELS = ['low', 'medium', 'high']

export const REQUEST_ORIGINS = ['self', 'referral']

export const REQUEST_STATUSES = ['received', 'classified', 'assigned', 'in_progress', 'closed']

export const CONTACT_CHANNELS = ['email', 'phone']

export const CLOSURE_REFERRAL_TYPES = ['internal', 'external', 'none']

export const APPOINTMENT_MODALITIES = ['in_person', 'online']

export const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled', 'no_show']

export const WORKSHOP_KINDS = ['workshop', 'talk', 'activity']

export const WORKSHOP_MODALITIES = ['in_person', 'online', 'hybrid']

export const WORKSHOP_STATUSES = ['scheduled', 'cancelled', 'finished']

export const ENROLLMENT_STATUSES = ['enrolled', 'cancelled', 'attended']

export const NOTIFICATION_TYPES = ['received', 'assigned', 'status_changed', 'appointment']

export const AUDIT_ACTIONS = [
  'login',
  'login_failed',
  'logout',
  'view',
  'create',
  'update',
  'classify',
  'assign',
  'close',
]

export const SESSION_IDLE_SECONDS = 30 * 60
