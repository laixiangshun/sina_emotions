/**
 * Created by lailai on 2017/8/9.
 */

//自定义Hashtable
function Hashtable(){
    this._hast=new Object();
    this.put=function(key,value){
        if(typeof(key) != "undefined"){
            if(this.containsKey(key)==false){
                this._hast[key]=typeof(value)=="undefined"?null:value;
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    };
    this.containsKey=function(key){
        return typeof(this._hast[key])!="undefined";
    };
    this.remove=function(key){
        delete this._hast[key];
    };
    this.size=function(){
        var i=0;
        for(var k in this._hast){
            i++;
        }
        return i;
    };
    this.get=function(key){
        return this._hast[key];
    };
    this.clear= function () {
        for(var k in this._hast){
            delete this._hast[k];
        }
    }
}
var emotions = new Array();
var categorys = new Array();// 分组
var uSinaEmotionsHt=new Hashtable();
//初始化缓存，页面仅仅加载一次
$(function(){
    $.ajax({
        dataType: "json",
        url: "../json/jquery.sinaEmotion.json",
        success: function(response){
            var data=response.data;
            for(var i in data){
                if(data[i].category==""){
                    data[i].category="默认";
                }
                if(emotions[data[i].category]==undefined){
                    emotions[data[i].category]=new Array();
                    categorys.push(data[i].category);
                }
                emotions[data[i].category].push({
                    name: data[i].phrase,
                    icon: data[i].icon
                });
                uSinaEmotionsHt.put(data[i].phrase,data[i].icon);//自定义的hashtable用来存储表情，key-phrase,value=icon,图片路径
            }
        }
    });
});

//自定义表情显示函数
(function($){
    $.fn.SinaEmotion=function(target){
        var cat_current;
        var cat_page;
        $(this).click(function(event){
           event.stopPropagation();

            var eTop=target.offset().top+target.height()+30;
            var eLeft=target.offset().left-1;
            //已经加载过，直接加载
            if($("#emotions .categorys")[0]){
                $("#emotions").css({top:eTop,left: eLeft});
                $("#emotions").toggle();
                return;
            }
            //第一次加载
            $("body").append("<div id='emotions'></div>");
            $("#emotions").css({
                top: eTop,
                left: eLeft
            });
            $("#emotions").html("<div>正在加载中,请稍后......</div>");
            $("#emotions").click(function(event){
                event.stopPropagation();
            });
           $("#emotions").html("<div style='float: right'>"+
                   "<a href='javascript:void(0);' id='prev'>&laquo;</a>"+
                   "<a href='javascript:void(0);' id='next'>&raquo;</a>"+
                   "</div>"+
                   "<div class='categorys'></div>"+
                   "<div class='containersina'></div>"+
                   "<div class='page'></div>"
           ) ;
            $("#emotions #prev").click(function(){
                showCategorys(cat_page-1);
            });
            $("#emotions #next").click(function(){
                showCategorys(cat_page+1);
            });
            showCategorys();
            showEmotions();
        });
        $("body").click(function(){
            $("#emotions").remove();
        });
        $.fn.insertText=function(text){
            this.each(function(){
               if(this.tagName !=='INPUT' && this.tagName!=='TEXTAREA'){
                   return;
               }
                if(document.selection){
                    this.focus();
                    var cr=document.selection.createRange();
                    cr.text=text;
                    cr.collapse();
                    cr.select();
                }else if(this.selectionStart || this.selectionStart=='0'){
                    var start=this.selectionStart,end=this.selectionEnd;
                   // this.value=this.value.substring(0,start)+text+this.value.substring(end,this.value.length);
                    this.value=this.value.substring(0,start)+text;
                    this.selectionStart=this.selectionEnd=start+text.length;
                }else{
                    this.value+=text;
                }
            });
            return this;
        };
        //显示分类
        function showCategorys() {
            var page = arguments[0] ? arguments[0] : 0;
            if (page < 0 || page >= categorys.length / 5) {
                return;
            }
            $("#emotions .categorys").html("");
            cat_page = page;
            for (var i = page * 5; i < (page + 1) * 5 && i < categorys.length; ++i) {
                $("#emotions .categorys").append($("<a href='javascipt:void(0);'>" + categorys[i] + "</a>"));
            }
            $("#emotions .categorys a").click(function () {
                showEmotions($(this).text());
            });
            $("#emotions .categorys a").each(function () {
                if ($(this).text() == cat_current) {
                    $(this).addClass("current");
                }
            });
        }
          //显示表情
            function showEmotions(){
                var category=arguments[0]?arguments[0]:"默认";
                var page=arguments[1]?arguments[1]-1:0;
                $("#emotions .containersina").html("");
                $("#emotions .page").html("");
                cat_current=category;
                for(var i=page*72;i<(page+1)*72&&i<emotions[category].length;++i){
                    $("#emotions .containersina").append($("<a href='javascript:void(0);' " +
                        "title='"+emotions[category][i].name+"'>"+"<img src='"+emotions[category][i].icon+"' " +
                        "alt='"+emotions[category][i].name+"' width='22px' height='22px'/>"+"</a>"));
                }
                $("#emotions .containersina a").click(function(){
                      target.insertText($(this).attr('title'));//把点击的表情phrase添加到target标签中显示
                    $("#emotions").remove();
                });
               for(var i=1;i<emotions[category].length/72+1;++i){
                   $("#emotions .page").append($("<a href='javascript:void(0);' "+(i==page+1?'class="current"':'')+">"+i+"</a>"));
               }
                $("#emotions .page a").click(function(){
                    showEmotions(category,$(this).text());
                });
                $("#emotions .categorys a.current").removeClass('current');
                $("#emotions .categorys a").each(function(){
                    if($(this).text()==category){
                        $(this).addClass('current');
                    }
                });
        }
    }
})(jQuery);

//解析表情
function AnalyticEmotion(s){
    if(typeof(s)!="undefined"){
        var sArr= s.match(/\[.*?\]/g);
        if(null ==sArr){
            return s;
        }
        for(var i=0;i<sArr.length;i++){
            if(uSinaEmotionsHt.containsKey(sArr[i])){
                var reStr="<img src='"+uSinaEmotionsHt.get(sArr[i])+"' height='22px' width='22px'/>";
                s= s.replace(sArr[i],reStr);
            }
        }
    }
    return s;
}