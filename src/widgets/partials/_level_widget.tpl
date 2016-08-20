<script src="<%= grunt.config('baseUrl') %>/js/level.js"></script>

</head>
<body>
<div id="wrapper" class="container-fluid" >
	<div class="row">
		<div class="col-md-12">
			<div style="height:<%= meta.table_height %>px; overflow: auto;">
				<table class="table table-bordered table-striped table-fixed" id='list_levels'>
					<thead>
						<tr>
							<th>Level Number</th>
							<th>Name</th>
							<th>Point Value</th>
							<th>Use Notification</th>
							<th>Message</th>
							<th>Edit/Delete</th>
					</thead>
								
					<tbody>
						
					</tbody>

				</table>
			</div>
			 <div class="container-fluid">
			     <button id="addnewlevel" type="button" class="btn btn-success"><span class=" glyphicon glyphicon-plus"></button> 
			    <button id="refreshbutton" type="button" class="btn btn-info pull-right"> <span class=" glyphicon glyphicon-refresh"></button>
			</div>
		</div>
		<div class="col-md-0">
		</div>
	</div>
</div>

           <!-- /.container-fluid -->
<div class="modal fade" id="modalleveldiv" role="dialog">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
			    <button type="button" class="close" data-dismiss="modal">&times;</button>
			    <h4 class="modal-title"></h4>
			</div>
			<div class="modal-body">
				<form method="POST" data-toggle="validator" enctype="multipart/form-data" id="modallevelform" name="appId" class="form-horizontal" role="form">
				    <div class="form-group">
						<label class="col-sm-2 control-label">Level Number:</label>
						<div class="col-sm-10">
							<input type="number" class="form-control" id="level_num" name="levelnum" placeholder="1" required>
							<small class="text-muted">
							  Level number should be integer to identify the status of player
							</small>
						</div>
						
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">Level Name:</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" maxlength="20" id="level_name" name="levelname" placeholder="Starter Level">
						</div>
					</div>
					<!-- Form group end -->
					<div class="form-group">
						<label class="col-sm-2 control-label">Value :</label>
						<div class="col-sm-10">
					  		<input type="number" class="form-control" placeholder="0" id="level_point_value" name="levelpointvalue" value="0">
						</div>
					</div>
		

					<div class="form-group">								
						<label class="col-sm-2 control-label">Notification :</label>
						<div class="col-sm-10">
						  	<div class="input-group">
							      <span class="input-group-addon">
							        <input type="checkbox" aria-label="..." id="level_notification_check" name="levelnotificationcheck">
							      </span>
							      <input type="text" class="form-control" id="level_notification_message" name="levelnotificationmessage" placeholder="Notification Message">
						    </div>
						</div>
					</div>
					<div class="form-group">        
				    	<div class="col-sm-offset-2 col-sm-10">
				        	<button id="modallevelsubmit" type="submit" class="btn btn-primary" value="" ></button>
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