
 // global variables
var client, gameId, memberId, notification;
var oidc_userinfo;
var iwcCallback;

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
              resetContent()
            }
          }
      }
      else if(data.status == 401){
        resetContent()
      }

    }
    if(intent.action == "LOGIN"){
      var data = JSON.parse(intent.data);
      if(data.status == 200){
          oidc_userinfo = data.member;
          loggedIn(oidc_userinfo.preferred_username);

      }
      else if(data.status == 401){
        resetContent()
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
      modalInputQuestId = $("#modalquestdiv").find("#quest_id");
    modalInputQuestName = $("#modalquestdiv").find("#quest_name");
    modalInputQuestDescription = $("#modalquestdiv").find("#quest_desc");
    modalInputQuestAchievementId = $("#modalquestdiv").find("#achievement-select");
    modalInputQuestStatus = $("#modalquestdiv").find("#status-select");
    modalCheckQuestPoint = $("#modalquestdiv").find("#quest_point_check");
    modalInputQuestPoint = $("#modalquestdiv").find("#quest_point_value");
    modalCheckQuestQuestCompleted = $("#modalquestdiv").find("#quest_quest_check");
    modalInputQuestQuestCompleted = $("#modalquestdiv").find("#quest-id-completed-select");
    modalTitle = $("#modalquestdiv").find(".modal-title");
    modalQuestSubmitButton = $("#modalquestdiv").find("#modalquestsubmit");
    modalQuestActionGroup = $("#modalquestdiv").find('#quest_action_list_group');

    modalNotifCheck = $("#modalquestdiv").find("#quest_notification_check");
    modalNotifMessageInput = $("#modalquestdiv").find("#quest_notification_message");
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
  // client = new Las2peerWidgetLibrary("http://gaudi.informatik.rwth-aachen.de:8081/", iwcCallback);

  $("#login-alert h5").before("<h5>Welcome " + memberId + " !");
};

var init = function() {
  $('button#refreshbutton').off('click');
  $('button#refreshbutton').on('click', function() {
      sendIntentFetchGameId("quest");
  });
}

var initContent = function(){

  questAccess = new QuestDAO();
  achievementAccess = new AchievementDAO();
  actionAccess = new ActionDAO();
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
    var questid = button.data('questid') // Extract info from data-* attributes

    var index = _.map(questCollection,function(e) { return e.id; }).indexOf(questid);
    var modal = $(this)
    modal.find(".fa-tag").html("<span> " + questCollection[index].id+"</span>")
    modal.find('h4.card-title').text(questCollection[index].name)
    modal.find('p.desc').html("<i class=\"fa fa-align-justify\"></i> "+questCollection[index].description)
    modal.find('p.status').html("<i class=\"fa fa-ellipsis-h\"></i> "+questCollection[index].status)
    modal.find('p.ach').html("<i class=\"fa fa-star\"></i> "+questCollection[index].achievementId)
    if(questCollection[index].pointFlag){
      modal.find('#pvalue').removeClass("text-danger")
      modal.find('#pvalue').addClass("text-success")
    }else{
      modal.find('#pvalue').removeClass("text-success")
      modal.find('#pvalue').addClass("text-danger")
    }
    if(questCollection[index].questFlag){
      modal.find('#questconstraint').removeClass("text-danger")
      modal.find('#questconstraint').addClass("text-success")
    }else{
      modal.find('#questconstraint').removeClass("text-success")
      modal.find('#questconstraint').addClass("text-danger")
    }
    modal.find('#pvalue').html("<p><strong>Point</strong></p><p>"+questCollection[index].pointValue+"</p>")
    modal.find('#questconstraint').html("<p><strong>Quest</strong></p><p>"+questCollection[index].questIdCompleted+"</p>")

    var actionListHtml = ""
    _.forEach(questCollection[index].actionIds,function(action){
        actionListHtml += "<li class=\"list-group-item\"> <span class=\"tag tag-default tag-pill pull-xs-right\">"+action.times+"</span>"+action.actionId+"</li>"
      });
    modal.find('#action-list').html(actionListHtml)
    
    if(questCollection[index].useNotification){
      modal.find('p.msg').addClass("text-success");
      modal.find('p.msg').removeClass("text-danger");
    }else{
      modal.find('p.msg').addClass("text-danger");
      modal.find('p.msg').removeClass("text-success");
    }
      modal.find('p.msg').html("<i class=\"fa fa-comment-o\"></i> "+questCollection[index].notificationMessage)
    modal.find('.bedit').attr("onclick","editButtonListener(\""+questid+"\")")
    modal.find('.bdelete').attr("onclick","deleteButtonListener(\""+questid+"\")")
    modal.find('button').attr("data-questid",questid)

  })
  submitFormListener();
  checkBoxListener();
  elementDependenciesListener();

  // accordion in content Modal
  // $('#accordion').off()
  // $('#accordion').collapse({
  //   toggle: false
  // })
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

