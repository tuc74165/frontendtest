var express = require('express');
var app = express();
var fs = require("fs");
const csvjson = require('csvjson');
const readFile = require('fs').readFile;


app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

fetchAllDocuments = async(documentMap,res)=>{
  let dataMap = {};
  let promiseArray = [];
  let filePath = null;
  for(let customer in documentMap) {
    filePath = documentMap[customer];
    promiseArray.push(new Promise((resolve, reject) => {
      readFile('./data/'+filePath, 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err); // Do something to handle the error or just throw it
            reject(err);
        }
        const jsonObj = csvjson.toObject(fileContent);
        resolve({name:customer,values:jsonObj});
      });
    }));
  }
  Promise.all(promiseArray).then((results)=>{
    for(let i = 0; i<results.length; i++) {
      dataMap[results[i].name] = results[i].values;
    }
    console.log(dataMap);
    res.end(JSON.stringify(dataMap));
  });
}

app.get('/listCustomers', function (req, res) {
   fs.readFile( __dirname + "/" + "customers-file-map.json", 'utf8', function (err, data) {debugger;
      const documentMap = JSON.parse( data );
      const dataMap = fetchAllDocuments(documentMap,res);
   });
});

app.post('/addCustomer', function (req, res) {
  // First read existing users.
  fs.readFile( __dirname + "/" + "customers-file-map.json", 'utf8', function (err, data) {
     data = JSON.parse( data );
     data["newCustomer"] = "classifications/newCustomer.csv";
     console.log( data );
     res.end( JSON.stringify(data));
  });
});

app.delete('/deleteCustomer/:customer', function (req, res) {
  // First read existing users.
  fs.readFile( __dirname + "/" + "customers-file-map.json", 'utf8', function (err, data) {
     data = JSON.parse( data );
     delete data[req.params.customer];

     console.log( data );
     res.end( JSON.stringify(data));
  });
});

app.get('/getFilesByCustomer/:customer', function (req, res) {
  // First read existing users.
  fs.readFile( __dirname + "/" + "customers-file-map.json", 'utf8', function (err, data) {
     var customers = JSON.parse( data );
     var filePath = customers[req.params.customer];
     console.log( user );
     res.end( JSON.stringify(user));
  });
});
app.use(express.static('dist/'));
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});


