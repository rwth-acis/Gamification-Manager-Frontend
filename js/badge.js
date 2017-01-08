
var client, gameId, memberId, notification;
var oidc_userinfo;
var iwcCallback;

var badgeAccess;
var modalInputId;
var modalInputName;
var modalInputDescription;
var modalSubmitButton;
var modalTitle;
var modalNotifCheck;
var modalNotifMessageInput;

var badgeCollection;


function setGameIDContext(gameId_){
  gameId = gameId_;
  if(gameId){
    if(gameId == ""){
      resetContent();
    }
    else{
      initContent();
    }
  }

}

var initIWC = function(){

  notification = new gadgets.MiniMessage("GAMEBADGE");
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
        if(data.receiver == "badge"){
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
    if(intent.action == "FETCH_LOGIN_CALLBACK"){
      var data = JSON.parse(intent.data);
      if(data.receiver == "badge"){
        if(data.status == 200){
          oidc_userinfo = data.member;
            loggedIn(oidc_userinfo.preferred_username);
        }
      }
    }
  };

  loadLas2peerWidgetLibrary();

  modalInputId = $("#modalbadgediv").find("#badge_id")
  modalInputName = $("#modalbadgediv").find("#badge_name");
  modalInputDescription = $("#modalbadgediv").find("#badge_desc");
  modalImage = $("#modalbadgediv").find("#badgeimageinmodal");
  modalSubmitButton = $("#modalbadgediv").find("#modalbadgesubmit");
  modalNotifCheck = $("#modalbadgediv").find("#badge_notification_check");
  modalNotifMessageInput = $("#modalbadgediv").find("#badge_notification_message");
  modalTitle = $("#modalbadgediv").find(".modal-title");
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
  $("#login-alert h5").before("<h5>Welcome " + memberId + " !");
};

var initContent = function(){

  badgeAccess = new BadgeDAO();
  var contentTemplate = _.template($("#content-template").html());
  var contentElmt = $(".content-wrapper");
  contentElmt.html(contentTemplate);


  $("h6#title-widget").text(gameId);
  loadContent();

  submitFormListener();
  checkBoxListener();
}

var useAuthentication = function(rurl){
    if(rurl.indexOf("\?") > 0){
      rurl += "&access_token=" + window.localStorage["access_token"];
    } else {
      rurl += "?access_token=" + window.localStorage["access_token"];
    }
    // unique cache-busting query parameter
    rurl += "&t=" + new Date().getTime();
    return rurl;
  }

function sendIntentFetchGameId(sender){
  client.sendIntent(
    "FETCH_APPID",
    sender
  );
}

function editButtonListener(badgeId){
    if(badgeCollection){

      var index = _.map(badgeCollection,function(e) { return e.id; }).indexOf(badgeId);
        var selectedBadge = badgeCollection[index];

        $(modalSubmitButton).html('Update');
        $(modalInputId).val(selectedBadge.id);
      $(modalInputId).prop('readonly', true);
      modalTitle.html('Update a Badge');
        $(modalInputName).val(selectedBadge.name);
        $(modalInputDescription).val(selectedBadge.description);
        $(modalImage).attr("src",badgeAccess.getBadgeImage(gameId,selectedBadge.id));
        $(modalImage).prop('required',false);
        $(modalNotifCheck).prop('checked',selectedBadge.useNotification);
      $(modalNotifMessageInput).val(selectedBadge.notificationMessage);
      $(modalNotifMessageInput).prop('readonly',true);
        if(selectedBadge.useNotification){
          $(modalNotifMessageInput).prop('readonly',false);
        }
        $("#modalbadgediv").modal('toggle');
    }
}

function deleteButtonListener(badgeId){
  if(badgeCollection){
    badgeAccess.deleteBadge(
      gameId,
      notification,
      function(data,type){
        loadContent();
      },
      function(status,error){},
      badgeId);


      $(".modal").modal('hide');

  }
}

function addButtonListener(){
        $(modalSubmitButton).html('Submit');
      $(modalInputId).prop('readonly', false);
      $(modalInputId).val('');
      $(modalTitle).html('Add a New Badge');
        $(modalInputName).val('');
        $(modalInputDescription).val('');
        $(modalImage).prop('src','');
        $(modalImage).prop('required',true);
      $(modalNotifCheck).prop('checked',false);
      $(modalNotifMessageInput).val('');
        $("#modalbadgediv").modal('toggle');

};

function loadContent(){

      badgeAccess.getBadgesData(
      gameId,
      notification,
      function(data,type){
        $("#modalbadgediv").modal('hide');
          badgeCollection = data.rows;
          
          if(badgeCollection.length > 0){
            var cardTemplate = _.template($("#card-badge").html());
            var listGroupElmt = $(".card-deck");

            var htmlData = ""
            listGroupElmt.empty();
            _.forEach(badgeCollection,function(badge){
              console.log(badge)
              badge.imgUrl = badgeAccess.getBadgeImage(gameId,badge.id)
              htmlData += cardTemplate(badge);
            });
            listGroupElmt.append(htmlData);
          }
          else{
            var listGroupElmt = $(".card-deck");
            listGroupElmt.html("<h4 class=\"text-center\">No Data</h4>")
          }

        },
        function(status,error) {
          console.log(error);
        }
    );

}

function refreshButtonListener(){
  sendIntentFetchGameId("badge");
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


var checkBoxListener = function(){
    // Check boxes in modal
// check box for point flag
  $('input[type="checkbox"]#badge_notification_check').click(function(){
        if($(this).prop("checked") == true){
            $(modalNotifMessageInput).prop('readonly', false);
        }
        else if($(this).prop("checked") == false){
            $(modalNotifMessageInput).prop('readonly', true);
        }
    });
}

var submitFormListener = function(){
  $("form#modalbadgeform").off();
  $("form#modalbadgeform").submit(function(e){
    //disable the default form submission
    e.preventDefault();
    var formData = new FormData($(this)[0]);

    var submitButtonText = $(modalSubmitButton).html();

    var badgeid = $(modalInputId).val();

    if(submitButtonText=='Submit'){
      badgeAccess.createNewBadge(
        gameId,
        formData,
        notification,
        function(data,type){
          $("#modalbadgediv").modal('toggle');
          loadContent();
        },
        function(status,error){
          showErrorMessageInModal(error.message)
        },
        badgeid
      );
    }
    else{
      badgeAccess.updateBadge(
        gameId,
        formData,
        notification,
        function(data,type){
          $("#modalbadgediv").modal('toggle');
          loadContent();
        },
        function(status,error){
          showErrorMessageInModal(error.message)
        },
        badgeid
      );
    }

    return false;
  });
};

function showImageOnChange(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
              $('#badgeimageinmodal')
                  .attr('src', e.target.result)
                  .width(100)
                  .height(100);
          };

          reader.readAsDataURL(input.files[0]);
      }
    }

function showErrorMessageInModal(text){
    $("#modalbadgeform").before("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>"+text+"</div>")
}
