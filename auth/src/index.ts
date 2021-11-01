import express from 'express'
import { json, urlencoded } from "body-parser"

const app = express()
app.use(json())
app.use(urlencoded({ extended: true }))

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})