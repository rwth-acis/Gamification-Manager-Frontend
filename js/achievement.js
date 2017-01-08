
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

function setGameIDContext(gameId_){
  gameId = gameId_;
  //$('#game-id-text').html(gameId);
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
    // if(intent.action == "FETCH_LOGIN_CALLBACK"){
    //   var data = JSON.parse(intent.data);
    //   if(data.receiver == "achievement"){
    //     if(data.status == 200){
    //       oidc_userinfo = data.member;
    //         loggedIn(oidc_userinfo.preferred_username);
    //     }
    //   }
    // }
  };
  loadLas2peerWidgetLibrary();
  // $('button#refreshbutton').on('click', function() {
  //     sendIntentFetchLogin("achievement");
  // });

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
  init();
  $("#login-alert h5").before("<h5>Welcome " + memberId + " !");
  // client = new Las2peerWidgetLibrary("{{= grunt.config('endPointAchievement') }}", iwcCallback);
  // $("table#list_achievements").find("tbody").empty();
  // var newRow = "<tr class='text-center'><td colspan='9'>Hello "+memberId+"</td>";
  // $("table#list_achievements").find("tbody").append(newRow);
};

var init = function() {
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
    var achievementid = button.data('achievementid') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

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

          // $("table#list_achievements").find(".show-badge").popover({
          //     html : true,
          //     content: function() {
          //       return $("#badge-popover-content").html();
          //     },
          //     title: function() {
          //       return $("#badge-popover-title").html();
          //     },
          //     trigger: 'manual',
          //     placement:'right'
          // });
          // $("table#list_achievements").find(".show-badge").off("click");
          // $("table#list_achievements").find(".show-badge").on("click", function(event){
          //   // Get badge data with id
          //   event.preventDefault();
          //   // Get id of the selected element to be attached with popover
          //   var idelement = "#" + $(event.target).data("row-badgeid");
          //   badgeAccess.getBadgeDataWithId(
          //     gameId,
          //     $(event.target).data("row-badgeid"),
          //     notification,
          //     function(data,type){
          //       // Render in popover
          //       console.log(data);
          //       console.log($(event.target));
          //       $("#badge-popover-content").find("#badgeidpopover").html(data.id);
          //       $("#badge-popover-content").find("#badgenamepopover").html(data.name);
          //       $("#badge-popover-content").find("#badgedescpopover").html(data.description);
          //       $("#badge-popover-content").find("#badgeimagepopover").attr("src",badgeAccess.getBadgeImage(gameId,data.id));
          //       $(event.target).popover('show');

          //       // Dismiss popover when click anywhere
          //       $(document).click(function() {
          //         $(event.target).popover('hide');
          //       });
          //       $(".popover").off("click");
          //       $(".popover").on("click", function(e)
          //       {
          //         $(event.target).popover('hide');
          //       });
          //     },
          //     function(error){

          //     });
          // });

function showErrorMessageInModal(text){
    $("#modalachievementform").before("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>"+text+"</div>")
}

// var achievementModule = (function() {

//   var achievementAccess,badgeAccess;
//   var modalSubmitButton;
//   var modalInputId;
//   var modalInputName;
//   var modalInputDescription;
//   var modalInputPointValue;
//   var modalInputBadgeId;
//   var modalTitle;
//   var modalInputBadgeId;
//   var modalTitle;

//   var modalNotifCheck;
//   var modalNotifMessageInput;

//   var achievementCollection;

//   var initialize = function(){
//     achievementAccess = new AchievementDAO();
//     badgeAccess = new BadgeDAO();
//     modalSubmitButton = $("#modalachievementsubmit").html('Update');
//     modalTitle = $("#modalachievementdiv").find(".modal-title");
//     modalInputId = $("#modalachievementdiv").find("#achievement_id_name");
//     modalInputName = $("#modalachievementdiv").find("#achievement_name");
//     modalInputDescription = $("#modalachievementdiv").find("#achievement_desc");
//     modalInputPointValue = $("#modalachievementdiv").find("#achievement_point_value");
//     modalInputBadgeId = $("#modalachievementdiv").find("#achievement_badge_id");
//     modalNotifCheck = $("#modalachievementdiv").find("#achievement_notification_check");
//     modalNotifMessageInput = $("#modalachievementdiv").find("#achievement_notification_message");
//   };

//   function renderAchievementTable(data){

//     $("table#list_achievements").find("tbody").empty();
//     if(data.rows.length < 1){
//       var newRow = "<tr class='text-center'><td colspan='9'>No data Found ! </td>";
//       $("table#list_achievements").find("tbody").append(newRow);
//     }
//     else if(data.message){
//       var newRow = "<tr class='text-center'><td colspan='9'>"+data.message+"</td>";
//       $("table#list_achievements").find("tbody").append(newRow);
//     }
//     else{
//       for(var i = 0; i < data.rows.length; i++){
//         var achievement = data.rows[i];
//         var newRow = "<tr><td class='text-center idclass'>" + achievement.id + "</td>";
//         newRow += "<td class='text-center nameclass'>" + achievement.name + "</td>";
//         newRow += "<td class='descclass'>" + achievement.description + "</td>";
//         newRow += "<td class='pointvalueclass'>" + achievement.pointValue + "</td>";
//         if(achievement.badgeId == null){
//           newRow += "<td class='badgeidclass'> </td>";
//         }
//         else{
//           newRow += "<td class='badgeidclass'> <a href='#' class='show-badge' id='"+ achievement.badgeId +"' data-row-badgeid='" + achievement.badgeId + "' >"+achievement.badgeId+"</a></td>";
//         }
//         newRow += "<td class='text-center usenotifclass''>" + achievement.useNotification + "</td>";
//         newRow += "<td class='messageclass''>" + achievement.notificationMessage + "</td>";
//         newRow += "<td class='text-center'>" + "<button type='button' class='btn btn-xs btn-warning updclass'>Edit</button></td> ";
//         newRow += "<td class='text-center'>" +"<button type='button' class='btn btn-xs btn-danger delclass'>Delete</button></td>";

//         $("table#list_achievements").find("tbody").append(newRow);
//       }
//     }
//   }

//   var loadTable = function(){

//     //$("table#list_achievements").find("tbody").empty();
//     achievementAccess.getAchievementsData(
//       gameId,
//       notification,
//       function(data,type){
//           $("#modalachievementdiv").modal('hide');
//           achievementCollection = data.rows;
//           renderAchievementTable(data);

//           $("table#list_achievements").find(".show-badge").popover({
//               html : true,
//               content: function() {
//                 return $("#badge-popover-content").html();
//               },
//               title: function() {
//                 return $("#badge-popover-title").html();
//               },
//               trigger: 'manual',
//               placement:'right'
//           });
//           $("table#list_achievements").find(".show-badge").off("click");
//           $("table#list_achievements").find(".show-badge").on("click", function(event){
//             // Get badge data with id
//             event.preventDefault();
//             // Get id of the selected element to be attached with popover
//             var idelement = "#" + $(event.target).data("row-badgeid");
//             badgeAccess.getBadgeDataWithId(
//               gameId,
//               $(event.target).data("row-badgeid"),
//               notification,
//               function(data,type){
//                 // Render in popover
//                 console.log(data);
//                 console.log($(event.target));
//                 $("#badge-popover-content").find("#badgeidpopover").html(data.id);
//                 $("#badge-popover-content").find("#badgenamepopover").html(data.name);
//                 $("#badge-popover-content").find("#badgedescpopover").html(data.description);
//                 $("#badge-popover-content").find("#badgeimagepopover").attr("src",badgeAccess.getBadgeImage(gameId,data.id));
//                 $(event.target).popover('show');

//                 // Dismiss popover when click anywhere
//                 $(document).click(function() {
//                   $(event.target).popover('hide');
//                 });
//                 $(".popover").off("click");
//                 $(".popover").on("click", function(e)
//                 {
//                   $(event.target).popover('hide');
//                 });
//               },
//               function(error){

//               });
//           });

//           $("table#list_achievements").find(".updclass").off("click");
//           $("table#list_achievements").find(".updclass").on("click", function(event){
//               if(achievementCollection){
//                 var selectedRow =  $(event.target).parent().parent()[0];
//                 var selectedAchievement = achievementCollection[selectedRow.rowIndex-1];

//                 $(modalSubmitButton).html('Update');
//                 $(modalTitle).html('Update an Achievement');
//                 $(modalInputId).val(selectedAchievement.id);
//                 $(modalInputId).prop('readonly', true);
//                 $(modalInputName).val(selectedAchievement.name);
//                 $(modalInputDescription).val(selectedAchievement.description);
//                 $(modalInputPointValue).val(selectedAchievement.pointValue);
//                 $(modalInputBadgeId).val(selectedAchievement.badgeId);
//                 $(modalNotifCheck).prop('checked',selectedAchievement.useNotification);
//                 $(modalNotifMessageInput).val(selectedAchievement.notificationMessage);
//                 $(modalNotifMessageInput).prop('readonly',true);
//                 if(selectedAchievement.useNotification){
//                   $(modalNotifMessageInput).prop('readonly',false);
//                 }

//                 $("#modalachievementdiv").modal('toggle');
//               }
//           });

//           $("table#list_achievements").find(".delclass").off("click");
//           $("table#list_achievements").find(".delclass").on("click", function(event){
//             var selectedRow =  $(event.target).parent().parent()[0];
//             var selectedAchievement = achievementCollection[selectedRow.rowIndex-1];

//               achievementAccess.deleteAchievement(
//                 gameId,
//                 notification,
//                 function(data,type){
//                   loadTable();
//                 },
//                 function(status,error){},
//                 selectedAchievement.id
//               );
//           });
//       },
//       function(status,error) {
//         console.log(error);
//       }
//     );
//   };

//   var addNewButtonListener = function(){
//     $("button#addnewachievement").off('click');
//     $("button#addnewachievement").on('click', function(event) {
//       // count number of rows so the number can be incremented
//         // Adapt Modal with add form
//     modalSubmitButton.html('Submit');
//     $(modalTitle).html('Add a New Achievement');
//     $(modalInputId).val('');
//     $(modalInputId).prop('readonly', false);
//       $(modalInputName).val('');
//       $(modalInputDescription).val('');
//       $(modalInputBadgeId).val('');
//       $(modalInputPointValue).val('0');
//     $(modalNotifCheck).prop('checked',false);
//     $(modalNotifMessageInput).val('');
//       $("#modalachievementdiv").modal('toggle');

//     });
//   };

//   var checkBoxListener = function(){
//       // Check boxes in modal
//   // check box for point flag
//     $('input[type="checkbox"]#achievement_notification_check').off("click");
//     $('input[type="checkbox"]#achievement_notification_check').on("click",function(){
//           if($(this).prop("checked") == true){
//               $(modalNotifMessageInput).prop('readonly', false);
//           }
//           else if($(this).prop("checked") == false){
//               $(modalNotifMessageInput).prop('readonly', true);
//           }
//       });
//   }

//   var submitFormListener = function(){
//     $("form#modalachievementform").off();
//     $("form#modalachievementform").submit(function(e){
//       //disable the default form submission
//       e.preventDefault();
//       var formData = new FormData($(this)[0]);

//       var submitButtonText = $(modalSubmitButton).html();

//       var achievementId = $(modalInputId).val();
//       console.log(achievementId);
//       if(submitButtonText=='Submit'){
//         achievementAccess.createNewAchievement(
//           gameId,
//           formData,
//           notification,
//           function(data,type){
//             $("#modalachievementdiv").modal('toggle');
//             loadTable();
//           },
//           function(status,error){},
//           achievementId
//         );
//       }
//       else{
//         achievementAccess.updateAchievement(
//           gameId,
//           formData,
//           notification,
//           function(data,type){
//             $("#modalachievementdiv").modal('toggle');
//             loadTable();
//           },
//           function(status,error){},
//           achievementId
//         );
//       }

//       return false;
//     });
//   };

//   var elementDependenciesListener = function(){
//     $("#modalachievementdiv").find("#select_badge").off("click");
//     $("#modalachievementdiv").find("#select_badge").on("click", function(e){
//         // Retrieve badge data. The only difference is this is read only
//       $("table#list_badges_a").find("tbody").empty();
//       badgeAccess.getBadgesData(
//         gameId,
//         notification,
//         function(data,type){
//           for(var i = 0; i < data.rows.length; i++){
//             var badge = data.rows[i];
//             console.log(badge);
//             var newRow = "<tr><td class='text-center bidclass'>" + badge.id + "</td>";
//             newRow += "<td class='text-center bnameclass'>" + badge.name + "</td>";
//             newRow += "<td class='bdescclass'>" + badge.description + "</td>";
//             newRow += "<td><img class='text-center badgeimage badgeimagemini' src='"+ badgeAccess.getBadgeImage(gameId,badge.id) +"' alt='your image' /></td>";
//             newRow += "<td class='text-center'>" +"<button type='button' class='btn btn-xs btn-success badgeselectclass'>Select</button></td>";

//             $("table#list_badges_a").find("tbody").append(newRow);
//           }
//           $("table#list_badges_a").find(".badgeselectclass").off("click");
//           $("table#list_badges_a").find(".badgeselectclass").on("click", function(event){
//             var selectedRow =  $(event.target).parent().parent().find(".bidclass")[0];
//             var selectedBadgeId = selectedRow.textContent;
//             $("#modalachievementdiv").find("#panel_badge").collapse('toggle')
//             $("#modalachievementdiv").find("#achievement_badge_id").val(selectedBadgeId);
//           });
//         },
//         function(status,error) {
//           console.log(error);
//         }
//       );
//     });
//     // Badge in achievement -----------------------
//     $("#modalachievementdiv").find("button.btn#empty_badge").off('click');
//     $("#modalachievementdiv").find("button.btn#empty_badge").on('click', function(event) {
//       console.log("No badge");
//       $("#modalachievementdiv").find("#achievement_badge_id").val("");
//     });
//   };


//   return {
//     init : function(){
//       initialize();
//       loadTable();
//       addNewButtonListener();
//       elementDependenciesListener();
//       checkBoxListener();
//       submitFormListener();
//     }
//   };


// })();
