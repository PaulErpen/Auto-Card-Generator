var Mustache = require('mustache');
var fs = require('fs')

const express = require('express')
const app = express()
const port = 3000

//make modules and such accessible
app.use(express.static('public'))

app.get('/', (req, res) => res.send(Mustache.render(fs.readFileSync("templates/main.mustache").toString('utf8'), {})))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))