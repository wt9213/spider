var webpage = require('webpage');
var page = webpage.create();
var fs = require('fs');
var urlIndex = 0;

var spiderUrl=[
    'https://www.sme.vip/loan/list',
    'https://www.zwdai.com/'
];
var failog={
    url:"",
    count:0
};

page.onLoadStarted =function() {
    loadInProgress =true;
    console.log("load started");
};
page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("load finished");
};
page.onUrlChanged = function() {
    console.log("onUrlChanged");
};

var spiderCircle = setInterval(function(){
    var index=urlIndex;
    urlIndex++;
    if(urlIndex > spiderUrl.length){
        clearInterval(spiderCircle);
        page.close();   //关闭网页
        phantom.exit();   //退出phantomjs命令行
    }
    page.open(spiderUrl[index], function(status) {
        if(status == 'fail'){
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
        var title = page.evaluate(function() {   //可执行js操作
            window.scrollTo(0,document.body.scrollHeight);
            return document.title;
        });
        page.render('get/'+title+'.png');   //生成html页面图片
        console.log('Page title is ' + title);
        var file = fs.open('get/'+title+'.html', 'a');
        file.write(page.content);   //保存html
        file.close();
    });
},2000);
