$(document).ready(function(){
    $.get('/getConfigData').done(function(result){
        console.log('result================',result);
        if(result.length>0){
            for (let i = 0; i < result.length; i++) {
                $('#Master_configurationData').append(
                    '<tr id="Master_configurationData_row">'+
                    '<td>'+result[i].ID+'</td>'+
                    '<td>'+result[i].NAME+'</td>'+
                    '</tr>'
                );
            }
        }
    });
});