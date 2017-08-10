/**
 * Created by lailai on 2017/8/9.
 */

var index=0;
var str="适用浏览器：IE8、360、FireFox、Chrome、Safari、Opera、傲游、搜狗、世界之窗.";
var timer;
$(function(){
    timer=setInterval(show,200);
});
function show(){
    var strAra=str.split("");
    if(index==strAra.length){
        index=0;
        clearInterval(timer);
    }else{
        var content=str.substring(0,index++);
        $("#brower").html(content);
    }
}
