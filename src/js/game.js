
 // global variables
var client, gameId, memberId,loginStatus, notification;

function setGameIDContext(gameId_){
  gameId = gameId_;
  //gadgets.window.setTitle("Game title : " + gameId);;
  $("h4#title-widget").text("Game ID : " + gameId);
  sendIntentRefreshGameId(gameId);

}

var init = function() {
  var iwcCallback = function(intent) {
    if(intent.action == "FETCH_APPID"){
      sendIntentFetchGameIdCallback(gameId,intent.data);
    }
    // if(intent.action == "FETCH_LOGIN"){
    //   sendIntentFetchLoginCallback(statusLogin,oidc_userinfo,intent.data);
    // }
  };
  client = new Las2peerWidgetLibrary("<%= grunt.config('endPointServiceURL') %>", iwcCallback);
  notification = new gadgets.MiniMessage("GAMEAPP");
  checkAndRegisterUserAgent();

  $('button#refreshbutton').off('click');
  $('button#refreshbutton').on('click', function() {
    getGamesData();
  });


// Handler when the form in "Create New Game" is submitted
      // Game ID will be retrieved from the service and will be put on the id attribute in class maincontent
  $("form#createnewgameform").off();
  $("form#createnewgameform").submit(function(e){
    //disable the default form submission
    e.preventDefault();
    var formData = new FormData($(this)[0]);
    client.sendRequest(
      "POST",
      "gamification/games/data",
      formData,
      false,
      {},
      function(data, type){
        console.log(data);
        var selectedGameId = $("#createnewgame_gameid").val();
        // setGameIDContext(selectedGameId);
        $("#createnewgame").modal('toggle');
        miniMessageAlert(notification,"New game "+ selectedGameId +" is added !", "success");
        reloadActiveTab();
        getGamesData();
        return false;
      },
      function(error) {
        miniMessageAlert(notification,"Failed to create new game : "+ selectedGameId +" !", "danger");
      }
    );
    return false;
  });
}



function signInCallback(result) {
    if(result === "success"){
      loginStatus = 200;
      memberId = oidc_userinfo.preferred_username;
      console.log(oidc_userinfo);
      // Change Login button to Refresh button
      $('button#refreshbutton').html("<span class=\" glyphicon glyphicon-refresh\">");
      init();
    } else {
      loginStatus = 401;
      console.log(result);
      console.log(window.localStorage["access_token"]);
    }
    if(result === "success"){
      $("#login-text").find("h4").html("Welcome " + memberId + "!");
    } else {
      $("#login-text").find("h4").html("You are not authenticated, try to login using Open ID Learning Layers.");
    }
}

function checkAndRegisterUserAgent(){
  client.sendRequest("POST",
        "gamification/games/validation",
        "",
        "application/json",
        {},
        function(data,type){
        getGamesData();
        sendIntentLogin();
         $("button#addnewgame").off('click');
          $("button#addnewgame").on('click', function(event) {
              $("#createnewgame").modal('toggle');
          });
      },
        function(error) {
              $('#gameselection').before('<div class="alert alert-danger">Error connecting web services</div>');
          }
      );
}


$(document).ready(function() {
  $('button#refreshbutton').off('click');
  $('button#refreshbutton').on('click', function() {
      $("#login-text").find("h4").html("Logging in...");
    learningLayerLogin();
  });
});

var gameListener = function(){
  $("table#list_global_games_table").find(".bglobgameclass").off("click");
  $("table#list_global_games_table").find(".bglobgameclass").on("click", function(event){
    //Get Value in gameidid
    var selectedGameId =  $(event.target).parent().parent().find("td#gameidid")[0].textContent;
    console.log(selectedGameId);
    $('#alertglobalgame_text').text('Are you sure you want to open ' + selectedGameId +"?. You will be registered to selected game.");
    $('#alertglobalgame').find('button').attr('id',selectedGameId);
    $("#alertglobalgame").modal('show');
  });

  $('#alertglobalgame').find('button.btn').off('click');
  $('#alertglobalgame').find('button.btn').on('click', function(event) {
    var currentGameId = $(this).attr('id');
    $("#alertglobalgame").modal('hide');

    addMemberToGame(currentGameId,memberId);

  });

  function addMemberToGame(currentGameId,memberId){
    // add member to game
    client.sendRequest("POST",
      "gamification/games/data/"+currentGameId+"/"+memberId,
      "",
      "application/json",
      {},
      function(data,type){
        console.log(data);

        //setGameIDContext(currentGameId);
        miniMessageAlert(notification,memberId + " is added to "+ currentGameId, "success");
        getGamesData();

      },
      function(error) {
           // Notification failed to add member to game
          miniMessageAlert(notification,"Failed to add " + memberId + " to "+ currentGameId, "danger");
          console.log(error);
        }
    );
  }
  $("table#list_registered_games_table").find(".breggameclass").off("click");
  $("table#list_registered_games_table").find(".breggameclass").on("click", function(event){
    var selectedGameId =  $(event.target).parent().parent().find("td#gameidid")[0].textContent;

    $('#alertregisteredgame_text').text('Are you sure you want to open ' + selectedGameId +"?");
    $('#alertregisteredgame').find('button').attr('id',selectedGameId);
    $("#alertregisteredgame").modal('show');
  });

  $('#alertregisteredgame').find('button.btn').off('click');
  $('#alertregisteredgame').find('button.btn').on('click', function(event) {
    console.log("CLICK");
    var currentGameId = $(this).attr('id');

    setGameIDContext(currentGameId);
    $("#alertregisteredgame").modal('hide');
  });

};

