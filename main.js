const Mustache = require('mustache');
const fs = require('fs');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');

const express = require('express')
const app = express()
const port = 3000
const row_indieces = ["A", "B", "C", "D"];

//use a body parser
app.use(bodyParser.json());

//make modules and such accessible
app.use(express.static('public'))

app.get('/', (req, res) => res.send(Mustache.render(fs.readFileSync("templates/main.mustache").toString('utf8'), {})))

app.post('/excel', function(req, res) {
    //var workbook = xlsx.read(binary, {type : "binary"});
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if(!err) {
            var XLSX = require('js-xlsx');
            var workbook = XLSX.readFile(files.file[0].path);
            var template_data = convertToTemplateData(workbook);
            res.send(Mustache.render(fs.readFileSync("templates/cards.mustache").toString('utf8'), {"cards" : template_data}));
        }
    });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

function convertToTemplateData(workbook) {
    var cards = []
    for(k in workbook["SheetNames"]) {
        var current_sheet = workbook["Sheets"][workbook["SheetNames"][k]];

        loop1: for(i = 2; ; i++) {
            var card = {};
            for(j = 0; j < row_indieces.length; j++) {
                var value = current_sheet["" + row_indieces[j] + i]
                if(!value) break loop1;
                switch (j) {
                    case 0:
                        card["title"] = value.w;
                        break;
                    case 1:
                        card["description"] = value.w;
                        break;
                    case 2:
                        card["effect"] = value.w;
                        break;
                    case 3:
                        card["quantity"] = value.v;
                        break;
                }
            }
            for(l = 0; l < card["quantity"]; l++){
                card["num"] = l + 1;
                cards.push(JSON.parse(JSON.stringify(card)));
            }
        }
    }
    return cards;
}