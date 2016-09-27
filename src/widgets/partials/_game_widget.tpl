<script src="<%= grunt.config('baseUrl') %>/js/lib/oidc-widget.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/gamificationelements.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/game.js"></script>

<div class="container-fluid text-center">
  <div class="row">
  <h4 id="title-widget">Game ID : - </h4>
  </div>
</div>          
<div class="container-fluid">
  <div class="row">
    <div class="container" id="login-text">
  <h4>
    Click Login after all widgets are loaded.
  </h4>
  </div>
    <!-- Tabs Container -->
    <div class="container-fluid text-center" style="height:<%= meta.table_height %>px; overflow: auto;">
      <!-- Tabs Game -->
      <ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
        <li class="active"><a href="#registeredgames" data-toggle="tab">Registered Games</a></li>
        <li><a href="#allgames" data-toggle="tab">Other Games</a></li>
      </ul>
      <div id="my-tab-content" class="tab-content">
        <!-- All Games -->
        <div class="tab-pane " id="allgames">
            <div style="width:100%; height:300px; overflow:auto;">
              <table class="table table-striped table-bordered table-hover table-can-be-selected" id='list_global_games_table'>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Game ID</th>
                    <th>Description</th>
                    <th>Community Type</th>
                </thead>

                <tbody id='globalgamestbody'>
                </tbody>
              </table>
            </div>
        </div>
        <!-- End All Games -->
        <!-- Registered Games -->
        <div class="tab-pane active" id="registeredgames">
          <small>You are registered in the games below</small>
            <div style="width:100%; height:300px; overflow:auto;">
             <table class="table table-striped table-bordered table-hover table-can-be-selected" id='list_registered_games_table'>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Game ID</th>
                    <th>Description</th>
                    <th>Community Type</th>
                    <th>Remove</th>
                    <th>Delete</th>
                </thead>

                <tbody id='registeredgamestbody'>
                </tbody>

              </table>
            </div>
        </div>
        <!-- End Registered Games -->
      </div>
      <!-- End Tabs Game -->
    </div>
    <!-- End Tabs Container -->
    <div class="container-fluid">
     <button id="addnewgame" type="button" class="btn btn-success text-center" ><span class=" glyphicon glyphicon-plus"></button>
    <button id="refreshbutton" type="button" class="btn btn-info pull-right"> Login </button>
    </div>
  </div>
</div>

<div class="modal fade" id="alertglobalgame" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Select The Existing Game</h4>
      </div>
      <div class="modal-body">
        <p id="alertglobalgame_text"></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" value="Open" >Open</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="alertregisteredgame" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Select Your Registered Game</h4>
      </div>
      <div class="modal-body">
        <p id="alertregisteredgame_text"></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" value="Open" >Open</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="alertdeletegame" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Delete the game</h4>
      </div>
      <div class="modal-body">
        <p id="alertdeletegame_text"></p>
      </div>
      <div class="modal-footer">
        <button id='' type="button" class="btn btn-primary" onclick='deleteGameAlertHandler()' value="Delete" >Delete</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="alertremovegame" role="dialog">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Remove the game</h4>
      </div>
      <div class="modal-body">
        <p id="alertremovegame_text"></p>
      </div>
      <div class="modal-footer">
        <button id='' type="button" class="btn btn-primary" onclick='removeGameAlertHandler()' value="Remove" >Remove</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="createnewgame" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Create New Game</h4>
      </div>
      <div class="modal-body">
        <form method="POST" enctype="multipart/form-data" method="post" id="createnewgameform" class="form-horizontal" role="form">
          <div class="form-group">
            <label class="col-sm-2 control-label">Game ID:</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" maxlength="20" id="createnewgame_gameid" name="gameid" placeholder="My Gamification" required>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Community Type:</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" maxlength="20" id="createnewgame_commtype" name="commtype" placeholder="my_community">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Game Description:</label>
            <div class="col-sm-10">
              <textarea class="form-control" rows="3" maxlength="50" id="createnewgame_gamedesc" name="gamedesc" placeholder="This is the game description"></textarea>
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
        <div class="table-responsive" id='list_registered_games_settings'>
            <h4>Manage Your Registered Games</h4>
            <table class="table table-striped table-hover" id='list_registered_games_settings_table'>
              <thead>
                <tr>
                  <th>Game ID</th>
                  <th>Description</th>
                  <th>Community Type</th>
                  <th></th>
                  <th></th>
              </thead>

              <tbody id='registeredgamessettingstbody'>

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