function editButtonListener(questId){
    if(questCollection){

      var index = _.map(questCollection,function(e) { return e.id; }).indexOf(questId);
                var selectedQuest = questCollection[index];

                $(modalQuestSubmitButton).html('Update');
                $(modalTitle).html('Update a Quest');
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

}

function deleteButtonListener(questId){
    if(questCollection){


      questAccess.deleteQuest(
        gameId,
        notification,
        function(data,type){
          loadContent();
        },
        function(status,error){
        },
        questId
      );


      $(".modal").modal('hide');

  }

}

function addButtonListener(){
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

};

function refreshButtonListener(){
  sendIntentFetchGameId("quest");
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
      questAccess.getQuestsData(
      gameId,
      notification,
      function(data,type){
          $("#modalquestdiv").modal('hide');
          questCollection = data.rows;

        if(questCollection.length > 0){
          var listTemplate = _.template($("#list-quest").html());
          var listGroupElmt = $(".list-quest-group");

          var htmlData = ""
          listGroupElmt.empty();
          _.forEach(questCollection,function(quest){
            console.log(quest)
            htmlData += listTemplate(quest);
          });
          listGroupElmt.append(htmlData);
        }
        else{
          var listGroupElmt = $(".list-quest-group");
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
              $(modalInputQuestQuestCompleted).prop('disabled', true);
          }
          else if($(this).prop("checked") == true){
      // Enable input text
      // Show panel completed
              $(modalInputQuestQuestCompleted).prop('disabled', false);

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

      // // Enable event listener
      // $('#quest_completed_list').find('a').off('click');
      // $('#quest_completed_list').find('a').on('click', function (e) {

      //     var target = $(e.target).attr("id") // activated tab
      //     console.log(target);
      //     $(modalInputQuestQuestCompleted).val(target);
      //       $('#panel_quest_completed').collapse("hide");
      // });

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

        showErrorMessageInModal("Achievement should be selected!")
        return false;
      }

      // Point value is needed if point flag is checked
      var questpointflag = $(modalCheckQuestPoint).prop('checked');
      var questpointvalue = $(modalInputQuestPoint).val();
      if(questpointflag){
        if(questpointvalue == ''){
          showErrorMessageInModal("Point value should be set!")
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
          showErrorMessageInModal("Quest ID completed should be set!")
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
        showErrorMessageInModal("Actions should be selected!")
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
          showErrorMessageInModal("Message notification should be set!")
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
      console.log(JSON.stringify(content))

      if(submitButtonText=='Submit'){
        questAccess.createNewQuest(
          gameId,
          content,
          notification,
          function(data,type){
            $("#modalquestdiv").modal('toggle');
            loadContent();
          },
          function(status,error){

            showErrorMessageInModal(error.message)
          },
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
          $("#contentModal").modal('hide');
            loadContent();
          },
          function(status,error){
            showErrorMessageInModal(error.message)
          },
          questid
        );
      }
      return false;
    });

  };


  // Event listener for other elements rather than quest itself
var elementDependenciesListener = function(){
      $('#modalquestdiv').off();
    $('#modalquestdiv').on('show.bs.modal', function (event) {
      
      // Get id from the existing modal
      var quest_id = $("#quest_id").val()

      // If update mode
        var modal = $(this)
        achievementAccess.getAchievementsData(
          gameId,
          notification,
          function(data,type){

              var optionElmt = modal.find('#achievement-select');
              var htmlData = ""
              htmlData += "<option value=\"\">No achievement</option>"
              if(data.rows){
                _.forEach(data.rows,function(achievement){
                  htmlData += "<option value=\""+achievement.id+"\">"+achievement.id+"</option>"
                });
                optionElmt.html(htmlData);


                if(quest_id){
                  var index = _.map(questCollection,function(e) { return e.id; }).indexOf(quest_id);
                  $('#achievement-select option:contains(' + questCollection[index].achievementId + ')').prop({selected: true});
                }
              }else{
                htmlData = "<option value=\"\" selected>No achievement found</option>"
                optionElmt.html(htmlData);
              }


          },
          function(status,error) {
            console.log(error);
          }
        );
      
        // completed quest constraint
        if(questCollection){
              var optionElmt = modal.find('#quest-id-completed-select');
              var htmlData = ""

              _.forEach(questCollection,function(quest){
                htmlData += "<option value=\""+quest.id+"\">"+quest.id+"</option>"
              });
              optionElmt.html(htmlData);
        }else{
            var optionElmt = modal.find('#quest-id-completed-select');
                htmlData = "<option value=\"\" selected>No quest found</option>"
                optionElmt.html(htmlData);
        }

      // If add mode
      // do nothing


    });

    // $("#modalquestdiv").find("#select_achievement").off("click");
    // $("#modalquestdiv").find("#select_achievement").on("click", function(e){

    //   // var endPointURL = epURL+"games/achievements/"+currentGameId;
    //   var tableElement = $("table#list_achievements_a");
    //   tableElement.find("tbody").empty();
    //   achievementAccess.getAchievementsData(
    //     gameId,
    //     notification,
    //     function(data,type){
    //       console.log(data);
    //         for(var i = 0; i < data.rows.length; i++){
    //           var achievement = data.rows[i];
    //           var newRow = "<tr><td class='text-center idclass'>" + achievement.id + "</td>";
    //           newRow += "<td class='text-center nameclass'>" + achievement.name + "</td>";
    //           newRow += "<td class='descclass'>" + achievement.description + "</td>";
    //           newRow += "<td class='pointvalueclass'>" + achievement.pointValue + "</td>";
    //           //newRow += "<td class='badgeidclass'> <a href='#' class='show-badge' id='"+ achievement.badgeId +"' data-row-badgeid='" + achievement.badgeId + "' >"+achievement.badgeId+"</a></td>";
    //           newRow += "<td class='badgeidclass'>"+achievement.badgeId+"</td>";

    //           newRow += "<td class='text-center'>" + "<button type='button' class='btn btn-xs btn-warning selectclass'>Select</button></td> ";

    //           $("table#list_achievements_a").find("tbody").append(newRow);
    //         }


    //         $("table#list_achievements_a").find(".selectclass").off("click");
    //         $("table#list_achievements_a").find(".selectclass").on("click", function(event){
    //           var selectedAchievementId =  $(event.target).parent().parent().find(".idclass")[0].textContent;

    //           $("#modalquestdiv").find("#panel_achievement").collapse('toggle')
    //           $("#modalquestdiv").find("#quest_achievement_id").val(selectedAchievementId);

    //         });

    //     },
    //     function(status,error) {
    //       console.log(error);
    //     }
    //   );
    $("#modalquestdiv").find("#select_action").off();
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
                showErrorMessageInModal("Action is already selected!")
              }
          });

          },
          function(status,error) {
            showErrorMessageInModal(error.message)
            console.log(error);
          }
      );

    });


}

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
};

function showErrorMessageInModal(text){
    $("#modalquestform").before("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>"+text+"</div>")
}