
  var clientID = 'sPZnxpFgGypJrX1Y';

  var accessToken;
  var callbacks = [];
  var protocol = window.location.protocol;
  var callbackPage = protocol + '//haydnlawrence.github.io/rinkwatch/callback.html';

  var authMenu = document.getElementById('auth');
  var enterRinkDataMenu = document.getElementById('enter_rink_data');
  var welcomeMessageMenu = document.getElementById('welcome_message');
  var check_for_rink = false;

  var expire = new Date();
  expire.setTime(new Date() + 3600000*24*14); //two weeks same as ArcGIS Online token expiry

  var token, username = '', firstname = '', email = '';
  
  function get_cookie(name)
  {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }  

  function delete_cookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  function set_cookie(key, value) {
    document.cookie = key + '=' + value + ";expires="+expire.toGMTString() + ";secure";
  }

  // this function will open a window and start the oauth process
  function oauth(callback) {
    if(accessToken){
      callback(accessToken);
    } else {
      callbacks.push(callback);
      window.open('https://www.arcgis.com/sharing/oauth2/authorize?client_id='+clientID+'&response_type=token&expiration=20160&redirect_uri=' + window.encodeURIComponent(callbackPage), '_blank', 'height=600,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes');
    }
  } 

  // check if there is a previously set cookie and if it's valid
  token = get_cookie('token');
  if(token!=null){

    username = get_cookie('username');
    firstname = get_cookie('firstname');
    email = get_cookie('email');
    authMenu.innerHTML = '<a href="#" id="sign-out"><i class="fa fa-list white"></i>&nbsp;&nbsp;Sign out</a>';   
    enterRinkDataMenu.innerHTML = '<i class="fa fa-globe white"></i>&nbsp;&nbsp;Enter Rink Data';
    welcomeMessageMenu.innerHTML = 'Welcome ' + firstname + '.'; 

  }else{
    if(authMenu!=null) {
      authMenu.innerHTML = '<a href="#" id="sign-in"><i class="fa fa-list white"></i>&nbsp;&nbsp;Sign In</a>';
      enterRinkDataMenu.innerHTML = '';
      welcomeMessageMenu.innerHTML = ''; 
    }
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
    window.location.reload(false);
  });

  // this function will be called when the oauth process is complete
  window.oauthCallback = function(token) {
    L.esri.get('https://www.arcgis.com/sharing/rest/portals/self', {
      token: token
    }, function(error, response){

      username = response.user.username;
      firstname = response.user.firstName;
      email = response.user.email;

      set_cookie("token",token);
      set_cookie("username",username);      
      set_cookie("firstname",firstname);
      set_cookie("email",email);

      authMenu.innerHTML = '<a href="#" id="sign-out"><i class="fa fa-list white"></i>&nbsp;&nbsp;Sign out</a>';
      if(has_rink){
        enterRinkDataMenu.innerHTML = '<i class="fa fa-globe white"></i>&nbsp;&nbsp;Enter Rink Data';
        $("#enter_rink_data").click(function() {
          window.open("https://arcg.is/0aruLi");
        });
      }else{
        enterRinkDataMenu.innerHTML = '<i class="fa fa-globe white"></i>&nbsp;&nbsp;Create Rink';
        $("#enter_rink_data").click(function() {
          window.open("https://arcg.is/0v84nz");
        });  
      }  
      welcomeMessageMenu.innerHTML = 'Welcome ' + firstname + '.'; 

      $("#sign-out").click(function() {
        window.open('https://www.arcgis.com/sharing/oauth2/signout', '_blank', 'height=400,width=400,menubar=no,location=no,resizable=no,scrollbars=no,status=yes');
        delete_cookie("token");
        delete_cookie("firstname");
        delete_cookie("lastname");
        delete_cookie("email");
        window.location.reload(false);
      });
      window.location.reload(false);
    });
  };  
