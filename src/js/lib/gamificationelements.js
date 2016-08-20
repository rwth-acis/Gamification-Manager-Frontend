function miniMessageAlert(msgObj,message,type){
	var msg = msgObj.createTimerMessage(message, 3);
	switch(type){
		case "danger": msg.style.backgroundColor = "red";
		break;
		case "success": msg.style.backgroundColor = "green";
		break;
		default: msg.style.backgroundColor = "blue";
	}	
	msg.style.color = "white";
}
var ClientHelper = {
	postWithJSON : function(endPointURL, content, notification,successCallback, errorCallback, elementid){
		var objsent = JSON.stringify(content);
		client.sendRequest(
			"POST",
			endPointURL,
			objsent,
			"application/json",
			{},
			function(data, type){
				

				if(notification){
					miniMessageAlert(notification,"<b>" + elementid + "</b> is added !","success");
				}
				successCallback(data,type);
				
				return false;
			},
			function(status,error) {
				if(notification){
					miniMessageAlert(notification,"Failed to add <b>" + elementid + "</b> !. " + error,"danger");
				}
				errorCallback(status,error);
		        return false;
			}
		);
	},
	putWithJSON: function(endPointURL, content, notification,successCallback, errorCallback, elementid){
		var objsent = JSON.stringify(content);
		client.sendRequest(
			"PUT",
			endPointURL,
			objsent,
			"application/json",
			{},
			function(data, type){
				if(notification){
					miniMessageAlert(notification,"<b>" + elementid + "</b> is updated !","success");
				}
				successCallback(data,type);
				
				return false;
			},
			function(status,error) {
				if(notification){
					miniMessageAlert(notification,"Failed to add <b>" + elementid + "</b> !. " + error,"danger");
				}
				errorCallback(status,error);
		        return false;
			}
		);
	},
	postWithForm:function(endPointURL, content, notification,successCallback, errorCallback, elementid){
		client.sendRequest(
			"POST",
			endPointURL,
			content,
			false,
			{},
			function(data, type){
				if(notification){
					miniMessageAlert(notification,"<b>" + elementid + "</b> is added !","success");
				}
				successCallback(data,type);
				return false;
			},
			function(status,error) {
				if(notification){
					miniMessageAlert(notification,"Failed to add <b>" + elementid + "</b> !. " + error,"danger");
				}
		         errorCallback(status,error);
		         return false;
			}
		);
	},
	putWithForm : function(endPointURL, content, notification,successCallback, errorCallback,elementid){
		client.sendRequest(
			"PUT",
			endPointURL,
			content,
			false,
			{},
			function(data, type){
				if(notification){
					miniMessageAlert(notification,"<b>" + elementid + "</b> is updated !","success");
				}
				successCallback(data,type);
				return false;
			},
			function(error) {
				if(notification){
					miniMessageAlert(notification,"Failed to add <b>" + elementid + "</b> !. " + error,"danger");
				}
		        errorCallback(status,error);
				return false;
			}
		);
	},
	deleteData : function(endPointURL, notification,successCallback, errorCallback,elementid){
		client.sendRequest(
			"DELETE",
			endPointURL,
			"",
			false,
			{},
			function(data, type){
				if(notification){
					miniMessageAlert(notification,"<b>" + elementid + "</b> is deleted !","success");
				}
				successCallback(data,type);
				return false;
			},
			function(status,error) {
				if(notification){
					miniMessageAlert(notification,"Failed to delete <b>" + elementid + "</b> !. " + error,"danger");
				}
		         errorCallback(status,error);
		         return false;
		    }
		);
	},
	getData : function(endPointURL, notification,successCallback, errorCallback){
		client.sendRequest(
			"GET",
			endPointURL,
			"",
			false,
			{},
			function(data, type){
				successCallback(data,type);
				return false;
			},
			function(status,error) {
      			 notification.dismissMessage();
				 var msg =notification.createDismissibleMessage("Cannot fetch data. Try to refresh or reselect Application ID. " + error.message);
		         msg.style.backgroundColor = "red";
  				 msg.style.color = "white";
		         errorCallback(status,error);
		         return false;
		    }
		);
	}

};



var QuestDAO = function(endPointURL){
}

