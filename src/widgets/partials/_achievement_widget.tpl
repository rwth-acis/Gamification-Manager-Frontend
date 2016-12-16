<script src="<%= grunt.config('baseUrl') %>/js/gamificationelements.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/achievement.js"></script>

<script id="list-achievement" type="text/template">
      <a class="list-group-item list-group-item-action" data-toggle="modal" data-target="#contentModal" data-achievementid="{{= id}}">

        <h6 class="list-group-item-heading"><i class="fa fa-tag" aria-hidden="true"></i> {{= id}}</h5>
        <h6 class="list-group-item-heading"> {{= name}}</h6>
      </a>


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
      <h6><strong>Achievement</strong></h6>
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

  
    <div class="list-group list-achievement-group">

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
            <dd class="col-xs-9">Achievement ID.</dd>

            <dt class="col-xs-3 text-xs-center "><i class="fa fa-align-justify" aria-hidden="true"></i></dt>
            <dd class="col-xs-9">Achievement Description.</dd>

            <dt class="col-xs-3 text-xs-center text-success"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Green means the achievement use notification message.</dd>

            <dt class="col-xs-3 text-xs-center text-danger"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Red means the achievement does not use notification message.</dd>
          </dl>
        
        </div>
      </div>
    </div>

</div>

  <div class="modal fade" id="contentModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
      	<div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <i class="fa fa-tag" aria-hidden="true">ID</i>
        </div>
        <div class="card">
<!--           <div class="card-header" title="Achievement ID">
          	<button type="button" class="close" data-dismiss="modal">&times;</button>
            
          </div> -->
          <div class="card-block">
            <h4 class="card-title"  title="Achievement Name">Name</h4>
            <p class="card-text desc" title="Achievement Description"><i class="fa fa-align-justify" aria-hidden="true"></i> Description</p>
            <p class="card-text" title="Rewards"><i class="fa fa-gift"></i> Rewards</p>
            <div class="row">
            	<div class="col-xs-6 text-xs-center" title="Point value" id="pvalue">
            	</div>
            	<div class="col-xs-6 text-xs-center" title="Badge reward" id="badgeimg">
            	</div>
            </div>
            <p class="card-text msg"  title="Notification Message"><i class="fa fa-comment-o" aria-hidden="true" ></i> Message</p>
          </div>
          <div class="card-footer text-muted text-xs-center">
            <div class="btn-group" role="group" aria-label="">
              <button type="button" class="btn btn-secondary btn-warning bedit" onclick="editButtonListener()">Edit</button>
              <button type="button" class="btn btn-secondary btn-danger bdelete" onclick="deleteButtonListener()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

<div class="modal" id="modalachievementdiv" role="dialog">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">

			<div class="modal-header">
			    <button type="button" class="close" data-dismiss="modal">&times;</button>
			    <h4 class="modal-title"></h4>
			</div>
			<div class="modal-body">
				<form method="POST" data-toggle="validator" enctype="multipart/form-data" id="modalachievementform" name="gameId" class="form-horizontal" role="form">
				    <div class="form-group row">
						<label for="achievement_id_name" class="col-xs-2 col-form-label">Achievement ID</label>
						<div class="col-xs-10">
							<input type="text" class="form-control" id="achievement_id_name" name="achievementid" placeholder="achievement_name" maxlength="20" required>
						</div>
					</div>
					<div class="form-group row">
						<label for="achievement_name" class="col-xs-2 col-form-label">Achievement Name</label>
						<div class="col-xs-10">
							<input type="text" class="form-control" maxlength="20" id="achievement_name" name="achievementname" placeholder="The good achievement">
						</div>
					</div>
					<div class="form-group row">
						<label for="achievement_desc" class="col-xs-2 col-form-label">Achievement Description</label>
						<div class="col-xs-10">
							<textarea class="form-control" rows="3" maxlength="100" id="achievement_desc" name="achievementdesc" placeholder="This is the achievement description"></textarea>
						</div>
					</div>
					<div class="form-group row">
						<label for="achievement_badge_id" class="col-xs-2 col-form-label">Badge</label>
						<div class="col-xs-10">
						<select class="custom-select">
						  <option value="no-badge" selected>No badge</option>
						</select>
<!-- 							<div class="input-group">
							    <input type="text" class="form-control" placeholder="Badge ID" id="achievement_badge_id" name="achievementbadgeid" readonly>
							    <span class="input-group-btn">
								    <button class="btn btn-secondary btn-info" type="button" id="empty_badge">No Badge</button>
								    <button class="btn btn-secondary" type="button" id="select_badge" data-toggle="collapse" data-target="#panel_badge" aria-expanded="false" aria-controls="panel_badge">Select</button>
							    </span>
							</div>

						    <div class="collapse" id="panel_badge">
							    <div style="height:<%= meta.table_height %>px; overflow: auto;">
									<table class="table table-bordered table-striped table-fixed" id='list_badges_a'>
										<thead>
											<tr>
												<th>Badge ID</th>
												<th>Badge Name</th>
												<th>Badge Description</th>
												<th>Badge Image</th>
												<th>Select</th>
										</thead>

										<tbody>

										</tbody>

									</table>
								</div>
							</div> -->
						</div>
					</div>
					<!-- Form group end -->
					<div class="form-group row">
						<label for="achievement_point_value" class="col-xs-2 col-form-label">Point Value</label>
						<div class="col-xs-5">
					  		<input type="number" class="form-control" placeholder="Value" id="achievement_point_value" name="achievementpointvalue" value="0">
						</div>
						<div class="col-xs-5">
						</div>
					</div>
						<!-- Add remaining columns here -->

					<div class="form-group row">
						<label for="achievement_notification_message" class="col-xs-2 col-form-label">Notification</label>
						<div class="col-xs-10">
						  	<div class="input-group">
							      <span class="input-group-addon">
							        <input type="checkbox" aria-label="..." id="achievement_notification_check" name="achievementnotificationcheck">
							      </span>
							      <input type="text" class="form-control" id="achievement_notification_message" name="achievementnotificationmessage" placeholder="Notification Message">
						    </div>
						</div>
					</div>
					<div class="form-group row">
				    	<div class="offset-xs-2 col-xs-10">
				        	<button id="modalachievementsubmit" type="submit" class="btn btn-primary" value="" ></button>
				    	</div>
					</div>
				</form>
			</div>
	</div>
</div>
	<!-- Add Modal END -->

<div id="badge-popover-content" class="hidden">
	<form>
    	<div class="form-group row">
		  <div class="col-xs-12">
		  <b>Badge ID</b> <p class="form-control-static" id="badgeidpopover"></p>

		  </div>
		</div>
		<div class="form-group row">
		  <div class="col-xs-12">
				<b>Badge Name</b> <p class="form-control-static" id="badgenamepopover"></p>
		  </div>
		</div>
		<div class="form-group row">
		  <div class="col-xs-12">
			<b>Description</b>	<p class="form-control-static" id="badgedescpopover"></p>
		  </div>
		</div>
		<div class="form-group row">
		  <div class="col-xs-12">
				<img class="badgeimagemini" id="badgeimagepopover" alt="your image" />
		  </div>
		</div>
	</form>
</div>

<div id="modalspinner" style="display: none">
    <div class="center">
        <img alt="" src="<%= grunt.config('baseUrl') %>/img/loader.svg" />
    </div>
</div>
