import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 3000

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined, copy .env.example to .env')
  process.exit(1)
}

await connectDB()

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
