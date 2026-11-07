import * as reportService from '../services/report.service.js'

// GET /api/reports/summary
export async function getSummary(req, res) {
  const summary = await reportService.getSummary(req.filters)
  res.json(summary)
}
