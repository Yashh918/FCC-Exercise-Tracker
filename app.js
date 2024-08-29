import express from 'express';
import cors from 'cors'
import path from 'path'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// static files import frontend
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'frontend')))

// routes import
import userRoutes from "./routes/user.routes.js"

// routes
app.use('/api', userRoutes)

export {app}