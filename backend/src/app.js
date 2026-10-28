import cors from 'cors'
import express from 'express'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import routes from './routes/index.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
