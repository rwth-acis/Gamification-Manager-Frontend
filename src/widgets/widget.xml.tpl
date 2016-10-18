<?xml version="1.0" encoding="UTF-8" ?>
<!-- generated on {{ grunt.template.today() }} -->
<Module>
  <ModulePrefs
    title="{{= meta.title }}"
    description="{{= meta.description }}"
    author="{{= grunt.config('pkg.author.name') }}"
    author_email="{{= grunt.config('pkg.author.email') }}"
    width="{{= meta.width }}"
    height="{{= meta.height }}" scrolling="true">

    <Require feature="opensocial-0.8" ></Require>
    <Require feature="openapp" ></Require>
    <Require feature="dynamic-height"></Require>
      <Require feature="minimessage"></Require>
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
    <script src="{{= grunt.config('baseUrl') }}/js/lib/jquery.js"></script>
    <script src="{{= grunt.config('baseUrl') }}/js/lib/tether.js"></script>
    <script src="{{= grunt.config('baseUrl') }}/js/lib/bootstrap.js"></script>
    <script src="{{= grunt.config('baseUrl') }}/js/lib/iwc.js"></script>
    <script src="{{= grunt.config('baseUrl') }}/js/lib/las2peerWidgetLibrary.js"></script>
    <script src="{{= grunt.config('baseUrl') }}/js/lib/lodash.js"></script>
    <link rel="stylesheet" href="{{= grunt.config('baseUrl') }}/css/bootstrap.css">
    <link rel="stylesheet" href="{{= grunt.config('baseUrl') }}/css/style.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    {{= partial(bodyPartial,null) }}
    ]]>
  </Content>
</Module>
