const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('What time is it!')
})

app.listen(port, () => {
  console.log(`Work Timer app listening on port ${port}`)
})