QuestDAO.prototype.getQuestsData = function(currentAppId,notification,successCallback, errorCallback){
	var endPointURL = "gamification/quests/"+currentAppId;
	var query = "?current=1&rowCount=-1&searchPhrase=";
	ClientHelper.getData(endPointURL+query,notification,successCallback, errorCallback);
}

QuestDAO.prototype.createNewQuest = function(currentAppId,content, notification,successCallback, errorCallback, questid){

	var objsent = JSON.stringify(content);
	var endPointURL = "gamification/quests/"+currentAppId;
	ClientHelper.postWithJSON(endPointURL, content, notification,successCallback, errorCallback, questid);
}

QuestDAO.prototype.updateQuest = function(currentAppId,content, notification,successCallback, errorCallback, questid){

	var objsent = JSON.stringify(content);
	var endPointURL = "gamification/quests/"+currentAppId+"/"+questid;
	ClientHelper.putWithJSON(endPointURL, content, notification,successCallback, errorCallback, questid);
}

QuestDAO.prototype.deleteQuest = function(currentAppId,notification,successCallback, errorCallback,questid){
	var endPointURL = "gamification/quests/"+currentAppId+"/"+questid;
	ClientHelper.deleteData(endPointURL,notification,successCallback, errorCallback,questid);
}

/*var BadgeModel = function(badge_id,name,description,image_path){
	this.badge_id = badge_id;
	this.name = name;
	this.description = description;
	this.image_path = image_path;
}
*/
var BadgeDAO = function(){
}

BadgeDAO.prototype.getBadgesData = function(currentAppId,notification, successCallback, errorCallback){
	var endPointURL = "gamification/badges/"+currentAppId;
	var query = "?current=1&rowCount=-1&searchPhrase=";
	ClientHelper.getData(endPointURL+query,notification,successCallback, errorCallback);
}

BadgeDAO.prototype.getBadgeDataWithId = function(currentAppId,badgeid,successCallback, errorCallback){
	//currentAppId = window.localStorage["appid"];
	var endPointURL = "gamification/badges/"+currentAppId+"/"+badgeid;
	client.sendRequest(
		"GET",
		"gamification/badges/"+currentAppId+"/"+badgeid,
		{},
		false,
		{},
		function(data,type){
			successCallback(data,type);
		},
		function(error){
			miniMessageAlert(notification,"Failed to retrieve badge details !. " + error,"danger");
			errorCallback(error);
		}
	);
}

BadgeDAO.prototype.createNewBadge = function(currentAppId,content, notification,successCallback, errorCallback, badgeid){
	//currentAppId = window.localStorage["appid"];
	var endPointURL = "gamification/badges/"+currentAppId;
	ClientHelper.postWithForm(endPointURL, content, notification,successCallback, errorCallback, badgeid);
}

BadgeDAO.prototype.updateBadge = function(currentAppId,content, notification,successCallback, errorCallback, badgeid){
	//currentAppId = window.localStorage["appid"];
	var endPointURL = "gamification/badges/"+currentAppId+"/"+badgeid;
	ClientHelper.putWithForm(endPointURL,content, notification,successCallback, errorCallback, badgeid);
}

BadgeDAO.prototype.deleteBadge = function(currentAppId,notification,successCallback, errorCallback, badgeid){
	//currentAppId =window.localStorage["appid"];
	var endPointURL = "gamification/badges/"+currentAppId+"/" + badgeid;
	ClientHelper.deleteData(endPointURL,notification,successCallback, errorCallback,badgeid);
}

BadgeDAO.prototype.getBadgeImage = function(currentAppId,badgeid){
	//currentAppId = window.localStorage["appid"];

	if(!client.isAnonymous()){
		console.log("Authenticated request");
		var rurl = "<%= grunt.config('endPointServiceURL') %>gamification/badges/"+currentAppId+"/" + badgeid + "/img";
		
		return useAuthentication(rurl);
	} else {
		console.log("Anonymous request... ");
		return null;
	}
}

/*var AchievementModel = function(achievement_id,name,description,point_value,badge_id){
	this.achievement_id = achievement_id;
	this.name = name;
	this.description = description;
	this.point_value = point_value;
	this.badge_id = badge_id;
}*/

