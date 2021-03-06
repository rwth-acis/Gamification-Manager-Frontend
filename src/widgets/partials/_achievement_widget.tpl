<script src="<%= grunt.config('baseUrl') %>/js/gamificationelements.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/achievement.js"></script>

<div class="container-fluid text-center">
  <div class="row">
  <h4 id="title-widget">Game ID : - </h4>
  </div>
</div>     
<div id="wrapper" class="container-fluid" >
	<div class="row">
		<div class="col-md-12">

			<div style="height:<%= meta.table_height %>px; overflow: auto;">
				<table class="table table-bordered table-striped table-fixed" id='list_achievements'>
					<thead>
						<tr>
							<th>Achievement ID</th>
							<th>Name</th>
							<th>Description</th>
							<th>Point Value</th>
							<th>Badge ID</th>
							<th>Use Notification</th>
							<th>Message</th>
							<th>Edit</th>
							<th>Delete</th>
					</thead>

					<tbody>

					</tbody>

				</table>
			</div>
			<div class="container-fluid">
			     <button id="addnewachievement" type="button" class="btn btn-success"><span class=" glyphicon glyphicon-plus"></button>
			    <button id="refreshbutton" type="button" class="btn btn-info pull-right"> <span class=" glyphicon glyphicon-refresh"></button>
			</div>
		</div>
		<div class="col-md-0">
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
				    <div class="form-group">
						<label class="col-sm-2 control-label">Achievement ID</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="achievement_id_name" name="achievementid" placeholder="achievement_name" maxlength="20" required>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">Achievement Name</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" maxlength="20" id="achievement_name" name="achievementname" placeholder="The good achievement">
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">Achievement Description</label>
						<div class="col-sm-10">
							<textarea class="form-control" rows="3" maxlength="100" id="achievement_desc" name="achievementdesc" placeholder="This is the achievement description"></textarea>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">Badge</label>
						<div class="col-sm-10">
							<div class="input-group">
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
							</div>
						</div>
					</div>
					<!-- Form group end -->
					<div class="form-group">
						<label class="col-sm-2 control-label">Point Value</label>
						<div class="col-sm-5">
					  		<input type="number" class="form-control" placeholder="Value" id="achievement_point_value" name="achievementpointvalue" value="0">
						</div>
						<div class="col-sm-5">
						</div>
					</div>
						<!-- Add remaining columns here -->

					<div class="form-group">
						<label class="col-sm-2 control-label">Notification</label>
						<div class="col-sm-10">
						  	<div class="input-group">
							      <span class="input-group-addon">
							        <input type="checkbox" aria-label="..." id="achievement_notification_check" name="achievementnotificationcheck">
							      </span>
							      <input type="text" class="form-control" id="achievement_notification_message" name="achievementnotificationmessage" placeholder="Notification Message">
						    </div>
						</div>
					</div>
					<div class="form-group">
				    	<div class="col-sm-offset-2 col-sm-10">
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
		  <div class="col-sm-12">
		  <b>Badge ID</b> <p class="form-control-static" id="badgeidpopover"></p>

		  </div>
		</div>
		<div class="form-group row">
		  <div class="col-sm-12">
				<b>Badge Name</b> <p class="form-control-static" id="badgenamepopover"></p>
		  </div>
		</div>
		<div class="form-group row">
		  <div class="col-sm-12">
			<b>Description</b>	<p class="form-control-static" id="badgedescpopover"></p>
		  </div>
		</div>
		<div class="form-group row">
		  <div class="col-sm-12">
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
