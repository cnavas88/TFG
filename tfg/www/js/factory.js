angular.module('starter.factory', [])

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
                    var success = response.data['success'];
                    switch(success){
                        case "success": //creamos la sesión con el usuario, identificador y mail del usuario
                                        cacheSession(user.user, response.data['id'], response.data['mail']);
                                        //mandamos a la home
                                        $state.go('app.home');  
                                        break;
                        case "failed": alert("El usuario y la contraseña no coinciden.");  break;
                        default: alert("El usuario no existe.");  break;
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