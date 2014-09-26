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
    <link rel="stylesheet" type="text/css" href="styles/gridlist.css"/>
    <script type="text/javascript">
      var CONTEXT_ROOT = '<%= request.getContextPath() %>'; 
    </script>
    <script>var requirejs = {
        //baseUrl: '@BaseURL@',
        //urlArgs: 'rpj=@Version@'
        };</script>
    <script src="libraries/thirdparty/require.js" data-main="brushfire-reset-password-config"></script>
  </head>
  <body>
    <div id="brushfire"></div>
  </body>
</html>