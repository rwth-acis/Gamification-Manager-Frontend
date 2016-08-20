<?xml version="1.0" encoding="UTF-8" ?>
<!-- generated on <%= grunt.template.today() %> -->
<Module>
  <ModulePrefs
    title="<%= meta.title %>"
    description="<%= meta.description %>"
    author="<%= grunt.config('pkg.author.name') %>"
    author_email="<%= grunt.config('pkg.author.email') %>"
    width="<%= meta.width %>"
    height="<%= meta.height %>" scrolling="true">

    <Require feature="opensocial-0.8" ></Require>
    <Require feature="openapp" ></Require>
    <Require feature="dynamic-height"></Require>
	  <Require feature="settitle"/>
      <Require feature="minimessage" />
	<OAuth>
      <Service name="openapp" 
        xmlns:openapp="http://www.role-project.eu/xml/openapp/opensocialext/"
        openapp:service="http://purl.org/role/terms/spaceService"
        openapp:permitReadAppend="http://purl.org/role/terms/data">
        <Request method="" url=""></Request>
        <Authorization url=""></Authorization>
        <Access method="" url=""></Access>
      </Service>
    </OAuth>
	
  </ModulePrefs>
  <Content type="html">
    <![CDATA[
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script src="<%= grunt.config('baseUrl') %>/js/lib/jquery.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/bootstrap.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/iwc.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/las2peerWidgetLibrary.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/oidc-widget.js"></script>
    <script src="<%= grunt.config('baseUrl') %>/js/lib/gamificationelements.js"></script>
    <link rel="stylesheet" href="<%= grunt.config('baseUrl') %>/css/bootstrap.css">
    <link rel="stylesheet" href="<%= grunt.config('baseUrl') %>/css/style.css">
    <%= partial(bodyPartial,null) %> 
    </body>
    </html>
    ]]>
  </Content>
</Module>
