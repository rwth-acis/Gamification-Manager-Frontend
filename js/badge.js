
var client, appId, memberId, notification;
var oidc_userinfo;
var iwcCallback;
function setAppIDContext(appId_){
  appId = appId_;
  //$('#app-id-text').html(appId);
  if(appId){
    gadgets.window.setTitle("Gamification Manager Badge - " + appId);
    if(appId == ""){
      $("table#list_badges").find("tbody").empty();
    }
    else{
      badgeModule.init();
    }
  }

}

var initIWC = function(){

  notification = new gadgets.MiniMessage("GAMEBADGE");
  iwcCallback = function(intent) {
    console.log(intent);
    if(intent.action == "REFRESH_APPID"){

      setAppIDContext(intent.data);
      console.log(appId);
    }
    if(intent.action == "FETCH_APPID_CALLBACK"){
      notification.dismissMessage();
      var data = JSON.parse(intent.data);
      if(data.status == 200){
        oidc_userinfo = data.member;
        loggedIn(oidc_userinfo.preferred_username);
        if(data.receiver == "badge"){
          if(data.appId){
            setAppIDContext(data.appId);
          }
          else{
            miniMessageAlert(notification,"Application ID in Gamification Manager Application is not selected","danger")
          }
        }
      }
      else if(data.status == 401){
            $("table#list_badges").find("tbody").empty();
            var newRow = "<tr class='text-center'><td colspan='8'>You are not logged in</td>";
            $("table#list_badges").find("tbody").append(newRow);
      }

    }
    if(intent.action == "LOGIN"){
      var data = JSON.parse(intent.data);
      if(data.status == 200){
        oidc_userinfo = data.member;
        loggedIn(oidc_userinfo.preferred_username);
      }
      else if(data.status == 401){
            $("table#list_badges").find("tbody").empty();
            var newRow = "<tr class='text-center'><td colspan='8'>You are not logged in</td>";
            $("table#list_badges").find("tbody").append(newRow);
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
  // $('button#refreshbutton').on('click', function() {
  //     sendIntentFetchLogin("badge");
  // });
};

var loadLas2peerWidgetLibrary = function(){
  try{
    client = new Las2peerWidgetLibrary("http://gaudi.informatik.rwth-aachen.de:8081/", iwcCallback);
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
  // client = new Las2peerWidgetLibrary("http://gaudi.informatik.rwth-aachen.de:8081/", iwcCallback);

  $("table#list_badges").find("tbody").empty();
  var newRow = "<tr class='text-center'><td colspan='8'>Hello "+memberId+"</td>";
  $("table#list_badges").find("tbody").append(newRow);
};

var init = function() {

  $('button#refreshbutton').off('click');
  $('button#refreshbutton').on('click', function() {
      sendIntentFetchAppId("badge");
  });
};


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

function sendIntentFetchAppId(sender){
  client.sendIntent(
    "FETCH_APPID",
    sender
  );
}

// function sendIntentFetchLogin(sender){
//   client.sendIntent(
//     "FETCH_LOGIN",
//     sender
//   );
// }

$(document).ready(function() {
  initIWC();
});



var badgeModule = (function() {

  var badgeAccess;
  var modalInputId;
  var modalInputName;
  var modalInputDescription;
  var modalSubmitButton;
  var modalTitle;
  var modalNotifCheck;
  var modalNotifMessageInput;

  var badgeCollection;

  var initialize = function(){

    badgeAccess = new BadgeDAO();
    modalInputId = $("#modalbadgediv").find("#badge_id")
    modalInputName = $("#modalbadgediv").find("#badge_name");
    modalInputDescription = $("#modalbadgediv").find("#badge_desc");
    modalImage = $("#modalbadgediv").find("#badgeimageinmodal");
    modalSubmitButton = $("#modalbadgediv").find("#modalbadgesubmit");
    modalNotifCheck = $("#modalbadgediv").find("#badge_notification_check");
    modalNotifMessageInput = $("#modalbadgediv").find("#badge_notification_message");
    modalTitle = $("#modalbadgediv").find(".modal-title");
  };

  function renderBadgeTable(data){
    $("table#list_badges").find("tbody").empty();
    if(data.rows.length < 1){
        var newRow = "<tr class='text-center'><td colspan='8'>No data Found !</td>";
        $("table#list_badges").find("tbody").append(newRow);
     }
     else if(data.message){
       var newRow = "<tr class='text-center'><td colspan='8'>"+data.message+"</td>";
       $("table#list_badges").find("tbody").append(newRow);
     }
     else{
        for(var i = 0; i < data.rows.length; i++){
        var badge = data.rows[i];
        console.log(badge);
        var newRow = "<tr><td class='text-center bidclass'>" + badge.id + "</td>";
        newRow += "<td class='text-center bnameclass'>" + badge.name + "</td>";
      newRow += "<td class='bdescclass'>" + badge.description + "</td>";
      //newRow += "<td><button id='" + i + "' type='button' onclick='viewBadgeImageHandler(this,0)' class='btn btn-info bimgclass' name='"+ badge.imagePath +"' data-toggle='modal' data-target='#modalimage'>View Image</button></td>";
      newRow += "<td><img class='text-center badgeimage badgeimagemini' src='"+ badgeAccess.getBadgeImage(appId,badge.id) +"' alt='your image' /></td>";
      newRow += "<td class='text-center busenotifclass''>" + badge.useNotification + "</td>";
      newRow += "<td class='bmessageclass''>" + badge.notificationMessage + "</td>";
      newRow += "<td class='text-center'>" + "<button type='button' class='btn btn-xs btn-warning bupdclass'>Edit</button></td> ";
      newRow += "<td class='text-center'>" +"<button type='button' class='btn btn-xs btn-danger bdelclass'>Delete</button></td>";

        $("table#list_badges").find("tbody").append(newRow);
      }
    }
  }
  var loadTable = function(){

    //$("table#list_badges").find("tbody").empty();
    badgeAccess.getBadgesData(
      appId,
      notification,
      function(data,type){
        $("#modalbadgediv").modal('hide');
          badgeCollection = data.rows;
          renderBadgeTable(data);

          $("table#list_badges").find(".bupdclass").off("click");
          $("table#list_badges").find(".bupdclass").on("click", function(event){
          if(badgeCollection){

              var selectedRow =  $(event.target).parent().parent()[0];
              var selectedBadge = badgeCollection[selectedRow.rowIndex-1];

              $(modalSubmitButton).html('Update');
              $(modalInputId).val(selectedBadge.id);
            $(modalInputId).prop('readonly', true);
            modalTitle.html('Update a Badge');
              $(modalInputName).val(selectedBadge.name);
              $(modalInputDescription).val(selectedBadge.description);
              $(modalImage).attr("src",badgeAccess.getBadgeImage(appId,selectedBadge.id));
              $(modalImage).prop('required',false);
              $(modalNotifCheck).prop('checked',selectedBadge.useNotification);
            $(modalNotifMessageInput).val(selectedBadge.notificationMessage);
            $(modalNotifMessageInput).prop('readonly',true);
              if(selectedBadge.useNotification){
                $(modalNotifMessageInput).prop('readonly',false);
              }
              $("#modalbadgediv").modal('toggle');
          }
        });

        $("table#list_badges").find(".bdelclass").off("click");
        $("table#list_badges").find(".bdelclass").on("click", function(event){
          var selectedRow =  $(event.target).parent().parent()[0];
            var selectedBadge = badgeCollection[selectedRow.rowIndex-1];

            badgeAccess.deleteBadge(
              notification,
              function(data,type){
                loadTable();
              },
              function(status,error){},
              selectedBadge.id);
          });
        },
        function(status,error) {
          console.log(error);
        }
    );
  };

  var addNewButtonListener = function(){
    $("button#addnewbadge").off('click');
    $("button#addnewbadge").on('click', function(event) {
        // Adapt Modal with add form
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

    });
  };

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
    $("form#modalbadgeform").submit(function(e){
      //disable the default form submission
      e.preventDefault();
      var formData = new FormData($(this)[0]);

      var submitButtonText = $(modalSubmitButton).html();

      var badgeid = $(modalInputId).val();

      if(submitButtonText=='Submit'){
        badgeAccess.createNewBadge(
          appId,
          formData,
          notification,
          function(data,type){
            $("#modalbadgediv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          badgeid
        );
      }
      else{
        badgeAccess.updateBadge(
          appId,
          formData,
          notification,
          function(data,type){
            $("#modalbadgediv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          badgeid
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
    loadTable:loadTable,
    showImageOnChange: function(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
              $('#badgeimageinmodal')
                  .attr('src', e.target.result)
                  .width(200)
                  .height(200);
          };

          reader.readAsDataURL(input.files[0]);
      }
    }
  };


})();
