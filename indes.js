var express = require('express')
var app = express()
var exec = require('child_process').exec;
var fs = require('fs')
var bodyParser = require('body-parser');
//app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

var requestNumber = 0;

app.get("/", (req, res)=> {
    res.send("Usage: send a post request to this url/filetype where filetype is a valid filetype (e.g., pdf, svg).")
})

app.post("/:format", (req, res)=> {
    console.log("Got request.");

    var body = '';
    filePath = "./";
    req.on('data', function(data) {
        body += data;
    });

    req.on('end', () => {
        let reqNum = requestNumber
        fs.writeFile("./" + reqNum + ".dot", body, (err) => {
            if (err) {
                res.send(err)
            } else {
                exec('dot ' + reqNum + ".dot -Tpdf -o " + reqNum + ".pdf", function callback(error, stdout, stderr){
                    // result
                    //res.sendFile("./" + reqNum + ".pdf")
                    fs.readFile("reqNum" + ".pdf", (err, data) => {
                        res.send(data)
                    })
                });
            }
        })
        requestNumber += 1
      })
    
    
   
})


app.listen(3000)