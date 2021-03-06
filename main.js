var webpage = require('webpage');
var page = webpage.create();
var fs = require('fs');

// phantom.outputEncoding="utf-8";//指定编码方式

var urlIndex = 0;
//获取需要爬取的url页面地址
var spiderUrl = require('./url.config.json').spiderUrl;   //读取json url 方式
// var spiderUrl= require('./url.config').spiderUrl;   //js module.exports 导出方式
// console.log("==>>>",JSON.stringify(spiderUrl));

var time = new Date();
var failog={  //失敗日志
    url:"",
    count:0
};

// http://phantomjs.org & http://phantomjs.org/api/      官方文档

page.onLoadStarted =function() {
    var currentUrl = page.evaluate(function() {
        return window.location.href;
    });
};
page.onLoadFinished = function(status) {
    // if(status=='fail'){
    //     console.log("load finished, status:"+status,(urlIndex-1));
    // }
};
page.onUrlChanged = function() {
    // console.log("onUrlChanged");
};


if(Array.isArray(spiderUrl)&&spiderUrl.length>0){
    var spiderCircle = setInterval(function(){
        var index=urlIndex;
        urlIndex++;
        if(index >= spiderUrl.length){
            clearInterval(spiderCircle);
            console.log("用时: ",new Date() - time);
            page.close();   // 关闭网页
            phantom.exit();   // 退出phantomjs命令行
        }else{
            console.log(index);
            page.open(spiderUrl[index], function(status) {
                if(status == 'fail'){
                    console.log("fail ==>>> spider: "+spiderUrl[index]);
                    // 对失败页面再次爬取，尝试三次
                    if(failog.count<3){ 
                        urlIndex--;
                    }
                    if(spiderUrl[index]==failog.url){
                        failog.count+=1;
                    }else{
                        failog.url=spiderUrl[index];
                        failog.count=1;
                    }
                    return;
                }
                console.log("success ==>>> spider: "+spiderUrl[index]);
                var title = page.evaluate(function() {   // 可执行js操作
                    window.scrollTo(0,document.body.scrollHeight);
                    return document.title;
                });
                page.render('get/'+title+'.png');   // 生成html页面图片
                console.log('page title is ' + title);
                var file = fs.open('get/'+title+'.html', 'a');
                file.write(page.content);   // 保存html
                file.close();
            });
        }
    },2700);  
}else{
    console.log('无可用spiderUrl，請檢查配置項');
    phantom.exit();
}

