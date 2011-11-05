<!DOCTYPE html>
<html>
	<head>
		<title>FMA Radio</title>
		<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="css/main.css" />
		<script src="js/head.load.min.js"></script> <!-- Load head.load.js in head, load others using this in body -->
		
	</head>
	<body>
	
	<div class="topbar">
      <div class="topbar-inner">
        <div class="container-fluid">
          <a class="brand" href="#">FMA Radio</a>
        </div><!-- /.container-fluid -->
      </div><!-- /.topbar-inner -->
    </div><!-- /.topbar -->
	
	<div class="container-fluid">
		<div class="sidebar">
			<div class="well">
			SIDEBAR
			</div><!-- ./well -->
		</div><!-- /.sidebar -->

		<div class="content">
			<div class="hero-unit">
			CONTENT
			</div><!-- ./hero-unit -->
		</div><!-- /.content -->
	</div><!-- /.container-fluid -->
	
	<script type="text/javascript" src="js/jquery-1.7.min.js"></script>
	<script type="text/javascript" src="js/fma.js"></script>
	
	<script>

	head.js("js/jquery-1.7.min.js", "js/fma.js", function() {

		$(document).ready(function() {
			fma.load();
		});
	});
	</script>
	
	</body>
</html>