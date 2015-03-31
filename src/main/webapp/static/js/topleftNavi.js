//删除$("#topNavi").children().filter('li').remove();
var toptree=[];
var lefttree=[];
var righttemp;
var temptree;
var temptree2;
var hrefTable=[];
var sex=["男","女"];
var sexc=[];
var Searchdate = new Date();
var Sundate = new Date();
var Mondate = new Date();
var Tuedate = new Date();
var Weddate = new Date();
var Thudate = new Date();
var Fridate = new Date();
var Satdate = new Date();
var weekstr=[];
var isFirst1=true;
var isFirst2=true;
var todayms=Sundate.getTime();
var temparea;
var temparea2;
// var gid=$.cookie('gid');
// var uid=$.cookie('uid');
var gid=getUser().gero_id;
var uid=getUser().id;
Sundate.setTime(Sundate.getTime()-Sundate.getDay()*24*60*60*1000);
sexc["男"]=0;
sexc["女"]=1;
hrefTable['/gero/1/elder']='elder.drawElderList()';
hrefTable['/gero/1/staff']='staff.drawStaffList()';
hrefTable['/gero/1/schedule']='staff.drawScheduleList()';
hrefTable['/item']='item.drawItemList()';
hrefTable['/gero/1/care_item']='geroItem.drawGeroCareItemList()';
hrefTable['/gero/1/area_item']='geroItem.drawGeroAreaItemList()';
hrefTable['/gero/1/role']='role.drawGeroRoleList()';
hrefTable['/user/1']='authority.drawAuthorityList()';
hrefTable['/gero/1/schedule']='arrange.drawArrangeList()';
hrefTable['/area']='area.drawAreaList()';
hrefTable['/eldercareduty']='eldercare.drawElderCareList()';
hrefTable['/areacareduty']='area.drawAreaList()';

var leftTop = {
    removeLefttree:function (){
     $("#lefttree li").remove();
    },
    
    dealdata:function(msg){
    if(msg.status===200)
        {
            return msg.entities;
        }
    else{
        leftTop.dealerr(msg);
    }
    },
    dealerr:function(e){
        $.messager.show({
                title:'错误提示',
                msg:e.status+e.error,
                showType:'fade',
                style:{
                    right:'',
                    bottom:''
                }
            });
    },
    dealerror:function(XMLHttpRequest, textStatus, errorThrown){
        $.messager.show({
                title:'错误提示',
                msg:textStatus+XMLHttpRequest.status+errorThrown,
                showType:'fade',
                style:{
                    right:'',
                    bottom:''
                }
            });
    },

    findTreeChildrenEx:function(id){
        var result=[];
        for(var i in temptree){
            if(temptree[i].parent_id===id && temptree[i].href!=='no'){
                result.push(temptree[i]);
            }
        }
        return result;
    },
    findTreeChildren:function(id){
        var result=[];
        for(var i in temptree){
            if(temptree[i].parent_id===id){
                result.push(temptree[i]);
            }
        }
        return result;
    },

    createTreeNode:function(node){
        this.id=node.id;
        this.text=node.name;
        this.children=[];
        this.attributes={"href":node.href,"permission":node.permission,"notes":node.notes,'api':node.api}
        this.iconCls=node.icon;
    },

    createTreeData:function(node){
        var result=[];
        var childs= leftTop.findTreeChildrenEx(node.id);
        if (childs.length!==0){
            for(var i in childs){
                var temp= new leftTop.createTreeNode(childs[i]);
                if (leftTop.findTreeChildrenEx(childs[i].id).length!==0){
                    temp.children=leftTop.createTreeData(childs[i]);
                    result.push(temp);
                }
                else if(childs[i].href!=="")
                {
                    result.push(temp);
                }
            }
        }
        return result;
    },

    createTreeData2:function(node){
        var result=[];
        var childs= leftTop.findTreeChildren(node.id);
        if (childs.length!==0){
            for(var i in childs){
                var temp= new leftTop.createTreeNode(childs[i]);
                if (leftTop.findTreeChildren(childs[i].id).length!==0){
                    temp.children=leftTop.createTreeData2(childs[i]);
                }
                result.push(temp);
            }
        }
        return result;
    },

    dealtree:function(msg){
        toptree = leftTop.findTreeChildren(1);
        for(var i in toptree){
            $("#topNavi").append('<li class="navli-a" ><a href="#">'+toptree[i].name+'<a></li>');
        }
        temptree2=[{"id":1,"text":"权限列表","children":[]}]
        temptree2[0].children=leftTop.createTreeData2(temptree2[0]);
        return leftTop.createTreeData(toptree[0]);
    },

    findTopNode:function(name){
        for(var i in toptree){
            if (toptree[i].name===name){
                return toptree[i];
            }
        }
    },

    findNode:function(id){
        for(var i in temptree){
            if (temptree[i].id===id){
                return temptree[i];
            }
        }
    }
};

//初始化运行所有js的地方
$(function(){
    $("#lefttree").tree({
        onClick:function(node){
            var url=leftTop.findNode(node.id).href;
            if (url!==""){              
                eval(hrefTable[url]);
                //authority.drawAuthorityList()
            }
        }
    })
    $.ajax({
        type: "get",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url:rhurl.origin+"/user/"+uid,
        timeout:1000,
        success: function (msg) {
            temptree=msg.entities[0].privilege_list;
            leftTop.removeLefttree;
            var str=leftTop.dealtree(temptree);
            $("#lefttree").tree("loadData",str);
            $("#welcome").text("欢迎"+msg.entities[0].username+"登录resthouse系统");
            document.getElementById('uusername').setAttribute('value',msg.entities[0].username);
            document.getElementById('uname').setAttribute('value',msg.entities[0].name);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    $.ajax({
        type: "get",
        data:{page:1,rows:65535,sort:'ID'},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url:rhurl.origin+'/gero/'+gid+'/role',
        timeout:1000,
        success: function (msg) {
            var parent=document.getElementById("arrange_role");
            for(var i in msg.entities){
                var dt=document.createElement('option');
                dt.setAttribute('value',msg.entities[i].name);
                dt.innerHTML=msg.entities[i].name;
                parent.appendChild(dt);
            }
            var parent=document.getElementById("role-check");
            for(var i in msg.entities){
                var li=document.createElement('li');
                li.innerHTML="<input type='checkbox' class='checkrole' disabled=true id='chkrole"+msg.entities[i].id+"' rid='"+msg.entities[i].id+"'>"+msg.entities[i].name+"</input>";
                parent.appendChild(li);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    $('#button-allow').toggleClass("fc-state-default1");

});

$('.navli-a').live('click',function(){
    var str=leftTop.createTreeData(leftTop.findTopNode($(this).text()));
    $("#lefttree").tree("loadData",str);
});

$(".arrange-work").live('click',function(){
    if(arrange.allow){
        $(this).toggleClass("workday");
        if ($(this).hasClass("workday")){
            arrange.addsubres(parseInt($(this).attr("pid")),$(this).attr("num"));
        }else{
            arrange.delsubres(parseInt($(this).attr("pid")),$(this).attr("num"));
        }
    }
})
$('.fc-prev-button').live('click',function(){arrange.prev()});
$('.fc-next-button').live('click',function(){arrange.next()});
$('.fc-today-button').live('click',function(){arrange.today()});
$('.fc-allow-button').live('click',function(){arrange.allowchange()});
$('.fc-submit-button').live('click',function(){arrange.putarrange()});