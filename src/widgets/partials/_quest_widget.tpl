<script src="<%= grunt.config('baseUrl') %>/js/gamificationelements.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/quest.js"></script>
<script id="list-quest" type="text/template">
      <a class="list-group-item list-group-item-action" data-toggle="modal" data-target="#contentModal" data-questid="{{=id}}">

        <h6 class="list-group-item-heading"><i class="fa fa-tag" aria-hidden="true"></i> {{=id}}</h5>
        <h6 class="list-group-item-heading"> {{=name}}</h6>
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
      <h6><strong>Quest</strong></h6>
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

  
    <div class="list-group list-quest-group">

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
            <dd class="col-xs-9">Quest ID.</dd>

            <dt class="col-xs-3 text-xs-center "><i class="fa fa-align-justify" aria-hidden="true"></i></dt>
            <dd class="col-xs-9">Quest Description.</dd>


            <dt class="col-xs-3 text-xs-center"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></dt>
            <dd class="col-xs-9">Quest Status.</dd>

            <dt class="col-xs-3 text-xs-center"><i class="fa fa-chain" aria-hidden="true"></i> Quest Constraints</dt>
            <dd class="col-xs-9">Red means the quest does not use that constraint. Green means the quest uses that constraint.</dd>

            <dt class="col-xs-3 text-xs-center text-success"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Green means the quest use notification message.</dd>

            <dt class="col-xs-3 text-xs-center text-danger"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Red means the quest does not use notification message.</dd>
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
<!--           <div class="card-header">
          	<button type="button" class="close" data-dismiss="modal">&times;</button>
            <i class="fa fa-tag" aria-hidden="true"></i> ID
          </div> -->
          <div class="card-block">
            <h4 class="card-title">Name</h4>
            <ul class="list-group">

	            <li class="list-group-item"> <p class="card-text desc" title="Description"><i class="fa fa-align-justify" aria-hidden="true"></i> Description</p>
	            </li>
	            <li class="list-group-item"><p class="card-text status" title="Status"><i class="fa fa-ellipsis-h" aria-hidden="true"></i> Status</p>
	            </li>
	            <li class="list-group-item"><p class="card-text ach" title="Achievement"><i class="fa fa-star"></i> Achievement</p>
	            </li>
	            <li class="list-group-item"><p class="card-text" title="Constraint to reveal"><i class="fa fa-chain"></i> <strong>Constraints</strong></p>
	            <div class="row">
	              <div class="col-xs-6 text-xs-center" id="pvalue">
	              </div>
	              <div class="col-xs-6 text-xs-center" id="questconstraint">
	              </div>
	            </div>
	            </li>

	            <li class="list-group-item"><p class="card-text" title="Actions to complete"><i class="fa fa-mouse-pointer"></i> <strong>Action(s)</strong></p>

		            <ul class="list-group" id="action-list">
		            </ul>
	            </li>




	            <li class="list-group-item"><p class="card-text msg"><i class="fa fa-comment-o" aria-hidden="true" ></i> Message</p>
	            </li>
            </ul>
    
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

            <!-- /.container-fluid -->
