// En este JSON meteremos todas las palabras para traducir la aplicacion a los 3 idiomas pedidos
var translations = {
    "es": {
        "titleRank": "ranking",
        "titleConf": "Configuración",
        "confOp1": "Editar perfil",
        "confOp2": "Cambiar idioma",
        "confOp3": "Cambiar contraseña",
        "confOp4": "Notificaciones y sonidos",
        "confOp5": "Terminos y servicios",
        "langEs": "Español",
        "langEn": "Ingles",
        "langDe": "Aleman",
        "fotoperfil": "Foto de perfil",
        "galeria": "Galeria",
        "camara": "Camara",
        "cancel": "Cancelar"
    },
    "en": {
        "titleRank": "Configufffffffffración",
        "titleConf": "Settings",
        "confOp1": "Edit profile",
        "confOp2": "Change language",
        "confOp3": "Change password",
        "confOp4": "Notifications and sounds",
        "confOp5": "Terms and services",
        "langEs": "Spanish",
        "langEn": "English",
        "langDe": "Germany",
        "fotoperfil": "Photo of avatar",
        "galeria": "Galery",
        "camara": "Camaera",
        "cancel": "Cancel"
    },
    "de": {
        "titleRank": "asdasdadasd",
        "titleConf": "Einstellungen",
        "confOp1": "Profil bearbeiten",
        "confOp2": "Sprache ändern",
        "confOp3": "Passwort ändern",
        "confOp4": "Benachrichtigungen und Sounds",
        "confOp5": "Begriffe und Dienstleistungen",
        "langEs": "Espasdasañol",
        "langEn": "Ingleasdasds",
        "langDe": "Alemasdasdan",
        "fotoperfil": "Foto asdasdade perfil",
        "galeria": "Galesdasdria",
        "camara": "Camaasdasdra",
        "cancel": "Cancasdasdelar"
    }
}

angular.module('starter.controllers', [])

/* Controlador para la vista login */
.controller('loginController',function ($scope, $state, $cordovaOauth, authUsers, toLoginRegister){/*, $http, $sce, $state*/
        /* Definimos un modelo login */
        $scope.user = {
            user: "",
            pass: "",
            checked: false 
        };

        /* Funcion para logearse en la app */
        $scope.enter = function (form){
            if(form.$valid){
                authUsers.login($scope.user);
            }
        };

        $scope.register = function(){
            toLoginRegister.toRegister();
        };

        //Metodo para logearte con la red social facebook
        $scope.facebookLogin = function() {
            $cordovaOauth.facebook("1593373200974620", ["dante.maniacs@gmail.com"]).then(function(result) {
                oauth_token = result.oauth_token;
                oauth_token_secret = result.oauth_token_secret;
                user_id = result.user_id;
                screen_name = result.screen_name;
               
                alert(screen_name);
                alert(user_id);
                alert(oauth_token);
                alert(oauth_token_secret);
            }, function(error) {
                alert("Error: " + error);
            });
        };

        //Metodo para logearte con la red social twitter
        $scope.twitterLogin = function() {
            $cordovaOauth.twitter("EhBVCqlt2RZYIE0QSy10Qhp2t", "F3WVAOmldcF19FpFx9Zns8rGGWhglxQblZV8p9E5oX1YCjSS0f").then(function(result) {
                oauth_token = result.oauth_token;
                oauth_token_secret = result.oauth_token_secret;
                user_id = result.user_id;
                screen_name = result.screen_name;
               
                alert(screen_name);
                alert(user_id);
                alert(oauth_token);
                alert(oauth_token_secret);
            }, function(error) {
                alert("Error: " + error);
            });
        };

        //Metodo para logearte con la red social google+
        $scope.googleLogin = function() {
            /*$cordovaOauth.google(string clientId, array appScope).then(function(result) {
                oauth_token = result.oauth_token;
                oauth_token_secret = result.oauth_token_secret;
                user_id = result.user_id;
                screen_name = result.screen_name;
               
                alert(screen_name);
                alert(user_id);
                alert(oauth_token);
                alert(oauth_token_secret);
            }, function(error) {
                alert("Error: " + error);
            });*/
        };
})

