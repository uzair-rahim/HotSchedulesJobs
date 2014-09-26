
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
    <link rel="stylesheet" type="text/css" href="styles/global.css"/>
    <script type="text/javascript" src="libraries/thirdparty/jquery.1.10.js"></script>
    <script type="text/javascript">
      $(document).ready(function(){
        var url = window.location.href;
        var indexOfType = url.indexOf("?type=");
          if(indexOfType > 0){
            var type = url.substring(indexOfType+6);
            if(type) {
	            switch(type){
	              case "noyelpid":
	                $("#brushfire.four-o-four h1").text("We're having trouble finding your store");
	                $("#brushfire.four-o-four p:eq(0)").html("If you don't have one, <a href='https://biz.yelp.com/' target='_blank'>create a Yelp account here.");
	                $("#brushfire.four-o-four p:eq(1)").html("Have a Yelp account? Make sure your phone number and address match on HotSchedules and Yelp");
	                $("#brushfire.four-o-four h2").html("Still not working? Give us a call at <a href='tel:866-763-3852'>866-763-3852</a>");
	              break;
	              case "UserEmailMissing":
	                  $("#brushfire.four-o-four h1").text("Please set your email in HotSchedules before SingleSignOn into HSPost.");
	                  $("#brushfire.four-o-four p:eq(0)").html("Seems like your HotSchedules account email is not set.");
	                  $("#brushfire.four-o-four p:eq(1)").html("");
	                  $("#brushfire.four-o-four h2").html("Still not working? Give us a call at <a href='tel:866-763-3852'>866-763-3852</a>");
	              break;
	            }
             }
          }

        
      });
    </script>
  </head>
  <body>
    <div id="brushfire" class="four-o-four">
      <div class="logo-hsp"></div>
      <div class="icon-error">Whoops!</div>
      <h1>404: Page Not Found</h1>
      <p>The page you are looking for might have been removed, had its name changed, or temporarily unavailable.</a></p>
      <p>Double check the URL or head back to the <a href="index.jsp">homepage</a></p>
      <h2>Can't find a solution? Give us a call at <a href="tel:866-763-3852">866-763-3852</a></h2>
      <p class="small">- The HotSchedules Post Team</p>
    </div>
  </body>
</html>