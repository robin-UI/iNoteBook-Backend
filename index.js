const connectedToMongo = require('./db')
const express = require('express');
// const { json } = require('express');

connectedToMongo();
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', require('./routes/auth'))
// app.use('/api/notes', require('./router/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})