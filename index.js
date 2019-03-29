var express = require('express')
var app = express()
var exec = require('child_process').exec;
var fs = require('fs')

var requestNumber = 0;


app.get("/", (req, res)=> {
    res.send("Usage: send a post request to this url/filetype where filetype is a valid filetype (e.g., pdf, svg) and a header included in the request is labeled as <b>data</b> with the sgtring contents of a dot file.")
})

app.post("/:format", (req, res)=> {
    
    let format = req.params['format']
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let dataFileName = "./" + (requestNumber) + ".dot";
        let outputFileName = "./" + (requestNumber) + "." + format;
        fs.writeFile(dataFileName, body, (err)=> {
            requestNumber++;
            if (err) {
                res.send("Request failed.");
                res.end()
            } else {
                exec("dot " + dataFileName + " -T"+  format + " -o" + outputFileName, (err) => {
                    if (err) {
                        res.send("Parsing failed.");
                        res.end()
                    } else {
                        fs.readFile(outputFileName, (err, data)=> {
                            res.send(data)
                            res.end()
                        })
                    }
                })
                
            }
        })
    });
})


app.listen(process.env.PORT || 3000)