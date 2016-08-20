/*
 * Copyright (c) 2015 Advanced Community Information Systems (ACIS) Group, Chair
 * of Computer Science 5 (Databases & Information Systems), RWTH Aachen
 * University, Germany All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name of the ACIS Group nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

 // global variables
var client, appId, notification;
    
function setAppIDContext(appId_){
  appId = appId_;
  //$('#app-id-text').html(appId);
  gadgets.window.setTitle("Gamification Manager Badge - " + appId);

  badgeModule.init();
}

var init = function() {
  var iwcCallback = function(intent) {
    console.log(intent);
    if(intent.action == "REFRESH_APPID"){
      
      setAppIDContext(intent.data);
      console.log(appId);
    }    
    if(intent.action == "FETCH_APPID_CALLBACK"){
      var data = JSON.parse(intent.data);
      if(data.receiver == "badge"){
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
  notification = new gadgets.MiniMessage("GAMEBADGE");

  $('button#refreshbutton').on('click', function() {
    sendIntentFetchAppId("badge");
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
    if(data.rows.length < 1){
        var newRow = "<tr class='text-center'><td colspan='8'>No data Found ! </td>";
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

    $("table#list_badges").find("tbody").empty();
    badgeAccess.getBadgesData(
      appId,
      notification,
      function(data,type){
        $("#modalbadgediv").modal('hide');
          badgeCollection = data.rows;
          renderBadgeTable(data);

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
