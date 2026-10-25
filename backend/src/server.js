import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 3000

await connectDB()

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
