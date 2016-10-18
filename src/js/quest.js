
 // global variables
var client, gameId, memberId, notification;
var oidc_userinfo;
var iwcCallback;

function setGameIDContext(gameId_){
  gameId = gameId_;
  //$('#game-id-text').html(gameId);
  if(gameId){
    //gadgets.window.setTitle("Gamification Manager Quest - " + gameId);
    $("h4#title-widget").text("Game ID : " + gameId);
    if(gameId == ""){
      $("table#list_quests").find("tbody").empty();
    }
    else{
      questModule.init();
    }
  }

}
var initIWC = function(){
  notification = new gadgets.MiniMessage("GAMEQUEST");

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
          if(data.receiver == "quest"){
            if(data.gameId){
              setGameIDContext(data.gameId);
            }
            else{
              miniMessageAlert(notification,"Game ID in Gamification Manager Game is not selected","danger")
            }
          }
      }
      else if(data.status == 401){
        $("table#list_quests").find("tbody").empty();
        var newRow = "<tr class='text-center'><td colspan='14'>You are not logged in</td>";
        $("table#list_quests").find("tbody").append(newRow);
      }

    }
    if(intent.action == "LOGIN"){
      var data = JSON.parse(intent.data);
      if(data.status == 200){
          oidc_userinfo = data.member;
          loggedIn(oidc_userinfo.preferred_username);

      }
      else if(data.status == 401){
        $("table#list_quests").find("tbody").empty();
        var newRow = "<tr class='text-center'><td colspan='14'>You are not logged in</td>";
        $("table#list_quests").find("tbody").append(newRow);
      }
    }
    // if(intent.action == "FETCH_LOGIN_CALLBACK"){
    //   var data = JSON.parse(intent.data);
    //   if(data.receiver == "quest"){
    //     if(data.status == 200){
    //       oidc_userinfo = data.member;
    //         loggedIn(oidc_userinfo.preferred_username);
    //     }
    //   }
    // }
  };
  loadLas2peerWidgetLibrary();
  // $('button#refreshbutton').on('click', function() {
  //     sendIntentFetchLogin("quest");
  // });
};

