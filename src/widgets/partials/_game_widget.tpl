<script src="{{= grunt.config('baseUrl') }}/js/lib/oidc-widget.js"></script>
<script src="{{= grunt.config('baseUrl') }}/js/gamificationelements.js"></script>
<script src="{{= grunt.config('baseUrl') }}/js/game.js"></script>
<link rel="stylesheet" type="text/css" href="{{= grunt.config('baseUrl') }}/css/game_style.css">


<script id="login-template" type="text/template">

 <div id="loginbox" style="margin-top:50px;" class="col-sm-12 text-sm-center">                    
    <div class="panel panel-info" >
    <div class="panel-heading">
        <div class="panel-title">
          <h2>Gamification Manager
          </h2>
        </div>
    </div>     

    <div style="padding-top:30px" class="panel-body" >

        <h5>This is a game manager widget. To start using all widgets in gamification manager, you have to click the start button below first.</h5>
        <div id="login-alert" class="alert alert-danger col-sm-12">
          <p>Please click the start button after all widgets are loaded</p>
        </div>
            <div style="margin-top:10px" >
                <!-- Button -->
                <div class="col-sm-12">
                  <a id="btn-login" href="#" class="btn btn-success" onclick="startButtonListener();">Start  </a>

                </div>
            </div>
        </div>                     
    </div>  
</div>

</script>

<!-- Existing game template -->
<script id="existing-game-template" type="text/template">
      <a class="list-group-item list-group-item-action" data-toggle="modal" data-target="#buttonModal" data-gameid="<%= game_id%>">
        <% if(memberHas){%>
        <span class="pull-xs-right text-warning"><i class="fa fa-star"></i></span>
        <% }%>
        <h5 class="list-group-item-heading"><i class="fa fa-gamepad" aria-hidden="true"></i> <%= game_id%></h5>
        <h6 class="list-group-item-heading text-primary"><i class="fa fa-users" aria-hidden="true"></i> <%= community_type%></h6>
        <p class="list-group-item-text"><%= description%></p>
      </a>
</script>



<script id="game-content-template" type="text/template">
<div class="row-offcanvas row-offcanvas-left">
  <div id="sidebar" class="sidebar-offcanvas">
      <div class="wrapper">

        <div class="col-sm-12 text-sm-center" >
              <a href="https://github.com/rwth-acis/Gamification-Framework/wiki/Gamifying-Application" target="_blank">
              <img id="image-logo" src="{{= grunt.config('baseUrl') }}/img/gflogo.png">
              </a>
              <h5 >Game Manager </h5>

                <small ><strong>Welcome</strong> </small>
                <small id="member-id"> </small>
        </div>
        <div class="push"></div>
    </div>

    <div class="footer">
      <div class="col-sm-12" >

        <div class="text-sm-center">
           <a href="#" class="" data-toggle="modal" data-target="#createnewgame" style="text-decoration: none;" title="Create New Game"><i class="fa fa-plus fa-2x"></i></a>
        </div>
        <div class="text-sm-center">
           <a href="#" id="refreshbutton" class="" style="text-decoration: none;" title="Refresh Content" onclick='refreshButtonHandler()'><i class="fa fa-refresh fa-2x"></i></a>
        </div>
        <div class="text-sm-center">
           <a href="#" class="" data-toggle="modal" data-target="#help" style="text-decoration: none;" title="Help"> <i class="fa fa-question fa-2x"></i></a>
          
        </div>
      </div>
        
    </div>
  </div>
  <div id="main">
<!--     <table class="table ">
      <thead>
        <tr>
          <th>Game ID</th>
          <th>Community Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        

      </tbody>
    </table> -->
    <div class="list-group">

    </div>
  </div>
</div>
</script>



