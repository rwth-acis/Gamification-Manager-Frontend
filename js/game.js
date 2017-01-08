var client, gameId, memberId, loginStatus, notification;;

var loadGameList = function(){
  var gameListElmt = $(".list-group");

  var existingGameTmpl = _.template($("#existing-game-template").html());
  
  // Request get
  client.sendRequest("GET",
    "gamification/games/list/separated",
    "",
    "application/json",
    {},
    function(data,type){
      console.log(data)

      if(data.length > 0){
        var htmlData = "";
        gameListElmt.empty();
        _.forEach(data,function(game){
          htmlData += existingGameTmpl(game);
        });
        gameListElmt.append(htmlData);
      }
      else{
        gameListElmt.html("<h4 class=\"text-center\">No Data</h4>")
      }

    },
    function(error) {
      console.log(error);
     }
  );
}


var authenticateView = function(){
  var loginTmpl = _.template($('#login-template').html());
  var gameContentElmt = $('#game-content');
  gameContentElmt.html(loginTmpl);
};



var gameContentView = function(){
  var gameContentTmpl = _.template($('#game-content-template').html());
  var gameContentElmt = $('#game-content');
  gameContentElmt.html(gameContentTmpl);
  loadGameList();
  $('p#member-id').html('<b>' + memberId + '</p>');

  // list group button modal listener
  $('#buttonModal').off();
  $('#buttonModal').on('show.bs.modal', function (event) {
    console.log($(this));
    var button = $(event.relatedTarget) // Button that triggered the modal
    var gameid = button.data('gameid') 
    var modal = $(this)
    modal.find('.modal-title').text('What do you want to do with ' + gameid + '?')
    modal.find('.bselect').attr("onclick","selectGameHandler(\""+gameid+"\")")
    modal.find('button').attr("data-gameid",gameid)
  })

  // alert button modal listener
  $('#alertdeletegame').off();
  $('#alertdeletegame').on('show.bs.modal', function (event) {
    console.log($(this));
    var button = $(event.relatedTarget) // Button that triggered the modal
    var gameid = button.data('gameid')
    var modal = $(this)
    modal.find('.modal-body p').text('Are you sure you want to delete ' + gameid + '?')
    modal.find('button').attr("onclick","deleteGameAlertHandler(\""+gameid+"\")")
  })

    // alert button modal listener
  $('#alertremovegame').off();
  $('#alertremovegame').on('show.bs.modal', function (event) {
    console.log($(this));
    var button = $(event.relatedTarget) // Button that triggered the modal
    var gameid = button.data('gameid')
    var modal = $(this)
    modal.find('.modal-body p').text('Are you sure you want to remove ' + gameid + '?')
    modal.find('button').attr("onclick","removeGameAlertHandler(\""+gameid+"\")")
  })
};




var init = function() {
  var iwcCallback = function(intent) {
    if(intent.action == "FETCH_APPID"){
      sendIntentFetchGameIdCallback(gameId,intent.data);
    }
  };
  client = new Las2peerWidgetLibrary("http://gaudi.informatik.rwth-aachen.de:8086/", iwcCallback);
  notification = new gadgets.MiniMessage("GAMEAPP");
  checkAndRegisterUserAgent();

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
        
        loadGameList();
        return false;
      },
      function(error) {
        miniMessageAlert(notification,"Failed to create new game : "+ selectedGameId +" !", "danger");
      }
    );
    return false;
  });
}

$(document).ready(function() {
   authenticateView();
   _.templateSettings = {
      evaluate: /\{\{(.+?)\}\}/g,
      interpolate: /\{\{=(.+?)\}\}/g,
      escape: /\{\{-(.+?)\}\}/g
    };
});

function startButtonListener(){
  learningLayerLogin();
};

function signInCallback(result) {
    if(result === "success"){
      loginStatus = 200;
      memberId = oidc_userinfo.preferred_username;
      console.log(oidc_userinfo);
    } else {
      loginStatus = 401;
      console.log(result);
      console.log(window.localStorage["access_token"]);
    }
    if(result === "success"){
      init();
    } else {
      $("#login-text").find("h4").html("You are not authenticated, try to login using Open ID Learning Layers.");
    }
}

function refreshButtonHandler(){
  loadGameList();
}

function selectGameHandler(gameid){
  console.log(gameid);
  addMemberToGame(gameid,memberId);
   $('#buttonModal').modal('hide');
}

function removeGameAlertHandler(selectedgameid){
  console.log('clicked');
  var currentGameId = gameId;
  client.sendRequest("DELETE",
      "gamification/games/data/"+selectedgameid+"/"+memberId,
      "",
      "application/json",
      {},
      function(data,type){
        // opened game is the selected game
        if(selectedgameid == currentGameId){
          setGameIDContext("");
          loadGameList();
        }
        else{
          loadGameList();
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


function deleteGameAlertHandler(selectedgameid){
  console.log('clicked');
  var currentGameId = gameId;
  client.sendRequest("DELETE",
      "gamification/games/data/"+selectedgameid,
      "",
      "application/json",
      {},
      function(data,type){
        // opened game is the selected game
        if(selectedgameid == currentGameId){
          setGameIDContext("");
        }
        loadGameList();

        console.log(data);
      },
      function(error) {
            // Notification delete failed
            miniMessageAlert(notification,"Failed to delete game. " + error, "danger");
        }
    );

  $("#alertdeletegame").modal('toggle');
}

function checkAndRegisterUserAgent(){
  client.sendRequest("POST",
    "gamification/games/validation",
    "",
    "application/json",
    {},
    function(data,type){
      gameContentView();
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

  function addMemberToGame(currentGameId,memberId){
    // add member to game
    client.sendRequest("POST",
      "gamification/games/data/"+currentGameId+"/"+memberId,
      "",
      "application/json",
      {},
      function(data,type){
        console.log(data);
        miniMessageAlert(notification,memberId + " is added to "+ currentGameId, "success");

        setGameIDContext(currentGameId);
        loadGameList();

      },
      function(error) {
          miniMessageAlert(notification,"Failed to add " + memberId + " to "+ currentGameId, "danger");
          console.log(error);
      }
    );
  }

 ///////////


function setGameIDContext(gameId_){
  gameId = gameId_;
  $("h4#title-widget").text("Game ID : " + gameId);
  sendIntentRefreshGameId(gameId);

}

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

var useAuthentication = function(rurl){
  if(rurl.indexOf("\?") > 0){
    rurl += "&access_token=" + window.localStorage["access_token"];
  } else {
    rurl += "?access_token=" + window.localStorage["access_token"];
  }
  return rurl;
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
