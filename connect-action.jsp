<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
	<head>
	<title>Red Book Connect - HotSchedules Post</title>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=device-dpi"/>
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<link rel="shortcut icon" href="images/favicon.ico"/>
		<link rel="stylesheet" type="text/css" href="styles/resets.css"/>
		<style type="text/css">
			@import url(https://fonts.googleapis.com/css?family=Roboto:100,400italic,400,300);
			body{
				background-image: url("images/background.jpg");
				background-position: center;
				background-repeat: no-repeat;
				background-size: cover;
				overflow: auto;
			}
			.wrapper{
				display: none;
				width: 600px;
				margin: 60px auto;
			}
			.card{
				display: block;
				float: left;
				clear: both;
				width: 100%;
				background-color: #f9f9f9;
				box-shadow: 0 4px 4px 0 rgba(0,0,0,0.25);
				overflow: hidden;
			}
			.card .inner-frame{
				display: block;
				float: left;
				width: calc(100% - 10px);
				height: calc(100% - 10px);
				margin: 4px;
				border: 1px solid #dddddd;
				background-image: url("images/background-noise.jpg");
				overflow: hidden;
			}
			.card .inner-frame .title{
				display: block;
				float: left;
				clear: both;
				width: 100%;
				padding: 30px 0;
				font-family: "Roboto", sans-serif;
				font-weight: 100;
				font-size: 48px;
				text-align: center;
				border-bottom: 1px solid #ebebeb;
			}
			.card .inner-frame .message{
				display: block;
				float: left;
				clear: both;
				width: calc(100% - 40px);
				margin: 20px;
				color: #666666;
				font-family: "Roboto", sans-serif;
				font-weight: 300;
				font-size: 18px;
				text-align: center;
			}
			.card .inner-frame .message span{
				color: #666666;
				font-family: "Roboto", sans-serif;
				font-weight: 400;
				font-size: 18px;
			}
			.footer{
				display: block;
				float: left;
				clear: both;
				width: 100%;
			}
			.footer .hsp-logo{
				display: block;
				float: left;
				clear: both;
				width: 100%;
				height: 64px;
				background-image: url("images/logo-hsp.png");
				background-repeat: no-repeat;
				background-position: center;
				background-size: 152px auto;
				border-bottom: 1px solid rgba(255,255,255,0.15);
			}
			.footer .links{
				display: block;
				float: left;
				clear: both;
				width: 100%;
			}
			.footer .links a{
				display: block;
				float: left;
				margin: 0 4px;
				font-size: 13px;
				color: rgba(255,255,255,0.6);
				line-height: 44px;
				text-decoration: none;
			}

			.footer .links a:first-child{
				margin-left: 0;
			}

			.footer .links a:last-child{
				margin: 0;
				float: right;
			}

			.footer .links a:hover{
				color: #ffffff;
			}
			@media screen and (max-width: 650px){
				.wrapper{
					width: calc(100% - 20px);
					margin: 60px 10px;
				}
				.card .inner-frame .title{
					font-size: 32px;
				}
				.card .inner-frame .message{
					font-size: 14px;
				}
				.card .inner-frame .message span{
					font-size: 14px;
				}
				.footer .hsp-logo{
					height: 48px;
					background-size: 114px auto;
				}
				.footer .links a{
					display: none;
					font-size: 10px;
					line-height: 14px;
					margin-top: 15px;
				}

				.footer .links a:first-child{
					margin-left: 74px;
				}

				.footer .links a:last-child{
					display: block;
					clear: both;
					width: 100%;
					margin: 8px 0 0 0;
					text-align: center;
					float: right;
					line-height: 14px;
				}
			}
		</style>
		 <script type="text/javascript" src="libraries/thirdparty/analytics.js"></script>
		<script type="text/javascript">
        function detectDevice(){
            var agent = navigator.userAgent;

            if(agent.match(/Android/i)){
                return "Android";
            }else if(agent.match(/iPhone|iPad|iPod/i)){
                return "iOS";
            }else if(agent.match(/IEMobile/i)){
                return "WindowsMobile";
            }else{
                return "Unknown";
            }

        }

<%
    String user = request.getParameter("user");
%>

        function redirectForMobile(){
            ga('send', 'pageview');
            var device = detectDevice();
            if(device === "Android"){
                var url = 'intent://?viewprofile=<%=user%>#Intent;package=com.hotschedules.brushfire;scheme=hotschedulespost;end';
                window.location = url;
            } else if(device === "iOS") {
                var url = 'hotschedulespost://?viewprofile=<%=user%>';
                window.location = url;
            } else {
                var wrapper_div = document.getElementById('wrapper_div');
                wrapper_div.style.display = 'block';
            }
        }
        </script>
	</head>
	<body onload="redirectForMobile()">
		<div id="wrapper_div" class="wrapper">
			<div class="card">
				<div class="inner-frame">
					<div class="message">
					    You have successfully
						<%
							if("PENDING".equals(request.getParameter("status"))){
								out.println(" requested a connection ");
							} else {
								out.println(" been connected");
							}
						%>
						with
						<%
						    out.println(request.getParameter("firstName") + " " + request.getParameter("lastName"));
						%>
					</div>
				</div>
			</div>
			<div class="footer">
				<div class="hsp-logo"></div>
				<!-- TODO - wire up these links
				<div class="links">
					<a href="#">Learn More</a> <a>|</a> <a href="#">Other Great Products</a>
					<a>&copy; 1999 - 2014 Red Book Connect LLC. All rights reserved.</a>
				</div>
				-->
			</div>
		</div>
	</body>
</html>