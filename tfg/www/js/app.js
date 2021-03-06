// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngMessages', 'ngCordovaOauth', 'pascalprecht.translate', 'ngCordova']) /* , 'ionic-datepicker' */

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        $cordovaPlugin.someFunction().then(success, error);
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider/*, ionicDatePickerProvider*/) { 
  // Configuramos el datepicker
  /*var datePickerObj = {
    inputDate: new Date(),
    setLabel: 'Set',
    todayLabel: 'Today',
    closeLabel: 'Close',
    mondayFirst: false,
    weeksList: ["S", "M", "T", "W", "T", "F", "S"],
    monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    templateType: 'popup',
    from: new Date(2012, 8, 1),
    to: new Date(2018, 8, 1),
    showTodayButton: true,
    dateFormat: 'dd MMMM yyyy',
    closeOnSelect: false,
    disableWeekdays: [6]
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);*/

  // Recorremos todo para traducirlo, en el cambio de idioma
  for(lang in translations){
    $translateProvider.translations(lang, translations[lang]);
  }
  // Elegimos el idioma con el que vendra la aplicacion por defecto
  $translateProvider.preferredLanguage('en');

  $stateProvider

  .state('main', {
    url: '/main',
    templateUrl: 'templates/main.html'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginController'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'registerController'
  })
  .state('register_code', {
    url: '/register_code',
    templateUrl: 'templates/registro_codigo.html',
    controller: 'codeController'
  })
  .state('lostpassword', {
    url: '/lostpassword',
    templateUrl: 'templates/lostpassword.html',
    controller: 'lostpasswordController'
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'menuController'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
      }
    }
  })
  .state('app.ranking', {
    url: '/ranking',
    views: {
      'menuContent': {
        templateUrl: 'templates/ranking.html'
      }
    }
  })
  .state('app.conf', {
    url: '/conf',
    views: {
      'menuContent': {
        templateUrl: 'templates/conf.html',
        controller: 'confController'
      }
    }
  })

  .state('changePass', {
    url: '/changePass',
    templateUrl: 'templates/changePass.html',
    controller: 'changePassController'
  })

  .state('changeProfile', {
    url: '/changeProfile',
    templateUrl: 'templates/editarPerfil.html',
    controller: 'editProfileController'
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main');
});