<div id="game-content" >
</div>

  <div class="modal fade" id="buttonModal" tabindex="-1" role="dialog" aria-labelledby="buttonModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-sm-center" id="buttonModalLabel"></h5>
        </div>
        <div class="modal-body text-sm-center">
          <button type='button' onclick='selectGameHandler(null)' class='btn btn-xs btn-success bselect'>Select</button>
          <button type='button' data-dismiss='modal' data-toggle='modal' data-target='#alertremovegame' data-gameid="null" class='btn btn-xs btn-warning'>Remove</button>
          <button type='button' data-dismiss='modal' data-toggle='modal' data-target='#alertdeletegame' data-gameid="null" class='btn btn-xs btn-danger'>Delete</button>

        </div>
      </div>
    </div>
  </div>

<!-- Help modal -->
<div class="modal fade" id="help">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Help</h5>
        </div>
        <div class="modal-body">
          <dl class="row">
            <dt class="col-sm-3 text-sm-right">Overview</dt>
            <dd class="col-sm-9">This widget shows the games that are already created by another members for their community. You can join them by selecting a game. By selecting the game, you are automatically registered to that game. </dd>

            <dt class="col-sm-3 text-sm-right text-danger">Warning!</dt>
            <dd class="col-sm-9">You can unregister yourself by choosing the remove button that is appeared when you select the game. All of your data (obtained point, badge, etc) while playing the game will be gone. You can re-register yourself by selecting the game, but you will start from the beginning</dd>
  
            <dt class="col-sm-3 text-sm-right text-danger">Warning!</dt>
            <dd class="col-sm-9">You also could delete any created game. When you delete the game, all the data about game and the registered members will be gone!.</dd>

            <dt class="col-sm-3 text-sm-center "><i class="fa fa-gamepad" aria-hidden="true"></i> Game ID</dt>
            <dd class="col-sm-9">This is the Game ID of the game. It is needed to integrate your game in Gamifier widget in CAE Frontend Component Generator Space.</dd>


            <dt class="col-sm-3 text-sm-center text-primary"><i class="fa fa-users" aria-hidden="true"></i> Community Type</dt>
            <dd class="col-sm-9">The community type of your game. The members of the game with the same community type will be compared together in the Global leaderboard.</dd>

            <dt class="col-sm-3 text-sm-center text-warning"><i class="fa fa-star"></i></dt>
            <dd class="col-sm-9">The game with this icon indicates that you are already registered to the game. To unregister your game, you can choose Unregister when hovering on the game.</dd>
          </dl>
        
        </div>
      </div>
    </div>

</div>

<div class="modal fade" id="alertdeletegame" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Delete the game</h4>
      </div>
      <div class="modal-body">
        <p></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" onclick='deleteGameAlertHandler()' value="Delete" >Delete</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="alertremovegame" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Remove the game</h4>
      </div>
      <div class="modal-body">
        <p id="alertremovegame_text"></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" onclick='removeGameAlertHandler()' value="Remove" >Remove</button>
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
            <label for="createnewgame_gameid">Game ID</label>
              <input type="text" class="form-control" maxlength="20" id="createnewgame_gameid" name="gameid" placeholder="My Gamification" required>
          </div>
          <div class="form-group">
            <label for="createnewgame_commtype">Community Type</label>
              <input type="text" class="form-control" maxlength="20" id="createnewgame_commtype" name="commtype" placeholder="my_community">
          </div>
          <div class="form-group">
            <label for="createnewgame_gamedesc">Game Description</label>
              <textarea class="form-control" rows="3" maxlength="50" id="createnewgame_gamedesc" name="gamedesc" placeholder="This is the game description"></textarea>
          </div>
          <div class="form-group">
                  <button type="submit" class="btn btn-primary" value="Create" >Create</button>
            </div>
          </form>
      </div>
    </div>
  </div>
</div>

<div id="modalspinner" style="display: none">
    <div class="center">
        <img alt="" src="{{= grunt.config('baseUrl') }}/lib/loading.svg" />
    </div>
</div>