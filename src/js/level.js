
 // global variables
var client, appId, notification;
    
function setAppIDContext(appId_){
  appId = appId_;
  //$('#app-id-text').html(appId);
  gadgets.window.setTitle("Gamification Manager Level - " + appId);

  levelModule.init();
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
      if(data.receiver == "level"){
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
  notification = new gadgets.MiniMessage("GAMELEVEL");

  $('button#refreshbutton').on('click', function() {
    sendIntentFetchAppId("level");
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


var levelModule = (function() {
  
  var levelAccess;
  var modalInputId;
  var modalInputName;
  var modalInputPointValue;
  var modalSubmitButton;
  var modalTitle;
  var maxlevel;

  var modalNotifCheck;
  var modalNotifMessageInput;
  var levelCollection;

  var initialize = function(){

    levelAccess = new LevelDAO();
    modalSubmitButton = $("#modallevelsubmit");
    modalInputId = $("#modalleveldiv").find("#level_num");
    modalTitle = $("#modalleveldiv").find(".modal-title");
    modalInputName = $("#modalleveldiv").find("#level_name");
      modalInputPointValue = $("#modalleveldiv").find("#level_point_value");
    modalNotifCheck = $("#modalleveldiv").find("#level_notification_check");
    modalNotifMessageInput = $("#modalleveldiv").find("#level_notification_message");
  };

  function renderLevelTable(data){
    console.log(data);
     if(data.rows.length < 1){
        var newRow = "<tr class='text-center'><td colspan='6'>No data Found ! </td>";
        $("table#list_levels").find("tbody").append(newRow);
     }
     else{
       for(var i = 0; i < data.rows.length; i++){
            var level = data.rows[i];

            var newRow = "<tr><td class='text-center numclass'>" + level.number + "</td>";
            newRow += "<td class='text-center nameclass'>" + level.name + "</td>";
            newRow += "<td class='pointvalueclass'>" + level.pointValue + "</td>";
            newRow += "<td class='text-center usenotifclass''>" + level.useNotification + "</td>";
            newRow += "<td class='messageclass''>" + level.notificationMessage + "</td>";
            newRow += "<td class='text-center'>" + "<button type='button' class='btn btn-xs btn-warning updclass'>Edit</button> ";
            
            if(i == data.rows.length-1){
              newRow += "<button type='button' class='btn btn-xs btn-danger delclass'>Delete</button>";
            }
            newRow += "</td>";

            $("table#list_levels").find("tbody").append(newRow);
          }
      }
  }

  var loadTable = function(){

    $("table#list_levels").find("tbody").empty();
    levelAccess.getLevelsData(
      appId,
      notification,
      function(data,type){
        $("#modalleveldiv").modal('hide');
        levelCollection = data.rows;
        renderLevelTable(data);

          $("table#list_levels").find(".updclass").on("click", function(event){
            if(levelCollection){

              var selectedRow =  $(event.target).parent().parent()[0];
              var selectedLevel = levelCollection[selectedRow.rowIndex-1];

              $(modalSubmitButton).html('Update');
              $(modalTitle).html('Update an Level');
              $(modalInputId).val(selectedLevel.number);
              $(modalInputId).prop('readonly', true);
              $(modalInputName).val(selectedLevel.name);
              $(modalInputPointValue).val(selectedLevel.pointValue);
              $(modalNotifCheck).prop('checked',selectedLevel.useNotification);
              $(modalNotifMessageInput).val(selectedLevel.notificationMessage);
              $(modalNotifMessageInput).prop('readonly',true);
              if(selectedLevel.useNotification){
                $(modalNotifMessageInput).prop('readonly',false);
              }
            
              $("#modalleveldiv").modal('toggle');
          }
        });

        $("table#list_levels").find(".delclass").on("click", function(event){
          var selectedRow =  $(event.target).parent().parent()[0];
          var selectedLevel = levelCollection[selectedRow.rowIndex-1];

          levelAccess.deleteLevel(
            appId,
            notification,
            function(data,type){
              loadTable();
            },
            function(status,error){},
            selectedLevel.number
          );
          });
        },
        function(status,error) {
          console.log(error);
        }
    );
  };

  var addNewButtonListener = function(){
    $("button#addnewlevel").on('click', function(event) {
        // count number of rows so the number can be incremented
      var levelindex = $("table#list_levels").find("tr").length;
      console.log($("table#list_levels").find("tr"));
        // Adapt Modal with add form
      $(modalSubmitButton).html('Submit');
      $(modalInputId).prop('readonly', true);
      $(modalInputId).val(levelindex);
      $(modalTitle).html('Add a New Level');
      $(modalInputName).val('');
      $(modalInputPointValue).val('');
      $(modalNotifCheck).prop('checked',false);
      $(modalNotifMessageInput).val('');
      $("#modalleveldiv").modal('toggle');
      
    });
  };

  var checkBoxListener = function(){
      // Check boxes in modal
  // check box for point flag
    $('input[type="checkbox"]#level_notification_check').click(function(){
          if($(this).prop("checked") == true){
              $(modalNotifMessageInput).prop('readonly', false);
          }
          else if($(this).prop("checked") == false){
              $(modalNotifMessageInput).prop('readonly', true);
          }
      });
  };

  var submitFormListener = function(){
    $("form#modallevelform").submit(function(e){
      //disable the default form submission
      e.preventDefault();
      var formData = new FormData($(this)[0]);

      var submitButtonText = $(modalSubmitButton).html();

      var levelnum = $(modalInputId).val();

      if(submitButtonText=='Submit'){
        levelAccess.createNewLevel(
          appId,
          formData, 
          notification, 
          function(data,type){
            $("#modalleveldiv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          levelnum
        );
      }
      else{
        levelAccess.updateLevel(
          appId,
          formData, 
          notification, 
          function(data,type){
            $("#modalleveldiv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          levelnum
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

