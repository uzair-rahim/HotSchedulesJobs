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
        String jobpostingguid = request.getParameter("id");
        String jobpostingempguid = request.getParameter("employer");
        String appliedFor = Boolean.toString(request.getParameter("appliedFor") != null);
        String stopRedirect = Boolean.toString(request.getParameter("stopRedirect") != null);
    %>

            function redirectForMobile(){
                if ('<%=stopRedirect%>' === 'true') {
                    return;
                }
                var saveUrl = window.location;
                if ('<%=appliedFor%>' === 'true') {
                    ga('send', 'pageview', '/job-applied-for');
                }
                var device = detectDevice();
                if(device === "Android"){
                    var url = 'intent://?jobpostingguid=<%=jobpostingguid%>&jobpostingempguid=<%=jobpostingempguid%>#Intent;package=com.hotschedules.brushfire;scheme=hotschedulespost;end';
                    window.location = url;
                } else if(device === "iOS") {
                    setTimeout(function () {
                        window.location = saveUrl + '&stopRedirect=true';
                    }, 20);
                    var url = 'hotschedulespost://?jobpostingguid=<%=jobpostingguid%>&jobpostingempguid=<%=jobpostingempguid%>';
                    window.location = url;
                }
            }
            </script>
    <script>var requirejs = {
        baseUrl: '@BaseURL@',
        urlArgs: 'vjj=@Version@'
        };</script>
    <script src="libraries/thirdparty/require.js" data-main="brushfire-job-config"></script>
  </head>
  <body onload="redirectForMobile()">
    <div id="brushfire"></div>
  </body>
</html>