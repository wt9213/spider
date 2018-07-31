var webpage = require('webpage');
var page = webpage.create();
var fs = require('fs');

var spiderPage=function (url){
    page.open(url, function (status) {
        console.log('spiderUrl:'+url);
        if (status === 'fail') {
            console.log('open page fail!');
        } else {
            var title = page.evaluate(function() {   //  可执行js操作
                return document.title;
            });
            // console.log(page.content);//打印出HTML内容
            page.render('get/'+title+'.png');//生成HTML页面图片
            console.log('Page title is ' + title);
            var file = fs.open('get/'+title+'.html', 'a');
            file.write(page.content);
            file.close();
        }

        page.close();//关闭网页
        phantom.exit();//退出phantomjs命令行
    });
}

spiderPage('https://www.zwdai.com/');
