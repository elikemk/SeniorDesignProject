const express = require('express')
const app = express()
app.use(express.static('scripts')) 
app.listen(6000)