function getGamesData(){
  client.sendRequest("GET",
      "gamification/games/list/separated",
      "",
      "application/json",
      {},
      function(data,type){

        console.log(data);
        //Global games
        $("#globalgamestbody").empty();
        for(var i = 0; i < data[0].length; i++){
          var gameData = data[0][i];
          var newRow = "<tr><td class='text-center'>" + "<button type='button' class='btn btn-xs btn-success bglobgameclass'>Register</button></td> ";
          newRow += "<td id='gameidid'>" + gameData.id + "</td>";
          newRow += "<td id='gamedescid'>" + gameData.description + "</td>";
        newRow += "<td id='gamecommtypeid'>" + gameData.commType + "</td>";

          $("#list_global_games_table tbody").append(newRow);
        }

        //User games
        $("#registeredgamestbody").empty();
        for(var i = 0; i < data[1].length; i++){
          var gameData = data[1][i];
          var newRow = "<tr><td class='text-center'>" + "<button type='button' class='btn btn-xs btn-success breggameclass'>Select</button></td> ";
          newRow += "<td id='gameidid'>" + gameData.id + "</td>";
          newRow += "<td id='gamedescid'>" + gameData.description + "</td>";
        newRow += "<td id='gamecommtypeid'>" + gameData.commType + "</td>";
        newRow += "<td><button type='button' onclick='removeGameHandler(this)' data-dismiss='modal' data-toggle='modal' data-target='#alertremovegame' class='btn btn-xs btn-danger '>Remove</button></td>";
        newRow += "<td><button type='button' onclick='deleteGameHandler(this)' data-dismiss='modal' data-toggle='modal' data-target='#alertdeletegame' class='btn btn-xs btn-danger '>Delete</button></td>";

          $("#list_registered_games_table tbody").append(newRow);
        }

        gameListener();

      },
      function(error) {
            // Notification failed to get game data
      console.log(error);
       }
    );

}

var useAuthentication = function(rurl){
    if(rurl.indexOf("\?") > 0){
      rurl += "&access_token=" + window.localStorage["access_token"];
    } else {
      rurl += "?access_token=" + window.localStorage["access_token"];
    }
    return rurl;
  }






function removeGameHandler(element){
  var selectedgameid =  $(element).parent().parent().find("td#gameidid")[0].textContent;
  $('#alertremovegame').find('button.btn').attr('id',selectedgameid);
  $('#alertremovegame_text').text('Are you sure you want to remove ' + selectedgameid +"?");
}
function deleteGameHandler(element){
  var selectedgameid =  $(element).parent().parent().find("td#gameidid")[0].textContent;
  $('#alertdeletegame').find('button.btn').attr('id',selectedgameid);
  $('#alertdeletegame_text').text('Are you sure you want to delete ' + selectedgameid +"?");
}

function removeGameAlertHandler(){
  console.log('clicked');
  //currentGameId = window.localStorage["gameid"];
  var selectedgameid = $('#alertremovegame').find('button.btn').attr('id');
  var currentGameId = gameId;
  client.sendRequest("DELETE",
      "gamification/games/data/"+selectedgameid+"/"+memberId,
      "",
      "application/json",
      {},
      function(data,type){
        // opened game is the selected game
        if(selectedgameid == currentGameId){
          //window.localStorage.removeItem("gameid");
          setGameIDContext("");
          getGamesData();
        }
        else{
          getGamesData();
        }
        console.log(data);
      },
      function(error) {
           // Notification failed to remove game from member
            miniMessageAlert(notification,"Failed to remove member fron game. " + error, "danger");
        }
    );

  $("#alertremovegame").modal('toggle');
}


function deleteGameAlertHandler(){
  console.log('clicked');
  //currentGameId = window.localStorage["gameid"];
  var currentGameId = gameId;
  var selectedgameid = $('#alertdeletegame').find('button.btn').attr('id');
  client.sendRequest("DELETE",
      "gamification/games/data/"+selectedgameid,
      "",
      "application/json",
      {},
      function(data,type){
        // opened game is the selected game
        if(selectedgameid == currentGameId){
          //window.localStorage.removeItem("gameid");
          setGameIDContext("");
        // Notification delete success
        }
        getGamesData();

        console.log(data);
      },
      function(error) {
            // Notification delete failed
            miniMessageAlert(notification,"Failed to delete game. " + error, "danger");
        }
    );

  $("#alertdeletegame").modal('toggle');
}



function reloadActiveTab(){
  //reload active tab
  var $link = $('li a[data-toggle="tab"]');
    $link.parent().removeClass('active');
    var tabLink = $link.attr('href');
    $('#gametab a[href="' + tabLink + '"]').tab('show');
}

function sendIntentRefreshGameId(gameId){
  client.sendIntent(
    "REFRESH_APPID",
    gameId
  );
}

function sendIntentFetchGameIdCallback(gameId,receiver){
  var dataObj = {
      gameId: gameId,
      status: loginStatus,
      member: oidc_userinfo,
      receiver: receiver
    };
    console.log(JSON.stringify(dataObj));
  client.sendIntent(
    "FETCH_APPID_CALLBACK",
    JSON.stringify(dataObj)
  );
}

// function sendIntentFetchLoginCallback(loginStatus,oidc_userinfo,receiver){
//   var dataObj = {
//         status: loginStatus,
//         member: oidc_userinfo,
//       receiver: receiver
//     };
//     console.log(JSON.stringify(dataObj));
//   client.sendIntent(
//     "FETCH_LOGIN_CALLBACK",
//     JSON.stringify(dataObj)
//   );
// }

function sendIntentLogin(){
  var dataObj = {
      status: loginStatus,
      member: oidc_userinfo
    };
    console.log(JSON.stringify(dataObj));
  client.sendIntent(
    "LOGIN",
    JSON.stringify(dataObj)
  );
}
