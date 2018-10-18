console.log("*********");
console.log("Setting up OAuth and cookie - app_authorization.js")
console.log("*********");

  var clientID = 'sPZnxpFgGypJrX1Y';


  var accessToken;
  var callbacks = [];
  var protocol = window.location.protocol;
  var callbackPage = protocol + '//haydnlawrence.github.io/rinkwatch/callback.html';

  var authMenu = document.getElementById('auth');

  var token, username = '', firstname = '', email = '';
  
  // this function will open a window and start the oauth process
  function oauth(callback) {
    if(accessToken){
      callback(accessToken);
    } else {
      callbacks.push(callback);
      window.open('https://www.arcgis.com/sharing/oauth2/authorize?client_id='+clientID+'&response_type=token&expiration=20160&redirect_uri=' + window.encodeURIComponent(callbackPage), '_blank', 'height=600,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes');
    }
  }

  function getCookie(name)
  {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }

  token = getCookie('token');
  console.log("token: " + token);
  if(token!=null){
    console.log("Getting token...");
    username = getCookie('username');
    firstname = getCookie('firstName');
    email = getCookie('email');
    authMenu.innerHTML = 'Hello ' + firstname + '.<br /><a href="#" id="sign-out"><i class="fa fa-list white"></i>&nbsp;&nbsp;Sign out</a>';
    console.log("---------");
    console.log("username: " + username + "</br>firstname: " + firstname + "<br />email" + email);
    console.log("---------");
  }else{
    if(authMenu!=null) {
      authMenu.innerHTML = '<a href="#" id="sign-in"><i class="fa fa-list white"></i>&nbsp;&nbsp;Sign In</a>';
    }
  }

  // this function will be called when the oauth process is complete
  window.oauthCallback = function(token) {
    L.esri.get('https://www.arcgis.com/sharing/rest/portals/self', {
      token: token
    }, function(error, response){
      username = response.user.username;
      firstname = response.user.firstName;
      email = response.user.email;
      var expire = new Date();
      expire.setTime(today.getTime() + 3600000*24*14); //two weeks same as ArcGIS Online token expiry
      document.cookie = "token=" + token + ";username=" + username + ";firstname=" + firstname + ";email=" + email  + ";expires="+expire.toGMTString() + ";secure";
      authMenu.innerHTML = 'Hello ' + firstname + '.<br />' + '<a href="#" id="sign-out"><i class="fa fa-list white"></i>&nbsp;&nbsp;Sign out</a>';

      console.log("---------");
      console.log("username: " + username + "</br>firstname: " + firstname + "<br />email" + email);
      console.log("---------");
    });
  };

  function delete_cookie( name ) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  $("#sign-in").click(function() {
    oauth();
  });

  $("#sign-out").click(function() {
    window.open('https://www.arcgis.com/sharing/oauth2/signout', '_blank', 'height=400,width=400,menubar=no,location=no,resizable=no,scrollbars=no,status=yes');
    delete_cookie("token");
    delete_cookie("firstname");
    delete_cookie("lastname");
    delete_cookie("email");
  });

  