<div class="modal" id="modalquestdiv" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title"></h4>
      </div>
      <div class="modal-body">
		<form method="POST" enctype="multipart/form-data" data-toggle="validator" id="modalquestform" name="gameId" class="form-horizontal" role="form">
		  <div class="form-group row">
		    <label for="quest_id" class="col-xs-2 col-form-label">Quest ID</label>
		    <div class="col-xs-10">
		      <input type="text" maxlength="20" class="form-control" id="quest_id" name="questid" placeholder="my_quest" required>
		    </div>

		  </div>
		  <div class="form-group row">
		    <label for="quest_name" class="col-xs-2 col-form-label">Name</label>
		    <div class="col-xs-10">
		      <input type="text" maxlength="20" class="form-control" id="quest_name" name="questname" placeholder="The quest journey" required>
		    </div>
		  </div>
		  <div class="form-group row">
		    <label for="quest_desc" class="col-xs-2 col-form-label">Description</label>
		    <div class="col-xs-10">
		      <textarea class="form-control" maxlength="100" rows="3" id="quest_desc" name="questdescription" placeholder="This is the quest description"></textarea>
		    </div>
		  </div>
		  <div class="form-group row">
		    <label for="achievement-select" class="col-xs-2 col-form-label">Achievement</label>
		    <div class="col-xs-10">
		    <select class="custom-select" id="achievement-select">
		    <option value="" selected>No achievement found</option>
		    </select>
		    </div>
		  </div>
		  <div class="form-group row">
		    <label for="status-select" class="col-xs-2 col-form-label">Status</label>
		    <div class="col-xs-5">
		    <select class="custom-select" id="status-select">
		      <option value="REVEALED" selected>Revealed</option>
		      <option value="HIDDEN">Hidden</option>
		      <option value="COMPLETED">Completed</option>
		    </select>
		    </div>
		  </div>
		  <!-- Form group end -->
		  <div class="form-group row">
		    <label for="constraint" class="col-xs-2 col-form-label">Constraints <small>(Constraint to change the quest status into REVEALED)</small></label>

		    <div class="col-xs-10">
		    	<div class="row">
				    <div class="col-xs-12">
				      <label for="quest_point_value" class="col-xs-2 control-label">Point</label>
				      <div class="col-xs-10">
				          <div class="input-group">
				              <span class="input-group-addon">
				                <input type="checkbox" aria-label="..." id="quest_point_check">
				              </span>
				              <input type="number" class="form-control" id="quest_point_value" name="questpointvalue" value="0" readonly>
				          </div>
				        <small class="text-muted">
				          The quest will be revealed after a player reached this point threshold
				        </small>
				      </div>
				    </div>
		    	</div>
		    	<div class="row">
				    <div class="col-xs-12">
				      <label for="quest_id_completed" class="col-xs-2 control-label">Completed Quest</label>
				      <div class="col-xs-10">
				        <div class="input-group">
				          <span class="input-group-addon">
				          <input type="checkbox" aria-label="..." id="quest_quest_check">
				          </span>
				          <select class="custom-select" id="quest-id-completed-select" disabled>
				            <option value="" selected>No other quest found</option>
				          </select>
				        </div>
				        <small class="text-muted">
				        The quest will be revealed after a player completed this quest
				        </small>
				      </div>
				    </div>
		    	</div>
		    </div>




		  </div>


		              <!-- Add remaining columns here -->
  <div class="form-group row">
    <label for="quest_action_list_group"  class="col-xs-2 col-form-label">Actions</label>
    <div class="col-xs-10">
	    <ul class="list-group" id="quest_action_list_group">

	    </ul>
	    <div class="input-group">
	        <span class="input-group-btn">
	          <button class="btn btn-primary btn-block" type="button" id="select_action" data-toggle="collapse" data-target="#panel_action" aria-expanded="false" aria-controls="panel_action">Show</button>
	        </span>
	    </div>

	      <div class="collapse" id="panel_action">
	        <table class="table table-bordered table-striped table-fixed" id='list_actions_a'>
	        <thead>
	          <tr>
	            <th>Action ID</th>
	            <th>Times</th>
	            <th>Select</th>
	        </thead>

	        <tbody>

	        </tbody>

	      </table>

	    </div>
    </div>
  </div>
		  <div class="form-group row">
		    <label for="quest_notification_message" class="col-xs-2 col-form-label">Notification</label>
		    <div class="col-xs-10">
		        <div class="input-group">
		            <span class="input-group-addon">
		              <input type="checkbox" aria-label="..." id="quest_notification_check" name="questnotificationcheck">
		            </span>
		            <input type="text" class="form-control" id="quest_notification_message" name="questnotificationmessage" placeholder="Notification Message" readonly>
		        </div>
		    </div>
		  </div>
		  <div class="form-group row">
		      <div class="offset-xs-2 col-xs-10">
		          <button id="modalquestsubmit" type="button" class="btn btn-primary" value="" ></button>
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