.controller('codeController',function ($scope, $state, $http, alert, sesionesControl, mensajesFlash){
        /* Definimos un modelo login */
        $scope.verify = {
            code: ""
        };

        /* Funcion para logearse en la app */
        $scope.verifyCode = function (form){
            if(form.$valid){
                  var urlCompleta = "http://192.168.1.33/tfg/verify_code.php";
                  $http({
                      method : "POST",
                      url : urlCompleta,
                      header:{
                          'Content-Type' : 'application/json'
                      },
                      data: $scope.verify
                  }).then(function(response){
                      var success = response.data['success'];
                      switch(success){//NQHyK
                          case "success": if( "boss" ==  response.data['user'] ){
                                              // nos guardamos en la sesion el tipo de usuario y Redireccionamos a la pagina de registro de jefes
                                              sesionesControl.set("type", response.data['user']);
                                          }else if( "employe" ==  response.data['user'] ){
                                              sesionesControl.set("type", response.data['user']);
                                              sesionesControl.set("boss", response.data['boss']);
                                          }  
                                          $state.go('register');
                                          break;
                          case "fail":  alert.showAlert("Verificar código", "El código introducido es incorrecto."); break;
                                        break;
                          default: alert.showAlert("Verificar código", "Error en el servidor."); break;
                      }
                  }, function(response) {
                      alert.showAlert("Verificar código", "Error con la comunicacion en el servidor.");
                  });
            }
        };
})

/* Controlador para la vista registro */
.controller('registerController',function ($scope, $http, $state, toLoginRegister, alert, sesionesControl){ 
        /* Definimos un modelo usuario para el registro */
        $scope.user = {
            name: "",
            lastname: "",
            username: "",
            mail: "",
            password: "",
            repeatPass: "",
            code: "",
            bossCode: "",
            checked: false
        };  

        $scope.register = function(form) {
          if(form.$valid && $scope.user.checked) {
              // Añadimos a la variable scope, el codigo para saber si es un empleado o no
              $scope.user.code = sesionesControl.get("type");
              $scope.user.bossCode = sesionesControl.get("boss");
              // nada mas añadir la variable la eliminamos
              sesionesControl.unset("type");
              sesionesControl.unset("boss");
              var urlCompleta = "http://192.168.1.33/tfg/register.php";
              $http({
                  method : "POST",
                  url : urlCompleta,
                  header:{
                      'Content-Type' : 'application/json'
                  },
                  data: $scope.user
              }).then(function(response){
                  switch(response.data){
                      case "success": alert.showAlert("Registro", "Registrado correctamente.");
                                      $state.go('login'); 
                                      break;
                      case "fail": alert.showAlert("Registro", "Error al registrarse, por favor intentelo mas tarde.");
                                   break;
                      default: alert.showAlert("Registro", "Error al registrarse, por favor intentelo mas tarde."); 
                               break;
                  }
              }, function(response) {
                  alert.showAlert("Registro", "Error con la comunicacion en el servidor.");
              });
          }else if(!$scope.user.checked){
              alert.showAlert("Registro", "Tienes que aceptar los terminos y condiciones.");
          }else{
              alert.showAlert("Registro", "Hay errores en el formulario de registro.");
          }
        };

        $scope.tologin = function(){
            toLoginRegister.toLogin();
        }; 
})

/* Directiva para confirmar que las contraseñas sean iguales */
.directive('passwordConfirm', ['$parse', function ($parse) {
  return {
      restrict: 'A',
      scope: {
          matchTarget: '=',
      },
      require: 'ngModel',
      link: function link(scope, elem, attrs, ctrl) {
            var validator = function (value) {
              ctrl.$setValidity('match', value === scope.matchTarget);
              return value;
            }

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
        
            // Esto lo utilizamos para forzar al validador y que cuando se cambie el password se valide sin necesidad de tocat el campo de repetir password
            scope.$watch('matchTarget', function(newval, oldval) {
              validator(ctrl.$viewValue);
            });
      }
  };
}])

// validacion asincrona del usuario, segun vayamos escribiendo nos iremos validando, ya que es completamente necesairo.
.directive('usernameConfirm', ['$http', function($http
) {
  return {
    require : 'ngModel',
    link : function(scope, elem, attrs, ctrl) {   
          var validator = function (value) {
              if( value.length > 2 ){
                  $http({
                      method : "GET",
                      url : "http://192.168.1.33/tfg/api_username.php?username="+value
                  }).then(function(response){
                      if( response.data == "success" ){
                          ctrl.$setValidity('exists', true);
                      }
                      if( response.data == "fail" ){
                          ctrl.$setValidity('exists', false);
                      }
                  },function(response) {
                      //alert("Error con la comunicacion en el servidor.");
                  });
              }
              return value;
          }
          ctrl.$parsers.unshift(validator);
          ctrl.$formatters.push(validator);
    }
  };
}])