var AchievementDAO = function(endPointURL){
}

AchievementDAO.prototype.getAchievementsData = function(currentAppId,notification,successCallback, errorCallback){
	var endPointURL = "gamification/achievements/"+currentAppId;
	var query = "?current=1&rowCount=-1&searchPhrase=";
	ClientHelper.getData(endPointURL+query,notification,successCallback, errorCallback);
}

AchievementDAO.prototype.createNewAchievement = function(currentAppId,content, notification,successCallback, errorCallback, achievementid){
	var endPointURL = "gamification/achievements/"+currentAppId;
	ClientHelper.postWithForm(endPointURL, content, notification,successCallback, errorCallback, achievementid);
}

AchievementDAO.prototype.updateAchievement = function(currentAppId,content, notification,successCallback, errorCallback, achievementid){
	var endPointURL = "gamification/achievements/"+currentAppId+"/"+achievementid;
	ClientHelper.putWithForm(endPointURL,content, notification,successCallback, errorCallback, achievementid);
}

AchievementDAO.prototype.deleteAchievement = function(currentAppId,notification,successCallback, errorCallback, achievementid){
	var endPointURL = "gamification/achievements/"+currentAppId+"/" + achievementid;
	ClientHelper.deleteData(endPointURL,notification,successCallback, errorCallback,achievementid);
}

/*var ActionModel = function(action_id,name,description,point_value){
	this.action_id = action_id;
	this.name = name;
	this.description = description;
	this.point_value = point_value;
}*/

var ActionDAO = function(endPointURL){
}

ActionDAO.prototype.getActionsData = function(currentAppId,notification,successCallback, errorCallback){
	var endPointURL = "gamification/actions/"+currentAppId;
	var query = "?current=1&rowCount=-1&searchPhrase=";
	ClientHelper.getData(endPointURL+query,notification,successCallback, errorCallback);
}

ActionDAO.prototype.createNewAction = function(currentAppId,content, notification,successCallback, errorCallback, actionid){
	var endPointURL = "gamification/actions/"+currentAppId;
	ClientHelper.postWithForm(endPointURL, content, notification,successCallback, errorCallback, actionid);
}

ActionDAO.prototype.updateAction = function(currentAppId,content, notification,successCallback, errorCallback, actionid){
	var endPointURL = "gamification/actions/"+currentAppId+"/"+actionid;
	ClientHelper.putWithForm(endPointURL,content, notification,successCallback, errorCallback, actionid);
}

ActionDAO.prototype.deleteAction = function(currentAppId,notification,successCallback, errorCallback, actionid){
	var endPointURL = "gamification/actions/"+currentAppId+"/" + actionid;
	ClientHelper.deleteData(endPointURL,notification,successCallback, errorCallback,actionid);
}


/*var LevelModel = function(level_num,name,point_value){
	this.level_num = level_num;
	this.name = name;
	this.point_value = point_value;
}
*/
var LevelDAO = function(endPointURL){
}

LevelDAO.prototype.getLevelsData = function(currentAppId,notification,successCallback, errorCallback){
	var endPointURL = "gamification/levels/"+currentAppId;
	var query = "?current=1&rowCount=-1&searchPhrase=";
	ClientHelper.getData(endPointURL+query,notification,successCallback, errorCallback);
}

LevelDAO.prototype.createNewLevel = function(currentAppId,content, notification,successCallback, errorCallback, levelnum){
	var endPointURL = "gamification/levels/"+currentAppId;
	ClientHelper.postWithForm(endPointURL, content, notification,successCallback, errorCallback, levelnum);
}

LevelDAO.prototype.updateLevel = function(currentAppId,content, notification,successCallback, errorCallback, levelnum){
	var endPointURL = "gamification/levels/"+currentAppId+"/"+levelnum;
	ClientHelper.putWithForm(endPointURL,content, notification,successCallback, errorCallback, levelnum);
}

LevelDAO.prototype.deleteLevel = function( currentAppId,notification,successCallback, errorCallback, levelnum){
	var endPointURL = "gamification/levels/"+currentAppId+"/" + levelnum;
	ClientHelper.deleteData(endPointURL,notification,successCallback, errorCallback,levelnum);
}

