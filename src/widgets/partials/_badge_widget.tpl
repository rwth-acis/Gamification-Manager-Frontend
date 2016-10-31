<script src="<%= grunt.config('baseUrl') %>/js/gamificationelements.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/badge.js"></script>

<script id="card-badge" type="text/template">
        <div class="card text-xs-center">
           <div class="card-header text-xs-left">
            <i class="fa fa-tag" aria-hidden="true"></i> {{= id}}
          </div> 
          <img class="card-img-top" src="{{= imgUrl}}" alt="Card image cap">
          <div class="card-block text-xs-left">
            <h4 class="card-title" title="Badge Name">{{= name}}</h4>
            <p class="card-text" title="Badge Description"><i class="fa fa-align-justify" aria-hidden="true"></i> {{= description}}</p>
            <p class="card-text 
                    {{ if(useNotification){ }}
                      text-success
                    {{ } else{ }}
                    text-danger
                    {{ }  }}
            " title="Notification Message"><i class="fa fa-comment-o" aria-hidden="true"></i> {{= notificationMessage}}</p>
          </div>
          <div class="card-footer text-muted text-xs-center">
            <div class="btn-group" role="group" aria-label="">
              <button type="button" class="btn btn-secondary btn-warning bedit" onclick="editButtonListener('{{= id}}')">Edit</button>
              <button type="button" class="btn btn-secondary btn-danger bdelete" onclick="deleteButtonListener('{{= id}}')">Delete</button>
            </div>
          </div>
        </div>
</script>

<div class="content-wrapper">
</div>

<script id="login-template" type="text/template">
<div id="login-alert" class="alert alert-info text-xs-center" role="alert">
  <h5>To use this widget, please select the Game ID in Game Widget.</h5>
  </div>
</script>

<script id="content-template" type="text/template">

<div class="row-offcanvas row-offcanvas-left">
  <div id="sidebar" class="sidebar-offcanvas">
    <div class="wrapper text-xs-center">
      <h6><strong>Badge</strong></h6>
      <h6><strong>Manager</strong></h6>
      <br>
      <h6>Game ID</h6>
      <h6 id="title-widget"></h6>
      <br>
      <button type="button" class="btn btn-secondary btn-success bedit" onclick="addButtonListener()"><i class="fa fa-plus"></i></button> 
      <div class="push"></div>
    </div>

    <div class="footer">
      <div class="col-xs-12" >

        <div class="text-xs-center">
          <button type="button" class="btn btn-secondary btn-success bedit" onclick="refreshButtonListener()"><i class="fa fa-refresh"></i></button>
        </div>
        <br>
        <div class="text-xs-center">
          <button type="button" class="btn btn-secondary btn-success bedit" data-toggle="modal" data-target="#help" style="text-decoration: none;" title="Help"><i class="fa fa-question"></i></button>
        </div>
      </div>
        
    </div>
  </div>
  <div id="main">

    <div class="card-deck">

    </div>

  </div>
</div>   

</script>

<!-- Help modal -->
<div class="modal fade" id="help">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h5 class="modal-title">Help</h5>
        </div>
        <div class="modal-body">
          <dl class="row">
            <dt class="col-xs-3 text-xs-center "><i class="fa fa-tag" aria-hidden="true"></i> </dt>
            <dd class="col-xs-9">Badge ID.</dd>
            
            <dt class="col-xs-3 text-xs-center "><i class="fa fa-align-justify" aria-hidden="true"></i></dt>
            <dd class="col-xs-9">Badge Description.</dd>

            <dt class="col-xs-3 text-xs-center text-success"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Green means the badge use notification message.</dd>

            <dt class="col-xs-3 text-xs-center text-danger"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Red means the badge does not use notification message.</dd>
          </dl>
        
        </div>
      </div>
    </div>

</div>
            <!-- /.container-fluid -->
<div class="modal" id="modalbadgediv" role="dialog">
    <div class="modal-dialog modal-lg">
    	<div class="modal-content">

        	<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title">Add a New Badge</h4>
	        </div>

	        <div class="modal-body">
		        <form method="POST" enctype="multipart/form-data" data-toggle="validator" id="modalbadgeform" name="gameId" class="form-horizontal" role="form">
		        	<div class="form-group row">
					  <label for="badge_id" class="col-xs-2 col-form-label">Badge ID</label>
					  <div class="col-xs-10">
					  	<input type="text" class="form-control" maxlength="20" id="badge_id" name="badgeid" placeholder="badge_name" required>
					  </div>
					</div>
					<div class="form-group row">
					  <label for="badge_name" class="col-xs-2 col-form-label">Badge Name</label>
					  <div class="col-xs-10">
					  	<input type="text" class="form-control" maxlength="20" id="badge_name" name="badgename" placeholder="The good badge">
					 </div>
					</div>
					<div class="form-group row">
					  <label for="badge_desc" class="col-xs-2 col-form-label">Badge Description</label>
					  <div class="col-xs-10">
					  	<textarea class="form-control" rows="3" maxlength="100" id="badge_desc" name="badgedesc" placeholder="This is the badge description"></textarea>
					  </div>
					</div>
					<div class="form-group row">
					  <label for="badgeimageinmodal" class="col-xs-2 col-form-label">Badge Image</label>
					  <div class="col-xs-10">
 					  	<img id="badgeimageinmodal" src="" alt="your image" /><br>
					 	<input type='file' onchange="showImageOnChange(this)" name="badgeimageinput" accept='image/*'/>
<!-- 			            <label class="custom-file">
			              <input type="file" id="file" class="custom-file-input" onchange="badgeModule.showImageOnChange(this)" name="badgeimageinput" accept='image/*'/>
			              <span class="custom-file-control"></span>
			            </label> -->
					  </div>
					</div>
					<div class="form-group row">
						<label for="badge_notification_message" class="col-xs-2 col-form-label">Notification</label>
						<div class="col-xs-10">
						  	<div class="input-group">
							      <span class="input-group-addon">
							        <input type="checkbox" aria-label="..." id="badge_notification_check" name="badgenotificationcheck">
							      </span>
							      <input type="text" class="form-control" id="badge_notification_message" name="badgenotificationmessage" placeholder="Notification Message">
						    </div>
						</div>
					</div>
					<div class="form-group row">
				      <div class="offset-xs-2 col-xs-10">
				        <button id="modalbadgesubmit" type="submit" class="btn btn-primary" value="Submit" >Submit</button>
				      </div>
				    </div>
				</form>
        	</div>

      </div>
    </div>
</div>

<div id="modalspinner" style="display: none">
    <div class="center">
        <img alt="" src="<%= grunt.config('baseUrl') %>/img/loader.svg" />
    </div>
</div>