// validacion asincrona del email, segun vayamos escribiendo nos iremos validando, ya que es completamente necesairo.
.directive('mailConfirm', ['$http', function($http) {
  return {
    require : 'ngModel',
    link : function(scope, elem, attrs, ctrl) {   
          var validator = function (value) {
              if( value.length > 6 ){
                  $http({
                      method : "GET",
                      url : "http://192.168.1.33/tfg/api_mail.php?mail="+value
                  }).then(function(response){
                      if( response.data == "success" ){
                          ctrl.$setValidity('exists', true);
                      }
                      if( response.data == "fail" ){
                          ctrl.$setValidity('exists', false);
                      }
                  },function(response) {
                      //alert("Error con la comunicacion en el servidor.");
                  });
              }
              return value;
          }
          ctrl.$parsers.unshift(validator);
          ctrl.$formatters.push(validator);
    }
  };
}])

/* Controlador del HOME, aqui mostraremos los datos que nos sean de interes */
.controller('homeController',function ($scope, alert){
      $scope.sabermas = function(){
          alert.showAlert("Código de empleado", "Una vez llegamos al nivel experto, es decir, conseguimos terminar todos los niveles de la aplicación. Se nos activara un código, que nos data la posibilidad de hacer que nuestros empleados se registren en la aplicación y nos den su valoración.");
      };
})

/* Controlador para el olvido de la contraseña */
.controller('lostpasswordController', function ($scope, $ionicModal){//, $cordovaCamera
      $scope.user = { mail: "" }; 

      $scope.verifymail = function(form) {        
          if(form.$valid) {
              return $http({
                    method : "POST",
                    url : "http://192.168.1.33/tfg/lostPass.php",
                    header:{
                        'Content-Type' : 'application/json'
                    },
                    data: {"email": $scope.user.mail} 
              }).then(function(response){
                    var success = response.data['success'];
                    switch(success){
                        case "success": alert.showAlert("Recuperar contraseña", "Email enviado con las instrucciones para recuperar la contraseña.");  break;
                        case "failed": alert.showAlert("Recuperar contraseña", "El email elegido no existe.");  break;
                        default: alert.showAlert("Recuperar contraseña", "Error a la hora de intentar recuperar la contraseña, por favor, intentelo mas tarde."); break;
                    }
              },function(response) {
                    alert.showAlert("Recuperar contraseña", "Error con la comunicacion con el servidor.");
              }); 
          }
      };     

})

/* Controlador para la configuracion del usuario */
/* el usuario solo podra configurar contraseña, foto y notificaciones TODO */
.controller('confController', function ($scope, $ionicModal, $http, $ionicPopup, $translate, sesionesControl){//, $cordovaCamera
      $scope.userconf = { 
            language: "", 
            id: "",
            newlanguage: "" 
      };

      // Modal para cambiar el idioma de la app
      $ionicModal.fromTemplateUrl('templates/changeLang.html', function(modal) {
          $scope.modalChangeLang = modal;
      }, {
          scope: $scope,
          animation: 'slide-in-up'
      });

      // Funcion para poder cambiar la imagen del avatar, esta imagen se podra cambiar de 2 maneras distintas, por galeria o accediendo a la camara
      $scope.changeImage = function() {        
             var myPopup = $ionicPopup.show({
                template: '<div class="list" style="margin-top: -3%;"><a class="item item-icon-left" href="#"><i class="icon ion-image"></i>Galería</a><a class="item item-icon-left" href="#"><i class="icon ion-camera"></i>Cámara</a></div>',
                title: 'Foto de perfil',
                scope: $scope,
                buttons: [{
                   text: 'Cancel'
                }, ]
             });
      };

      // Funcion que cambiara el idioma de la aplicacion
      $scope.changeLangOK = function(language){
          if( $scope.userconf.language != language ){
              $scope.userconf.newlanguage = language;
              return $http({
                    method : "POST",
                    url : "http://192.168.1.33/tfg/api_changeLanguage.php",
                    header:{
                        'Content-Type' : 'application/json'
                    },
                    data: $scope.userconf
              }).then(function(response){
                    if(response.data == "success"){
                        sesionesControl.set("lan", language);
                        $translate.use(language);
                        $scope.changeLangClose();
                    }else{
                        alert("Error - No se ha cambiado el idioma.");
                    }
              },function(response) {
                    alert("Error con la comunicacion en el servidor.");
              }); 
          }
      };

      $scope.changeLang = function(){
          $scope.modalChangeLang.show();
      };

      $scope.changeLangClose = function(){
          $scope.modalChangeLang.hide();
      };

      $scope.$watch(function(){
          $scope.userconf = {
              language: sesionesControl.get("lan"),
              id: sesionesControl.get("id")
          };        
      });

      // Añadimos las opciones de la camara para poder acceder a ella
    /*  $scope.upload = function() {
          var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
          correctOrientation:true
          };

          $cordovaCamera.getPicture(options).then(function(imageData) {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
          }, function(err) {
            // error
          });
      }*/
})

