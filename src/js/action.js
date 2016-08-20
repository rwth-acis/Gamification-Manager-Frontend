

 // global variables
var client, appId, notification;
    
function setAppIDContext(appId_){
  appId = appId_;
  //$('#app-id-text').html(appId);
  gadgets.window.setTitle("Gamification Manager Action - " + appId);

  actionModule.init();
}

var init = function() {
  var iwcCallback = function(intent) {
    console.log(intent);
    if(intent.action == "REFRESH_APPID"){
      
      setAppIDContext(intent.data);
      console.log(appId);
    }
    if(intent.action == "FETCH_APPID_CALLBACK"){
      var data = JSON.parse(intent.data);
      if(data.receiver == "action"){
        if(data.appId){
          setAppIDContext(data.appId);
        }
        else{
          miniMessageAlert(notification,"Application ID in Gamification Manager Application is not selected","danger")
        }
      }
    }
  };
  client = new Las2peerWidgetLibrary("<%= grunt.config('endPointServiceURL') %>", iwcCallback);
  notification = new gadgets.MiniMessage("GAMEACTION");

  $('button#refreshbutton').on('click', function() {
    sendIntentFetchAppId("action");
  });
}


function signinCallback(result) {
    if(result === "success"){
      memberId = oidc_userinfo.preferred_username;
        
        console.log(oidc_userinfo);
        init();

    } else {


        console.log(result);
        console.log(window.localStorage["access_token"]);

    }
}

var useAuthentication = function(rurl){
    if(rurl.indexOf("\?") > 0){ 
      rurl += "&access_token=" + window.localStorage["access_token"];
    } else {
      rurl += "?access_token=" + window.localStorage["access_token"];
    }
    return rurl;
  }

function sendIntentFetchAppId(sender){
  client.sendIntent(
    "FETCH_APPID",
    sender
  );
}

$(document).ready(function() {
  

});

var actionModule = (function() {
  
  var actionAccess;
  var modalSubmitButton;
  var modalInputId;
  var modalInputName;
  var modalInputDescription;
  var modalInputPointValue;
  var modalTitle;

  var modalNotifCheck;
  var modalNotifMessageInput;

  var actionCollection;

  var initialize = function(){

    actionAccess = new ActionDAO();
    modalSubmitButton = $("#modalactionsubmit");
    modalTitle = $("#modalactiondiv").find(".modal-title");
      modalInputId = $("#modalactiondiv").find("#action_id_name");
      modalInputName = $("#modalactiondiv").find("#action_name");
      modalInputDescription = $("#modalactiondiv").find("#action_desc");
      modalInputPointValue = $("#modalactiondiv").find("#action_point_value");
    modalNotifCheck = $("#modalactiondiv").find("#action_notification_check");
    modalNotifMessageInput = $("#modalactiondiv").find("#action_notification_message");
  };

  function renderActionTable(data){
    if(data.rows.length < 1){
        var newRow = "<tr class='text-center'><td colspan='8'>No data Found ! </td>";
        $("table#list_actions").find("tbody").append(newRow);
     }
     else{
        for(var i = 0; i < data.rows.length; i++){
          var action = data.rows[i];
          var newRow = "<tr><td class='text-center idclass'>" + action.id + "</td>";
          newRow += "<td class='text-center nameclass'>" + action.name + "</td>";
          newRow += "<td class='descclass'>" + action.description + "</td>";
          newRow += "<td class='text-center pointvalueclass'>" + action.pointValue + "</td>";
          newRow += "<td class='text-center usenotifclass''>" + action.useNotification + "</td>";
          newRow += "<td class='messageclass''>" + action.notificationMessage + "</td>";
          newRow += "<td class='text-center'>" + "<button type='button' class='btn btn-xs btn-warning updclass'>Edit</button></td> ";
          newRow += "<td class='text-center'>" +"<button type='button' class='btn btn-xs btn-danger delclass'>Delete</button></td>";
            
            $("table#list_actions").find("tbody").append(newRow);
        }
      }
  }

  var loadTable = function(){

    $("table#list_actions").find("tbody").empty();
    actionAccess.getActionsData(
      appId,
      notification,
      function(data,type){
        $("#modalactiondiv").modal('hide');
        actionCollection = data.rows;
        renderActionTable(data);

          $("table#list_actions").find(".updclass").on("click", function(event){
            if(actionCollection){

                var selectedRow =  $(event.target).parent().parent()[0];
                var selectedAction = actionCollection[selectedRow.rowIndex-1];

                $(modalSubmitButton).html('Update');
                $(modalTitle).html('Update an Action');
                $(modalInputId).val(selectedAction.id);
                $(modalInputId).prop('readonly', true);
                $(modalInputName).val(selectedAction.name);
                $(modalInputDescription).val(selectedAction.description);
                $(modalInputPointValue).val(selectedAction.pointValue);
                $(modalNotifCheck).prop('checked',selectedAction.useNotification);
                $(modalNotifMessageInput).val(selectedAction.notificationMessage);
                $(modalNotifMessageInput).prop('readonly',true);
                if(selectedAction.useNotification){
                  $(modalNotifMessageInput).prop('readonly',false);
                }
                $("#modalactiondiv").modal('toggle');
            }
        });

        $("table#list_actions").find(".delclass").on("click", function(event){
          var selectedRow =  $(event.target).parent().parent()[0];
            var selectedAction = actionCollection[selectedRow.rowIndex-1];

            actionAccess.deleteAction(
              notification,
              function(data,type){
                loadTable();
              },
              function(status,error){},
              selectedAction.id);
          });
        },
        function(status,error) {
          console.log(error);
        }
    );
  };

  var addNewButtonListener = function(){
    $("button#addnewaction").on('click', function(event) {
      $(modalSubmitButton).html('Submit');
      $(modalInputId).prop('readonly', false);
      $(modalInputId).val('');
      $(modalTitle).html('Add a New Action');
      $(modalInputName).val('');
      $(modalInputPointValue).val('');
      $(modalNotifCheck).prop('checked',false);
      $(modalNotifMessageInput).val('');
      $("#modalactiondiv").modal('toggle');
      
    });
  };

  var checkBoxListener = function(){
      // Check boxes in modal
  // check box for point flag
    $('input[type="checkbox"]#action_notification_check').click(function(){
          if($(this).prop("checked") == true){
              $(modalNotifMessageInput).prop('readonly', false);
          }
          else if($(this).prop("checked") == false){
              $(modalNotifMessageInput).prop('readonly', true);
          }
      });
  }

  var submitFormListener = function(){
    $("form#modalactionform").submit(function(e){
      //disable the default form submission
      e.preventDefault();
      var formData = new FormData($(this)[0]);

      var submitButtonText = $(modalSubmitButton).html();

      var actionId = $(modalInputId).val();

      if(submitButtonText=='Submit'){
        actionAccess.createNewAction(
          appId,
          formData, 
          notification, 
          function(data,type){
            $("#modalactiondiv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          actionId
        );
      }
      else{
        actionAccess.updateAction(
          appId,
          formData, 
          notification, 
          function(data,type){
            $("#modalactiondiv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          actionId
        );
      }
      
      return false;
    });
  };

  return {
    init : function(){
      initialize();
      loadTable();
      addNewButtonListener();
      checkBoxListener();
      submitFormListener();
    },
    loadTable:loadTable
  };


})();