var loadLas2peerWidgetLibrary = function(){
  try{
    client = new Las2peerWidgetLibrary("{{= grunt.config('endPointQuest') }}", iwcCallback);
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

  $("table#list_quests").find("tbody").empty();
  var newRow = "<tr class='text-center'><td colspan='14'>Hello "+memberId+"</td>";
  $("table#list_quests").find("tbody").append(newRow);
};

var init = function() {
  $('button#refreshbutton').off('click');
  $('button#refreshbutton').on('click', function() {
      sendIntentFetchGameId("quest");
  });
}


// function signinCallback(result) {
//     if(result === "success"){
//       memberId = oidc_userinfo.preferred_username;
//
//         console.log(oidc_userinfo);
//         init();
//
//     } else {
//       miniMessageAlert(notification,"Sign in failed!. "+ result,"danger");
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

// function sendIntentFetchLogin(sender){
//   client.sendIntent(
//     "FETCH_LOGIN",
//     sender
//   );
// }

$(document).ready(function() {
  initIWC();
});



var questModule = (function() {

  var questAccess, achievementAccess, actionAccess, badgeAccess;
  var questCollection;
  var modalInputQuestId;
  var modalInputQuestName;
  var modalInputQuestDescription;
  var modalInputQuestAchievementId;
  var modalInputQuestStatus;
  var modalCheckQuestPoint;
  var modalInputQuestPoint;
  var modalCheckQuestQuestCompleted;
  var modalInputQuestQuestCompleted;
  var modalTitle;
  var modalQuestActionGroup;
  var modalQuestSubmitButton;

  var modalNotifCheck;
  var modalNotifMessageInput;
  var initialize = function(){

    questAccess = new QuestDAO();
    achievementAccess = new AchievementDAO();
    actionAccess = new ActionDAO();
    badgeAccess = new BadgeDAO();
    questCollection = [];
    modalInputQuestId = $("#modalquestdiv").find("#quest_id");
    modalInputQuestName = $("#modalquestdiv").find("#quest_name");
    modalInputQuestDescription = $("#modalquestdiv").find("#quest_desc");
    modalInputQuestAchievementId = $("#modalquestdiv").find("#quest_achievement_id");
    modalInputQuestStatus = $("#modalquestdiv").find("#quest_status_text");
    modalCheckQuestPoint = $("#modalquestdiv").find("#quest_point_check");
    modalInputQuestPoint = $("#modalquestdiv").find("#quest_point_value");
    modalCheckQuestQuestCompleted = $("#modalquestdiv").find("#quest_quest_check");
    modalInputQuestQuestCompleted = $("#modalquestdiv").find("#quest_id_completed");
    modalTitle = $("#modalquestdiv").find(".modal-title");
    modalQuestSubmitButton = $("#modalquestdiv").find("#modalquestsubmit");
    modalQuestActionGroup = $("#modalquestdiv").find('#quest_action_list_group');

    modalNotifCheck = $("#modalquestdiv").find("#quest_notification_check");
    modalNotifMessageInput = $("#modalquestdiv").find("#quest_notification_message");
  };

  function renderQuestTable(data){

    $("table#list_quests").find("tbody").empty();
    if(data.rows.length < 1){
        var newRow = "<tr class='text-center'><td colspan='14'>No data Found !</td>";
        $("table#list_quests").find("tbody").append(newRow);
     }
     else if(data.message){
       var newRow = "<tr class='text-center'><td colspan='14'>"+data.message+"</td>";
       $("table#list_quests").find("tbody").append(newRow);
     }
     else{

          for(var i = 0; i < data.rows.length; i++){
            var quest = data.rows[i];
            
            var newRow = "<tr class='text-center'><td class='text-center idclass'>" + quest.id + "</td>";
            newRow += "<td class='text-center nameclass'>" + quest.name + "</td>";
            newRow += "<td class='descclass'>" + quest.description + "</td>";
            newRow += "<td class='text-center statusclass'>" + quest.status + "</td>";
            newRow += "<td class='text-center achievementidclass'>" + quest.achievementId + "</td>";
            newRow += "<td class='text-center questflagclass'>" + quest.questFlag + "</td>";

            if(quest.questIdCompleted == null){
              newRow += "<td class='text-center questidcompletedclass'></td>";
            }else{
              newRow += "<td class='text-center questidcompletedclass'>" + quest.questIdCompleted + "</td>";
            }
            newRow += "<td class='text-center pointflagclass'>" + quest.pointFlag + "</td>";
            newRow += "<td class='text-center pointvalueclass'>" + quest.pointValue + "</td>";
            newRow += "<td class='actionidsclass'>";

            var htmlelement = "<ul class='list-group'>";
            for (var j = 0; j < quest.actionIds.length; j++) {
               htmlelement += "<li class='list-group-item'><span class='badge'>"+quest.actionIds[j].times+"</span>"+quest.actionIds[j].actionId +"</li>"
            }
            htmlelement += "</ul>";
            var poptitle = "<li class='list-group-item'>Action ID - times</li>";
            var popaction = "<a href=\"#\" data-placement=\"top\" data-html=\"true\" data-trigger=\"hover\" data-toggle=\"popover\" data-content=\""+htmlelement+" \" title=\""+poptitle+"\">Actions used</a>";

            newRow +=  popaction+"</td>";
            newRow += "<td class='text-center usenotifclass''>" + quest.useNotification + "</td>";
            newRow += "<td class='messageclass''>" + quest.notificationMessage + "</td>";
            newRow += "<td class='text-center'>" + "<button type='button' class='btn btn-xs btn-warning updclass'>Edit</button></td> ";
            newRow += "<td class='text-center'>" +"<button type='button' class='btn btn-xs btn-danger delclass'>Delete</button></td>";

            $("table#list_quests").find("tbody").append(newRow);
          }
     }

  }

  var loadTable = function(){

    //$("table#list_quests").find("tbody").empty();
    questAccess.getQuestsData(
      gameId,
      notification,
      function(data,type){
          $("#modalquestdiv").modal('hide');
          questCollection = data.rows;
          renderQuestTable(data);

          $("[data-toggle=popover]").popover({
              placement:'right'
          });

          $("table#list_quests").find(".updclass").off("click");
          $("table#list_quests").find(".updclass").on("click", function(event){
              if(questCollection){
                var selectedRow =  $(event.target).parent().parent()[0];
                var selectedQuest = questCollection[selectedRow.rowIndex-1];

                $(modalQuestSubmitButton).html('Update');
                $(modalTitle).html('Update an Level');
                $(modalInputQuestId).val(selectedQuest.id);
                $(modalInputQuestId).prop('readonly', true);
                $(modalInputQuestName).val(selectedQuest.name);
                $(modalInputQuestDescription).text(selectedQuest.description);
                $(modalInputQuestAchievementId).val(selectedQuest.achievementId);
                $(modalInputQuestStatus).val(selectedQuest.status);

                $(modalCheckQuestPoint).prop('checked',selectedQuest.pointFlag);
                $(modalInputQuestPoint).val(selectedQuest.pointValue);
                $(modalCheckQuestQuestCompleted).prop('checked',selectedQuest.questFlag);
                $(modalInputQuestQuestCompleted).val(selectedQuest.questIdCompleted);

                $(modalNotifCheck).prop('checked',selectedQuest.useNotification);
                $(modalNotifMessageInput).val(selectedQuest.notificationMessage);
                $(modalQuestActionGroup).empty();

                // enable checked input if the flag is true
                $(modalInputQuestPoint).prop('readonly',true);
                if(selectedQuest.pointFlag){
                  $(modalInputQuestPoint).prop('readonly',false);
                }

                $(modalNotifMessageInput).prop('readonly',true);
                if(selectedQuest.useNotification){
                  $(modalNotifMessageInput).prop('readonly',false);
                }
                // action list group
                for(var i = 0; i < selectedQuest.actionIds.length; i++){
                  renderAppendActionListInModal(selectedQuest.actionIds[i].actionId,selectedQuest.actionIds[i].times);
                }

                $("#modalquestdiv").modal('toggle');
              }
          });

          $("table#list_quests").find(".delclass").off("click");
          $("table#list_quests").find(".delclass").on("click", function(event){
            var selectedRow =  $(event.target).parent().parent()[0];
            var selectedQuest = questCollection[selectedRow.rowIndex-1];
            console.log(selectedQuest);
              questAccess.deleteQuest(
                gameId,
                notification,
                function(data,type){
                  loadTable();
                },
                function(status,error){
                },
                selectedQuest.id
              );
          });
      },
      function(status,error) {
      }
    );
  };

  var addNewButtonListener = function(){
    $("#addnewquest").off('click');
    $("#addnewquest").on('click', function(event) {
    // Adapt Modal with add form
        $(modalQuestActionGroup).empty();
      $(modalQuestSubmitButton).html('Submit');
      $(modalInputQuestId).prop('readonly', false);
      $(modalInputQuestId).val('');
      $(modalInputQuestDescription).val('');
      $(modalTitle).html('Add a New Quest');
        $(modalInputQuestName).val('');
        $(modalInputQuestDescription).text('');
        $(modalInputQuestAchievementId).val('');
        $(modalInputQuestAchievementId).prop('readonly',true);
        $(modalInputQuestStatus).val('REVEALED');
        $(modalCheckQuestPoint).prop('checked', false);
        $(modalInputQuestPoint).val('');
        $(modalCheckQuestQuestCompleted).prop('checked', false);
        $(modalInputQuestQuestCompleted).val(null);
      $(modalNotifCheck).prop('checked',false);
      $(modalNotifMessageInput).val('');
        $("#modalquestdiv").modal('toggle');

    });
  };

  var renderAppendActionListInModal = function(selectedaction,selectedtimes){
    // put in the list group
      var htmlelement = "<li class=\"list-group-item\" id=\""+selectedaction+"\"><div class=\"input-group\">"+selectedaction+"  -  <span id=\"times\"> "+selectedtimes+" times</span>"+
             "<span class=\"input-group-btn\"><button type=\"button\" id=\""+selectedaction+"\" class=\"close\" >&times;</button></span></div></li>";
    $('#quest_action_list_group').append(htmlelement);

    // Button delete listener
    $('#quest_action_list_group').find('button').off("click");
    $('#quest_action_list_group').find('button').on("click", function(e){
      var buttoniddeleted = $(this).attr("id");
      $('#quest_action_list_group').find('li#'+buttoniddeleted).remove();
    });
  }


  var dropDownListener = function(){
        // dropdown
      $('#quest_dropdown_status').find('a').off('click');
      $('#quest_dropdown_status').find('a').on('click', function (e) {

        var target = $(e.target).attr("href") // activated tab
        console.log(target);
        switch(target) {
          case "#revealed":
            $(modalInputQuestStatus).val('REVEALED');
          break;
          case "#hidden":
            $(modalInputQuestStatus).val('HIDDEN');
          break;
          case "#completed":
            $(modalInputQuestStatus).val('COMPLETED');
          break;
      }
    });
  }

  var checkBoxListener = function(){

      // Check boxes in modal
    // check box for point flag
    $('input[type="checkbox"]#quest_notification_check').click(function(){
          if($(this).prop("checked") == true){
              $(modalNotifMessageInput).prop('readonly', false);
          }
          else if($(this).prop("checked") == false){
              $(modalNotifMessageInput).prop('readonly', true);
          }
      });

      // Check boxes in modal
    // check box for point flag
    $('input[type="checkbox"]#quest_point_check').click(function(){
          if($(this).prop("checked") == true){
              $(modalInputQuestPoint).prop('readonly', false);
          }
          else if($(this).prop("checked") == false){
              $(modalInputQuestPoint).prop('readonly', true);
          }
      });
    // check box for quest flag
    $('input[type="checkbox"]#quest_quest_check').click(function(){
      // Disable input text
      // Hide panel completed
          if($(this).prop("checked") == false){
              $(modalInputQuestQuestCompleted).prop('readonly', true);
            $('#panel_quest_completed').collapse("hide");
          }
          else if($(this).prop("checked") == true){
      // Enable input text
      // Show panel completed
              $(modalInputQuestQuestCompleted).prop('readonly', false);

            $('#panel_quest_completed').collapse("show");
          }

          // Process the data, get data from quest table
          $('#quest_completed_list').empty();

      var questid = $(modalInputQuestId).val();
      var htmlelement="";
      for (i = 0; i < questCollection.length; i++) {

        var questidcompleted = questCollection[i].id;

        if(questidcompleted != undefined){
          if(questidcompleted != questid){
            htmlelement += "<a href=\"#\" id=\""+questidcompleted+"\" class=\"list-group-item\">"+questidcompleted+"</a>";
          }
        }
      }
      $('#quest_completed_list').append(htmlelement);

      // Enable event listener
      $('#quest_completed_list').find('a').off('click');
      $('#quest_completed_list').find('a').on('click', function (e) {

          var target = $(e.target).attr("id") // activated tab
          console.log(target);
          $(modalInputQuestQuestCompleted).val(target);
            $('#panel_quest_completed').collapse("hide");
      });

      });
  };

  var submitFormListener = function(){
    $("button#modalquestsubmit").off("click");
    $("button#modalquestsubmit").on("click", function(e){
      //disable the default form submission
      e.preventDefault();

      // gather the data to be sent
      var questid = $(modalInputQuestId).val();
      var questname = $(modalInputQuestName).val();
      var questdescription = $(modalInputQuestDescription).val();
      var queststatus = $(modalInputQuestStatus).val();

      // Validate mandatory achievement element
      var questachievementid =  $(modalInputQuestAchievementId).val();
      if(questachievementid == ''){

        miniMessageAlert(notification,"Achievement should be selected!","danger");
        return false;
      }

      // Point value is needed if point flag is checked
      var questpointflag = $(modalCheckQuestPoint).prop('checked');
      var questpointvalue = $(modalInputQuestPoint).val();
      if(questpointflag){
        if(questpointvalue == ''){
          miniMessageAlert(notification,"Point value should be set!","danger");
          return false;
        }
      }else{
        questpointvalue = 0;
      }

      // Quest id completed is needed if quest flag is checked
      var questquestflag = $(modalCheckQuestQuestCompleted).prop('checked');
      var questidcompleted = $(modalInputQuestQuestCompleted).val();
      if(questquestflag){
        if(questidcompleted == '' || questidcompleted == null ||questidcompleted==undefined){
          miniMessageAlert(notification,"Quest ID completed should be set!","danger");
          return false;
        }
      }
      if(questidcompleted == '' || questidcompleted == null ||questidcompleted==undefined){
        questidcompleted = null;
      }


      // list of action id of the quest
      var actionids = {
          questactionids: []
      };

      var list = $(modalQuestActionGroup).find('li');
      if(list.length == 0){
        miniMessageAlert(notification,"Actions should be selected!","danger");

        return false;
      }
      for(var i = 0;i < list.length; i++) {


          var action = $(list[i]).prop('id');
          var times = $(list[i]).find('span#times').text();

          actionids.questactionids.push({
              action : action,
              times  : parseInt(times)
          });
      }

      // Notification
      var questnotifflag = $(modalNotifCheck).prop('checked');
      var questnotifmessage = $(modalNotifMessageInput).val();
      if(questnotifflag){
        if(questnotifmessage == undefined){
          miniMessageAlert(notification,"Message notification should be set!","danger");

          return false;
        }
      }

      // Populate data into an object ready to be sent
       var content = {
        questid:questid,
        questname :questname,
        questdescription :questdescription,
        queststatus: queststatus,
        questpointflag :questpointflag,
        questpointvalue : parseInt(questpointvalue),
        questquestflag :questquestflag,
        questidcompleted :questidcompleted,
        questactionids: actionids.questactionids,
        questachievementid: questachievementid,
        questnotificationcheck:questnotifflag,
        questnotificationmessage:questnotifmessage
       }


      var questid = $("#modalquestdiv").find("#quest_id").val();

      var submitButtonText = $("button#modalquestsubmit").html();


      if(submitButtonText=='Submit'){
        questAccess.createNewQuest(
          gameId,
          content,
          notification,
          function(data,type){
            $("#modalquestdiv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          questid
        );
      }
      else{
        questAccess.updateQuest(
          gameId,
          content,
          notification,
          function(data,type){
            $("#modalquestdiv").modal('toggle');
            loadTable();
          },
          function(status,error){},
          questid
        );
      }
      return false;
    });

  };

  // Event listener for other elements rather than quest itself
  var elementDependenciesListener = function(){
    $("#modalquestdiv").find("#select_achievement").off("click");
    $("#modalquestdiv").find("#select_achievement").on("click", function(e){

      // var endPointURL = epURL+"games/achievements/"+currentGameId;
      var tableElement = $("table#list_achievements_a");
      tableElement.find("tbody").empty();
      achievementAccess.getAchievementsData(
        gameId,
        notification,
        function(data,type){
          console.log(data);
            for(var i = 0; i < data.rows.length; i++){
              var achievement = data.rows[i];
              var newRow = "<tr><td class='text-center idclass'>" + achievement.id + "</td>";
              newRow += "<td class='text-center nameclass'>" + achievement.name + "</td>";
              newRow += "<td class='descclass'>" + achievement.description + "</td>";
              newRow += "<td class='pointvalueclass'>" + achievement.pointValue + "</td>";
              //newRow += "<td class='badgeidclass'> <a href='#' class='show-badge' id='"+ achievement.badgeId +"' data-row-badgeid='" + achievement.badgeId + "' >"+achievement.badgeId+"</a></td>";
              newRow += "<td class='badgeidclass'>"+achievement.badgeId+"</td>";

              newRow += "<td class='text-center'>" + "<button type='button' class='btn btn-xs btn-warning selectclass'>Select</button></td> ";

              $("table#list_achievements_a").find("tbody").append(newRow);
            }

            // $("table#list_achievements_a").find(".show-badge").popover({
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
            // $("table#list_achievements_a").find(".show-badge").off("click");
            // $("table#list_achievements_a").find(".show-badge").on("click", function(event){
            //   // Get badge data with id
            //   event.preventDefault();
            //   // Get id of the selected element to be attached with popover
            //   var idelement = "#" + $(event.target).data("row-badgeid");
            //   badgeAccess.getBadgeDataWithId(
            //     gameId,
            //     $(event.target).data("row-badgeid"),
            //     function(data,type){
            //       // Render in popover
            //       console.log(data);
            //       console.log($(event.target));
            //       $("#badge-popover-content").find("#badgeidpopover").html(data.id);
            //       $("#badge-popover-content").find("#badgenamepopover").html(data.name);
            //       $("#badge-popover-content").find("#badgedescpopover").html(data.description);
            //       $("#badge-popover-content").find("#badgeimagepopover").attr("src",useAuthentication(data.imagePath))
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

            $("table#list_achievements_a").find(".selectclass").off("click");
            $("table#list_achievements_a").find(".selectclass").on("click", function(event){
              var selectedAchievementId =  $(event.target).parent().parent().find(".idclass")[0].textContent;

              $("#modalquestdiv").find("#panel_achievement").collapse('toggle')
              $("#modalquestdiv").find("#quest_achievement_id").val(selectedAchievementId);

            });

        },
        function(status,error) {
          console.log(error);
        }
      );

    });

    $("#modalquestdiv").find("#select_action").off("click");
    $("#modalquestdiv").find("#select_action").on("click", function(e){

      $("table#list_actions_a").find("tbody").empty();
      actionAccess.getActionsData(
        gameId,
        notification,
        function(data,type){
          console.log(data);
          for(var i = 0; i < data.rows.length; i++){
            var action = data.rows[i];
            var newRow = "<tr><td class='text-center idclass'>" + action.id + "</td>";
            newRow += "<td class='text-center'><input type=\"number\" class=\"form-control\" value=\"1\" id=\""+action.id+"\" ></td>";
            newRow += "<td class='text-center'><button type=\"button\" class=\"btn btn-xs btn-default selectclass\" data-row-id=\"" + action.id + "\">select</button></td> ";

              $("table#list_actions_a").find("tbody").append(newRow);
            }

            $("table#list_actions_a").find(".selectclass").off("click");
            $("table#list_actions_a").find(".selectclass").on("click", function(event){

              var selectedaction =  $(event.target).data("row-id");
              var selectedtimes = $('#list_actions_a tbody tr input#'+selectedaction).val();

              // add new if the action is not exist yet
              if($('#quest_action_list_group').find('li#' + selectedaction).length == 0){
                renderAppendActionListInModal(selectedaction,selectedtimes);
                $('#panel_action').collapse('hide');
              }
              else{
                miniMessageAlert(notification,"Action is already selected!","danger");
              }
          });

          },
          function(status,error) {
            console.log(error);
          }
      );

    });
  };

  return {
    init : function(){
      initialize();
      loadTable();
      addNewButtonListener();
      dropDownListener();
      checkBoxListener();
      elementDependenciesListener();
      submitFormListener();
    }
  };


})();
