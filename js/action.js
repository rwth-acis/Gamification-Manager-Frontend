

 // global variables
var client, gameId,memberId, notification, actionAccess;
var oidc_userinfo;
var iwcCallback;
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

 var modalSubmitButton;
    var modalTitle;
     var modalInputId;
      var modalInputName;
      var modalInputDescription;
      var modalInputPointValue;
    var modalNotifCheck;
    var modalNotifMessageInput;


function setGameIDContext(gameId_){
  gameId = gameId_;
  //$('#game-id-text').html(gameId);
  if(gameId){
    //gadgets.window.setTitle("Gamification Manager Action - " + gameId);
    if(gameId == ""){
      resetContent()
    }
    else{
      initContent();
    }
  }


}

var initIWC = function(){

  notification = new gadgets.MiniMessage("GAMEACTION");

  iwcCallback = function(intent) {
    console.log(intent);
    if(intent.action == "REFRESH_APPID"){
      setGameIDContext(intent.data);
      console.log(gameId);
    }
    if(intent.action == "FETCH_APPID_CALLBACK"){
      notification.dismissMessage();
      var data = JSON.parse(intent.data);
      if(data.status == 200){
        oidc_userinfo = data.member;
        loggedIn(oidc_userinfo.preferred_username);
        if(data.receiver == "action"){
          if(data.gameId){
            setGameIDContext(data.gameId);
          }
          else{
            miniMessageAlert(notification,"Game ID in Gamification Manager Game is not selected","danger")
            resetContent();
          }
        }
      }
      else if(data.status == 401){
            resetContent();
      }

    }
    if(intent.action == "LOGIN"){
      var data = JSON.parse(intent.data);
      if(data.status == 200){
        oidc_userinfo = data.member;
        loggedIn(oidc_userinfo.preferred_username);

      }
      else if(data.status == 401){
            resetContent();
      }
    }
    // if(intent.action == "FETCH_LOGIN_CALLBACK"){
    //   var data = JSON.parse(intent.data);
    //   if(data.receiver == "action"){
    //     if(data.status == 200){
    //       oidc_userinfo = data.member;
    //         loggedIn(oidc_userinfo.preferred_username);
    //     }
    //   }
    // }
  };
  loadLas2peerWidgetLibrary();
  // $('button#refreshbutton').on('click', function() {
  //     sendIntentFetchLogin("action");
  // });

  // Init modal element
    modalSubmitButton = $("#modalactionsubmit");
     modalTitle = $("#modalactiondiv").find(".modal-title");
      modalInputId = $("#modalactiondiv").find("#action_id_name");
       modalInputName = $("#modalactiondiv").find("#action_name");
       modalInputDescription = $("#modalactiondiv").find("#action_desc");
       modalInputPointValue = $("#modalactiondiv").find("#action_point_value");
     modalNotifCheck = $("#modalactiondiv").find("#action_notification_check");
     modalNotifMessageInput = $("#modalactiondiv").find("#action_notification_message");
};

var loadLas2peerWidgetLibrary = function(){
  try{
    client = new Las2peerWidgetLibrary("http://gaudi.informatik.rwth-aachen.de:8086/", iwcCallback);
  }
  catch(e){
    var msg =notification.createDismissibleMessage("Error loading Las2peerWidgetLibrary. Try refresh the page !." + e);
    msg.style.backgroundColor = "red";
    msg.style.color = "white";
  }
};

var loggedIn = function(mId){
  memberId = mId;
  init();
  $("#login-alert h5").before("<h5>Welcome " + memberId + " !");
};

var init = function() {
};

var initContent = function(){

  actionAccess = new ActionDAO();
  var contentTemplate = _.template($("#content-template").html());
  var contentElmt = $(".content-wrapper");
  contentElmt.html(contentTemplate);


  $("h6#title-widget").text(gameId);
  
  loadContent();



  $('#contentModal').off();
  $('#contentModal').on('show.bs.modal', function (event) {
    console.log($(this));
    var button = $(event.relatedTarget) // Button that triggered the modal
    var actionid = button.data('actionid') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

    var index = _.map(actionCollection,function(e) { return e.id; }).indexOf(actionid);
    var modal = $(this)
    modal.find('.card-header').html("<i class=\"fa fa-tag\" aria-hidden=\"true\"></i> "+actionCollection[index].id+"<span class=\"tag tag-pill tag-success pull-xs-right\">"+actionCollection[index].pointValue+"</span>")
    modal.find('h4.card-title').text(actionCollection[index].name)
      modal.find('p.desc').html("<i class=\"fa fa-align-justify\"></i> "+actionCollection[index].description)
    
    if(actionCollection[index].useNotification){
      modal.find('p.msg').addClass("text-success");
      modal.find('p.msg').removeClass("text-danger");
    }else{
      modal.find('p.msg').addClass("text-danger");
      modal.find('p.msg').removeClass("text-success");
    }
      modal.find('p.msg').html("<i class=\"fa fa-comment-o\"></i> "+actionCollection[index].notificationMessage)
    modal.find('.bedit').attr("onclick","editButtonListener(\""+actionid+"\")")
    modal.find('.bdelete').attr("onclick","deleteButtonListener(\""+actionid+"\")")
    modal.find('button').attr("data-actionid",actionid)
  })
  submitFormListener();
  checkBoxListener();
}


