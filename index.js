// Dependencies
const express = require('express')
const helmet = require('helmet')
const cors = require('cors');
const bodyParser = require('body-parser')

const l = require('./service/logger.service')
const { default_port } = require('./config')
const apis = require('./apis')


const PORT = process.env.PORT || default_port

// Middlewares
const app = express()
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// API routes
app.use('/api/v1', apis)

// DB connection is required for server to start
app.listen(PORT, ()=>{
    l.info(`Server started on port: http://localhost:${PORT}`)
})