// Controlador para cambiar el password
.controller('changePassController', function ($scope, $state, authUsers, alert){
      $scope.user = { 
          actapass: "",
          newpass: "",
          newpassame: "",
          username: ""
      };

      $scope.changePasswordClose = function(){
          $state.go('app.conf');
      };

      $scope.verifyPass = function(form){
          if(form.$valid){
              if($scope.user.actapass != $scope.user.newpass){
                  authUsers.changePass($scope.user);
              }else{
                  alert.showAlert("Cambiar Password", "El nuevo password tiene que ser diferente al antiguo.");
              } 
          }
      };
})

// Controlador para cambiar los datos del perfil
.controller('editProfileController', function ($scope, $state, authUsers, alert){
      $scope.user = { 
          name: "",
          lastname: "",
          mail: ""
      };

      $scope.changeProfileClose = function(){
          $state.go('app.conf');
      };

      $scope.editProfile = function(form){
          if(form.$valid){
              if($scope.user.name != "" || $scope.user.lastname != "" || $scope.user.mail != ""){
                  authUsers.changeProfile($scope.user);
              }else{
                  alert.showAlert("Editar perfil", "Todos los campos estan vacios.");
              } 
          }
      };
})

/* Controlador del menu, aqui podremos sacar todos los datos que guardamos en localStorage 
   para mostrar en el menu */
.controller('menuController',function ($scope, sesionesControl, authUsers){
      // Recogemos los datos
      $scope.user = {
          username: "",
          id: "",
          picture: "",
          total: "",
          role: "",
          language: "",
          level: "",
          code: ""
      };

      $scope.logout = function(){
          $scope.user = null;
          authUsers.logout();
      };

      // Con la funcion watch lo que hacemos es observar cuando se produce un cambio en $scope.user, en el caso de que tengamos un cambio
      // hacemos lo correspondiente.
      $scope.$watch(function(){ 
          if(sesionesControl.get("code") == 0){
              var msgCode = "Sin código de empleado";
          }else{
              var msgCode = sesionesControl.get("code");
          }

          $scope.user = {
              username: sesionesControl.get("username"),
              id: sesionesControl.get("id"),
              picture: sesionesControl.get("picture"),
              total: sesionesControl.get("total"),
              role: sesionesControl.get("role"),
              language: sesionesControl.get("lan"),
              level: sesionesControl.get("level"),
              code: msgCode
          };      
      });
})

// Factoria para guardar y eliminar sesiones con localStorage
.factory("sesionesControl", function(){
    return {
        // Obtenemos una sesión //getter
        get : function(key) {
            return localStorage.getItem(key);
        },
        // Creamos una sesión //setter
        set : function(key, val) {
            return localStorage.setItem(key, val);
        },
        // eliminamos una sesión
        unset : function(key) {
            return localStorage.removeItem(key);
        }
    }
})

// Factoria para mostrar mensajes flash, que son los que vendran del ajax como error nuestro, no de peticion o de HTTP
.factory("mensajesFlash", function($rootScope){
    return {
        show_success : function(message){
            $rootScope.flash_success = message;
        },
        show_error : function(message){
            $rootScope.flash_error = message;
        },
        clear : function(){
            $rootScope.flash_success = "";
            $rootScope.flash_error = "";
        }
    }
})

/* Factoria para borrar el historial para que no se guarden datos del registro o del login */
.factory("toLoginRegister", function($state, $ionicHistory){
    return{
        /* Funcion que borrara el historial antes de hacer un cambio de pagina, asi nunca se mantendran los datos dentro del login o el registro */
        toLogin : function(){
            $ionicHistory.clearCache().then(function() {
                // Limpiamos el historial y nos redirigimos a la pantalla de login
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                $state.go('login');
            })
        },
        toRegister : function(){
            $ionicHistory.clearCache().then(function() {
                // Limpiamos el historial y nos redirigimos a la pantalla de login
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                $state.go('register_code');
            })
        }
    }
})

/* Factoria para mostrar las pantallas de alert en el programa */
.factory("alert", function($ionicPopup){
    return{
        showAlert : function( title, content ){
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: content
           });
        }
    }
})

