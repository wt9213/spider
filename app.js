var express = require('express');
var app = express();
var request = require('request');
var fs= require("fs");
var ejs=require('ejs');
// const opn = require('opn');  //自动打开浏览器

app.use(express.static('public'));

app.engine('html', ejs.__express);  // app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', 'views');    // 设置views路径

var mainRouter = require('./routes/main.js');
app.use('/', mainRouter);

/**
* API
*/
var BaseRequestData={
   platform:3,
   token:"",
   sign:"",
   userId:"",
   version:"1.5"
};

app.post('/project', function (req, res) {
  request('https://api.zwdai.com/project/index', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data=JSON.parse(body);
      res.send(data);
    }else{
      res.json({"code":"400","data":"","message":error});
    }
  });
  // request({
  //     url: "https://api.zwdai.com/project/index",
  //     method: "POST",
  //     json: true,
  //     headers: {"content-type": "application/json"},
  //     body: JSON.stringify(BaseRequestData)
  //   }, function(error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       res.send(body);
  //     }else{
  //       res.json({"code":"400","data":"","message":error});
  //     }
  //   });
});

app.post('/loan', function (req, res) {
  request({
      url: "https://api.zwdai.com/loan/index",
      method: "POST",
      json: true,
      headers: {"content-type": "application/json"},
      body: JSON.stringify(BaseRequestData)
      // body: {"platform":3,"token":"","sign":"","userId":"","version":"1.1.2"}
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }else{
        res.json({"code":"400","data":"","message":error});
      }
    });
});

app.post('/baidu', function (req, res) {
  request("https://www.baidu.com/", function (error, response, body) {
    res.send(body);
  });
});


var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
