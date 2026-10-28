import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 3000

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined, copy .env.example to .env')
  process.exit(1)
}
// Valida que ENCRYPTION_KEY tenga 64 caracteres hex antes de arrancar
if (!/^[0-9a-f]{64}$/i.test(process.env.ENCRYPTION_KEY ?? '')) {
  console.error('ENCRYPTION_KEY must be 64 hex characters, see .env.example')
  process.exit(1)
}

await connectDB()

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
