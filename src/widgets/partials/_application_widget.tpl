<script src="<%= grunt.config('baseUrl') %>/js/application.js"></script>
</head>
<body>
<div class="container-fluid">
  <div class="row">
    <!-- Tabs Container -->
    <div class="container-fluid text-center" style="height:<%= meta.table_height %>px; overflow: auto;">
      <!-- Tabs Application -->
      <ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
        <li class="active"><a href="#registeredapps" data-toggle="tab">Registered Applications</a></li>
        <li><a href="#allapps" data-toggle="tab">Other Applications</a></li>
      </ul>
      <div id="my-tab-content" class="tab-content">
        <!-- All Applications -->
        <div class="tab-pane " id="allapps">
              <table class="table table-striped table-bordered table-hover table-can-be-selected" id='list_global_apps_table'>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>App ID</th>
                    <th>Description</th>
                    <th>Community Type</th>
                </thead>
                
                <tbody id='globalappstbody'>
                </tbody>
              </table>
        </div>
        <!-- End All Applications -->
        <!-- Registered Applications -->
        <div class="tab-pane active" id="registeredapps">
          <small>You are registered in the applications below</small>
             <table class="table table-striped table-bordered table-hover table-can-be-selected" id='list_registered_apps_table'>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>App ID</th>
                    <th>Description</th>
                    <th>Community Type</th>               
                    <th>Remove</th>
                    <th>Delete</th>
                </thead>
                  
                <tbody id='registeredappstbody'>
                </tbody>

              </table>
        </div>
        <!-- End Registered Applications -->
      </div>
      <!-- End Tabs Application -->
    </div>
    <!-- End Tabs Container -->
    <div class="container-fluid">
     <button type="button" class="btn btn-success text-center" data-toggle="modal" data-target="#createnewapp"><span class=" glyphicon glyphicon-plus"></button>
    <button id="refreshbutton" type="button" class="btn btn-info pull-right"> <span class=" glyphicon glyphicon-refresh"></button>
    </div>
  </div>
</div>

<div class="modal fade" id="alertglobalapp" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Select The Existing Application</h4>
      </div>
      <div class="modal-body">
        <p id="alertglobalapp_text"></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" value="Open" >Open</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="alertregisteredapp" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Select Your Registered Application</h4>
      </div>
      <div class="modal-body">
        <p id="alertregisteredapp_text"></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" value="Open" >Open</button>
      </div> 
    </div>
  </div>
</div>

<div class="modal fade" id="alertdeleteapp" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Delete the application</h4>
      </div>
      <div class="modal-body">
        <p id="alertdeleteapp_text"></p>
      </div>
      <div class="modal-footer">
        <button id='' type="button" class="btn btn-primary" onclick='deleteApplicationAlertHandler()' value="Delete" >Delete</button>
      </div> 
    </div>
  </div>
</div>

<div class="modal fade" id="alertremoveapp" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Remove the application</h4>
      </div>
      <div class="modal-body">
        <p id="alertremoveapp_text"></p>
      </div>
      <div class="modal-footer">
        <button id='' type="button" class="btn btn-primary" onclick='removeApplicationAlertHandler()' value="Remove" >Remove</button>
      </div> 
    </div>
  </div>
</div>

<div class="modal fade" id="createnewapp" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Create New Application</h4>
      </div>
      <div class="modal-body">
        <form method="POST" enctype="multipart/form-data" method="post" id="createnewappform" class="form-horizontal" role="form">
          <div class="form-group">
            <label class="col-sm-2 control-label">Application ID:</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" maxlength="20" id="createnewapp_appid" name="appid" placeholder="My Gamification" required>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Community Type:</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" maxlength="20" id="createnewapp_commtype" name="commtype" placeholder="my_community">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Application Description:</label>
            <div class="col-sm-10">
              <textarea class="form-control" rows="3" maxlength="50" id="createnewapp_appdesc" name="appdesc" placeholder="This is the application description"></textarea>
            </div>
          </div>
          <div class="form-group">        
              <div class="col-sm-offset-2 col-sm-10">
                  <button type="submit" class="btn btn-primary" value="Create" >Create</button>
                </div>
            </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="settingsmodal" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Settings</h4>
      </div>
      <div class="modal-body">
        <div class="table-responsive" id='list_registered_apps_settings'>
            <h4>Manage Your Registered Applications</h4>
            <table class="table table-striped table-hover" id='list_registered_apps_settings_table'>
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Description</th>
                  <th>Community Type</th>
                  <th></th>
                  <th></th>
              </thead>
              
              <tbody id='registeredappssettingstbody'>
            
              </tbody>

            </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal" value="OK" >OK</button>
      </div>
    </div>
  </div>
</div>

<div id="modalspinner" style="display: none">
    <div class="center">
        <img alt="" src="<%= grunt.config('baseUrl') %>/img/loader.svg" />
    </div>
</div>