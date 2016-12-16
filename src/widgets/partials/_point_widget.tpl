<script src="<%= grunt.config('baseUrl') %>/js/gamificationelements.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/point.js"></script>


<div class="container-fluid">
</div>

<script id="login-template" type="text/template">
<div class="alert alert-info" role="alert">
	<h5 class="text-xs-center">To use this widget, please select the Game ID in Game Widget.</h5>
	</div>
</script>

<script id="content-template" type="text/template">

<div class="text-xs-center">
  <h6 id="title-widget">Game ID : - </h6>
</div>     
<div class="card">
  <div class="card-header">
    Point Unit Name
  </div>
  <div class="card-block">
    	<h5 class="card-title text" id="level_point_id_static"></h5>
    	 <div class="input-group">
	      <input type="text" class="form-control" placeholder="Unit name" id="level_point_id" name="levelpointid">
	      <span class="input-group-btn">
	        <button class="btn btn-success" type="button" id="select_point">Update</button>
	      </span>
	    </div>
  </div>
</div>

</script>