//factoria para loguear y desloguear usuarios en angularjs
.factory("authUsers", function($http, $location, $state, $ionicHistory, $translate, sesionesControl, toLoginRegister, alert){
    var cacheSession = function(username, response){
        sesionesControl.set("userLogin", true);
        sesionesControl.set("username", username);
        sesionesControl.set("id", response.data['id']);
        sesionesControl.set("picture", response.data['picture']);
        sesionesControl.set("total", response.data['total']); 
        sesionesControl.set("role", response.data['role']); 
        sesionesControl.set("code", response.data['code']);
        sesionesControl.set("lan", response.data['lan']); 

        if( response.data['level'] == 0 ){
            sesionesControl.set("level", "Novato"); 
        }else if( response.data['level'] == 1 ){
            sesionesControl.set("level", "Avanzado"); 
        }else if( response.data['level'] == 2 ){
            sesionesControl.set("level", "Experto"); 
        }
    }
    var unCacheSession = function(){
        sesionesControl.unset("userLogin");
        sesionesControl.unset("username");
        sesionesControl.unset("id");
        sesionesControl.unset("picture");
        sesionesControl.unset("total");
        sesionesControl.unset("role");
        sesionesControl.unset("code");
        sesionesControl.unset("lan");
        sesionesControl.unset("level");
    }
 
    return {
        //retornamos la función login de la factoria authUsers para loguearnos correctamente
        login : function(user){
              return $http({
                    method : "POST",
                    url : "http://192.168.1.33/tfg/login.php",
                    header:{
                        'Content-Type' : 'application/json'
                    },
                    data: user
              }).then(function(response){
                    // Miramos success del JSOn devuelto para saber como tenemos que actuar
                    var success = response.data['success'];
                    switch(success){
                        case "success": //creamos la sesión con el usuario, identificador y mail del usuario
                                        cacheSession(user.user, response);
                                        // Traducimos al idioma correcto la app
                                        $translate.use(response.data['lan']);
                                        //mandamos a la home
                                        $state.go('app.home');  
                                        break;
                        case "failed": alert.showAlert("Login", "El usuario y la contraseña no coinciden.");  break;
                        case "noExists": alert.showAlert("Login", "El usuario no existe."); break;
                        case "bloqued": alert.showAlert("Login", "La cuenta esta bloqueada, mira el correo para desbloquearla."); break;
                        default: alert.showAlert("Login", "Error en el login."); break;
                    }
              },function(response) {
                    alert.showAlert("Login", "Error con la comunicacion en el servidor.");
              });       
        },
        //función para cerrar la sesión del usuario
        logout : function(){
            // Eliminamos la session del localStorage
            unCacheSession();
            toLoginRegister.toLogin();
        },
        //función que comprueba si la sesión userLogin almacenada en localStorage existe
        isLoggedIn : function(){
            return sesionesControl.get("userLogin");
        },
        // Funcion para cambiar el password
        changePass: function(user){
              return $http({
                    method : "POST",
                    url : "http://192.168.1.33/tfg/changePass.php",
                    header:{
                        'Content-Type' : 'application/json'
                    },
                    data: { 'pass': user.actapass, 'newpass': user.newpass, 'username': sesionesControl.get("username") }
              }).then(function(response){
                    // Miramos success del JSOn devuelto para saber como tenemos que actuar
                    var success = response.data['success'];
                    switch(success){
                        case "success": alert.showAlert("Cambiar password", "El Password se ha cambiado con exito.");
                                        $state.go('app.conf');  
                                        break;
                        case "fail": alert.showAlert("Cambiar password", "El usuario no existe.");  break;
                        case "noSame": alert.showAlert("Cambiar password", "La contraseña actual no es la correcta."); break;
                        default: alert.showAlert("Cambiar password", "Error en el login."); break;
                    }
              },function(response) {
                    alert.showAlert("Cambiar password", "Error con la comunicacion en el servidor.");
              });
        },
        // Funcion para cambiar las opciones de perfil
        changeProfile: function(user){
              return $http({
                    method : "POST",
                    url : "http://192.168.1.33/tfg/changeProfile.php",
                    header:{
                        'Content-Type' : 'application/json'
                    },
                    data: { 'name': user.name, 'lastname': user.lastname, 'mail': user.mail ,'id': sesionesControl.get("id") }
              }).then(function(response){
                    // Miramos success del JSOn devuelto para saber como tenemos que actuar
                    var success = response.data['success'];
                    switch(success){
                        case "success": alert.showAlert("Editar perfil", "Los datos se han cambiado con exito.");
                                        $state.go('app.conf');  
                                        break;
                        case "fail": alert.showAlert("Editar perfil", "Error al cambiar los datos.");  break;
                        default: alert.showAlert("Editar perfil", "Error al cambiar los datos."); break;
                    }
              },function(response) {
                    alert.showAlert("Editar perfil", "Error con la comunicacion en el servidor.");
              });
        }
    }
});