<script src="<%= grunt.config('baseUrl') %>/js/action.js"></script>

</head>
<body>
<div id="wrapper" class="container-fluid" >
	<div class="row">
		<div class="col-md-12">
			<div style="height:<%= meta.table_height %>px; overflow: auto;">
				<table class="table table-bordered table-striped table-fixed" id='list_actions'>
					<thead>
						<tr>
							<th>Action ID</th>
							<th>Name</th>
							<th>Description</th>
							<th>Point Value</th>
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
			     <button id="addnewaction" type="button" class="btn btn-success"><span class=" glyphicon glyphicon-plus"></button> 
			    <button id="refreshbutton" type="button" class="btn btn-info pull-right"> <span class=" glyphicon glyphicon-refresh"></button>
			</div>
		</div>
		<div class="col-md-0">
		</div>
	</div>
</div>

<!-- /.container-fluid -->
<div class="modal fade" id="modalactiondiv" role="dialog">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
			    <button type="button" class="close" data-dismiss="modal">&times;</button>
			    <h4 class="modal-title"></h4>
			</div>
			<div class="modal-body">
				<form method="POST" data-toggle="validator" enctype="multipart/form-data" id="modalactionform" name="appId" class="form-horizontal" role="form">
				    <div class="form-group">
						<label class="col-sm-2 control-label">Action ID</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" maxlength="20" id="action_id_name" name="actionid" placeholder="my_action" required>
						</div>
						
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">Action Name</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" maxlength="20" id="action_name" name="actionname" placeholder="The click action" required>
						</div>
					</div>
					<div class="form-group">
					  <label class="col-sm-2 control-label">Description</label>
					  <div class="col-sm-10">
					  	<textarea class="form-control" rows="3" maxlength="100" id="action_desc" name="actiondesc"></textarea>
					  </div>
					</div>
					<!-- Form group end -->
					<div class="form-group">
						<label class="col-sm-2 control-label">Value</label>
						<div class="col-sm-10">
					  		<input type="number" class="form-control" placeholder="0" id="action_point_value" name="actionpointvalue" value="0" required>
						</div>
					</div>
					<div class="form-group">								
						<label class="col-sm-2 control-label">Notification</label>
						<div class="col-sm-10">
						  	<div class="input-group">
							      <span class="input-group-addon">
							        <input type="checkbox" aria-label="..." id="action_notification_check" name="actionnotificationcheck">
							      </span>
							      <input type="text" class="form-control" id="action_notification_message" name="actionnotificationmessage" placeholder="Notification Message" >
						    </div>
						</div>
					</div>
					<div class="form-group">        
				    	<div class="col-sm-offset-2 col-sm-10">
				        	<button id="modalactionsubmit" type="submit" class="btn btn-primary" value="" ></button>
				    	</div>
					</div>
			</form>
		</div>
			    <!-- <div class="modal-footer">
			        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			    </div> -->
		</div>
	</div>
</div>

<div id="modalspinner" style="display: none">
    <div class="center">
        <img alt="" src="<%= grunt.config('baseUrl') %>/img/loader.svg" />
    </div>
</div>
