const connectedToMongo = require('./db')
const express = require('express');

//Connecting to the mongodb server using mongooes
connectedToMongo();

//Express connection
const app = express()
const port = 5000

//Middlewere to resive json request
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', require('./routes/auth'))
// app.use('/api/notes', require('./router/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})