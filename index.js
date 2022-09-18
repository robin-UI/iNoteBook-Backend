const connectedToMongo = require('./db')
const express = require('express');
const cors = require('cors');

//Connecting to the mongodb server using mongooes
connectedToMongo();

//Express connection
const app = express()
const port = 5000

//Middlewere to resive json request
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNoteBook app listning at port ${port}`)
})