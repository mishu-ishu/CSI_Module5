require('dotenv').config 

const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/userLoginDB'

const app = express()

mongoose.connect(url, { useNewUrlParser: true })
const connection = mongoose.connection

connection.on('open', () => {
  console.log('connected...')
})

app.use(express.json())

const userRouter = require('./routes/users')
app.use('/users', userRouter)

app.listen(9000, () => {
  console.log('listening to server...')
})