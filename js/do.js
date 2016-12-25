var TextAreaTab = 
{ 
   Register : function(obj) 
   { 
       // 绑定事件 
       obj.onclick = new Function('TextAreaTab.CreateInsertPosition(this)'); 
       obj.onselect = new Function('TextAreaTab.CreateInsertPosition(this)'); 
       obj.onkeyup = new Function('TextAreaTab.CreateInsertPosition(this)'); 
       obj.onkeydown = new Function('TextAreaTab.InsertTab(this)'); 
   }, 
   // 这个只对ie有用 
   // 创建光标所在位置的对象，就是要插入的位置。 
   // 其实就是光标选中的对象，对它进行操作就可以了。 
   CreateInsertPosition : function(obj) 
   { 
       if (obj.createTextRange) // IE 
       { 
           obj.InsertPosition = document.selection.createRange().duplicate(); // 光标选中的对象 
       } 
   }, 
   InsertTab : function(obj) 
   { 
       var evt = this.GetEvent(); // 返回 event 对象 
       if (evt.keyCode == 9) // 按下了Tab键 
       { 
           if (obj.createTextRange && obj.InsertPosition) // IE 
           { 
               // 赋予对象内容 
               obj.InsertPosition.text = '\t'; 
               evt.returnValue = false; 
           } 
           else if (window.getSelection) // FF 
           { 
               var scrollTop = obj.scrollTop; // 滚动的位置 
               var start = obj.selectionStart; // 当前光标所在位置 

               var pre = obj.value.substr(0, obj.selectionStart); // 光标之前的内容 
               var next = obj.value.substr(obj.selectionEnd); // 光标之后的内容 
               obj.value = pre + '\t' + next; 

               evt.preventDefault(); 
               // 设置光标在插入点之后的位置 
               obj.selectionStart = start + 1; 
               obj.selectionEnd = start + 1; 
               obj.scrollTop = scrollTop; 
           } 
       } 
   }, 
   // 返回 event 对象 
   GetEvent : function() 
   { 
       if(document.all) // IE 
       { 
           return window.event; 
       } 

       func = this.GetEvent.caller; 
       while(func != null) 
       { 
           var arg0 = func.arguments[0]; 
           if(arg0) 
           { 
               if((arg0.constructor == Event || arg0.constructor == MouseEvent) 
                   ||(typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) 
               { 
                   return arg0; 
               } 
           } 
           func = func.caller; 
       } 
       return null; 
   } 
} 

$(document).ready(function (ev) {
    var textarea = document.getElementById('code'); 
	TextAreaTab.Register(textarea); // 注册一下对象，就可以让这个对象现实Tab功能 

    document.body.addEventListener("click", function(ev){
        var target = ev.target;
        if(target.id == "preview"){
            var lang = $("#lang").val();
            var code = $("#code").val().replace(/\t/g, "  ");
            var width = $("#width").val();
            $("#view").attr("class", lang);
            $("#view").text(code);
            $("#view").css("min-width", width);
            hljs.highlightBlock(document.getElementById("view"));
            $(".hljs").each(function(){ 
                this.style.color = $(this).css("color"); 
                this.style.fontWeight = $(this).css("font-weight"); 
                $(this).find("[class*='hljs']").each(function(){ 
                    this.style.color = $(this).css("color"); 
                    this.style.fontWeight = $(this).css("font-weight"); 
                }) 
            });
            $(".hljs").each(function(){
                $(this).html($(this).html().replace(/\n/g, "<br/>"));
            });
        }

        if(target.id == "copy")
        {
            $("#code").val($("#result").html().trim());
            var myelement = document.getElementById('code');
            var range = document.createRange();
            range.selectNode(myelement);
            window.getSelection().addRange(range);
        }
    });
});

