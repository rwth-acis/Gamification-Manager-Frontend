
 // global variables
var client, appId, notification;
    
function setAppIDContext(appId_){
  appId = appId_;
  //$('#app-id-text').html(appId);
  gadgets.window.setTitle("Gamification Manager Achievement - " + appId);

  achievementModule.init();
}

var init = function() {
  var iwcCallback = function(intent) {
    console.log(intent);
    if(intent.action == "REFRESH_APPID"){
      setAppIDContext(intent.data);
    }
    if(intent.action == "FETCH_APPID_CALLBACK"){
      notification.dismissMessage();
      var data = JSON.parse(intent.data);
      if(data.receiver == "achievement"){
        if(data.appId){
          setAppIDContext(data.appId);
        }
        else{
          miniMessageAlert(notification,"Application ID in Gamification Manager Application is not selected","danger")
        }
      }
    }
  };
  client = new Las2peerWidgetLibrary("http://127.0.0.1:8081/", iwcCallback);
  notification = new gadgets.MiniMessage("GAMEACHIEVEMENT");

  $('button#refreshbutton').on('click', function() {
    sendIntentFetchAppId("achievement");
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


var achievementModule = (function() {
  
  var achievementAccess,badgeAccess;
  var modalSubmitButton;
  var modalInputId;
  var modalInputName;
  var modalInputDescription;
  var modalInputPointValue;
  var modalInputBadgeId;
  var modalTitle;
  var modalInputBadgeId;
  var modalTitle;

  var modalNotifCheck;
  var modalNotifMessageInput;

  var achievementCollection;

  var initialize = function(){
    achievementAccess = new AchievementDAO();
    badgeAccess = new BadgeDAO();
    modalSubmitButton = $("#modalachievementsubmit").html('Update');
    modalTitle = $("#modalachievementdiv").find(".modal-title");
    modalInputId = $("#modalachievementdiv").find("#achievement_id_name");
    modalInputName = $("#modalachievementdiv").find("#achievement_name");
    modalInputDescription = $("#modalachievementdiv").find("#achievement_desc");
    modalInputPointValue = $("#modalachievementdiv").find("#achievement_point_value");
    modalInputBadgeId = $("#modalachievementdiv").find("#achievement_badge_id");
    modalNotifCheck = $("#modalachievementdiv").find("#achievement_notification_check");
    modalNotifMessageInput = $("#modalachievementdiv").find("#achievement_notification_message");
  };

  function renderAchievementTable(data){
    if(data.rows.length < 1){
      var newRow = "<tr class='text-center'><td colspan='9'>No data Found ! </td>";
      $("table#list_achievements").find("tbody").append(newRow);
    }
    else{
      for(var i = 0; i < data.rows.length; i++){
        var achievement = data.rows[i];
        var newRow = "<tr><td class='text-center idclass'>" + achievement.id + "</td>";
        newRow += "<td class='text-center nameclass'>" + achievement.name + "</td>";
        newRow += "<td class='descclass'>" + achievement.description + "</td>";
        newRow += "<td class='pointvalueclass'>" + achievement.pointValue + "</td>";
        newRow += "<td class='badgeidclass'> <a href='#' class='show-badge' id='"+ achievement.badgeId +"' data-row-badgeid='" + achievement.badgeId + "' >"+achievement.badgeId+"</a></td>";
        
        newRow += "<td class='text-center usenotifclass''>" + achievement.useNotification + "</td>";
        newRow += "<td class='messageclass''>" + achievement.notificationMessage + "</td>";
        newRow += "<td class='text-center'>" + "<button type='button' class='btn btn-xs btn-warning updclass'>Edit</button></td> ";
        newRow += "<td class='text-center'>" +"<button type='button' class='btn btn-xs btn-danger delclass'>Delete</button></td>";
        
        $("table#list_achievements").find("tbody").append(newRow);
      }
    }
  }

  var loadTable = function(){

    $("table#list_achievements").find("tbody").empty();
    achievementAccess.getAchievementsData(
      appId,
      notification,
      function(data,type){
          $("#modalachievementdiv").modal('hide');
          achievementCollection = data.rows;
          renderAchievementTable(data);

          $("table#list_achievements").find(".show-badge").popover({
              html : true, 
              content: function() {
                return $("#badge-popover-content").html();
              },
              title: function() {
                return $("#badge-popover-title").html();
              },
              trigger: 'manual',
              placement:'right'
          });
          $("table#list_achievements").find(".show-badge").on("click", function(event){
            // Get badge data with id
            event.preventDefault();
            // Get id of the selected element to be attached with popover 
            var idelement = "#" + $(event.target).data("row-badgeid");
            badgeAccess.getBadgeDataWithId(
              appId,
              $(event.target).data("row-badgeid"),
              function(data,type){
                // Render in popover
                console.log(data);
                console.log($(event.target));
                $("#badge-popover-content").find("#badgeidpopover").html(data.id);
                $("#badge-popover-content").find("#badgenamepopover").html(data.name);
                $("#badge-popover-content").find("#badgedescpopover").html(data.description);
                $("#badge-popover-content").find("#badgeimagepopover").attr("src",useAuthentication(data.imagePath))
                $(event.target).popover('show');

                // Dismiss popover when click anywhere
                $(document).click(function() {
                  $(event.target).popover('hide');
                });
                $(".popover").on("click", function(e)
                {
                  $(event.target).popover('hide');
                });
              },
              function(error){

              });
          });

          $("table#list_achievements").find(".updclass").on("click", function(event){
              if(achievementCollection){
                var selectedRow =  $(event.target).parent().parent()[0];
                var selectedAchievement = achievementCollection[selectedRow.rowIndex-1];

                $(modalSubmitButton).html('Update');
                $(modalTitle).html('Update an Achievement');
                $(modalInputId).val(selectedAchievement.id);
                $(modalInputId).prop('readonly', true);
                $(modalInputName).val(selectedAchievement.name);
                $(modalInputDescription).val(selectedAchievement.description);
                $(modalInputPointValue).val(selectedAchievement.pointValue);
                $(modalInputBadgeId).val(selectedAchievement.badgeId);
                $(modalNotifCheck).prop('checked',selectedAchievement.useNotification);
                $(modalNotifMessageInput).val(selectedAchievement.notificationMessage);
                $(modalNotifMessageInput).prop('readonly',true);
                if(selectedAchievement.useNotification){
                  $(modalNotifMessageInput).prop('readonly',false);
                }
              
                $("#modalachievementdiv").modal('toggle');
              }
          });

          $("table#list_achievements").find(".delclass").on("click", function(event){
            var selectedRow =  $(event.target).parent().parent()[0];
            var selectedAchievement = achievementCollection[selectedRow.rowIndex-1];

              achievementAccess.deleteAchievement(
                appId,
                notification,
                function(data,type){
                  loadTable();
                },
                function(status,error){},
                selectedAchievement.id
              );
          });
      },
      function(status,error) {
        console.log(error);
      }
    );
  };

  var addNewButtonListener = function(){
    $("button#addnewachievement").on('click', function(event) {
      // count number of rows so the number can be incremented
        // Adapt Modal with add form
    modalSubmitButton.html('Submit');
    $(modalTitle).html('Add a New Achievement');
    $(modalInputId).val('');
    $(modalInputId).prop('readonly', false);
      $(modalInputName).val('');
      $(modalInputDescription).val('');
      $(modalInputBadgeId).val('');
      $(modalInputPointValue).val('0');
    $(modalNotifCheck).prop('checked',false);
    $(modalNotifMessageInput).val('');
      $("#modalachievementdiv").modal('toggle');
      
    });
  };

  var checkBoxListener = function(){
      // Check boxes in modal
  // check box for point flag
    $('input[type="checkbox"]#achievement_notification_check').on("click",function(){
          if($(this).prop("checked") == true){
              $(modalNotifMessageInput).prop('readonly', false);
          }
          else if($(this).prop("checked") == false){
              $(modalNotifMessageInput).prop('readonly', true);
          }
      });
  }

  var submitFormListener = function(){
    $("form#modalachievementform").submit(function(e){
      //disable the default form submission
      e.preventDefault();
      var formData = new FormData($(this)[0]);

      var submitButtonText = $(modalSubmitButton).html();

      var achievementId = $(modalInputId).val();
      console.log(achievementId);
      if(submitButtonText=='Submit'){
        achievementAccess.createNewAchievement(
          appId,
          formData, 
          notification, 
          function(data,type){
            $("#modalachievementdiv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          achievementId
        );
      }
      else{
        achievementAccess.updateAchievement(
          appId,
          formData, 
          notification, 
          function(data,type){
            $("#modalachievementdiv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          achievementId
        );
      }
      
      return false;
    });
  };

  var elementDependenciesListener = function(){
    $("#modalachievementdiv").find("#select_badge").on("click", function(e){
        // Retrieve badge data. The only difference is this is read only
      $("table#list_badges_a").find("tbody").empty();
      badgeAccess.getBadgesData(
        appId,
        notification,
        function(data,type){
          for(var i = 0; i < data.rows.length; i++){
            var badge = data.rows[i];
            console.log(badge);
            var newRow = "<tr><td class='text-center bidclass'>" + badge.id + "</td>";
            newRow += "<td class='text-center bnameclass'>" + badge.name + "</td>";
            newRow += "<td class='bdescclass'>" + badge.description + "</td>";
            newRow += "<td><img class='text-center badgeimage badgeimagemini' src='"+ badgeAccess.getBadgeImage(appId,badge.id) +"' alt='your image' /></td>";
            newRow += "<td class='text-center'>" +"<button type='button' class='btn btn-xs btn-success badgeselectclass'>Select</button></td>";
            
            $("table#list_badges_a").find("tbody").append(newRow);
          }
          $("table#list_badges_a").find(".badgeselectclass").on("click", function(event){
            var selectedRow =  $(event.target).parent().parent().find(".bidclass")[0];
            var selectedBadgeId = selectedRow.textContent;
            $("#modalachievementdiv").find("#panel_badge").collapse('toggle')
            $("#modalachievementdiv").find("#achievement_badge_id").val(selectedBadgeId);
          });
        },
        function(status,error) {
          console.log(error);
        }
      );
    });
    // Badge in achievement -----------------------
    $("#modalachievementdiv").find("button.btn#empty_badge").on('click', function(event) {
      $("#modalachievementdiv").find("#achievement_badge_id").val();
    });
  };


  return {
    init : function(){
      initialize();
      loadTable();
      addNewButtonListener();
      elementDependenciesListener();
      checkBoxListener();
      submitFormListener();
    }
  };


})();
