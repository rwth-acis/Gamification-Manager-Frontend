
 // global variables
var client, gameId,memberId, notification;
var oidc_userinfo;
var iwcCallback;
function setGameIDContext(gameId_){
  gameId = gameId_;
  //$('#game-id-text').html(gameId);
  if(gameId){
    //gadgets.window.setTitle("Gamification Manager Point - " + gameId);
    $("h4#title-widget").text("Game ID : " + gameId);
    if(gameId == ""){
      $("#point_id_container").find("#level_point_id").val('');
    }
    else{
      pointModule.init();
    }
  }

}


var initIWC = function(){
  notification = new gadgets.MiniMessage("GAMEPOINT");

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
        if(data.receiver == "point"){
          if(data.gameId){
            setGameIDContext(data.gameId);
          }
          else{
            miniMessageAlert(notification,"Game ID in Gamification Manager Game is not selected","danger")
          }
        }
      }
      else if(data.status == 401){
        $("#point_id_container").find("#level_point_id").val('You are not logged in');

      }

    }
    if(intent.action == "LOGIN"){
      var data = JSON.parse(intent.data);
      if(data.status == 200){
        oidc_userinfo = data.member;
        loggedIn(oidc_userinfo.preferred_username);
      }
      else if(data.status == 401){
        $("#point_id_container").find("#level_point_id").val('You are not logged in');

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
  //     sendIntentFetchLogin("point");
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
};

var init = function() {
  $('button#refreshbutton').off('click');
  $('button#refreshbutton').on('click', function() {
      sendIntentFetchGameId("point");

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
//         miniMessageAlert(notification,"Sign in failed!. "+ result,"danger");
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


 var pointModule = (function() {

  var init = function(){
      var endPointPath = "gamification/points/"+gameId+"/name";
      client.sendRequest(
        "GET",
        endPointPath,
        {},
        false,
        {},
        function(data, type){
          console.log(data.pointUnitName);
          $("#point_id_container").find("#level_point_id_static").html(data.pointUnitName);
          miniMessageAlert(notification,"Point unit name updated","success");
          return false;
        },
        function(error) {

          miniMessageAlert(notification,"Failed to fetch unit name !. " + error,"danger");
          return false;
        }
      );
      $("#point_id_container").find("#select_point").off("click");
      $("#point_id_container").find("#select_point").on("click", function(e){

        var unitName = $("#point_id_container").find("#level_point_id").val();
        console.log(unitName);
        var endPointPath = "gamification/points/"+gameId+"/name/"+unitName;
        client.sendRequest(
          "PUT",
          endPointPath,
          "",
          false,
          {},
          function(data, type){
            console.log(data);
            $("#point_id_container").find("#level_point_id").val('');
            $("#point_id_container").find("#level_point_id_static").html(unitName);

            miniMessageAlert(notification,"Unit name updated !","success");
            return false;
          },
          function(error) {
            miniMessageAlert(notification,"Failed to update unit name !. "+ error,"danger");
            return false;
          }
        );
      });
    };
      return {
        init: init
      };
    })();
