
 // global variables
var client, appId, notification;
    
function setAppIDContext(appId_){
  appId = appId_;
  //$('#app-id-text').html(appId);
  gadgets.window.setTitle("Gamification Manager Point - " + appId);

  pointModule.init();
}

var init = function() {
  var iwcCallback = function(intent) {
    console.log(intent);
    if(intent.action == "REFRESH_APPID"){
      
      setAppIDContext(intent.data);
    }
    if(intent.action == "FETCH_APPID_CALLBACK"){
      var data = JSON.parse(intent.data);
      if(data.receiver == "point"){
        if(data.appId){
          setAppIDContext(data.appId);
        }
        else{
          miniMessageAlert(notification,"Application ID in Gamification Manager Application is not selected","danger")
        }
      }
    }
  };
  client = new Las2peerWidgetLibrary("<%= grunt.config('endPointServiceURL') %>", iwcCallback);
  notification = new gadgets.MiniMessage("GAMEPOINT");
  pointModule.init();

  $('button#refreshbutton').on('click', function() {
    sendIntentFetchAppId("point");
  });
}


function signinCallback(result) {
    if(result === "success"){
      memberId = oidc_userinfo.preferred_username;
        
        console.log(oidc_userinfo);
        init();

    } else {
        miniMessageAlert(notification,"Sign in failed!. "+ result,"danger");
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


 var pointModule = (function() {

  var init = function(){
      var endPointPath = "gamification/points/"+appId+"/name";
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
      $("#point_id_container").find("#select_point").on("click", function(e){
        
        var unitName = $("#point_id_container").find("#level_point_id").val();
        console.log(unitName);
        var endPointPath = "gamification/points/"+appId+"/name/"+unitName;
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
