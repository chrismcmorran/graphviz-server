var express = require('express')
var app = express()
var exec = require('child_process').exec;
var fs = require('fs')
var bodyParser = require('body-parser');
//app.use(bodyParser.text({ inflate: true, limit: '100kb', type: 'text/html' }));
//app.use(bodyParser.urlencoded({ extended: false }));

var requestNumber = 0;


app.get("/", (req, res)=> {
    res.send("Usage: send a post request to this url/filetype where filetype is a valid filetype (e.g., pdf, svg) and a header included in the request is labeled as <b>data</b> with the sgtring contents of a dot file.")
})

app.post("/:format", (req, res)=> {
  
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        let dataFileName = "./" + (requestNumber) + ".dot";
        let outputFileName = "./" + (requestNumber) + ".pdf";
        fs.writeFile(dataFileName, body, (err)=> {
            requestNumber++;
            if (err) {
                res.send("Request failed.");
            } else {
                exec("dot " + dataFileName + " -Tpdf -o" + outputFileName, (err) => {
                    if (err) {
                        res.send("Parsing failed.");
                    } else {
                        fs.readFile(outputFileName, (err, data)=> {
                            res.send(data)
                        })
                    }
                })
            }
        })
    });
})


app.listen(3000)