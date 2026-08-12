import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})