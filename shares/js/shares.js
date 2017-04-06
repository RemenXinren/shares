var times;
var sum = [];
var stockData;
var $queryBtn;
var $pro;

// 数据填入
function update() {
	    for (var i = 0; i < sum.length; i++){
	        $($("tr")[i+1]).children("td").eq(1).text(stockData[sum[i]].symbol);
	        $($("tr")[i+1]).children("td").eq(2).text(stockData[sum[i]].name);
	        $($("tr")[i+1]).children("td").eq(3).text(stockData[sum[i]].high);
	        $($("tr")[i+1]).children("td").eq(4).text(stockData[sum[i]].low);
	        $($("tr")[i+1]).children("td").eq(5).text(stockData[sum[i]].price);
            $($("tr")[i+1]).children("td").eq(6).text(stockData[sum[i]].update);
            if(stockData[sum[i]].price > stockData[sum[i]].open){
                $($("tr")[i+1]).children("td").eq(5).css('color','red');
            }else if(stockData[sum[i]].price < stockData[sum[i]].open){
                $($("tr")[i+1]).children("td").eq(5).css('color','green');
            }
	    }
   }
// 数据获取
function refreshPrice(data) {
	stockData = data;
    update();
}
// 数据检测
function dataCheck(data){
	if(!data[$stockCode]){
        $pro.text('无此股票代码!');
        $('tr').css('background-color','#fff');
	}else{
		if(sum.join(',').match($stockCode) == null){
        	sum.push($stockCode);
            var qwe = $("<tr><td><input type='checkbox' name='checked'></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
            $queryBtn.next().children().children().last().after(qwe);
            dataAdd();
            $pro.text('');
            renovate();
            $('tr').css('background-color','#fff');
	        } else {
            $pro.text('添加过此股票代码!');
            $('tr').css('background-color','#fff');
            var m = sum.indexOf($stockCode) + 1;
            $('tr').eq(m).css('background-color','#5bbdff');
            renovate();
	        }
	} 
}
// 请求数据
function dataAdd(){
	var dataAdd = "http://api.money.126.net/data/feed/" + (sum.join(',')) + "?callback=refreshPrice";
    var dataScript = $("<script id='data' src =" + dataAdd + "><script/>");
    $queryBtn.next().after(dataScript);
    $('#data').remove();
}
// 刷新
function renovate(){
        times = setInterval(function() {
            dataAdd();
        }, 3000);
}

$(document).ready(function () {
    $queryBtn = $('#queryBtn');
    $pro = $('.promptBox');
    var $stockTxtBox = $queryBtn.prev()
    var SortFrequency = 0;
// 添加数据
    function shareAdd() {
        $stockText = $queryBtn.prev().val();
        $stockCode = '0'+$stockText;
        var dataCheck = "http://api.money.126.net/data/feed/" + $stockCode + "?callback=dataCheck";
	    var checkScript = $("<script id='check' src =" + dataCheck + "><script/>");
        $queryBtn.next().after(checkScript);
	    $('#check').remove();        
    }
// 查询
    $queryBtn.click(function () {
        shareAdd();
        clearInterval(times);
    });

// 全选
	$("#allChoose").bind("click", function () {
        $('table input').each(function(){
            $(this).prop("checked",true);
        });
    });

// 排序
	$('.sorting').click(function () {
        SortFrequency++;
	    var c;
        $('tr').css('background-color','#fff');
	    if (SortFrequency%2 == 1 ){
            for (var i = 0 ; i < sum.length ; i++ ){
                for (var j = 0 ; j < sum.length ; j++ ){
                    if( stockData[sum[i]].price > stockData[sum[j]].price){
                        c = sum[i];
                        sum[i] = sum[j];
                        sum[j] = c ;
                    }
                }
            }
        }else {
            for (var i = 0 ; i < sum.length ; i++ ){
                for (var j = 0 ; j < sum.length ; j++ ){
                    if( stockData[sum[i]].price < stockData[sum[j]].price){
                        c = sum[i];
                        sum[i] = sum[j];
                        sum[j] = c ;
                    }
                }
            }
        }
        update();
    });

// 删除
	$("#deleteBtn").bind("click", function () {
        $('table input').each(function () {
            if ($(this).is(":checked")) {
                $(this).parent().parent().remove();               
                var a = '0' + ($(this).parent().next().text());
                var b = sum.indexOf(a);
               	sum.splice(b,1);
            }
        });
        $pro.text('');
        clearInterval(times);
        if (sum[0]){
            renovate();
        }
    });
// keyUp
    $stockTxtBox.keyup(function () {
        $pro.text('');
    })
});










