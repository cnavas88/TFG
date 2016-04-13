angular.module('starter.controllers', [])

/* Controlador para la vista login */
.controller('loginController',function ($scope, authUsers, sesionesControl){/*, $http, $sce, $state*/
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
})

/* Controlador para la vista registro */
.controller('registerController',function ($scope, $http, $sce, $state){
        /* Definimos un modelo usuario para el registro */
        $scope.user = {
            name: "",
            lastname: "",
            username: "",
            mail: "",
            password: "",
            repeatPass: "",
            checked: false 
        };  
   
        $scope.register = function(form) {
          if(form.$valid && $scope.user.checked) {
              var urlCompleta = "http://localhost/tfg/register.php";
              $http({
                  method : "POST",
                  url : urlCompleta,
                  header:{
                      'Content-Type' : 'application/json'
                  },
                  data: $scope.user
              }).then(function(response){
                  switch(response.data){
                      case "success": alert("Registrado correctamente."); $state.go('login'); break;
                      case "fail": alert("error al registrarse, por favor intentelo mas tarde."); break;
                      default: alert("error al registrarse, por favor intentelo mas tarde."); break;
                  }
              }, function(response) {
                  alert("Error con la comunicacion en el servidor.");
              });
          }else if(!$scope.user.checked){
              alert("Tienes que aceptar los terminos y condiciones para poder registrarte.");
          }else{
              alert("Hay errores en el formulario de registro.");
          }
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
                      url : "http://localhost/tfg/api_username.php?username="+value
                  }).then(function(response){
                      if( response.data == "success" ){
                          ctrl.$setValidity('exists', true);
                      }
                      if( response.data == "fail" ){
                          ctrl.$setValidity('exists', false);
                      }
                  },function(response) {
                      alert("Error con la comunicacion en el servidor.");
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
.directive('mailConfirm', ['$http', function($http
) {
  return {
    require : 'ngModel',
    link : function(scope, elem, attrs, ctrl) {   
          var validator = function (value) {
              if( value.length > 6 ){
                  $http({
                      method : "GET",
                      url : "http://localhost/tfg/api_mail.php?mail="+value
                  }).then(function(response){
                      if( response.data == "success" ){
                          ctrl.$setValidity('exists', true);
                      }
                      if( response.data == "fail" ){
                          ctrl.$setValidity('exists', false);
                      }
                  },function(response) {
                      alert("Error con la comunicacion en el servidor.");
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
.controller('homeController',function ($scope, $state, $ionicHistory, authUsers, sesionesControl){
    // Si estas logeado cogemos los datos
    $scope.user = {
        username: sesionesControl.get("username"),
        id: sesionesControl.get("id"),
        mail: sesionesControl.get("mail")
    };  
})

/* Controlador del menu, aqui podremos sacar todos los datos que guardamos en localStorage 
   para mostrar en el menu */
.controller('menuController',function ($scope, $state, authUsers, sesionesControl){
      // Recogemos los datos
      $scope.user = {
        username: sesionesControl.get("username"),
        id: sesionesControl.get("id"),
        mail: sesionesControl.get("mail")
      };

      $scope.logout = function(){
          authUsers.logout();
      }
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

//factoria para loguear y desloguear usuarios en angularjs
.factory("authUsers", function($http, $location, $state, $ionicHistory, sesionesControl){
    var cacheSession = function(username, id, mail){
        sesionesControl.set("userLogin", true);
        sesionesControl.set("username", username);
        sesionesControl.set("mail", mail);
        sesionesControl.set("id", id);
    }
    var unCacheSession = function(){
        sesionesControl.unset("userLogin");
        sesionesControl.unset("username");
        sesionesControl.unset("mail");
        sesionesControl.unset("id");
    }
 
    return {
        //retornamos la función login de la factoria authUsers para loguearnos correctamente
        login : function(user){
              return $http({
                    method : "POST",
                    url : "http://localhost/tfg/login.php",
                    header:{
                        'Content-Type' : 'application/json'
                    },
                    data: user
              }).then(function(response){
                    // Miramos success del JSOn devuelto para saber como tenemos que actuar
                    alert(response.data);
                    var success = response.data['success'];
                    switch(success){
                        case "success": //creamos la sesión con el usuario, identificador y mail del usuario
                                        cacheSession(user.user, response.data['id'], response.data['mail']);
                                        //mandamos a la home
                                        $state.go('app.home');  
                                        break;
                        case "failed": alert("El usuario y la contraseña no coinciden.");  break;
                        case "noExists": alert("El usuario no existe."); break;
                        case "bloqued": alert("La cuenta esta bloqueada, mira el correo para desbloquearla."); break;
                        default: alert("Error en el login.");  break;
                    }
              },function(response) {
                    alert("Error con la comunicacion en el servidor.");
              });       
        },
        //función para cerrar la sesión del usuario
        logout : function(){
            // Eliminamos la session del localStorage
            unCacheSession();
            $ionicHistory.clearCache().then(function() {
                // Limpiamos el historial y nos redirigimos a la pantalla de login
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                $state.go('login');
            })
        },
        //función que comprueba si la sesión userLogin almacenada en localStorage existe
        isLoggedIn : function(){
            return sesionesControl.get("userLogin");
        }
    }
});