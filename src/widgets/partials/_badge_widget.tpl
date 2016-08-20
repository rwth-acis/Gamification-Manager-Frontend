<script src="<%= grunt.config('baseUrl') %>/js/badge.js"></script>
</head>
<body>
<div id="wrapper" class="container-fluid" >
	<div class="row">
		<div class="col-md-12">
			<div style="height:<%= meta.table_height %>px; overflow: auto;">
				<table class="table table-bordered table-striped table-fixed" id='list_badges'>
					<thead>
						<tr>
							<th>Badge ID</th>
							<th>Name</th>
							<th>Description</th>
							<th>Badge Image</th>
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
			     <button id="addnewbadge" type="button" class="btn btn-success"><span class=" glyphicon glyphicon-plus"></button> 
			    <button id="refreshbutton" type="button" class="btn btn-info pull-right"> <span class=" glyphicon glyphicon-refresh"></button>
			</div>
			

		</div>
		<div class="col-md-0">
		</div>
	</div>
</div>
            <!-- /.container-fluid -->
<div class="modal fade" id="modalbadgediv" role="dialog">
    <div class="modal-dialog modal-lg">
    	<div class="modal-content">
    	
        	<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title">Add a New Badge</h4>
	        </div>

	        <div class="modal-body">
		        <form method="POST" enctype="multipart/form-data" data-toggle="validator" id="modalbadgeform" name="appId" class="form-horizontal" role="form">
		        	<div class="form-group">
					  <label class="col-sm-2 col-xs-6 control-label">Badge ID</label>
					  <div class="col-sm-10">
					  	<input type="text" class="form-control" maxlength="20" id="badge_id" name="badgeid" placeholder="badge_name" required>
					  </div>
					</div>
					<div class="form-group">
					  <label class="col-sm-2 control-label">Badge Name</label>
					  <div class="col-sm-10">
					  	<input type="text" class="form-control" maxlength="20" id="badge_name" name="badgename" placeholder="The good badge">
					 </div>
					</div>
					<div class="form-group">
					  <label class="col-sm-2 control-label">Badge Description</label>
					  <div class="col-sm-10">
					  	<textarea class="form-control" rows="3" maxlength="100" id="badge_desc" name="badgedesc" placeholder="This is the badge description"></textarea>
					  </div>
					</div>
					<div class="form-group">
					  <label class="col-sm-2 control-label">Badge Image</label>
					  <div class="col-sm-10">
					  	<img id="badgeimageinmodal" src="" alt="your image" /><br>
					 	<input type='file' onchange="badgeModule.showImageOnChange(this)" name="badgeimageinput" accept='image/*'/><br>
					  </div>
					</div>
					<div class="form-group">								
						<label class="col-sm-2 control-label">Notification</label>
						<div class="col-sm-10">
						  	<div class="input-group">
							      <span class="input-group-addon">
							        <input type="checkbox" aria-label="..." id="badge_notification_check" name="badgenotificationcheck">
							      </span>
							      <input type="text" class="form-control" id="badge_notification_message" name="badgenotificationmessage" placeholder="Notification Message">
						    </div>
						</div>
					</div>
					<div class="form-group">        
				      <div class="col-sm-offset-2 col-sm-10">
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