// function signinCallback(result) {
//     if(result === "success"){
//       memberId = oidc_userinfo.preferred_username;
//
//         console.log(oidc_userinfo);
//         init();
//
//     } else {
//
//
//         console.log(result);
//         console.log(window.localStorage["access_token"]);
//
//     }
// }

var useAuthentication = function(rurl){
    if(rurl.indexOf("\?") > 0){
      rurl += "&access_token=" + window.localStorage["access_token"];
    } else {
      rurl += "?access_token=" + window.localStorage["access_token"];
    }
    return rurl;
  }

function sendIntentFetchGameId(sender){
  client.sendIntent(
    "FETCH_APPID",
    sender
  );
}

function editButtonListener(actionId){
    if(actionCollection){
      var index = _.map(actionCollection,function(e) { return e.id; }).indexOf(actionId);
      var selectedAction = actionCollection[index];

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
}

function deleteButtonListener(actionId){
  if(actionCollection){

      actionAccess.deleteAction(
        gameId,
        notification,
        function(data,type){
          loadContent();
        },
        function(status,error){},
        actionId);
      $(".modal").modal('hide');

  }
}

function addButtonListener(){
    $(modalSubmitButton).html('Submit');
    $(modalInputId).prop('readonly', false);
    $(modalInputId).val('');
    $(modalTitle).html('Add a New Action');
    $(modalInputDescription).val('');
    $(modalInputName).val('');
    $(modalInputPointValue).val('');
    $(modalNotifCheck).prop('checked',false);
    $(modalNotifMessageInput).val('');
    $("#modalactiondiv").modal('toggle');

};

function refreshButtonListener(){
  sendIntentFetchGameId("action");
}

$(document).ready(function() {
  initIWC();

   _.templateSettings = {
      evaluate: /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape: /\{\{-(.+?)\}\}/g
    };
   resetContent();
});

function resetContent(){


  var loginTemplate = _.template($("#login-template").html());
  var contentElmt = $(".content-wrapper");
  contentElmt.html(loginTemplate);
}


function loadContent(){
    actionAccess.getActionsData(
      gameId,
      notification,
      function(data,type){
        
        $("#modalactiondiv").modal('hide');
        console.log(JSON.stringify(data))
          actionCollection = data.rows;

          if(actionCollection.length > 0){
            var listTemplate = _.template($("#list-action").html());
            var listGroupElmt = $(".list-group");

            var htmlData = ""
            listGroupElmt.empty();
            _.forEach(actionCollection,function(action){
              console.log(action)
              htmlData += listTemplate(action);
            });
            listGroupElmt.append(htmlData);
          }
          else{
            var listGroupElmt = $(".list-group");
            listGroupElmt.html("<h4 class=\"text-center\">No Data</h4>")
          }
        },
        function(status,error) {
          console.log(error);
        }
    );
}

  var submitFormListener = function(){
    $("form#modalactionform").off();
    $("form#modalactionform").submit(function(e){
      //disable the default form submission
      e.preventDefault();
      var formData = new FormData($(this)[0]);

      var submitButtonText = $(modalSubmitButton).html();

      var actionId = $(modalInputId).val();

      if(submitButtonText=='Submit'){
        actionAccess.createNewAction(
          gameId,
          formData,
          notification,
          function(data,type){
            $("#modalactiondiv").modal('hide');
            loadContent();
          },
          function(status,error){
            showErrorMessageInModal(error.message)
          },
          actionId
        );
      }
      else{
        actionAccess.updateAction(
          gameId,
          formData,
          notification,
          function(data,type){
            $("#modalactiondiv").modal('hide');
            $("#contentModal").modal('hide');
            loadContent();
          },
          function(status,error){
            showErrorMessageInModal(error.message)
          },
          actionId
        );
      }

      return false;
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

function showErrorMessageInModal(text){
    $("#modalactionform").before("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>"+text+"</div>")
}
