<script src="<%= grunt.config('baseUrl') %>/js/gamificationelements.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/action.js"></script>

<script id="list-action" type="text/template">
      <a class="list-group-item list-group-item-action" data-toggle="modal" data-target="#contentModal" data-actionid="{{=id}}">

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
      <h6><strong>Action</strong></h6>
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
          <button type="button" class="btn btn-secondary btn-success bedit" data-toggle="modal" data-target="#help" title="Help"><i class="fa fa-question"></i></button>
        </div>
      </div>
        
    </div>
  </div>
  <div id="main">

  
    <div class="list-group">

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
            <dd class="col-xs-9">Action ID.</dd>

            <dt class="col-xs-3 text-xs-center "><span class="tag tag-pill tag-success">5</span></dt>
            <dd class="col-xs-9">Point value of action.</dd>

            <dt class="col-xs-3 text-xs-center "><i class="fa fa-align-justify" aria-hidden="true"></i></dt>
            <dd class="col-xs-9">Action Description.</dd>

            <dt class="col-xs-3 text-xs-center text-success"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Green means the action use notification message.</dd>

            <dt class="col-xs-3 text-xs-center text-danger"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Red means the action does not use notification message.</dd>
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
        </div>
        <div class="card">
          <div class="card-header" title="Action ID">
            <i class="fa fa-tag" aria-hidden="true"></i> ID
            <span class="tag tag-pill tag-success float-xs-right">5</span>
          </div>
          <div class="card-block">
            <h4 class="card-title" title="Action Name">Name</h4>
            <p class="card-text desc" title="Action Description"><i class="fa fa-align-justify" aria-hidden="true"></i> Description</p>
            <p class="card-text msg" title="Action Message"><i class="fa fa-comment-o" aria-hidden="true"></i> Message</p>
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

  <div class="modal" id="modalactiondiv" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title"></h4>
      </div>
      <div class="modal-body">
        <form method="POST" data-toggle="validator" enctype="multipart/form-data" id="modalactionform" name="gameId" class="form-horizontal" role="form">
          <div class="form-group row">
              <label for="action_id_name" class="col-xs-2 col-form-label">Action ID</label>
              <div class="col-xs-10">
                <input type="text" class="form-control" maxlength="20" id="action_id_name" name="actionid" placeholder="my_action" required>
              </div>
          </div>
          <div class="form-group row">
            <label for="action_name" class="col-xs-2 col-form-label">Action Name</label>
            <div class="col-xs-10">
              <input type="text" class="form-control" maxlength="20" id="action_name" name="actionname" placeholder="The click action" required>
            </div>
          </div>
          <div class="form-group row">
            <label for="action_desc" class="col-xs-2 col-form-label">Description</label>
            <div class="col-xs-10">
              <textarea class="form-control" rows="3" maxlength="100" id="action_desc" name="actiondesc"></textarea>
            </div>
          </div>
          <!-- Form group end -->
          <div class="form-group row">
            <label for="action_point_value" class="col-xs-2 col-form-label">Value</label>
            <div class="col-xs-10">
              <input type="number" class="form-control" placeholder="0" id="action_point_value" name="actionpointvalue" value="0" required>
            </div>
          </div>
          <div class="form-group row">
            <label for="action_notification_message" class="col-xs-2 col-form-label">Notification</label>
            <div class="col-xs-10">
              <div class="input-group">
                  <span class="input-group-addon">
                    <input type="checkbox" aria-label="..." id="action_notification_check" name="actionnotificationcheck">
                  </span>
                  <input type="text" class="form-control" id="action_notification_message" name="actionnotificationmessage" placeholder="Notification Message" >
              </div>
            </div>
          </div>
          <div class="form-group row">
            <div class="offset-xs-2 col-xs-10">
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
