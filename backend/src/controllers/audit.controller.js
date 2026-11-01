import * as auditService from '../services/audit.service.js'

// GET /api/audit-logs?entityId=&user=&action=
export async function listAuditLogs(req, res) {
  const logs = await auditService.listAuditLogs(req.filters)
  res.json(logs)
}
