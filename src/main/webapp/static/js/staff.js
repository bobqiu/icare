﻿var staff={
    method:'',
    sid:'',
    drawStaffList:function(){
        $("#staff-dialog-form").dialog("close");
        $(".inf").addClass('hide');
	    $("#staffshow").removeClass('hide');
	    $('#staffpage').datagrid({ 
            title:'员工信息列表', 
            iconCls:'icon-edit',//图标 
            fit:true,
            nowrap: false, 
            loadMsg:"正在加载，请稍等...", 
            striped: true, 
            border: true, 
            collapsible:false,//是否可折叠的 
            url:'/gero/1/staff',  
            method:'get',
            remoteSort:false,  
            singleSelect:true,//是否单选 
            pagination:true,//分页控件 
            rownumbers:true,//行号  
            pageNumber:1,
            pagePosition:'bottom',
            pageSize: 10,//每页显示的记录条数，默认为20 
            pageList: [10,20,30],//可以设置每页记录条数的列表 
            loadFilter:function(data){
        	    var result={"total":0,"rows":0};
                result.total=data.total;
                result.rows=data.entities[0];
                for (var i in result.rows) result.rows[i].gender=sex[result.rows[i].gender];
                return result;
            },
            toolbar: [{ 
                text: '添加', 
                iconCls: 'icon-add', 
                handler: function() { 
                     staff.addStaffInfo();
                } 
            }, '-',{ 
                text: '删除', 
                iconCls: 'icon-remove', 
                handler: function(){ 
                    staff.delStaffInfo(); 
                }
            }]
        }); 
	    var pager = $('#staffpage').datagrid('getPager');	// get the pager of datagrid
		pager.pagination({
        	displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录', 
        /*onBeforeRefresh:function(){
            $(this).pagination('loading');
            alert('before refresh');
            $(this).pagination('loaded');
        }*/ 
		});
    },

     drawStaffInfo: function(data){
        staff.sid="/"+data.id;
        $("#staff-dialog-form").dialog("open");
        $("#staff-dialog-form").dialog("center");
        $('#staff-Info-card-a input').attr('disabled','disabled');
        $('#sname').attr('value',data.name);
        $('#semail').attr('value',data.email);
        $('#srole_list').attr('value',data.role_list);
        $('#sbirthday').attr('value',data.birthday);
        $('#sgender').attr('value',sex[data.gender]);
        $('#shousehold_address').attr('value',data.household_address);
        $('#snssf_id').attr('value',data.nssf_id);
        $('#sarchive_id').attr('value',data.archive_id);
        $('#sresidence_address').attr('value',data.residence_address);
        $('#sidentity_no').attr('value',data.identity_no);
        $('#sphone').attr('value',data.phone);
        if(data.photo_url!==undefined) $('#staff-Info-card-b img').attr("src",data.photo_url).attr("width","178px").attr("height","220px");
        else $('#staff-Info-card-b img').attr("src","/images/p_2.jpg").attr("width","178px").attr("height","220px");
    },

    addStaffInfo: function(){
        staff.sid="";
        staff.method='post';
        $("#staff-dialog-form").dialog("open");
        $("#staff-dialog-form").dialog("center");
        $('#staff-Info-card-a input').attr('value'," ").removeAttr('disabled','');
        $('#staff-Info-card-b img').attr("src","/images/p_2.jpg").attr("width","178px").attr("height","220px");
    },

    editStaffInfo: function(){
        staff.method='put';
        $("#staff-dialog-form").dialog("open");
        $("#staff-dialog-form").dialog("center");
        $('#staff-Info-card-a input').removeAttr('disabled','');
    },
    delStaffInfo: function(){
        var stafft = $('#staffpage').datagrid('getSelected');
        var infoUrl="gero/1/staff/" + stafft.id;
        $.ajax({
            url: infoUrl,
            type: 'DELETE',
            success:function(){
                staff.drawstaffList();
            }
        })

    },


    onStaffDblClickRow:function(index){
                var stafft = $('#staffpage').datagrid('getSelected');
                infoUrl="gero/1/staff/" + stafft.id;
                $.ajax({
                    type: "get",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    url: infoUrl,
                    success: function (msg) {
                        var data=leftTop.dealdata(msg);
                        staff.drawStaffInfo(data);
                    },
                    error: function(e) {
                        alert(e);
                    }
                });
    },

    buttonclk:function(){
        var obj={
            name:document.getElementById("sname").value,
            gender:sexc[document.getElementById("sgender").value],
            household_address:document.getElementById("shousehold_address").value,
            identity_no:document.getElementById("sidentity_no").value,
            nssf_id:document.getElementById("snssf_id").value,
            archive_id:document.getElementById("sarchive_id").value,
            email:document.getElementById("semail").value,
            phone:document.getElementById("sphone").value,
            role_list:document.getElementById("srole_list").value,
            birthday:document.getElementById("sbirthday").value,
            residence_address:document.getElementById("sresidence_address").value,
        }
        var infoUrl='/gero/1/staff'+staff.sid;
        $.ajax({
            url: infoUrl, 
            type: staff.method, 
            data:obj, 
            dataType: 'json', 
            timeout: 1000, 
            error: function(){alert('Error');}, 
            success: function(result){staff.drawStaffList();} 
        }); 
    }
}