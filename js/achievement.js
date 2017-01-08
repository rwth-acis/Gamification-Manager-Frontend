
 // global variables
var client, gameId, memberId, notification;
var oidc_userinfo;
var iwcCallback;

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


/**
 * Function to set game ID for the widget
 * @param {gameId} game ID
 */
function setGameIDContext(gameId_){
  gameId = gameId_;
  if(gameId){
    if(gameId == ""){
      resetContent()
    }
    else{
      initContent();
    }
  }
}

var initIWC = function(){
  notification = new gadgets.MiniMessage("GAMEACHIEVEMENT");

  iwcCallback = function(intent) {
    console.log(intent);
    if(intent.action == "REFRESH_APPID"){
      setGameIDContext(intent.data);
    }
    if(intent.action == "FETCH_APPID_CALLBACK"){
      notification.dismissMessage();
      var data = JSON.parse(intent.data);
      if(data.status == 200){
        oidc_userinfo = data.member;
        loggedIn(oidc_userinfo.preferred_username);
        if(data.receiver == "achievement"){
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
  };
  loadLas2peerWidgetLibrary();

    modalSubmitButton = $("#modalachievementsubmit").html('Update');
    modalTitle = $("#modalachievementdiv").find(".modal-title");
    modalInputId = $("#modalachievementdiv").find("#achievement_id_name");
    modalInputName = $("#modalachievementdiv").find("#achievement_name");
    modalInputDescription = $("#modalachievementdiv").find("#achievement_desc");
    modalInputPointValue = $("#modalachievementdiv").find("#achievement_point_value");
    modalInputBadgeId = $("#modalachievementdiv").find(".custom-select");
    modalNotifCheck = $("#modalachievementdiv").find("#achievement_notification_check");
    modalNotifMessageInput = $("#modalachievementdiv").find("#achievement_notification_message");
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

  achievementAccess = new AchievementDAO();
  badgeAccess = new BadgeDAO();
  var contentTemplate = _.template($("#content-template").html());
  var contentElmt = $(".content-wrapper");
  contentElmt.html(contentTemplate);


  $("h6#title-widget").text(gameId);
  loadContent();



  $('#contentModal').off();
  $('#contentModal').on('show.bs.modal', function (event) {
    console.log($(this));
    var button = $(event.relatedTarget) // Button that triggered the modal
    var achievementid = button.data('achievementid')
    var index = _.map(achievementCollection,function(e) { return e.id; }).indexOf(achievementid);
    var modal = $(this)
    modal.find(".fa-tag").html("<span> " + achievementCollection[index].id+"</span>")
    modal.find('h4.card-title').text(achievementCollection[index].name)
    modal.find('p.desc').html("<i class=\"fa fa-align-justify\"></i> "+achievementCollection[index].description)
    modal.find('#pvalue').html("<p><strong>Point</strong></p><p>"+achievementCollection[index].pointValue+"</p>")
    if(achievementCollection[index].badgeId){
      modal.find('#badgeimg').html("<p><strong>Badge</strong></p><img  src=\""+badgeAccess.getBadgeImage(gameId,achievementCollection[index].badgeId)+"\" style=\"height:50;width:50;\" /><p>"+achievementCollection[index].badgeId+"</p>") 
    }else{
      modal.find('#badgeimg').html("<p><strong>Badge</strong></p><p>-</p>")
    }
    if(achievementCollection[index].useNotification){
      modal.find('p.msg').addClass("text-success");
      modal.find('p.msg').removeClass("text-danger");
    }else{
      modal.find('p.msg').addClass("text-danger");
      modal.find('p.msg').removeClass("text-success");
    }
      modal.find('p.msg').html("<i class=\"fa fa-comment-o\"></i> "+achievementCollection[index].notificationMessage)
    modal.find('.bedit').attr("onclick","editButtonListener(\""+achievementid+"\")")
    modal.find('.bdelete').attr("onclick","deleteButtonListener(\""+achievementid+"\")")
    modal.find('button').attr("data-achievementid",achievementid)

  })
  submitFormListener();
  checkBoxListener();
  elementDependenciesListener();
}
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

function editButtonListener(achievementId){
    if(achievementCollection){
      var index = _.map(achievementCollection,function(e) { return e.id; }).indexOf(achievementId);
      var selectedAchievement = achievementCollection[index];

      $(modalSubmitButton).html('Update');
      $(modalTitle).html('Update an Achievement');
      $(modalInputId).val(selectedAchievement.id);
      $(modalInputId).prop('readonly', true);
      $(modalInputName).val(selectedAchievement.name);
      $(modalInputDescription).val(selectedAchievement.description);
      $(modalInputPointValue).val(selectedAchievement.pointValue);
      $(modalNotifCheck).prop('checked',selectedAchievement.useNotification);
      $(modalNotifMessageInput).val(selectedAchievement.notificationMessage);
      $(modalNotifMessageInput).prop('readonly',true);
      if(selectedAchievement.useNotification){
        $(modalNotifMessageInput).prop('readonly',false);
      }

      $("#modalachievementdiv").modal('toggle');
    }
}

function deleteButtonListener(achievementId){
  if(achievementCollection){

      achievementAccess.deleteAchievement(
        gameId,
        notification,
        function(data,type){
          loadContent();
        },
        function(status,error){},
        achievementId
      );

      $(".modal").modal('hide');

  }
}

function addButtonListener(){

    $(modalSubmitButton).html('Submit');
    $(modalTitle).html('Add a New Achievement');
    $(modalInputId).val('');
    $(modalInputId).prop('readonly', false);
      $(modalInputName).val('');
      $(modalInputDescription).val('');
      $(modalInputPointValue).val('0');
    $(modalNotifCheck).prop('checked',false);
    $(modalNotifMessageInput).val('');
      $("#modalachievementdiv").modal('toggle');
};

function refreshButtonListener(){
  sendIntentFetchGameId("achievement");
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

      achievementAccess.getAchievementsData(
      gameId,
      notification,
      function(data,type){
          $("#modalachievementdiv").modal('hide');
          achievementCollection = data.rows;


      if(achievementCollection.length > 0){
          var listTemplate = _.template($("#list-achievement").html());
          var listGroupElmt = $(".list-achievement-group");

          var htmlData = ""
          listGroupElmt.empty();
          _.forEach(achievementCollection,function(achievement){
            console.log(achievement)
            htmlData += listTemplate(achievement);
          });
          listGroupElmt.append(htmlData);
        }
        else{
          var listGroupElmt = $(".list-achievement-group");
          listGroupElmt.html("<h4 class=\"text-center\">No Data</h4>")
        }
      },
      function(status,error) {
        console.log(error);
      }
    );
}

  var checkBoxListener = function(){
      // Check boxes in modal
  // check box for point flag
    $('input[type="checkbox"]#achievement_notification_check').off("click");
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
    $("form#modalachievementform").off();
    $("form#modalachievementform").submit(function(e){
      //disable the default form submission
      e.preventDefault();
      var formData = new FormData($(this)[0]);
      var selectedBadgeId = $('.custom-select').val()
      formData.append("achievementbadgeid",selectedBadgeId);
      var submitButtonText = $(modalSubmitButton).html();

      var achievementId = $(modalInputId).val();
      console.log(achievementId);
      if(submitButtonText=='Submit'){
        achievementAccess.createNewAchievement(
          gameId,
          formData,
          notification,
          function(data,type){
            $("#modalachievementdiv").modal('toggle');
            loadContent();
          },
          function(status,error){
            showErrorMessageInModal(error.message)
          },
          achievementId
        );
      }
      else{
        achievementAccess.updateAchievement(
          gameId,
          formData,
          notification,
          function(data,type){
            $("#modalachievementdiv").modal('toggle');
            $("#contentModal").modal('hide');
            loadContent();
          },
          function(status,error){
            showErrorMessageInModal(error.message)
          },
          achievementId
        );
      }

      return false;
    });
  };

  var elementDependenciesListener = function(){
    // modal add and edit
      $('#modalachievementdiv').off();
  $('#modalachievementdiv').on('show.bs.modal', function (event) {
    
    // Get id from the existing modal
    var achievementid = $("#achievement_id_name").val()

    // If update mode
      var modal = $(this)
      var optionElmt = modal.find('.custom-select');
      badgeAccess.getBadgesData(
          gameId,
          notification,
          function(data,type){
            var htmlData = ""
            htmlData += "<option value=\"\">No badge</option>"
            if(data.rows){
              _.forEach(data.rows,function(badge){
                htmlData += "<option value=\""+badge.id+"\">"+badge.id+"</option>"
              });
              optionElmt.html(htmlData);


              if(achievementid){
                var index = _.map(achievementCollection,function(e) { return e.id; }).indexOf(achievementid);
                $('.custom-select option:contains(' + achievementCollection[index].badgeId + ')').prop({selected: true});
              }
            }else{
              htmlData = "<option value=\"\" selected>No badge found</option>"
              optionElmt.html(htmlData);
            }

          },
          function(status,error) {
            console.log(error);
            showErrorMessageInModal(error.message)
          }
      );
      console.log(achievementid)
      console.log(achievementCollection)
    

    // If add mode
    // do nothing


  })

    $("#modalachievementdiv").find("#select_badge").off("click");
    $("#modalachievementdiv").find("#select_badge").on("click", function(e){
        // Retrieve badge data. The only difference is this is read only
      $("table#list_badges_a").find("tbody").empty();
      badgeAccess.getBadgesData(
        gameId,
        notification,
        function(data,type){
          for(var i = 0; i < data.rows.length; i++){
            var badge = data.rows[i];
            console.log(badge);
            var newRow = "<tr><td class='text-center bidclass'>" + badge.id + "</td>";
            newRow += "<td class='text-center bnameclass'>" + badge.name + "</td>";
            newRow += "<td class='bdescclass'>" + badge.description + "</td>";
            newRow += "<td><img class='text-center badgeimage badgeimagemini' src='"+ badgeAccess.getBadgeImage(gameId,badge.id) +"' alt='your image' /></td>";
            newRow += "<td class='text-center'>" +"<button type='button' class='btn btn-xs btn-success badgeselectclass'>Select</button></td>";

            $("table#list_badges_a").find("tbody").append(newRow);
          }
          $("table#list_badges_a").find(".badgeselectclass").off("click");
          $("table#list_badges_a").find(".badgeselectclass").on("click", function(event){
            var selectedRow =  $(event.target).parent().parent().find(".bidclass")[0];
            var selectedBadgeId = selectedRow.textContent;
            $("#modalachievementdiv").find("#panel_badge").collapse('toggle')
            $("#modalachievementdiv").find("#achievement_badge_id").val(selectedBadgeId);
          });
        },
        function(status,error) {
          console.log(error);
          showErrorMessageInModal(error.message)
        }
      );
    });
    // Badge in achievement -----------------------
    $("#modalachievementdiv").find("button.btn#empty_badge").off('click');
    $("#modalachievementdiv").find("button.btn#empty_badge").on('click', function(event) {
      console.log("No badge");
      $("#modalachievementdiv").find("#achievement_badge_id").val("");
    });
  };



function showErrorMessageInModal(text){
    $("#modalachievementform").before("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>"+text+"</div>")
}
