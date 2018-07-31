var webpage = require('webpage');
var page = webpage.create();
page.open('https://www.sme.vip/', function (status) {
    var data;
    if (status === 'fail') {
        console.log('open page fail!');
    } else {
        // console.log(page.content);//打印出HTML内容
        page.render('pic/sme_example.png');//生成HTML页面图片
    }
    page.close();//关闭网页
    phantom.exit();//退出phantomjs命令行
});