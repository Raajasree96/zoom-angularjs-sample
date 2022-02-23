"use strict";

var domain = window.document.domain;

if (domain.indexOf('wallstreetenglish.com.cn') >= 0) {
  window.document.domain = 'wallstreetenglish.com.cn';
} else if (domain.indexOf('wallstreetenglish.com') >= 0) {
  window.document.domain = 'wallstreetenglish.com';
} // Configure and start the Tracker Object of Google Analytics


window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'GA_TRACKING_ID');
/** Initializing the environment variables for the assessment module */

var env = {};
/** Import variables if present (from env.js) */

if (window) {
  // Object.assign(env, window._env);
  var mergeObject = function mergeObject(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  env = mergeObject(window._env);
}
/**
 * @ngdoc overview
 * @name digitalclassroom
 *
 * @description
 * # Digital classroom is the application.
 * To get started add `ng-app="digitalclassroom"`.<br/>
 * **P.s.** Has dependency in angular ui route for its routing needs
 *
 * The application configuration is done in `.config` section of
 * the code.
 *
 * if you want to add more routes, then define it in config section.
 *
 * @example
 *
 * To get started
 * ---------------
 * <pre>
 * <div ng-app='digitalclassroom'>
 * </div>
 * </pre>
 *
 * <pre>
 *     $stateProvider
 *          .state('<theNameofthesate>', {
 *
 *              url: '/' // This is an optional setting.
 *              templateUrl: "path_to_template" // you will need this for sure.
 *              controller: "templates_controller" //Optional
 *          })
 * </pre>
 *
 * angular.ui.router works entirely different to that of angular's ng-view
 *
 * Please read more on Angular ui router
 *
 *
 */


var DC = angular.module('digitalclassroom', ['ui.router', 'ucfirstFilters', // 'dc.com',
'truncate', 'substring', 'renderHTML', 'ngFileUpload', 'angular-intro', 'opentok', 'dndLists']).config([// Dependencies
'$locationProvider', '$stateProvider', '$urlRouterProvider', '$compileProvider', '$provide', '$httpProvider', // Callback
function ($locationProvider, $stateProvider, $urlRouterProvider, $compileProvider, $provide, $httpProvider) {
  /*
  ------------------------------------------------
  HANDLING WHITELIST - FOR ANDROID APP REDIRECTION
  ------------------------------------------------
  */
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|intent):/); //=========================================================
  //------------------- ANGULAR DECORATORS ------------------
  //=========================================================

  /*
  ------------
  ERROR LOGGER
  ------------
  Logs the full stacktrace of errors into the DB
  */

  $provide.decorator('$exceptionHandler', ['$log', '$delegate', function ($log, $delegate) {
    /**
          * Error logger - Rollbar.
          * logs all the error to rollbar specific to environment.
          *
          */
    return function (exception, cause) {
      $log.debug(exception.stack);
      $log.debug('Default exception handler.');

      try {
        var msg = 'Error:: Reported by application error logger ::' + 'URL:' + window.location.href + '::' + 'ERRMESSAGE:' + exception.toString() + '::' + 'STACKTRACE:' + exception.stack + '::' + 'CAUSE:' + (cause || 'Could not find the source') + ':: ENDOFLOG'; //console.log('Logging error to rollbar ', msg);

        Rollbar.error(msg, function (err, data) {
          if (err) {
            console.log('Error while reporting error to Rollbar: ', err);
          } else {
            console.log('Error successfully reported to Error Logger. UUID:', data.result.uuid);
          }
        });
      } catch (loggingError) {
        $log.warn('Error : Logging failed : ', loggingError);
      }

      $delegate(exception, cause);
    };
  }]);
  /*
  ------------
  HTML5 MODE
  ------------
  Set to use HTML5 URL's if history push state is available
  */

  if (window.history && window.history.pushState) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  } //=========================================================
  //------------------ APP STATES (ROUTES) ------------------
  //=========================================================
  // Extend the state provider states


  $stateProvider
  /*
  -----------
  INDEX STATE
  -----------
  The base route when no path is specified in url.
  We just redirect to the login state by default.
  */
  .state('index', {
    url: '/',
    templateUrl: '/views/index.html?RELEASE_TAG_VERSION',
    controller: function controller() {//$state.go('index');
    }
  })
  /*
  -----------
  CLASSROOM
  -----------
  Classroom App will be launched in this state. This will be our
  major route and will contain many sub states.
  */
  .state('classroom', {
    // Anything to be preloaded (Pre-Hooked) to the state before the
    // state renders should be specified in the resolve block.
    resolve: {
      // Fetches the data from the server
      fetchDump: function fetchDump($exchange, $stateParams, $http, Auth) {
        var sessionData = Auth.getData();
        return $http({
          method: 'GET',
          url: '/api/activity/' + sessionData.activityId + '?' + new Date().getTime(),
          cache: false
        });
      }
    },
    url: '/classroom',
    // All these views will be there in the substates of this state
    views: {
      // Default View
      '': {
        templateUrl: '/views/classroom.html?RELEASE_TAG_VERSION',
        controller: 'classroomStateCtrl'
      },
      // Participant Panel
      'participantpanel@classroom': {
        templateUrl: '/views/partials/classroom/participantpanel.html?RELEASE_TAG_VERSION'
      },
      // Presenter Bar
      'presenterbar@classroom': {
        templateUrl: '/views/partials/classroom/presenterbar.html?RELEASE_TAG_VERSION'
      },
      // Terms and Condition
      'termscondition@classroom': {
        templateUrl: '/views/partials/classroom/termscondition.html?RELEASE_TAG_VERSION'
      },
      // Privacy Policy
      'privacypolicy@classroom': {
        templateUrl: '/views/partials/classroom/privacypolicy.html?RELEASE_TAG_VERSION'
      },
      // Cookie Policy
      'cookiepolicy@classroom': {
        templateUrl: '/views/partials/classroom/cookiepolicy.html?RELEASE_TAG_VERSION'
      },
      // Expel Message Popup
      'expelpopup@classroom': {
        templateUrl: '/views/partials/classroom/expelpopup.html?RELEASE_TAG_VERSION'
      },
      'teacherissuereport@classroom': {
        templateUrl: '/views/issue-report/teacher-issue-report.html?RELEASE_TAG_VERSION'
      } //Chat Panel
      // 'chatpanel@classroom': {
      // 	templateUrl: '/views/partials/classroom/chat/chatpanel.html?RELEASE_TAG_VERSION',
      // 	controller: 'chatpanelCtrl'
      // }

    }
  })
  /*
  ----------------
  CLASSROOM.AVCHAT
  ----------------
  AVChat is a sub screen in our Classroom App. This is where the teacher
  and student will participate in a full screen digital conference.
  */
  .state('classroom.avchat', {
    url: '/avchat',
    templateUrl: '/views/partials/classroom/avchat/index.html?RELEASE_TAG_VERSION',
    controller: function controller($scope, Auth, $state) {
      //[Hack] - when the user tries by using the browser back button, we need to redirect back to the active screen
      if ($scope.$parent.activeScreen) {
        if ($scope.$parent.activeScreen == 'whiteboard') {
          $state.go('classroom.' + $scope.$parent.activeScreen);
          return false;
        }
      } // Update the activescreen as avchat


      $scope.$parent.activeScreen = 'avchat';
    }
  })
  /*
  --------------------
  CLASSROOM.WHITEBOARD
  --------------------
  Whiteboard is a sub screen in our Classroom App. A presenter can use
  the whiteboard to annotate or present any PPT's.
  */
  .state('classroom.whiteboard', {
    url: '/whiteboard',
    templateUrl: '/views/partials/classroom/whiteboard/index.html?RELEASE_TAG_VERSION',
    controller: function controller($scope, $state) {
      //[Hack] - when the user tries by using the browser back button, we need to redirect back to the active screen
      if ($scope.$parent.activeScreen) {
        if ($scope.$parent.activeScreen == 'avchat') {
          $state.go('classroom.' + $scope.$parent.activeScreen);
          return false;
        }
      } // Update the activescreen as whiteboard


      $scope.$parent.activeScreen = 'whiteboard';
      document.body.setAttribute('data-view', 'whiteboard');
    }
  })
  /*
  ---------------------
  CLASSROOM.SCREENSHARE
  ---------------------
  Screenshare is a sub screen in our Classroom App. A presenter can share
  his/her sceen or any other applications screen to other participants.
  */
  .state('classroom.screenshare', {
    url: '/screenshare',
    templateUrl: '/views/partials/classroom/screenshare/index.html?RELEASE_TAG_VERSION',
    controller: 'ScreenshareCtrl',
    controllerAs: 'screenshareCtrl'
  })
  /*
  -----------
  DIAGNOSTICS
  -----------
  This will diagnose the system and ensures that the client
  meets the minimum requirements needed to launch the App.
  */
  .state('diagnostics', {
    resolve: {
      // Fetches the data from the server
      fetchDump: function fetchDump($exchange, $stateParams, $http, Auth) {
        var sessionData = Auth.getData();
        return $http({
          method: 'GET',
          url: '/api/activity/' + sessionData.activityId + '?' + new Date().getTime(),
          cache: false
        });
      }
    },
    url: '/diagnostics',
    templateUrl: '/views/diagnostics.html?RELEASE_TAG_VERSION',
    controller: 'DiagnosticsController',
    controllerAs: 'diagnosticsController'
  })
  /*
  ----------------------
  ANDROID STORE REDIRECT
  ----------------------
  This will redirect to the android app store list.
  */
  .state('androidstoreredirect', {
    url: '/androidstoreredirect',
    templateUrl: '/views/androidstoreredirect.html?RELEASE_TAG_VERSION',
    controller: function controller($scope, $rootScope) {
      $rootScope.currentView.view = 'mobile';
    }
  })
  /*
  ------
  LOGOUT
  ------
  This will logout a logged in user
  */
  .state('logout', {
    url: '/logout',
    template: '',
    // No need of a template
    controller: 'LogoutCtrl'
  })
  /*
  ----------
  Auto Login
  ----------
  when the user tries to land from other products,
  just call this state along with the following
  parameters userName,userRole,roomId,appName
  */
  .state('autologin', {
    url: '/autologin',
    templateUrl: '/views/autologin.html?RELEASE_TAG_VERSION',
    controller: 'AutologinCtrl',
    controllerAs: 'autologinCtrl'
  })
  /*
  -----------------------
  Session Unavilable Page
  -----------------------
  when the userId or activityId doesn't matach,
  the user will be redirected to the session unavilable page.
  */
  .state('sessionunavailable', {
    url: '/sessionunavailable',
    templateUrl: '/views/sessionunavailable.html?RELEASE_TAG_VERSION',
    controller: 'SessionUnavailableCtrl',
    controllerAs: 'sessionUnavailableCtrl'
  })
  /*
  ------
  THANKS
  ------
  The screen that will be shown after the user is logged out
  */
  .state('thanks', {
    url: '/thanks',
    templateUrl: '/views/thanks.html?RELEASE_TAG_VERSION',
    controller: 'ThanksCtrl'
  })
  /*
  ------
  EXPEL
  ------
  The screen that will be shown after the user is expelled
  */
  .state('expelled', {
    url: '/expelled',
    templateUrl: '/views/expel.html?RELEASE_TAG_VERSION',
    controller: 'ExpelCtrl'
  })
  /*
  ------
  FEEDBACK
  ------
  This screen is for user's feedback.
  */
  .state('feedback', {
    url: '/feedback',
    templateUrl: '/views/feedback.html?RELEASE_TAG_VERSION',
    controller: 'feedbackCtrl'
  })
  /*
  ----
  HELP
  ----
  These are help pages that help user to correctly use app.
  For now binded to login, we can have multiple views later.
  */
  .state('help', {
    url: '/help/:topic',
    templateUrl: '/views/help.html?RELEASE_TAG_VERSION',
    controller: function controller($scope, $transition$) {
      // $stateParams has been deprecated infavor of $transitions$.
      $scope.topic = $transition$.params().topic;
      logger.log('debug', 'app', '[Help] Help pages shown.');
    }
  }).state('akamai', {
    url: '/akamai/sureroute-test-object.html',
    templateUrl: '/views/sureroute-test-object.html'
  })
  /*
  ---------------
  404 (NOT FOUND)
  ---------------
  Any state that app doesn't support will default to a 404 screen.
  */
  .state('404', {
    url: '/404',
    templateUrl: '/views/error/pagenotfound.html?RELEASE_TAG_VERSION',
    controller: function controller($scope, Auth) {
      var sessionData = Auth.getData(); //if session data is there, the user will be redirect back to classroom else it will redirect back to wallstreetworld page

      if (sessionData) {
        $scope.backButton = '/classroom';
      } else {
        $scope.backButton = lsUrl;
      }

      logger.log('debug', 'app', '[Help] Help pages shown.');
    }
  })
  /*
  ------------------
  URL GENERATOR TOOL
  ------------------
  */
  .state('quickslot', {
    url: '/quickslot',
    templateUrl: '/views/quickslot.html?RELEASE_TAG_VERSION',
    controller: 'QuickslotController',
    controllerAs: 'quickslotController'
  }).state('sessionreports', {
    url: '/dc-session-reports',
    templateUrl: '/views/reports/reports.html?RELEASE_TAG_VERSION',
    controller: 'reportsCtrl',
    resolve: {
      sessionReports: function sessionReports($http, $q, reportService) {
        var lastViewedLogPage = window.sessionStorage.getItem('lastViewedLogPage');
        return reportService.getAllReports(lastViewedLogPage);
      }
    }
  }).state('materials', {
    url: '/materials',
    "abstract": true,
    template: "<div class= \"materials-header\" style=\"height: 100%;\">\n\t\t\t\t\t\t\t<header ui-view=\"presenterbar\" class=\"page-header\" style=\"height: 64px;display: flex; align-items: center;\">\n\t\t\t\t\t\t\t\t<div style=\"margin: 0 auto;\">\n\t\t\t\t\t\t\t\t\t<img src=\"../images/opendoor.png\" style=\"width: 24px\"/>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t<div ui-view style=\"height: 100%;\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t"
  }).state('materials.list', {
    url: '',
    templateUrl: '/views/material-preview/list.html?RELEASE_TAG_VERSION',
    controller: 'OnlineMaterialListController',
    controllerAs: 'onlineMaterialListCtrl'
  }).state('materials.view', {
    url: '/material-view',
    templateUrl: '/views/material-preview/view.html?RELEASE_TAG_VERSION',
    controller: 'OnlineMaterialViewController',
    controllerAs: 'onlineMaterialViewCtrl'
  }).state('unsupportedBrowser', {
    url: '/incompatible-browser',
    templateUrl: '/views/unsupportedPage/browser_unsupported.html?RELEASE_TAG_VERSION',
    controller: ['Auth', '$scope', function (Auth, $scope) {
      $scope.callbackUrl = 'redirectDomain';
    }]
  }).state('unsupportedOperatingSystem', {
    url: '/incompatible-OS',
    templateUrl: '/views/unsupportedPage/os_unsupported.html?RELEASE_TAG_VERSION',
    controller: ['Auth', '$scope', function (Auth, $scope) {
      $scope.callbackUrl = 'redirectDomain';
    }]
  })
  /*
  -----------------------------------------------
  URL & USER, ACTIVITY ID GENERATOR TOOL - MOBILE
  -----------------------------------------------
  */
  .state('mobilequickslot', {
    url: '/mobilequickslot',
    templateUrl: '/views/mobilequickslot.html?RELEASE_TAG_VERSION',
    controller: 'QuickslotController',
    controllerAs: 'quickslotController'
  }); // Set a default route. If none of above matches this will be routed.

  $urlRouterProvider.otherwise('/404'); // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

  $httpProvider.interceptors.push('apiInterceptor');
}]).config(['$httpProvider', function ($httpProvider) {
  //initialize get if not there
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }

  $httpProvider.defaults.headers.get['Cache-Control'] = 'max-age=0, no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);
/** Register environment constant
 * 	Currently used for 'assessment module'
 */
//=========================================================
//---------------------- RUN METHOD -----------------------
//=========================================================
// This is the App's main method, will run first when app starts.
// Also anything that doesn't fit for unit test goes here.
// Any other operations to be performed before app starts can be done here

DC.constant('__env', env);
DC.run([// Dependencies
'$http', '$state', '$stateParams', '$rootScope', 'Auth', 'platformService', 'Analytics', '$location', '$transitions', function ($http, $state, $stateParams, $rootScope, Auth, platformService, Analytics, $location, $transitions) {
  // Disables the authentication module
  // Auth.disable();

  /*
  ------------------
  STATE CHANGE START
  ------------------
  Handler for state changes, will run on every state change
  */
  $transitions.onStart({}, function (transition) {
    // Since toState returns full state name including its substates
    // We split it and use only the major state for our check
    // Minor state is used in changing the AV Chat layout
    var state = transition.to().name.split('.'); // Handle state changes

    switch (state[0]) {
      case 'autologin':
        var isOSCompatible = platformService.checkOSCompatibility();
        var isBrowserCompatible = platformService.checkBrowserCompatibility();

        if (isOSCompatible || userAgent.indexOf('iPhone') >= 0 || userAgent.indexOf('iPad') >= 0 || userAgent.indexOf('Android') >= 0) {
          if (isBrowserCompatible || userAgent.indexOf('iPhone') >= 0 || userAgent.indexOf('iPad') >= 0 || userAgent.indexOf('Android') >= 0) {
            if (Auth.getStatus()) {
              return transition.router.stateService.target('diagnostics');
            }
          } else {
            return transition.router.stateService.target('unsupportedBrowser');
          }
        } else {
          return transition.router.stateService.target('unsupportedOperatingSystem');
        }

        break;

      case 'diagnostics':
        if (!Auth.getStatus()) {
          console.log('Transition cancelled'); // Authenticate the user

          return transition.router.stateService.target('autologin');
        } // REMOVE THIS ASAP <<< CM >>>


        document.body.setAttribute('data-view', 'diagnostics');
        break;

      case 'classroom':
        if (Auth.getStatus()) {
          if (!Auth.isDiagnosed() || !Auth.isCrossTabsHandled()) {
            // User is not diagnosed, redirect to diagnostics
            return transition.router.stateService.target('diagnostics');
          }
        } else {
          console.log('Transition cancelled'); // Authenticate the user

          return transition.router.stateService.target('autologin');
        }

        break;

      case 'sessionunavailable':
      case 'logout':
      case 'forcelogout':
      case 'thanks':
      case 'help':
      case '404':
      case 'index':
        break;

      default:
        console.log('[APP] State not found :: ' + state);
    }
  });

  if (!window.logger) {
    // If by mistake logger is not included to the app,
    // Redirect all log messages to default console
    window.logger = {};

    window.logger.log = function () {
      console.log(arguments[2]);
    };
  } else {
    // Configure the logger service
    window.logger.setlogTypes({
      sockets: 'log',
      app: 'all',
      chat: 'all',
      analytics: 'all',
      primus: 'all'
    });
  }
}]); // Angulars master controller, will be executed before any controller runs.

DC.controller('masterCtrl', ['$scope', '$window', '$exchange', '$stateParams', '$compile', '$location', '$state', '$http', '$rootScope', 'Auth', function ($scope, $window, $socket, $stateParams, $compile, $location, $state, $http, $rootScope, Auth) {
  $scope.showAlertModal = false;
  $rootScope.$on('showAlertModal', function () {
    $scope.showAlertModal = true;
    $scope.updateFavicon('favicon-active.ico');
  });

  $scope.continueClass = function () {
    $scope.showAlertModal = false;
    $scope.updateFavicon('favicon.ico');
  };

  $scope.updateFavicon = function (iconName) {
    var link = document.querySelector("link[rel*='short icon']");
    link.setAttribute('href', "".concat(window.location.origin, "/images/favicons/").concat(iconName));
  }; // Define a variable to differentiate web/mobile for defining ng-class
  // Defined as object so the child will get access directly to the parent object


  $rootScope.currentView = {
    view: null
  }; // NOTE :: Avoid using query selector. More Performance hit.
  // Use this as a final resort.

  var element = angular.element;

  angular.element = function (select) {
    var result;
    if (typeof select === 'string' && !/^</.test(select.trim())) select = document.querySelector(select);
    result = element(select);

    result.find = function (find) {
      if (result.length) return element(result[0].querySelectorAll(find));
      return result;
    };

    return result;
  };
  /**
  	 * Don't use ($)window.onresize anywhere
   * Listen for this "resize" and act accordingly
   * Since function assigned to ($)window.resize
   * will overwrite the previously assigned function
   *
   * [OR]
   *
   * Use window.addEventListener('resize', handler)
   **/


  $window.onresize = function (e) {
    $scope.$broadcast('resize');
    document.documentElement.style.overflow = 'auto';
  };
}]);
//# sourceMappingURL=app.js.map

"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
---------------
EXTENSIONS.JS
---------------
This file contains all the JS extensions that will provide an extended functionality
of JS objects into all the browsers. This is where we make cross-browser supported
object extensions.

Also any new JS objects that are to be defined and reused can be declared here.

*/
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }

    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }

    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];

      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }

    return undefined;
  };
} //=========================================================
//-------------------- String Extensions ------------------
//=========================================================

/*
-------------
String.toBool
-------------
Type :: Prototype Extension
Object :: String
Browsers :: All
Description:
	Can be used to convert any string into a boolean value
*/


String.prototype.toBool = function () {
  return /^(?:t|T)rue$/i.test(this);
};
/*
------------
String.toHex
------------
Type :: Extension
Object :: String
Browsers :: All
Description:
	This can be used to find the index of an object in an Array
*/


String.prototype.toHex = function () {
  var str = this;
  var hex = '';

  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }

  return hex;
};
/*
-------------
String.format
-------------
Type :: Extension
Object :: String
Browsers :: All
Description:
	Formats the given string. Replica of C# (string.format) method.
*/


String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};
/*
-------------
String.insert
-------------
Type :: Extension
Object :: String
Browsers :: All
Description:
	Inserts a string into another at the given index.
*/


String.prototype.insert = function (index, string) {
  if (index > 0) return this.substring(0, index) + string + this.substring(index, this.length);else return string + this;
};
/*
-----------
String.trim
-----------
Type :: Extension
Object :: String
Browsers :: <=IE8
Description:
	Trims the string
*/


if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/gm, '');
  };
}

if (!String.prototype.trimLeft) {
  String.prototype.trimLeft = function () {
    return this.replace(/^\s+/, "");
  };
}

if (!String.prototype.trimRight) {
  String.prototype.trimRight = function () {
    return this.replace(/\s+$/, "");
  };
} //=========================================================
//-------------------- Array Extensions -------------------
//=========================================================

/*
-------------
Array.forEach
-------------
Type :: Fix, Extension
Object :: Array
Browsers :: <= IE8
Description:
	This can be used to loop through an array and perform a callback
	for each of the values in the array.
*/
// Check if it is already defined, if not define it


if (!Array.prototype.forEach) {
  Array.prototype.forEach = function forEach(callback, thisArg) {
    var T, k;

    if (this == null) {
      throw new TypeError("this is null or not defined");
    }

    var O = Object(this);
    var len = O.length >>> 0;

    try {
      // Check for any Exceptions
      // Check if the callback is a function
      if ({}.toString.call(callback) !== "[object Function]") {
        throw new TypeError(callback + " is not a function");
      }

      if (thisArg) {
        T = thisArg;
      }

      k = 0;

      while (k < len) {
        var kValue;

        if (Object.prototype.hasOwnProperty.call(O, k)) {
          kValue = O[k];
          callback.call(T, kValue, k, O);
        }

        k++;
      }
    } catch (e) {// Handle the Exception
    }
  };
}
/*
-------------
Array.indexOf
-------------
Type :: Extension
Object :: Array
Browsers :: All
Description:
	This can be used to find the index of an object in an Array
*/


Array.prototype.indexOf = function (obj, start) {
  for (var i = start || 0, j = this.length; i < j; i++) {
    if (this[i] === obj) {
      return i;
    }
  }

  return -1;
};
/*
-------------
Array.filter
-------------
Type :: Extension
Object :: Array
Browsers :: <=IE8
Description:
	Filters the array values
Source: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
*/


if (!Array.prototype.filter) {
  Array.prototype.filter = function (fun
  /*, thisArg*/
  ) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;

    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i]; // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.

        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}
/*
------------------
Array.alphanumsort
------------------
Type :: Extension
Object :: Array
Browsers :: All
Description:
	Performs a alpha numeric sort (Natural Sort) on the Array
Source: http://www.davekoelle.com/files/alphanum.js
*/
// TODO: Delete the alphaSort from here and use from the custom sort.
// Array.prototype.alphanumSort = function (caseInsensitive) {
// 	var z, t;
// 	for (z = 0; t = this[z]; z++) {
// 		this[z] = new Array();
// 		var x = 0, y = -1, n = 0, i, j;
// 		while (i = (j = t.charAt(x++)).charCodeAt(0)) {
// 			var m = (i == 46 || (i >=48 && i <= 57));
// 			if (m !== n) {
// 				this[z][++y] = "";
// 				n = m;
// 			}
// 			this[z][y] += j;
// 		}
// 	}
// 	this.sort(function(a, b) {
// 		for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
// 			if (caseInsensitive) {
// 				aa = aa.toLowerCase();
// 				bb = bb.toLowerCase();
// 			}
// 			if (aa !== bb) {
// 				var c = Number(aa), d = Number(bb);
// 				if (c == aa && d == bb) {
// 					return c - d;
// 				} else return (aa > bb) ? 1 : -1;
// 			}
// 		}
// 		return a.length - b.length;
// 	});
// 	for (var index = 0; index < this.length; index++) {
// 		this[index] = this[index].join("");
// 	}
// }
//=========================================================
//--------------------- Misc Extensions -------------------
//=========================================================

/*
----------
console
----------
Type :: Fix
Browsers :: IE
Problem:
	Console object is not accessable in the code.
Description:
	Console is used to log any data to the console.
*/


if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () {};
/**
 * @ngdoc function
 * @name  offset
 * @description
 * Returns the absolute offset of the element
 * Pretty handy function
 * Got from here =>
 * http://cvmlrobotics.blogspot.in/2013/03/angularjs-get-element-offset-position.html
 * => Someone give this man a medal :)
 */

window.offset = function (el) {
  try {
    return el.offset();
  } catch (e) {}

  var _x = 0;
  var _y = 0;
  var body = document.documentElement || document.body;
  var scrollX = window.pageXOffset || body.scrollLeft;
  var scrollY = window.pageYOffset || body.scrollTop;
  _x = el.getBoundingClientRect().left + scrollX;
  _y = el.getBoundingClientRect().top + scrollY;
  return {
    left: _x,
    top: _y
  };
};
/* Deep extend function
 * equivalent to jQuery extend
 * Source: http://youmightnotneedjquery.com/#deep_extend
 */


window.deepExtend = function (out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];
    if (!obj) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (_typeof(obj[key]) === 'object') deepExtend(out[key], obj[key]);else out[key] = obj[key];
      }
    }
  }

  return out;
};
/* Extend function
 * Source: http://youmightnotneedjquery.com/#extend
 */


window.extend = function (out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i]) continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
    }
  }

  return out;
};
/* EventTarget for creating event objects
 * Source: http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
 * Modified names as we require, like on "addListener" => "on"
 */


window.EventTarget = function (obj) {
  this._listeners = {};

  if (_typeof(obj) === "object") {
    for (var key in obj) {
      this[key] = obj[key];
    }
  }
};

EventTarget.prototype = {
  constructor: EventTarget,
  on: function on(type, listener) {
    if (typeof this._listeners[type] == "undefined") {
      this._listeners[type] = [];
    }

    this._listeners[type].push(listener);
  },
  trigger: function trigger(event) {
    if (typeof event == "string") {
      event = {
        type: event
      };
    }

    if (!event.target) {
      event.target = this;
    }

    if (!event.type) {
      //falsy
      throw new Error("Event object missing 'type' property.");
    }

    if (this._listeners[event.type] instanceof Array) {
      var listeners = this._listeners[event.type];

      for (var i = 0, len = listeners.length; i < len; i++) {
        listeners[i].call(this, event);
      }
    }
  },
  off: function off(type, listener) {
    if (this._listeners[type] instanceof Array) {
      var listeners = this._listeners[type];

      for (var i = 0, len = listeners.length; i < len; i++) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          break;
        }
      }
    }
  }
};
/***
  *  For loading the "define" kind modules
  * Mainly for vidyo libraries
  */

var $__toObject = function $__toObject(value) {
  if (value == null) throw TypeError();
  return Object(value);
};

var modules = {};
var callbacks = {};
var queue = [];
var current = null;

if (!window.defineBasePath) {
  window.defineBasePath = '/scripts/vidyo/';
}

function next() {
  if (queue.length) {
    current = queue.shift();
    var script = document.createElement('script');
    script.src = window.defineBasePath + current + '.js';
    script.onload = next;
    document.body.appendChild(script);
  }
}

function resolve(name, callback) {
  if (modules[name]) {
    callback(modules[name]);
  } else if (callbacks[name]) {
    callbacks[name].push(callback);
  } else {
    queue.push(name);
    callbacks[name] = callback ? [callback] : [];

    if (!current) {
      next();
    }
  }
}

function resolved(name, module) {
  modules[name] = module;

  for (var i = 0; i < callbacks[name].length; i++) {
    callbacks[name][i](module);
  }
}

window.define = function (depsOrModuleFunc, moduleFunc) {
  var deps;

  if (typeof depsOrModuleFunc === 'function') {
    deps = [];
    moduleFunc = depsOrModuleFunc;
  } else {
    deps = depsOrModuleFunc.slice(0);
  }

  var name = null;

  if (current) {
    name = current;
    current = null;
  }

  var args = [];

  function recur() {
    if (deps.length) {
      var dep = deps.shift();
      resolve(dep, function (module) {
        args.push(module);
        recur();
      });
    } else {
      var module = moduleFunc.apply(null, $__toObject(args));

      if (name) {
        resolved(name, module);
      }
    }
  }

  recur();
}; // From Vidyoweb.js


window.vyWrap = function (obj, functionName, factory) {
  var base = obj[functionName].bind(obj);
  obj[functionName] = factory(base);
};

window.vyTempAssign = function (object, values, block) {
  var key;
  var oldValues = {};

  for (key in values) {
    if (values.hasOwnProperty(key)) {
      oldValues[key] = object[key];
      object[key] = values[key];
    }
  }

  try {
    block(object);
  } finally {
    for (key in values) {
      if (values.hasOwnProperty(key)) {
        object[key] = oldValues[key];
      }
    }
  }
};

window.vyReplaceUnknowns = function (object) {
  for (var key in object) {
    if (typeof object[key] === 'unknown') {
      object[key] = undefined;
    } else if (_typeof(object[key]) === 'object') {
      vyReplaceUnknowns(object[key]);
    }
  }
};

window.vyRetry = function (delay, count, func) {
  setTimeout(function () {
    if (!func(count - 1) && count > 1) {
      vyRetry(delay, count - 1, func);
    }
  }, delay);
}; //Temporary fix to redirect to LS. later we need to work by adding via grunt


switch (window.location.hostname) {
  case 'devoddclass.wallstreetenglish.com':
    window.lsUrl = "http://testworld.wallstreetenglish.com";
    window.dcUrl = "http://devoddclass.wallstreetenglish.com";
    break;

  case 'testclass.wallstreetenglish.com':
    window.lsUrl = "http://testworld.wallstreetenglish.com";
    window.dcUrl = "http://testclass.wallstreetenglish.com";
    break;

  case 'testoddclass.wallstreetenglish.com':
    window.lsUrl = "http://testworld.wallstreetenglish.com";
    window.dcUrl = "http://testoddclass.wallstreetenglish.com";
    break;

  case 'stageclass.wallstreetenglish.com':
    window.lsUrl = "http://stageworld.wallstreetenglish.com";
    window.dcUrl = "http://stageclass.wallstreetenglish.com";
    break;

  case 'class.wallstreetenglish.com':
    window.lsUrl = "http://world.wallstreetenglish.com";
    window.dcUrl = "http://class.wallstreetenglish.com";
    break;

  default:
    window.lsUrl = "http://devworld.wallstreetenglish.com";
    window.dcUrl = "http://devclass.wallstreetenglish.com";
}
//# sourceMappingURL=extensions.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AutologinCtrl = /*#__PURE__*/function () {
  function AutologinCtrl(Auth, snb, $state, $location, $timeout, $interval, $rootScope, $http, platformService, loggerService, $storage) {
    _classCallCheck(this, AutologinCtrl);

    this.Auth = Auth;
    this.snb = snb;
    this.platformService = platformService;
    this.$state = $state;
    this.$location = $location;
    this.$timeout = $timeout;
    this.$interval = $interval;
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.loggerService = loggerService;
    this.$storage = $storage;
    this.userDp = {};
    this.userData = null;
    this.showTimer = this.$rootScope.showTimer = false;
    this.locationObject = $location.search();

    if (Object.entries(this.locationObject).length > 0) {
      this.extractURLParams(this.locationObject);
    } else {
      this.getUserDataFromStorage();
    }
  }

  _createClass(AutologinCtrl, [{
    key: "extractURLParams",
    value: function extractURLParams(locationObject) {
      // all these this variable can be changed as local scope variable. Do it later after discussion.
      this.userToken = locationObject.Authorization ? locationObject.Authorization : null;
      this.activityId = locationObject.activityId ? locationObject.activityId : null;
      this.callbackUrl = locationObject.callbackUrl ? locationObject.callbackUrl : null;
      this.createdBy = locationObject.createdBy ? locationObject.createdBy : 'nse';

      if (this.createdBy == 'qs') {
        this.userId = locationObject.userId;
      } else {
        this.userId = this.getUserIdFromToken(this.userToken);
      } // this.userId = locationObject.userId ? locationObject.userId : this.getUserIdFromToken(this.userToken);


      this.saveUserData();
      this.initController();
    }
  }, {
    key: "getUserDataFromStorage",
    value: function getUserDataFromStorage() {
      var userData = this.$storage.getItem('dcAppData');

      if (userData) {
        this.userToken = userData.userToken;
        this.activityId = userData.activityId;
        this.callbackUrl = userData.callbackUrl;
        this.createdBy = userData.createdBy;
        this.userId = userData.userId;
        this.isDiagnosed = userData.isDiagnosed;
        this.userData = userData;
        this.initController();
      } else {
        this.sessionUnavailable();
      }
    }
  }, {
    key: "getUserIdFromToken",
    value: function getUserIdFromToken(token) {
      if (token && token !== 'null') {
        return this.Auth.getUserId(token);
      } else {
        this.sessionUnavailable();
      }
    }
  }, {
    key: "initController",
    value: function initController() {
      this.$rootScope.userId = this.userId;

      if (this.userToken) {
        if (this.createdBy === 'qs') {
          this.enableQuickslotSession(); // Quickslot
        } else {
          this.enableNseSession(); // NSE
        }
      } else {
        if (this.userId == null) {
          this.loggerService.error('User Token and UserId not available');
          this.sessionUnavailable();
        } else {
          this.sessionUnavailable();
        }
      }
    }
  }, {
    key: "enableQuickslotSession",
    value: function enableQuickslotSession() {
      var userData = this.userData || this.$storage.getItem('dcAppData');
      this.authenticateUser(userData);
    }
  }, {
    key: "enableNseSession",
    value: function enableNseSession() {
      var _this = this;

      var userData = this.userData || this.$storage.getItem('dcAppData');
      this.validateUser().then(function (response) {
        return _this.authenticateUser(userData);
      })["catch"](function (error) {
        _this.loggerService.error('API Error while validating the user');
      });
    } // Set the Userdata object based on the url parameters.

  }, {
    key: "saveUserData",
    value: function saveUserData() {
      var userData = {
        userId: this.userId,
        userToken: this.userToken,
        activityId: this.activityId,
        callbackUrl: this.callbackUrl,
        createdBy: this.createdBy,
        isDiagnosed: false
      };
      this.userData = userData;
      this.$storage.setItem('dcAppData', userData);
    } //Validate the user through S&B api call.

  }, {
    key: "validateUser",
    value: function validateUser() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.snb.checkUser(_this2.userData).then(function (data) {
          if (data == 200) {
            resolve(true);
          } else if (data == 400) {
            _this2.sessionUnavailable();
          } else {
            window.location.href = _this2.userData.callbackUrl;
          }
        })["catch"](function (error) {
          reject(error);

          _this2.loggerService.error('API Error during user validation');
        });
      });
    } // authenticate the user and redirect him to the next page.

  }, {
    key: "authenticateUser",
    value: function authenticateUser(userData) {
      var _this3 = this;

      console.log('Authenticating user...');
      this.Auth.authenticate(userData).then(function (data) {
        if (data) {
          if (data.user.expelled) {
            window.location = '/expelled?callbackUrl=' + _this3.callbackUrl;
          } else {
            _this3.processAndRedirect(data);
          }
        } else {
          _this3.loggerService.error('Authentication failed');

          _this3.sessionUnavailable();
        }

        if (data && data.user.expelled == true) {
          window.location = '/expelled?callbackUrl=' + _this3.callbackUrl;
        } else if (data) {
          _this3.isWelcome = true; // Set the initial display to false, so that default user icon will be shown
          // when the image is not fully rendered/ image value is received as 'null'

          _this3.userDp = {
            display: false,
            url: data.user.photoUri ? data.user.photoUri : null,
            usernameSubstring: data.user.firstName.substring(0, 1).toUpperCase() + data.user.lastName.substring(0, 1).toUpperCase()
          };
          _this3.userName = data.user.firstName + ' ' + data.user.lastName;
          _this3.userRole = data.user.role;
          _this3.waitTime = data.session.waitTime; // Checks if the logged in device is a mobile(iOS/Android)

          var userAgent = navigator.userAgent; // If mobile - directly send them to the diagnostics page to avoid 'Wait Time display'
          // Wait time will be handled by mobile team separately

          if (userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0 || userAgent.indexOf("Android") >= 0) {
            _this3.isWelcome = false; // To support css design to adapt mobile view

            _this3.$rootScope.currentView.view = "mobile";

            _this3.$state.go('diagnostics', {
              activityId: _this3.activityId,
              userId: _this3.userData.userId
            });

            return;
          }

          if (_this3.waitTime > 0) {
            // All the below codes corresponds to 'Web'
            // If the waittime is greater than 20 minutes, redirect the user to the session unavailable page.
            if (_this3.waitTime > 15 * 60) {
              _this3.sessionUnavailable();

              return false;
            }

            _this3.showTimer = true; //$scope.waitMinutes = Math.floor($scope.waitTime / 60);

            _this3.remainingTime = _this3.formatSeconds(_this3.waitTime); // If the wait times is 5 or less, then send the user to diagnostics; Else let them wait till 5 mins is left.

            if (_this3.waitTime <= 300) {
              _this3.$state.go('diagnostics', {
                activityId: _this3.activityId,
                userId: _this3.userData.userId
              });
            } else {
              var stopper = _this3.$interval(function () {
                _this3.waitTime = _this3.waitTime - 1; //$scope.waitMinutes = Math.floor($scope.waitTime / 60);

                _this3.remainingTime = _this3.formatSeconds(_this3.waitTime);

                if (_this3.waitTime <= 300) {
                  _this3.$interval.cancel(stopper);

                  _this3.$state.go('diagnostics', {
                    activityId: _this3.activityId,
                    userId: _this3.userData.userId
                  });
                }
              }, 1000); // Update every second

            }
          } else {
            // to avoid showing the welcome on every refresh this check has been added
            if (!_this3.Auth.isDiagnosed()) {
              _this3.$timeout(function () {
                _this3.$state.go('diagnostics', {
                  activityId: _this3.activityId,
                  userId: _this3.userData.userId
                });
              }, 2500);
            } else {
              _this3.isWelcome = false;

              _this3.$state.go('classroom', {
                activityId: _this3.activityId,
                userId: _this3.userData.userId
              });
            }
          }
        } else {
          _this3.loggerService.error('Authentication failed');

          _this3.sessionUnavailable();
        }
      })["catch"](function (error) {
        // Catch and handle the authentication error
        _this3.loggerService.error('API Error during login');
      });
    }
  }, {
    key: "processAndRedirect",
    value: function processAndRedirect(data) {
      var _this4 = this;

      this.isWelcome = true; // Set the initial display to false, so that default user icon will be shown
      // when the image is not fully rendered/ image value is received as 'null'

      this.userDp = {
        display: false,
        url: data.user.photoUri ? data.user.photoUri : null,
        usernameSubstring: data.user.firstName.substring(0, 1).toUpperCase() + data.user.lastName.substring(0, 1).toUpperCase()
      };
      this.userName = data.user.firstName + ' ' + data.user.lastName;
      this.userRole = data.user.role;
      this.waitTime = data.session.waitTime; // Checks if the logged in device is a mobile(iOS/Android)

      var userAgent = navigator.userAgent; // If mobile - directly send them to the diagnostics page to avoid 'Wait Time display'
      // Wait time will be handled by mobile team separately

      if (userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0 || userAgent.indexOf("Android") >= 0) {
        this.isWelcome = false; // To support css design to adapt mobile view

        this.$rootScope.currentView.view = "mobile";
        this.$state.go('diagnostics', {
          activityId: this.activityId,
          userId: this.userData.userId
        });
        return;
      }

      if (this.waitTime > 0) {
        // All the below codes corresponds to 'Web'
        // If the waittime is greater than 20 minutes, redirect the user to the session unavailable page.
        if (this.waitTime > 20 * 60) {
          this.sessionUnavailable();
          return false;
        }

        this.showTimer = true; //$scope.waitMinutes = Math.floor($scope.waitTime / 60);

        this.remainingTime = this.formatSeconds(this.waitTime); // If the wait times is 5 or less, then send the user to diagnostics; Else let them wait till 5 mins is left.

        if (this.waitTime <= 300) {
          this.$state.go('diagnostics', {
            activityId: this.activityId,
            userId: this.userData.userId
          });
        } else {
          var stopper = this.$interval(function () {
            _this4.waitTime = _this4.waitTime - 1; //$scope.waitMinutes = Math.floor($scope.waitTime / 60);

            _this4.remainingTime = _this4.formatSeconds(_this4.waitTime);

            if (_this4.waitTime <= 300) {
              _this4.$interval.cancel(stopper);

              _this4.$state.go('diagnostics', {
                activityId: _this4.activityId,
                userId: _this4.userData.userId
              });
            }
          }, 1000); // Update every second
        }
      } else {
        // to avoid showing the welcome on every refresh this check has been added
        if (!this.Auth.isDiagnosed()) {
          this.$timeout(function () {
            _this4.$state.go('diagnostics', {
              activityId: _this4.activityId,
              userId: _this4.userId
            });
          }, 2500);
        } else {
          this.isWelcome = false;
          this.$state.go('classroom', {
            activityId: this.activityId,
            userId: this.userData.userId
          });
        }
      }
    } // Change the display image value to true, to show the userDp as received

  }, {
    key: "onImgLoad",
    value: function onImgLoad(event) {
      this.userDp.display = true;
    } // Re directs the user to session Unavaialble page.

  }, {
    key: "sessionUnavailable",
    value: function sessionUnavailable() {
      this.loggerService.error('Redirecting to Session Unavailable page');
      this.isWelcome = false; // If authentication fails, redirect to session unavailable page

      this.$state.go('sessionunavailable'); // the below code is might be needed for later references. Will remove it in upcoming releases.
      // window.location = '/sessionunavailable?callbackUrl=' + this.callbackUrl;
    }
  }, {
    key: "formatSeconds",
    value: function formatSeconds(seconds) {
      var date = new Date(1970, 0, 1);
      date.setSeconds(seconds);
      return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
    }
  }]);

  return AutologinCtrl;
}();

angular.module('digitalclassroom').controller('AutologinCtrl', ['Auth', 'snb', '$state', '$location', '$timeout', '$interval', '$rootScope', '$http', 'platformService', 'loggerService', '$storage', function (Auth, snb, $state, $location, $timeout, $interval, $rootScope, $http, platformService, loggerService, $storage) {
  return new AutologinCtrl(Auth, snb, $state, $location, $timeout, $interval, $rootScope, $http, platformService, loggerService, $storage);
}]);
//# sourceMappingURL=autologin.controller.js.map

"use strict";

DC.controller('classroomStateCtrl', ['$state', '$stateParams', '$scope', '$http', '$exchange', 'fetchDump', 'Auth', 'Analytics', '$timeout', '$log', // For advanced logging
'$window', '$rootScope', 'timerService', 'userService', 'notificationService', 'platformService', 'fileupload', 'expelService', 'privilegeService', 'handriseService', 'ActiveDevices', 'EnablexService', 'RTC_PROVIDER', 'loggerService', 'NavigatorMediaDevices', '$interval', '$storage', 'ZoomService', function ($state, $stateParams, $scope, $http, $exchange, fetchDump, Auth, Analytics, $timeout, log, $window, $rootScope, timer, Users, notificationService, PS, fileUpload, expelService, privilegeService, handriseService, ActiveDevices, EnablexService, RTC_PROVIDER, loggerService, NavigatorMediaDevices, $interval, $storage, ZoomService) {
  var sessionData = Auth.getData();
  var loggedInOS = PS.getOSInfo();
  var loggedInBrowser = PS.getBrowserInfo();
  var deviceInfo = {
    osVersion: loggedInOS.version,
    osName: loggedInOS.name,
    browserVersion: loggedInBrowser.version,
    browserName: loggedInBrowser.name,
    deviceType: 'web',
    userId: Users.getCurrentUser().id
  };
  $scope.loggerService = loggerService;
  $scope.EnablexService = EnablexService;
  $scope.ZoomService = ZoomService;
  $scope.RTC_PROVIDER = RTC_PROVIDER;
  $scope.isAudioStarted = true;
  var sessionDuration = fetchDump.data.data.dcAppData.session.slot,
      sessionStartTime = moment(fetchDump.data.data.dcAppData.session.startTime).format('YYYY-MMM-DD HH:mm:ss'),
      sessionEndTime = moment(fetchDump.data.data.dcAppData.session.startTime).add(sessionDuration, 'minutes').format('YYYY-MMM-DD HH:mm:ss');
  console.log('sessionData.activityId', sessionData.activityId);
  $http.post('/api/collectDeviceInformation/' + sessionData.activityId, deviceInfo).then(function (response) {// console.log('collectDeviceInformation-api-res', response.data);
  }, function (error) {// console.log('collectDeviceInformation-api-err', error);
  }); //==============================================================================
  // TOUR DATA - Help module data is set here
  //==============================================================================

  $scope.IntroOptions = {
    steps: [{
      element: '.tour-mute',
      intro: '<p class="intro-mute">Mute / Unmute your Microphone<p>',
      position: 'left'
    }, {
      element: '.tour-chat',
      intro: 'Open / Close Chat',
      position: 'left'
    }, {
      element: '.tour-user',
      intro: 'Click here to change user settings',
      position: 'left'
    }],
    showStepNumbers: false,
    exitOnOverlayClick: true,
    exitOnEsc: true,
    scrollToElement: true,
    skipLabel: '<span class="helpclose">x</span>',
    nextLabel: '<strong class="change-button">Continue</strong>',
    prevLabel: '',
    doneLabel: '<span class="endtour">End Tour</span>'
  }; //==============================================================================
  // APP DATA - Bind the fetched app data
  //==============================================================================
  // Check if activity data exists or not

  if (!fetchDump.data.data) {
    // Change the screen to app data
    $state.go('thanks');
  } // Extract the app data from dump


  var appData = fetchDump.data.data.dcAppData;

  if (appData.rtcServiceProvider) {
    $scope.rtcProvider = appData.rtcServiceProvider;
  } // Assigining the class and unit data to the rootScope to get it in explorer directive


  var fetchDumpData = fetchDump.data.data;
  $rootScope.classData = {
    classTypeName: fetchDumpData.classTypeName ? fetchDumpData.classTypeName : null,
    unit: fetchDumpData.unit ? fetchDumpData.unit.id : null,
    stage: fetchDumpData.Levels ? fetchDumpData.Levels : null,
    scd: fetchDumpData.Scd ? fetchDumpData.Scd : '' // Search content to be displayed by default on the file explorer page

  };
  $scope.isCreatedByQuickslot = sessionData.createdBy == 'qs' ? true : false; // Check whether the session is ended already or not

  if (fetchDump.data.data.dcAppData.session.ended || fetchDump.data.data.dcAppData.session.timeLeft <= 0) {
    var callbackUrl = sessionData.callbackUrl || window.lsUrl;
    window.location = '/sessionunavailable?callbackUrl=' + callbackUrl;
    return;
  }

  $scope.wbData = appData.wbData;
  $rootScope.wbData = appData.wbData;
  $scope.activity = fetchDump.data.data.id; //==============================================================================
  // PREP USER DATA - Users data will be initialized from here
  //==============================================================================
  // Create a common collection for all users

  var participants = appData.students;
  participants.push(appData.teacher); // Updating user data

  Users.initUsers(participants);
  $scope.masterUsers = Users.users; // Used for user status testing [DO NOT REMOVE]

  $scope.user = Users.getCurrentUser();
  $scope.currentUser = Users.getCurrentUser();
  $scope.currentUser.permissionDenied = false;
  $scope.allParticipants = Users.getUsers();
  $scope.students = Users.students;

  $scope.joinedFilter = function (item) {
    return item.joined;
  };

  for (var i = 0; i < $scope.students.length; i++) {
    $scope.students[i].toggleActionMenu = false;
    $scope.students[i].isConnected = false;
  }

  $scope.teacher = Users.teacher; // calculate the min threshold based on participants length, by default to 4 students

  var maxNumberOfParticipants = fetchDumpData.bookings ? fetchDumpData.bookings.length : 4; // to unmute the hardmuted user after refreshing and enabling the mic, enablex bug

  if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
    $scope.currentUser.micHardMuted = false;
    $scope.currentUser.micEnabled = true;
  }

  $scope.bandwidthStats = {
    isStudent: $scope.currentUser.id !== $scope.teacher.id,
    notifications: {
      // object that holds notification message after the bandwidth is calculated
      POOR_TO_MIN_BANDWIDTH: '​Your internet connection is strong. You can now turn on your camera.',
      POOR_TO_GOOD_BANDWIDTH: '​Your internet connection is strong. You can now turn on video.',
      MIN_TO_POOR_BANDWIDTH: 'Your internet connection is slow. Please turn off your camera.',
      MIN_TO_GOOD_BANDWIDTH: '​Your internet connection is strong. You can now turn on video.',
      GOOD_TO_POOR_BANDWIDTH: 'Your internet connection is slow. Please turn use audio-only.',
      GOOD_TO_MIN_BANDWIDTH: 'Your internet connection is slow. Please turn use audio-only.',
      DEFAULT_SUBSCRIPTION_WARNING: 'Your internet connection is too slow to see other Students. Your audio is on.',
      DEFAULT_SELFCAM_WARNING: 'Your internet connection is too slow to enable your camera.'
    },
    MIN_BANDWIDTH_THRESHOLD: 200 + 200 + (maxNumberOfParticipants - 1) * 50,
    // min bandwidth to publish student's self video -> teacher 200 + student 200 + other participants * 50 for audio
    GOOD_BANDWIDTH_THRESHOLD: 200 + maxNumberOfParticipants * 200,
    // min bandwidth to subscribe to all videos for student -> teacher 200 + total participants * 200
    FRAMERATE_LAG_THRESHOLD: 5,
    // difference of recommended framerate vs actual framerate
    INTERVAL_FREQUENCY: 5 * 60 * 1000 // every 5 mins once we calculate the bandwidth

  };
  $scope.bandwidthStats.hasMinBandwidth = !$scope.bandwidthStats.isStudent; // teacher will always publish their video

  $scope.bandwidthStats.hasGoodBandwidth = !$scope.bandwidthStats.isStudent; // teacher will always subscribe to other video

  $scope.videoSubscriptions = []; // keeps track of the video subscriptions for the current user

  if ($scope.bandwidthStats.isStudent) {
    if ($scope.rtcProvider === RTC_PROVIDER.opentok) {
      $scope.isAudioOnlyModeEnabled = true;
      setInterval(handleBandwidthStatsData, $scope.bandwidthStats.INTERVAL_FREQUENCY);
    }
  }

  function handleBandwidthStatsData() {
    checkBandwidthStats().then(function (results) {
      console.log(results);
      var prevNetworkConditions = {
        hasMinBandwidth: $scope.bandwidthStats.hasMinBandwidth,
        hasGoodBandwidth: $scope.bandwidthStats.hasGoodBandwidth
      };

      if (hasGoodNetworkConnection(results)) {
        // allow to subscribe to all videos
        if (prevNetworkConditions.hasGoodBandwidth) return; // network is stable for last couple of minutes

        if (prevNetworkConditions.hasMinBandwidth) {
          // network has gained more bandwidth in last couple of minutes
          showToastMsg($scope.bandwidthStats.notifications.MIN_TO_GOOD_BANDWIDTH, null);
          $scope.bandwidthStats.hasGoodBandwidth = true;
          return;
        }

        if (!prevNetworkConditions.hasMinBandwidth) {
          // network has gained drastic bandwidth
          showToastMsg($scope.bandwidthStats.notifications.POOR_TO_GOOD_BANDWIDTH, $scope.bandwidthStats.notifications.POOR_TO_MIN_BANDWIDTH);
          $scope.bandwidthStats.hasMinBandwidth = true;
          $scope.bandwidthStats.hasGoodBandwidth = true;
          $scope.currentUser.camClickable = true;
          return;
        }
      } else if (hasMinNetworkConnection(results)) {
        // only allow to publish self video
        if (prevNetworkConditions.hasMinBandwidth && !prevNetworkConditions.hasGoodBandwidth) return; // stable network for last couple of minutes

        if (prevNetworkConditions.hasGoodBandwidth) {
          // network dropped from good to min
          !$scope.isAudioOnlyModeEnabled ? showToastMsg($scope.bandwidthStats.notifications.GOOD_TO_MIN_BANDWIDTH, null, true) : null;
          $scope.bandwidthStats.hasMinBandwidth = true;
          $scope.bandwidthStats.hasGoodBandwidth = false;
          return;
        }

        if (!prevNetworkConditions.hasMinBandwidth) {
          // network gained bandwidth in last couple of minutes
          showToastMsg(null, $scope.bandwidthStats.notifications.POOR_TO_MIN_BANDWIDTH, false);
          $scope.bandwidthStats.hasMinBandwidth = true;
          $scope.bandwidthStats.hasGoodBandwidth = false;
          $scope.currentUser.camClickable = true;
          return;
        }
      } else {
        // not allow to publish self video also
        if (!prevNetworkConditions.hasMinBandwidth) return; // bandwidth low for last couple of minutes

        if (prevNetworkConditions.hasGoodBandwidth) {
          if (!$scope.isAudioOnlyModeEnabled && $scope.currentUser.camEnabled) {
            showToastMsg($scope.bandwidthStats.notifications.GOOD_TO_POOR_BANDWIDTH, $scope.bandwidthStats.notifications.MIN_TO_POOR_BANDWIDTH, true);
          } else if (!$scope.isAudioOnlyModeEnabled) {
            showToastMsg($scope.bandwidthStats.notifications.GOOD_TO_POOR_BANDWIDTH, null, true);
          } else if ($scope.currentUser.camEnabled) {
            showToastMsg(null, $scope.bandwidthStats.notifications.MIN_TO_POOR_BANDWIDTH, true);
          }

          $scope.bandwidthStats.hasMinBandwidth = false;
          $scope.bandwidthStats.hasGoodBandwidth = false;
          return;
        }

        if (prevNetworkConditions.hasMinBandwidth) {
          // network has dropped to bad state
          $scope.currentUser.camEnabled ? showToastMsg(null, $scope.bandwidthStats.notifications.MIN_TO_POOR_BANDWIDTH, true) : null; // GOOD_TO_POOR_BANDWIDTH also same effect here

          $scope.bandwidthStats.hasMinBandwidth = false;
          $scope.bandwidthStats.hasGoodBandwidth = false;
        }
      }
    })["catch"](function (error) {
      console.log('error occured while bandwidth calculation ', error);
    });
  }

  function hasMinNetworkConnection(stats) {
    return stats.kbps >= $scope.bandwidthStats.MIN_BANDWIDTH_THRESHOLD;
  }

  function hasGoodNetworkConnection(stats) {
    return stats.kbps >= $scope.bandwidthStats.GOOD_BANDWIDTH_THRESHOLD;
  }

  function showToastMsg(primaryMsg, secondaryMsg, isNegative) {
    $scope.bandwidthStats.showNotification = true;
    $scope.bandwidthStats.message = {
      "default": primaryMsg,
      secondary: secondaryMsg
    };
    $scope.bandwidthStats.messageType = isNegative ? 'negative' : 'positive';
    setTimeout(function () {
      $scope.closeToast();
    }, 5000);
  }

  $scope.closeToast = function () {
    $scope.bandwidthStats.showNotification = false;
    $scope.bandwidthStats.message = {};
    $scope.bandwidthStats.messageType = null;
  }; //==============================================================================
  // EXCHANGE CONNECTION - Connect and subscribe to the exchange
  //==============================================================================
  // If Exchange is not initialized, init now


  if (!$exchange.initialized) {
    // Init the comm. exchange
    $exchange.init({
      userId: Users.getCurrentUser().id,
      userRole: Users.getCurrentUser().role,
      channel: fetchDump.data.data.id
    }); // Update the API to serve this data

    $exchange.lastMsgId = appData.lastMsgId; // Subscribe to the activity channel

    $exchange.subscribe(fetchDump.data.data.id);
  } // If user joins for first time, notify peers


  if (!$scope.user.joined) {
    $exchange.publish('user:joined', {
      channel: sessionData.activityId,
      userId: $scope.currentUser.id
    }); // $scope.currentUser.joined = true;
  } //==============================================================================
  // NOTIFICATIONS - User joined and left notifications
  //==============================================================================
  // USER JOINED NOTIFY
  //$exchange.io.on('user:joined', function(msg) {


  $rootScope.$on('users-joined', function (event, msg) {
    var user = Users.getUser(msg.data.userId); // For teacher view, show notification if user joined

    if ($scope.currentUser.role === 'teacher' && user.id !== $scope.currentUser.id) {
      if ($scope.prevUserId == 'undefined' || $scope.prevUserId != msg.data.userId) {
        // Prevoius and Current User Id isnt same then call userjoin Queue
        notificationService.userjoin(user.userName);
      }
    }

    if (user.role == 'student') {
      // Increment the joined count
      $scope.participantJoinedCount++;
    }

    $scope.prevUserId = msg.data.userId; //Previous UserId
    // if the interval to check devices is not running, then invoke getAvailableList

    if (!intervalToCheckDevices) {
      getAvailableDevicesList();
    }
  }); // USER LOGOUT NOTIFY

  $exchange.io.on('user:logout', function (data) {
    notificationService.userleft(Users.getUser(data.userId).userName);
  }); //==============================================================================
  // SIDE MENU - Side menu bar controls
  //==============================================================================

  $scope.showMenu = false; //left side menu toggle

  document.onclick = function () {
    if ($scope.showSideMenu) {
      $scope.showSideMenu = false;
      $scope.$apply();
    }

    $scope.resolution.showOptions = false;
  }; //left side menu toggle


  $scope.toggleSideMenu = function () {
    // Sending the data to Analytics factory to track the events
    Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Side Menu Toggle');
    $scope.showSideMenu = !$scope.showSideMenu;
    event.stopPropagation();
  };

  $scope.closeSideMenu = function () {
    $scope.showSideMenu = false;
  }; //==============================================================================
  // DISABLE CONTROLS - Manage controls on App
  //==============================================================================
  // Used to disable the controls of teacher during privilege sharing


  $scope.disableControls = false;
  $rootScope.$on('disable-controls', function () {
    $scope.disableControls = true;
  });
  $rootScope.$on('enable-controls', function () {
    $scope.disableControls = false;
  }); // Disable controls for student by default

  if (Users.current.role === 'student') {
    $scope.disableControls = true;
  } //==============================================================================
  // ACTIVE SCREEN CONTROLS - Active screen control functions
  //==============================================================================
  // Change the screen to app data


  $state.go('classroom.' + appData.activeScreen); // Set the active screen

  $scope.activeScreen = appData.activeScreen; // Default dimensions

  $scope.videoDimensions = {
    width: '90%',
    height: '85%',
    top: '0',
    left: '0'
  };

  var adjustVideoDimensions = function adjustVideoDimensions() {
    $timeout(function () {
      /*if(!$scope.selfCamStatus && Users.current.role === 'teacher') {
      	$scope.toggleCamSelf();
      }*/
      // Check the current active screen
      if ($scope.activeScreen === 'avchat') {
        $scope.videoDimensions = {
          width: '100%',
          height: '85%',
          top: '0',
          left: '0'
        };
      } else if ($scope.activeScreen === 'whiteboard' || $scope.activeScreen === 'screenshare') {
        // If whiteboard, calculate the dimensions referring the participant panel
        var refEl = angular.element('#participants-container');

        if (Users.current.role !== 'teacher') {
          var footerVideoHeight = (document.getElementById('participant-panel').offsetHeight - 12) * 1.65;
          var refHeight = footerVideoHeight + 'px';
          var refWidth = refEl.prop('offsetWidth') / 8 * 1.5 + 'px';
          $scope.annotationPostion = footerVideoHeight + 30 + 'px'; // can be removed after one set of production,
          // no need for > 992 to multiply by 1.75, after updating to bootstrap v4 * 1.5 is sufficient for all devices.
          // if (window.innerWidth < 992 || window.innerWidth > 2000) {
          // 	refWidth = refEl.prop('offsetWidth') / 8 * 1.5 + 'px';
          // }

          $scope.videoDimensions = {
            width: refWidth,
            height: refHeight,
            top: '56px',
            left: '20px',
            //10.22% //'7.33%'
            'z-index': '2'
          };
        } else {
          refHeight = document.getElementById('participant-panel').offsetHeight - 12 + 'px'; //var refHeight = refEl.prop('offsetHeight') + 'px';

          refWidth = refEl.prop('offsetWidth') / 8 * 0.85 + 'px';
          $scope.videoDimensions = {
            width: refWidth,
            height: refHeight,
            top: '56px',
            left: '7.33%' //10.22% //'7.33%'

          };
        }
      }
    }, 10);
  };

  $scope.adaptUI = function () {
    $timeout(function () {
      var teacherContainer = document.getElementsByClassName('teacher-avatar');

      for (var i = 0; i < teacherContainer.length; i++) {
        var heightTeacherContainer = teacherContainer[i].clientHeight;
        $scope.profileAvatar.teacherProfilePicSize = Math.round(heightTeacherContainer / 1.65);
        $scope.$apply();
      }

      var studentContainer = document.getElementsByClassName('student-avatar');

      for (var studentContainerIndex = 0; studentContainerIndex < studentContainer.length; studentContainerIndex++) {
        var heightStudentContainer = studentContainer[studentContainerIndex].clientHeight;
        $scope.profileAvatar.studentProfilePicSize = Math.round(heightStudentContainer / 1.65);
        $scope.$apply();
      }
    }, 100);
  }; // need to add throttle here ?


  window.addEventListener('resize', function (event) {
    adjustVideoDimensions();
    $scope.adaptUI();

    if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
      // Canvas resize for teacher and participant canvas when we reize the window
      // timeout is added because while resizing then we are getting old width and height
      // hence to get updated width and height we had used timeout
      $timeout(function () {
        $scope.ZoomService.canvasDimensions(document.getElementById('video-canvas-teacher'), document.getElementById('video-dimensions'), false);
        $scope.ZoomService.canvasDimensions(document.getElementById('video-canvas-participants'), document.getElementById('participants-container'), true);
      }, 100);
      $timeout(function () {
        $scope.ZoomService.onParticipantChange(true);
      }, 1000);
    }
  }); // On screen change, adapt the UI

  $rootScope.$on('app:screen-changed', function ($event, screen) {
    console.log('Adapting to screen change - ' + screen);
    $scope.adaptUI();

    if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
      // canvas resize
      $timeout(function () {
        $scope.ZoomService.canvasDimensions(document.getElementById('video-canvas-teacher'), document.getElementById('video-dimensions'), false);
      }, 100);
      $timeout(function () {
        $scope.ZoomService.onParticipantChange(true);
      }, 1000);
    }
  }); // Changes the activescreen of the application

  $scope.changeActiveScreen = function (screen) {
    if (Users.current.role !== 'teacher') return; // If teacher is switching screen, prompt to turnon video if off

    if (screen == 'avchat' || screen == 'whiteboard') {
      if (!Users.current.camEnabled) {
        $scope.camNotification = true;
      }
    } else {
      $scope.camNotification = false;
    }

    $rootScope.$emit('app:change-screen'); // Disabling the chat in av screen

    if (screen === 'avchat' && $scope.chatBoxOpen) {
      $rootScope.$emit('toggle-chat-box');
    } // Adjust video dimensions


    adjustVideoDimensions();

    if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
      // canvas resize
      $timeout(function () {
        $scope.ZoomService.canvasDimensions(document.getElementById('video-canvas-teacher'), document.getElementById('video-dimensions'), false);
      }, 100);
      $timeout(function () {
        $scope.ZoomService.onParticipantChange(true);
      }, 1000);
    }

    if (!$scope.disableControls) {
      try {
        // Check if the user is teacher
        if (Users.current.role !== 'teacher') return false;
        $scope.activeScreen = screen; // Goto the state

        $state.go('classroom.' + screen); // Emit the changed screen to root scope [used in OT Stream for fonts]

        $rootScope.$emit('app:screen-changed', screen); // Publish the screen change message

        $exchange.publish('change-screen', {
          screen: screen
        });
      } catch (err) {
        console.log('Error: ' + err);
      }
    }
  }; // SOCKET :: change-screen


  $exchange.io.on('change-screen', function (msg) {
    $scope.activeScreen = msg.data.screen;
    $scope.$apply();
    $state.go('classroom.' + msg.data.screen); // Emit the changed screen to root scope [used in OT Stream for fonts]

    $rootScope.$emit('app:screen-changed', screen); // Disabling the chat in av screen

    if (msg.data.screen === 'avchat' && $scope.chatBoxOpen) {
      $rootScope.$emit('toggle-chat-box');
    } // Adjust the video in student view


    adjustVideoDimensions();
    $scope.adaptUI(); // Clsoe the slide menu in av if open

    if ($scope.showSideMenu) {
      $scope.closeSideMenu();
    }
  }); // Adjust the video dimensions on init

  adjustVideoDimensions(); // Adjust the profile Avatar dimensions on init

  $scope.adaptUI(); // Sync with the joined count

  $scope.participantJoinedCount = Users.joinedCount; //==============================================================================
  // SESSION TIMER INTEGRATION - Manage the session time and notifications
  //==============================================================================

  var alarmSound;
  var timeLeft = appData.session.timeLeft;
  var roundOffTime = timeLeft % 60; // in seconds

  var remainingMinutes = Math.floor(timeLeft / 60);
  var sessionSlotTime = appData.session.slot;

  try {
    // removed ngAudio in favor of native Audio tag.
    alarmSound = new Audio('/sounds/handrise.mp3');
  } catch (e) {
    console.log('Audio file loading error : ' + e);
  } // Base check if user refresh the page we have to check remaining time
  // Check the remaining time and logout if not available


  if (remainingMinutes <= 0 && roundOffTime === 0) {
    // Setting the service value with ForceLogout state.
    Users.setForceLogout(true); // Do Logout here

    $state.go('logout');
  } // Init the remaining time


  $scope.sessionRemainingTime = roundOffTime ? remainingMinutes + 1 : remainingMinutes; // Set the time

  timer.setTime(sessionSlotTime, remainingMinutes); // Start the timer after the roundoff time

  $timeout(function () {
    if (roundOffTime) {
      $scope.sessionRemainingTime = $scope.sessionRemainingTime - 1;
    } // Check if there are no minutes remaining


    if (remainingMinutes <= 0) {
      // Setting the service value with ForceLogout state.
      Users.setForceLogout(true);
      $scope.doLogout(false); // Logout the user
    } // Start the session timer


    timer.start();
  }, roundOffTime * 1000); // Set the minute notifier

  timer.setMinuteNotifier(function (remainingTime) {
    $scope.sessionRemainingTime = remainingTime;
  }); // Set the session notifier

  timer.setSessionNotifier(function () {
    showNotification(); // Show the ui notification
  });
  $scope.showSessionNotification = false; // Shows the notification

  var showNotification = function showNotification() {
    $scope.showSessionNotification = true;
    if (alarmSound) alarmSound.play();
    $scope.expandTime = true; // Show the time notification

    $timeout(function () {
      $scope.showSessionNotification = false;
    }, 7000); // Show notification only for 7 seconds
  };

  $scope.toggleSessionNotification = function (status) {
    if (!$scope.showSessionNotification) {
      // Sending the data to Analytics factory to track the events
      Analytics.sendEvent(Analytics.eventAction().hover, Analytics.eventCategory().userInteraction, 'Session Notification');
    }

    $scope.showSessionNotification = status;
  }; // Show the notification at start


  if (timer.showNotificationOnStart) {
    showNotification();
  } //==============================================================================
  // CONNECTION STATUS - User online / offline status is managed here
  //==============================================================================


  $exchange.events.on('connection-status', function (data) {
    try {
      var user = Users.getUser(data.userId);

      if (!user) {
        throw 'User not found';
      } // If teacher is offline, handle


      if (user.role == 'teacher' && !data.status) {
        // Remove the mic hard mute if muted
        if (Users.current.micHardMuted) {// OTS.setPublisherMicStatus(false);
        } // Locally update users data (mic enabled, hard muted)


        for (var i = 0; i < Users.students.length; i++) {
          Users.students[i].micHardMuted = false;
          Users.students[i].micEnabled = true;
        }
      } // Reset the media flags of the user


      Users.resetState(user); // Check the remote mic status

      $scope.checkRemoteMicStatus(); // Apply the changes

      if (!$scope.$$phase) {
        $scope.$apply();
      }
    } catch (err) {
      console.log('Error: ' + err);
    }
  }); //==============================================================================
  // END SESSION - End session and logout codes are placed here
  //==============================================================================

  $scope.showExitPopup = false; // Controls visibility of app exit popup

  var forceLogout = false;
  var isLogoutClicked = false; // Hides the exit popup

  $scope.hideExitPopup = function () {
    $scope.showExitPopup = false;
  }; // exitApp - Checks the user type and prompts for multiple exit options if teacher


  $scope.toggleUserProfile = function () {
    $scope.showExitPopup = !$scope.showExitPopup;

    if ($scope.showExitPopup) {
      $timeout(function () {
        document.getElementById('user-account').focus();
      }, 100);
    }
  };

  $scope.closeUserProfile = function () {
    $timeout(function () {
      $scope.showExitPopup = false;
    }, 650);
  };

  $scope.exitApp = function () {
    // user clicked logout
    $scope.doLogout(true);
  }; // End the session


  $scope.endSession = function () {
    // Send socket to end session
    $exchange.publish('end-session');
    var lastSavedTeacherIssueDetailsInfo = JSON.parse(window.sessionStorage.getItem('teacherIssueDetails'));

    if (lastSavedTeacherIssueDetailsInfo) {
      $scope.submitIssueDetails();
    }
  }; // TODO: Refactor DoLogout to support both teacher and student.
  // SOCKET :: end-session


  $exchange.io.on('end-session', function (msg) {
    // previously doLogout was inside the endSession block.
    // The primus gets disconnected due to logout resulting in the end session event not passing to the students.
    if ($scope.currentUser.role === 'teacher') {
      $scope.doLogout(true); // logout the teacher

      return;
    } // Force logging out the user


    forceLogout = true; // Setting the service value with ForceLogout state.

    Users.setForceLogout(forceLogout); // Got signal from teacher to logout

    $scope.doLogout(false); // logout the student
  }); // Logout the user from the application

  $scope.doLogout = function (viaButtonClick) {
    isLogoutClicked = viaButtonClick;

    if (!(forceLogout && !isLogoutClicked)) {
      $exchange.publish('app:logout', {
        channel: sessionData.activityId,
        userId: $scope.currentUser.id
      });
    } // Cleanup the resources like Opentok streams
    // OTS.stopSession();


    if (!isLogoutClicked) {
      var lastSavedTeacherIssueDetailsInfo = JSON.parse(window.sessionStorage.getItem('teacherIssueDetails'));

      if (lastSavedTeacherIssueDetailsInfo) {
        $scope.submitIssueDetails();
      }
    }

    $state.go('logout');
  }; //==============================================================================
  // MICROPHONE / CAMERA  - Mic and Camera functions and event listeners
  //==============================================================================
  // $scope.OTS = OTS; // Bind OTS to scope
  // Check the remote mic status
  // OTS.checkRemoteMicStatus();
  // Hides the remote mute mic notification


  $scope.hideMicNotification = function () {
    $scope.micNotification = false;
  }; // Hides the cam notification


  $scope.hideCamNotification = function () {
    if (!Users.current.camAvailable) {
      return false;
    }

    $scope.camNotification = false;
  }; // Remote Mute


  $exchange.io.on('remote:mute-mic', function (msg) {
    // Update the status of Muted Student
    if ($scope.currentUser.id === msg.data.uid) {
      $scope.currentUser.micHardMuted = msg.data.status;
      $scope.micNotification = msg.data.status; // add condition based enablex logic here

      if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
        if ($scope.currentUser.micHardMuted) {
          $scope.ZoomService.muteAudio();
        } else {
          $scope.ZoomService.unmuteAudio();
        }
      }
    }

    for (var i = 0; i < Users.students.length; i++) {
      if (Users.students[i].id === msg.data.uid) {
        Users.students[i].micHardMuted = msg.data.status;
        Users.students[i].micEnabled = !msg.data.status;
        break;
      }
    } //
    // let hardmutedStudent = Users.students.filter(student => (student.id === msg.data.uid));
    //


    $scope.checkRemoteMicStatus();
    $rootScope.$emit('manipulate:audios');
  }); // Remote Mute

  $exchange.io.on('remote:mute-all-mic', function (msg) {
    // Show the mic muted notification
    $scope.micNotification = msg.data.status;

    for (var i = 0; i < Users.students.length; i++) {
      Users.students[i].micHardMuted = msg.data.status;
      Users.students[i].micEnabled = !msg.data.status;
    }

    if ($scope.currentUser.role !== 'teacher') {
      // if the mute all event is received the local stream is muted during enablex
      if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
        if (msg.data.status) {
          $scope.ZoomService.muteAudio();
        } else {
          $scope.ZoomService.unmuteAudio();
        }
      } // $scope.publisher.publishAudio(!msg.data.status);

    } // Check the remote mic status


    $scope.checkRemoteMicStatus();
    $rootScope.$emit('manipulate:audios');
  }); //==============================================================================
  // PRIVILEGE INTEGRATION - Privilege in whiteboard are managed here
  //==============================================================================

  $scope.privilegeUser = privilegeService.getCurrentPrivilegeUser();

  $scope.togglePrivilegePopup = function () {
    // Sending the data to Analytics factory to track the events
    Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Toggle Privilege');

    if ($scope.privilegeDisabled) {
      return;
    }

    $rootScope.$emit('toggle-privilege-popup'); // Close the side menu

    $scope.showSideMenu = false;
  }; //HANDRISE FUNCTION


  $scope.triggerHandrise = function (user) {
    handriseService.toggle(user);
  }; //==============================================================================
  // TEXTCHAT INTEGRATION
  //==============================================================================


  $scope.toggleChatPanel = function () {
    // Sending the data to Analytics factory to track the events
    Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Toggle Chat Panel'); //Check for user profile dialog is open, If it is open close it.

    if ($scope.showExitPopup == true) {
      //close user profile box
      $scope.showExitPopup = false;
    } //Trigger chat panel box


    $rootScope.$emit('toggle-chat-box');
  };

  var teacherIssueStoredInformation = JSON.parse(window.sessionStorage.getItem('teacherIssueDetails'));
  var allParticipants = Object.values($scope.allParticipants);

  if (teacherIssueStoredInformation && teacherIssueStoredInformation.selectedParticipant.length > 0) {
    allParticipants.forEach(function (eachParticipant) {
      teacherIssueStoredInformation.selectedParticipant.forEach(function (eachSelectedParticipant) {
        if (eachSelectedParticipant.id === eachParticipant.id) {
          eachParticipant.selected = true;
        }
      });
    });
  } else {
    allParticipants.forEach(function (participant) {
      return participant.selected = false;
    });
  }

  $scope.issue = {
    allParticipants: allParticipants,
    issuesStatedByTeacher: teacherIssueStoredInformation ? teacherIssueStoredInformation.customIssueDescription : null,
    selectedParticipant: teacherIssueStoredInformation ? teacherIssueStoredInformation.selectedParticipant : [],
    showParticipants: false,
    showValidationError: false,
    reportSubmitted: false
  };

  $scope.getSelectedParticipant = function (selectedUser) {
    event.stopPropagation();

    if (selectedUser.selected) {
      selectedUser.selected = !selectedUser.selected;
    } else {
      selectedUser.selected = true;
    }

    var arrayOfSelectedParticipant = $scope.issue.selectedParticipant;
    var index = arrayOfSelectedParticipant.findIndex(function (user) {
      return user.id === selectedUser.id;
    });

    if (index === -1) {
      $scope.issue.selectedParticipant.push(selectedUser);
    } else {
      arrayOfSelectedParticipant.splice(index, 1);
    } // store data in storage


    var lastSavedTeacherIssueDetailsInfo = JSON.parse(window.sessionStorage.getItem('teacherIssueDetails'));

    if (lastSavedTeacherIssueDetailsInfo) {
      lastSavedTeacherIssueDetailsInfo.selectedParticipant = $scope.issue.selectedParticipant;
      window.sessionStorage.setItem('teacherIssueDetails', JSON.stringify(lastSavedTeacherIssueDetailsInfo));
    }
  };

  $scope.toggleReportCanvas = false;

  $scope.openParticipantList = function () {
    $scope.issue.showParticipants = !$scope.issue.showParticipants;
    event.stopPropagation();
  }; // commented Temporarily - needed later whe
  // $scope.getSelectedIssue = function() {
  // 	$scope.selectedIssue = 'Issue 1';
  // };
  // $scope.openPredefinedIssues = function() {
  // 	$scope.showPredefinedIssues = !$scope.showPredefinedIssues;
  // };


  $scope.toggleReportIssue = function () {
    $scope.toggleReportCanvas = !$scope.toggleReportCanvas; // store data in storage

    if (!window.sessionStorage.getItem('teacherIssueDetails')) {
      window.sessionStorage.setItem('teacherIssueDetails', JSON.stringify({
        selectedParticipant: [],
        classTime: "".concat(sessionStartTime, " - ").concat(sessionEndTime),
        customIssueDescription: null
      }));
    }
  };

  $scope.hideValidationMessage = function () {
    var lastSavedTeacherIssueDetailsInfo = JSON.parse(window.sessionStorage.getItem('teacherIssueDetails')); // store data in storage

    if (lastSavedTeacherIssueDetailsInfo) {
      lastSavedTeacherIssueDetailsInfo.customIssueDescription = $scope.issue.issuesStatedByTeacher;
      window.sessionStorage.setItem('teacherIssueDetails', JSON.stringify(lastSavedTeacherIssueDetailsInfo));
    }

    if ($scope.issue.issuesStatedByTeacher.length > 0) {
      $scope.issue.showValidationError = false;
    } else {
      $scope.issue.showValidationError = true;
    }
  };

  $scope.clickedOnPage = function () {
    $scope.issue.showParticipants = false;
  };

  $scope.closeReportCanvas = function () {
    $scope.toggleReportCanvas = false;
    $scope.issue.showParticipants = false;

    if ($scope.issue.reportSubmitted) {
      $scope.issue.selectedParticipant = [];
      $scope.issue.issuesStatedByTeacher = null;
      $scope.issue.reportSubmitted = false;
    }
  };

  $scope.submitAnotherIssue = function () {
    $scope.issue.reportSubmitted = false;
    window.sessionStorage.setItem('teacherIssueDetails', JSON.stringify({
      selectedParticipant: [],
      classTime: "".concat(sessionStartTime, " - ").concat(sessionEndTime),
      customIssueDescription: null
    }));
    $scope.issue.allParticipants.forEach(function (participant) {
      participant.selected = false;
    });
  };

  $scope.submitIssueDetails = function () {
    var affectedUserId = [];
    $scope.issue.selectedParticipant.forEach(function (selectedParticipant) {
      affectedUserId.push(selectedParticipant.id);
    });
    var lastSavedTeacherIssueDetailsInfo = JSON.parse(window.sessionStorage.getItem('teacherIssueDetails'));
    var envIsChina = window.document.domain === 'wallstreetenglish.com.cn' ? true : false;
    var reportInformation = {
      activityId: sessionData.activityId,
      userId: Users.getCurrentUser().id,
      requestFields: {
        summary: "Digital Classroom ".concat(envIsChina ? ' (China) ' : ' (Row) ', "Issue"),
        description: $scope.issue.issuesStatedByTeacher,
        session_id: sessionData.activityId,
        time_of_class: lastSavedTeacherIssueDetailsInfo.classTime,
        logged_in_device: 'Web',
        region: envIsChina ? 'China - North' : 'DC-ROW',
        affectedUserIds: affectedUserId
      }
    };

    if ($scope.issue.selectedParticipant.length > 0 && $scope.issue.issuesStatedByTeacher) {
      $scope.issueGettingSubmitted = true;
      $http.post('/api/reportIssue/createTicket', reportInformation).then(function (response) {
        if (response.data.status === 201) {
          $scope.issue.reportSubmitted = true;
          $scope.issueGettingSubmitted = false;
          $scope.issue.selectedParticipant = [];
          $scope.issue.issuesStatedByTeacher = null;
          $scope.issue.allParticipants.forEach(function (participant) {
            participant.selected = false;
          });
          window.sessionStorage.removeItem('teacherIssueDetails');
        }
      }, function (error) {
        $scope.issueGettingSubmitted = false;
      });
    } else if (!$scope.issue.issuesStatedByTeacher) {
      $scope.issue.showValidationError = true;
    } else {
      console.log('Neither Participant Nor issuesStatedByTeacher are selected');
    }
  };

  $scope.closeSubmitNotification = function () {
    $scope.issue.reportSubmitted = false;
  };

  $scope.chatNotification = false;
  $scope.chatBoxOpen = false;

  if (Users.current.role !== 'teacher') {
    $scope.chatBoxOpen = true;
  }

  $scope.chatUnreadMessages = 0;
  $rootScope.$on('chat-box-toggled', function (event, status) {
    $scope.chatBoxOpen = status;
  });
  $rootScope.$on('chat-notification', function (event, status) {
    $scope.chatNotification = status;
  }); // Get the total unreadMessages count for notification.

  $rootScope.$on('chat:unread-messages', function (event, msgCount) {
    $scope.chatUnreadMessages = msgCount;
  }); //==============================================================================
  // DIAGNOSTICS - Diagnostics popup and service interaction layer
  //==============================================================================
  // Init the device daemon with 5 second frequency
  // Devices.init({
  // 	daemon: true,
  // 	frequency: 5,
  // 	publisher: null
  // });
  // Device Availability Check
  // Devices.checkAvailability();

  $scope.showTermsPopup = false;
  $scope.showPrivacyPopup = false;
  $scope.showCookiePopup = false; // Toggle the terms and Condition popup

  $scope.toggleCmsPopup = function ($content) {
    // Close the side menu
    $scope.showSideMenu = false;

    if ($content == 'terms-and-condition') {
      if (!$scope.showTermsPopup) {
        // Sending the data to Analytics factory to track the events
        Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Terms and Conditions');
      }

      $scope.showTermsPopup = !$scope.showTermsPopup;
    } else if ($content == 'privacy-policy') {
      if (!$scope.showPrivacyPopup) {
        // Sending the data to Analytics factory to track the events
        Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Privacy Policy');
      }

      $scope.showPrivacyPopup = !$scope.showPrivacyPopup;
    } else if ($content == 'cookie-policy') {
      if (!$scope.showCookiePopup) {
        // Sending the data to Analytics factory to track the events
        Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Cookie Policy');
      }

      $scope.showCookiePopup = !$scope.showCookiePopup;
    }
  };

  $scope.showDiagnosticPopup = false; // Initialize the stopAud variable to show the "Play test sound" link by default

  $scope.stopAud = {
    aud: false
  };
  $scope.pubMovingAvg = null;
  $scope.subMovingAvg = null;
  $scope.publisherAudioValues = {};
  $scope.subscriberAudioValues = [];
  var settingsPublisher;

  $scope.initSettingsPublisher = function () {
    if ($scope.rtcProvider === RTC_PROVIDER.opentok) {
      $scope.publisherProperties.audioSource = $scope.activeAudioDevice.deviceId;
      $scope.publisherProperties.videoSource = $scope.activeVideoDevice.deviceId;

      if (settingsPublisher) {
        settingsPublisher.destroy();
        settingsPublisher = null;
      }

      if (!document.getElementById('settings-video-wrapper')) {
        var el = document.querySelector('.settings-mobile');
        var settingsPublisherContainer = el.querySelector('.camera-preview-video');
        var videoContainerEle = document.createElement('div');
        videoContainerEle.setAttribute('id', 'settings-video-wrapper');
        settingsPublisherContainer.appendChild(videoContainerEle);
      }

      var settingsWrapperElement = document.getElementById('settings-video-wrapper');
      settingsPublisher = OT.initPublisher(settingsWrapperElement, $scope.publisherProperties, function (error) {
        if (error) {
          console.log('settingsPublisher - error', error);
        }
      });
      settingsPublisher.on({
        audioLevelUpdated: function audioLevelUpdated(event) {
          // UI controls for showing audio levels
          if ($scope.pubMovingAvg === null || $scope.pubMovingAvg <= event.audioLevel) {
            $scope.pubMovingAvg = event.audioLevel;
          } else {
            $scope.pubMovingAvg = 0.7 * $scope.pubMovingAvg + 0.3 * event.audioLevel;
          } // // 1.5 scaling to map the -30 - 0 dBm range to [0,1]


          var logLevel = Math.log($scope.pubMovingAvg) / Math.LN10 / 1.5 + 1;
          logLevel = Math.min(Math.max(logLevel, 0), 1);
          $scope.$apply(function () {
            $scope.publisherAudioValues = {
              level: logLevel,
              userId: $scope.user.id
            };
          });
        }
      });
      $scope.stopAud = {
        aud: true
      };
    }
  }; // Toggles the diagnostic popup


  $scope.toggleDiagnosticPopup = function () {
    $scope.showDiagnosticPopup = true;

    if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
      $timeout(function () {
        $scope.ZoomService.startLocalPreviewVideo(false, $scope.activeVideoDevice.deviceId);
        $scope.isPreviewVideoStarted = true;
      }, 1000);
    }

    if (settingsPublisher) {
      settingsPublisher.publishVideo(Users.current.camEnabled);
    }
  };

  $scope.getSelectedDevice = function (device) {
    var isAudio = false;

    if (device && (device.kind === 'audioInput' || device.kind === 'audioinput')) {
      isAudio = true;
      $scope.activeAudioDevice = device;
    } else {
      $scope.activeVideoDevice = device;
    }

    var sources = {
      audio: $scope.activeAudioDevice.deviceId,
      video: $scope.activeVideoDevice.deviceId
    };

    if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
      $scope.ZoomService.onSwitchCamera($scope.activeVideoDevice.deviceId);
      return switchDeviceForZoom(device, isAudio);
    }

    if (settingsPublisher) {
      settingsPublisher.destroy();
      settingsPublisher = null;
    }

    $scope.publisherProperties.audioSource = sources.audio;
    $scope.publisherProperties.videoSource = sources.video;
    var el = document.querySelector('.settings-mobile');
    var settingsPublisherContainer = el.querySelector('.camera-preview-video');
    var videoContainerEle = document.createElement('div');
    videoContainerEle.setAttribute('id', 'settings-video-wrapper');
    settingsPublisherContainer.appendChild(videoContainerEle);
    var element = document.getElementById('settings-video-wrapper');
    setTimeout(function () {
      settingsPublisher = OT.initPublisher(element, $scope.publisherProperties, function (error) {
        if (error) {
          console.log(error);
        }
      });
      $scope.resetSourcePublisher($scope.activeAudioDevice, $scope.activeVideoDevice, $scope.audioInputDevices, $scope.videoInputDevices);
      settingsPublisher.publishVideo(Users.current.camEnabled);
    }, 1000);
  };

  $scope.resetSourcePublisher = function (activeAudioDevice, activeVideoDevice, audioInputDevices, videoInputDevices) {
    initNewPublisher(activeAudioDevice, activeVideoDevice, audioInputDevices, videoInputDevices);
  }; // Closes the diagnostic popup


  $scope.closeDiagnosticPopup = function () {
    $scope.showDiagnosticPopup = false;
    $scope.stopAud = {
      aud: false
    };
    $scope.ZoomService.startLocalPreviewVideo(true, $scope.activeVideoDevice.deviceId);
    $scope.isPreviewVideoStarted = false;
  };

  $scope.browser = PS.getBrowserInfo().name; // Map to the devices of Diagnostic service
  // TOGGLE Controls

  $scope.toggleMicOptions = false;
  $scope.toggleCamOptions = false;

  $scope.toggleDeviceSelection = function (device) {
    // Skip if session is not yet connected
    if (!$scope.sessionConnected || $scope.deviceChangeInProgress) {
      return;
    }

    switch (device) {
      case 'mic':
        $scope.toggleMicOptions = !$scope.toggleMicOptions;
        break;

      case 'camera':
        $scope.toggleCameraOptions = !$scope.toggleCameraOptions;
        break;

      default:
        console.log('unsupported device toggle');
    }
  };

  $scope.closeDeviceSelection = function () {
    $scope.toggleMicOptions = false;
    $scope.toggleCameraOptions = false;
  };
  /*$rootScope.$on('devices-ready', function (){
  		// console.log('>>> DEVICE service is ready');
  });*/


  $scope.closeDeviceError = function () {
    $scope.showDevicenotifcation = false;
  };

  var intervalToCheckDevices = null,
      audioInputDevices,
      videoInputDevices;
  $scope.session;
  $scope.publisher = null;
  $scope.subscriberList = {};
  $scope.publisherList = {};
  $scope.publisherProperties = {
    name: $scope.currentUser.id,
    audioSource: null,
    videoSource: null,
    width: '100%',
    height: '100%',
    fitMode: 'cover',
    insertMode: 'replace',
    showControls: false,
    style: {
      backgroundImageURI: 'off',
      nameDisplayMode: 'off',
      buttonDisplayMode: 'off',
      videoDisabledDisplayMode: 'off'
    },
    mirror: true,
    resolution: '320x240'
  };
  $scope.subscriberProperties = {
    name: '',
    width: '100%',
    height: '100%',
    insertMode: 'replace',
    showControls: false,
    fitMode: 'cover',
    style: {
      backgroundImageURI: 'off',
      nameDisplayMode: 'off',
      buttonDisplayMode: 'off',
      videoDisabledDisplayMode: 'off'
    },
    mirror: true
  };
  $scope.resolution = {
    showOptions: false,
    options: [{
      key: 'HD',
      enablexKey: 'HD',
      label: '720p',
      resolution: '1280x720',
      title: 'High Quality'
    }, {
      key: 'MD',
      enablexKey: 'SD',
      label: '480p',
      resolution: '640x480',
      title: 'Medium Quality'
    }, {
      key: 'LD',
      enablexKey: 'LD',
      label: '240p',
      resolution: '320x240',
      title: 'Low Quality'
    }],
    active: {
      key: 'LD',
      label: '240p',
      resolution: '320x240',
      title: 'Low Quality'
    }
  };

  $scope.toggleResolutionOptions = function () {
    event.stopPropagation();
    $scope.resolution.showOptions = !$scope.resolution.showOptions;
  };

  $scope.changeResolution = function (selectedResolution) {
    event.stopPropagation();

    if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
      setReceiveVideoQuality(selectedResolution);
      return;
    }

    $scope.resolution.active = selectedResolution;
    $scope.publisherProperties.resolution = selectedResolution.resolution;
    initNewPublisher($scope.activeAudioDevice, $scope.activeVideoDevice, $scope.audioInputDevices, $scope.videoInputDevices);
    $scope.resolution.showOptions = false;
  };

  $scope.toggleDevices = function (deviceType) {
    if (deviceType === 'mic') {
      this.toggleMicOptions = !this.toggleMicOptions;
      this.toggleCameraOptions = false;
    }

    if (deviceType === 'camera') {
      this.toggleCameraOptions = !this.toggleCameraOptions;
      this.toggleMicOptions = false;
    }

    event.stopPropagation();
  };

  $rootScope.$on('toggle-mic-test-audio', function (event) {
    $scope.toggleMic();
  });

  $scope.toggleMic = function () {
    try {
      //Fix for the button click event when mic hard muted and disabled state.
      // Only allow the mic to be changed after the successfull connection
      if (!Users.current.micAvailable || Users.current.micHardMuted || !Users.current.publisherCreated) {
        return false;
      }

      if (!$scope.isAudioStarted) {
        $scope.ZoomService.startAndSwitchAudio($scope.activeAudioDevice.deviceId);
        $scope.isAudioStarted = true;
        return;
      }

      if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
        // if user mic is enabled mute it and return
        // else unmute 
        if (Users.current.micEnabled) {
          return $scope.ZoomService.muteAudio(muteAudioInStreams);
        } else {
          return $scope.ZoomService.unmuteAudio(muteAudioInStreams);
        }
      } else {
        // $scope.publisher.publishAudio(Users.current.micEnabled);
        muteAudioInStreams();
      }
    } catch (err) {
      console.log('Error: ' + err);
    }
  };

  $rootScope.$on('play:audio', function (event, userId) {
    if ($scope.subscriberList[userId]) {
      $scope.subscriberList[userId].subscribeToAudio(true);
      $scope.subscriberList[userId].setAudioVolume(100);
    }
  });
  $rootScope.$on('stop:audio', function (event, userId) {
    if ($scope.subscriberList[userId]) {
      $scope.subscriberList[userId].subscribeToAudio(false);
      $scope.subscriberList[userId].setAudioVolume(0);
    }
  });

  $scope.toggleCam = function () {
    try {
      //Fix for the button click event on disabled state.
      // Only allow the cam to be toggled after the successful connection, also allow if AV session for enablex
      if (!Users.current.camAvailable || !Users.current.publisherCreated) {
        return false;
      }

      if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
        if (Users.current.camEnabled) {
          return $scope.ZoomService.stopVideo(muteVideoSuccessHandler);
        } else {
          return $scope.ZoomService.startVideo(muteVideoSuccessHandler);
        }
      } else {
        if (Users.current.camEnabled || $scope.bandwidthStats.hasMinBandwidth) {
          muteVideoSuccessHandler();
          $scope.publisher.publishVideo(Users.current.camEnabled);
          settingsPublisher.publishVideo(Users.current.camEnabled);
        } else {
          showToastMsg(null, $scope.bandwidthStats.notifications.DEFAULT_SELFCAM_WARNING, true);
        }
      }
    } catch (err) {
      console.log('Error: ' + err);
    }
  };

  $exchange.io.on('self:mute-mic', function (msg) {
    Users.getUser(msg.data.uid).micEnabled = msg.data.status;

    if (msg.data.uid === Users.teacher.id) {
      Users.teacher.micEnabled = msg.data.status;
    }

    for (var i = 0; i < Users.students.length; i++) {
      if (Users.students[i].id === msg.data.uid) {
        Users.students[i].micEnabled = msg.data.status;
      }
    }

    $scope.checkRemoteMicStatus();
    $rootScope.$emit('manipulate:audios');
  }); // SELF:MUTE-CAM

  $exchange.io.on('self:mute-cam', function (msg) {
    // turned off camera
    if (!msg.data.status) {
      Users.getUser(msg.data.uid).camEnabled = msg.data.status;
      $scope.adaptUI();
      $scope.subscriberList[msg.data.uid] ? $scope.subscriberList[msg.data.uid].subscribeToVideo(msg.data.status) : null;
    } else if (msg.data.status) {
      // turned on camera
      if (msg.data.uid !== $scope.teacher.id && ($scope.isAudioOnlyModeEnabled || !$scope.bandwidthStats.hasGoodBandwidth)) {
        // not enough bandwidth to subscribe to other videos
        $scope.subscriberList[msg.data.uid] ? $scope.subscriberList[msg.data.uid].subscribeToVideo(false) : null;
      } else {
        $scope.subscriberList[msg.data.uid] ? $scope.subscriberList[msg.data.uid].subscribeToVideo(msg.data.status) : null;
        Users.getUser(msg.data.uid).camEnabled = msg.data.status;
        $scope.adaptUI();
      }
    }
  });

  $scope.toggleMicRemote = function ($event, user) {
    $event.preventDefault();
    $event.stopPropagation();
    user.toggleActionMenu = false;

    if (user.micEnabled === false) {
      user.micHardMuted = false;
    } else {
      user.micHardMuted = !user.micHardMuted;
    } // user.micHardMuted = !user.micHardMuted;
    // user.micEnabled = !user.micHardMuted;


    user.micEnabled = !user.micEnabled;

    if (!user.micEnabled) {
      Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Remote Microphone Toggle');
    }

    if ($scope.breakoutRunning) {
      $rootScope.$emit('manipulate:audios');
    } else {
      // the mic enabled value is toggled when the event is received,
      // so the mic is hard unmuted when the mic is enabled and vice versa
      // the enablex hard mute is handled via the socket notification 'remote:mute-mic'
      // and the local streams is muted based on the event received
      if ($scope.rtcProvider === RTC_PROVIDER.opentok) {
        toggleMicRemoteForOpentok(user);
      }

      $rootScope.$emit('manipulate:audios');
    }

    $scope.checkRemoteMicStatus();
    $exchange.publish('remote:mute-mic', {
      status: user.micHardMuted,
      uid: user.id
    });
  };

  $scope.totalJoined = 0;
  $scope.muteAll = false;

  $scope.checkRemoteMicStatus = function () {
    var allJoinedStudnent = Users.students.filter(function (student) {
      return student.joinedTime && student.online;
    });
    var isAllMuted = allJoinedStudnent.every(function (student) {
      return student.micHardMuted || !student.micEnabled;
    });
    $scope.muteAll = isAllMuted;
  };

  $scope.toggleMuteAll = function () {
    $scope.muteAll = !$scope.muteAll;

    if ($scope.muteAll) {
      Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Mute All');
    }

    for (var i = 0; i < Users.students.length; i++) {
      Users.students[i].micHardMuted = $scope.muteAll;
      Users.students[i].micEnabled = !$scope.muteAll;

      if ($scope.rtcProvider === RTC_PROVIDER.opentok) {
        if (Users.students[i] && Users.students[i].joinedTime && Users.students[i].online) {
          if (Users.students[i].id) {
            $scope.subscriberList[Users.students[i].id].subscribeToAudio(!$scope.muteAll);
          }
        }
      }
    } // var allJoinedStudnent = Users.students.filter((student) => (student.joinedTime && student.online));


    $exchange.publish('remote:mute-all-mic', {
      status: $scope.muteAll
    });
    $rootScope.$emit('manipulate:audios');
  };

  function checkBandwidthStats() {
    var otNetworkTest = new NetworkTest(OT, {
      apiKey: appData.session[RTC_PROVIDER.opentok].networkTestSession.otKey,
      sessionId: appData.session[RTC_PROVIDER.opentok].networkTestSession.otSessionId,
      // Add a test session ID for that project
      token: Users.current.otNetworkTestToken // Add a token for that session here

    });
    return new Promise(function (resolve, reject) {
      otNetworkTest.testConnectivity().then(function (result) {
        console.log('network connection test', result);
        otNetworkTest.testQuality(function (stats) {
          // this will trigger for 20-25 times for every second
          console.log('test quality', stats);
        }).then(function (qualityResults) {
          console.log('quality 2 results', qualityResults);
          var transformedResults = {};

          if (qualityResults && qualityResults.video) {
            transformedResults.videoSupported = qualityResults.video.supported;
            transformedResults.kbps = qualityResults.video.bitrate / 1000; // need to check whether 1000 or 8000

            transformedResults.packetLossRatio = qualityResults.video.packetLossRatio;
            transformedResults.reason = qualityResults.video.reason;
            transformedResults.frameRateLag = qualityResults.video.recommendedFrameRate - qualityResults.video.frameRate;
          }

          resolve(transformedResults);
        })["catch"](function (testQualityError) {
          reject(testQualityError);
        });
      })["catch"](function (testConnectivityError) {
        reject(testConnectivityError);
      });
    });
  }

  $scope.toggleAudioOnlyMode = function (event) {
    if (!$scope.bandwidthStats.hasGoodBandwidth) {
      event.preventDefault();
    }

    if (!$scope.isAudioOnlyModeEnabled) {
      // enabling audio only mode, so unsubscribing to remote streams
      $scope.isAudioOnlyModeEnabled = !$scope.isAudioOnlyModeEnabled;
      Object.keys($scope.subscriberList).forEach(function (subscriber) {
        if (subscriber !== $scope.teacher.id) {
          $scope.subscriberList[subscriber].subscribeToVideo(false);
        }
      });
      $scope.students.forEach(function (student) {
        if (student.id !== $scope.currentUser.id) {
          student.camEnabled = false;
        }
      });

      if ($scope.currentUser.camEnabled) {
        $scope.toggleCam();
      }

      return;
    }

    if (!$scope.bandwidthStats.hasGoodBandwidth && !$scope.bandwidthStats.hasMinBandwidth) {
      showToastMsg($scope.bandwidthStats.notifications.DEFAULT_SUBSCRIPTION_WARNING, null, true);
      $scope.isAudioOnlyModeEnabled = true;
      return;
    }

    if (!$scope.bandwidthStats.hasGoodBandwidth && $scope.bandwidthStats.hasMinBandwidth) {
      $scope.isAudioOnlyModeEnabled = true;
      showToastMsg($scope.bandwidthStats.notifications.DEFAULT_SUBSCRIPTION_WARNING, null, true);
      return;
    }

    $scope.isAudioOnlyModeEnabled = !$scope.isAudioOnlyModeEnabled;
    Object.keys($scope.subscriberList).forEach(function (subscriber) {
      if (subscriber !== $scope.teacher.id) {
        $scope.subscriberList[subscriber] ? $scope.subscriberList[subscriber].subscribeToVideo(true) : null;
      }
    });
    $scope.students.forEach(function (student) {
      if (student.id !== $scope.currentUser.id) {
        student.camEnabled = $scope.subscriberList[student.id] ? $scope.subscriberList[student.id].hasVideo : false;
      }
    });
  };

  function initNewPublisher(activeAudioDevice, activeVideoDevice, audioInputDevices, videoInputDevices) {
    if (appData.session[RTC_PROVIDER.zoom]) {
      joinZoomRoom($scope.currentUser.id, sessionData.activityId);
      return;
    } else if (appData.session[RTC_PROVIDER.opentok]) {
      joinOpentokSession(audioInputDevices, videoInputDevices);
    }
  }

  var previousEvent = {
    connectionId: 0,
    creationTime: 0
  };

  function captureData(event, data) {
    var eventData = JSON.parse(data);

    if (eventData.sentOn !== previousEvent.creationTime) {
      previousEvent.creationTime = eventData.sentOn;

      if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
        $rootScope.$emit('message-received', {
          data: data
        });
      } else {
        $rootScope.$emit('signal:textChat', event);
      }
    }
  }

  $scope.setSubscriber = function (stream, element) {
    $scope.subscriberProperties.name = stream.name;

    if (stream.videoType === 'screen') {
      $scope.subscriberProperties.insertMode = 'append';
      $scope.subscriberProperties.fitMode = 'cover';
    } else {
      $scope.subscriberProperties.insertMode = 'replace';
    }

    $scope.subscriberList[stream.name] = $scope.session.subscribe(stream, element, $scope.subscriberProperties, function (error) {
      if (error) {
        console.log(error);
      } else {
        $rootScope.$emit('subscriber-added', stream);
      }
    }); // unsubscribe video if
    // 1. audioonly mode enabled already
    // 2. it's a student video, but user don't have good bandwidth
    // 3. it should not be a sreenshare stream

    if ($scope.teacher.id !== stream.name && stream.videoType !== 'screen' && ($scope.isAudioOnlyModeEnabled || !$scope.bandwidthStats.hasGoodBandwidth)) {
      $scope.subscriberList[stream.name] ? $scope.subscriberList[stream.name].subscribeToVideo(false) : null;
    }
  };

  $rootScope.$on('subscriber-added', function (event, stream) {
    // var filteredStudent = Users.students.find((student) => (student.id === stream.name));
    $rootScope.$emit('manipulate:audios'); // if($scope.breakoutRunning) {
    // 	$rootScope.$emit('manipulate:audios');
    // } else {
    //
    // 	// if(filteredStudent && filteredStudent.micHardMuted) {
    // 	// 		$scope.subscriberList[stream.name].subscribeToAudio(false);
    // 	// 		var receiveAudioVolume = $scope.subscriberList[stream.name].getAudioVolume();
    // 	// } else {
    // 	// 		$scope.subscriberList[stream.name].subscribeToAudio(true);
    // 	// 		var receiveAudioVolume = $scope.subscriberList[stream.name].getAudioVolume();
    // 	// }
    //
    // 	$rootScope.$emit('manipulate:audios');
    // }

    handleRemoteAudioLevel(stream);
  });

  function handleRemoteAudioLevel(stream) {
    if (stream && $scope.subscriberList[stream.name]) {
      $scope.subscriberList[stream.name].on({
        audioLevelUpdated: function audioLevelUpdated(event) {
          if ($scope.subMovingAvg === null || $scope.subMovingAvg <= event.audioLevel) {
            $scope.subMovingAvg = event.audioLevel;
          } else {
            $scope.subMovingAvg = 0.7 * $scope.subMovingAvg + 0.3 * event.audioLevel;
          }

          var logLevel = Math.log($scope.subMovingAvg) / Math.LN10 / 1.5 + 1;
          logLevel = Math.min(Math.max(logLevel, 0), 1);
          $scope.$apply(function () {
            $scope.subscriberAudioValues[stream.name] = {
              level: logLevel,
              userId: stream.name
            };
          });
        },
        disconnected: function disconnected() {// Display a user interface notification.
        },
        connected: function connected() {
          $scope.students.forEach(function (student) {
            if (student.id === stream.name) {
              student.isConnected = true;
            }
          });
          $scope.$apply();
          setInterval(function () {
            $scope.subscriberList[stream.name].getStats(function (err, stats) {
              if ($scope.subscriberList[stream.name]) {
                $scope.subscriberList[stream.name].userVideoStatus = stats.video.frameRate;
              }
            });
          }, 1000);
        },
        destroyed: function destroyed() {
          // Adjust user interface.
          $scope.students.forEach(function (student) {
            if (student.id === stream.name) {
              student.isConnected = false;
            }
          });
        }
      });
    }
  }

  $scope.activeAudioDevice = activeDevices && activeDevices.audio ? activeDevices.audio : '';
  $scope.activeVideoDevice = activeDevices && activeDevices.video ? activeDevices.video : '';
  $scope.showDevicenotifcation = false;
  var activeDevices = ActiveDevices.getInputDevices();

  function getAvailableDevicesList() {
    if ($scope.rtcProvider === RTC_PROVIDER.opentok) {
      OT.getUserMedia().then(function (options) {
        console.log('getUserMedia - options', options);
      }, function (error) {
        console.log('getUserMedia - error', error);
        $scope.getUserMediaError = true;
      });
    }

    intervalToCheckDevices = $interval(function () {
      return getDevices();
    }, 1000);
  }

  var setDevices = function setDevices(error, devices) {
    audioInputDevices = devices.filter(function (element) {
      return element.kind == 'audioInput' || element.kind == 'audioinput';
    });
    videoInputDevices = devices.filter(function (element) {
      return element.kind == 'videoInput' || element.kind == 'videoinput';
    });

    if (!audioInputDevices.length && !videoInputDevices.length) {
      console.log('Neither audio or video device found');
      $scope.publisher = null;
    } else {
      var canSetAudioSource, canSetVideoSource;
      var toggleAudioDevice, toggleVideoDevice;
      canSetAudioSource = canSetVideoSource = false;
      toggleAudioDevice = toggleVideoDevice = false; // when the previous devices is added or removed, the diagnostic pop up is opened

      if ($scope.audioInputDevices && audioInputDevices && $scope.audioInputDevices.length != audioInputDevices.length || $scope.videoInputDevices && videoInputDevices && $scope.videoInputDevices.length != videoInputDevices.length) {
        $scope.audioInputDevices = audioInputDevices;
        $scope.videoInputDevices = videoInputDevices;
        $scope.toggleDiagnosticPopup();
      } else {
        $scope.audioInputDevices = audioInputDevices;
        $scope.videoInputDevices = videoInputDevices;
      }

      if (audioInputDevices.length > 0) {
        if ($scope.activeAudioDevice) {
          // does active device currently exists...
          var isAudioDeviceStillActive = audioInputDevices.some(function (device) {
            return device.deviceId === $scope.activeAudioDevice.deviceId;
          }); // if the already active devices is still on toggle device is left as such
          // else device is toggled new publisher is initiated

          if (isAudioDeviceStillActive) {
            audioInputDevices.forEach(function (device) {
              if (device.deviceId === $scope.activeAudioDevice.deviceId) {
                // need to set the active device when the device is removed.
                // For eg. when the headphones are removed, here device details will be {deviceId: 'default'},
                // and after removing, default device is now internal mic (deviceId will be default), so set the new device label.
                if ($scope.rtcProvider === RTC_PROVIDER.opentok) {
                  $scope.activeAudioDevice.label = device.label;
                } else if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
                  $scope.activeAudioDevice = device;

                  if ($scope.activeAudioDevice.label !== device.label) {
                    switchMediaDevices();
                  }
                }
              }
            }); // do nothing
          } else {
            toggleAudioDevice = true;
            activeDevices = null;
            $scope.activeAudioDevice = activeDevices && activeDevices.audio ? activeDevices.audio : audioInputDevices[0]; // new 0th index audio device is set.
            // activeDevices = null;
            // $scope.activeAudioDevice = audioInputDevices[0];
          }
        } else {
          canSetAudioSource = true;
          $scope.activeAudioDevice = activeDevices && activeDevices.audio ? activeDevices.audio : audioInputDevices[0]; // no active device so set 0th audio devie
        }
      } else {
        // if the audio input devices is zero
        $scope.activeAudioDevice = '';
        $scope.showDevicenotifcation = true; // Trigger the event only if the mic is enabled previously.

        if ($scope.currentUser.micAvailable) {
          $scope.currentUser.micAvailable = false;
          $exchange.publish('mic:available-status', {
            status: false,
            uid: $scope.currentUser.id
          });
        }
      }

      if (videoInputDevices.length > 0) {
        if ($scope.activeVideoDevice) {
          // does active device currently exists...
          var isVideoDeviceStillActive = videoInputDevices.some(function (device) {
            return device.deviceId === $scope.activeVideoDevice.deviceId;
          });

          if (isVideoDeviceStillActive) {
            // do nothing
            videoInputDevices.forEach(function (device) {
              if (device.deviceId === $scope.activeVideoDevice.deviceId) {
                // need to set the active device when the device is removed.
                // For eg. when the headphones are removed, here device details will be {deviceId: 'default'},
                // and after removing, default device is now internal mic (deviceId will be default), so set the new device label.
                if ($scope.rtcProvider === RTC_PROVIDER.opentok) {
                  $scope.activeVideoDevice.label = device.label;
                } else if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
                  $scope.activeVideoDevice = device;
                }
              }
            });
          } else {
            // when the permission is revoked, or when there is no more active devices
            toggleVideoDevice = true;
            activeDevices = null;
            $scope.activeVideoDevice = activeDevices && activeDevices.video ? activeDevices.video : videoInputDevices[0]; // new 0th index audio device is set.
            // $scope.activeVideoDevice = videoInputDevices[0];
            // $scope.initSettingsPublisher();
          }
        } else {
          canSetVideoSource = true;
          $scope.activeVideoDevice = activeDevices && activeDevices.video ? activeDevices.video : videoInputDevices[0]; // no active device so set 0th audio devie
          // this.setOrInitializePublisher($scope.activeAudioDevice, this.videoInputDevices[0]);
        }
      } else {
        $scope.activeVideoDevice = '';
        $scope.showDevicenotifcation = true; // Trigger the event only if the cam is enabled previously.

        if ($scope.currentUser.camAvailable) {
          $scope.currentUser.camAvailable = false;
          $exchange.publish('cam:available-status', {
            status: false,
            uid: $scope.currentUser.id
          });
        }
      } // need to publish


      if (toggleVideoDevice || toggleAudioDevice) {
        // called when the device is changed
        if ($scope.rtcProvider === RTC_PROVIDER.opentok) {
          $scope.initSettingsPublisher();
          $scope.resetSourcePublisher($scope.activeVideoDevice, $scope.activeAudioDevice, audioInputDevices, videoInputDevices);
        }
      } else if (canSetVideoSource || canSetAudioSource) {
        /*first time conditon*/
        initNewPublisher($scope.activeVideoDevice, $scope.activeAudioDevice, audioInputDevices, videoInputDevices);
        $scope.initSettingsPublisher();
      } else {// do nothing
      }
    } // this.setOrInitializePublisher()

  };
  /**
   * To get the devices based on the selected rtcProvider
   */


  var getDevices = function getDevices() {
    if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
      NavigatorMediaDevices.enumerateDevices(function (inputDevices, audioTracks, videoTracks) {
        setDevices(null, inputDevices); // checks if the permission is denied, if denied then browser getUserMedia is called to ask permission

        var isPermissionDenied = inputDevices.some(function (device) {
          return device.deviceId === '';
        }); // only run this once after the permission is allowed.

        if ($scope.currentUser.permissionDenied) {
          if (!isPermissionDenied) {
            $scope.$apply(function () {
              $scope.currentUser.permissionDenied = false;
            });
            $rootScope.$emit('access-allowed');
          }
        }

        if (isPermissionDenied) {
          // only run this once after the permission is denied.
          if (!$scope.currentUser.permissionDenied) {
            $scope.$apply(function () {
              $scope.currentUser.permissionDenied = true;
            });
            $rootScope.$emit('access-denied');
          }

          var sources = {
            audio: $scope.activeAudioDevice.deviceId,
            video: $scope.activeVideoDevice.deviceId
          };
          var constraints = {
            audio: {
              deviceId: sources.audio ? {
                exact: sources.audio
              } : true
            },
            video: {
              deviceId: sources.video ? {
                exact: sources.video
              } : true
            }
          }; // when the media access is revoked and then provided need to call this for populating the available devices.

          NavigatorMediaDevices.getUserMedia(constraints).then(function (stream) {
            stream.getTracks().forEach(function (track) {
              track.stop();
            });
          });
        }
      });
    } else if ($scope.rtcProvider === RTC_PROVIDER.opentok) {
      OT.getDevices(function (error, devices) {
        return setDevices(error, devices);
      });
    }
  };

  if ($scope.currentUser.joined && $scope.currentUser.online) {
    // if the interval to check devices is not running then run get available list
    if (!intervalToCheckDevices) {
      getAvailableDevicesList();
    }
  }

  $scope.showActionMenu = function (event, user) {
    user.toggleActionMenu = true;
    event.stopPropagation();
  };

  $scope.hideActionMenu = function (event, user) {
    user.toggleActionMenu = false;
    event.stopPropagation();
  };

  $scope.profileAvatar = {
    teacherProfilePicSize: 0,
    studentProfilePicSize: 0
  }; //==============================================================================
  // BREAKOUT INTEGRATION - Breakout in whiteboard are managed here
  //==============================================================================
  // Initialize the Breakout module
  // Breakouts.init();
  // Breakout Running

  $scope.breakoutRunning = false; // BREAKOUT RUNNING

  $rootScope.$on('breakout-running', function ($event, status) {
    $scope.breakoutRunning = status;
  }); // Toggles the breakout popup

  $scope.toggleBreakoutPopup = function () {
    // Sending the data to Analytics factory to track the events
    Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Toggle Breakout');
    $rootScope.$emit('toggle-breakout-popup'); // Close the side menu

    $scope.showSideMenu = false;
  };

  $scope.connectBreakout = function () {
    if (Users.current.role !== 'teacher') {
      return;
    } // Emit if student is in a breakout room


    $rootScope.$emit('teacher-connect', this.user.breakoutRoom);
  }; // PRIVILEGE


  $scope.privilegeDisabled = false; // DISABLE PRIVILEGE

  $rootScope.$on('disable-privilege', function () {
    $scope.privilegeDisabled = true;
  }); // ENABLE PRIVILEGE

  $rootScope.$on('enable-privilege', function () {
    $scope.privilegeDisabled = false;
  }); // BREAKOUTS

  $scope.breakoutDisabled = false; // DISABLE BREAKOUT

  $rootScope.$on('disable-breakouts', function () {
    $scope.breakoutDisabled = true;
  }); // ENABLE BREAKOUT

  $rootScope.$on('enable-breakouts', function () {
    $scope.breakoutDisabled = false;
  }); // Temporary work for handling the breakouts info.
  // Set the default data transformations

  for (var stuIndex = 0; stuIndex < $scope.students.length; stuIndex++) {
    // Update the student availability
    $scope.students[stuIndex].isAvailableBreakout = true; // Update the breakout room id to original room

    $scope.students[stuIndex].breakoutRoom = null; // Tracks if user audio is muted

    $scope.students[stuIndex].breakoutMuted = false;
    $scope.students[stuIndex].breakoutRunning = false; // TEMP DATA
    // $scope.students[i].joined = true;
    // $scope.students[i].online = true;
    // $scope.participantJoinedCount = 8;
  } //==============================================================================
  // INDIVIDUAL STREAMS LAYOUT [SUDO] - Placeholder data for individual streams
  //==============================================================================


  $scope.loggedout = false; // Picture to show when video is off

  $scope.videoOffPic = '/images/avatar.jpg'; // This will reset the auto view, which shows the recent or active speaker here
  // For now we just show the teacher

  $scope.recentUser = $scope.teacher; // This will pin a user to the Video screen
  // If no pin, speaking user will be shown here

  $scope.pinnedUser = $scope.teacher; // Pins a user video to the main video

  $scope.pinUser = function (user) {
    // Check if unpinned, clicked on same user
    if ($scope.pinnedUser.userId == user.userId) {
      $scope.pinnedUser = $scope.recentUser;
    } else {
      $scope.pinnedUser = user;
    }
  };

  $scope.pinStarted = false; // PAGE UNLOAD HEANDLER

  window.addEventListener('beforeunload', function (e) {// Free the Opentok elements
  }, false); // window.addEventListener('DOMContentLoaded', (event) => {
  // 	console.log('DOMContentLoaded', event);
  // 	adaptUI();
  // });
  // There is an open issue in ngAudio library
  // https://github.com/danielstern/ngAudio/issues/50
  // This is a patch for not showing the error in console

  /*window.addEventListener("click", function twiddle(){
  	if (audio) {
  		audio.play();
  		audio.pause();
  	}
  	window.removeEventListener("click",twiddle);
  });*/
  // -------------------------
  // Resolution change message
  // -------------------------

  $scope.resMsg = '';
  var resTimer; // Handle the sample video size in the diagnostic popup based on res change
  // Setting default resolution to 720p

  $scope.pubRes = '720p';

  $scope.resolutionChanged = function (resolution) {
    // console.log('Resolution changed to - ' + resolution);
    $scope.resMsg = 'Camera resolution changed to ' + resolution + '.';
    $scope.pubRes = resolution; // Cancel if any timeout is set already

    if (resTimer) {
      $timeout.cancel(resTimer);
    }

    $scope.showResMsg = true;
    resTimer = $timeout(function () {
      $scope.showResMsg = false;
      resTimer = null;
    }, 5000);
  };
  /* 26/3/18 - Hiding the signal icon and the scope variable since we need to show the bandwidth quality instead of video quality.
     *  We will remove the code once the bandwidth quality feature is implemented.
     */
  //$scope.videoQuality = 2;


  $scope.qualityChanged = function (quality) {
    //$scope.videoQuality = quality;
    // If user camera is enabled, show notification message
    if (this.user.camEnabled) {
      var msg;

      switch (quality) {
        case 0:
          msg = 'It looks like your internet connection is very poor. So video has been turned off.';
          break;

        case 1:
          msg = 'It looks like your internet connection is poor. Please consider turning off your video.';
          break;

        default:
          break;
      }

      if (msg) {
        notificationService.alertBandwidth('bandwidth', msg);
      }
    }
  }; // Event to receive the notification sum from the chat directive
  // Displayed on the header band


  $scope.$on('notification:count', function (event, value) {
    $scope.notificationCount = value;
  }); // Event to receive the audio level of active speaker

  $rootScope.$on('audio:level', function (event, value) {
    $scope.audioValues = value;
  }); //Event to trigger the notification to self and peers when he/she  denies the hardware access permission.

  $rootScope.$on('access-denied', function () {
    $scope.currentUser.micAvailable = false;
    $scope.currentUser.camAvailable = false; // Notify peers

    $exchange.publish('mic:available-status', {
      status: false,
      uid: $scope.currentUser.id
    }); // Notify peers

    $exchange.publish('cam:available-status', {
      status: false,
      uid: $scope.currentUser.id
    });
  });
  $rootScope.$on('access-allowed', function () {
    $scope.currentUser.micAvailable = true;
    $scope.currentUser.camAvailable = true; // Notify peers

    $exchange.publish('mic:available-status', {
      status: true,
      uid: $scope.currentUser.id
    }); // Notify peers

    $exchange.publish('cam:available-status', {
      status: true,
      uid: $scope.currentUser.id
    });
  }); // ----------------------------
  // Expel User Popup and Message
  // ----------------------------
  // Mapping expel service to scope value

  $scope.expel = expelService; //Toggle Expel Popup

  $scope.showExpelPopup = false;
  $scope.expelUserData = {};

  $scope.toggleExpelPopup = function () {
    $scope.showExpelPopup = !$scope.showExpelPopup;
  };

  $rootScope.$on('toggle-expel-popup', function (event, options) {
    $scope.expelUserData = options.userData; // used to show popup content for teacher or student based on type

    $scope.expelPopup = options.type;
    $scope.toggleExpelPopup();

    if ($scope.expelPopup == 'information') {
      // Check whether take a tour popsup is active at the time of expelling a student
      // If the Tour popup is active then close the tour popup and expel the particular student
      if (document.querySelector('.introjs-tooltipReferenceLayer')) {
        $scope.exit(function () {
          console.log('Closing the tour popup.');
        });
      }

      $timeout(function () {
        $state.go('expelled');
      }, 5000);
    }
  }); //----------------------------------------------
  // Whiteboard - Image file upload functionality
  // for multiple files:
  //----------------------------------------------

  $scope.uploadingFiles = [];

  $scope.uploadFiles = function (files) {
    // Sending the data to Analytics factory to track the events
    Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Upload Files'); // Function to upload files to the blob storage
    // Uses the file upload's 'Upload method'

    if (files && files.length) {
      // Maximum of 5 files allowed per selection
      if (files.length <= 5) {
        // Defaults to the file error message
        $scope.fileError = 'default';
        $scope.specialCharError = false;
        $scope.uploadingFiles = $scope.uploadingFiles.concat(files);
        angular.forEach(files, function (value, key) {
          // Condition to defer the files with mentioned special characters in their name
          if (value.name.includes('#') || value.name.includes('%')) {
            // To alert for files with Special Characters
            $scope.specialCharError = true;
            return;
          } // Timeout to handle the files being ignored on saving to the DB due to quick upload
          // Validate if any one of the file exceeded the maximum size limit


          var isValidSizedFile = validateFileSize(value);

          if (isValidSizedFile != false) {
            // Setting default values for maintaining progress value & isFileUploaded
            value.uploaded = false;
            fileUpload.uploadFiles(value, sessionData.activityId, function (success) {
              // Hide the upload content - File has been uploaded successfully
              value.uploaded = true;
              $scope.fetchUploadedFiles();
            }, function (error) {
              console.log('FILE UPLOAD - ERROR' + error.status);
            }, function (data) {
              // Returned by the progress callback
              // Maintain the progress value of the uploading file
              value.percentage = data;
            });
          }
        });
      } else {
        $scope.fileError = 'maxNumberExceeded';
      }
    }
  }; // Event called on file size exceeding the limit


  function validateFileSize(file) {
    // Max. file size - 5Mb
    if (file.size > 5000000) {
      $scope.fileError = 'maxSizeExceeded';
      return false;
    }
  } // Set error messages to default on cancel, import, close button click


  $scope.setErrorsToDefault = function () {
    $scope.fileError = 'default'; // Hides the special character error message

    $scope.specialCharError = false;
  }; // Fetch all uploaded files


  $scope.fetchUploadedFiles = function () {
    // Calls the API method to fetch all the uploaded files
    fileUpload.fetchUploadedFiles(sessionData.activityId).then(function (data) {
      var uniqueFiles = fileUpload.sortDuplicateFiles(data);
      var canDeleteFiles = fileUpload.canDeleteFiles(uniqueFiles, mountedImages);
      $scope.uploadedFiles = canDeleteFiles;
      console.log('uploaded files', $scope.uploadedFiles);
    })["catch"](function (error) {
      // Catch and handle the authentication error
      // console.error(error + 'Could not fetch uploaded files');
      // Hide the upload content
      $scope.recentUpload = null;
    });
  }; // Delete selected file


  $scope.deleteUploadedFile = function (file) {
    // Calls the API method to fetch all the uploaded files
    //fileUpload.deleteUploadedFile(file.path, sessionData.activityId).then(function(data){
    fileUpload.deleteUploadedFile(file, sessionData.activityId).then(function (data) {
      //temp line
      // Sending the data to Analytics factory to track the events
      Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Delete Uploaded File');
      $scope.fetchUploadedFiles();
    })["catch"](function (error) {
      // Catch and handle the authentication error
      console.error(error + 'Could not fetch uploaded files');
    });
  }; // Functions to be called on page load


  function initialize() {
    $scope.fetchUploadedFiles(); // Defaults to the file error message

    $scope.fileError = 'default';
  }

  initialize();
  /*
     * The Timeout logic written below on window focus and blur is not needed anymore since it has been moved to stream factory.
     * Considering the code refactoring, leaving it as it is and it is not gonna affect existing user:away logic.
     */
  // Method to track if the user is away from the current tab(DC) and notify all other users

  var userAwayTimer; // Triggers when the user enters DC tab

  window.onfocus = function () {
    $timeout.cancel(userAwayTimer);
    $exchange.publish('user:away', {
      channel: sessionData.activityId,
      userId: $scope.currentUser.id,
      isAway: false
    });
  }; // Triggers when the user is away from the DC tab


  window.onblur = function () {
    userAwayTimer = $timeout(function () {
      // Send socket to all other user notifying, the teacher or student is on a tab other than DC classroom
      $exchange.publish('user:away', {
        channel: sessionData.activityId,
        userId: $scope.currentUser.id,
        isAway: true
      });
    }, 0); // A default 1s timer is run so that, we don't notify for minor tab switches
    // If the user switches the tab then the video should play in the background
    // playVideo("onBlur");
  };
  /** Event received on users fetched
     * Fix - workaround for NSEALL-17020
     * Data received from user service - getUpdatedUserList - user:online
     */


  $rootScope.$on('users-updated', function (event, msg) {
    $timeout(function () {
      /** Get and update the students list to display on the participant panel */
      $scope.students = Users.getStudents();
      /** Fix for the view not getting updated NSEALL- 17020 */

      $scope.$apply();
    }, 300);
  });
  $exchange.io.on('user:online', function (data) {
    var user = Users.getUser(data.data.userId); // if teacher is offline, handle

    if (data.data.userRole == 'teacher' && !data.data.status) {
      // Locally update users data (mic enabled, hard muted)
      // Unmute the hard muted user when the teacher disconnects
      if ($scope.currentUser.micHardMuted) {
        if ($scope.rtcProvider === RTC_PROVIDER.zoom) {
          $scope.ZoomService.unmuteAudio();
        }
      }

      Users.students.forEach(function (student) {
        if (student.micHardMuted) {
          student.micHardMuted = false;
          student.micEnabled = true;
          $scope.subscriberList[student.id] ? $scope.subscriberList[student.id].subscribeToAudio(true) : null;
        }
      }); // Update the current user data

      if ($scope.currentUser.micHardMuted) {
        $scope.currentUser.micHardMuted = false;
        $scope.currentUser.micEnabled = true;
      }

      $rootScope.$emit('manipulate:audios');
    } // Reset the media flags of the user


    if (user && data.data.userId !== $scope.currentUser.id) {
      // don't have to reset the state twice for the same user. We already resetting in "connection-status" event callback
      Users.resetState(user);
    }

    $scope.checkRemoteMicStatus();
  });
  $exchange.io.on('close', function () {
    if (!Users.getTeacher().online) {// If the networks disconnects then the scenario is same as close tab
      // playVideo("offline");
    }
  });
  $exchange.io.on('mic:available-status', function (msg) {
    var data = msg.data;
    Users.getUser(data.uid).micAvailable = data.status;
  });
  $exchange.io.on('cam:available-status', function (msg) {
    var data = msg.data;
    Users.getUser(data.uid).camAvailable = data.status;
  });
  var userClone = angular.copy($scope.students);
  userClone.map(function (user) {
    user.timer = null;
  });
  $exchange.io.on('user:away', function (msg) {
    if (msg.data.isAway) {
      userClone.forEach(function (user) {
        if (user.id === msg.data.userId) {
          if (user.timer !== null) {
            $timeout.cancel(user.timer);
          }

          user.timer = $timeout(function () {
            $scope.students.forEach(function (student) {
              if (student.id === user.id) {
                student.isAway = msg.data.isAway;
              }
            });
          }, 5000);
        }
      });
    } else {
      userClone.forEach(function (user) {
        if (user.id === msg.data.userId) {
          $timeout.cancel(user.timer);
          $scope.students.forEach(function (student) {
            if (student.id === user.id) {
              student.isAway = msg.data.isAway;
            }
          });
        }
      });
      $scope.$apply();
    }
  }); // function playVideo(windowState){
  // 	var currentAction = windowState, video = null;
  // 	if((document.getElementById("content-area"))){
  // 		var iframe = document.getElementById("content-area").getElementsByTagName("iframe");
  // 		for(var i=0; i < iframe.length; i++){
  //
  // 			if(iframe[i].style.display == "block"){
  //
  // 				var playing = iframe[i].contentDocument.querySelector('.video_player .controls .play .selected');
  // 				video = iframe[i].contentDocument.querySelector('video');
  // 				//OnBlur Event Condition
  // 				if(currentAction == "onBlur"){
  // 					if(Users.getTeacher().online){
  // 						if(video != null && playing != null){
  // 							$timeout(function(){
  // 								video.play();
  // 							}, 500);
  // 						}
  // 					}
  // 				}
  // 				//Reconnect Event Condition
  // 				else if(currentAction == "reconnect"){
  // 					if(video){
  // 						var beforeBeginning = iframe[i].contentDocument.querySelector('.video_player .controls .progress .playing');
  // 						video.currentTime = 0;
  // 						setTimeout(function(){
  // 							video.play();
  // 						},2500);
  // 					}
  // 				}
  // 				//Offline Event Condition
  // 				else{
  // 					if(!Users.getTeacher().online){
  // 						video = iframe[i].contentDocument.querySelector('.video_player .controls .play');
  // 						if(playing != null){
  // 							video.click();
  // 						}
  // 					}
  // 				}
  //
  // 			}
  //
  // 		}
  // 	}
  // };

  /** Check for displaying delete icon when the file is mounted on the whiteboard
     * Fix for: image crashes on the whiteboard if the mounted image is deleted in the file-explorer dialog
     * We gonna hide the delete icon if the image has been mounted on >1 whiteboard
     */

  var mountedImages = [];
  $scope.$on('delete-mounted-image', function (event, data) {
    if (data.action == 'import') {
      var isIndexExist = false;

      if (mountedImages.length > 0) {
        mountedImages.map(function (img) {
          if (img.index == data.index) {
            isIndexExist = true;
            return;
          }
        });
      }

      if (!isIndexExist) {
        mountedImages.push({
          name: data.name,
          index: data.index
        });
      } else {
        /** Condition to keep the mountedImage array updated */
        for (var img in mountedImages) {
          /** Replacing an existing image on a whiteboard with another without closing the board */
          if (mountedImages[img].index == data.index) {
            if (mountedImages[img].name != data.name) {
              mountedImages[img].name = data.name;
            }
          }
        }
      }
    } else if (data.action == 'close') {
      mountedImages = fileUpload.isObjectExists(data, mountedImages);
      /** Board index changes on deleting a board. If 2nd board is deleted,
           * all board >2 gets affected by index change
           */

      mountedImages = fileUpload.rearrangeBoardIndex(data, mountedImages);
    } else {
      mountedImages = fileUpload.isObjectExists(data, mountedImages);
    }

    fileUpload.canDeleteFiles($scope.uploadedFiles, mountedImages);
  });
  /** Reload the page to resync the data on socket reconnection after the disconnect */

  $rootScope.$on('reloadToResyncData', function (event, data) {
    $scope.reloadToResyncData = true;
    $scope.loggerService.error('Sync issue', {
      role: $scope.user.role,
      id: $scope.user.id,
      name: $scope.user.firstName,
      activityId: $scope.user.activityId,
      provider: $scope.rtcProvider
    });
  });
  /** Reloads the application on user interaction after socket reconnection */

  $scope.reloadApp = function () {
    $window.location.reload();
  }; // Setting the userAway value to default, whenever the user closes the tab


  window.onbeforeunload = function (e) {
    $exchange.publish('user:away', {
      channel: sessionData.activityId,
      userId: $scope.currentUser.id,
      isAway: false
    });
  };
  /**
   * Function to handle mute and unmute logic.
   * This is passed as a callback to enablex upon success this function is triggered.
   * For opentok when the user clicks the toggle mic this is triggered. 
   */


  var muteAudioInStreams = function muteAudioInStreams() {
    // Toggle the mute status and publish the status
    Users.current.micEnabled = !Users.current.micEnabled;

    if (!Users.current.micEnabled) {
      Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Toggle Microphone');
    } // $scope.publisher.publishAudio(Users.current.micEnabled);
    // is this event used ?


    $rootScope.$emit('manipulate:audios');
    $exchange.publish('self:mute-mic', {
      status: Users.current.micEnabled,
      uid: Users.current.id
    });
  };
  /**
   * the loader  running in the participant tile.
   */


  $scope.getLoaderStatus = function () {
    switch ($scope.rtcProvider) {
      case RTC_PROVIDER.zoom:
        return $scope.user.online && $scope.user.id !== $scope.currentUser.id && $scope.user.camEnabled && $scope.user.camAvailable && !$scope.user.isAway;

      case RTC_PROVIDER.opentok:
        return $scope.user.online && $scope.subscriberList[$scope.user.id] && !$scope.subscriberList[$scope.user.id].stream.hasVideo && $scope.user.id !== $scope.currentUser.id && $scope.user.camEnabled && $scope.user.camAvailable && !$scope.user.isAway;

      default:
        return false;
    }
  };
  /**
   * Switch the microphone or the camera of the enablex stream. 
   */


  var switchDeviceForZoom = function switchDeviceForZoom(device, isAudio) {
    if (isAudio) {
      $scope.ZoomService.switchMicrophone(device.deviceId);
    } else {
      $scope.ZoomService.switchCamera(device.deviceId);
    }
  };
  /**
   * This function is used to toggle the cam.
   * It is passed as a callback to enablex upon success the cam on/off is toggled.
   * In opentok it is called after the user clicks the on/off button in html.
   */


  var muteVideoSuccessHandler = function muteVideoSuccessHandler() {
    Users.current.camEnabled = !Users.current.camEnabled;
    $exchange.publish('self:mute-cam', {
      status: Users.current.camEnabled,
      uid: Users.current.id
    }); // Sending the data to Analytics factory to track the events

    Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, 'Toggle Camera');
  };

  var playEnablexStream = function playEnablexStream(stream, remote_name, index, clientId, playerOpt) {
    // not playing the local stream by checking stream.local
    if (stream.local) {
      return;
    } // play the video in the middle container if it is teachers video


    if (remote_name === $scope.teacher.id) {
      var teacherDom = document.getElementById("ot-publisher-video-container-classroom");

      if (teacherDom && teacherDom.childElementCount === 0) {
        stream.play('ot-publisher-video-container-classroom', playerOpt);
      }
    } else {
      // else play in the student participant panel
      var studentDom = document.getElementById("".concat(remote_name, "-ot-subscriber-video-container-classroom"));

      if (studentDom && studentDom.childElementCount === 0) {
        stream.play("".concat(remote_name, "-ot-subscriber-video-container-classroom"), playerOpt);
      }
    }
  };
  /**
   * Initializes the enablex settings container
   */


  function initEnablexSettings() {
    if (document.getElementById("settings-video-wrapper") && document.getElementById("settings-video-wrapper").childElementCount === 0) {
      // if the enablex local stream is available play it in the settings container
      if ($scope.EnablexService.localStream) {
        return $scope.EnablexService.playLocalStreamInCustomDiv('settings-video-wrapper');
      }
    }
  }
  /**
   * When the user is hard muted the audio streams are unsubscribed by the participants.
   */


  function toggleMicRemoteForOpentok(user) {
    if (user.micEnabled) {
      $scope.subscriberList[user.id].subscribeToAudio(true);
    } else {
      $scope.subscriberList[user.id].subscribeToAudio(false);
    }
  }

  function joinZoomRoom() {
    var userId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $scope.currentUser.id;
    var topic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'zoom testing session test';
    $http.post('/api/zoom-signature', {
      userId: userId,
      topic: topic
    }).then(function (response) {
      console.log('response', response);
      $scope.ZoomService.initiateClient(response.data.token, topic, $scope.activeAudioDevice.deviceId, $scope.activeVideoDevice.deviceId, $scope.activeScreen, function () {
        $scope.currentUser.publisherCreated = true;
        $scope.isAudioStarted = localStorage.getItem('isPageRefreshed') === 'false';
        $scope.currentUser.camClickable = true;
        $scope.ZoomService.listenForMessage(captureData);
      });
    });
  }

  function joinOpentokSession(audioInputDevices, videoInputDevices) {
    if (!$scope.audioInputDevices && !$scope.videoInputDevices) {
      $scope.$apply(function () {
        $scope.audioInputDevices = audioInputDevices;
        $scope.videoInputDevices = videoInputDevices;
      });
    }

    if ($scope.publisher) {
      $scope.publisher.destroy();
      $scope.publisher = null;
      var parentElement, videoContainerEle;

      if ($scope.currentUser.role === 'teacher') {
        parentElement = document.querySelector('.pinned-view-wrapper');
        videoContainerEle = document.createElement('div');
        videoContainerEle.setAttribute('id', 'ot-publisher-video-container-classroom');
        videoContainerEle.setAttribute('class', 'ot-wrapper');
        parentElement.appendChild(videoContainerEle);
      } else if ($scope.currentUser.role === 'student') {
        parentElement = document.getElementById($scope.currentUser.id + '-participant-tile');
        videoContainerEle = document.createElement('div');
        videoContainerEle.setAttribute('id', $scope.currentUser.id + '-ot-subscriber-video-container-classroom');
        videoContainerEle.setAttribute('class', 'ot-wrapper');
        parentElement.appendChild(videoContainerEle);
      } else {// console.log("NO DIV");
      }
    }

    $scope.publisherProperties.audioSource = $scope.activeAudioDevice.deviceId;
    $scope.publisherProperties.videoSource = $scope.activeVideoDevice.deviceId;

    if (!$scope.bandwidthStats.hasMinBandwidth) {
      // disable the cam by default for student
      setTimeout(function () {
        $scope.currentUser.camEnabled = false;
        $scope.currentUser.camClickable = false;
        $exchange.publish('self:mute-cam', {
          status: $scope.currentUser.camEnabled,
          uid: $scope.currentUser.id
        });
      }, 800); // added timeout otherwise UI is not updating
    }

    var publisherReplacementElementId = $scope.currentUser.role === 'teacher' && $scope.currentUser.id === $scope.teacher.id ? document.getElementById('ot-publisher-video-container-classroom') : document.getElementById($scope.currentUser.id + '-ot-subscriber-video-container-classroom');
    $scope.publisher = OT.initPublisher(publisherReplacementElementId, $scope.publisherProperties, function (error) {
      $scope.currentUser.publisherCreated = true;

      if (error) {
        console.log(error);
      }
    });

    if ($scope.bandwidthStats.hasMinBandwidth) {
      $scope.publisher.publishVideo(Users.current.camEnabled);
    } else {
      $scope.publisher.publishVideo(false);
    }

    if (!$scope.bandwidthStats.hasMinBandwidth) {
      handleBandwidthStatsData();
    }

    if (Users.current.micHardMuted || !Users.current.micEnabled) {// $scope.publisher.publishAudio(false);
    }

    if ($scope.publisher) {
      $scope.publisher.on({
        streamCreated: function streamCreated(event) {},
        streamDestroyed: function streamDestroyed(event) {},
        destroyed: function destroyed(event) {},
        accessAllowed: function accessAllowed(event) {
          $scope.$apply(function () {
            $scope.currentUser.permissionDenied = false;
          });
          $rootScope.$emit('access-allowed');
        },
        accessDenied: function accessDenied(event) {
          $scope.$apply(function () {
            $scope.currentUser.permissionDenied = true;
          });
          $rootScope.$emit('access-denied');
        },
        audioLevelUpdated: function audioLevelUpdated(event) {
          // UI controls for showing audio levels
          if ($scope.pubMovingAvg === null || $scope.pubMovingAvg <= event.audioLevel) {
            $scope.pubMovingAvg = event.audioLevel;
          } else {
            $scope.pubMovingAvg = 0.7 * $scope.pubMovingAvg + 0.3 * event.audioLevel;
          } // // 1.5 scaling to map the -30 - 0 dBm range to [0,1]


          var logLevel = Math.log($scope.pubMovingAvg) / Math.LN10 / 1.5 + 1;
          logLevel = Math.min(Math.max(logLevel, 0), 1);
          $scope.publisherAudioValues = {
            level: logLevel,
            userId: $scope.user.id
          };
          $scope.$apply();
        }
      });
    }

    if ($scope.session) {
      $scope.session.publish($scope.publisher);
    } else {
      $scope.session = OT.initSession(appData.session[RTC_PROVIDER.opentok].otKey, appData.session[RTC_PROVIDER.opentok].otSessionId);
    }

    $scope.session.on({
      connectionCreated: function connectionCreated(event) {
        console.log('connectionCreated to session', event);
      },
      connectionDestroyed: function connectionDestroyed(event) {// console.log('session event - connectionDestroyed........', event);
      },
      sessionReconnecting: function sessionReconnecting(event) {
        $scope.currentUser.otSessionDisconnecting = true;
      },
      sessionReconnected: function sessionReconnected(event) {
        $scope.currentUser.otSessionDisconnecting = false;
      },
      sessionDisconnected: function sessionDisconnected(event) {
        $scope.currentUser.otSessionDisconnected = true;
      },
      streamCreated: function streamCreated(event) {
        if (event.stream.videoType !== 'screen') {
          if (event.stream.name === $scope.teacher.id) {
            if (document.getElementById('ot-publisher-video-container-classroom')) {
              $scope.mediaSubscriberHelper(event);
            } else {
              var _parentElement = document.querySelector('.pinned-view-wrapper');

              var _videoContainerEle = document.createElement('div');

              _videoContainerEle.setAttribute('id', 'ot-publisher-video-container-classroom');

              _videoContainerEle.setAttribute('class', 'ot-wrapper');

              _parentElement.appendChild(_videoContainerEle);

              $scope.mediaSubscriberHelper(event);
            }
          } else {
            if (document.getElementById(event.stream.name + '-ot-subscriber-video-container-classroom')) {
              $scope.mediaSubscriberHelper(event);
            } else {
              var _parentElement2 = document.getElementById(event.stream.name + '-participant-tile');

              var _videoContainerEle2 = document.createElement('div');

              _videoContainerEle2.setAttribute('id', event.stream.name + '-ot-subscriber-video-container-classroom');

              _videoContainerEle2.setAttribute('class', 'ot-wrapper');

              if (_parentElement2) {
                _parentElement2.appendChild(_videoContainerEle2);

                $scope.mediaSubscriberHelper(event);
              } else {
                // needs to be removed - try for release 4.4 bugfix
                var elementFinder = setInterval(function () {
                  var desiredSubscriberElement = document.getElementById(event.stream.name + '-ot-subscriber-video-container-classroom');

                  if (desiredSubscriberElement || desiredSubscriberElement !== null) {
                    $scope.mediaSubscriberHelper(event);
                    clearInterval(elementFinder);
                  }
                }, 3000);
              }
            }
          }
        } else {
          if (document.getElementById('ot-subscriber-screen-sharing') === null) {
            var _parentElement3 = document.getElementById(event.stream.name + '-participant-tile');

            var _videoContainerEle3 = document.createElement('div');

            _videoContainerEle3.setAttribute('id', event.stream.name + '-ot-subscriber-video-container-classroom');

            _videoContainerEle3.setAttribute('class', 'ot-wrapper');

            _parentElement3.appendChild(_videoContainerEle3);
          }

          var subscriberScreenSharingElement = document.getElementById('ot-subscriber-screen-sharing');
          $scope.setSubscriber(event.stream, subscriberScreenSharingElement);
        }
      },
      streamDestroyed: function streamDestroyed(event) {
        // var subscribers = $scope.session.getSubscribersForStream(event.stream);
        $scope.session.unsubscribe(event.stream);
      }
    });

    $scope.mediaSubscriberHelper = function (event) {
      var subscriberReplacementElementId;

      if ($scope.currentUser.role !== 'teacher' && event.stream.name == $scope.teacher.id) {
        subscriberReplacementElementId = document.getElementById('ot-publisher-video-container-classroom');
        $scope.setSubscriber(event.stream, subscriberReplacementElementId);
      } else {
        subscriberReplacementElementId = document.getElementById(event.stream.name + '-ot-subscriber-video-container-classroom');
        $scope.setSubscriber(event.stream, subscriberReplacementElementId);
      }
    };

    $scope.session.connect(Users.current.otToken, function (error) {
      if (error) {
        console.log(error);
      }

      if ($scope.session.capabilities.publish == 1) {
        $scope.session.publish($scope.publisher);
      } else {
        console.log('You cannot publish an audio-video stream.');
      }
    });
    $scope.session.on('signal:textChat', function (event) {
      captureData(event, event.data);
    });
  }

  $scope.$on('$destroy', function () {
    // clean the interval.
    if (intervalToCheckDevices) {
      $interval.cancel(intervalToCheckDevices);
    }
  });

  window.onbeforeunload = function () {
    // handle the exit event
    $scope.ZoomService.destroyClient(function () {
      console.log('inside inside');
    });
  };
}]);
//# sourceMappingURL=classroom.controller.js.map

"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

DC.controller('reportsCtrl', ['$scope', 'reportService', 'sessionReports', 'timeDelayService', 'RTC_PROVIDER', function ($scope, reportService, sessionReports, timeDelayService, RTC_PROVIDER) {
  $scope.totalPages = reportService.getTotalPages(sessionReports.totalRecords);
  $scope.timeDelayService = timeDelayService;

  if (sessionReports) {
    modifySessionDataForView(sessionReports);
  }

  function modifySessionDataForView(sessionReports) {
    if (sessionReports.activityList) {
      sessionReports.activityList.forEach(function (session) {
        session.showDetails = false;
        session.date = moment(parseInt(session.date)).format('DD-MM-YYYY');
        session.participants = _toConsumableArray(session.dcAppData.students);
        session.participants.unshift(session.dcAppData.teacher);
        var startTime = session.dcAppData.session.startTime,
            endTime = moment(session.dcAppData.session.startTime).add(session.dcAppData.session.slot, 'minutes').valueOf(); // might need for later reference!
        // session.slot = {
        // 	from : `${new Date(session.dcAppData.session.startTime).getHours()}:${new Date(session.dcAppData.session.startTime).getMinutes()}`,
        // 	to: `${new Date(endTime).getHours()}:${new Date(endTime).getMinutes()}`
        // };

        session.slot = {
          from: "".concat(moment(session.dcAppData.session.startTime).format('HH:mm')),
          to: "".concat(moment(endTime).format('HH:mm'))
        };

        if (session.participants.length > 0) {
          session.participants.forEach(function (participant) {
            if (participant.loginDetails) {
              participant.totalIdleAndActivePeriod = [];
              var logs = participant.loginDetails.length > 0 ? participant.loginDetails.filter(function (participant) {
                return participant.loggedOutTime;
              }) : [];

              if (logs.length > 0) {
                for (var i = 0; i < logs.length; i++) {
                  if (logs[i].loggedInTime && logs[i].loggedOutTime) {
                    if (logs[i].loggedOutTime - startTime < 0) {
                      console.log('Joined the session early and disappeared before the session starts');
                    } else {
                      if (logs[i].loggedInTime - startTime < 0) {
                        logs[i].loggedInTime = startTime;
                      }

                      var prevLogoutTime = i > 0 ? logs[i - 1].loggedOutTime : startTime;

                      if (prevLogoutTime) {
                        var late = getTimeDifference(prevLogoutTime, logs[i].loggedInTime, session.duration);
                        late.status = 'inactive';
                        participant.totalIdleAndActivePeriod.push(late);
                      }

                      var activeTime = getTimeDifference(logs[i].loggedInTime, logs[i].loggedOutTime, session.duration);
                      activeTime.status = 'active';
                      participant.totalIdleAndActivePeriod.push(activeTime);

                      if (i == logs.length - 1) {
                        if (logs[i].loggedOutTime !== endTime) {
                          var endLagTime = getTimeDifference(logs[i].loggedOutTime, endTime, session.duration);
                          endLagTime.status = 'inactive';
                          participant.totalIdleAndActivePeriod.push(endLagTime);
                        }
                      }
                    }
                  } else {
                    // This is likely to happen when a user continuous refreshes the page before the page gets loaded for the previous refresh
                    console.log('Either Loggin or Logged Out time is missing');
                  }
                }
              }
            }
          });
        }
      });
      $scope.showLoader = false;
      $scope.sessionList = sessionReports.activityList;
    } else {
      $scope.sessionList = [];
    }

    $scope.totalPages = reportService.getTotalPages(sessionReports.totalRecords);
  }

  function getTimeDifference(fromTime, toTime, duration) {
    var start = new Date(fromTime);
    var end = new Date(toTime);
    var diffMs = end - start; // var diffDays = Math.ceil(diffMs / 86400000);
    // for 120/45/60/30 minutes session
    // var diffHrs = Math.ceil((diffMs % 86400000) / (duration * 60000));

    var diffMins = Math.ceil(diffMs % 86400000 % (duration * 60000) / 60000); // var diffSeconds = Math.ceil((((diffMs % 86400000) % (duration * 60000)) % 60000) / 60000);

    var timeDuration = {
      diffMs: diffMs,
      duration: diffMins,
      durationCalculatedForHundred: Math.round(diffMins * 100 / duration)
    };
    var actualTime = getTimePeriod(fromTime, toTime);

    var calculatedTimeAndDuration = _objectSpread(_objectSpread({}, timeDuration), actualTime);

    return calculatedTimeAndDuration;
  }

  function getTimePeriod(from, to) {
    return {
      fromTime: "".concat(moment(from).format('HH:mm:ss')),
      toTime: "".concat(moment(to).format('HH:mm:ss')),
      period: "".concat(moment(from).format('HH:mm:ss'), " - ").concat(moment(to).format('HH:mm:ss'))
    };
  }

  $scope.currentPage = window.sessionStorage.getItem('lastViewedLogPage') ? window.sessionStorage.getItem('lastViewedLogPage') : 1;

  if ($scope.currentPage) {
    window.sessionStorage.setItem('lastViewedLogPage', $scope.currentPage);
  }

  $scope.filterSessionDetailsBasedOnPage = function (currentPage) {
    $scope.showLoader = true;
    $scope.selectedSessionRecord.index = null;

    if (!$scope.searchString || $scope.searchString.length <= 0) {
      reportService.getAllReports(currentPage).then(function (response) {
        if (response) {
          $scope.showLoader = false;
          modifySessionDataForView(response);
        }
      }, function (error) {
        console.log('err', error);
      });
    } else {
      reportService.getSessionReportSearchData($scope.searchString, currentPage).then(function (data) {
        modifySessionDataForView(data);
      }, function (error) {
        console.log(error);
      });
    }
  };

  $scope.goToPrevPage = function () {
    if ($scope.currentPage <= 1) {
      return false;
    }

    $scope.currentPage--;
    window.sessionStorage.setItem('lastViewedLogPage', $scope.currentPage);

    if ($scope.currentPage > 0) {
      $scope.filterSessionDetailsBasedOnPage($scope.currentPage);
    } else {
      $scope.sessionList = [];
    }
  };

  $scope.goToNextPage = function () {
    if ($scope.currentPage >= sessionReports.totalRecords) {
      return false;
    }

    $scope.currentPage++;
    window.sessionStorage.setItem('lastViewedLogPage', $scope.currentPage);
    $scope.filterSessionDetailsBasedOnPage($scope.currentPage);
  };

  $scope.goToLastPage = function () {
    $scope.currentPage = $scope.totalPages;
    window.sessionStorage.setItem('lastViewedLogPage', $scope.currentPage);
    $scope.filterSessionDetailsBasedOnPage($scope.currentPage);
  };

  $scope.goToFirstPage = function () {
    $scope.currentPage = 1;
    window.sessionStorage.setItem('lastViewedLogPage', $scope.currentPage);
    $scope.filterSessionDetailsBasedOnPage($scope.currentPage);
  };

  function goToPageNo() {
    var totalPages = Math.ceil(sessionReports.totalRecords / 10);

    if ($scope.currentPage > totalPages) {
      $scope.currentPage = totalPages;
      window.sessionStorage.setItem('lastViewedLogPage', $scope.currentPage);
      $scope.filterSessionDetailsBasedOnPage($scope.currentPage);
    } else {
      if ($scope.currentPage > 0) {
        $scope.filterSessionDetailsBasedOnPage($scope.currentPage);
        window.sessionStorage.setItem('lastViewedLogPage', $scope.currentPage);
      } else {
        $scope.sessionList = [];
      }
    } // need to check the replacement for this


    $scope.$apply();
  }

  $scope.getPageNo = timeDelayService.debounce(300, goToPageNo);
  $scope.searchString = null;
  $scope.selectedSessionRecord = {
    index: null,
    participantIndex: null
  };

  function searchData() {
    $scope.currentPage = 1;
    $scope.$apply();

    if ($scope.searchString.length > 0) {
      reportService.getSessionReportSearchData($scope.searchString).then(function (data) {
        modifySessionDataForView(data);
      });
    } else {
      reportService.getAllReports().then(function (data) {
        modifySessionDataForView(data);
      });
    }
  }

  $scope.searchSession = timeDelayService.debounce(650, searchData);

  function notifyTextCopied(element) {
    element.style.visibility = 'visible'; // $scope.showCopiedNotification = true;

    setTimeout(function () {
      element.style.visibility = 'hidden';
    }, 1000);
  }

  $scope.copyOTsessionid = function (event) {
    var elemValue = event.target.nextElementSibling.innerText;
    var notifyingElement = document.querySelector('.copied-notification');
    copyTextToClipboard(elemValue);
    notifyTextCopied(notifyingElement);
    event.stopPropagation();
  };

  function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea"); // Place in top-left corner of screen regardless of scroll position.

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0; // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.

    textArea.style.width = '2em';
    textArea.style.height = '2em'; // We don't need padding, reducing the size if it does flash render.

    textArea.style.padding = 0; // Clean up any borders.

    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none'; // Avoid flash of white box if rendered for any reason.

    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log(err);
    }

    document.body.removeChild(textArea);
  }

  $scope.getSessionDetails = function (index, session) {
    if (index === $scope.selectedSessionRecord.index) {
      $scope.selectedSessionRecord.index = null;
    } else {
      $scope.selectedSessionRecord.index = index;
    }
  };

  $scope.showAllLoginDevice = function (index, participant) {
    if (index === $scope.selectedSessionRecord.participantIndex) {
      $scope.selectedSessionRecord.participantIndex = null;
    } else {
      $scope.selectedSessionRecord.participantIndex = index;
    } // should modify the above code to handle the device toggling option as collapsible. (Now it is expandable)


    if (participant.deviceLimitToShow > 1) {
      participant.deviceLimitToShow = 1;
    } else {
      participant.deviceLimitToShow = participant.loginDetails.length;
    }
  };

  $scope.getTeacherInfomation = function ($event, session) {
    reportService.getTeacherInfomation(session.id, session.dcAppData.teacher.id).then(function (data) {
      $scope.teacherInfo = data;
    });
    $event.stopPropagation();
    $scope.showCanvas = true;
  };

  $scope.getProviderName = function (sessionDetails, providerId) {
    if (providerId === RTC_PROVIDER.enablex) {
      return 'Enablex';
    } else if (providerId === RTC_PROVIDER.opentok || sessionDetails.otSessionId) {
      return 'Opentok';
    } else {
      return '';
    }
  };

  $scope.getProviderId = function (sessionDetails, providerId) {
    if (providerId === RTC_PROVIDER.enablex) {
      return sessionDetails[providerId].roomId;
    } else if (providerId === RTC_PROVIDER.opentok || sessionDetails.otSessionId) {
      return sessionDetails[providerId] && sessionDetails[providerId].otSessionId || sessionDetails.otSessionId || '';
    } else {
      return '';
    }
  };
}]);
//# sourceMappingURL=dc-reports.controller.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DiagnosticsController = /*#__PURE__*/function () {
  function DiagnosticsController($scope, $state, $timeout, $interval, $location, $storage, $rootScope, $exchange, Auth, Analytics, platformService, userService, fetchDump, ActiveDevices, NavigatorMediaDevices, RTC_PROVIDER, BrowserService, EnablexService, loggerService) {
    var _this = this;

    _classCallCheck(this, DiagnosticsController);

    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$interval = $interval;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.OT = OT;
    this.isDeviceReady = false;
    this.Auth = Auth;
    this.Analytics = Analytics;
    this.$storage = $storage;
    this.platformService = platformService;
    this.userService = userService;
    this.fetchDump = fetchDump;
    this.$exchange = $exchange;
    this.ActiveDevices = ActiveDevices;
    this.activeAudioDevice = '';
    this.activeVideoDevice = '';
    this.movingAvg = null;
    this.showDiagnosticsPopup = false;
    this.intervalToCheckDevices = null;
    this.publisherInitialized = false;
    this.deviceErrorNotification = false;
    this.NavigatorMediaDevices = NavigatorMediaDevices;
    this.isChinaApp = window.document.domain === 'wallstreetenglish.com.cn';
    this.BrowserService = BrowserService;
    this.EnablexService = EnablexService;
    this.loggerService = loggerService;
    this.isRoomUserCountApiLoading = false;
    this.isRoomCountApiError = false;
    /**
     * Used to disable the continue button if number of joined students exceeds 8.
     */

    this.isTotalStudentLimitReached = false;
    this.isVideoElementLoaded = false;
    this.RTC_PROVIDER = RTC_PROVIDER;
    this.enablexStream = null;
    var userAgent = navigator.userAgent;
    this.appData = fetchDump.data.data.dcAppData; // Extract the app data from dump
    // to show the url when permission is denied

    this.currentUrl = "".concat(this.$location.$$protocol, "://").concat(this.$location.$$host);
    this.currentBrowser = this.BrowserService.getName();
    /**
     * the local video from the web api is streamed when the dom is loaded
     */

    this.$scope.$on('local-stream-player:ready', function () {
      _this.isVideoElementLoaded = true;

      if (_this.enablexStream) {
        _this.playLocalVideo();
      }
    });

    if (userAgent.indexOf("iPhone") == -1 && userAgent.indexOf("iPad") == -1 && userAgent.indexOf("Android") == -1) {
      this.getAvailableDevicesList();
    }

    var sessionData = Auth.getData();
    var qsToken = this.$storage.getItem('quickslotSession');
    this.diagnosticsPage = 'compatibility';
    this.currentView = {
      view: ''
    };
    this.ahref = '';
    this.callbackUrl = sessionData.callbackUrl || window.lsUrl;
    this.startTime = fetchDump.data.data.dcAppData.session.startTime;
    this.access_token = sessionData && sessionData.userToken ? sessionData.userToken : qsToken ? qsToken : '';
    this.appDetected = false; // Flag, app is running in another tab

    this.isPrimaryTab = false; // Marks the tab as primary

    this.primaryTabId = null; // Hold the id of the primary tab
    // Create a common collection for all users

    this.participants = this.appData.students;
    this.participants.push(this.appData.teacher);
    userService.initUsers(this.participants); // Updating user data

    this.user = userService.getCurrentUser();
    this.browser = platformService.getBrowserInfo().name; // Get the browser name for custom browser specific handling

    this.disableContinue = true; // Disable the continue button by default

    this.publisher = {}; //Opentok publisher

    this.sessionConnected = false; // Flag to hold session connected status

    this.showAvatar = false; // Flag to decide whether to show avatar
    // TOGGLE Controls

    this.toggleMicOptions = false;
    this.toggleCameraOptions = false;
    this.toggleQualityOptions = false; // RESOLUTION

    this.resMsg = ''; // Message for resolution change

    this.resTimer = null; // Holds the timer promise

    this.eventListeners();
    this.checkOS();
    /**
     * Used to call the navigator.getUserMedia only once
     * and to stop the interval get devices to call getUserMedia (GUM).
     */

    this.isFirstTimeElapsed = false;
    /**
     * Used in firefox for not to invoke GUM, when the browser is awaiting for the USER response (Allow or Block)
     */

    this.isPermissionAsked = false;
    /**
     * Used for chrome and other unknown browsers where the GUM is called once
     * immediately after the permission is given.
     * Usage - set to true when the permission is blocked and set to false when the permission is given.
     */

    this.isPreviousPermissionStatusDenied = false;
    /**
     * Used to check whether the room is full, i.e the users count is >= 8.
     */

    this.isRoomFull = false;
    this.$rootScope.$on('devices-ready', function () {
      _this.isDeviceReady = true;
    });
    this.publisherProperties = {
      name: null,
      audioSource: null,
      videoSource: null,
      width: '100%',
      height: '100%',
      fitMode: 'cover',
      insertMode: 'replace',
      showControls: false,
      style: {
        backgroundImageURI: 'off',
        // nameDisplayMode: 'off',
        // buttonDisplayMode: 'off',
        videoDisabledDisplayMode: 'off'
      },
      mirror: true // Avoiding mirror of video

    };
    this.publisher = null;
  } // Check for the OS compatibility


  _createClass(DiagnosticsController, [{
    key: "checkOS",
    value: function checkOS() {
      //console.log('Checking OS compatibility..');
      var userAgent = navigator.userAgent;

      if (!this.platformService.checkOSCompatibility()) {
        //console.log('OS check failed');
        this.diagnosticsPage = 'os-incompatible';
      } else if (userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0) {
        // To support css design to adapt mobile view
        this.currentView.view = "mobile"; // Switch condition to display iOS app store icon

        var host = window.location.protocol + '//' + window.location.host;
        var storeUrl = this.isChinaApp ? 'https://itunes.apple.com/us/app/wse-digital-classroom-china/id1239330133?mt=8' : 'https://itunes.apple.com/us/app/wse-digital-classroom/id1435467751';
        var iphoneAppUrl = "".concat(host, "/autologin?activityId=").concat(this.fetchDump.data.data.id, "&authorization=").concat(this.access_token, "&userId=").concat(this.$rootScope.userId, "&callbackUrl=").concat(host, "&createdBy=qs");
        var iphoneUrlSchema = this.isChinaApp ? 'dcapp:://' + iphoneAppUrl : 'dcapprow:://' + iphoneAppUrl;
        this.$timeout(function () {
          window.location = storeUrl;
        }, 750);
        window.location = iphoneUrlSchema;
        return;
      } else if (userAgent.indexOf("Android") >= 0) {
        // To support css design to adapt mobile view
        this.currentView.view = "mobile";

        var _host = window.location.protocol + '//' + window.location.host;

        this.ahref = "intent:#Intent;scheme=digitalclassroom-wallstreetenglish://open?userId=".concat(this.$rootScope.userId, "&activityId=").concat(this.fetchDump.data.data.id, "&authorization=").concat(this.access_token, "&type=android;S.browser_fallback_url=").concat(_host, "/androidstoreredirect;end"); // Switch condition to display android app

        this.diagnosticsPage = 'Android';
      } else {
        //console.log('OS check passed');
        // Start the browser check
        this.checkBrowser();
      }
    }
  }, {
    key: "checkBrowser",
    value: // Check for the Browser compatibility
    function checkBrowser() {
      //console.log('Checking Browser compatibility..');
      if (!this.platformService.checkBrowserCompatibility()) {
        //console.log('Browser check failed');
        this.diagnosticsPage = 'browser-incompatible';
      } else {
        //console.log('Browser check passed');
        this.checkTabs();
      }
    }
  }, {
    key: "checkTabs",
    value: // ------------------------------------
    // CROSSTAB EVENTS
    // ------------------------------------
    // -> TAB-CHECK		[Checks for other open tabs]
    // -> TAB-DETECTED	[Notifies if tab is detected]
    // -> TAB-SWITCH	[Switches to the active tab]
    // -> TAB-CLOSED	[Notifies that tab is closed]
    // -> TAB-PRIMARY	[Notifies that primary tab]
    // ------------------------------------
    function checkTabs() {
      var _this2 = this;

      try {
        // Check crosstab is supported or not, then initialize the crosstab commn
        if (window.crosstab) {
          // Settings a callback state to wait for crosstabs setup to complete
          crosstab(function () {
            if (crosstab.supported) {
              // Crosstabs is supported
              // Proceeding with the tab checks
              _this2.initTabComm(); // Start the tab comm.

            } else {
              // Crosstabs is not supported
              // So we just continue to diagnostics setting handled
              // [TODO] Technology blocker - Need to look for alternative
              // Set that cross tabs are handled
              _this2.Auth.setCrossTabsHandled(); // If user is already diagnosed, go to classroom


              if (_this2.Auth.isDiagnosed()) {
                _this2.$state.go('classroom');
              } else {
                // Launch the device check
                _this2.connectOpentok(); // Start validating time


                _this2.validateTime();
              }
            }
          });
        } else {
          //console.log('[CROSSTABS] Crosstab library not loaded. Check with Developers.');
          this.diagnosticsPage = 'browser-incompatible';
        }
      } catch (err) {
        console.log('[CROSSTAB] Error: ' + err);
      }
    }
  }, {
    key: "initTabComm",
    value: function initTabComm() {
      var _this3 = this;

      //console.log('[CROSSTABS] Broadcasting <<new-tab-connected>> event');
      // BROADCAST NEW TAB EVENT
      crosstab.broadcast('TAB-CHECK', {
        tabId: crosstab.id
      }); // CHECK FOR ANY NEW TAB OPENED

      crosstab.on('TAB-CHECK', this.tabCheckHandler.bind(this)); // CHECK IF ALREADY SOME TAB IS OPEN

      crosstab.on('TAB-DETECTED', this.tabDetectedHandler.bind(this));
      crosstab.on('TAB-PRIMARY', this.tabPrimaryHandler.bind(this)); // Wait for one second and see if there is another tab already open

      this.$timeout(function () {
        _this3.validateTabs();
      }, 1000);
    }
  }, {
    key: "tabCheckHandler",
    value: // Handles the tab check and responds that a tab is detected
    function tabCheckHandler(msg) {
      //console.log('[CROSSTABS] Another tab is detected');
      crosstab.broadcast('TAB-DETECTED', {
        tabId: crosstab.id
      }, msg.data.tabId);
    }
  }, {
    key: "tabDetectedHandler",
    value: function tabDetectedHandler(msg) {
      //console.log('[CROSSTABS] Application already running in another tab');
      this.appDetected = true;
      this.primaryTabId = msg.data.tabId;
    }
  }, {
    key: "tabSwitchHandler",
    value: function tabSwitchHandler() {
      if (this.isPrimaryTab) {
        this.showAlertModal = true;
        this.$rootScope.$emit('showAlertModal', true);
      }
    }
  }, {
    key: "tabPrimaryHandler",
    value: function tabPrimaryHandler(msg) {
      this.primaryTabId = msg.data.tabId;
    }
  }, {
    key: "launchActiveTab",
    value: // Launches the active tab running the application
    function launchActiveTab() {
      //console.log('[CROSSTABS] Switching to active tab..');
      this.isPrimaryTab = false; // Check if a primary tab exists else refresh the current page or join into class

      if (this.primaryTabId) {
        crosstab.broadcast('TAB-SWITCH', {
          tabId: crosstab.id
        });
      } else {
        // Make current tab primary and join the class
        this.appDetected = false;
        crosstab.on('TAB-CHECK', this.tabCheckHandler);
        crosstab.on('TAB-DETECTED', this.tabDetectedHandler);
        this.validateTabs();
      }
    }
  }, {
    key: "validateTabs",
    value: function validateTabs() {
      // If app is already running block the current tab
      if (this.appDetected) {
        this.diagnosticsPage = 'cross-tabs';
        this.isPrimaryTab = false; // Unset the crosstab listeners

        crosstab.off('TAB-CHECK', this.tabCheckHandler);
        crosstab.off('TAB-DETECTED', this.tabDetectedHandler);

        if (this.primaryTabId) {
          crosstab.broadcast('TAB-SWITCH', {
            tabId: crosstab.id
          });
        }
      } else {
        this.isPrimaryTab = true;
        this.primaryTabId = crosstab.id;
        crosstab.broadcast('TAB-PRIMARY', {
          tabId: crosstab.id
        });
        crosstab.on('TAB-SWITCH', this.tabSwitchHandler.bind(this)); // Set that cross tabs are handled

        this.Auth.setCrossTabsHandled(); // If user is already diagnosed, go to classroom

        if (this.Auth.isDiagnosed()) {
          this.$state.go('classroom');
        } else {
          // Launch the device check
          this.connectOpentok(); // Start validating time

          this.validateTime();
        }
      }
    }
  }, {
    key: "formatSeconds",
    value: //==============================================================================
    // SESSION TIMER - Session timer validation block
    //==============================================================================
    // Function to format seconds into mm:ss
    function formatSeconds(seconds) {
      var date = new Date(1970, 0, 1);
      date.setSeconds(seconds);
      return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
    }
  }, {
    key: "validateTime",
    value: // Validate the session start time and makes the user to wait till the session is started.
    function validateTime() {
      var _this4 = this;

      this.waitSeconds = this.fetchDump.data.data.dcAppData.session.waitTime; // Send the user into class since session is started.

      if (this.waitSeconds <= 0 || this.waitSeconds <= 300 && this.user.role == "teacher" || this.waitSeconds <= 60 && this.user.role == "student") {
        this.disableContinue = false;
        return;
      } else {
        this.remainingTime = this.formatSeconds(this.waitSeconds);
        var stopper = this.$interval(function () {
          _this4.waitSeconds = _this4.waitSeconds - 1;
          _this4.remainingTime = _this4.formatSeconds(_this4.waitSeconds);

          if (_this4.waitSeconds <= 0 || _this4.waitSeconds <= 60 && _this4.user.role == "student") {
            // Cancel the timer
            _this4.$interval.cancel(stopper); // Enable the join button


            _this4.disableContinue = false;
          }
        }, 1000); // Update every second
      }
    }
  }, {
    key: "connectOpentok",
    value: //==============================================================================
    // OPENTOK CONNECTION + DEVICES - Diagnostics code
    //==============================================================================
    // Inits the Opentok service and connects Opentok session
    function connectOpentok() {
      this.diagnosticsPage = 'device-check'; // let opentokData = {
      // 	apiKey: this.appData.session.otKey,
      // 	sessionId: this.appData.session.otSessionId,
      // 	token: this.user.otToken
      // };
      // Initialize the Opentok Service
    }
  }, {
    key: "getAvailableDevicesList",
    value: function getAvailableDevicesList() {
      var _this5 = this;

      var isDiagnosed = this.Auth.isDiagnosed();
      var audioTracks, videoTracks;

      if (!isDiagnosed) {
        if (this.appData.rtcServiceProvider === this.RTC_PROVIDER.zoom) {
          if (this.NavigatorMediaDevices.isMediaDevicesAvailable()) {
            console.log('enumerateDevices() not supported.');
            return;
          }

          this.NavigatorMediaDevices.enumerateDevices(function (inputDevices, audioTracks, videoTracks) {
            _this5.setActiveDevices(inputDevices, audioTracks, videoTracks);
          });
          this.deviceListener = this.$interval(function () {
            _this5.NavigatorMediaDevices.enumerateDevices(function (inputDevices, audioTracks, videoTracks) {
              _this5.setActiveDevices(inputDevices, audioTracks, videoTracks);
              /**
               * If the permission is denied,
               * In chrome deviceId becomes ''
               * In firefox label becomes ''
               */


              var isPermissionDenied = inputDevices.some(function (device) {
                return device.deviceId === '' || device.label == '';
              });
              /**
               * Call this if the permission is denied and call the GetUserMedia (GUM) only once until the user responds.
               * Firefox request the device access for how many times we invoke the GUM function.
               */

              if (isPermissionDenied && _this5.isFirstTimeElapsed) {
                _this5.isPreviousPermissionStatusDenied = true;
                _this5.activeAudioDevice = '';
                _this5.activeVideoDevice = '';

                _this5.$scope.$apply(function () {
                  _this5.deviceErrorNotification = true;
                });
                /**
                 * if it is firefox, the permission is asked once and
                 * in playEnablexStream's finally part, we clear the permission asked status.
                 * in firefox the finally is called after the user responds, but in chrome it throws denied error.
                 * so in the chrome the media stream is get when the permission is re allowed.
                 */


                if (_this5.currentBrowser === 'firefox') {
                  /**
                   * if the permission is asked, we wont call GUM again until the user responds.
                   * isPermissionAsked is cleared in the `finally` of the GUM function.
                   * */
                  !_this5.isPermissionAsked && _this5.playEnablexStream('isFirefoxAndInvokedFirstTimeAfterDenial');
                  _this5.isPermissionAsked = true;
                }
              } else {
                /**
                 * only for chrome, get the stream from navigator media when the permission is reinitialized after blocking.
                 * if an unknown browser is returned, we will go with the chrome's flow
                 */
                if (_this5.isPreviousPermissionStatusDenied && (_this5.currentBrowser == 'chrome' || _this5.currentBrowser == 'safari' || _this5.currentBrowser == 'unknown')) {
                  _this5.playEnablexStream();

                  _this5.isPreviousPermissionStatusDenied = false;
                }

                _this5.deviceErrorNotification = false;
              }
            });
          }, 2000);
        } else {
          this.OT.getUserMedia().then(function (options) {
            audioTracks = options.getAudioTracks();
            videoTracks = options.getVideoTracks();
            _this5.showDiagnosticsPopup = true;
            _this5.intervalToCheckDevices = setInterval(function () {
              _this5.OT.getDevices(function (error, devices) {
                _this5.setActiveDevices(devices, audioTracks, videoTracks);
              });

              if (_this5.publisher) {
                _this5.publisher.on({
                  accessAllowed: function accessAllowed(event) {// console.log('access allowed', event);
                  },
                  accessDenied: function accessDenied(event) {// console.log('access denied', event);
                  },
                  accessDialogOpened: function accessDialogOpened(event) {// console.log('accessDialogOpened', event);
                    // The Allow/Deny dialog box is opened.
                  },
                  accessDialogClosed: function accessDialogClosed(event) {// The Allow/Deny dialog box is closed.
                  },
                  audioLevelUpdated: function audioLevelUpdated(event) {
                    // UI controls for showing audio levels
                    if (_this5.movingAvg === null || _this5.movingAvg <= event.audioLevel) {
                      _this5.movingAvg = event.audioLevel;
                    } else {
                      _this5.movingAvg = 0.7 * _this5.movingAvg + 0.3 * event.audioLevel;
                    } // // 1.5 scaling to map the -30 - 0 dBm range to [0,1]


                    var logLevel = Math.log(_this5.movingAvg) / Math.LN10 / 1.5 + 1;
                    logLevel = Math.min(Math.max(logLevel, 0), 1);

                    _this5.$scope.$apply(function () {
                      _this5.audioValues = {
                        level: logLevel,
                        userId: _this5.user.id
                      };
                    });
                  }
                });
              }
            }, 2000);
          }, function (error) {
            console.log('error');

            if (error) {
              _this5.$scope.$apply(function () {
                _this5.showDiagnosticsPopup = true;
                _this5.deviceErrorNotification = true;
              });
            }
          });
        }
      }
    }
  }, {
    key: "initNewPub",
    value: function initNewPub(activeVideoDevice, activeAudioDevice, audioInputDevices, videoInputDevices) {
      var _this6 = this;

      console.log('init new pub', activeVideoDevice, activeAudioDevice);
      this.$scope.$apply(function () {
        _this6.audioInputDevices = audioInputDevices;
        _this6.videoInputDevices = videoInputDevices;
      });
      this.setOrInitializePublisher();
    }
  }, {
    key: "setOrInitializePublisher",
    value: function setOrInitializePublisher() {
      var _this7 = this;

      console.log('setOrInitializePublisher', this.activeAudioDevice, this.activeVideoDevice);
      this.publisherProperties.audioSource = this.activeAudioDevice.deviceId;
      this.publisherProperties.videoSource = this.activeVideoDevice.deviceId;

      if (document.getElementById('ot-publisher-video-container')) {
        var el = document.querySelector('.camera-preview-video');
        var videoContainerEle = document.createElement('div');
        videoContainerEle.setAttribute('id', 'ot-publisher-video-container');
        videoContainerEle.setAttribute('class', 'ot-wrapper');
        el.appendChild(videoContainerEle);
      }

      this.publisher = this.OT.initPublisher(document.getElementById('ot-publisher-video-container'), this.publisherProperties, function (error) {
        if (error) {
          console.log(error);
        } else {
          _this7.publisherInitialized = true;
        }
      });
    }
  }, {
    key: "toggleDevices",
    value: function toggleDevices(deviceType) {
      if (deviceType === 'mic') {
        this.toggleMicOptions = !this.toggleMicOptions;
        this.toggleCameraOptions = false;
      }

      if (deviceType === 'camera') {
        this.toggleCameraOptions = !this.toggleCameraOptions;
        this.toggleMicOptions = false;
      }

      event.stopPropagation();
    }
  }, {
    key: "diagnosticsWindowClick",
    value: function diagnosticsWindowClick() {
      this.toggleMicOptions = false;
      this.toggleCameraOptions = false;
    }
  }, {
    key: "getSelectedDevice",
    value: function getSelectedDevice(device) {
      var _this8 = this;

      // let opentokData = {
      // 	apiKey: this.appData.session.otKey,
      // 	sessionId: this.appData.session.otSessionId,
      // 	token: this.user.otToken
      // };
      if (device && (device.kind === 'audioInput' || device.kind === 'audioinput')) {
        this.activeAudioDevice = device;
      } else {
        this.activeVideoDevice = device;
      }

      var sources = {
        audio: this.activeAudioDevice.deviceId,
        video: this.activeVideoDevice.deviceId
      };

      if (this.appData.rtcServiceProvider === this.RTC_PROVIDER.zoom) {
        // to stop the cam light and streamed tracks, when the device is changed.
        this.enablexStream.getTracks().forEach(function (track) {
          track.stop();
        });
        this.playEnablexStream();
      } else {
        this.publisher.destroy();
        this.publisherProperties.audioSource = sources.audio;
        this.publisherProperties.videoSource = sources.video;
        var el = document.querySelector('.camera-preview-video');
        var videoContainerEle = document.createElement('div');
        videoContainerEle.setAttribute('id', 'ot-publisher-video-container');
        videoContainerEle.setAttribute('class', 'ot-wrapper');
        el.appendChild(videoContainerEle);
        setTimeout(function () {
          _this8.publisher = _this8.OT.initPublisher(document.getElementById('ot-publisher-video-container'), _this8.publisherProperties, function (error) {
            if (error) {
              console.log(error);
            }
          });
        }, 1000);
      }
    }
  }, {
    key: "closeDeviceSelection",
    value: function closeDeviceSelection() {
      this.toggleMicOptions = false;
      this.toggleCameraOptions = false;
    }
  }, {
    key: "resolutionChanged",
    value: // Handler for resolution changed event
    function resolutionChanged(resolution) {
      var _this9 = this;

      //console.log('Resolution changed to - ' + resolution);
      // Sending the data to Analytics factory to track the events
      this.Analytics.sendEvent(this.Analytics.eventAction().click, this.Analytics.eventCategory().userInteraction, "Change Resolution");
      this.resMsg = "Camera resolution changed to ".concat(resolution, "."); // Cancel if any timeout is set already

      if (this.resTimer) {
        this.$timeout.cancel(this.resTimer);
      }

      this.showResMsg = true;
      this.resTimer = this.$timeout(function () {
        _this9.showResMsg = false;
        _this9.resTimer = null;
      }, 5000);
    }
  }, {
    key: "eventListeners",
    value: function eventListeners() {
      var _this10 = this;

      // SESSION - READY
      this.$rootScope.$on('session-ready', function () {
        _this10.sessionConnected = true; // this.publisher = this.opentokService.getPublisher();
        // Init the device daemon with 5 second frequency
      }); // PUBLISHER - CHANGED
      // this.$rootScope.$on('ot:publisher-changed', () => {
      // 	this.publisher = this.opentokService.getPublisher();
      // });
      //Event to trigger the notification to self when he/she  denies the hardware access permission.

      this.$rootScope.$on('access-denied', function () {
        _this10.user.micAvailable = false;
        _this10.user.camAvailable = false;
      });
    }
  }, {
    key: "joinClass",
    value: // Joins user into the classroom
    function joinClass() {
      clearInterval(this.intervalToCheckDevices);

      if (this.deviceListener) {
        this.$interval.cancel(this.deviceListener);
      }

      this.NavigatorMediaDevices.removeOnDeviceChangeHandler();
      this.Auth.setDiagnosed(true); // If publisher is set, destroy it

      if (this.publisher) {
        // Destroy the publisher object
        this.publisher.destroy();
        this.showAvatar = true; // Show the avatar as the <video> gets removed
      }

      var activeInputDevices = {
        audio: this.activeAudioDevice,
        video: this.activeVideoDevice
      };
      this.ActiveDevices.setInputDevices(activeInputDevices);
      this.disableContinue = true; // disable the continue button once user clicks the button
      // stop the current stream and initiate a new one in classroom

      if (this.enablexStream) {
        this.enablexStream.getTracks().forEach(function (track) {
          track.stop();
        });
      } // Traverse to classroom


      this.$state.go('classroom');
    }
  }, {
    key: "playLocalVideo",
    value:
    /**
     * Play the local stream for the enablex using WEB API.
     */
    function playLocalVideo() {
      // waits for the video element to be loaded in the DOM.
      if (this.isVideoElementLoaded) {
        // Take action after the view has been populated with the updated data
        var videoElement = document.querySelector('video#localVideo');
        videoElement.muted = true;
        videoElement.srcObject = this.enablexStream;
      }

      ;
    }
  }, {
    key: "setActiveDevices",
    value: function setActiveDevices(devices, audioTracks, videoTracks) {
      var _this11 = this;

      var audioInputDevices, videoInputDevices, totalAudioDevices, totalVideoDevices;

      if (audioTracks) {
        audioInputDevices = devices.filter(function (element) {
          return element.kind == "audioInput" || element.kind == "audioinput";
        });

        if (totalAudioDevices !== audioInputDevices.length) {
          totalAudioDevices = audioInputDevices.length;
          this.audioInputDevices = audioInputDevices;
        }
      }

      if (videoTracks) {
        videoInputDevices = devices.filter(function (element) {
          return element.kind == "videoInput" || element.kind == "videoinput";
        });

        if (totalVideoDevices !== videoInputDevices.length) {
          totalVideoDevices = videoInputDevices.length;
          this.videoInputDevices = videoInputDevices;
        }
      }

      if (audioInputDevices.length == 0 && videoInputDevices.length == 0) {
        // console.log('Neither audio or video device found');
        this.publisher = null;
      } else {
        var canSetAudioSource, canSetVideoSource;
        var toggleAudioDevice, toggleVideoDevice;
        canSetAudioSource = canSetVideoSource = false;
        toggleAudioDevice = toggleVideoDevice = false;

        if (audioInputDevices.length > 0) {
          if (this.activeAudioDevice) {
            // does active device currently exists...
            var isAudioDeviceStillActive = audioInputDevices.some(function (device) {
              return device.deviceId === _this11.activeAudioDevice.deviceId;
            });

            if (isAudioDeviceStillActive) {
              // Firefox workaround for showing label when 'remember this decision' is not clicked
              if (this.appData.rtcServiceProvider === this.RTC_PROVIDER.zoom) {
                var selectedActiveDevice = audioInputDevices.filter(function (device) {
                  return device.deviceId === _this11.activeAudioDevice.deviceId;
                });

                if (selectedActiveDevice.length > 0) {
                  this.activeAudioDevice = selectedActiveDevice[0];
                }
              }
            } else {
              toggleAudioDevice = true;
              this.activeAudioDevice = audioInputDevices[0]; // new 0th index audio device is set.
            }
          } else {
            canSetAudioSource = true;
            this.activeAudioDevice = audioInputDevices[0]; // no active device so set 0th audio device
          }
        } else {
          this.activeAudioDevice = '';
          this.deviceErrorNotification = true;
          this.userService.getCurrentUser().micAvailable = false;
        }

        if (videoInputDevices.length > 0) {
          if (this.activeVideoDevice) {
            // does active device currently exists...
            var isVideoDeviceStillActive = videoInputDevices.some(function (device) {
              return device.deviceId === _this11.activeVideoDevice.deviceId;
            });

            if (isVideoDeviceStillActive) {
              // Firefox workaround for showing label when 'remember this decision' is not clicked
              if (this.appData.rtcServiceProvider === this.RTC_PROVIDER.zoom) {
                var _selectedActiveDevice = videoInputDevices.filter(function (device) {
                  return device.deviceId === _this11.activeVideoDevice.deviceId;
                });

                if (_selectedActiveDevice.length > 0) {
                  this.activeVideoDevice = _selectedActiveDevice[0];
                }
              }
            } else {
              toggleVideoDevice = true;
              this.activeVideoDevice = videoInputDevices[0]; // new 0th index audio device is set.
            }
          } else {
            canSetVideoSource = true;
            this.activeVideoDevice = videoInputDevices[0]; // no active device so set 0th audio devie
            // this.setOrInitializePublisher(this.activeAudioDevice, this.videoInputDevices[0]);
          }
        } else {
          // console.log('NO Audio Device');
          this.activeVideoDevice = '';
          this.deviceErrorNotification = true;
          this.userService.getCurrentUser().camAvailable = false;
        } // need to publish


        if (toggleVideoDevice || toggleAudioDevice) {
          if (this.appData.rtcServiceProvider === this.RTC_PROVIDER.opentok) {
            this.initNewPub(this.activeVideoDevice, this.activeAudioDevice, audioInputDevices, videoInputDevices);
          } else if (this.appData.rtcServiceProvider === this.RTC_PROVIDER.zoom) {
            this.playEnablexStream();
          } // console.log('should come here on device toggle');

        } else if (canSetVideoSource || canSetAudioSource) {
          /*first time conditon*/
          // console.log('should come here first time');
          if (this.appData.rtcServiceProvider === this.RTC_PROVIDER.opentok) {
            this.initNewPub(this.activeVideoDevice, this.activeAudioDevice, audioInputDevices, videoInputDevices);
          } else if (this.appData.rtcServiceProvider === this.RTC_PROVIDER.zoom) {
            /**
             * Wont call playEnablexStream after the first time from here.
             */
            !this.isFirstTimeElapsed && this.playEnablexStream('isFirstTime');
          }
        } else {// do nothing
          // console.log('should come here many times');
        }
      }
    }
    /**
     * Play the enablex stream in the container using the active device both audio and video.
     */

  }, {
    key: "playEnablexStream",
    value: function playEnablexStream(functionCallSource) {
      var _this12 = this;

      var sources = {
        audio: this.activeAudioDevice.deviceId,
        video: this.activeVideoDevice.deviceId
      };
      var constraints = {
        audio: {
          deviceId: sources.audio ? {
            exact: sources.audio
          } : true
        },
        video: {
          deviceId: sources.video ? {
            exact: sources.video
          } : true
        }
      }; // when the device is changed new stream is initiated with device Id and played that stream

      this.NavigatorMediaDevices.getUserMedia(constraints).then(function (stream) {
        // Enablex Diagnostics is run only for the students and for chrome browser
        if (_this12.user.role == "student") {
          // Number of users in the room is checked twice,
          // one before precall api and another after clicking continue button
          // First time the users in room is checked from the dcAppData
          _this12.isRoomFull = _this12.checkIsRoomFull();

          if (_this12.isRoomFull) {
            _this12.isTotalStudentLimitReached = true;
          }
        }

        _this12.enablexStream = stream;
        _this12.showDiagnosticsPopup = true;

        _this12.playLocalVideo();
      })["catch"](function (err) {
        /* permission denied */
        _this12.loggerService.error('Navigator Media Error', {
          err: err.toString(),
          role: _this12.user.role,
          id: _this12.user.id
        });

        _this12.$scope.$apply(function () {
          _this12.showDiagnosticsPopup = true;
          _this12.deviceErrorNotification = true;
        });
      })["finally"](function () {
        if (functionCallSource == 'isFirstTime') {
          _this12.isFirstTimeElapsed = true;
        } else if (functionCallSource == 'isFirefoxAndInvokedFirstTimeAfterDenial') {
          _this12.isPermissionAsked = false;
        }
      });
    }
  }, {
    key: "checkIsRoomFull",
    value: function checkIsRoomFull() {
      var _this13 = this;

      var participants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.appData.students;
      var joinedStudents = participants.filter(function (participant) {
        return participant.joined && participant.role === 'student';
      });
      var isAlreadyJoinedStudent = joinedStudents.findIndex(function (participant) {
        return participant.id === _this13.user.id;
      }) > -1; // returns false for the room full when the current user is already joined the class and came back.

      if (isAlreadyJoinedStudent) {
        return false;
      } // returns true if the joinedStudents count is greater than or equal to 8.


      return joinedStudents.length >= 8;
    }
  }, {
    key: "isContinueDisabledEnablex",
    value: function isContinueDisabledEnablex() {
      if (this.user.role == "teacher") {
        return this.deviceErrorNotification;
      } else {
        return this.deviceErrorNotification || this.isTotalStudentLimitReached || this.isRoomUserCountApiLoading;
      }
    }
  }, {
    key: "preCheckBeforeJoiningClass",
    value: function preCheckBeforeJoiningClass() {
      var _this14 = this;

      // For students alone the users in the room is checked for availability and
      // on success the class is joined
      if (this.appData.rtcServiceProvider === this.RTC_PROVIDER.zoom && this.user.role == "student") {
        this.isRoomUserCountApiLoading = true;
        this.userService.getUpdatedUserList().then(function (participants) {
          _this14.isRoomUserCountApiLoading = false;
          _this14.isRoomFull = _this14.checkIsRoomFull(participants);

          if (_this14.isRoomFull) {
            return _this14.isTotalStudentLimitReached = true;
          } else {
            _this14.joinClass();
          }
        }, function (error) {
          _this14.isRoomCountApiError = true;

          _this14.loggerService.error('Room Full API Error Rejected', {
            error: error,
            role: _this14.user.role,
            id: _this14.user.id
          });
        });
      } else {
        this.joinClass();
      }
    }
  }]);

  return DiagnosticsController;
}();

DC.controller('DiagnosticsController', ['$scope', '$state', '$timeout', '$interval', '$location', '$storage', '$rootScope', '$exchange', 'Auth', 'Analytics', 'platformService', 'userService', 'fetchDump', 'ActiveDevices', 'NavigatorMediaDevices', 'RTC_PROVIDER', 'BrowserService', 'EnablexService', 'loggerService', function ($scope, $state, $timeout, $interval, $location, $storage, $rootScope, $exchange, Auth, Analytics, platformService, userService, fetchDump, ActiveDevices, NavigatorMediaDevices, RTC_PROVIDER, BrowserService, EnablexService, loggerService) {
  return new DiagnosticsController($scope, $state, $timeout, $interval, $location, $storage, $rootScope, $exchange, Auth, Analytics, platformService, userService, fetchDump, ActiveDevices, NavigatorMediaDevices, RTC_PROVIDER, BrowserService, EnablexService, loggerService);
}]);
//# sourceMappingURL=diagnostics.controller.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ExpelCtrl = /*#__PURE__*/function () {
  function ExpelCtrl($timeout, $location, Auth) {
    _classCallCheck(this, ExpelCtrl);

    this.$timeout = $timeout;
    this.$location = $location;
    this.sessionData = Auth.getData();
    this.callbackUrl = null;
    this.expelUser();
  }

  _createClass(ExpelCtrl, [{
    key: "expelUser",
    value: function expelUser() {
      var _this = this;

      this.callbackUrl = this.$location.search().callbackUrl ? this.$location.search().callbackUrl : this.sessionData.callbackUrl;

      if (this.callbackUrl) {
        // Redirect to CallbackUrl
        if (this.sessionData.createdBy !== 'qs') {
          this.$timeout(function () {
            window.location.href = _this.callbackUrl;
          }, 5000);
        }
      }
    }
  }]);

  return ExpelCtrl;
}();

DC.controller('ExpelCtrl', ['$timeout', '$location', 'Auth', function ($timeout, $location, Auth) {
  return new ExpelCtrl($timeout, $location, Auth);
}]);
//# sourceMappingURL=expel.controller.js.map

"use strict";

DC.controller('feedbackCtrl', ['$scope', 'userService', function ($scope, Users) {
  try {
    var callbackUrl = Users.getCallBackUrl(); // To get the CallBackUrl

    $scope.currentUser = Users.getCurrentUser().firstName + " " + Users.getCurrentUser().lastName; // To render the User's name in the feedback page.

    $scope.teacher = Users.getTeacher().firstName + " " + Users.getTeacher().lastName; // To render the Teacher's name in the feedback page.

    $scope.currentActivityId = Users.getCurrentActivityId(); // To render the current activity Id.

    $scope.feedback = {
      qa: [// Set of questions provided by LS for survey (For now static)
      {
        q: "How was the teacher?",
        // Question
        a: 0,
        // Answer
        index: 1
      }, {
        q: "Was the class fun?",
        a: 0,
        index: 2
      }, {
        q: "Were the exercises easy to understand?",
        a: 0,
        index: 3
      }, {
        q: "Did you get enough time to speak in the class?",
        a: 0,
        index: 4
      }, {
        q: " Did the teacher correct you?",
        a: 0,
        index: 5
      }, {
        q: "Was the teacher's feedback helpful?",
        a: 0,
        index: 6
      }]
    };
    $scope.highlightStarIndex = 0; // Stores the index of the highlighted star

    $scope.highlightQuestionIndex = 0;
  } catch (err) {
    window.location.href = window.lsUrl;
    console.log('Error: ' + err);
  }
  /**
   * This will highlight the stars of a question when user hovers over the star
   * @param  {Number} questionIndex The index of the question
   * @param  {Number} starIndex     The index of the answer
   */


  $scope.highlightStar = function (questionIndex, starIndex) {
    try {
      // Store the data to render in the view
      $scope.highlightStarIndex = starIndex;
      $scope.highlightQuestionIndex = questionIndex;
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * This will set the stars to the default state.
   */


  $scope.unhighlightStar = function () {
    try {
      $scope.highlightStarIndex = 0;
      $scope.highlightQuestionIndex = 0;
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * This will give the index of the selected stars
   * @param  {Number} questionIndex The index of the question
   * @param  {Number} starIndex     The index of the answer
   */


  $scope.selectStar = function (questionIndex, starIndex) {
    try {
      // Update the selected star to the QA feedback data object
      $scope.feedback.qa[questionIndex - 1].a = starIndex;
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * This submit function currently redirect the user to the Thanks page.
   * [TODO]- Write the code to save the given feedback data.
   */


  $scope.submitFeedback = function () {
    try {
      if (callbackUrl) {
        // Redirect to thanks page
        window.location = '/thanks?callbackUrl=' + callbackUrl;
      } else {
        // Redirect to home page
        window.location = '/';
      }
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
}]);
//# sourceMappingURL=feedback.controller.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LogoutCtrl = /*#__PURE__*/function () {
  function LogoutCtrl(Auth) {
    _classCallCheck(this, LogoutCtrl);

    this.sessionData = Auth.getData(); //get the local storage or session storage data from the browser

    this.callbackUrl = this.sessionData.callbackUrl;
    this.init();
  }

  _createClass(LogoutCtrl, [{
    key: "init",
    value: function init() {
      if (this.callbackUrl) {
        window.location = '/thanks?callbackUrl=' + this.callbackUrl;
      } else {
        window.location = '/';
      }
    }
  }]);

  return LogoutCtrl;
}();

DC.controller('LogoutCtrl', [// Dependencies
'Auth', function (Auth) {
  return new LogoutCtrl(Auth);
}]);
//# sourceMappingURL=logout.controller.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OnlineMaterialListController = /*#__PURE__*/function () {
  function OnlineMaterialListController(Auth, $scope, $window, $location, $timeout, $http, $state, onlineMaterialService, timeDelayService) {
    var _this = this;

    _classCallCheck(this, OnlineMaterialListController);

    this.$location = $location;
    this.Auth = Auth;
    this.$window = $window;
    this.$location = $location;
    this.$timeout = $timeout;
    this.$http = $http;
    this.offset = 1;
    this.$state = $state;
    this.searchValue = null;
    this.onlineMaterialService = onlineMaterialService;
    this.timeDelayService = timeDelayService;
    this.noResultsFound = false;
    this.onlineClassTypes = [{
      id: 1,
      name: 'Online Encounter',
      value: 'online_encounter',
      selected: false
    }, {
      id: 2,
      name: 'Live Class',
      value: 'live_class',
      selected: false
    }, {
      id: 3,
      name: 'Channel Class',
      value: 'channel_class',
      selected: false
    }, {
      id: 4,
      name: 'Online Complementary Class',
      value: 'online_complementary_class',
      selected: false
    }, {
      id: 5,
      name: 'Online Social Club',
      value: 'online_social_club',
      selected: false
    }, {
      id: 6,
      name: 'Online L1+',
      value: 'online_l1plus',
      selected: false
    }, {
      id: 7,
      name: 'Online L2+',
      value: 'online_l2plus',
      selected: false
    }, {
      id: 8,
      name: 'Online Orientation Class',
      value: 'online_orientation_class',
      selected: false
    }, {
      id: 9,
      name: 'Online English Corner',
      value: 'online_english_corner',
      selected: false
    }];
    this.stages = [{
      id: 1,
      name: 'L1'
    }, {
      id: 2,
      name: 'L2'
    }, {
      id: 3,
      name: 'Waystage'
    }, {
      id: 4,
      name: 'Upper Waystage'
    }, {
      id: 5,
      name: 'Threshold'
    }, {
      id: 6,
      name: 'Milestone'
    }, {
      id: 7,
      name: 'Mastery'
    }];
    this.allLessons = this.getLessons();
    this.units = Array.from(Array(80), function (x, index) {
      return index + 1;
    });
    this.classNumbers = Array.from(Array(16), function (x, index) {
      return index + 1;
    });
    this.type = 'L1';
    this.showClassTypesPanel = false;
    this.showLessons = false;
    this.showStagesList = false;
    this.showUnits = false;
    this.showClassNumber = false;
    this.selectedClassType = null;
    this.selectedLesson = null;
    this.selectedStage = null;
    this.selectedUnit = null;
    this.selectedClassNumber = null;
    this.timerId = null;
    this.lastfilter = this.onlineMaterialService.getData();

    if (this.lastfilter) {
      this.selectedClassType = this.onlineClassTypes.find(function (classtype) {
        return classtype.value === _this.lastfilter.classtype;
      });
      this.selectedUnit = this.lastfilter.unit;
      this.selectedClassNumber = this.lastfilter.classNumber;
      this.searchValue = this.lastfilter.searchValue;
      this.selectedStage = this.stages.find(function (stage) {
        return stage.name === _this.lastfilter.stage;
      });
      this.getMaterialsList();
    }
  }

  _createClass(OnlineMaterialListController, [{
    key: "bodyClick",
    value: function bodyClick() {
      this.showClassTypesPanel = false;
      this.showLessons = false;
      this.showStagesList = false;
      this.showUnits = false;
      this.showClassNumber = false;
    }
  }, {
    key: "debounce",
    value: function debounce(callback, wait) {
      var _this2 = this;

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (this.timerId) {
        clearTimeout(this.timerId);
      }

      this.timerId = setTimeout(function () {
        var context = _this2;
        callback.apply(context, args);
        _this2.timerId = null;
      }, wait);
    }
  }, {
    key: "getSearchResult",
    value: function getSearchResult(searchText) {
      if (this.selectedClassType) {
        if (searchText.length == 0 || searchText.length > 2) {
          this.getMaterialsList();
        }
      }
    }
  }, {
    key: "getLessons",
    value: function getLessons(from, to) {
      var start = from || 1;
      var end = to || 8;
      var res = [];

      for (var i = start; i <= end; i++) {
        for (var j = 1; j <= 3; j++) {
          res.push(i + '.' + j);
        }
      }

      return res;
    }
  }, {
    key: "openClasstypeList",
    value: function openClasstypeList(event) {
      this.showClassTypesPanel = !this.showClassTypesPanel;
      this.showLessons = false;
      this.showStagesList = false;
      this.showUnits = false;
      this.showClassNumber = false;
      event.stopPropagation();
    }
  }, {
    key: "openLessons",
    value: function openLessons(event) {
      this.showLessons = !this.showLessons;
      this.showClassTypesPanel = false;
      this.showStagesList = false;
      this.showUnits = false;
      this.showClassNumber = false;
      event.stopPropagation();
    }
  }, {
    key: "openStageList",
    value: function openStageList(event) {
      this.showStagesList = !this.showStagesList;
      this.showClassTypesPanel = false;
      this.showLessons = false;
      this.showUnits = false;
      this.showClassNumber = false;
      event.stopPropagation();
    }
  }, {
    key: "openUnits",
    value: function openUnits(event) {
      this.showUnits = !this.showUnits;
      this.showClassTypesPanel = false;
      this.showLessons = false;
      this.showStagesList = false;
      this.showClassNumber = false;
      event.stopPropagation();
    }
  }, {
    key: "openClassNumberList",
    value: function openClassNumberList(event) {
      this.showClassNumber = !this.showClassNumber;
      this.showClassTypesPanel = false;
      this.showLessons = false;
      this.showStagesList = false;
      this.showUnits = false;
      event.stopPropagation();
    }
  }, {
    key: "caseLessonFn",
    value: function caseLessonFn() {
      this.viewLessons = true;
    }
  }, {
    key: "getSelectedClassType",
    value: function getSelectedClassType(classtype) {
      if (classtype.selected) {
        return;
      }

      this.selectedLesson = null;
      this.selectedStage = null;
      this.selectedUnit = null;
      this.selectedClassNumber = null;
      this.searchValue = null;
      this.onlineClassTypes.forEach(function (type) {
        if (classtype.value === type.value) {
          type.selected = true;
        } else {
          type.selected = false;
        }
      });
      this.selectedClassType = classtype;

      switch (this.selectedClassType.value) {
        case 'online_encounter':
        case 'online_orientation_class':
        case 'online_complementary_class':
        case 'online_l1plus':
        case 'online_l2plus':
        case 'live_class':
        case 'channel_class':
        case 'online_social_club':
        case 'online_english_corner':
          this.getMaterialsList();
          break;

        default:
          console.log('Sorry, we are out of ' + this.selectedClassType.value + '.');
      }

      this.resetDefaultValue();
    }
  }, {
    key: "resetDefaultValue",
    value: function resetDefaultValue() {
      this.showClassTypesPanel = false;
      this.selectedLesson = null;
      this.selectedUnit = null;
      this.selectedStage = null;
      this.selectedClassNumber = null;
      this.searchValue = null;
    }
  }, {
    key: "getSelectedLesson",
    value: function getSelectedLesson(lesson) {
      this.searchValue = null;
      this.selectedLesson = lesson;
      this.showLessons = false;
    }
  }, {
    key: "getSelectedStage",
    value: function getSelectedStage(stage) {
      this.searchValue = null;
      this.selectedStage = stage;
      this.showStagesList = false;
      this.getMaterialsList();
    }
  }, {
    key: "getSelectedUnit",
    value: function getSelectedUnit(unit) {
      this.searchValue = null;
      this.selectedUnit = unit;
      this.showUnits = false;
      this.getMaterialsList();
    }
  }, {
    key: "getSelectedClassNumber",
    value: function getSelectedClassNumber(number) {
      this.searchValue = null;
      this.selectedClassNumber = number;
      this.showClassNumber = false;
      this.getMaterialsList();
    }
  }, {
    key: "showPreview",
    value: function showPreview(data) {
      window.sessionStorage.setItem('selectedMaterials', JSON.stringify(data));
      this.$state.go('materials.view');
    }
  }, {
    key: "sanitize",
    value: function sanitize(searchValue) {
      if (!searchValue) {
        return '';
      }

      return searchValue.split('').map(function (_char) {
        var charCode = _char.charCodeAt(0);

        var conditionsToCheck = [charCode >= 48 && charCode <= 57, charCode >= 65 && charCode <= 90, charCode >= 97 && charCode <= 122, charCode === 32, charCode === 45, charCode === 95];
        return conditionsToCheck.some(function (condition) {
          return condition;
        }) ? _char : '';
      }).join('');
    }
  }, {
    key: "getMaterialsList",
    value: function getMaterialsList() {
      var _this3 = this;

      var filters = {
        classtype: this.selectedClassType.value,
        unit: this.selectedUnit,
        stage: this.selectedStage ? this.selectedStage.name : null,
        classNumber: this.selectedClassNumber,
        searchValue: this.sanitize(this.searchValue)
      };
      this.showloader = true;
      this.onlineMaterialService.setData(filters);
      this.onlineMaterialService.getMaterials(filters).then(function (res) {
        _this3.showloader = false;

        if (res.data.length > 0) {
          _this3.noResultsFound = false;
          _this3.onlineMaterials = res.data;
        } else {
          _this3.noResultsFound = true;
        }
      }, function (err) {
        _this3.showloader = false;
      });
    }
  }]);

  return OnlineMaterialListController;
}();

DC.controller('OnlineMaterialListController', ['Auth', '$scope', '$window', '$location', '$timeout', '$http', '$state', 'onlineMaterialService', 'timeDelayService', function (Auth, $scope, $window, $location, $timeout, $http, $state, onlineMaterialService, timeDelayService) {
  return new OnlineMaterialListController(Auth, $scope, $window, $location, $timeout, $http, $state, onlineMaterialService, timeDelayService);
}]);
//# sourceMappingURL=online-material-list.controller.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

window.ispringPresentationConnector = {}; // window.scroller = new iScroll('wrapper');
// window.notesScroller=new iScroll('wrapperNotes');

var OnlineMaterialViewController = /*#__PURE__*/function () {
  function OnlineMaterialViewController(Auth, $scope, $window, $location, $timeout, $http, $state, $storage, CustomSort) {
    _classCallCheck(this, OnlineMaterialViewController);

    this.$location = $location;
    this.$storage = $storage;
    this.Auth = Auth;
    this.$window = $window;
    this.$location = $location;
    this.$timeout = $timeout;
    this.$http = $http;
    this.$state = $state;
    this.$scope = $scope;
    this.offset = 1;
    this.File = {};
    this.thumbDir = null;
    this.driver = {};
    this.notesFontSize = null;
    this.CustomSort = CustomSort;
    this.selectedMaterial = JSON.parse(window.sessionStorage.getItem('selectedMaterials'));
    this.Ispring({
      label: this.selectedMaterial.title,
      url: this.selectedMaterial['Blob URL'],
      layout: '16:9'
    });
  }

  _createClass(OnlineMaterialViewController, [{
    key: "Ispring",
    value: function Ispring(options) {
      this.type = 'ISPRING';
      this.label = options.label;
      this.slides = [];
      this.activeSlide = options.activeSlide || 0;
      this.stepIndex = options.stepIndex || 0; // Animation index of the slide

      this.activePanel = options.activePanel || 'thumbnails'; // Active sidebar panel

      this.defaultNotes = 'There is no notes for this slide'; // Default message for notes

      this.url = options.url; // URL of the page to be loaded in iframe

      this.contentLoaded = false;
      this.pptLoaded = false; // Just to track if slide is loaded

      this.layout = options.layout; // Directory path that contains the thumbs

      this.thumbDir = options.url.substr(0, options.url.lastIndexOf('/') + 1);
      this.thumbs = []; // Contains the thumbnail list

      this.preparePlayer(options);
    }
  }, {
    key: "getThumbnailSlides",
    value: function getThumbnailSlides(asset) {
      var _this = this;

      // function (asset) {
      var thumb;
      self.$timeout(function () {
        // Set some timeout magic
        // iSpring generates the key randomly while converting
        // so search for the property which has the img path
        for (var key in asset) {
          if (/data\//.test(asset[key])) {
            // Remove the timestamp from thumb and push it
            thumb = asset[key].substring(0, asset[key].indexOf('?'));
            self.thumbs.push(self.thumbDir + thumb);
            break;
          }
        }

        self.thumbs = _this.CustomSort.alphaNumSort(self.thumbs, {
          insensitive: true
        });
      }, 10); // }
    }
  }, {
    key: "preparePlayer",
    value: function preparePlayer(options) {
      // var iFrame = document.getElementById('content-frame');
      var iFrame = document.createElement('iframe');
      iFrame.className = 'ppt-player';
      iFrame.src = this.url;
      iFrame.tabIndex = '-1'; // Import the iFrame element
      // this.content = iFrame;

      var contentArea = document.getElementById('content-area');
      contentArea.appendChild(iFrame);
      var self = this;

      window.ispringPresentationConnector.register = function (player) {
        // Get the ISpring Objects
        self.driver.iConnector = player;
        self.driver.iPresent = self.driver.iConnector.presentation();
        self.driver.ipView = self.driver.iConnector.view();
        self.driver.pbController = self.driver.ipView.playbackController(); // Set the flag that content loading is finished

        self.contentLoaded = true; // Get the slides and their count

        var iSlides = self.driver.iPresent.slides();
        var count = iSlides.count(); // Check if data is already cached, else load it
        // if(!options.cache.slides || !options.cache.thumbs || options.cache.slides.length != count  || options.cache.thumbs.length != count) {
        // Prepare and make all those slides ready for drawing annotations

        for (var i = 0; i < count; i++) {
          // Create a slide object
          var slide = {
            index: i,
            // This is the index of slide number
            notes: '' // This will hold the notes of the slide

          }; // Update the slide notes

          slide.notes = iSlides.getSlide(i).slideNotes().html(); // Push the slide data

          self.slides.push(slide); // Request the loading of image assets

          iSlides.getSlide(i).thumbnail().load(); // Load complete handler
          // self.getThumbnailSlides.bind(this, thumb)

          iSlides.getSlide(i).thumbnail().loadCompleteEvent().addHandler(function (asset) {
            var thumb;
            self.$timeout(function () {
              // Set some timeout magic
              // iSpring generates the key randomly while converting
              // so search for the property which has the img path
              for (var key in asset) {
                if (/data\//.test(asset[key])) {
                  // Remove the timestamp from thumb and push it
                  thumb = asset[key].substring(0, asset[key].indexOf('?'));
                  self.thumbs.push(self.thumbDir + thumb);
                  break;
                }
              }

              self.thumbs = self.CustomSort.alphaNumSort(self.thumbs, {
                insensitive: true
              });
              self.$scope.$apply();
            }, 10);
          });
        } // SLIDE CHANGE EVENT


        self.driver.pbController.slideChangeEvent().addHandler(function (slideIndex) {
          self.activeSlide = slideIndex; // self.showThumb(slideIndex, 800); // Updates the thumb view

          angular.element(document.querySelector('#notesPanel').scrollTop = 0);
        }); // PPT ACTION EVENT

        self.driver.pbController.stepChangeEvent().addHandler(function (stepIndex) {
          if (!self.pptLoaded) {
            self.pptLoaded = true; // Flag that a animation occured

            self.driver.pbController.gotoTimestamp(self.activeSlide, self.stepIndex, 0, true);
          } else {
            self.stepIndex = stepIndex;
            self.driver.pbController.gotoTimestamp(self.activeSlide, stepIndex, 0, true);
          }
        });
      };
    }
  }, {
    key: "adjustFont",
    value: function adjustFont($event, size) {
      this.notesFontSize = size;
    }
  }, {
    key: "redirectBack",
    value: function redirectBack() {
      if (this.$storage.getCookieByName('access_token')) {
        this.$state.go('materials.list');
      } else {
        window.location.href = 'redirectDomain';
      }
    }
  }, {
    key: "showThumb",
    value: function showThumb(slideIndex, duration) {
      if (this.activePanel != 'thumbnails') return;
      if (!duration) duration = 100;
      var slideToFocus;

      if (slideIndex === 0) {
        slideToFocus = 0;
      } else if (slideIndex === this.thumbs.length - 1) {
        slideToFocus = this.thumbs.length;
      } else {
        slideToFocus = slideIndex - 1;
      }

      $timeout(function () {
        var slide = document.getElementById('slide-' + slideToFocus);
        window.scroller.scrollToElement(slide, duration);
      }, 200);
    }
  }, {
    key: "showPanel",
    value: function showPanel(panel) {
      this.activePanel = panel;

      if (panel == 'thumbnails') {
        this.showThumb(this.activeSlide, 10);
      }
    }
  }, {
    key: "prevSlide",
    value: function prevSlide() {
      if (!this.$scope.disableControls) {
        if (this.activeSlide > 0) {
          this.activeSlide--;
          this.gotoSlide(this.activeSlide);
          angular.element(document.querySelector('#notesPanel').scrollTop = 0);
        }
      }
    }
  }, {
    key: "nextSlide",
    value: function nextSlide() {
      if (!this.$scope.disableControls) {
        if (this.activeSlide < this.slides.length - 1) {
          this.activeSlide++;
          this.gotoSlide(this.activeSlide);
          angular.element(document.querySelector('#notesPanel').scrollTop = 0);
        }
      }
    }
  }, {
    key: "gotoSlide",
    value: function gotoSlide(index) {
      // this.activeSlide = index;
      if (!this.$scope.disableControls) {
        this.driver.pbController.gotoSlide(index);
        angular.element(document.querySelector('#notesPanel').scrollTop = 0);
      }
    }
  }, {
    key: "resizeThumbnail",
    value: function resizeThumbnail() {
      var thumbNail = angular.element('#thumbnail-container');
      var height = thumbNail.find('li')[0].getBoundingClientRect().height * 3 - 5; // Modify the thumb height if slide is first or last

      if (self.activeSlide == 0 || self.activeSlide == self.slides.length - 1) {
        height = height - 8;
      }

      thumbNail[0].style.height = height + 'px';
    } // importFile(file) {
    //   if (file.type == "ppt") {
    //     var ppt = {
    //       name: file.title,
    //       url: file["Blob URL"],
    //       layout: "16:9",
    //       fileType: file.type,
    //     };
    //     // $scope.$broadcast('import-file', ppt);
    //     this.onImportFile(ppt);
    //     $scope.toggleExplorer();
    //   } else {
    //     // $scope.$broadcast('import-file', {file: file, fileType: "image"});
    //     // $scope.toggleExplorer();
    //   }
    // }
    // onImportFile(data) {
    //   if (data.fileType == "ppt") {
    //     if (!$scope.activeBoard) return;
    //     if ($scope.activeBoard.mount) {
    //       $scope.activeBoard.unmount();
    //     }
    //     data.type = "ISPRING";
    //     data.label = data.name;
    //     data.board = $scope.activeBoard.index;
    //     if ($scope.user.role == "teacher") {
    //       $scope.showNotesPanel = true;
    //       scroller.scrollTo(0, 0);
    //     }
    //     var file = File.Ispring.objectify(data);
    //     $exchange.publish("wb:import-file", data);
    //     $scope.activeBoard.mountFile(file);
    //   }
    // }
    // unmount() {
    //   this.mount.content.parentNode.removeChild(this.mount.content);
    //   if (this.type == "IMAGE") {
    //     this.mountData = null;
    //   }
    //   this.label = "Whiteboard";
    //   // Layout.switch('BLANK');
    // }

  }]);

  return OnlineMaterialViewController;
}();

DC.controller('OnlineMaterialViewController', ['Auth', '$scope', '$window', '$location', '$timeout', '$http', '$state', '$storage', 'CustomSort', function (Auth, $scope, $window, $location, $timeout, $http, $state, $storage, CustomSort) {
  return new OnlineMaterialViewController(Auth, $scope, $window, $location, $timeout, $http, $state, $storage, CustomSort);
}]);
//# sourceMappingURL=online-material-view.controller.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var QuickslotController = /*#__PURE__*/function () {
  function QuickslotController($scope, $http, $state, $location, $storage, RTC_PROVIDER) {
    _classCallCheck(this, QuickslotController);

    this.$http = $http;
    this.$state = $state;
    this.$storage = $storage;
    this.$location = $location;
    this.RTC_PROVIDER = RTC_PROVIDER;
    this.teacherLink = null;
    this.studentLinks = [];
    this.showButton = true;
    this.showLoader = false;
    this.reportsAuthKey = '';
    this.showInvalidKeyError = false;
    this.showAuthPopup = false;
    this.rtcServiceProvider = 'enablex';
    var timeSlot = $location.search().slot || 60; // Accept the delay only in whole number.

    var delay = $location.search().delay && /^\+?\d+$/.test($location.search().delay) ? $location.search().delay : 0;
    var preLink = window.location.protocol + '//' + window.location.host;
    var callbackUrl = window.location.protocol + '//' + window.location.host;
    var serveFrom = $location.search().key || 0;
    this.defaultSlotObject = {
      timeSlot: timeSlot,
      delay: delay,
      preLink: preLink,
      callbackUrl: callbackUrl,
      serveFrom: serveFrom
    };
    this.quickslotTokenCall();
  }

  _createClass(QuickslotController, [{
    key: "showReports",
    value: function showReports() {
      var _this = this;

      if (this.reportsAuthKey) {
        var encryptedKey = window.btoa(this.reportsAuthKey);
        this.$http.post('/api/reports/auth/', {
          accessKey: encryptedKey
        }).then(function (res) {
          if (res.data && res.data.validate) {
            _this.showAuthPopup = false;
            _this.showInvalidKeyError = false;
            window.sessionStorage.setItem('reportsAuthKey', res.data.secretKey);

            var url = _this.$state.href('sessionreports');

            window.open(url, '_blank');
          }
        }, function (err) {
          if (err.status === 400) {
            _this.showInvalidKeyError = true;
          }
        });
      }
    }
  }, {
    key: "showOnlineMaterials",
    value: function showOnlineMaterials() {
      setTimeout(function () {
        window.open('/materials', '_blank');
      }, 1000);
    }
  }, {
    key: "quickslotTokenCall",
    value: function quickslotTokenCall() {
      var _this2 = this;

      window.sessionStorage.clear();
      var quickslotUser = {
        userName: 'qsAdmin',
        password: 'qsAdmin'
      };
      this.$http.post('/api/auth/qslogin', quickslotUser).then(function (res) {
        if (res.status === 200 && res.data.success === true) {
          _this2.quickSlotToken = res.data.token;

          _this2.$storage.setItem('quickslotSession', {
            user: res.data.user,
            token: res.data.token
          });
        }
      }, function (err) {
        console.log('quickslot api error', err);
      });
    }
  }, {
    key: "generateQuickslotURL",
    value: function generateQuickslotURL(device) {
      var _this3 = this;

      //$scope.currentDevice = device;
      // Show loader and hide the button
      this.showLoader = true;
      this.showButton = false; // Reset the teacher and student links

      this.teacherLink = null;
      this.studentLinks = [];
      var rtcServiceProvider = {
        rtcServiceProvider: this.rtcServiceProvider === 'zoom' ? this.RTC_PROVIDER.zoom : this.RTC_PROVIDER.opentok
      };
      this.$http.post('/api/activity/x/' + this.defaultSlotObject.timeSlot + '/' + this.defaultSlotObject.delay, rtcServiceProvider).then(function (data, status, headers, config) {
        _this3.showLoader = false;
        var appData = data.data.data.dcAppData; // Prepare the teacher link

        _this3.teacherLink = _this3.makeLink(data.data.data.id, appData.teacher.id); // Empty the students links

        _this3.studentLinks = []; // Prepare student links

        for (var i = 0; i < 8; i++) {
          // For the mobile devices - iOS & Android
          if (device == 'mobile') {
            // Frame a table structure with activityId and studentId
            _this3.studentLinks.push({
              activityId: data.data.data.id,
              studentId: appData.students[i].id
            });
          } // For the web browsers
          else {
              // Frame an URL link and display for student
              _this3.studentLinks.push(_this3.makeLink(data.data.data.id, appData.students[i].id));
            }
        } // Re-enable the button for re-creation


        _this3.showButton = true;
      }, function (data, status, headers, config) {
        console.log('Error - condition', data);
      });
    }
  }, {
    key: "makeLink",
    value: function makeLink(activityId, userId) {
      return "".concat(this.defaultSlotObject.preLink, "/autologin?activityId=").concat(activityId, "&userId=").concat(userId, "&callbackUrl=").concat(this.defaultSlotObject.callbackUrl, "&createdBy=qs&Authorization=").concat(this.quickSlotToken);
    }
  }, {
    key: "verifyAuthentication",
    value: function verifyAuthentication() {
      this.showAuthPopup = true;
    }
  }, {
    key: "closeAuthPopup",
    value: function closeAuthPopup() {
      this.showAuthPopup = false;
    }
  }]);

  return QuickslotController;
}();

DC.controller('QuickslotController', ['$scope', '$http', '$state', '$location', '$storage', 'RTC_PROVIDER', function ($scope, $http, $state, $location, $storage, RTC_PROVIDER) {
  return new QuickslotController($scope, $http, $state, $location, $storage, RTC_PROVIDER);
}]);
//# sourceMappingURL=quickslot.controller.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ScreenshareCtrl = /*#__PURE__*/function () {
  function ScreenshareCtrl($scope, $state, $rootScope, Analytics, userService, RTC_PROVIDER, $timeout) {
    _classCallCheck(this, ScreenshareCtrl);

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.Analytics = Analytics;
    this.userService = userService;
    this.currentUser = this.userService.getCurrentUser();
    this.rtcProvider = $scope.$parent.rtcProvider;
    this.teacher = this.userService.getTeacher();
    this.publisher = null;
    this.RTC_PROVIDER = RTC_PROVIDER;
    this.screenshareRunning = false;
    this.disableShare = false;
    this.showPluginNotification = false;
    this.$timeout = $timeout;
    this.supportedWebCodes = typeof window.MediaStreamTrackProcessor === 'function';
    this.eventBroadCastingMethod();
    this.listenDestroy();

    if ($scope.$parent.activeScreen) {
      if ($scope.$parent.activeScreen == 'screenshare') {
        $state.go('classroom.' + $scope.$parent.activeScreen);
        return false;
      }
    }

    $scope.$parent.activeScreen = 'screenshare';
    OT.registerScreenSharingExtension('chrome', 'hmfplljhfekdjigdmhncnijpddkjaoem', 2);
  }

  _createClass(ScreenshareCtrl, [{
    key: "eventBroadCastingMethod",
    value: function eventBroadCastingMethod() {
      var _this = this;

      this.$rootScope.$on('screen:created', function () {
        _this.screenshareRunning = true;
      });
      this.$rootScope.$on('screen:destroyed', function () {
        _this.screenshareRunning = false; // Enable the Share screen button once the sharing is stopped.

        _this.disableShare = false; // Change the active screen to whiteboard

        if (_this.$scope.$parent) {
          _this.$scope.$parent.changeActiveScreen('whiteboard');
        }
      });
      this.changeScreenListener = this.$rootScope.$on('app:change-screen', function () {
        // Check if screen share is in progress
        if (_this.screenshareRunning) {
          // Enable the Share screen button once the sharing is stopped.
          _this.disableShare = false;

          _this.stopSharing(); // this.$scope.$parent.changeActiveScreen('whiteboard');

        }
      });
      this.$rootScope.$on('session-ready', function () {
        _this.disableShare = false;
      });
      this.$rootScope.$on('access-denied-screenshare', function () {
        _this.screenshareRunning = false;
        _this.disableShare = false;
      });
    }
  }, {
    key: "closeScreenShareNotification",
    value: function closeScreenShareNotification() {
      this.showPluginNotification = false;
    }
  }, {
    key: "reloadPage",
    value: function reloadPage() {
      window.location.reload();
    }
  }, {
    key: "shareScreen",
    value: function shareScreen() {
      var _this2 = this;

      // Sending the data to Analytics factory to track the events
      this.Analytics.sendEvent(this.Analytics.eventAction().click, this.Analytics.eventCategory().userInteraction, "Share Screen"); // To avoid the multiple stream creation issue when teacher clicks
      // the button more than once, disable the Share screen button once its clicked.

      this.disableShare = true;
      this.screenshareRunning = true;

      switch (this.$scope.$parent.rtcProvider) {
        case this.RTC_PROVIDER.zoom:
          this.$scope.$parent.ZoomService.startShareScreen();
          return;

        case this.RTC_PROVIDER.opentok:
          OT.checkScreenSharingCapability(function (response) {
            console.log('res', response, response.supported, response.extensionRegistered);

            if (response.supported) {
              if (response.extensionRequired && !response.extensionInstalled) {
                console.log('Extension Installed Status', response.extensionInstalled);
                _this2.showPluginNotification = true;
                _this2.disableShare = false;
              } else {
                _this2.showPluginNotification = false;
                console.log('Screen sharing is available. Publish the screen');
                var screenSharingElement = document.getElementById('ot-publisher-screen-sharing');
                var publisherScreenSharingProperties = {
                  name: 'screen',
                  videoSource: 'screen',
                  maxResolution: {
                    width: 1920,
                    height: 1080
                  },
                  mirror: false,
                  fitMode: 'contain',
                  publishAudio: true
                };
                _this2.publisher = OT.initPublisher(screenSharingElement, publisherScreenSharingProperties, function (error) {
                  if (error) {
                    console.log('`initPublisher error`', error);
                  } else {
                    _this2.$scope.$parent.session.publish(_this2.publisher, function (error) {
                      if (error) {
                        console.log('screen share publish error', error);
                      }
                    });
                  }
                });

                _this2.publisher.on('streamCreated', function (event) {
                  _this2.$rootScope.$emit('screen:created');
                });

                _this2.publisher.on('mediaStopped', function (event) {
                  _this2.$rootScope.$emit('screen:destroyed');
                });

                _this2.publisher.on('streamDestroyed', function (event) {
                  _this2.$rootScope.$emit('screen:destroyed');
                });

                _this2.publisher.on('accessDenied', function (event) {
                  _this2.$rootScope.$emit('access-denied-screenshare');
                });
              }
            } else {
              console.log('This browser does not support screen sharing.');
            }
          });
          return;
      }
    }
  }, {
    key: "stopSharing",
    value: function stopSharing() {
      var _this3 = this;

      // Enable the Share screen button once the sharing is stopped.
      this.disableShare = false;
      this.screenshareRunning = false;

      switch (this.$scope.$parent.rtcProvider) {
        case this.RTC_PROVIDER.zoom:
          this.$scope.$parent.ZoomService.stopShareScreen();
          break;

        case this.RTC_PROVIDER.opentok:
          this.publisher.destroy();
          this.publisher = null;
          break;
      } // Change the active screen to whiteboard


      this.$timeout(function () {
        _this3.$scope.$parent.changeActiveScreen('whiteboard');
      });
    }
  }, {
    key: "listenDestroy",
    value: function listenDestroy() {
      this.$scope.$on('$destroy', this.changeScreenListener);
    }
  }]);

  return ScreenshareCtrl;
}();

DC.controller('ScreenshareCtrl', ['$scope', '$state', '$rootScope', 'Analytics', 'userService', 'RTC_PROVIDER', '$timeout', function ($scope, $state, $rootScope, Analytics, userService, RTC_PROVIDER, $timeout) {
  return new ScreenshareCtrl($scope, $state, $rootScope, Analytics, userService, RTC_PROVIDER, $timeout);
}]);
//# sourceMappingURL=screenshare.controller.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SessionUnavailableCtrl = function SessionUnavailableCtrl($timeout, $window, $location, $storage) {
  var _this = this;

  _classCallCheck(this, SessionUnavailableCtrl);

  var userData = $storage.getItem('dcAppData');

  if (userData) {
    this.callbackUrl = userData.callbackUrl;
  } // Check if there is callback URL else show Continue button


  if (this.callbackUrl) {
    // Redirect to CallbackUrl
    $timeout(function () {
      $window.location.href = _this.callbackUrl;
    }, 5000);
  }
};

DC.controller('SessionUnavailableCtrl', ['$timeout', '$window', '$location', '$storage', function ($timeout, $window, $location, $storage) {
  return new SessionUnavailableCtrl($timeout, $window, $location, $storage);
}]);
//# sourceMappingURL=sessionunavailable.controller.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ThanksCtrl = /*#__PURE__*/function () {
  function ThanksCtrl(Auth, $scope, $window, $location, $timeout, $storage) {
    _classCallCheck(this, ThanksCtrl);

    this.$location = $location;
    this.$storage = $storage;
    this.Auth = Auth;
    this.$window = $window;
    this.$location = $location;
    this.$timeout = $timeout;
    this.callbackUrl = null;
    this.finishSession();
  }

  _createClass(ThanksCtrl, [{
    key: "finishSession",
    value: function finishSession() {
      var _this = this;

      this.callbackUrl = this.$location.search().callbackUrl ? this.$location.search().callbackUrl : JSON.parse(this.$storage.get('dcAppData')).callbackUrl; // Reset authentication

      this.Auth.reset();

      if (this.callbackUrl) {
        // Redirect to CallbackUrl
        this.$timeout(function () {
          _this.$window.location.href = _this.callbackUrl;
        }, 5000);
      }
    }
  }]);

  return ThanksCtrl;
}();

DC.controller('ThanksCtrl', ['Auth', '$scope', '$window', '$location', '$timeout', '$storage', function (Auth, $scope, $window, $location, $timeout, $storage) {
  return new ThanksCtrl(Auth, $scope, $window, $location, $timeout, $storage);
}]);
//# sourceMappingURL=thanks.controller.js.map

"use strict";

/**
 * The rtcProvider supported in the DC are added here.
 * Add the upcoming rtcProviders here.
 */
var rtcProvider = {
  enablex: '1',
  opentok: '2',
  zoom: '3'
};
angular.module('digitalclassroom').constant('RTC_PROVIDER', rtcProvider);
//# sourceMappingURL=rtc-provider.constant.js.map

// angular.module('digitalclassroom').service('alertService', ['$q', function($q){
//
// 	var _target, _msg, _delay, _duration, _type;
//
// 	var Service = {};
//
// 	// var _showPromise = $q.defer();
//
// 	// Resets the alert data
// 	Service.reset = function(){
// 		_target = 'whiteboard';
// 		_msg = 'Lorem Ipsum';
// 		_delay = 0;
// 		_duration = 0;
// 		_type = 'info';
// 	};
//
// 	Service.reset(); // Reset the data to defaults
//
// 	Service.target = function(name){
// 		try{
// 			_target = name;
// 		}
// 		catch(err){
// 			console.log('Error: ' + err);
// 		}
// 	};
//
// 	Service.msg = function(msg) {
// 		try{
// 			_msg = msg;
// 		}
// 		catch(err){
// 			console.log('Error: ' + err);
// 		}
// 	};
//
// 	Service.show = function() {
// 		try{
// 			_type = 'alert-info';
// 		}
// 		catch(err){
// 			console.log('Error: ' + err);
// 		}
// 	};
//
// 	Service.warning = function() {
// 		try{
// 			_type = 'alert-warning';
// 		}
// 		catch(err){
// 			console.log('Error: ' + err);
// 		}
// 	};
//
// 	Service.danger = function() {
// 		try{
// 			_type = 'alert-danger';
// 		}
// 		catch(err){
// 			console.log('Error: ' + err);
// 		}
// 	};
//
// 	Service.hide = function(delay) {
//
// 	};
//
// 	/**
// 	 * @ngdoc function
// 	 * @name showAlert
// 	 * @description Shows the alert
// 	 * @param {Array} usersData The users data to intitialize the service with
// 	 */
// 	/*Service.show = function(msg, duration, type){
//
// 		try{
// 			this.message = msg;
// 			this.duration = duration;
// 			this.type = type;
// 		}
// 		catch(err){
// 			console.log('Error: ' + err);
// 		}
// 	};*/
//
// 	return Service;
// }]);
"use strict";
//# sourceMappingURL=alert.service.js.map

"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * The AlhpaNumeric Sort function.
 * extracted from https://github.com/TrySound/alphanum-sort
 * @returns - exposes alphaNumSort
 */
function CustomSort() {
  var zero = '0'.charCodeAt(0);
  var plus = '+'.charCodeAt(0);
  var minus = '-'.charCodeAt(0);

  function isWhitespace(code) {
    return code <= 32;
  }

  function isDigit(code) {
    return 48 <= code && code <= 57;
  }

  function isSign(code) {
    return code === minus || code === plus;
  }

  var compare = function compare(opts, a, b) {
    var checkSign = opts.sign;
    var ia = 0;
    var ib = 0;
    var ma = a.length;
    var mb = b.length;
    var ca, cb; // character code

    var za, zb; // leading zero count

    var na, nb; // number length

    var sa, sb; // number sign

    var ta, tb; // temporary

    var bias;

    while (ia < ma && ib < mb) {
      ca = a.charCodeAt(ia);
      cb = b.charCodeAt(ib);
      za = zb = 0;
      na = nb = 0;
      sa = sb = true;
      bias = 0; // skip over leading spaces

      while (isWhitespace(ca)) {
        ia += 1;
        ca = a.charCodeAt(ia);
      }

      while (isWhitespace(cb)) {
        ib += 1;
        cb = b.charCodeAt(ib);
      } // skip and save sign


      if (checkSign) {
        ta = a.charCodeAt(ia + 1);

        if (isSign(ca) && isDigit(ta)) {
          if (ca === minus) {
            sa = false;
          }

          ia += 1;
          ca = ta;
        }

        tb = b.charCodeAt(ib + 1);

        if (isSign(cb) && isDigit(tb)) {
          if (cb === minus) {
            sb = false;
          }

          ib += 1;
          cb = tb;
        }
      } // compare digits with other symbols


      if (isDigit(ca) && !isDigit(cb)) {
        return -1;
      }

      if (!isDigit(ca) && isDigit(cb)) {
        return 1;
      } // compare negative and positive


      if (!sa && sb) {
        return -1;
      }

      if (sa && !sb) {
        return 1;
      } // count leading zeros


      while (ca === zero) {
        za += 1;
        ia += 1;
        ca = a.charCodeAt(ia);
      }

      while (cb === zero) {
        zb += 1;
        ib += 1;
        cb = b.charCodeAt(ib);
      } // count numbers


      while (isDigit(ca) || isDigit(cb)) {
        if (isDigit(ca) && isDigit(cb) && bias === 0) {
          if (sa) {
            if (ca < cb) {
              bias = -1;
            } else if (ca > cb) {
              bias = 1;
            }
          } else {
            if (ca > cb) {
              bias = -1;
            } else if (ca < cb) {
              bias = 1;
            }
          }
        }

        if (isDigit(ca)) {
          ia += 1;
          na += 1;
          ca = a.charCodeAt(ia);
        }

        if (isDigit(cb)) {
          ib += 1;
          nb += 1;
          cb = b.charCodeAt(ib);
        }
      } // compare number length


      if (sa) {
        if (na < nb) {
          return -1;
        }

        if (na > nb) {
          return 1;
        }
      } else {
        if (na > nb) {
          return -1;
        }

        if (na < nb) {
          return 1;
        }
      } // compare numbers


      if (bias) {
        return bias;
      } // compare leading zeros


      if (sa) {
        if (za > zb) {
          return -1;
        }

        if (za < zb) {
          return 1;
        }
      } else {
        if (za < zb) {
          return -1;
        }

        if (za > zb) {
          return 1;
        }
      } // compare ascii codes


      if (ca < cb) {
        return -1;
      }

      if (ca > cb) {
        return 1;
      }

      ia += 1;
      ib += 1;
    } // compare length


    if (ma < mb) {
      return -1;
    }

    if (ma > mb) {
      return 1;
    }
  };

  function mediator(a, b) {
    return compare(this, a.converted, b.converted);
  }

  return {
    alphaNumSort: function alphaNumSort(array, opts) {
      if (!Array.isArray(array) || array.length < 2) {
        return array;
      }

      if (_typeof(opts) !== 'object') {
        opts = {};
      }

      opts.sign = !!opts.sign;
      var insensitive = !!opts.insensitive;
      var result = Array(array.length);
      var i, max, value;

      for (i = 0, max = array.length; i < max; i += 1) {
        value = String(array[i]);
        result[i] = {
          value: array[i],
          converted: insensitive ? value.toLowerCase() : value
        };
      }

      result.sort(mediator.bind(opts));

      for (i = result.length - 1; ~i; i -= 1) {
        result[i] = result[i].value;
      }

      return result;
    }
  };
}

angular.module('digitalclassroom').factory('CustomSort', [CustomSort]);
//# sourceMappingURL=alphanum-sort.js.map

"use strict";

/**
  * Analytics Service, used to store logs or whatever useful information
  * that wish you to store which can be used for analytics
  */
DC.factory('analytics', ['$http', 'Auth', function ($http, Auth) {
  // Here vidyo service is included only for analytics purpose
  // So don't process with the vidyo events here
  var analytics = {};
  var sessionData = Auth.getData();
  var url = "/api/logs/store";

  analytics.store = function (type, msg) {
    if (arguments.length == 0) {
      // Need 'msg' param atleast
      return;
    }

    if (arguments.length == 1) {
      msg = type;
      type = 'vidyo'; // Default log type
    } // Adding salt and pepper to the message


    sessionData = sessionData || Auth.getData();
    msg.user = {
      name: sessionData.userName,
      role: sessionData.userRole,
      token: sessionData.token
    };
    msg.roomId = sessionData.room;
    var params = {
      type: type,
      data: msg
    };
    $http.post(url, params);
  };

  return analytics;
}]);
//# sourceMappingURL=analytics.service.js.map

"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpInterceptor = function HttpInterceptor() {
  var _this = this;

  _classCallCheck(this, HttpInterceptor);

  var interceptMethods = ['request', 'response', 'responseError'];
  interceptMethods.forEach(function (method) {
    if (_this[method]) {
      _this[method] = _this[method].bind(_this);
    }
  });
};

var ApiInterceptor = /*#__PURE__*/function (_HttpInterceptor) {
  _inherits(ApiInterceptor, _HttpInterceptor);

  var _super = _createSuper(ApiInterceptor);

  function ApiInterceptor($location, $storage, $q, $injector) {
    var _this2;

    _classCallCheck(this, ApiInterceptor);

    _this2 = _super.call(this);
    _this2.$location = $location; // this can also be removed later.

    _this2.$injector = $injector;
    _this2.$q = $q;
    _this2.$storage = $storage;
    return _this2;
  }

  _createClass(ApiInterceptor, [{
    key: "request",
    value: function request(config) {
      var dcAppDataFromSession, qsToken, nseAccessToken;

      if (window.sessionStorage.getItem('dcAppData')) {
        dcAppDataFromSession = JSON.parse(window.sessionStorage.getItem('dcAppData'));
      }

      if (window.sessionStorage.getItem('quickslotSession')) {
        var sessionInfo = JSON.parse(window.sessionStorage.getItem('quickslotSession'));
        qsToken = sessionInfo.token;
      }

      if (this.$storage.getCookieByName('access_token')) {
        nseAccessToken = this.$storage.getCookieByName('access_token');
      }

      var locationUrl = this.$location.search().Authorization ? this.$location.search().Authorization : '';
      var tokenFromUrl = locationUrl ? locationUrl.replace('Bearer ', '') : '';

      if (tokenFromUrl) {
        config.headers.authorization = tokenFromUrl;
      } else if (dcAppDataFromSession && dcAppDataFromSession.userToken) {
        dcAppDataFromSession.userToken = dcAppDataFromSession.userToken.replace('Bearer ', '');
        config.headers.authorization = dcAppDataFromSession.userToken;
      } else if (qsToken) {
        config.headers.authorization = qsToken;
      } else if (nseAccessToken) {
        config.headers.authorization = nseAccessToken;
      } else {
        return config;
      }

      return config;
    }
  }, {
    key: "response",
    value: function response(_response) {
      if (_response.status !== 401) {
        return _response;
      } else {
        console.log('response with error code');
      }
    }
  }, {
    key: "responseError",
    value: function responseError(rejection) {
      if (rejection.status === 401) {
        var state = this.$injector.get('$state');
        state.go('sessionunavailable');
      }

      return this.$q.reject(rejection);
    }
  }]);

  return ApiInterceptor;
}(HttpInterceptor);

angular.module('digitalclassroom').service('apiInterceptor', ['$location', '$storage', '$q', '$injector', function ($location, $storage, $q, $injector) {
  return new ApiInterceptor($location, $storage, $q, $injector);
}]);
//# sourceMappingURL=api-interceptor.service.js.map

"use strict";

/**
 * The Type of Browser can be known from this Service's getName function 
 * @param {*} $window 
 * @returns 
 */
function BrowserService($window) {
  return {
    getName: function getName() {
      var userAgent = $window.navigator.userAgent;
      var browsers = {
        chrome: /chrome/i,
        safari: /safari/i,
        firefox: /firefox/i,
        ie: /internet explorer/i
      };

      for (var key in browsers) {
        if (browsers[key].test(userAgent)) {
          return key;
        }
      }

      ;
      return 'unknown';
    }
  };
}

angular.module('digitalclassroom').factory('BrowserService', ['$window', BrowserService]);
//# sourceMappingURL=browser.service.js.map

"use strict";

/**
 * @service CMS
 * @description 
 *	This service works for File Explorer
 *	It retreives the data from the CMS API
 */
DC.service('Cms', ['$http', function ($http) {
  return {
    getFiles: function getFiles(parentId) {
      return $http.get('/api/ppt?parentId=' + parentId, {
        cache: true
      });
    },
    getPpt: function getPpt(fileId) {
      return $http.get('/api/ppt?fileId=' + fileId, {
        cache: true
      });
    }
  };
}]);
//# sourceMappingURL=cms.service.js.map

"use strict";

angular.module('digitalclassroom').service('timeDelayService', [function () {
  return {
    debounce: function debounced(delay, fn) {
      var timerId;
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (timerId) {
          clearTimeout(timerId);
        }

        timerId = setTimeout(function () {
          fn.apply(void 0, args);
          timerId = null;
        }, delay);
      };
    },
    throttle: function throttled(delay, fn) {
      var lastCall = 0;
      return function () {
        var now = new Date().getTime();

        if (now - lastCall < delay) {
          return;
        }

        lastCall = now;
        return fn.apply(void 0, arguments);
      };
    }
  };
}]);
//# sourceMappingURL=debounce-throttle.service.js.map

"use strict";

/**
 * @service EnablexService
 * @description All Enablex related APIs are served from here.
 * @param Users - injected user service to get the user details
 */
function EnablexService(Users, $rootScope, $q, $http) {
  var reConnectOpt = {
    allow_reconnect: true,
    number_of_attempts: 3,
    timeout_interval: 10000
  };
  var subsOptions = {
    audio: true,
    video: true
  };
  /**
   * Returns the config based on the current screen
   */

  var getConfigSpecs = function getConfigSpecs(screen) {
    return {
      "maxVideoBW": screen === 'whiteboard' || screen === 'screenshare' ? 120 : 0
    };
  };

  var playerOpt = {
    player: {
      height: '100%',
      width: '100%',
      minHeight: 'inherit',
      minWidth: 'inherit'
    },
    toolbar: {
      displayMode: false,
      branding: {
        display: false
      }
    }
  };
  var stream = {
    screenShare: 101
  };
  /**
   * The object to subscribe to the number of streams, 0 when screenshare and normal by 9.
   */

  var streamCount = {
    screenshare: 0,
    normal: 9
  }; // TODO: Get the mediaZone from DC server

  var mediaZones = ['IE', 'SG', 'US', 'BR', 'DE', 'IN'];
  return {
    /**
     * Room joining process
     * @param {*} token - enablex token to join the room
     * @param {*} streamOpt - passed from the controller.
     */
    joinRoom: function joinRoom(token, streamOpt) {
      var _this = this;

      var isAudioOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var role = arguments.length > 3 ? arguments[3] : undefined;
      return new Promise(function (resolve, reject) {
        // Logger level 0(default) - DEBUG, 5 - NONE, 4 - ERROR
        EnxRtc.Logger.setLogLevel(5);
        _this.localStream = EnxRtc.joinRoom(token, streamOpt, function (success, error) {
          if (error && error !== null) {
            reject(error);
            return;
          }

          _this.isAudioOnly = isAudioOnly;
          _this.role = role;
          _this.room = success.room;
          _this.remoteStreams = success.streams; // If it is an audio only session, set the talker count to 1 for receiving the teachers stream

          if (_this.isAudioOnly) {
            _this.setTalkerCount(1);
          } // Add the teachers stream to spotlight


          if (role === 'teacher') {
            _this.addSpotLightUser();
          }

          _this.subscribeRemoteStreams();

          _this.listenForNewStreams();

          _this.listenForUserDisconnection();

          _this.listenForScreenShareStarted();

          resolve();
        }, reConnectOpt);
      });
    },

    /**
     * Set the attributes for the local stream
     * userId is used to identify to play the local stream in the participant panel
     * role is used to play the local stream in the teacher or student container
     */
    setAttributesForLocalStream: function setAttributesForLocalStream(user) {
      this.localStream.setAttributes({
        userId: user.id,
        role: user.role
      });
    },

    /**
     * Subscribe the remote streams when the user is joined the stream
     * subsOptions defines what stream to be to subscribed namely audio, video, data.
     */
    subscribeRemoteStreams: function subscribeRemoteStreams() {
      for (var i = 0; i < this.remoteStreams.length; i++) {
        this.room.subscribe(this.remoteStreams[i], subsOptions);
      }
    },

    /**
     * Listening for the new streams after the room has been created
     */
    listenForNewStreams: function listenForNewStreams() {
      var _this2 = this;

      this.room.addEventListener('stream-added', function (event) {
        if (_this2.localStream.getID() === event.stream.getID()) {// No need to subscribe your own stream
        } else {
          // if not your stream then subscribe.
          _this2.room.subscribe(event.stream, subsOptions);
        }
      });
      this.room.addEventListener("stream-subscribed", function (event) {
        console.log('subscribed');
      });
      this.room.addEventListener("stream-unsubscribed", function (event) {
        console.log('unsubscribed', event);
      });
    },

    /**
     * event active-talkers-updated whenever there is a change in the talkers list.
     * The Active Talkers list comprises the talkers in ascending order i.e. latest talker will be listed first.
     * @param {Function} callback - to update the video stream in the div
     */
    listenForActiveTalker: function listenForActiveTalker(callback) {
      var _this3 = this;

      this.room.addEventListener('bw-alert', function (event) {
        console.log(event, 'bw event');
      });
      this.room.addEventListener('active-talkers-updated', function (event) {
        _this3.ATList = event.message.activeList;
        console.log('active-talkers', _this3.ATList, event);

        _this3.ATList.forEach(function (talker) {
          if (talker.videomuted && talker.reason === 'bw') {
            if (document.getElementById("".concat(talker.name, "-ot-subscriber-video-container-classroom")) && document.getElementById("".concat(talker.name, "-ot-subscriber-video-container-classroom")).childElementCount !== 0) {
              if (document.getElementById("bandwidth-".concat(talker.name))) {
                document.getElementById("bandwidth-".concat(talker.name)).style.display = 'block';
              } else {
                // create a node and append
                var node = document.createElement("div");
                var textNode = document.createTextNode("Low Bandwidth");
                node.appendChild(textNode);
                node.id = "bandwidth-".concat(talker.name);
                node.className = "custom-bandwidth-notification";
                node.style.display = 'block';
                document.getElementById("".concat(talker.name, "-ot-subscriber-video-container-classroom")).appendChild(node);
              }
            } else if (document.getElementById("ot-publisher-video-container-classroom") && document.getElementById("ot-publisher-video-container-classroom").childElementCount !== 0) {
              if (document.getElementById("bandwidth-".concat(talker.name))) {
                document.getElementById("bandwidth-".concat(talker.name)).style.display = 'block';
              } else {
                // create a node and append
                var _node = document.createElement("div");

                var _textNode = document.createTextNode("".concat(Users.teacher.firstName, " ").concat(Users.teacher.lastName, " Video Muted due to Low Bandwidth"));

                _node.appendChild(_textNode);

                _node.id = "bandwidth-".concat(talker.name);
                _node.className = "custom-bandwidth-notification";
                _node.style.display = 'block';
                document.getElementById("ot-publisher-video-container-classroom").appendChild(_node);
              }
            }
          } else {
            if (document.getElementById("bandwidth-".concat(talker.name))) {
              document.getElementById("bandwidth-".concat(talker.name)).style.display = 'none';
            }
          }
        }); // add logic here for showing the color for identifying the current speaker.


        if (event.message && event.message !== null && event.message.activeList && event.message.activeList !== null) {
          _this3.ATList.forEach(function (item) {
            if (item && item.clientId) {
              var st = _this3.room.remoteStreams.get(item.streamId);

              var name = item.name,
                  clientID = item.clientID,
                  stream_id = item.stream_id;
              callback(st, name, stream_id, clientID, playerOpt);
            }
          });
        }
      });
    },

    /** 
     * Listening for the user disconnection event.
     * The video element is removed from the DOM.
     */
    listenForUserDisconnection: function listenForUserDisconnection() {
      var _this4 = this;

      this.room.addEventListener('user-disconnected', function (event) {
        if (event.role === 'participant') {
          _this4.removeVideoPlayer("".concat(event.name, "-ot-subscriber-video-container-classroom"));
        } else {
          // remove the teacher video container
          _this4.removeVideoPlayer('ot-publisher-video-container-classroom'); // to unmute the current user if his mic is hard muted by the teacher when the teacher leaves the call


          if (Users.current.micHardMuted) {
            _this4.unmuteLocalAudio();
          }
        }
      });
    },

    /**
     * send message
     * @param {String} message - stringified JSON data from the controller
     * @param {boolean} isBroadCast.
     * @param {Array[ClientIDs]} recipients - for broadcast array can be empty
     */
    sendMessage: function sendMessage(message, isBroadCast, recipients) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.room.sendMessage(message, isBroadCast, recipients, function (data) {
          /**
           * Commenting this success block as it is not triggered when the mobile users join the call.
           */
          // if(data.result.result == 0) {
          //   resolve(data)
          // } else {
          //   reject(data)
          // }
        });

        resolve();
      });
    },

    /**
     * Listening for the new messages.
     * @param {Function} callback - to update the UI accordingly.
     */
    listenForMessage: function listenForMessage(callback) {
      this.room.addEventListener('message-received', function (event) {
        var InMsg = event.message;
        console.log(event, 'message event');

        if (InMsg.broadcast === true) {
          // Handle Public Message
          // captureData(event, event.message.message);
          callback(event, event.message.message);
        } else {
          // Handle private Message
          callback(event, event.message.message);
        }
      });
    },

    /**
     * The local stream is played accordingly on the teachers or student container
     */
    playLocalStream: function playLocalStream() {
      console.log(this.localStream, 'local stream');

      if (this.localStream.getAttributes().role === 'teacher') {
        this.localStream.play("ot-publisher-video-container-classroom", playerOpt);
      } else {
        this.localStream.play("".concat(this.localStream.getAttributes().userId, "-ot-subscriber-video-container-classroom"), playerOpt);
      }
    },

    /**
     * To play the local stream in the custom DIV.
     * @param {string} divId - DOM element id
     */
    playLocalStreamInCustomDiv: function playLocalStreamInCustomDiv(divId) {
      this.localStream.play(divId, playerOpt);
    },

    /**
     * To switch the microphone
     * @param {*} device - contains the id, name and other details of the selected device
     */
    switchMicrophone: function switchMicrophone(device) {
      this.localStream.switchMicrophone(this.localStream, device.deviceId, function (stream) {
        if (stream && stream.getID) {// sucess
        } else {// switching failed
          }
      });
    },

    /**
     * To switch the camera
     * @param {*} device - contains the id, name and other details of the selected device
     */
    switchCamera: function switchCamera(device) {
      this.localStream.switchCamera(this.localStream, device.deviceId, function (stream) {
        if (stream && stream.getID) {// sucess
        } else {// switching failed
          }
      });
    },

    /**
     * To change the receiving quality of the video stream
     * @param {*} quality 
     */
    setReceiveVideoQuality: function setReceiveVideoQuality(quality) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6.room.setReceiveVideoQuality(quality, function (result) {
          if (result.result == 0) {
            console.log('stream quality changed');
            resolve();
          } else {
            console.log('stream quality change failed');
            reject(result);
          }
        });
      });
    },

    /**
     * To mute local stream audio
     * @param {*} callback - used only in self mute
     */
    muteLocalAudio: function muteLocalAudio(callback) {
      this.localStream.muteAudio(function (response) {
        if (response.result == 0) {
          callback && callback();
        }
      });
    },

    /**
     * To unmute local stream audio
     * @param {*} callback - used only in self mute
     */
    unmuteLocalAudio: function unmuteLocalAudio(callback) {
      this.localStream.unmuteAudio(function (response) {
        if (response.result == 0) {
          callback && callback();
        }
      });
    },

    /**
     * To mute the video
     * @param {Function} callback - success handler
     */
    muteVideo: function muteVideo(callback) {
      this.localStream.muteVideo(function (response) {
        if (response.result == 0) {
          callback && callback();
        }
      });
    },

    /**
     * To unmute the video
     * @param {Function} callback - success handler
     */
    unmuteVideo: function unmuteVideo(callback) {
      this.localStream.unmuteVideo(function (response) {
        if (response.result == 0) {
          callback && callback();
        }
      });
    },

    /**
     * to start the screen share
     * @param {*} callback 
     */
    startScreenShare: function startScreenShare(callback) {
      var _this7 = this;

      this.screenShare = this.room.startScreenShare(function (response) {
        if (response.result === 0) {
          if (_this7.screenShare) {
            _this7.screenShare.addEventListener('stream-ended', function (event) {
              _this7.room.stopScreenShare(function (res) {
                if (res.result == 0) {
                  _this7.screenShare = null;
                  $rootScope.$emit('screen:destroyed');
                }
              });
            });
          }

          callback();
        } else {
          // access denied error is emitted.
          $rootScope.$emit('access-denied-screenshare');
        }
      });
    },

    /**
     * To stop the screenshare
     */
    stopScreenShare: function stopScreenShare() {
      var _this8 = this;

      this.room.stopScreenShare(this.screenShare, function (response) {
        if (response.result === 0) {
          _this8.screenShare = null;

          _this8.removeVideoPlayer('ot-subscriber-screen-sharing');
        }
      });
    },

    /**
     * To remove the child nodes inside the element
     * @param {string} divElement - the parent element id
     */
    removeVideoPlayer: function removeVideoPlayer(elementId) {
      var parentElement = document.getElementById(elementId);

      if (parentElement) {
        while (parentElement.firstChild) {
          parentElement.removeChild(parentElement.firstChild);
        }
      }
    },

    /**
     * Listening for the screen share start and stop event.
     */
    // skip the talker count when audio only session is going on.
    listenForScreenShareStarted: function listenForScreenShareStarted() {
      var _this9 = this;

      this.room.addEventListener("share-started", function (event) {
        // If it is audio only session, then dont do anything 
        // else set the talker count to 0.
        if (!_this9.isAudioOnly) {
          _this9.setTalkerCount(streamCount.screenshare);
        } // Get Stream# 101 which carries Screen Share


        var sharedStream = _this9.room.remoteStreams.get(stream.screenShare);

        sharedStream.play("ot-subscriber-screen-sharing", playerOpt); // Play in Player
      });
      this.room.addEventListener("share-stopped", function (event) {
        // If it is audio only session, then dont do anything 
        // else set the talker count to normal count i.e 9.
        if (!_this9.isAudioOnly) {
          _this9.setTalkerCount(streamCount.normal);
        } // remove the stream


        _this9.removeVideoPlayer('ot-subscriber-screen-sharing');
      });
    },

    /**
     * Set the talker video count.
     * @param {Number} count 
     */
    setTalkerCount: function setTalkerCount(count) {
      this.room.setTalkerCount(count, function (response) {
        console.log(response, 'set talker count');
      });
    },

    /**
     * Used to disconnect the current user from the room.
     */
    disconnect: function disconnect() {
      this.room.disconnect();
    },

    /**
     * To change both the audio and video device of the selected stream.
     * @param {String} micDeviceId 
     * @param {String} camDeviceId 
     */
    switchMediaDevice: function switchMediaDevice(micDeviceId, camDeviceId) {
      var _this10 = this;

      EnxRtc.switchMediaDevice(this.localStream, micDeviceId, camDeviceId, function (stream) {
        if (stream && stream.getID) {
          _this10.localStream.stream;
        }
      });
    },

    /**
     * Change the maxBW based on the current screen.
     * @param {String} screen - current screen
     */
    updateConfiguration: function updateConfiguration(screen) {
      this.localStream && this.localStream.updateConfiguration(getConfigSpecs(screen));
    },
    preTestApiCall: function preTestApiCall(mediaZone, callback) {
      var zone = mediaZones.includes(mediaZone);
      var clientInfo = {
        region: zone ? mediaZone : 'IN'
      };
      this.clientBRate = EnxRtc.clientBitrate(clientInfo);
      this.clientBRate.addEventListener("client-bitrate-finished", function (response) {
        console.log('bitrate status', response); // handle json from response.message

        callback(response.message);
      });
    },
    addSpotLightUser: function addSpotLightUser() {
      this.room.addSpotlightUsers([this.localStream.clientId], function (response) {
        console.log('spotlight added', response);
      });
    },

    /**
     * Get the total number of students in Enablex Room
     */
    getUsersInRoom: function getUsersInRoom(roomId) {
      var deferred = $q.defer();
      $http.get("/api/enablex/rooms/".concat(roomId, "/users")).then(function (response) {
        if (response.status === 200) {
          deferred.resolve(response.data);
        }
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}

angular.module('digitalclassroom').factory('EnablexService', ['userService', '$rootScope', '$q', '$http', EnablexService]);
//# sourceMappingURL=enablex.service.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ExpelService = /*#__PURE__*/function () {
  function ExpelService(userService, $exchange, $rootScope, enablexService) {
    _classCallCheck(this, ExpelService);

    this.userService = userService;
    this.$exchange = $exchange;
    this.$rootScope = $rootScope;
    this.enablexService = enablexService;
    this.ioReady();
  }

  _createClass(ExpelService, [{
    key: "ioReady",
    value: function ioReady() {
      var _this = this;

      this.$exchange.events.on('io:ready', function () {
        _this.$exchange.io.on('user:expel', function (msg) {
          if (_this.userService.current.id === msg.data.id) {
            // opens the pop up of the expelled user
            _this.togglePopup(msg.data, msg.data.role); // disconnects the stream of the expelled user.


            _this.enablexService.room && _this.enablexService.disconnect();
          }
        });
      });
    } // called from the participant panel html first time when the teacher clicks expel user
    // called second time after the expelUser 

  }, {
    key: "togglePopup",
    value: function togglePopup(userData, userRole) {
      var popupType = userRole == "teacher" ? "confirmation" : "information";
      userData.toggleActionMenu = false;
      this.$rootScope.$emit('toggle-expel-popup', {
        userData: userData,
        type: popupType
      });
    } // called from the html popup, confirmation button

  }, {
    key: "expelUser",
    value: function expelUser(expelUserData, expelUserRole) {
      this.$exchange.publish('user:expel', expelUserData); // to close the pop up

      this.togglePopup(expelUserData, expelUserRole);
    }
  }]);

  return ExpelService;
}();

DC.service('expelService', ['userService', '$exchange', '$rootScope', 'EnablexService', function (userService, $exchange, $rootScope, EnablexService) {
  return new ExpelService(userService, $exchange, $rootScope, EnablexService);
}]);
//# sourceMappingURL=expel.service.js.map

"use strict";

/**
 * @service handrise
 * @description This service will handle the sockets communication for handrise
 				Created a data which is directly linked with the scope of chat directive
 */
angular.module('digitalclassroom').factory('handriseService', [// Dependencies
'$exchange', 'userService', '$timeout', // Callback
function handriseService($exchange, Users, $timeout) {
  var Service = {};
  var handriseSound;

  try {
    //Handrise audio file
    handriseSound = new Audio('/sounds/handrise-new.mp3');
  } catch (e) {
    console.log('Audio file loading error : ' + e);
  }
  /**
   * @ngdoc function
   * @name toggle
   * @description Toggles the handrise status to true and false
   */


  Service.toggle = function (user) {
    // If the current user is not online then return
    if (user.online) {
      // If current user, toggle the handrise
      if (user.id === Users.current.id && user.role === 'student') {
        user.handRised = !user.handRised; // Toggle the flag
      } // If teacher, acknowledge the handrise
      else if (Users.current.role === 'teacher') {
          user.handRised = false;
        } // Publish the handrise message


      $exchange.publish('handrise:update', {
        userId: user.id,
        status: user.handRised
      });
    }
  };
  /**
   * @ngdoc function
   * @name acknowledge
   * @description Acknowledges a users handrise and sets the status to disable
   * @param {Object} user The user object that has to be acknowledged
   */

  /*Service.acknowledge = function (user) {
  		// Check if user is teacher, only a teacher can acknowledge
  	if (Users.current.role == 'teacher') {
  			user.handRised = false;
  			// Publish the acknowledge message
  		$exchange.publish('handrise:update', {
  			userId : user.id,
  			status: user.handRised
  		});
  	}
  };*/

  /**
   * @ngdoc function
   * @name syncData
   * @description
   * This will sync the users data with the handRised users data
   */


  Service.syncData = function () {// chat.me.handRised = false; // By default current users handRised will be false

    /*console.log('Syncing handrise users...');
    	angular.forEach(chat.users, function(user) {
    		console.log(user);
    		if ($scope.wbData.handRisedUsers.indexOf(user.userName) != -1) {
    		user.handRised = true;
    	}
    	else{
    		user.handRised = false;
    	}
    });*/
  }; //==============================================================================
  // SOCKET LISTENERS - Register for the socket events
  //==============================================================================
  // Once exchange is ready, attach the event listeners


  $exchange.events.on('io:ready', function () {
    console.log('[IO] Registering Handrise IO'); // Socket update handrise

    $exchange.io.on('handrise:update', function (msg) {
      if (Users.current.id == msg.data.userId) {
        Users.current.handRised = msg.data.status;
      } else {
        var user = Users.getUser(msg.data.userId);
        user.handRised = msg.data.status; // Play audio only for teacher

        if (Users.current.role === 'teacher' && user.handRised) {
          $timeout(function () {
            handriseSound.play();
          }, 100);
        }
      }
    }); // USER:ONLINE

    $exchange.io.on('user:online', function (msg) {
      var data = msg.data; // If user went offline, reset his handrise status

      if (!data.status) {
        var user = Users.users[data.userId];

        if (user) {
          user.handRised = false;
        }
      }
    }); // Check if user went offline, remove the handrise if set

    $exchange.events.on('connection-status', function (data) {
      if (!data.status) {
        Users.current.handRised = false;
      }
    });
  });
  return Service;
}]);
//# sourceMappingURL=handrise.service.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LoggerService = /*#__PURE__*/function () {
  function LoggerService() {
    _classCallCheck(this, LoggerService);
  }
  /**
   * It sends the log information to Rollbar.
   * @param {String} type - denotes the type of log for the rollbar.
   * @param {string|Object} msg - messsage any data to be displayed on rollbar.
   * @param {Object|Array|String} data - data parameter or extra arguments of rollbar.
   * @example
   * log('error', 'Api Error Messgae', '{error: 'unauthorized'}');
   * log('info', 'Session Established', '{sesson-id: 'ui13rnk234_242'}');
   */


  _createClass(LoggerService, [{
    key: "log",
    value: function log(type, msg, data) {
      var logType = type || 'info';
      var message = msg || '';
      var optionalArgs = data || ''; // Rollbar.log(logType, message, optionalArgs); // commented to stop sending debug, log and info to rollbar - Cost cutting. Track only errors.
    }
    /**
     * Custom Rollbar Method for (logLevel = debug) categories.
     * debug is a method provided by rollbar. Rollbar collects and display the message from this function under the "debug" category.
     * @param {string|Object} msg - messsage any data to be displayed on rollbar.
     * @param {Object|Array|String} data - data parameter or extra arguments of rollbar.
     NOTE:
     It will be removed later once all the application logs uses the log method of this service.
     */

  }, {
    key: "debug",
    value: function debug(msg, data) {
      var message = msg || '';
      var optionalArgs = data || ''; // Rollbar.debug(message, optionalArgs); // commented to stop sending debug, log and info to rollbar - Cost cutting. Track only errors.
    }
    /**
     * Custom Rollbar Method for (logLevel = info) categories.
     * info is a method provided by rollbar. Rollbar collects and display the message from this function under the "info" category.
     * @param {string|Object} msg - messsage any data to be displayed on rollbar.
     * @param {Object|Array|String} data - data parameter or extra arguments of rollbar.
     NOTE:
     It will be removed later once all the application logs uses the log method of this service.
     */

  }, {
    key: "info",
    value: function info(msg, data) {
      var message = msg || '';
      var optionalArgs = data || ''; // Rollbar.info(message, optionalArgs); // commented to stop sending debug, log and info to rollbar - Cost cutting. Track only errors.
    }
    /**
     * Custom Rollbar Method for (logLevel = warning) categories.
     * warning is a method provided by rollbar. Rollbar collects and display the message from this function under the "warning" category.
     * @param {string|Object} msg - messsage any data to be displayed on rollbar.
     * @param {Object|Array|String} data - data parameter or extra arguments of rollbar.
     NOTE:
     It will be removed later once all the application logs uses the log method of this service.
     */

  }, {
    key: "warning",
    value: function warning(msg, data) {
      var message = msg || '';
      var optionalArgs = data || '';
      Rollbar.warn(message, optionalArgs);
    }
    /**
     * Custom Rollbar Method for (logLevel = error) categories.
     * error is a method provided by rollbar. Rollbar collects and display the message from this function under the "error" category.
     * @param {string|Object} msg - messsage any data to be displayed on rollbar.
     * @param {Object|Array|String} data - data parameter or extra arguments of rollbar.
     NOTE:
     It will be removed later once all the application logs uses the log method of this service.
     */

  }, {
    key: "error",
    value: function error(msg, data) {
      var message = msg || '';
      var optionalArgs = data || '';
      Rollbar.error(message, optionalArgs);
    }
    /**
     * Custom Rollbar Method for (logLevel = critical) categories.
     * critical is a method provided by rollbar. Rollbar collects and display the message from this function under the "critical" category.
     * @param {string|Object} msg - messsage any data to be displayed on rollbar.
     * @param {Object|Array|String} data - data parameter or extra arguments of rollbar.
     NOTE:
     It will be removed later once all the application logs uses the log method of this service.
     */

  }, {
    key: "critical",
    value: function critical(msg, data) {
      var message = msg ? msg : '';
      var optionalArgs = data ? data : '';
      Rollbar.critical(message, optionalArgs);
    }
  }]);

  return LoggerService;
}();

angular.module('digitalclassroom').service('loggerService', function () {
  return new LoggerService();
});
//# sourceMappingURL=logger.service.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OnlineMaterialService = /*#__PURE__*/function () {
  function OnlineMaterialService($http, $q, $storage, $state) {
    _classCallCheck(this, OnlineMaterialService);

    this.$http = $http;
    this.$q = $q;
    this.$storage = $storage;
    this.$state = $state;
    this.materialFilters = null;
  }

  _createClass(OnlineMaterialService, [{
    key: "setData",
    value: function setData(info) {
      window.sessionStorage.setItem('materialFilters', JSON.stringify(info));
      this.materialFilters = info;
    }
  }, {
    key: "getData",
    value: function getData() {
      if (this.materialFilters) {
        return this.materialFilters;
      } else {
        return JSON.parse(window.sessionStorage.getItem('materialFilters'));
      }
    }
  }, {
    key: "getMaterials",
    value: function getMaterials(filters) {
      var deferred = this.$q.defer();
      var url = "/api/cms/fetchPPTs/".concat(filters.classtype, "/").concat(filters.unit, "/").concat(filters.stage, "?limit=10&searchValue=").concat(filters.searchValue ? filters.searchValue : '', "&classNumber=").concat(filters.classNumber ? filters.classNumber : '');
      var options = {
        cache: false
      };
      var token = this.$storage.getCookieByName('access_token'); // token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbXIiOlsicGFzc3dvcmQiXSwiYXVkIjpbImh0dHBzOi8vaWFtYXBpLXFhLndhbGxzdHJlZXRlbmdsaXNoLmNvbS9yZXNvdXJjZXMiXSwiYXV0aF90aW1lIjoxNTg4NzU4Nzc1LCJjZW50ZXJfaWQiOiJJMjE5MDQiLCJjbGllbnRfaWQiOiJXU0UtRnJvbnRFbmQiLCJleHAiOjE1ODg3OTQ3NzUsImVuYWJsZV9wYXNzd29yZF9yZXNldCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9pYW1hcGktcWEud2FsbHN0cmVldGVuZ2xpc2guY29tIiwibmJmIjoxNTg4NzU4Nzc1LCJyb2xlcyI6WyJzZXJ2aWNlbWFuYWdlciJdLCJzdWIiOiJiYThhZWJiNC02NWZjLTQzYjUtYjBjNy0xZTVmZWE1ODlmOGYiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwiYmxpbmsiLCJsc2FwaSIsInNhaWxhcGkiLCJzbmJhcGkiLCJvZmZsaW5lX2FjY2VzcyJdfQ.EAymq-NYfmOPdELQdxg296u1xtaGd2GcpgDk_pvDS31wOaIeSr38wYgVznsVDHlgJIvUgZTFkir6Yr0aOi5s5bChMwKY3ckC9tYPuUn0f6_OjWB_ToyglvbSRzWKPRrPFZR1nz_-AgeELPT5_b738FINLu6Dc9HGkkt9080G27f-nE45gNQH8B7kt-rVCo6quSVv8YCodkn_kKix56If1Xnmka0A3nJ_4T_-p8Apm8Z-SxE-egBL8pJ27DZ3ppVk8sjqxW1FYYAGkVvXYiSRcDblmL1ZRsrywKC_drGqatogZE77sCoX6dUNFfofJdey4Yd9-v0I9LCctKsLNQVRLg`;

      if (token) {
        this.$http.get(url, options).then(function (res) {
          deferred.resolve(res.data);
        }, function (error) {
          deferred.resolve(error);
        });
      } else {
        // this.$state.go('sessionunavailable');
        window.location.href = 'redirectDomain';
      }

      return deferred.promise;
    }
  }]);

  return OnlineMaterialService;
}();

angular.module('digitalclassroom').service('onlineMaterialService', ['$http', '$q', '$storage', '$state', function ($http, $q, $storage, $state) {
  return new OnlineMaterialService($http, $q, $storage, $state);
}]);
//# sourceMappingURL=online-material.service.js.map

"use strict";

/*
 * JavaScript Client Detection
 * (C) viazenetti GmbH (Christian Ludwig)
 * @author Christian Ludwig
 * @source http://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
 * @description Extending and using the openssource snippet for client platform checking
 */
// DC.factory('screen', [function(){
//
// 	var screenSize = '';
//
// 	if (screen.width) {
// 		var width = (screen.width) ? screen.width : '';
// 		var height = (screen.height) ? screen.height : '';
// 		screenSize += '' + width + " x " + height;
// 	}
// }]);
DC.factory('os', [function () {
  var os = 'unknown'; // OS parsing

  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var clientStrings = [{
    s: 'Windows 10',
    r: /(Windows 10.0|Windows NT 10.0)/,
    v: '10.0'
  }, {
    s: 'Windows 8.1',
    r: /(Windows 8.1|Windows NT 6.3)/,
    v: '6.3'
  }, {
    s: 'Windows 8',
    r: /(Windows 8|Windows NT 6.2)/,
    v: '6.2'
  }, {
    s: 'Windows 7',
    r: /(Windows 7|Windows NT 6.1)/,
    v: '6.1'
  }, {
    s: 'Windows Vista',
    r: /Windows NT 6.0/,
    v: '6.0'
  }, {
    s: 'Windows Server 2003',
    r: /Windows NT 5.2/,
    v: '5.2'
  }, {
    s: 'Windows XP',
    r: /(Windows NT 5.1|Windows XP)/,
    v: '5.1'
  }, {
    s: 'Windows 2000',
    r: /(Windows NT 5.0|Windows 2000)/,
    v: '5.0'
  }, {
    s: 'Windows ME',
    r: /(Win 9x 4.90|Windows ME)/,
    v: '4.90'
  }, {
    s: 'Windows 98',
    r: /(Windows 98|Win98)/,
    v: '4.2'
  }, {
    s: 'Windows 95',
    r: /(Windows 95|Win95|Windows_95)/,
    v: '4.1'
  }, {
    s: 'Windows NT 4.0',
    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
    v: '4.0'
  }, {
    s: 'Windows CE',
    r: /Windows CE/,
    v: '4'
  }, {
    s: 'Windows 3.11',
    r: /Win16/,
    v: '3.11'
  }, {
    s: 'Android',
    r: /Android/
  }, {
    s: 'Open BSD',
    r: /OpenBSD/
  }, {
    s: 'Sun OS',
    r: /SunOS/
  }, {
    s: 'Linux',
    r: /(Linux|X11)/
  }, {
    s: 'iOS',
    r: /(iPhone|iPad|iPod)/
  }, {
    s: 'Mac OS X',
    r: /Mac OS X/
  }, {
    s: 'Mac OS',
    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
  }, {
    s: 'QNX',
    r: /QNX/
  }, {
    s: 'UNIX',
    r: /UNIX/
  }, {
    s: 'BeOS',
    r: /BeOS/
  }, {
    s: 'OS/2',
    r: /OS\/2/
  }, {
    s: 'Search Bot',
    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
  }];
  var tempVersion;

  for (var id in clientStrings) {
    var cs = clientStrings[id];

    if (cs.r.test(nAgt)) {
      os = cs.s;
      tempVersion = cs.v;
      break;
    }
  }

  var osVersion = 'unknown';

  if (/Windows/.test(os)) {
    //osVersion = /Windows (.*)/.exec(os)[1];
    osVersion = tempVersion;
    os = 'Windows';
  }

  switch (os) {
    case 'Mac OS X':
      osVersion = /Mac OS X (\d\d[\.\_\d]+)/.exec(nAgt)[1]; // Replacing _ with .

      osVersion = osVersion.split('_').join('.');
      break;

    case 'Android':
      osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
      break;

    case 'iOS':
      osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
      osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
      break;
  }

  var OS = {
    name: os.toLowerCase(),
    version: osVersion
  };
  return OS;
}]);
DC.factory('browser', [function () {
  // Browser parsing
  var nAgt = navigator.userAgent;
  var browser = navigator.appName;
  var version = '' + parseFloat(navigator.appVersion);
  var nameOffset, verOffset, ix;
  var edgeIndex = nAgt.indexOf('Edge');
  var operaIndex = nAgt.indexOf('Opera');
  var msieIndex = nAgt.indexOf('MSIE');
  var chromeIndex = nAgt.indexOf('Chrome');
  var safariIndex = nAgt.indexOf('Safari');
  var firefoxIndex = nAgt.indexOf('Firefox'); // Edge

  if (edgeIndex != -1) {
    browser = 'Edge';
    verOffset = edgeIndex;
    version = nAgt.substring(verOffset + 7);
  } // Opera
  else if (operaIndex != -1) {
      browser = 'Opera';
      verOffset = operaIndex;
      version = nAgt.substring(verOffset + 6);
      var operaVersionIndex = nAgt.indexOf('Version');

      if (operaVersionIndex != -1) {
        verOffset = operaVersionIndex;
        version = nAgt.substring(verOffset + 8);
      }
    } // MSIE
    else if (msieIndex != -1) {
        verOffset = msieIndex; //browser = 'Microsoft Internet Explorer';

        browser = 'IE';
        version = nAgt.substring(verOffset + 5);
      } // Chrome
      else if (chromeIndex != -1) {
          verOffset = chromeIndex;
          browser = 'Chrome';
          version = nAgt.substring(verOffset + 7);
        } // Safari
        else if (safariIndex != -1) {
            browser = 'Safari';
            verOffset = safariIndex;
            version = nAgt.substring(verOffset + 7);
            var safariVersionIndex = nAgt.indexOf('Version');

            if (safariVersionIndex != -1) {
              verOffset = safariVersionIndex;
              version = nAgt.substring(verOffset + 8);
            }
          } // Firefox
          else if (firefoxIndex != -1) {
              browser = 'Firefox';
              verOffset = firefoxIndex;
              version = nAgt.substring(verOffset + 8);
            } // MSIE 11+
            else if (nAgt.indexOf('Trident/') != -1) {
                // browser = 'Microsoft Internet Explorer';
                browser = 'IE';
                version = nAgt.substring(nAgt.indexOf('rv:') + 3);
              } // Other browsers
              else if (nAgt.lastIndexOf(' ') + 1 < nAgt.lastIndexOf('/')) {
                  nameOffset = nAgt.lastIndexOf(' ') + 1;
                  verOffset = nAgt.lastIndexOf('/');
                  browser = nAgt.substring(nameOffset, verOffset);
                  version = nAgt.substring(verOffset + 1);

                  if (browser.toLowerCase() == browser.toUpperCase()) {
                    browser = navigator.appName;
                  }
                } // trim the version string


  if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);
  var majorVersion = parseInt('' + version, 10);

  if (isNaN(majorVersion)) {
    version = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  var Browser = {};
  Browser.name = browser.toLowerCase();
  Browser.version = version;
  Browser.majorVersion = majorVersion;
  return Browser;
}]);
DC.service('platformService', ['os', 'browser', function (os, browser) {
  var Service = {};
  var compatibleBrowsers = {
    firefox: {
      min: '60.0',
      max: '0'
    },
    chrome: {
      min: '72.0',
      max: '0'
    },
    safari: {
      min: '12.1',
      max: '0'
    }
  };
  var osTable = {
    windows: {
      min: '6.1',
      max: '0'
    },
    'mac os x': {
      min: '10.9.4',
      max: '0'
    },
    'ios': {
      min: '9.0',
      max: '0'
    },
    'android': {
      min: '5.0',
      max: '0'
    },
    'linux': {
      min: '15.0',
      max: '19.0'
    }
  }; //console.log('Initializing platform service');
  //console.log('Browser', browser);
  //console.log('OS', os);
  // Checks for browsers compatibility

  Service.checkBrowserCompatibility = function () {
    var supported = true;

    if (compatibleBrowsers[browser.name]) {
      // if (compatibleBrowsers[browser.name].min && browser.majorVersion < compatibleBrowsers[browser.name].min) {
      // 	supported = false;
      // }
      supported = this.compareVersions(compatibleBrowsers[browser.name].min, browser.version);
    } else {
      supported = false;
    }

    return supported;
  };

  function isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  } // If both are equal returns true
  // If v1 is less than v2 returns true
  // If v1 is greater than v2 returns false
  // v1 - against - v2


  Service.compareVersions = function (v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.'); //console.log('Comparing versions...');

    var depth = v1.length < v2.length ? v1.length : v2.length;
    var r1, r2; // Version Release identifiers
    //console.log('Depth : ' + depth);

    for (var i = 0; i < depth; i++) {
      //console.log('Checking at depth - ' + (i+1));
      r1 = parseInt(v1[i]);
      r2 = parseInt(v2[i]); //console.log('R1 : ' + r1);
      //console.log('R2 : ' + r2);
      // Compare the INT version numbers
      // Check if both the versions have the depth value
      //console.log('R1 is number - ' + isInt(r1));
      //console.log('R2 is number - ' + isInt(r2));
      //console.log('R1 < R2 :: ' + (r1<r2));
      // If base is 0 no need to test

      if (isInt(r1) && isInt(r2) && r1 < r2) {
        return true;
      }

      if (isInt(r1) && isInt(r2) && r2 > r1) {
        console.log('Invalid identified... quitting...');
        return false;
      }
    }

    return true;
  }; // Checks for os compatibility


  Service.checkOSCompatibility = function () {
    var supported = true;

    if (osTable[os.name]) {
      if (os.name !== 'linux') {
        supported = this.compareVersions(osTable[os.name].min, os.version);
      }
    } else {
      supported = false;
    }

    return supported;
  };

  Service.getBrowserInfo = function () {
    return browser;
  };

  Service.getOSInfo = function () {
    return os;
  };

  return Service;
}]);
//# sourceMappingURL=platform.service.js.map

"use strict";

/**
 * @service privilege
 * @description This service will define who has the permission to annotate on
				whiteboard.
 */
DC.service("privilegeService", ['$exchange', '$rootScope', 'userService', '$timeout', function ($exchange, $rootScope, Users, $timeout) {
  var Service = {
    // User data of the currently privileged user
    currentPrivilege: {
      id: null,
      role: null
    },
    privilegeUser: null
  }; // Expose the privilege user data on rootscope

  $rootScope.privilegeUser = Service.currentPrivilege;
  /**
   * @ngdoc function
   * @name init
   * @description Initializes the privilege service with the base data
   * @param {Object} data The data of the user who has the privilege
   */

  Service.init = function (user) {
    this.currentPrivilege.id = user.id;
    this.currentPrivilege.role = user.role;
    this.privilegeUser = Users.getUser(user.id);
  };
  /**
   * @ngdoc function
   * @name updatePrivilege
   * @description Updates the current privilege user for the whiteboard
   * @param {Object} data The user data to set the current privilege to
   */


  Service.updatePrivilege = function (data) {
    this.currentPrivilege.id = data.id;
    this.currentPrivilege.role = data.role;
    $exchange.publish('wb:privilege-update', data);
  };

  Service.getCurrentPrivilegeUser = function () {
    return Service.currentPrivilege;
  }; // Future TODO - Should do a more composite chain model
  // Privilege.grant('whiteboard').to(userId).notify();
  // Privilege.revoke('whiteboard').from(userID); / fromAll();
  // Privilege.reset();
  //==============================================================================
  // SOCKET EVENTS - Socket events will be handled here
  //==============================================================================
  // Once exchange is ready, attach the event listeners


  $exchange.events.on('io:ready', function () {
    console.log('[IO] Registering Privilege IO'); // PRIVILEGE - UPDATE

    $exchange.io.on('wb:privilege-update', function (event) {
      var data = event.data;
      Service.currentPrivilege.id = data.id;
      Service.currentPrivilege.role = data.role;
      var privilegeEnabled = Service.currentPrivilege.id === Users.current.id ? true : false;
      var user = Users.getUser(data.id);
      $rootScope.$emit('privilege-enabled', privilegeEnabled);
      var msg = ''; //var userMsgname = privilegeEnabled ? 'You' : user.userName;

      if (privilegeEnabled && data.role == 'student') {
        msg = ' You got toolbar access to annotate';
      } else if (!privilegeEnabled && data.role == 'student') {
        msg = ' Annotation privilege passed to ' + user.userName;
      } else {
        msg = 'Teacher' + ' got back the privilege to annotate';
      }

      $timeout(function () {
        //to emit the annotation privilege notification on top of whiteboard
        $rootScope.$emit('privilege-board-notification', msg);
      }, 10);
    }); // CURRENT ONLINE - OFFLINE

    $exchange.events.on('connection-status', function (data) {
      // Check if status is offline
      if (!data.status) {
        // Check if the offline user had toolbar access
        var hadPrivilege = data.userId === Service.currentPrivilege.id ? true : false; // Revert the privilege back to teacher if,
        // > User is teacher and doesn't have privilege
        // > User is student and has privilege

        if (data.userRole === 'student' && hadPrivilege || data.userRole === 'teacher' && !hadPrivilege) {
          // Revert the privilege back to teacher locally
          Service.currentPrivilege.id = Users.teacher.id;
          Service.currentPrivilege.role = Users.teacher.role;
          $timeout(function () {
            if (Users.current.role === 'teacher') {
              $rootScope.$emit('privilege-enabled', true);
              $rootScope.$emit('enable-controls'); //Service.hideList();
            } else {
              $rootScope.$emit('privilege-enabled', false);
            }
          }, 10);
        }
      }
    }); // ONLINE - OFFLINE

    $exchange.io.on('user:online', function (event) {
      var data = event.data; // Check if status is offline

      if (!status) {
        // Check if the offline user had toolbar access
        var hadPrivilege = data.userId === Service.currentPrivilege.id ? true : false; // Revert the privilege back to teacher if,
        // > User is teacher and doesn't have privilege
        // > User is student and has privilege

        if (data.userRole === 'student' && hadPrivilege || data.userRole === 'teacher' && !hadPrivilege) {
          // Revert the privilege back to teacher locally
          Service.currentPrivilege.id = Users.teacher.id;
          Service.currentPrivilege.role = Users.teacher.role;
          var msg;
          if (Users.current.id === Users.teacher.id) msg = 'Annotation privilege has been returned';else msg = 'Teacher got back the privilege to annotate';
          $timeout(function () {
            $rootScope.$emit('privilege-board-notification', msg); //Alert.notify('alert-info', msg, 1000);

            if (Users.current.role === 'teacher') {
              $rootScope.$emit('privilege-enabled', true);
              $rootScope.$emit('enable-controls');
              $rootScope.$emit('enable-breakouts'); //Service.hideList();
            } else {
              $rootScope.$emit('privilege-enabled', false);
            }
          }, 10);
        }
      }
    });
  });
  return Service;
}]);
//# sourceMappingURL=privilege.service.js.map

"use strict";

/**
 * @service queue
 * @description Creates a new queue (FIFO) - Data Structure.
 * And Implements debounce and function throttling.
 */
DC.service('$queue', [function () {
  // initialize queue and offset
  var queue = [];
  var offset = 0; // returns the length of the queue.

  this.getLength = function () {
    return queue.length - offset;
  }; //returns true when the length is 0


  this.isEmpty = function () {
    return queue.length == 0;
  }; // Enqueue the process. The parameter is ::
  // process - process that needs to be queued :: it can also be an object


  this.enqueue = function (process) {
    queue.push(process);
  }; // Dequeues the item and returns it.
  //


  this.dequeue = function () {
    // Returns undefined; if the value is 0;
    if (queue.length == 0) return undefined;
    var item = queue[offset];

    if (++offset * 2 >= queue.length) {
      queue = queue.slice(offset);
      offset = 0;
    }

    return item;
  }; // Returns the item at the front of the queue


  this.peek = function () {
    return queue.length > 0 ? queue[offset] : undefined;
  }; // Function Debouncer for event handler.
  //
  // Debounce calls to "callback" routine so that multiple calls
  // made to the event handler before the expiration of "delay" are
  // coalesced into a single call to "callback". Also causes the
  // wait period to be reset upon receipt of a call to the
  // debounced routine.
  //


  this.debounce = function (delay, data, accumulateData) {
    var timeout = null;
    var theData = [];
    return function () {
      //
      // accumulate arguments in case caller is interested
      // in that data
      //
      if (accumulateData) {
        var arr = [];

        for (var i = 0; i < arguments.length; ++i) {
          arr.push(arguments[i]);
        }

        theData.push(arr);
      } //
      // if a timeout has been registered before then
      // cancel it so that we can setup a fresh timeout
      //


      if (timeout) {
        clearTimeout(timeout);
      }

      var args = arguments;
      timeout = setTimeout(function () {
        callback.apply(accumulateData ? {
          data: theData
        } : null, args);
        theData = []; // clear the data array

        timeout = null;
      }, delay);
    };
  }; //
  // Throttle calls to "callback" routine and ensure that it
  // is not invoked any more often than "delay" milliseconds.
  // Accumulates all data passed to the callback routine during
  // calls that are not passed on to "callback" and then hands
  // it off to "callback" via a property called "data" on the
  // context object for that call.  "data" is a (possibly jagged)
  // 2 dimensional array containing the data accumulated during
  // all the calls to the throttled function since the previous
  // expiration of "delay" milliseconds.
  //


  this.throttle = function (delay, callback, accumulateData) {
    var previousCall = null;
    var theData = [];
    return function () {
      var time = new Date().getTime(); //
      // accumulate arguments in case caller is interested
      // in that data
      //

      if (accumulateData) {
        var arr = [];

        for (var i = 0; i < arguments.length; ++i) {
          arr.push(arguments[i]);
        }

        theData.push(arr);
      }

      if (!previousCall || time - previousCall >= delay) {
        previousCall = time;
        callback.apply(accumulateData ? {
          data: theData
        } : null, arguments);
        theData = []; // clear the data array
      }
    };
  };
}]);
//# sourceMappingURL=queueing.service.js.map

"use strict";

DC.factory('reportService', function ($q, $http) {
  var AuthKey = window.sessionStorage.getItem('reportsAuthKey');
  var reportsHeader = {
    headers: {
      'authKey': AuthKey
    },
    cache: false
  };
  var defaultLimit = 10;
  return {
    getTotalPages: function getTotalPages(records) {
      return Math.ceil(records / defaultLimit);
    },

    /**
     * This below function is related to Teacher Issue Reporting .
     * Later, it should either be moved to classroom service or teacher issue report service which is not available currently.
     */
    submitTeacherIssue: function submitTeacherIssue(reportInformation) {
      var deferred = $q.defer();
      $http.post('/api/reportIssue/createTicket', reportInformation).then(function (response) {
        if (response.data.status === 201) {
          window.sessionStorage.removeItem('teacherIssueDetails');
          deferred.resolve(true);
        }
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    getAllReports: function getAllReports(page, limit) {
      var deferred = $q.defer();
      var urlConfig = {
        params: {
          page: page ? page : 1,
          limit: limit ? limit : defaultLimit
        },
        headers: {
          'authKey': AuthKey
        },
        cache: false
      };
      $http.get('/session/reports', urlConfig).then(function (response) {
        deferred.resolve(response.data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    getSessionReportById: function getSessionReportById(activityId) {
      var defered = $q.defer();
      $http.get("/session/reports/activity/".concat(activityId), reportsHeader).then(function (res) {
        defered.resolve(res.data);
      }, function (err) {
        defered.reject(err);
      });
      return defered.promise;
    },
    getTeacherInfomation: function getTeacherInfomation(activityId, userId) {
      var defered = $q.defer();
      $http.get("/session/reports/activity/".concat(activityId, "/").concat(userId), reportsHeader).then(function (res) {
        defered.resolve(res.data);
      }, function (err) {
        defered.reject(err);
      });
      return defered.promise;
    },
    getSessionReportSearchData: function getSessionReportSearchData(searchQuery, page) {
      var defered = $q.defer();
      var urlConfig = {
        params: {
          page: page ? page : 1,
          limit: defaultLimit,
          search: searchQuery
        },
        headers: {
          'authKey': AuthKey
        },
        cache: false
      };

      if (searchQuery) {
        $http.get("/session/reports/search", urlConfig).then(function (res) {
          defered.resolve(res.data);
        }, function (err) {
          defered.reject(err);
        });
      }

      return defered.promise;
    }
  };
});
//# sourceMappingURL=reports.service.js.map

"use strict";

DC.service("$exchange", [// Dependencies
"$rootScope", "$stateParams", "$q", '$window', 'Queue', 'Auth', '$log', '$timeout', // Callback
function ($rootScope, $stateParams, $q, $window, Queue, Auth, Logger, $timeout) {
  // Create a new exchange module
  // Built in a way to migrate to a message broker in future
  // Primary choice will be RabbitMQ, so terminology is
  // standardized to enterprise level exchanges
  var $exchange = {
    initialized: false,
    // Flag, to check if exchange is initialized
    events: {},
    io: {},
    // This will hold primus connection
    lastMsgId: 0,
    // This will store the lastly synced msg id.
    connectionStatus: 'CONNECTING' // To track exchange connectivity

  }; // Spawn a new queue for queuing our sockets messages when offline

  var publishQueue = new Queue();
  var _config = {};
  /*
  ----
  INIT
  ----
  This will initialize the exchange connection
  */

  $exchange.init = function (config) {
    _config = config;
    var host = window.location.protocol + '//' + window.location.host; // Map to <Primus>
    // [TODO-POC] Map to RabbitMQ exchange host

    $exchange.io = Primus.connect(host, {
      strategy: ['online', 'timeout', 'disconnect']
    });
    $exchange.initialized = true;
    console.log('[IO] Socket Exchange initialized. IO Ready.'); // Trigger that IO is ready

    $exchange.events.trigger('io:ready'); // Changes connection to online or offline

    $exchange.updateConnectionStatus = function (status) {
      try {
        if (status !== 'ONLINE' && status !== 'OFFLINE') {
          throw "Invalid connection status passed";
        }

        $exchange.connectionStatus = status;
        $exchange.connectionAlive = status === 'ONLINE' ? true : false;
        $exchange.events.trigger('connection-status', {
          status: $exchange.connectionAlive,
          userId: _config.userId,
          userRole: _config.userRole
        });
      } catch (err) {
        console.log('Error: ' + err);
      }
    }; //-------------------------------------------------
    //----------------- CUSTOM EVENTS -----------------
    //-------------------------------------------------

    /*
    ---------
    JOINED
    ---------
    This event will occur when a connection is subscribed successfully at the server
    */

    /*$exchange.io.on('subscribed', function (res) {
    	logger.log("debug", "primus", 'Exchange channel connected');
    });*/
    //-------------------------------------------------
    //----------------- PRIMUS EVENTS -----------------
    //-------------------------------------------------

    /*
    --------
    OPEN
    --------
    This event will occur when a new connection is established
    */


    $exchange.io.on('open', function () {
      console.log('[PRIMUS] Connection established'); // Logger.debug('[PRIMUS] Connection established');
      // Update the connection status

      $exchange.updateConnectionStatus('ONLINE'); // Setting minor timeout to ready connection

      $timeout(function () {
        // Check if change queue has any messages queued
        $exchange.syncPublishQueue();
      }, 1000);
    });
    /*
    -------------
    DISCONNECTION
    -------------
    This event is triggered when exchange is disconnected
    */

    $exchange.io.on('disconnection', function () {
      console.error('[PRIMUS] Disconnected');
      $exchange.updateConnectionStatus('OFFLINE');
    });
    $exchange.io.on('close', function () {
      console.error("[PRIMUS] Connection closed");
      $exchange.updateConnectionStatus('OFFLINE');
    });
    /*
    ------------
    RECONNECTING
    ------------
    This event is triggered when a reconnection attempt starts
    */

    $exchange.io.on('reconnecting', function () {
      console.log('[PRIMUS] Reconnection process started'); // $exchange.updateConnectionStatus('OFFLINE');
    });
    /*
    -----------
    RECONNECTED
    -----------
    This event is triggered when reconnection is succesful
    and exchange is connected
    */

    $exchange.io.on('reconnected', function () {
      $exchange.updateConnectionStatus('ONLINE');
      console.log('[PRIMUS] Reconnected.'); // // Join the socket to the socket channel on reconnection
      // // Have to change this to subscribe channel terminology

      $exchange.subscribe(_config.channel); // // Sync the publish queue on every reconnect
      // $exchange.syncPublishQueue();

      /** Reload the page on reconnect
       * Socket Queueing will not solve the problem since the scope on the
       * whiteboard will be lost on network disconnect
       * Fix for NSEALL-7559
       */

      $rootScope.$emit('reloadToResyncData', true);
    }); // ---------
    // Syncronizes the publish queue to the DC server via batch updates
    // ---------

    $exchange.syncPublishQueue = function () {
      console.log('Checking publish queue...'); // If queue has data, publish them and sync with server

      if (!publishQueue.isEmpty()) {
        // console.log('Queued msgs found : ', publishQueue.queue);
        // Check if queue has multiple messsages, if so do a
        // batch update
        if (publishQueue.getLength() > 1) {
          console.log('[IO] Sending batch update'); // Send the item in socket

          $exchange.send('batch-update', {
            channel: _config.channel,
            key: 'batch-update',
            event: 'batch-update',
            data: publishQueue.queue
          });
          publishQueue.dequeueAll();
        } else {
          console.log('[IO] Sending single update');
          var item = publishQueue.dequeue(); // Send the item in socket

          $exchange.send(item.event, item);
        }
      }
    };
    /*
    ------
    ERROR
    ------
    This event is triggered when there is an error in exchange
    */


    $exchange.io.on('error', function (err) {
      console.error('[PRIMUS] ' + err);
    });
    /*
    --------
    DATA
    --------
    This event will occur for any data send
    */

    $exchange.io.on('data', function (msg) {
      msg = msg.data && msg.data.length > 1 ? msg.data[1] : msg;

      if (msg.event) {
        console.log("[PRIMUS] Published Message recieved :: ", msg);
        /** Condition check for each event data rececived */

        if (msg.id) {
          $exchange.lastMsgId = msg.id;
        } else {
          /** Executes only on batch update - when user reconnects from internet loss */
          $exchange.lastMsgId++;
        }
      } else {
        console.log("[PRIMUS] Server Message recieved :: ", msg);
      }
    });
  };
  /*
  -----
  CLOSE
  -----
  This will close the exchange connection
  */


  $exchange.close = function () {// Here we can end the socket connection
  };
  /*
  ------------
  SETLASTMSGID
  ------------
  This will update the last message id to the given id
  */


  $exchange.setLastMsgId = function (id) {
    $exchange.lastMsgId = id;
  };
  /*
  ----
  SEND
  ----
  This will send a message to the channel
  */


  $exchange.send = function (event, data) {
    data = data || {};
    data.channel = data.channel || _config.channel;
    data.event = event;
    $exchange.io.send(event, data);
  };
  /*
  --------
  PUBLISH
  --------
  This will publish a message to the channel
  */


  $exchange.publish = function (event, data) {
    data = data || '';

    if (data != '') {
      if (data.publish === undefined) {
        data.publish = true;
      }

      data.publish = !!data.publish; // Cast into a boolean
    }

    $exchange.lastMsgId++; // Check the connection status.

    if ($exchange.connectionAlive) {
      // If online send em on the socket
      $exchange.io.send(event, {
        channel: _config.channel,
        key: event,
        event: event,
        data: data,
        publish: data.publish
      });
    } else {
      // If offline put things into a queue
      // Build the message object
      var msg = {
        channel: _config.channel,
        key: event,
        event: event,
        data: data,
        publish: data.publish
      }; // Enqueue the message

      publishQueue.enqueue(msg);
      console.log('[PRIMUS] No connection. Message Queued.');
    }
  };
  /*
  ---------
  SUBSCRIBE
  ---------
  This will establish the io to a channel in the exchange
  */


  $exchange.subscribe = function (channel) {
    var data = {
      channel: channel,
      userId: _config.userId,
      userRole: _config.userRole,
      lastMsgId: $exchange.lastMsgId,
      deviceType: 'web' // Similarly, sent on the mobile device
      //browserToken: _config.browserToken

    };
    console.log('[PRIMUS] Connecting to exchange channel ', data); // Subscribe user the channel corresponding to activity

    $exchange.io.send('subscribe', data);
  }; //TODO


  $exchange.unsubscribe = function (channel) {// This will unsubscribe the user from the channel
  }; //-------------------------------------------------
  //----------------- EVENT HANDLER -----------------
  //-------------------------------------------------


  $exchange.events = {
    handlers: {},
    // Handler cache - Contains all the event handlers
    mode: 'DEBUG',
    // Other modes - DEVELOPMENT, PRODUCTION
    exportErrors: false,
    // Flag for exporting errors
    exportAPI: null,
    // API to which errors are to be exported
    exportFormat: JSON,
    // The format in which errors are to be exported

    /**
     * Executes the handler that matches the eventname
     * @param  {string} eventName Name of the event
     * @return {void}
     */
    executeHandlers: function executeHandlers(eventName, data) {
      // Get all handlers with the selected name
      var handler = this.handlers[eventName] || [],
          len = handler.length,
          i; // Execute each of the handlers

      for (i = 0; i < len; i++) {
        //you can use apply to specify what "this" and parameters the callback gets
        handler[i].apply(this, [data]);
      }
    },

    /**
     * Listens to the event and executes the callback function when triggered
     * Technically, it pushes the eventname and corresponding handler into handler cache
     * @param  {string} eventName
     * @param  {function} handler Callback function, serves as a event handler
     * @param  {boolean} singleton Flag to specify if handler overwrites previous handlers
     * @return {void}
     */
    on: function on(eventName, handler, singleton) {
      // If singleton it must be one of its kind
      // The handler will replace any existing handlers
      // if specified as a singleton
      //if no handler collection exists, create one
      if (!this.handlers[eventName]) {
        this.handlers[eventName] = [];
      }

      if (singleton) {
        // Empty the handler array
        this.handlers[eventName].length = 0;
      } // Push the handler into the array


      this.handlers[eventName].push(handler);
    },

    /**
     * Executes all the event handlers binded with the event name
     * @param  {string} eventName
     * @return {void}
     */
    trigger: function trigger(eventName, data) {
      // Execute callbacks registered to the event
      this.executeHandlers(eventName, data);
    },

    /**
     * Removes all the event handlers binded with the event name
     * @param  {string} eventName The name of the event
     * @return {void}
     */
    removeHandlers: function removeHandlers(eventName) {
      // Empty the handler array
      this.handlers[eventName].length = 0;
    },

    /**
     * Lists the handlers that are binded with the event name
     * @param  {string} eventName The name of the event
     * @return {void}
     */
    listHandlers: function listHandlers(eventName) {
      // Log all the handlers
      var handlers = this.handlers[eventName];

      if (!handlers.length) {
        console.log('No handlers binded.');
      } else {
        console.log('Handlers found.');

        for (var i = 0; i < handlers.length; i++) {
          console.log('Handler :: ' + handlers[i]);
        }
      }
    },

    /**
     * Returns the count of handlers binded for the given event
     * @param  {string} eventName The name of the event
     * @return {number}           The count of the handlers
     */
    handlerCount: function handlerCount(eventName) {
      return this.handlers[eventName].length;
    }
  }; // Return the $exchange to export it

  return $exchange;
}]);
//# sourceMappingURL=socket.service.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StorageService = /*#__PURE__*/function () {
  function StorageService($q, $location) {
    _classCallCheck(this, StorageService);

    this.$q = $q;
    this.$location = $location;
  }

  _createClass(StorageService, [{
    key: "setItem",
    value: function setItem(key, value) {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      var storageItem = window.sessionStorage.getItem(key);
      return JSON.parse(storageItem);
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      window.sessionStorage.removeItem(key);
    }
  }, {
    key: "clearAll",
    value: function clearAll() {
      window.sessionStorage.clear(); // window.localStorage.clear();
    }
  }, {
    key: "getCookieByName",
    value: function getCookieByName(name) {
      var cookieArr = document.cookie.split(";");

      for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        /* Removing whitespace at the beginning of the cookie name and compare it with the given string */

        if (name == cookiePair[0].trim()) {
          return decodeURIComponent(cookiePair[1]);
        }
      }

      return null;
    }
    /** Can be used later if this seems to be efficient than the above method **/
    // getCookie(key) {
    //   var nameEQ = key + "=";
    //   var ca = document.cookie.split(';');
    //   for(var i=0;i < ca.length;i++) {
    //       var c = ca[i];
    //       while (c.charAt(0)==' ') {
    //         c = c.substring(1,c.length);
    //       }
    //       if (c.indexOf(nameEQ) == 0) {
    //         return c.substring(nameEQ.length,c.length);
    //       }
    //   }
    //   return null;
    // }

  }]);

  return StorageService;
}();

angular.module('digitalclassroom').service('$storage', ["$q", "$location", function ($q, $location) {
  return new StorageService($q, $location);
}]);
//# sourceMappingURL=storage.service.js.map

"use strict";

angular.module('digitalclassroom').service('timerService', ['Auth', '$interval', '$rootScope', '$state', 'userService', 'reportService', function (Auth, $interval, $rootScope, $state, Users, reportService) {
  var Service = {
    //isRunning: false,		// Flag to check if timer is running
    sessionTime: 0,
    // The selected time slot in minutes
    remainingMinutes: 0,
    // Remaining session time in minutes
    frequency: 60000,
    // This controls the timer elapse speed (1000 => 1 sec, 60*1000 => 1 min)
    minuteNotifier: null,
    // Notifies when a minute elapses
    sessionNotifier: null,
    // Notifies when a session notification time triggers
    breakoutNotifier: null,
    // Notifies when breakout time triggers (last 5 mins)
    notifyBefore10: 10,
    // At which minute the 10 minutes to completion notification should be shown
    showNotificationOnStart: false // Flag to check whether to show the notification on start

  };
  /**
   * @ngdoc function
   * @name setTimer
   * @description Sets the timer to given time in seconds
   * @param {Number} time The time value in seconds
   */

  Service.setTime = function (sessionTime, remainingMinutes) {
    try {
      this.sessionTime = parseInt(sessionTime);
      this.remainingMinutes = parseInt(remainingMinutes);

      if (remainingMinutes < this.notifyBefore10) {
        // Show notification if user joins after notified time
        this.showNotificationOnStart = true;
      }
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name start
   * @description Starts the timer to elapse for every minute and trigger a notification at defined intervals
   */


  Service.start = function () {
    try {
      if (this.remainingMinutes <= 0) {
        window.location = '/logout';
      } // Check for the session notification


      if (this.sessionNotifier) {
        // Check for last 10 minutes of session time
        if (this.remainingMinutes === this.notifyBefore10) {
          this.sessionNotifier.call();
        }
      } // Set the timer to 1 minute


      var timerInterval = $interval(function () {
        this.remainingMinutes = this.remainingMinutes - 1; // Check if timer is elapsed to 0, and if so logout the application

        if (this.remainingMinutes <= 0) {
          $interval.cancel(timerInterval); // Setting the service value with ForceLogout state.

          Users.setForceLogout(true);
          var sessionData = Auth.getData();
          var teacherIssueStoredInformation = JSON.parse(window.sessionStorage.getItem('teacherIssueDetails'));
          var affectedUserId = [];

          if (teacherIssueStoredInformation && teacherIssueStoredInformation.selectedParticipant.length > 0) {
            teacherIssueStoredInformation.selectedParticipant.forEach(function (selectedParticipant) {
              affectedUserId.push(selectedParticipant.id);
            });
            var reportInformation = {
              activityId: sessionData.activityId,
              userId: Users.getCurrentUser().id,
              requestFields: {
                summary: 'Digital Classroom Issue',
                description: teacherIssueStoredInformation.customIssueDescription,
                session_id: sessionData.activityId,
                logged_in_device: 'Web',
                time_of_class: teacherIssueStoredInformation.classTime,
                affectedUserIds: affectedUserId
              }
            };
            reportService.submitTeacherIssue(reportInformation).then(function (success) {}, function (error) {});
          }

          $state.go('logout'); //window.location = '/logout';
        } // Call the notifier handler


        if (this.minuteNotifier) {
          this.minuteNotifier.call(this, this.remainingMinutes);
        } // Check for the session notification


        if (this.sessionNotifier) {
          // Check for last 10 minutes of session time
          if (this.remainingMinutes === this.notifyBefore10) {
            this.sessionNotifier.call();
          }
        } // Check for the breakout notifier


        if (this.breakoutNotifier) {
          // Check if session has less than 5 mins
          if (this.remainingMinutes <= 5) {
            this.breakoutNotifier.call();
          }
        }
      }.bind(this), this.frequency);
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name setMinuteNotifier
   * @description Sets the minute notifier handler
   * @param {Function} notifier The notifier handler function
   */


  Service.setMinuteNotifier = function (handler) {
    try {
      this.minuteNotifier = handler;
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name setNotifier
   * @description Sets the session notifier handler
   * @param {Function} notifier The notifier handler function
   */


  Service.setSessionNotifier = function (handler) {
    try {
      this.sessionNotifier = handler;
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name setBreakoutNotifier
   * @description Sets the breakout notifier handler
   * @param {Function} notifier The notifier handler function
   */


  Service.setBreakoutNotifier = function (handler) {
    try {
      this.breakoutNotifier = handler;
    } catch (err) {
      console.log('Error: ' + err);
    }
  }; //==============================================================================
  // SOCKET LISTENERS - Register for the socket events
  //==============================================================================
  // Check for connectivity
  // Exchange on (ONLINE) -> see if remaining time is 0 and if so logout the user
  // This is subject to discussion


  return Service;
}]);
//# sourceMappingURL=timer.service.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ToolbarService = /*#__PURE__*/function () {
  function ToolbarService() {
    _classCallCheck(this, ToolbarService);

    this.defaults = {
      colors: {
        // colors in RGB codes.
        purple: '203, 53, 148',
        green: '109,189,70',
        yellow: '255, 207, 51',
        brown: '152, 105, 40',
        black: '26,26,26',
        blue: '0,130,169',
        red: '241,44,62'
      },
      sizes: {
        s: 1,
        m: 2,
        l: 3
      },
      activeSize: 2,
      activeColor: 'black',
      activeTool: 'default',
      mode: 'default',
      font: {
        size: 16,
        style: 'Helvetica Neue, Helvetica, Arial, sans-serif'
      }
    };
  }

  _createClass(ToolbarService, [{
    key: "getRGB",
    value: function getRGB(color) {
      if (this.defaults.colors[color]) {
        return "rgb(".concat(this.defaults.colors[color], ")");
      }
    }
  }, {
    key: "getRGBA",
    value: function getRGBA(color, opacity) {
      if (this.defaults.colors[color]) {
        return "rgba(".concat(this.defaults.colors[color], ", ").concat(opacity, ")");
      }
    }
  }, {
    key: "getColor",
    value: function getColor(color) {
      return this.getRGB(color);
    }
  }, {
    key: "getSize",
    value: function getSize(size) {
      if (this.defaults.sizes[size]) {
        return this.defaults.sizes[size];
      }
    }
  }, {
    key: "setActiveColor",
    value: function setActiveColor(color) {
      this.defaults.activeColor = color;
    }
  }, {
    key: "getActiveColor",
    value: function getActiveColor() {
      return this.getRGB(this.defaults.activeColor);
    }
  }, {
    key: "getActiveColorAlpha",
    value: function getActiveColorAlpha() {
      return this.getRGBA(this.defaults.activeColor, 0.5);
    }
  }, {
    key: "setActiveSize",
    value: function setActiveSize(size) {
      this.defaults.activeSize = this.getSize(size);
    }
  }, {
    key: "getActiveSize",
    value: function getActiveSize() {
      return this.defaults.activeSize;
    }
  }, {
    key: "setActiveTool",
    value: function setActiveTool(tool) {
      this.defaults.activeTool = tool;

      switch (tool) {
        case 'pencil':
        case 'marker':
        case 'eraser-free':
        case 'line':
        case 'circle':
        case 'square':
        case 'rectangle':
        case 'eraser-path':
          this.defaults.mode = 'erasing';
          break;

        case 'select':
          this.defaults.mode = 'select';
          break;

        case 'textbox':
          this.defaults.mode = 'insertText';
          break;

        default:
          this.defaults.mode = 'default';
      }
    }
  }, {
    key: "getActiveTool",
    value: function getActiveTool() {
      return this.defaults.activeTool;
    }
  }, {
    key: "setMode",
    value: function setMode(mode) {
      this.defaults.mode = mode || 'default';
    }
  }, {
    key: "getMode",
    value: function getMode() {
      return this.defaults.mode;
    }
  }, {
    key: "setFontSize",
    value: function setFontSize(size) {
      this.defaults.font.size = size;
    }
  }, {
    key: "getFontSize",
    value: function getFontSize() {
      return this.defaults.font.size;
    }
  }, {
    key: "setFontStyle",
    value: function setFontStyle(style) {
      this.defaults.font.style = style;
    }
  }, {
    key: "getFontStyle",
    value: function getFontStyle() {
      return this.defaults.font.style;
    }
  }]);

  return ToolbarService;
}();

angular.module('digitalclassroom').service('toolbarService', [function () {
  return new ToolbarService();
}]);
//# sourceMappingURL=toolbar.service.js.map

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserService = /*#__PURE__*/function () {
  function UserService($exchange, Auth, $rootScope, $q, $http) {
    _classCallCheck(this, UserService);

    this.$exchange = $exchange;
    this.Auth = Auth;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$http = $http;
    this.initialized = false;
    this.users = {};
    this.current = null;
    this.teacher = null;
    this.students = [];
    this.forceLogout = false;
    this.callBackUrl = null;
    this.currentActivityId = null;
    this.joinedCount = 0;
    this.ioReady();
  }

  _createClass(UserService, [{
    key: "initUsers",
    value: function initUsers(participants) {
      this.joinedCount = 0;

      for (var i = 0; i < participants.length; i++) {
        // If user is already initialized, update user data
        if (this.users[participants[i].id]) {
          this.updateUser(participants[i]);
        } else {
          // Add the user data to array object
          this.addUser(participants[i]);
        } // Update the joined count


        if (participants[i].role === 'student' && participants[i].joined) {
          this.joinedCount++;
        }
      }

      this.initialized = true; // Set that User service is initialized

      this.current.online = true;
    }
  }, {
    key: "addUser",
    value: function addUser(userData) {
      var userIdFromSession = this.$rootScope.userId;
      userData.userName = userData.firstName + " " + userData.lastName; // Creating named reference for easy references

      this.users[userData.id] = userData;

      if (userData.role === 'teacher') {
        this.teacher = userData;
      } else if (userData.role === 'student') {
        this.students.push(userData);
      } // Check if the user is currently logged in user


      if (userData.id === userIdFromSession) this.current = userData;
    }
  }, {
    key: "updateUser",
    value: function updateUser(userData) {
      var user = this.users[userData.id];
      user.micEnabled = userData.micEnabled;
      user.camEnabled = userData.camEnabled;
      user.micHardMuted = userData.micHardMuted;
      user.camHardMuted = userData.camHardMuted;
      user.joined = userData.joined;
      user.joinedTime = userData.joinedTime;
      user.online = userData.online;
      user.loggedIn = userData.loggedIn;
      user.isAway = userData.isAway;
    }
  }, {
    key: "resetState",
    value: function resetState(user) {
      user.micEnabled = true;
      user.camEnabled = true;
      user.micHardMuted = false;
      user.camHardMuted = false;
    }
  }, {
    key: "setJoinedTime",
    value: function setJoinedTime(userId, joinedTime) {
      var user = this.getUser(userId);

      if (!user) {
        return false;
      }

      user.joined = true;
      user.joinedTime = joinedTime || new Date().getTime();
    }
  }, {
    key: "getUser",
    value: function getUser(userId) {
      var user = this.users[userId];
      return user ? user : false;
    }
  }, {
    key: "getUsers",
    value: function getUsers() {
      return this.users;
    }
  }, {
    key: "getCurrentUser",
    value: function getCurrentUser() {
      return this.current;
    }
  }, {
    key: "getTeacher",
    value: function getTeacher() {
      return this.teacher;
    }
  }, {
    key: "getStudents",
    value: function getStudents() {
      return this.students;
    }
  }, {
    key: "setForceLogout",
    value: function setForceLogout(data) {
      this.forceLogout = data;
    }
  }, {
    key: "getForceLogout",
    value: function getForceLogout() {
      return this.forceLogout;
    }
  }, {
    key: "setCallBackUrl",
    value: function setCallBackUrl() {
      this.callBackUrl = data;
    }
  }, {
    key: "getCallBackUrl",
    value: function getCallBackUrl() {
      return this.callBackUrl;
    }
  }, {
    key: "setCurrentActivityId",
    value: function setCurrentActivityId() {
      this.currentActivityId = data;
    }
  }, {
    key: "getCurrentActivityId",
    value: function getCurrentActivityId() {
      return this.currentActivityId;
    }
  }, {
    key: "getUpdatedUserList",
    value: function getUpdatedUserList() {
      var _this = this;

      var sessionData = this.Auth.getData();

      if (!sessionData.activityId) {
        console.log("Activity ID not available");
      } else {
        return new Promise(function (resolve, reject) {
          _this.$http.get("/api/activity/" + sessionData.activityId + '?' + new Date().getTime()).then(function (response) {
            if (response.data.data) {
              var participants = response.data.data.dcAppData.students;
              participants.push(response.data.data.dcAppData.teacher);
              resolve(participants);
            } else {
              resolve(response.data);
            }
          }, function (response) {
            reject(response.data.errors);
          });
        });
      }
    }
  }, {
    key: "updateDeviceType",
    value: function updateDeviceType(users) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.getUpdatedUserList().then(function (updatedUsers) {
          angular.forEach(updatedUsers, function (value, key) {
            users[value.id].deviceType = value.deviceType;
          });

          if (users) {
            resolve(users);
          } else {
            reject();
          }
        });
      });
    }
  }, {
    key: "onUserJoined",
    value: function onUserJoined(msg) {
      var user = this.getUser(msg.data.userId);

      if (user && !user.joined) {
        this.setJoinedTime(user.id, msg.data.joinedTime);
        this.joinedCount++;
        this.$rootScope.$emit("users-joined", msg);
      }
    }
  }, {
    key: "ioReady",
    value: function ioReady() {
      var _this3 = this;

      this.$exchange.events.on('io:ready', function () {
        _this3.$exchange.io.on('user:online', function (msg) {
          var data = msg.data;

          var user = _this3.getUser(data.userId);

          if (user) {
            user.online = data.status;
            user.expelled = data.expelled;
            user.isAway = data.isAway;

            _this3.$rootScope.$emit("users-updated", msg);
          } else {
            var addUserDeferred = [];

            _this3.getUpdatedUserList().then(function (participants) {
              if (participants) {
                for (var count = 0; count < participants.length; count++) {
                  if (participants[count].id == data.userId) {
                    //Add the new user to the users array.
                    addUserDeferred.push(_this3.addUser(participants[count]));
                  }
                }

                if (addUserDeferred.length > 0) {
                  _this3.$q.all(addUserDeferred).then(function () {
                    _this3.users[data.userId].online = data.status;
                    _this3.users[data.userId].expelled = data.expelled;
                    _this3.users[data.userId].joined = false;

                    _this3.$rootScope.$emit("users-updated", msg);

                    var joinedMsg = {};
                    joinedMsg.data = {
                      channel: msg.channel,
                      userId: msg.data.userId,
                      publish: msg.publish,
                      joinedTime: Date.now()
                    };

                    _this3.onUserJoined(joinedMsg);
                  });
                }
              }
            });
          }
        });

        _this3.$exchange.io.on('user:joined', function (msg) {
          _this3.onUserJoined(msg);
        });
      });
      this.$exchange.events.on('connection-status', function (data) {
        _this3.current.online = data.status;
      });
    }
  }]);

  return UserService;
}();

angular.module('digitalclassroom').service('userService', ['$exchange', 'Auth', '$rootScope', '$q', '$http', function ($exchange, Auth, $rootScope, $q, $http, $) {
  return new UserService($exchange, Auth, $rootScope, $q, $http);
}]);
//# sourceMappingURL=user.service.js.map

"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @service Zoom Service
 * @description All Enablex related APIs are served from here.
 * @param Users - injected user service to get the user details
 */
var VIDEO_QUALITY_90P = 0;
var VIDEO_QUALITY_180P = 1;
var VIDEO_QUALITY_360P = 2;
var VIDEO_QUALITY_720P = 3; // not supported * yet *

var VIDEO_CANVAS = document.getElementById('video-canvas-teacher');
var VIDEO_CANVAS_DIMS = {
  Width: 1280,
  Height: 640
};

function ZoomService(Users, $rootScope, $q, $http, $storage, loggerService) {
  return {
    initiateClient: function initiateClient(signature, topic, audioId, videoId, activeScreen, callback) {
      var _this = this;

      // return $q((resolve, reject) => {
      this.mediaStream;
      this.client = WebVideoSDK["default"].createClient();
      this.chat;
      console.log('audioId', audioId, videoId);

      var _document$getElementB = document.getElementById('participants-container').getBoundingClientRect(),
          width = _document$getElementB.width;

      var _document$getElementB2 = document.getElementById('avchat-section').getBoundingClientRect(),
          height = _document$getElementB2.height;

      this.width = width;
      this.height = height;
      this.teacherCanvasWidth = width;

      if (this.height === 0 && document.getElementById('ot-zoom-screen-sharing-student') && activeScreen === 'screenshare') {
        var _document$getElementB3 = document.getElementById('ot-zoom-screen-sharing-student').getBoundingClientRect(),
            _height = _document$getElementB3.height;

        this.height = _height;
      }

      if (this.height === 0 && document.getElementById('canvas-wrapper') && activeScreen !== 'screenshare') {
        var _document$getElementB4 = document.getElementById('canvas-wrapper').getBoundingClientRect(),
            _width = _document$getElementB4.width,
            _height2 = _document$getElementB4.height;

        this.height = _height2;
        this.teacherCanvasWidth = _width;
      }

      console.log(width, height, 'height width');
      this.teacherCanvas = document.getElementById('video-canvas-teacher');
      this.teacherCanvas.width = this.teacherCanvasWidth;
      this.teacherCanvas.height = this.height;
      this.participantCanvas = document.getElementById('video-canvas-participants');
      this.participantCanvas.width = width;
      this.participantCanvas.height = width / 8 * 0.56; // This is used to find whether it is refreshed, if refreshed the isPageRefreshed is stored in local storage

      var entries = performance.getEntriesByType("navigation");
      var isReload;
      entries.map(function (nav) {
        return isReload = nav.type === 'reload';
      });
      window.localStorage.setItem('isPageRefreshed', isReload); // $q.when(true)

      $q.when().then(function () {
        return _this.initClient();
      }).then(function () {
        return _this.joinSession(signature, topic);
      }).then(function () {
        _this.mediaStream = _this.client.getMediaStream();
        _this.selfId = _this.client.getSessionInfo().userId;
        return true;
      }).then(function () {
        return _this.initiateListener();
      }).then(function () {
        return _this.startVideo();
      }).then(function () {
        return _this.switchCamera(videoId);
      }).then(function () {
        return _this.renderVideo();
      }).then(function () {
        return localStorage.getItem('isPageRefreshed') === 'true' ? true : _this.startAudio();
      }).then(function () {
        return localStorage.getItem('isPageRefreshed') === 'true' ? true : _this.switchMicrophone(audioId);
      }).then(function () {
        return callback();
      })["catch"](function (err) {
        console.log('Error =======>', err);
        loggerService.error("Zoom Initialization Error - ".concat(err.reason), {
          error: err,
          provider: 'zoom'
        });
      });
    },
    initClient: function initClient() {
      var initDefer = $q.defer();
      this.client.init('en-US', "Global").then(function (val) {
        // this.client.init('en-US', `${window.location.origin}/scripts/zoom-libs`).then(val => {
        initDefer.resolve(true);
      }, function (err) {
        initDefer.reject(err);
      });
      return initDefer.promise;
    },
    joinSession: function joinSession(signature, topic) {
      var joinDefer = $q.defer();
      console.log('topic ============>', topic, signature);
      this.client.join(topic, signature, JSON.stringify({
        id: "".concat(Users.current.id),
        role: "".concat(Users.current.role)
      }), '').then(function (success) {
        joinDefer.resolve(true);
      }, function (err) {
        joinDefer.reject(err);
      });
      return joinDefer.promise;
    },
    // await mediaStream?.startShareScreen(shareRef.current);
    // document.getElementById('video-canvas'),
    startShareScreen: function startShareScreen() {
      var screenShareDefer = $q.defer();
      this.mediaStream.startShareScreen(document.getElementById('video-canvas')).then(function (success) {
        screenShareDefer.resolve(true);
      }, function (err) {
        console.log('error ===========>', err, 'error');
        screenShareDefer.reject(err);
      });
      return screenShareDefer.promise;
    },
    stopShareScreen: function stopShareScreen() {
      var screenShareDefer = $q.defer();
      this.mediaStream.stopShareScreen().then(function (success) {
        screenShareDefer.resolve(true);
      }, function (err) {
        console.log('error ===========>', err, 'error');
        screenShareDefer.reject(err);
      });
      return screenShareDefer.promise;
    },
    initiateListener: function initiateListener() {
      var _this2 = this;

      this.client.on('user-added', this.onParticipantChange.bind(this, false, false));
      this.client.on('user-updated', this.onParticipantChange.bind(this, false, true));
      this.client.on('user-removed', this.onParticipantChange.bind(this, false, false));
      this.client.on('passively-stop-share', function () {
        $rootScope.$emit('screen:destroyed');
      }); // this.client.on('peer-video-state-change', );
      // This event used to change the width and height for the canvas while receving the screen share

      this.client.on('share-content-dimension-change', function (payload) {
        if (payload.type === 'received') {
          console.log('share-content-dimension-change ==========>', payload);
          var mainElement = document.getElementById('screenshare-wrapper-student').getBoundingClientRect();
          console.log(mainElement, 'main canvas');
          var viewportElement = document.getElementById('video-canvas-screen-view');
          viewportElement.style.width = "".concat(mainElement.width, "px");
          viewportElement.style.height = "".concat(mainElement.height, "px");
        }
      }); // Active share change event triggred when the host share/stop the screen share

      this.client.on('active-share-change', function (payload) {
        _this2.mediaStream = _this2.client.getMediaStream();
        console.log('active-share-change ==========>', payload);
        var state = payload.state,
            userId = payload.userId;

        if (state === 'Active') {
          _this2.mediaStream.startShareView(document.getElementById('video-canvas-screen-view'), userId);

          document.getElementById('screen-share-offline').style.display = 'none';
          console.log('active screen sharre');
        } else if (state === 'Inactive') {
          _this2.mediaStream.stopShareView();
        }
      });
      return true;
    },

    /**
     * Listening for the new messages.
     * @param {Function} callback - to update the UI accordingly.
     */
    listenForMessage: function listenForMessage(callback) {
      this.client.on('chat-on-message', function (event) {
        console.log(event, 'chat-on-message event'); // Handle Public Message
        // Handle private Message
        // captureData(event, eventData);

        callback(event, event.message);
      });
    },
    onParticipantChange: function onParticipantChange(isLayoutChanged, isUserUpdated) {
      var _this3 = this;

      this.participants = this.client.getAllUser();
      var currentUser = this.client.getCurrentUserInfo();
      this.previousParticipantList = _toConsumableArray(this.otherParticipantsList || []);
      this.otherParticipantsList = this.participants.filter(function (user) {
        return user.bVideoOn;
      });
      var addedSubscribers = this.otherParticipantsList.filter(function (participant) {
        return _this3.previousParticipantList.findIndex(function (previousParticipant) {
          return previousParticipant.userId === participant.userId;
        }) === -1;
      });
      var removedSubscribers = this.previousParticipantList.filter(function (participant) {
        return _this3.otherParticipantsList.findIndex(function (previousParticipant) {
          return previousParticipant.userId === participant.userId;
        }) === -1;
      });
      var unalteredSubscribers = this.otherParticipantsList.length === 0 ? this.participants : this.otherParticipantsList.filter(function (participant) {
        return _this3.previousParticipantList.findIndex(function (previousParticipant) {
          return previousParticipant.userId === participant.userId;
        }) !== -1;
      });
      console.log('this.otherParticipantList=======>', addedSubscribers, 'rem', removedSubscribers);
      console.log('this.Users.students=======>', Users.students, 'rem');
      console.log('unalteredSubscribers=======>', unalteredSubscribers); // this.otherParticipantsList.forEach(participant => {

      if (addedSubscribers.length > 0) {
        addedSubscribers.forEach(function (participant) {
          var participantDetail = JSON.parse(participant.displayName);

          try {
            var teacherBasedCondition = isUserUpdated ? true : _this3.selfId !== participant.userId;
            var studentBasedCondition = isUserUpdated ? participantDetail.role === 'student' : participantDetail.role === 'student' && _this3.selfId !== participant.userId;

            if (participantDetail.role === 'teacher') {
              if (teacherBasedCondition) {
                document.getElementById('canvas-wrapper').style.display = 'block';

                _this3.mediaStream.renderVideo(_this3.teacherCanvas, participant.userId, _this3.teacherCanvas.getBoundingClientRect().width, _this3.teacherCanvas.getBoundingClientRect().height, 0, 0, VIDEO_QUALITY_180P);
              } // this is used to load the screen share for receiver 
              // when a user refresh the page or joins after the screen sharing is started


              if (participant.sharerOn) {
                _this3.mediaStream.startShareView(document.getElementById('video-canvas-screen-view'), participant.userId);

                document.getElementById('screen-share-offline').style.display = 'none';
              }
            } else if (studentBasedCondition) {
              document.getElementById("".concat(participantDetail.id, "-no-video-wrapper")).style.zIndex = -1;
              var sortedStudentList = Users.students.filter(function (student) {
                return student.joinedTime;
              }).sort(function (a, b) {
                return a.joinedTime - b.joinedTime;
              });
              console.log('sortedStudentList ==>', sortedStudentList);

              _this3.mediaStream.renderVideo(_this3.participantCanvas, participant.userId, _this3.width / 8, _this3.width / 8 * 0.56, _this3.width / 8 * sortedStudentList.findIndex(function (student) {
                return student.id == participantDetail.id;
              }), 0, VIDEO_QUALITY_90P); // .then(() => {
              //   document.getElementById(`${participantDetail.id}-no-video-wrapper`).style.zIndex = -1
              // })

            }
          } catch (error) {
            console.log('error====> inside added', error);
            loggerService.error("Zoom Added Subscribers Listener - ".concat(error.reason), {
              role: participantDetail.role,
              userId: participant.userId,
              provider: 'zoom',
              error: error
            });
          }
        });
      }

      if (removedSubscribers.length > 0) {
        removedSubscribers.forEach(function (participant) {
          var participantDetail = JSON.parse(participant.displayName);

          try {
            if (participantDetail.role === 'teacher') {
              _this3.mediaStream && _this3.mediaStream.stopRenderVideo(_this3.teacherCanvas, participant.userId);
              document.getElementById('canvas-wrapper').style.display = 'none';
            } else if (participantDetail.role === 'student') {
              _this3.mediaStream && _this3.mediaStream.stopRenderVideo(_this3.participantCanvas, participant.userId); // .then(() => {
              //   document.getElementById(`${participantDetail.id}-no-video-wrapper`).style.zIndex = 1
              // });

              document.getElementById("".concat(participantDetail.id, "-no-video-wrapper")).style.zIndex = 1;
            }
          } catch (error) {
            console.log('erorr ====> inside remove sub');
            loggerService.error("Zoom Removed Subscribers Listener - ".concat(error.reason), {
              role: participantDetail.role,
              userId: participant.userId,
              provider: 'zoom',
              error: error
            });
          }
        });
      } // IsLayoutChanged then their canvas are updated for unaltered subscribers 


      if (isLayoutChanged) {
        if (unalteredSubscribers.length > 0) {
          unalteredSubscribers.forEach(function (participant) {
            var participantDetail = JSON.parse(participant.displayName);

            try {
              // for teacher video
              if (participantDetail.role === 'teacher') {
                var _this3$mediaStream;

                var canvasWidth = _this3.teacherCanvas.getBoundingClientRect().width;

                var canvasHeight = _this3.teacherCanvas.getBoundingClientRect().height;

                (_this3$mediaStream = _this3.mediaStream) === null || _this3$mediaStream === void 0 ? void 0 : _this3$mediaStream.adjustRenderedVideoPosition(_this3.teacherCanvas, participant.userId, canvasWidth, canvasHeight, 0, 0);
              } else {
                // for participant video
                var sortedStudentList = Users.students.filter(function (student) {
                  return student.joinedTime;
                }).sort(function (a, b) {
                  return a.joinedTime - b.joinedTime;
                });

                var participantCanvasWidth = _this3.participantCanvas.getBoundingClientRect().width;

                if (sortedStudentList.length > 0) {
                  var partWidth = participantCanvasWidth / 8;
                  var partx = participantCanvasWidth / 8 * sortedStudentList.findIndex(function (student) {
                    return student.id == participantDetail.id;
                  });

                  _this3.mediaStream.adjustRenderedVideoPosition(_this3.participantCanvas, participant.userId, partWidth, partWidth * 0.56, partx, 0);
                }
              }
            } catch (error) {
              console.log('error====> inside unaltered', error);
              loggerService.error("Zoom Unaltered Subscribers Listener - ".concat(error.reason), {
                role: participantDetail.role,
                userId: participant.userId,
                provider: 'zoom',
                error: error
              });
            }
          });
        }
      }
    },

    /**
     * canvasDimensions
     * @param {HTMLElement} videoRef - canvas element to which width and heigth need is to be updated
     * @param {HTMLElement} canvasRef - resized width and height from the HTMLelment
     * @param {boolean} canvasRef - boolean value to identify participant tile reize or not
     */
    canvasDimensions: function canvasDimensions(videoRef, canvasRef, isForParticipant) {
      var width, height; // checks whether it is for participant or teacher video

      if (isForParticipant) {
        // width = canvasRef.getBoundingClientRect().width / 8;
        width = canvasRef.getBoundingClientRect().width;
        height = 100;
        console.log('width, ======>', width);
      } else {
        width = canvasRef.getBoundingClientRect().width;
        height = canvasRef.getBoundingClientRect().height;
      } // debounce the new canvas width and height


      var onCanvasResize = function onCanvasResize(_ref) {
        var width = _ref.width,
            height = _ref.height;

        if (videoRef) {
          _.debounce(function () {
            width = arguments.length <= 0 ? undefined : arguments[0];
            height = arguments.length <= 1 ? undefined : arguments[1];
          }, 300);
        }
      };

      this.useSizeCallback(videoRef, onCanvasResize);

      try {
        if (videoRef) {
          videoRef.width = width;
          videoRef.height = height;
        }
      } catch (e) {
        var _this$mediaStream;

        // update the canvas with updated width and height if it has any errors
        (_this$mediaStream = this.mediaStream) === null || _this$mediaStream === void 0 ? void 0 : _this$mediaStream.updateVideoCanvasDimension(videoRef, width, height);
      }
    },

    /**
     * useSizeCallback
     * @param {HTMLElement} target - target canvas need is to be updated
     * @param {function} callback - callback function
     */
    useSizeCallback: function useSizeCallback(target, callback) {
      if (!target) {
        return;
      }

      console.log('target====>', target); // ResizeObserver

      var resizeObserver = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          callback({
            width: entry.target.clientWidth,
            height: entry.target.clientHeight
          });
        });
      });
      resizeObserver.observe(target);
    },

    /**
     * sendMessage
     * @param {object} messageData - JSON data from the controller
     * @param {boolean} isSendMessageToEveryone - boolean value to identify public or private message
     */
    sendMessage: function sendMessage(messageData, isSendMessageToEveryone) {
      var sendMessageDefer = $q.defer();
      this.chat = this.client.getChatClient(); //initialize the chatclient from zoom 

      if (isSendMessageToEveryone) {
        // send message to everyone - public messages
        this.chat.sendToAll(messageData).then(function (success) {
          sendMessageDefer.resolve(true);
        }, function (err) {
          console.log('error ===========>', err, 'error');
          sendMessageDefer.reject(err);
        });
      } else {
        // send message to particular user - private messages
        var recipientUser = this.participants.find(function (user) {
          return JSON.parse(user.displayName).id === JSON.parse(messageData).recipient;
        });
        this.chat.send(messageData, recipientUser.userId).then(function (success) {
          sendMessageDefer.resolve(true);
        }, function (err) {
          console.log('error ===========>', err, 'error');
          sendMessageDefer.reject(err);
        });
      }

      return sendMessageDefer.promise;
    },
    startVideo: function startVideo(callback) {
      var startVideoDefer = $q.defer();
      this.mediaStream.startVideo().then(function (success) {
        if (Users.current.role === 'teacher') {
          document.getElementById('canvas-wrapper').style.display = 'block';
        } else if (Users.current.role === 'student') {
          document.getElementById("".concat(Users.current.id, "-no-video-wrapper")).style.zIndex = -1;
        }

        callback && callback();
        startVideoDefer.resolve(success);
      }, function (err) {
        startVideoDefer.reject(err);
      });
      return startVideoDefer.promise;
    },
    // used to start/stop the local preview from settings section
    startLocalPreviewVideo: function startLocalPreviewVideo(isVideoStarted, activeDeviceId) {
      if (isVideoStarted) {
        this.videoTrack.stop();
      } else {
        this.videoTrack = WebVideoSDK["default"].createLocalVideoTrack(activeDeviceId);
        this.videoTrack.start(document.getElementById('localVideo-preview'));
      }
    },
    // used to render the video based on the selected device
    onSwitchCamera: function onSwitchCamera(key) {
      if (this.videoTrack) {
        this.videoTrack.stop();
        this.videoTrack = WebVideoSDK["default"].createLocalVideoTrack(key);
        this.videoTrack.start(document.getElementById('localVideo-preview'));
      }
    },
    switchMicrophone: function switchMicrophone() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      var defer = $q.defer();
      console.log('id ========>', id);
      this.mediaStream.switchMicrophone(id).then(function (success) {
        defer.resolve(success);
      }, function (err) {
        console.log('err ========>', err);
        defer.reject(err);
      });
      return defer.promise;
    },
    switchCamera: function switchCamera(id, callback) {
      var defer = $q.defer();
      console.log('id ========>', id);
      this.mediaStream.switchCamera(id).then(function (success) {
        defer.resolve(success);
      }, function (err) {
        console.log('err ========>', err);
        defer.reject(err);
      });
      return defer.promise;
    },
    startAudio: function startAudio() {
      var startAudioDefer = $q.defer();
      this.mediaStream.startAudio().then(function (success) {
        console.log('start audion');
        startAudioDefer.resolve(true);
      }, function (err) {
        console.log('error ===========>', err, 'error');
        startAudioDefer.reject(err);
      });
      return startAudioDefer.promise;
    },
    renderVideo: function renderVideo() {
      var renderVideoDefer = $q.defer();
      console.log('render video part gere');

      if (Users.current.role === 'teacher') {
        this.mediaStream.renderVideo(this.teacherCanvas, this.selfId, this.teacherCanvas.getBoundingClientRect().width, this.teacherCanvas.getBoundingClientRect().height, 0, 0, VIDEO_QUALITY_180P).then(function (success) {
          // document.getElementById('canvas-wrapper').style.display = 'block'
          renderVideoDefer.resolve(true);
        }, function (err) {
          console.log('errrrrrr======>>>', err);
          renderVideoDefer.reject(err);
        });
        return renderVideoDefer.promise;
      } else if (Users.current.role === 'student') {
        // returns the array based on the user joined time
        var sortedStudentList = Users.students.filter(function (student) {
          return student.joinedTime;
        }).sort(function (a, b) {
          return a.joinedTime - b.joinedTime;
        });
        console.log('sortedStudentList self==>', sortedStudentList);
        this.mediaStream.renderVideo(this.participantCanvas, this.selfId, this.width / 8, this.width / 8 * 0.56, this.width / 8 * sortedStudentList.findIndex(function (student) {
          return student.id == Users.current.id;
        }), 0, VIDEO_QUALITY_90P).then(function (success) {
          console.log('student video success'); // document.getElementById(`${Users.current.id}-no-video-wrapper`).style.zIndex = -1

          renderVideoDefer.resolve(true);
        }, function (err) {
          console.log('errrrrrr======>>>', err);
          renderVideoDefer.reject(err);
        });
      } else {
        return true;
      }
    },
    muteAudio: function muteAudio(callback) {
      var defer = $q.defer();
      this.mediaStream.muteAudio().then(function (success) {
        callback && callback();
        defer.resolve(success);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    unmuteAudio: function unmuteAudio(callback) {
      var defer = $q.defer();
      this.mediaStream.unmuteAudio().then(function (success) {
        callback && callback();
        defer.resolve(success);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    stopVideo: function stopVideo(callback) {
      var defer = $q.defer();
      this.mediaStream.stopVideo().then(function (success) {
        if (Users.current.role === 'teacher') {
          document.getElementById('canvas-wrapper').style.display = 'none';
        } else if (Users.current.role === 'student') {
          document.getElementById("".concat(Users.current.id, "-no-video-wrapper")).style.zIndex = 1;
        }

        callback && callback();
        defer.resolve(success);
      }, function (err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    destroyClient: function destroyClient(callback) {
      var _this4 = this;

      var dcAppData = $storage.getItem('dcAppData');
      $q.when().then(function () {
        return _this4.mediaStream ? _this4.mediaStream.stopAudio() : true;
      }).then(function () {
        return _this4.mediaStream ? _this4.mediaStream.stopVideo() : true;
      }).then(function () {
        return _this4.client.leave(false).then(function (success) {
          // destoryClient clears the session storage 
          // so the dcAppData is populated bofore refreshing
          $storage.setItem('dcAppData', dcAppData);
        });
      }).then(function () {
        return WebVideoSDK["default"].destroyClient();
      }).then(function () {
        return callback();
      });
    },
    startAndSwitchAudio: function startAndSwitchAudio(audioId) {
      var _this5 = this;

      $q.when().then(function () {
        return _this5.startAudio();
      }).then(function () {
        return _this5.switchMicrophone(audioId);
      });
    }
  };
}

angular.module('digitalclassroom').factory('ZoomService', ['userService', '$rootScope', '$q', '$http', '$storage', 'loggerService', ZoomService]);
//# sourceMappingURL=zoom.service.js.map

"use strict";

/*
	Filter is used to get a string and extract only the first letter of the string and convert it into Uppercase
	Use --> <p>{{ yourWord | firstletter }}</p>
*/
angular.module('substring', []).filter('firstletter', function () {
  return function (text) {
    if (text != null) {
      return text.substring(0, 1).toUpperCase();
    }
  };
});
//# sourceMappingURL=firstLetter.filter.js.map

"use strict";

angular.module('digitalclassroom').filter('orderObjectBy', function () {
  return function (items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function (item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return a[field] > b[field] ? 1 : -1;
    });
    if (reverse) filtered.reverse();
    return filtered;
  };
});
//# sourceMappingURL=orderobjectby.filter.js.map

"use strict";

angular.module('renderHTML', []).filter('to_trusted', ['$sce', function ($sce) {
  return function (text) {
    return $sce.trustAsHtml(text);
  };
}]);
//# sourceMappingURL=renderHtml.filter.js.map

"use strict";

angular.module('digitalclassroom').filter('sortObjectBy', function () {
  return function (users) {
    var teacher = [],
        students = [];

    _.forEach(users, function (user, index) {
      // Separates teacher from student
      user.role == "student" ? students.push(user) : teacher.push(user);
    });

    var sortedStudents = _.sortBy(students, 'userName'); // Sorts the students alphabetically


    var sortedUsers = teacher.concat(sortedStudents); // Concats the teacher with students array

    return sortedUsers;
  };
});
//# sourceMappingURL=sortobjectby.filter.js.map

"use strict";

angular.module('digitalclassroom') // Upper case
// Lower case
// Title case / Capitalize
// Sentence case
.filter('capitalize', function () {
  return function (input, all) {
    return !!input ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }) : '';
  };
}).filter('sentence', function () {
  return function (input) {
    return !!input ? input.replace(input.charAt(0), input.charAt(0).toUpperCase()) : '';
  };
});
//# sourceMappingURL=textcase.filter.js.map

"use strict";

angular.module('truncate', []).filter('characters', function () {
  return function (input, chars, breakOnWord) {
    if (isNaN(chars)) return input;
    if (chars <= 0) return '';

    if (input && input.length > chars) {
      input = input.substring(0, chars);

      if (!breakOnWord) {
        var lastspace = input.lastIndexOf(' '); //get last space

        if (lastspace !== -1) {
          input = input.substr(0, lastspace);
        }
      } else {
        while (input.charAt(input.length - 1) === ' ') {
          input = input.substr(0, input.length - 1);
        }
      }

      return input + '…';
    }

    return input;
  };
}).filter('splitcharacters', function () {
  return function (input, chars) {
    if (isNaN(chars)) return input;
    if (chars <= 0) return '';

    if (input && input.length > chars) {
      var prefix = input.substring(0, chars / 2);
      var postfix = input.substring(input.length - chars / 2, input.length);
      return prefix + '...' + postfix;
    }

    return input;
  };
}).filter('words', function () {
  return function (input, words) {
    if (isNaN(words)) return input;
    if (words <= 0) return '';

    if (input) {
      var inputWords = input.split(/\s+/);

      if (inputWords.length > words) {
        input = inputWords.slice(0, words).join(' ') + '…';
      }
    }

    return input;
  };
}).filter('twodigit', function () {
  return function (input) {
    if (input > 99) {
      return '99+';
    }

    return input;
  };
});
//# sourceMappingURL=truncate.filter.js.map

"use strict";

angular.module('digitalclassroom').filter('trusted', ['$sce', function ($sce) {
  return function (url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);
//# sourceMappingURL=trusted.filter.js.map

"use strict";

angular.module('ucfirstFilters', []).filter('ucfirst', function () {
  /*
  	This filter is equivalent to ucfirst (first letter alplabet in a string)
  	This can be invoked by using the filter as '| ucfirst'. Check the autologin.jade for the implementation
  */
  return function (input, all) {
    return !!input ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }) : '';
  };
});
//# sourceMappingURL=ucfirst.filter.js.map

"use strict";

// SnB integration module
DC.factory('ActiveDevices', [function ($http, $q, $timeout) {
  var inputDevices = {};
  var activeDevices = {
    setInputDevices: function setInputDevices(data) {
      inputDevices = data;
    },
    getInputDevices: function getInputDevices() {
      return inputDevices;
    }
  };
  return activeDevices;
}]);
//# sourceMappingURL=activedevice.factory.js.map

"use strict";

// Analytics Module
angular.module('digitalclassroom').factory('Analytics', ['$timeout', // Dependencies
function ($timeout) {
  // Build Module
  var Analytics = {}; // Interceptor - All analytics event pass through this method. From here, its sent to the ga

  Analytics.sendEvent = function (eventAction, eventCategory, eventLabel) {
    try {
      gtag('event', eventAction, {
        event_category: eventCategory,
        event_label: eventLabel
      });
    } catch (e) {
      console.log("Error with Google Analytics - Event: " + e);
    }
  };

  Analytics.eventAction = function () {
    var eventAction = {
      click: "Click",
      drag: "Drag",
      hover: "Hover"
    };
    return eventAction;
  };

  Analytics.eventCategory = function () {
    var eventCategory = {
      userInteraction: "User Interaction",
      annotationTools: "Annotation Tools"
    };
    return eventCategory;
  }; // Return the Module


  return Analytics;
}]);
//# sourceMappingURL=analytics.factory.js.map

"use strict";

// Authentication Module
DC.service('Auth', [// Dependencies
'$storage', '$q', '$http', 'loggerService', function ($storage, $q, $http, loggerService) {
  // PRIVATE (private variables can be set here)
  var _sessionData = {};
  var _isAuthenticated = false;
  var _isEnabled = true;
  var _isCrossTabsHandled = false; // Build Module

  var Auth = {}; // Authorizes the user

  Auth.authenticate = function (userData) {
    var deferred = $q.defer();

    try {
      // UPDATE authentication cache of data
      //if(_isAuthenticated == true) deferred.resolve(true);
      // Check if all the values are passed
      if (!userData) throw "User data not passed"; //if(!userData.userId) throw "UserId not passed";

      if (!userData.activityId) throw "ActivityId not passed";
      if (!userData.callbackUrl) throw "callbackUrl not passed"; // Send the 'deviceType' as web to identify user device in the Chat window
      // $http.get(`/api/auth/check?activityId=${userData.activityId}&userId=${userData.userId}&deviceType=web&osVersion=${userData.osVersion}&osName=${userData.osName}&browserName=${userData.browserName}&browserVersion=${userData.browserVersion}`)

      var checkActivityBaseUrl = "/api/auth/check?";
      checkActivityBaseUrl += userData.activityId ? "activityId=".concat(userData.activityId) : '';
      checkActivityBaseUrl += userData.userId ? "&userId=".concat(userData.userId) : '';
      checkActivityBaseUrl += "&deviceType=web";
      $http.get(checkActivityBaseUrl).then(function (response, status, headers, config) {
        if (response.data.data) {
          // Set the status flag to true
          _isAuthenticated = true; // Copy the persistant values

          var oldData = Auth.getData(); // Populate the session data

          _sessionData = {
            userId: userData.userId,
            userToken: userData.userToken,
            activityId: userData.activityId,
            callbackUrl: userData.callbackUrl,
            createdBy: userData.createdBy,
            isDiagnosed: oldData && oldData.isDiagnosed && oldData.userId == userData.userId ? oldData.isDiagnosed : false
          }; // Save the data to storage

          Auth.storeData(_sessionData);
          deferred.resolve(response.data.data);
        } else {
          deferred.resolve(false);
        }
      }, function (data, status, headers, config) {
        console.log('Auth API Error', data);
        loggerService.error('Auth API error', data);
        deferred.reject('ERROR');
      });
    } catch (err) {
      console.error('Auth API Error', err);
      loggerService.error('Auth API error', err);
      deferred.reject('ERROR');
    }

    return deferred.promise;
  }; // Returns the Auth status


  Auth.getStatus = function () {
    return _isAuthenticated;
  }; // Resets the Auth data


  Auth.reset = function () {
    _isAuthenticated = false;
    _sessionData = {}; // Unset the storage data

    $storage.clearAll();
    window.localStorage.clear();
  }; // Logs out the user


  Auth.logout = function () {
    // Reset the auth data
    Auth.reset();
  }; // Stores the data into the session store


  Auth.storeData = function (data) {
    $storage.clearAll();
    $storage.setItem('dcAppData', data);
  }; // Gets the data from the session or sessionStorage store


  Auth.getData = function () {
    var storageData = JSON.parse(window.sessionStorage.getItem('dcAppData'));

    if (storageData && storageData.userId == null && storageData.userToken != null) {
      storageData.userId = Auth.getUserId(storageData.userToken);
    }

    return storageData;
  }; // Enables Authentication


  Auth.enable = function () {
    _isEnabled = true;
  }; // Disable Authentication


  Auth.disable = function () {
    _isEnabled = false;
  }; // Checks if authentication is enabled or disabled


  Auth.isEnabled = function () {
    return _isEnabled;
  };

  Auth.setDiagnosed = function (status) {
    var sessionData = $storage.getItem('dcAppData');
    sessionData.isDiagnosed = status;
    $storage.setItem('dcAppData', sessionData);
    window.localStorage.setItem('isDiagnosed', status);
    window.localStorage.setItem('isDiagnosedUser', sessionData.userId);
    window.localStorage.setItem('activityId', sessionData.activityId);
  };

  Auth.isDiagnosed = function () {
    /** The below code is needed for taking the user directly to classroom page from diagnostics based on previously diagnosed status **/
    // let diagnosedUser = localStorage.getItem('isDiagnosedUser');
    // let isDiagnosedFlag = localStorage.getItem('isDiagnosed');
    // let activityIdTaken = localStorage.getItem('activityId');
    //
    // let sessionUser = $storage.getItem('dcAppData');
    // let isSameUser = (diagnosedUser === sessionUser.userId);
    // let isSameSession = (activityIdTaken === sessionUser.activityId);
    // return (isSameUser && isDiagnosedFlag && isSameSession);
    var sessionData = $storage.getItem('dcAppData');
    return sessionData.isDiagnosed;
  };

  Auth.setCrossTabsHandled = function () {
    _isCrossTabsHandled = true;
  };

  Auth.isCrossTabsHandled = function () {
    return _isCrossTabsHandled;
  };

  Auth.getUserId = function (userToken) {
    if (!userToken) return null;
    return JSON.parse(window.atob(userToken.split(".")[1].replace('-', '+').replace('_', '/'))).sub;
  }; // Return the Module


  return Auth;
}]);
//# sourceMappingURL=auth.factory.js.map

"use strict";

angular.module('digitalclassroom').factory('BreakoutRoom', ['$exchange', 'userService', function ($exchange, Users) {
  var defaults = {
    id: null,
    title: 'ROOM',
    timeSlot: 900,
    // Time to end breakouts in seconds
    isActive: false,
    // Flag to set if breakout is active (teacher started all rooms)
    isRunning: false // Flag to set if breakout is running

  };
  var lastOperation = null; // Holds the lastly performed operation (for chaining)

  var signalData = null; // Data used in the last operation (for signalling)

  var Room = function Room(properties) {
    try {
      this.id = properties.id != null || properties.id != undefined ? properties.id : defaults.id;
      this.title = properties.title || defaults.title;
      this.timeSlot = properties.timeSlot * 60 || defaults.timeSlot;
      this.users = [];
    } catch (err) {
      console.log('[User] Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name addUser
   * @description Adds a user into the breakout room
   * @param {Object} user The user object to add to the room
   */


  Room.prototype.addUser = function (user, atIndex) {
    try {
      // [TODO] DB sync the data, no requirement currently
      var userPos = null;

      if (atIndex != undefined) {
        userPos = atIndex;
      } else {
        // Push the user to the last position
        userPos = this.users.length;
      } // Insert user into the room


      this.users.splice(userPos, 0, user); // Update the breakout availability and room id

      user.isAvailableBreakout = false;
      user.breakoutRoom = this.id; // Update the signal data, can be chained

      lastOperation = 'add-user';
      signalData = {
        user: user.id,
        room: this.id,
        index: userPos
      };

      if (this.isActive) {
        if (this.users.length >= 2) {
          this.isRunning = true;
        } // Manipulate the audio levels
        // this.manipulateAudioLevels();

      } // Update user flags


      this.updateUserFlags();
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name removeUser
   * @description Removes a user from the breakout room
   * @param {String} user The user to remove from the room
   */


  Room.prototype.removeUser = function (user, fromIndex) {
    try {
      // [TODO] DB sync the data, no requirement currently
      var userPos = null;

      if (fromIndex != undefined) {
        userPos = fromIndex;
      } else {
        // Find the user position in the room
        for (var i = 0; i < this.users.length; i++) {
          if (user.id === this.users[i].id) {
            userPos = i;
            break;
          }
        }
      } // Remove user from room


      this.users.splice(userPos, 1); // Update breakout availability and room id of user

      user.isAvailableBreakout = true;
      user.breakoutRoom = null; // Update the signal data, can be chained

      lastOperation = 'remove-user';
      signalData = {
        user: user.id,
        room: this.id,
        index: userPos
      };

      if (this.isActive) {
        if (this.users.length < 2) {
          this.isRunning = false; // If teacher in this room, unlink teacher

          if (Users.teacher.breakoutRoom === this.id) {
            Users.teacher.breakoutRoom = null;
            Users.teacher.breakoutRunning = false;
          }
        } // Manipulate the audio levels
        // this.manipulateAudioLevels();

      } // Update user flags


      this.updateUserFlags();
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name removeUser
   * @description Removes a user from the breakout room
   * @param {String} user The user to remove from the room
   */


  Room.prototype.removeAllUsers = function () {
    try {
      // Taking copy since reference will be modified
      var length = this.users.length;

      for (var i = 0; i < length; i++) {
        // Remove at 0 always since user will be spliced at 0
        this.removeUser(this.users[0], 0);
      }
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name start
   * @description Starts the breakout room
   */


  Room.prototype.start = function () {
    try {
      // Skip if breakouts is already running
      if (this.isActive && this.isRunning) {
        return;
      } // Set that room is active for running breakouts


      this.isActive = true; // Skip the breakout if less than two students are in room

      if (this.users.length < 2) {
        return;
      } // Set the running flag to true


      this.isRunning = true; // Manipulate the audio levels
      // this.manipulateAudioLevels();
      // Update user flags

      this.updateUserFlags();
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name stop
   * @description Stops the breakout room
   */


  Room.prototype.stop = function () {
    try {
      // Skip if breakouts is not running
      if (!this.isActive || !this.isRunning) {
        return;
      } // Set that room is active for running breakouts


      this.isActive = false;
      this.isRunning = false; // Manipulate the audio levels
      // this.manipulateAudioLevels();
      // Update user flags

      this.updateUserFlags();
    } catch (err) {
      console.log('Error: ' + err);
    }
  };
  /**
   * @ngdoc function
   * @name manipulateAudioLevels
   * @description Manipulates the audio levels for the participants in the class
   */

  /*Room.prototype.manipulateAudioLevels = function () {
  		try {
  			// Breakout is running
  		if (this.isRunning) {
  				// If current user is in room, disable audio of users outside this room
  			if (Users.current.breakoutRoom == this.id) {
  					// Mute teacher
  				var teacher = Users.getTeacher();
  					teacher.breakoutMuted = true;
  					OTS.disableAudio(teacher.id);
  					// Mute students
  				var students = Users.getStudents();
  					for (var i=0; i < students.length; i++) {
  						// Disable audio if participant is not in room
  					if (students[i].breakoutRoom != this.id) {
  							students[i].breakoutMuted = true;
  							OTS.disableAudio(students[i].id);
  					}
  					// Enable audio if participant is in room
  					else {
  						students[i].breakoutMuted = false;
  							OTS.enableAudio(students[i].id);
  					}
  				}
  			}
  			else {
  				// Disable audio of users in this room
  				for (var i=0; i < this.users.length; i++) {
  						this.users[i].breakoutMuted = true;
  						OTS.disableAudio(this.users[i].id);
  				}
  			}
  		}
  		// Breakout is not running
  		else {
  				// If current user is in room, enable audio of users not in breakout
  			if (Users.current.breakoutRoom == this.id) {
  					// Unmute teacher
  				var teacher = Users.getTeacher()
  					teacher.breakoutMuted = false;
  					OTS.enableAudio(teacher.id);
  					// Unmute the audio of original room users
  				var users = Users.getStudents();
  					for (var i=0; i < users.length; i++) {
  						if (users[i].isAvailableBreakout) {
  							users[i].breakoutMuted = false;
  							OTS.enableAudio(users[i].id);
  					}
  				}
  			}
  			else {
  				// If current user in original room, Enable audio of room users
  				var users = this.users;
  					for (var i=0; i < users.length; i++) {
  						users[i].breakoutMuted = false;
  						OTS.enableAudio(users[i].id);
  				}
  			}
  		}
  	}
  	catch(err){
  		console.log('Error: ' + err);
  	}
  	finally{
  		return this;
  	}
  };*/

  /**
   * @ngdoc function
   * @name updateUserFlags
   * @description Updates the users flags to the room running status
   */


  Room.prototype.updateUserFlags = function () {
    // Update all the current room users running flags to rooms running status
    // This is to manipulate notification on the participant panel
    for (var i = 0; i < this.users.length; i++) {
      this.users[i].breakoutRunning = this.isRunning;
    } // If teacher is in this room, update teacher flag


    if (Users.teacher.breakoutRoom === this.id) {
      Users.teacher.breakoutRunning = this.isRunning;
    }
  };
  /**
   * @ngdoc function
   * @name signal
   * @description Signals the last performed operation data
   */


  Room.prototype.signal = function (noCheck) {
    try {
      if (lastOperation && signalData) {
        signalData.noCheck = noCheck || false; // Send a socket message

        $exchange.publish('breakout:' + lastOperation, signalData); // Empty the signal data

        lastOperation = null;
        signalData = null;
      }
    } catch (err) {
      console.log('Error: ' + err);
    }
  };

  return Room;
}]);
//# sourceMappingURL=breakoutroom.factory.js.map

"use strict";

DC.factory('Chat', [// Dependencies
'$http', '$q', // Callback
function chatService($http, $q) {
  var chat = {}; // RegExp to check availability of email in the chat messages

  var emailRegExp = new RegExp('((http|https)\:\/\/)?' + // protocol
  '((([A-Za-z\\d]([A-Za-z\\d-]*[A-Za-z\\d])?)\\.)+[A-Za-z]{1,}|' + // domain name
  '((\\d{1,3}\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(:\\d+)?(/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '([A-Z0-9+&@#/%=~_|$])', 'i'); // fragment locater
  // Holds the emoji name, title and html equivalent code

  chat.emojiArr = [{
    "name": ":smile:",
    "title": "smile",
    "html": "<i class='emoji emoji_smile'></i>"
  }, {
    "name": ":laugh:",
    "title": "laugh",
    "html": "<i class='emoji emoji_laugh'></i>"
  }, {
    "name": ":sad:",
    "title": "sad",
    "html": "<i class='emoji emoji_sad'></i>"
  }, {
    "name": ":angry:",
    "title": "angry",
    "html": "<i class='emoji emoji_angry'></i>"
  }, {
    "name": ":confused:",
    "title": "confused",
    "html": "<i class='emoji emoji_confused'></i>"
  }, {
    "name": ":wink:",
    "title": "wink",
    "html": "<i class='emoji emoji_wink'></i>"
  }, {
    "name": ":determined:",
    "title": "determined",
    "html": "<i class='emoji emoji_determined'></i>"
  }, {
    "name": ":awkward:",
    "title": "awkward",
    "html": "<i class='emoji emoji_awkward'></i>"
  }]; // Emoticon map required because, we don't want expose
  // :smile: like usage to user for smileys
  // Same smiley can have one or more shortcuts,
  // example: Smile could be :) or :-)

  chat.emoticonMap = {
    ":)": ":smile:",
    ":-)": ":smile:",
    ":D": ":laugh:",
    ":-D": ":laugh:",
    ":(": ":sad:",
    ":-(": ":sad:",
    ":-@": ":angry:",
    ":@": ":angry:",
    ":-/": ":confused:",
    ":/": ":confused:",
    ";)": ":wink:",
    ";-)": ":wink:",
    ":-%": ":determined:",
    ":%": ":determined:",
    ":-!": ":awkward:",
    ":!": ":awkward:"
  }; // Creates user array to maintain message sync even when the user does not select the chat user from chatlist

  chat.generateUserArr = function (arrayType, users, currentUser) {
    var chatUsers = {
      'EVERYONE': null
    }; // Creates array with value as array - to maintain user messages

    if (arrayType == 'userArr') {
      chatUsers['EVERYONE'] = [];

      _.forEach(users, function (user, index) {
        if (user.id != currentUser.id) {
          chatUsers[user.id] = [];
        }
      });
    } // Creates array with value as integer - to maintain notification count
    else if (arrayType == 'notificationArr') {
        chatUsers['EVERYONE'] = 0;

        _.forEach(users, function (user, index) {
          if (user.id != currentUser.id) {
            chatUsers[user.id] = 0;
          }
        });
      }

    return chatUsers;
  };
  /** Update the new user by adding him to the existing array
   * @param {string} arrayType - flag for handling user and notification array
   * @param {array} users - list of existing users
   * @param {string} newUser - id of the newly joined user
   * @returns {array}
   */


  chat.updateUserArr = function (arrayType, users, newUser) {
    if (arrayType == 'userArr') {
      users[newUser] = [];
    }
    /** condition for 'notificationArr' */
    else {
        users[newUser] = 0;
      }

    return users;
  }; // Manipulates the incoming message before displaying in the div
  // Frame the chat message before binding to the div


  chat.formatChatMessage = function (input, usersArr, currentUser) {
    if (input && input.text) {
      var message = input.text;
      var taggedUserName = '';
      var messageWithEmojis = '';
      var messagewithUrl = '';
      var choppedMessage;

      if (input.taggedTo != '') {
        taggedUserName = usersArr[input.taggedTo].role == 'student' ? usersArr[input.taggedTo].userName.trim() : 'Teacher';
        var isTagged = input.text.startsWith("@" + taggedUserName);

        if (isTagged) {
          message = message.replace("@" + taggedUserName, "");
        }
      }

      if (!emailRegExp.test(message)) {
        // If the Message doesnt have valid url
        messageWithEmojis = chat.includeEmojis(message);
      } else {
        message = message.replace(/,/g, " ,");
        choppedMessage = message.split(/\s+/); // Split message with space and the newline

        for (var index = 0; index < choppedMessage.length; ++index) {
          if (emailRegExp.test(choppedMessage[index])) {
            if (choppedMessage[index].match(/http/i) || choppedMessage[index].match(/www/i)) {
              // If the Chopped Message doesn't starts with http but it has valid url in the middle
              var indexOfUrl = choppedMessage[index].toLowerCase().indexOf("http");

              if (indexOfUrl == -1) {
                // If the Chopped Message doesn't starts with http but it has valid url by starting with www
                indexOfUrl = choppedMessage[index].toLowerCase().indexOf("www.");
                choppedMessage[index] = choppedMessage[index].toLowerCase().replace("www.", "http://www.");
              } //Separate the valid Url and add href tag to it and make it as link


              var stringB4Url = choppedMessage[index].substring(0, indexOfUrl);
              var choppedValidUrl = choppedMessage[index].substring(indexOfUrl, choppedMessage[index].length).toLowerCase();
              stringB4Url = chat.includeEmojis(stringB4Url);
              choppedMessage[index] = stringB4Url + "<a target='_blank' href=" + choppedValidUrl + "/>" + choppedValidUrl + "</a>";
            }
          } else {
            // If the Chopped Message doesnt have valid url
            choppedMessage[index] = chat.includeEmojis(choppedMessage[index]);
          }
        }

        messagewithUrl = choppedMessage.join(" "); // Joined the Chopped Messsages into One ----example 'apple tree'----
      }

      var chatObj = {
        isCurrentUser: usersArr[input.sender.id].id == currentUser.id ? true : false,
        senderRole: usersArr[input.sender.id].role == 'teacher' ? 'teacher' : '',
        taggedUser: taggedUserName,
        taggedUserId: input.taggedTo ? usersArr[input.taggedTo].id : '',
        message: messageWithEmojis ? messageWithEmojis : messagewithUrl,
        fromUser: usersArr[input.sender.id].userName.trim(),
        fromUserId: input.sender.id,
        currentUser: usersArr[currentUser.id].userName.trim(),
        currentUserId: currentUser.id,
        chatHeader: '',
        toUser: '',
        //To be used for private chat
        toUserId: input.recipient //unreadMessage:''

      };
      chatObj.chatHeader = chatObj.taggedUser ? "<span>@" + chatObj.taggedUser + "</span> " + chatObj.message : chatObj.message;
      /*if(input.unreadMsg == true){
      	if(input.showBand == true){
      		chatObj.unreadMessage = 'true';
      	}
      }*/

      return chatObj;
    }
  }; // Includes emojis' at appropriate areas


  chat.includeEmojis = function (message) {
    var formattedMessage = message;
    angular.forEach(chat.emoticonMap, function (value, key) {
      var emoticon = null;

      for (var emoji in chat.emojiArr) {
        if (value == chat.emojiArr[emoji].name) {
          emoticon = chat.emojiArr[emoji].html;
        }
      }

      var replaceEmojis = formattedMessage.split(key).join(emoticon);
      formattedMessage = replaceEmojis;
    });
    return formattedMessage;
  }; // Checks if the chat message has only emoji or contains text content too


  chat.hasOnlyEmoji = function (message) {
    return chat.emoticonMap[message.text.trim()] != undefined; // if(chat.emoticonMap[message.text.trim()]!= undefined){
    // 	return true;
    // }else{
    // 	return false;
    // }
  }; // Function to map the emoji name with their code


  chat.invertedEmojiMap = function (obj) {
    for (var emoji in chat.emoticonMap) {
      if (chat.emoticonMap[emoji] == obj) {
        return emoji;
      }
    }
  }; // Function to get sum of all notification
  // Used to display at header band


  chat.totalNotificationCount = function (users) {
    var notificationSum = 0;
    angular.forEach(users, function (value, key) {
      notificationSum = notificationSum + value;
    });
    return notificationSum;
  }; // Function call to recalculate notification on the header band


  chat.calculateHeaderNotification = function (chatArr, currentUser) {
    var notificationSum = chat.totalNotificationCount(chatArr);
    var minusCurrentUser = notificationSum - chatArr[currentUser];
    return minusCurrentUser;
  }; // Service call to fetch the public chat history from the database


  chat.fetchPublicChat = function (activityId) {
    var deferred = $q.defer();
    var req = {
      method: 'GET',
      url: "/api/chat/getPublicChat/" + activityId
    }; // API request to fetch public chat history

    $http(req).then(function (response, status, headers, config) {
      deferred.resolve(response.data.data);
    }, function (response, status, headers, config) {
      deferred.reject(response.data.data);
    });
    return deferred.promise;
  }; // Service call to fetch private chat history


  chat.fetchPrivateChat = function (activityId, userId) {
    var deferred = $q.defer();
    var req = {
      method: 'GET',
      url: "/api/chat/getPrivateChat/" + activityId + "/" + userId
    }; // API request to fetch public chat history

    $http(req).then(function (response, status, headers, config) {
      deferred.resolve(response.data.data);
    }, function (response, status, headers, config) {
      deferred.reject(response.data.data);
    });
    return deferred.promise;
  }; // Service call to fetch the notification count from the database


  chat.fetchNotificationCount = function (activityId, userId) {
    var deferred = $q.defer(); // API request to fetch notification count

    $http.get("/api/chat/getNotificationCount/" + activityId + "/" + userId).then(function (response, status, headers, config) {
      deferred.resolve(response.data.data);
    }, function (response, status, headers, config) {
      deferred.reject(response.data.data);
    });
    return deferred.promise;
  };

  return chat;
}]);
//# sourceMappingURL=chat.factory.js.map

"use strict";

// CMS - PPT content - APIs and methods
DC.factory('cms', [// Dependencies
'$q', '$http', function ($q, $http) {
  // Build Module
  var cms = {}; // Method to request class type name that matches the OSCAR API request name

  cms.formatClassTypeName = function (input) {
    if (input && input.length) {
      // Converts the input string to lowercase
      var toLowerCase = input.toLowerCase(); // Replaces all instances of space to underscore 
      // To match the request name of OSCAR APIs'

      var oscarClassName = toLowerCase.replace(/ /g, '_');
      return oscarClassName;
    }

    return input;
  }; // Fetches the PPT based on the input filter params


  cms.fetchPPTs = function (input) {
    // Framing the input for classType and null check of the params
    var classDetails = this.framePPTRequest(input);
    var deferred = $q.defer();
    $http.get("/api/cms/fetchPPTs/" + classDetails["class"] + "/" + classDetails.unit + "/" + classDetails.stage).then(function (response, status, headers, config) {
      deferred.resolve(response.data.data);
    }, function (response, status, headers, config) {
      deferred.reject(response.data.data);
    });
    return deferred.promise;
  }; // Format PPT request messge


  cms.framePPTRequest = function (input) {
    if (input) {
      var classDetails = {
        "class": input["class"] ? input["class"] : null,
        unit: input.unit ? input.unit : null,
        // For Online Encounter
        stage: input.stage && input.stage.length > 0 ? input.stage : null // For other class types

      };
    }

    return classDetails;
  }; // Method to handle the stage mapping corresponds to each classTypes


  cms.stageMapping = function (input) {
    var stageValues;

    switch (input) {
      case 'OSCAR':
        stageValues = {
          0: "l1",
          1: "l2",
          2: "waystage",
          3: "upper_waystage",
          4: "threshold",
          5: "milestone",
          6: "mastery"
        };
        break;

      case 'S&B':
        stageValues = {
          "L1": {
            id: 0
          },
          "L2": {
            id: 1
          },
          "N2": {
            id: 2
          },
          "N3": {
            id: 3
          },
          "N4": {
            id: 4
          },
          "N5": {
            id: 5
          },
          "N6": {
            id: 6
          }
        };
        break;

      default:
        stageValues = null;
    }

    return stageValues;
  }; // Method to sort the least stage name using the stage mapping value and classType as input


  cms.sortLeastStage = function (input) {
    var stageValues = cms.stageMapping('S&B'); // Rating for the stages. E.g.: 4

    var stageRatings = [];

    try {
      if (input.stage.length > 0) {
        // List of stage values obtained from S&B
        // Values received as an array
        var stages = input.stage;

        for (var stage = 0; stage < stages.length; stage++) {
          stageRatings.push(stageValues[stages[stage]].id);
        } // Using 'apply', pass the Math as argument to enable 
        // find min value in an array instead of the passing only 2 parms


        var minValue = Math.min.apply(Math, stageRatings);
        var oscarStageValues = cms.stageMapping('OSCAR');
        return oscarStageValues[minValue];
      }
    } catch (exception) {
      // If there is no stage value provided as input
      return null;
    }
  }; // Return the cms module


  return cms;
}]);
//# sourceMappingURL=cms.factory.js.map

"use strict";

/*
---------------
MODULE :: QUEUE
---------------
A function to represent a queue

--------
Source : 
--------
Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:
http://creativecommons.org/publicdomain/zero/1.0/legalcode

----------
Modified :
----------
DCTEAM..
The whole library is rebiased to fix some of the issues we noticed in memory leaks
and made the functional sharing with my best friend Prototype.
*/
DC.factory('Queue', [// Callback
function () {
  /*var Queue = function () {
  		// initialise the queue and offset
  	this.queue  = [];
  	this.offset = 0;
  };*/

  /**
   * @ngdoc function
   * @name  Events
   * @description
   * Creates a event manager. This can be extended by any other factory or service
   * and inherit all the event handling functions.
   */
  var Events = {
    handlers: {},
    // Handler cache - Contains all the event handlers
    mode: 'DEBUG',
    // Other modes - DEVELOPMENT, PRODUCTION
    exportErrors: false,
    // Flag for exporting errors
    exportAPI: null,
    // API to which errors are to be exported
    exportFormat: JSON,
    // The format in which errors are to be exported

    /**
     * Executes the handler that matches the eventname
     * @param  {string} eventName Name of the event
     * @return {void}
     */
    executeHandlers: function executeHandlers(eventName, data) {
      // Get all handlers with the selected name
      var handler = this.handlers[eventName] || [],
          len = handler.length,
          i; // Execute each of the handlers

      for (i = 0; i < len; i++) {
        //you can use apply to specify what "this" and parameters the callback gets
        handler[i].apply(this, [data]);
      }
    },

    /**
     * Listens to the event and executes the callback function when triggered
     * Technically, it pushes the eventname and corresponding handler into handler cache
     * @param  {string} eventName
     * @param  {function} handler Callback function, serves as a event handler
     * @param  {boolean} singleton Flag to specify if handler overwrites previous handlers
     * @return {void}
     */
    on: function on(eventName, handler, singleton) {
      // If singleton it must be one of its kind
      // The handler will replace any existing handlers
      // if specified as a singleton
      //if no handler collection exists, create one
      if (!this.handlers[eventName]) {
        this.handlers[eventName] = [];
      }

      if (singleton) {
        // Empty the handler array
        this.handlers[eventName].length = 0;
      } // Push the handler into the array


      this.handlers[eventName].push(handler);
    },

    /**
     * Executes all the event handlers binded with the event name
     * @param  {string} eventName
     * @return {void}
     */
    trigger: function trigger(eventName, data) {
      // Execute callbacks registered to the event
      this.executeHandlers(eventName, data);
    },

    /**
     * Removes all the event handlers binded with the event name
     * @param  {string} eventName The name of the event
     * @return {void}
     */
    removeHandlers: function removeHandlers(eventName) {
      // Empty the handler array
      this.handlers[eventName].length = 0;
    },

    /**
     * Lists the handlers that are binded with the event name
     * @param  {string} eventName The name of the event
     * @return {void}
     */
    listHandlers: function listHandlers(eventName) {
      // Log all the handlers
      var handlers = this.handlers[eventName];

      if (!handlers.length) {
        console.log('No handlers binded.');
      } else {
        console.log('Handlers found.');

        for (var i = 0; i < handlers.length; i++) {
          console.log('Handler :: ' + handlers[i]);
        }
      }
    },

    /**
     * Returns the count of handlers binded for the given event
     * @param  {string} eventName The name of the event
     * @return {number}           The count of the handlers
     */
    handlerCount: function handlerCount(eventName) {
      return this.handlers[eventName].length;
    }
  };
  return Events;
}]);
//# sourceMappingURL=events.factory.js.map

"use strict";

// File upload APIs and methods
DC.factory('fileupload', [// Dependencies
'Upload', '$q', '$http', function (Upload, $q, $http) {
  // Build Module
  var fileUpload = {}; // Uploads the selected files to the URL

  fileUpload.uploadFiles = function (file, activityId, success, error, progress) {
    if (file) {
      /** The below line is edited based on sonarqube suggestion **/
      // var upload = Upload.upload({
      Upload.upload({
        url: '/api/externalfiles/uploadImageFiles',
        method: 'POST',
        data: {
          file: file,
          activityId: activityId
        }
      }).then(function (response) {
        // Sends the success response details
        success(response);
      }, function (response) {
        // Sends the error response details
        error(response);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        var fileData = {
          file: evt.config._file,
          progress: progressPercentage,
          loadedSize: evt.loaded
        }; // Event called on file progress change
        // Sends the progress value

        progress(fileData);
      });
    }
  }; // Method to fetch all the uploaded files corresponding to the activity


  fileUpload.fetchUploadedFiles = function (activityId) {
    var deferred = $q.defer();
    $http.get("/api/externalfiles/fetchUploadedFiles/" + activityId).then(function (response, status, headers, config) {
      deferred.resolve(response.data.data);
    }, function (response, status, headers, config) {
      deferred.reject(response.data.data);
    });
    return deferred.promise;
  }; // Method to delete the uploaded file corresponding to the activity


  fileUpload.deleteUploadedFile = function (filePath, activityId) {
    var deferred = $q.defer();
    $http.post("/api/externalfiles/deleteUploadedFile", {
      filePath: filePath,
      activityId: activityId
    }).then(function (response, status, headers, config) {
      deferred.resolve(response.data.data);
    }, function (response, status, headers, config) {
      deferred.reject(response.data.data);
    });
    return deferred.promise;
  }; // Method implementing recursive functionality in handling duplicate files
  // Adds '(number)' to the suffix of the file with same name


  fileUpload.sortDuplicateFiles = function (data) {
    var files = data;
    var uniqueFiles = [];
    var regExp = /\((.*)\)/i;
    var index = 0;

    for (var i = 0; i < files.length; i++) {
      for (var j = 0; j < files.length; j++) {
        if (i == j) {
          uniqueFiles.push(files[i]);
        } else {
          if (files[i].name != files[j].name) {
            uniqueFiles.push(files[j]);
          } else {
            if (files[j].name.indexOf("(") >= 0) {
              var fileIndex = 1 + parseInt(files[j].name.match(regExp)[1]);
              files[j].name = files[j].name.split("(")[0] + "(" + fileIndex + ")";
            } else {
              files[j].name = files[j].name + "(" + (index + 1) + ")";
            }

            uniqueFiles.push(files[j]);
          }
        }
      }

      files = uniqueFiles;
      uniqueFiles = [];
    }

    return files;
  };
  /** Checks and add the canDelete flag to the files */


  fileUpload.canDeleteFiles = function (uniqueFiles, mountedImages) {
    angular.forEach(uniqueFiles, function (value, key) {
      value.canDelete = true;
    });

    for (var i in mountedImages) {
      for (var j in uniqueFiles) {
        if (mountedImages[i].name === uniqueFiles[j].name) {
          uniqueFiles[j].canDelete = false;
        }
      }
    }

    return uniqueFiles;
  };
  /** Removes the closed board's file(image/ppt) from the mountedImages array */


  fileUpload.isObjectExists = function (data, mountedImages) {
    if (mountedImages.length > 0) {
      for (var i = 0; i < mountedImages.length; i++) {
        if (mountedImages[i].index === data.index) {
          if (data.action === 'ppt' || mountedImages[i].name === data.name) {
            mountedImages.splice(i, 1);
            return mountedImages;
          }
        } // if(data.action === 'ppt' && mountedImages[i].index === data.index) {
        // 	mountedImages.splice(i,1);
        // 	return mountedImages;
        // } else if (mountedImages[i].index === data.index && mountedImages[i].name === data.name) {
        // 	mountedImages.splice(i,1);
        // 	return mountedImages;
        // }

      }
    }

    return mountedImages;
  };
  /** Board index changes on deleting a board. If 2nd board is deleted,
   * all board >2 gets affected by index change
   */


  fileUpload.rearrangeBoardIndex = function (data, mountedImages) {
    for (var i in mountedImages) {
      if (mountedImages[i].index > data.index) {
        mountedImages[i].index--;
      }
    }

    return mountedImages;
  };
  /** Return the Module */


  return fileUpload;
}]);
//# sourceMappingURL=fileupload.factory.js.map

"use strict";

/**
 * @service NavigatorMediaDevices
 * @description
 */
function NavigatorMediaDevices() {
  return {
    /**
     * Returns whether the browser supports enumerateDevices.
     */
    isMediaDevicesAvailable: function isMediaDevicesAvailable() {
      return !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices;
    },

    /**
     * To get the stream with the desired devices.
     * @param {Object} constraints - contains whether to subscribe to audio or video.
     */
    getUserMedia: function getUserMedia(constraints) {
      return new Promise(function (resolve, reject) {
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
          resolve(stream);
        })["catch"](function (err) {
          reject(err);
        });
      });
    },

    /**
     * Handler for listening newly added device
     * @param {Function} callback 
     */
    ondevicechange: function ondevicechange(callback) {
      // used to destroy the event handler
      this.onDeviceChangeCallback = callback;
      navigator.mediaDevices.addEventListener('devicechange', callback);
    },

    /**
     * To enumerate all the available devices.
     * @param {Function} callback - to callback success handler function
     */
    enumerateDevices: function enumerateDevices(callback) {
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        var inputDevices = devices.filter(function (device) {
          return device.kind.includes('input');
        });
        var audioTracks = inputDevices.filter(function (device) {
          return device.kind.includes('audio');
        });
        var videoTracks = inputDevices.filter(function (device) {
          return device.kind.includes('video');
        });
        return callback(inputDevices, audioTracks, videoTracks);
      })["catch"](function (err) {
        console.log('Permission denied');
      });
    },

    /**
     * Remove the event listener listening for the newly added device
     */
    removeOnDeviceChangeHandler: function removeOnDeviceChangeHandler() {
      navigator.mediaDevices.removeEventListener('devicechange', this.onDeviceChangeCallback);
    }
  };
}

angular.module('digitalclassroom').factory('NavigatorMediaDevices', [NavigatorMediaDevices]);
//# sourceMappingURL=media-devices.factory.js.map

"use strict";

DC.factory("notificationService", ['Auth', '$timeout', // Dependencies
// Callback
function (Auth, $timeout) {
  var queue = [];
  var wbqueue = [];
  var bndw_queue = [];
  var notify = {};

  notify.getQueue = function (value) {
    if (value == "alert") return wbqueue;
    if (value == "user") return queue;
    if (value == "bandwidth") return bndw_queue;
  }; //user joined notification - in future this system will be replaced in the below alertNotification system, since a common notification system for the application.


  notify.userjoin = function (userName) {
    //var joinSound = ngAudio.load("/sounds/join.mp3");
    var notification = {
      'type': "joined",
      'userName': userName,
      //'sound' : joinSound,
      'duration': 3000
    };
    return this.makeNotification(notification);
  }; //user left notification - in future this system will be replaced in the below alertNotification system, since a common notification system for the application.


  notify.userleft = function (userName) {
    //var joinSound = ngAudio.load("/sounds/join.mp3");
    var notification = {
      'type': "left",
      'userName': userName,
      //'sound' : joinSound,
      'duration': 3000
    };
    return this.makeNotification(notification);
  }; //userleft and userjoined notification system - in future this system will be replaced in the below alertNotification system, since a common notification system for the application.


  notify.makeNotification = function (notification) {
    queue.push(notification); //notification.sound.play();

    notification.animation = true;
    $timeout(function () {
      notification.animation = false;
      $timeout(function () {
        notify.removeFromQueue(notification, queue);
      }, 2000);
    }, notification.duration);
    return notification;
  }; //common function to trigger the notification on top of the whiteboard


  notify.alert = function (type, msg) {
    var notification = {
      'type': type,
      'msg': msg,
      'duration': 3000
    };
    return this.makeAlertNotification(notification);
  }; //common system to keep all the notification in the queue


  notify.makeAlertNotification = function (notification) {
    wbqueue.push(notification);
    notification.animation = true;
    $timeout(function () {
      notification.animation = false;
      $timeout(function () {
        notify.removeFromQueue(notification, wbqueue);
      }, 2000);
    }, notification.duration);
    return notification;
  };

  notify.removeFromQueue = function (notification, value) {
    value.splice(value.indexOf(notification), 1);
  };

  notify.alertBandwidth = function (type, msg) {
    var notification = {
      'type': type,
      'msg': msg,
      'duration': 5000
    };
    return this.makeBandwidthNotification(notification);
  }; //common system to keep all the notification in the queue


  notify.makeBandwidthNotification = function (notification) {
    bndw_queue.push(notification);
    notification.animation = true;
    $timeout(function () {
      notification.animation = false;
      $timeout(function () {
        notify.removeFromQueue(notification, bndw_queue);
      }, 2000);
    }, notification.duration);
    return notification;
  };

  return notify;
}]);
//# sourceMappingURL=notify.factory.js.map

"use strict";

/*
---------------
MODULE :: QUEUE
---------------
A function to represent a queue

--------
Source : 
--------
Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:
http://creativecommons.org/publicdomain/zero/1.0/legalcode

----------
Modified :
----------
DCTEAM..
The whole library is rebiased to fix some of the issues we noticed in memory leaks
and made the functional sharing with my best friend Prototype.
*/
DC.factory('Queue', [// Callback
function () {
  /**
   * @ngdoc function
   * @name  Queue
   * @description
   * Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
   * items are added to the end of the queue and removed from the front.
   */
  var Queue = function Queue() {
    // initialise the queue and offset
    this.queue = [];
    this.offset = 0;
  };
  /**
   * @ngdoc function
   * @name  getLength
   * @description
   * Returns the length of the queue
   * @return {number} The length of the queue
   */


  Queue.prototype.getLength = function () {
    return this.queue.length - this.offset;
  };
  /**
   * @ngdoc function
   * @name  isEmpty
   * @description
   * Returns true if the queue is empty, and false otherwise
   * @return {Boolean} Represents if queue is empty
   */


  Queue.prototype.isEmpty = function () {
    return this.queue.length == 0;
  };
  /**
   * @ngdoc function
   * @name  enqueue
   * @description
   * Enqueues the specified item. The parameter is:
   * @param  {string} item the item to enqueue
   */


  Queue.prototype.enqueue = function (item) {
    // Push the item into the array
    this.queue.push(item);
    console.log("[QUEUE] :: Item queued :: ", item);
  };
  /**
   * @ngdoc function
   * @name  dequeue
   * @description
   * Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   * @return {string} Returns the dequeued item
   */


  Queue.prototype.dequeue = function () {
    // if the queue is empty, return immediately
    if (this.queue.length == 0) return undefined; // store the item at the front of the queue
    //var item = this.queue[this.offset];

    var item = this.queue.shift();
    /*// increment the offset and remove the free space if necessary
    if (++ this.offset * 2 >= this.queue.length){
    	this.queue  = this.queue.slice(this.offset);
    	this.offset = 0;
    }*/
    // return the dequeued item

    return item;
  };
  /**
   * @ngdoc function
   * @name  dequeueAll
   * @description
   * Returns all the elements in the queue and removes them
   * from the queue
   * @return {Array} Returns array of elements
   */


  Queue.prototype.dequeueAll = function () {
    // Empty the queue, by splicing it
    // Have to improve the performance here, definitely...
    var items = this.queue.splice(0, this.queue.length);
    return items;
  };
  /**
   * @ngdoc function
   * @name  peek
   * @description
   * Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   * @return {string} Returns the item at the handle
   */


  Queue.prototype.peek = function () {
    return this.queue.length > 0 ? this.queue[this.offset] : undefined;
  }; // Return the module, a factory that can spawn objects


  return Queue;
}]);
//# sourceMappingURL=queue.factory.js.map

"use strict";

// SnB integration module
DC.factory('snb', [// Dependencies
'$http', '$q', '$timeout', function ($http, $q, $timeout) {
  // Build Module
  var SnB = {}; // Authenticate the user through an SnB api call.

  SnB.checkUser = function (userData) {
    var deferred = $q.defer(); // API request to authenticate user

    $http.get('/api/auth/validateUser?activityId=' + userData.activityId + '&userId=' + userData.userId + '&ts=' + new Date().getTime()).then(function (response, status, headers, config) {
      deferred.resolve(response.data.data);
    }, function (response, status, headers, config) {
      deferred.reject(response.data.data);
    });
    return deferred.promise;
  }; // Return the Module


  return SnB;
}]);
//# sourceMappingURL=snb.factory.js.map

DC.factory('AssessmentService', [
	'$http',
	'$q',
	'Auth',

	function AssessmentService($http, $q, Auth) {
		var dcAppData = Auth.getData();
		// authToken = token;
		// authToken = dcAppData.userToken;

		let getTechRelatedResultTypes = () => {
			return [{
				id: 13,
				label: 'Tech-Student'
			},
			{
				id: 14,
				label: 'Tech-Staff'
			},
			{
				id: 15,
				label: 'Tech-Platform'
			}]
		}

		var assessment = {
			defaultValues: function() {
				const defaultValues = {
					notificationTimeout: 5000,

					errorMessages: {
						allScoreNotValidated: 'Make sure you have entered the score for all the students',
						noStudentsJoined: 'No student have booked to the class',
						allAttendanceNotEntered: 'Make sure you have entered the attendance for all the students',
						updateFeedback: 'We are facing error in updating the student feedback',
						updateResult: 'We are facing error in updating the student result',
						loadClassData: 'We are facing error in loading the class data',
						errorInHandlingData: 'We are facing error in handling assessment data'
					},

					successMessages: {
						submittedSuccessfully: 'All the details have been submitted successfully',
						classHasEnded: 'Assessment data has been submitted. Please contact center admin to make changes'
					},

					class: {
						onlineEncounter: 'Online Encounter'
					},

					roles: {
						TEACHER: 'teacher',
						STUDENT: 'student'
					},

					createdBy: {
						QUICK_SLOT: 'qs'
					},

					ratings: [0, 1, 2, 3, 4],

					score: {
						threshold: 70,
						notEnoughData: 'Not enough data'
					},

					resultTypes: {
						encounter: [
							{
								id: 1,
								label: 'Continue'
							},
							{
								id: 2,
								label: 'Repeat'
							},
							{
								id: 3,
								label: 'No Show'
							},
							...getTechRelatedResultTypes()
						],
						nonEncounter: [
							{
								id: 9,
								label: 'Yes'
							},
							{
								id: 10,
								label: 'No'
							},
							...getTechRelatedResultTypes()
						]
					},

					// activityId: dcAppData.activityId ? dcAppData.activityId: "fc0f45f7-e030-4180-815c-b575ef8ca1c6",

					activityId: dcAppData.activityId,

					encounterResultsMock: {
						comments: null,
						result: null,
						score: null,
						joinedTime: 0,
						partialResults: {}
					},

					nonEncounterResultsMock: {
						comments: null,
						result: null,
						joinedTime: 0
					}
				};

				return defaultValues;
			},

			rearrangeStudents: function(studentsList) {
				var absentees = [];
				var userList = [];

				userList = studentsList.filter(function(studentList) {
					return studentList.role != 'teacher';
				});

				userList.map((stud) => {
					if (!stud.joinedTime) {
						absentees.push(stud);
					}
				});

				userList = studentsList.filter(function(studentList) {
					return studentList.joinedTime;
				});

				if (userList.length == 0 || !Array.isArray(userList)) {
					console.log('no students has joined');
				}

				for (var i = 0; i < userList.length - 1; i++) {
					for (var x = 0; x < userList.length - 1; x++) {
						if (userList[x].joinedTime > userList[x + 1].joinedTime) {
							var joinedLater = userList[x];
							userList[x] = userList[x + 1];
							userList[x + 1] = joinedLater;
						}
					}
				}

				var sortedArray = [...userList, ...absentees];

				console.log('sortedArray', sortedArray);
				return sortedArray;
			},

			sortStudentsByJoinedTime: function(studentDetails) {
				var notJoined = [],
					joined = [],
					sortedUsers = studentDetails.sort(function(currentUser, nextUser) {
						return currentUser.joinedTime - nextUser.joinedTime;
					});

				angular.forEach(sortedUsers, function(value) {
					value.showSelectedUserResultTypes = false;
					if (value.joinedTime > 0) {
						joined.push(value);
					} else {
						notJoined.push(value);
					}
				});

				return joined.concat(notJoined);
			},

			extractDataId: function(data) {
				return Object.keys(data)[0];
			},

			getResultType: function(defaultValues, contentItemResultTypeId, classTypeName) {
				var resultTypeArr,
					resultTypeObject = {};

				if (classTypeName === defaultValues.class.onlineEncounter) {
					resultTypeArr = defaultValues.resultTypes.encounter;
				} else {
					resultTypeArr = defaultValues.resultTypes.nonEncounter;
				}

				resultTypeArr.forEach(function(resultType) {
					if (resultType.id === contentItemResultTypeId) {
						resultTypeObject = resultType;
					}
				});

				return resultTypeObject;
			},

			getPartNo: function(ratingSchemaPartItemId, partialResults) {
				for (var ratingPart in partialResults) {
					for (var ratingId in partialResults[ratingPart]) {
						if (Object.keys(partialResults[ratingPart][ratingId])[0] === ratingSchemaPartItemId) {
							return ratingPart;
						}
					}
				}
			},

			getUnitId: function(unitSet, unitNo) {
				return new Promise(function(resolve, reject) {
					angular.forEach(unitSet, function(stage) {
						angular.forEach(stage.childCategories, function(level) {
							angular.forEach(level.childCategories, function(unit) {
								if (parseInt(unit.attributes.number) === parseInt(unitNo)) {
									resolve(unit.id);
								}
							});
						});
					});
				});
			},

			setTotalItemCount: function(data) {
				var totalItemCount = 0;

				for (let part in data) {
					if (typeof data[part] == 'object') {
						totalItemCount += data[part].ratingSchemaPartItems.length;
					}
				}

				return totalItemCount;
			},

			fetchUnitId: function() {
				return new Promise(function(resolve, reject) {
					let requestUrl = 'assessmentBaseUrl/categories/roots?maxDepth=' + 3;

					console.log('requestUrl', requestUrl);

					$http
						.get(requestUrl)
						.then(function(response) {
							resolve(response.data);
						}, function(error) {
							reject(error.data);
						})
				});
			},

			/**
       * @module fetchClassSkillsSchema
       * @param unitId
       * @returns class skills array set
       * Service call to fetch the class skills schema from the API
       */
			fetchClassSkillsSchema: function(unitId) {
				// unitId = "e41ce394-3f83-4905-905a-04dabd8616f5";

				return new Promise(function(resolve, reject) {
					let requestUrl = 'assessmentBaseUrl/units/' + unitId + '/ratingSchema';
					$http
						.get(requestUrl)
						.then(function(response, status, headers, config) {
							resolve(response.data);
						}, function(error, status, headers, config) {
							reject(error.data);
						})
				});
			},

			/**
       * @module fetchStudentsList
       * @param activityId
       * @returns students list array set
       * Service call to fetch the list of booked students from the API
       */
			fetchStudentsList: function(activityId) {
				// activityId = "48d15bc9-57d8-4c8e-bfab-312d81753c48";
				return new Promise(function(resolve, reject) {
					let requestUrl = 'assessmentBaseUrl/classes/' + activityId + '/details';
					$http
						.get(requestUrl)
						.then(function(response, status, headers, config) {
							resolve(response.data);
						}, function(error, status, headers, config) {
							reject(error.data);
						})
				});
			},

			/**
       * @module fetchClassStudentsResults
       * @desc Fetches the schema containing the class students' results
       * @param {string} activityId - Contains the unique ID of the the class(activityId)
       * @return {array} data - The classStudentsResult data
       */
			fetchClassStudentsResults: function(activityId) {
				// activityId = "48d15bc9-57d8-4c8e-bfab-312d81753c48";

				return new Promise(function(resolve, reject) {
					var requestUrl = 'assessmentBaseUrl/classes/' + activityId + '/classResults';
					$http
						.get(requestUrl)
						.then(function(response, status, headers, config) {
							resolve(response.data);
						}, function(response, status, headers, config) {
							reject(response.data);
						})
				});
			},

			/**
       * @module classEncounterPartialResults
       * @desc Stores the encounter class' partial result on the Teaching Services DB
       * @param {object} - contains classId, ratingSchemaPartItemId, result, studentId, teacherId
       * @return {any} data - Contains the success/ error response
       */
			classEncounterPartialResults: function(requestData) {
				// requestData.classId = "b964d34e-fd68-44a4-bddc-346f7b12e80c";

				return new Promise(function(resolve, reject) {
					var requestUrl = 'assessmentBaseUrl/classes/' + requestData.classId + '/classPartialResults';

					$http
						.post(requestUrl, requestData)
						.then(function(response, status, headers, config) {
							resolve(response.data);
						}, function(response, status, headers, config) {
							reject(response.data);
						})
				});
			},

			/**
       * @module classEncounterAllResults
       * @desc Stores the encounter class' summarized result on the Teaching Services DB
       * @param {object} - contains classId, comment, contentItemResultType, studentId, score
       * @return {any} data - Contains the success/ error response
       */
			classEncounterAllResults: function(input) {
				return new Promise(function(resolve, reject) {
					var requestUrl = 'assessmentBaseUrl/classes/encounters/results';

					$http
						.put(requestUrl, input)
						.then(function(response, status, headers, config) {
							resolve(response.data);
						}, function(response, status, headers, config) {
							reject(response.data);
						})
				});
			},

			/**
       * @module closeEncounter
       * @desc Method to Call API to close the encounter's assessment on the Teaching Services DB
       * @param {string} - classId
       * @return {any} data - Contains the success/ error response
       */
			closeEncounter: function(unknownId) {
				var requestData = {
					classId: unknownId
				};

				return new Promise(function(resolve, reject) {
					var requestUrl = 'assessmentBaseUrl/classes/encounters/close';

					$http
						.post(requestUrl, requestData)
						.then(function(response, status, headers, config) {
							resolve(response.data);
						}, function(response, status, headers, config) {
							reject(response.data);
						})
				});
			},

			/**
       * @module classNonEncounterPartialResults
       * @desc Stores the non-encounter class' summarized result on the Teaching Services DB
       * @param {object} - contains classId, comment, contentItemResultType, studentId
       * @return {any} data - Contains the success/ error response
       */
			classNonEncounterPartialResults: function(input) {
				let requestUrl = 'assessmentBaseUrl/classes/nonEncounters/results';
				return new Promise(function(resolve, reject) {
					$http
						.put(requestUrl, input)
						.then(function(response, status, headers, config) {
							resolve(response.data);
						}, function(response, status, headers, config) {
							reject(response.data);
						})
				});
			},

			/**
       * @module closeNonEncounter
       * @desc Method to Call API to close the non-encounter's assessment on the Teaching Services DB
       * @param {string} - classId
       * @return {any} data - Contains the success/ error response
       */
			closeNonEncounter: function(unknownId) {
				return new Promise(function(resolve, reject) {
					let requestData = {
							classId: unknownId
						},
						requestUrl = 'assessmentBaseUrl/classes/nonEncounters/close';
					$http
						.post(requestUrl, requestData)
						.then(function(response, status, headers, config) {
							resolve(response.data);
						}, function(response, status, headers, config) {
							reject(response.data);
						})
				});
			},

			calculateStudentScore: function(studentResults, totalItemCount) {
				let score = 0;

				let partialScoresArray = [];
				for (let ratingPart in studentResults.partialResults) {
					for (var i = 0; i < studentResults.partialResults[ratingPart].length; i++) {
						let rating = parseInt(Object.values(studentResults.partialResults[ratingPart][i])[0]);

						partialScoresArray.push(rating);

						if (!rating) {
							return 0;
						}
						score += rating;
					}
				}

				const isAllRatingChecked = partialScoresArray.every(function(score) {
					return score > 0 && score !== null && score !== undefined && score !== '';
				});

				if (isAllRatingChecked) {
					score = Math.round(score / (totalItemCount * 4) * 100);
				} else {
					score = 0;
				}

				return {
					score: score,
					isAllRatingChecked: isAllRatingChecked
				};
			},

			isAllResultsArePresent: function(students, defaultValues) {
				let resultSet = Object.values(students),
					// isAllScoreNotValidated = resultSet.some(function (student) {
					// 	return student.score === null || student.score === defaultValues.score.notEnoughData;
					// });

					isAllScoreNotValidated = resultSet.some(function(student) {
						return (
							(student.score === null &&
								(student.result === null ||
									![3, ...getTechRelatedResultTypes().map(resultType => resultType.id)].includes(student.result.id) ||
									!['No Show', ...getTechRelatedResultTypes().map(resultType => resultType.label)].includes(student.result.label))) ||
							(student.score === defaultValues.score.notEnoughData &&
								(student.result === null ||
									![3, ...getTechRelatedResultTypes().map(resultType => resultType.id)].includes(student.result.id) ||
									!['No Show', ...getTechRelatedResultTypes().map(resultType => resultType.label)].includes(student.result.label) ))
						);
					});

				return isAllScoreNotValidated;
			},

			isAllAttendanceEntered: function(students) {
				let resultSet = Object.values(students),
					isAllAttendanceEntered = resultSet.some(function(student) {
						return student.result === null;
					});

				return isAllAttendanceEntered;
			}
		};

		return assessment;
	}
]);

"use strict";

// Directive to handle the scrollbar reaching the bottom on sending a new message
// and being static at the same area when new message is received
DC.directive('scrollBottom', [//Dependencies
'$timeout', // CallBack
function ($timeout) {
  return {
    scope: {
      scrollBottom: "=",
      isUserlistOpened: "="
    },
    link: function link(scope, element) {
      scope.$watchCollection('scrollBottom', function (newValue) {
        $timeout(function () {
          if (newValue && newValue.length > 0) {
            if (newValue[newValue.length - 1].isCurrentUser == true) {
              element[0].style.height = "100%";
              element[0].scrollTop = element[0].scrollHeight;
              element[0].style.height = 'auto';
              element[0].scrollIntoView(false);
            }
          }
        });
      });
      scope.$watchCollection('isUserlistOpened', function (value) {
        if (value == false) {
          $timeout(function () {
            element[0].style.height = "100%";
            element[0].scrollTop = element[0].scrollHeight;
            element[0].style.height = 'auto';
            element[0].scrollIntoView(false);
          });
        }
      });
    }
  };
}]); //Directive to Reset the DB count to zero for current user window if the user scrolls bottom of the window

DC.directive('execOnScrollToBottom', function () {
  return {
    restrict: 'A',
    scope: {
      updateChatNotification: '&callbackFn'
    },
    link: function link(scope, element, attrs) {
      // var clientHeight = element[0].clientHeight;
      element.on('scroll', function (e) {
        var el = e.target;

        if (el.scrollHeight - el.scrollTop === el.clientHeight) {
          // fully scrolled
          scope.updateChatNotification();
        }
      });
    }
  };
}); // Directive to handle "Enter" key press to send the message
// and "Shift + Enter" key combo to begin a newline

DC.directive('enterSubmit', function () {
  return {
    restrict: 'A',
    link: function link(scope, elem, attrs) {
      elem.bind('keydown', function (event) {
        var code = event.keyCode || event.which;

        if (code === 13) {
          if (!event.shiftKey) {
            event.preventDefault();
            scope.$apply(attrs.enterSubmit);
          }
        }
      });
    }
  };
}); // Directive to hide div on clicking anywhere
// on the screen other than the div itself

DC.directive('hideDiv', function ($window) {
  return {
    scope: {
      defaultDisplay: '@'
    },
    restrict: 'A',
    link: function link(scope, element, attrs) {
      var el = element[0];
      el.style.display = scope.defaultDisplay || 'block';
      angular.element($window).bind('click', function () {
        if (el.style.display === 'none') {
          el.style.display = scope.defaultDisplay || 'block';
          return;
        }

        el.style.display = 'none';
      });
    }
  };
}); // Directive to find the image load event

DC.directive('sbLoad', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function link(scope, elem, attrs) {
      var fn = $parse(attrs.sbLoad);
      elem.on('load', function (event) {
        scope.$apply(function () {
          fn(scope, {
            $event: event
          });
        });
      });
    }
  };
}]); //Directive to disable the mouse right click event.

DC.directive('disableRightClick', function () {
  return {
    restrict: 'A',
    link: function link(scope, elem, attrs) {
      elem.bind('contextmenu', function (event) {
        event.preventDefault();
      });
    }
  };
});
//# sourceMappingURL=actions.directive.js.map

"use strict";

DC.directive('alertNotifications', ['notificationService', function (notificationService) {
  var directive = {};
  var html = '<div class="annotation_msg" ng-repeat="alert in alertMsg" ng-class="{ \'animated fadeIn\' : alert.animation , \'animated fadeOut\' : !alert.animation }"> {{alert.msg}} </div>';
  directive.restrict = 'E';
  directive.template = html;

  directive.link = function link(scope, element, attrs) {
    if (scope.alertMsg > 0) element.addClass('annotation_msg');
  };

  directive.controller = function alertNotifiyCtrl($scope) {
    $scope.alertMsg = notificationService.getQueue("alert");
  };

  return directive;
}]);
//# sourceMappingURL=alertnotify.directive.js.map

"use strict";

/* This takes care of Audio Video Chat
 */
DC.directive('participantVideos', [// CallBack
function () {
  //==============================================================================
  // DIRECTIVE - This contains the directive properties and fuctions
  //==============================================================================
  var directive = {}; // Restrict the directive to Element

  directive.restrict = 'E';
  directive.templateUrl = '/views/partials/classroom/avchat/participant.html'; //directive.replace = true;

  directive.link = function ($scope) {
    $scope.sayHello = function () {
      console.log("log", "testing", {});
    };
  }; // Return the directive so its prototype will be defined by Angular


  return directive;
}]);
//# sourceMappingURL=avchat.directive.js.map

"use strict";

DC.directive('bandwidthNotifications', ['notificationService', function (notificationService) {
  var directive = {};
  var html = '<div class="annotation_msg" ng-repeat="alert in bndalert" ng-class="{ \'animated fadeIn\' : alert.animation , \'animated fadeOut\' : !alert.animation }"> {{alert.msg}} </div>';
  directive.restrict = 'A';
  directive.template = html;

  directive.link = function link(scope, element, attrs) {};

  directive.controller = function NotificationsCtrl($scope) {
    $scope.bndalert = notificationService.getQueue("bandwidth");
  };

  return directive;
}]);
//# sourceMappingURL=bndwnotify.directive.js.map

"use strict";

/**
 * @ngdoc directive
 * @name  wbBoard
 *
 * @description
 * This will manage the whole body of the whiteboard module.
 * It will control how things are rendered on the canvas.
 * It will build the tabbar and the draw area.
 *
 * @requires $exchange, toolbarService
 */
DC.directive('wbBoard', [// Dependencies
'$exchange', 'toolbarService', '$stateParams', '$window', '$http', '$timeout', '$rootScope', 'Analytics', 'userService', 'privilegeService', 'notificationService', 'CustomSort', // Callback
function ($exchange, toolbarService, $stateParams, $window, $http, $timeout, $rootScope, Analytics, Users, Privilege, notification, CustomSort) {
  //==============================================================================
  // DIRECTIVE - This contains the directive properties and fuctions
  //==============================================================================
  var directive = {}; // Restrict the directive to Element

  directive.restrict = 'E';
  directive.templateUrl = '/views/partials/classroom/whiteboard/board.html'; //directive.transclude = true;

  directive.replace = false;
  directive.scope = true; // Creates a NEW scope for directive
  // The iSpring namespace where the weird things happen. Let's deal with this
  // at later part of our code. This is on my hit list... gotcha.

  window.ispringPresentationConnector = {}; //==============================================================================
  // MODEL - COLLECTION - This contains all the board related data
  //==============================================================================
  // Keeping this out of link function due to reset issue
  // Where any view change is re-defining the variable in link

  var collection = {
    activeBoard: null,
    boards: []
  };
  var previousBoard = null; // Stores the previous board object.
  // var previousBoardIndex = null;
  // For some weird reason these when kept inside link, angular is
  // trying to access the cached element but not the newly inserted one
  // Hence the current element in DOM cant be accessed.
  // So placed it here. HOT FIX works !!!

  var bgCanvas = null;
  var fgCanvas = null;
  var ghostCanvas = null;
  var Layout = null;
  var textbox = null;
  var textboxInput = null; // Declare the pointer

  var Pointer = null; //==============================================================================
  // LINK - Return link funtion to compile, runs after compile function
  //==============================================================================

  directive.link = function ($scope, attrs) {
    // Assign the collection to local scope
    $scope.collection = collection; // Assign the active board object

    $scope.activeBoard = collection.boards[collection.activeBoard] || null;
    $scope.activePanel = 'thumbnails'; // Active panel - thumbnails/notes

    $scope.animationEffect = {
      board: null
    };
    $scope.mouseIcon = canvasMousePointer;
    $scope.user = Users.current; // The iSpring namespace where the weird things happen. Let's deal with this
    // at later part of our code. This is on my hit list... gotcha.

    window.ispringPresentationConnector = {};
    $scope.alert = {
      msg: 'Lorem Ipsum',
      "class": 'alert-info',
      isVisible: false
    }; //var alertPromise = null;

    $scope.alert.show = function (type, msg, delay) {
      $scope.alert.message = msg;
      $scope.alert["class"] = type;
      $scope.alert.isVisible = true;

      if (delay) {
        $timeout(function () {
          $scope.alert.isVisible = false;
        }, delay);
      }
    };

    $scope.notify = function (type, msg, delay) {
      $scope.alert.show(type, msg, delay);
    }; // Init the privilege service


    Privilege.init({
      id: $scope.$parent.wbData.currentPrivilege.id,
      role: $scope.$parent.wbData.currentPrivilege.role
    }); // Initial privilege check, show notification if someone else has a privilege
    // [TODO] Improvise here, has some trouble in it

    if (Users.current.id !== Privilege.privilegeUser.id && Privilege.privilegeUser && Privilege.privilegeUser.role !== 'teacher') {
      var msg = Privilege.privilegeUser.userName + ' got toolbar access to annotate';
      $scope.notify('alert-info', msg, 0);
    } //==============================================================================
    // CANVAS - Canvas methods for drawing annotations
    //==============================================================================

    /**
     * @ngdoc object
     * @name  Canvas
     * @description
     * Canvas object that provides instance creation for a  html canvas
     * @param {object} el DOM element reference to which the object binds
     */


    var Canvas = function Canvas(el) {
      try {
        // Get the DOM reference of the element
        this.el = document.getElementById(el); // Check if browser supports vml (IE8 Support)

        if (typeof G_vmlCanvasManager !== 'undefined') {
          canvas = G_vmlCanvasManager.initElement(canvas);
        } // Get the canvas context


        this.ctx = this.el.getContext('2d');
      } catch (e) {
        //logs error silently.
        // $util.log(e);
        console.log(e);
      }
    };
    /**
     * @ngdoc function
     * @name clear
     * @description
     * Clears the canvas, removes all the paths and drawings on canvas
     */


    Canvas.prototype.clear = function () {
      // There are two approaches to clear a canvas
      // 1. Reset width => Clears the drawings on canvas, but will
      // also clear the translation matrix and canvas paths
      // Ex: this.el.width = this.el.width;
      // 2. Clear rectangle => Clears only drawings on canvas (FASTEST)
      this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    }; // Set the Canvas objects


    bgCanvas = new Canvas('bg-canvas'); // Final rendered frame

    fgCanvas = new Canvas('fg-canvas'); // Temp rendering frame

    ghostCanvas = new Canvas('ghost-canvas'); // Offset render cache
    // Set the textboxholder and textbox elements

    textbox = document.getElementById('textbox');
    textboxInput = document.getElementById('textbox-input'); // Disable right click on whiteboard for students

    angular.element(document.getElementById('draw-area')).bind('contextmenu', function (event) {
      if ($scope.user.role !== 'teacher') {
        event.preventDefault();
        return false;
      }
    }); //document.getElementById('draw-area').oncontextmenu = new Function ("return false");
    //==============================================================================
    // LAYOUT - This deals in handling the DOM layout
    //==============================================================================

    /**
     * @ngdoc object
     * @name Layout
     * @description
     * Handles the Board Layout in DOM.
     * Responsible for switching and adapting the UI.
     * @type {Object}
     */

    Layout = {
      // Assert the elements of the layout components
      drawArea: document.getElementById('draw-area'),
      contentArea: document.getElementById('content-area'),
      infoArea: document.getElementById('info-area'),
      sidePanel: document.getElementById('ppt-side-panel'),
      viewport: document.getElementById('viewport')
    };
    /**
     * @ngdoc function
     * @name adapt
     * @description
     * Changes the DOM elements manually to adapt the UI
     * to the window size.
     */

    Layout.adapt = function () {
      // HOT FIX
      // Manually passing the board type due to scope issue
      // Adapt will be called by window resize also
      // So providing a active board type to it
      //var boardType = (typeof boardType === 'object')?$scope.activeBoard.type:boardType;
      var conWidth = document.getElementById('conResize').offsetWidth; // var conHeight = document.getElementById('conResize').offsetHeight;
      // Set the viewport based on window size
      // var winWidth = window.document.body.scrollWidth;

      var winHeight = window.document.body.scrollHeight;
      var panelHeight = document.getElementById('participant-panel').scrollHeight;
      var headerHeight = 50; // Constant - no change

      var adjustHeight = panelHeight + headerHeight + 41; // 50 for board tabs, 10 is adjustment factor to allow gap
      // Used for alligning the layout areas
      // var marginX = '0';
      // Adjusts the padding value of the container to whiteboard

      var padAdjustX = parseInt(window.getComputedStyle(document.getElementById('conResize')).getPropertyValue('padding-left'));
      var padAdjustY = parseInt(window.getComputedStyle(document.getElementById('conResize')).getPropertyValue('padding-top')); // Calculate available window dimensions

      var availWinHeight = winHeight - adjustHeight - 2 * padAdjustY;
      var availWinWidth = conWidth - 2 * padAdjustX; // Using full scroll width and removing the 74% calculation.
      // var sdContainers = document.getElementsByClassName('sd-container');

      var newWidth = 0,
          newHeight = 0;
      var aspectRatio = '16:9'; // Find the aspect ratio to set to

      if ($scope.activeBoard.type === 'BLANK') {
        aspectRatio = '16:9';
      } else if ($scope.activeBoard.type === 'ISPRING' || $scope.activeBoard.type === 'IMAGE') {
        if ($scope.activeBoard.mount) {
          aspectRatio = $scope.activeBoard.mount.layout;
        }
      } else {
        // This throw should be placed in File prototype not here
        throw 'Unsupported file type mounted';
      }

      var aspectRatioSplit = aspectRatio.split(':');
      var arw = aspectRatioSplit[0]; // Width ratio

      var arh = aspectRatioSplit[1]; // Height ratio
      // Adapt the draw area in proportional to the viewport

      if (availWinWidth < availWinHeight) {
        // Width is the relative factor as it is minimum
        newWidth = availWinWidth;
        newHeight = availWinWidth / arw * arh;
      } else {
        // Height is the relative factor as it is minimum
        newWidth = availWinHeight / arh * arw;
        newHeight = availWinHeight;
      } // Overflow adjustment of viewport to fit in container bounds


      var overflowRatio; // Width overflow

      if (newWidth > availWinWidth) {
        overflowRatio = newWidth / availWinWidth - 1;
        newWidth = newWidth - availWinWidth * overflowRatio;
        newHeight = newWidth / arw * arh;
      } // Height overflow
      else if (newHeight > availWinHeight) {
          overflowRatio = newHeight / availWinHeight - 1;
          newHeight = newHeight - availWinHeight * overflowRatio;
          newWidth = newWidth / arh * arw;
        } // Calculate margin the center align
      // var marginY = (availWinHeight - newHeight) / 2;
      // var marginX = (availWinWidth - newWidth) / 2;
      // Append the px unit to calculated values


      newWidth = newWidth + 'px';
      newHeight = newHeight + 'px'; // marginY = marginY + 'px';
      // Set viewport dimensions

      Layout.viewport.style.width = newWidth;
      Layout.viewport.style.height = newHeight; //Layout.viewport.style.marginTop = marginY;
      // sdContainers[0].style.width = newWidth; // Changing the row container
      // Setting the height of the side panel to drawarea

      Layout.sidePanel.style.height = newHeight; // Get draw areas dimensions

      var drawWidth = Layout.drawArea.clientWidth;
      var drawHeight = Layout.drawArea.clientHeight; // Adapt the canvas dimensions to the draw-area element size

      bgCanvas.el.width = drawWidth;
      bgCanvas.el.height = drawHeight;
      fgCanvas.el.width = drawWidth;
      fgCanvas.el.height = drawHeight;
      ghostCanvas.el.width = drawWidth;
      ghostCanvas.el.height = drawHeight; // Temporary hack for alert

      $scope.viewWidth = newWidth;
      $scope.alertWidth = newWidth; // Above adjustments will erase the canvas when dimensions are changed
      // So, render the canvas

      $scope.activeBoard.render();
    };
    /**
     * @ngdoc function
     * @name  switch
     * @description
     * This will switch the board to the requested layout.
     * @param  {String} name The name of the layout to switch to
     */


    Layout["switch"] = function (type) {
      // Variate the layout based on the layout type
      switch (type) {
        case 'BLANK':
          // Hide all the unwanted areas
          this.contentArea.style.display = 'none';
          this.infoArea.style.display = 'none';
          this.sidePanel.style.display = 'none'; // Make the BG color white

          this.drawArea.style.backgroundColor = '#fff'; // Make canvas to full width
          // Just using adapt, it will reset all layout

          this.adapt();
          break;

        case 'ISPRING':
          // Show all the areas
          // Hide all the unwanted areas
          this.contentArea.style.display = 'block'; // Contents visible only to teacher

          if ($scope.user.role === 'teacher') {
            this.infoArea.style.display = 'block';
            this.sidePanel.style.display = 'block';
          }

          this.drawArea.style.backgroundColor = 'transparent'; // Resize the canvas to fit the iframe
          // Just using adapt, it will resize whole layout

          this.adapt();
          break;

        case 'IMAGE':
          // Show all the areas
          // Hide all the unwanted areas
          this.contentArea.style.display = 'block'; // Contents visible only to teacher

          if ($scope.user.role === 'teacher') {
            this.infoArea.style.display = 'none';
            this.sidePanel.style.display = 'block';
          }

          this.drawArea.style.backgroundColor = 'transparent'; // Resize the canvas to fit the iframe
          // Just using adapt, it will resize whole layout

          this.adapt();
          break;

        default:
          break;
      }
    }; // Adapt the layout on window resize


    $scope.$on("resize", function () {
      Layout.adapt();

      if ($scope.user.role == "teacher") {
        $scope.resizeThumbnail();
      }
    }); // angular.element(window).bind("resize", Layout.adapt);
    //==============================================================================
    // FILE - File Class that templates a File Object
    //==============================================================================

    /**
     * @ngdoc object
     * @name  File
     * @description
     * This will act as a module for all the file type objects
     */

    var File = {}; // This holds additional file data common to all

    var thumbDir = null; //==============================================================================
    // ISPRING - ISPRING Class that manages how ispring module is embedded
    //==============================================================================

    /**
     * @ngdoc object
     * @name  Ispring
     * @description
     * Built on top of the iSpring API, this will help us in fixing many issues
     */

    File.Ispring = function (options) {
      this.type = 'ISPRING';
      this.label = options.label;
      this.slides = [];
      this.activeSlide = options.activeSlide || 0;
      this.stepIndex = options.stepIndex || 0; // Animation index of the slide

      this.activePanel = options.activePanel || 'thumbnails'; // Active sidebar panel

      this.defaultNotes = "There is no notes for this slide"; // Default message for notes

      this.url = options.url; // URL of the page to be loaded in iframe

      this.contentLoaded = false;
      this.pptLoaded = false; // Just to track if slide is loaded
      // Just so that file knows the board it is going to sit on
      // Can do a cyclic assignment, but let's wait and see

      this.boardIndex = options.boardIndex;
      this.layout = options.layout; // Directory path that contains the thumbs

      thumbDir = options.url.substr(0, options.url.lastIndexOf('/') + 1);
      this.thumbs = []; // Contains the thumbnail list
      //this.processing = true; // Flag to check if any processing is happening

      this.preparePlayer(options);
    };

    File.Ispring.prototype.preparePlayer = function (options) {
      // Build a new player element

      /*var pptObject = document.createElement('object');
      pptObject.setAttribute('type', 'text/html');
      pptObject.setAttribute('data', this.url);
      pptObject.className = 'ppt-player';*/
      var iFrame = document.createElement('iframe');
      iFrame.className = 'ppt-player';
      iFrame.src = this.url;
      iFrame.tabIndex = "-1"; // Import the iFrame element

      this.content = iFrame;
      this.driver = {}; // We will pullout the ispring module into this
      // Inject the iframe into the content area of DOM

      Layout.contentArea.appendChild(iFrame); // iFrame.onload = function(){
      // 	if(iFrame.contentWindow.document.getElementsByClassName('content_area')[0].childNodes[0].childNodes[0]){
      // 		iFrame.contentWindow.document.getElementsByClassName('content_area')[0].childNodes[0].childNodes[0].style.backgroundColor = 'rgb(255, 255, 255)';
      // 	}
      // }
      // Lets preserve 'this' instance

      var _this = this; // Lets catch the function call of iSpring API
      // We will extend it to suit our needs


      ispringPresentationConnector.register = function (player) {
        console.log('player in board direcive', player, player.presentation()); // Get the ISpring Objects

        _this.driver.iConnector = player;
        _this.driver.iPresent = _this.driver.iConnector.presentation();
        _this.driver.ipView = _this.driver.iConnector.view();
        _this.driver.pbController = _this.driver.ipView.playbackController(); // Set the flag that content loading is finished

        _this.contentLoaded = true; // Get the slides and their count

        var iSlides = _this.driver.iPresent.slides();

        var count = iSlides.count(); // Check if data is already cached, else load it

        if (!options.cache.slides || !options.cache.thumbs || options.cache.slides.length != count || options.cache.thumbs.length != count) {
          // Prepare and make all those slides ready for drawing annotations
          for (var i = 0; i < count; i++) {
            // Create a slide object
            var slide = {
              index: i,
              // This is the index of slide number
              notes: '',
              // This will hold the notes of the slide
              annotations: [] // This will have all the slide annotations

            }; // Update the slide notes

            slide.notes = iSlides.getSlide(i).slideNotes().html();
            var insertAnnotations = null; // Check if annotations are in slide

            if (options.slides && options.slides[i] && options.slides[i].annotations.length) {
              insertAnnotations = options.slides[i].annotations;
            } // Check if annotations are in cached slide
            else if (options.cache.slides && options.cache.slides[i] && options.cache.slides[i].annotations.length) {
                insertAnnotations = options.cache.slides[i].annotations;
              } // If annotations are found, insert them


            if (insertAnnotations) {
              for (var j = 0; j < insertAnnotations.length; j++) {
                // Check if the annotation data is available but not null
                if (insertAnnotations[j]) {
                  slide.annotations.push(Annotation.objectify(insertAnnotations[j]));
                } else {
                  // Directly assign the null value (erased annotation)
                  slide.annotations.push(null);
                }
              }
            } // Push the slide data


            _this.slides.push(slide); // Load the thumbnails only for teacher


            if ($scope.user.role === 'teacher') {
              try {
                // Request the loading of image assets
                iSlides.getSlide(i).thumbnail().load(); // Load complete handler

                iSlides.getSlide(i).thumbnail().loadCompleteEvent().addHandler(function (asset) {
                  getThumbnailSlides(asset, _this);
                });
              } catch (err) {
                console.log('Error: ', err);
              }
            }
          }
        } else {
          $timeout(function () {
            // Load the cached data
            _this.slides = options.cache.slides;
            _this.thumbs = options.cache.thumbs;
          }, 10);
        } // SLIDE CHANGE EVENT


        _this.driver.pbController.slideChangeEvent().addHandler(function (slideIndex) {
          //Scroller Refresh for Notes Panel Change
          //Timeout has been given to ensure that Notes Panel has been binded completely
          //so that IScroll will recalculate the scroll area to the newly binded HTML
          //This has to be done only for teacher view
          if ($scope.user.role === 'teacher') {
            $timeout(function () {
              notesScroller.scrollTo(0, 0);
              notesScroller.refresh();
            }, 600);
          } //console.log('Slide Change happened');
          //$timeout(function(){ // Apply Hack
          // Check if PPT is loaded, if so process the slide change event


          if (_this.pptLoaded) {
            // Hide the drop down, it might be open at times
            $scope.openDropDown = false; // Set the active slide index

            _this.activeSlide = slideIndex; //console.log('Slide - ' + _this.activeSlide);
            //_this.processing = false; // Release the flag

            if ($scope.user.role === 'teacher') {
              _this.showThumb(slideIndex, 800); // Updates the thumb view


              angular.element(document.querySelector('#notesPanel').scrollTop = 0);
            } //console.log('Rendering Slide ' + slideIndex);
            // Render the slides annotations

          }

          _this.render(); // Apply the changes, since it is not
          // reflecting when teacher is in notes panel


          if (!$scope.$$phase) {
            $scope.$apply();
          } //}, 10);

        }); // PPT ACTION EVENT
        // Change in slide animation/step


        _this.driver.pbController.stepChangeEvent().addHandler(function (stepIndex) {
          //console.log('Step change happened');
          //$timeout(function(){ // Apply Hack
          // Check if PPT is loaded or not.
          if (!_this.pptLoaded) {
            // Change status to loaded
            _this.pptLoaded = true; // Flag that a animation occured
            // Goto the active slide of the ppt

            _this.driver.pbController.gotoTimestamp(_this.activeSlide, _this.stepIndex, 0, true);
          } else {
            // PPT already loaded. Process the ppt action change now
            // Update the step index in the slide
            _this.stepIndex = stepIndex; //_this.processing = false; // Release the flag
            // Goto the active slide of the ppt

            _this.driver.pbController.gotoTimestamp(_this.activeSlide, stepIndex, 0, true); //console.log('Slide - ' + _this.activeSlide + ', Index - ' + stepIndex);
            // Exchange the socket event


            if ($scope.user.role === 'teacher') {
              // Considering a teacher is the only publisher, only one teacher allowed
              // This might cause cyclic loops, when two teachers are opened
              $exchange.publish('wb:ppt-action', {
                board: _this.boardIndex,
                slide: _this.activeSlide,
                stepIndex: stepIndex
              });
            }
          } //}, 10);

        });
      };
    }; // the below function is called inside the getSlides Handler method above. Function extracted outside to fix sonar issue.


    function getThumbnailSlides(asset, _this) {
      var thumb;
      $timeout(function () {
        // Set some timeout magic
        // iSpring generates the key randomly while converting
        // so search for the property which has the img path
        for (var key in asset) {
          if (/data\//.test(asset[key])) {
            // Remove the timestamp from thumb and push it
            thumb = asset[key].substring(0, asset[key].indexOf('?'));

            _this.thumbs.push(thumbDir + thumb);

            break;
          }
        } // Thumbnails are loaded asynchronously, so doing a sort


        _this.thumbs = CustomSort.alphaNumSort(_this.thumbs, {
          insensitive: true
        });
      }, 10);
    } // Highlights the thumbs of given slide


    File.Ispring.prototype.showThumb = function (slideIndex, duration) {
      if (this.activePanel != 'thumbnails') return; // Run only if active panel is thumbs

      if (!duration) duration = 100; // Duration of the slide animation

      var slideToFocus; // Deciding which slide to focus on. Logic is as follows,
      // 1. If slide is 0, thumb should be on top of list
      // 2. If slide is last, thumb should be on bottom of list
      // 3. Else, thumb should be in center of the list

      if (slideIndex === 0) {
        slideToFocus = 0;
      } else if (slideIndex === this.thumbs.length - 1) {
        slideToFocus = this.thumbs.length - 1;
      } else {
        slideToFocus = slideIndex - 1;
      }

      $timeout(function () {
        // Allowing view to update
        // Get the DOM element of the slide
        var slide = document.getElementById('slide-' + slideToFocus);
        console.log("File.Ispring.prototype.showThumb");
        console.log(slideIndex);
        console.log(duration); // Scroll to this slide in thumbnail panel

        window.scroller.scrollToElement(slide, duration);
      }, 200);
      /*var thumbList = document.getElementById('thumbnail-list');
      var dropdownList = document.getElementById('dropdown-slide-menu');
      var elem = document.getElementById('ppt-navigator-' + slideIndex);
      dropdownList.scrollTop = elem.offsetTop - dropdownList.offsetTop;*/
    };

    File.Ispring.prototype.showPanel = function (panel) {
      this.activePanel = panel; // If panel is thumbnails, show the active slide in thumbs

      if (panel == 'thumbnails') {
        this.showThumb(this.activeSlide, 10);
      } // Send the socket message


      if ($scope.user.role === 'teacher') {
        // Publish the message
        $exchange.publish('wb:ppt-change-panel', {
          board: this.boardIndex,
          panel: this.activePanel,
          publish: false
        });
      }
    };
    /**
     * @ngdoc function
     * @name  prevSlide
     * @description
     * Navigates the ppt to the previous slide
     */


    File.Ispring.prototype.prevSlide = function () {
      if (!$scope.disableControls) {
        // Check if ppt has reached minimum threshold (0)
        if (this.activeSlide > 0) {
          // Change the active slide number
          this.activeSlide--; // Go to the previous slide

          this.gotoSlide(this.activeSlide);
          angular.element(document.querySelector('#notesPanel').scrollTop = 0);
        }
      }
    };
    /**
     * @ngdoc function
     * @name  nextSlide
     * @description
     * Navigates the ppt to the next slide
     */


    File.Ispring.prototype.nextSlide = function () {
      if (!$scope.disableControls) {
        // Check if ppt has reached minimum threshold (0)
        if (this.activeSlide < this.slides.length - 1) {
          // Change the active slide number
          this.activeSlide++; // Go to the next slide

          this.gotoSlide(this.activeSlide);
          angular.element(document.querySelector('#notesPanel').scrollTop = 0);
        }
      }
    };
    /**
     * @ngdoc function
     * @name  gotoSlide
     * @description
     * Navigates the ppt to the particular slide, provided slide index, as in array index.
     * i.e slide index starts from 0
     */


    File.Ispring.prototype.gotoSlide = function (index) {
      console.log("File.Ispring.prototype.gotoSlide");
      console.log(this.driver);
      console.log(this.driver.pbController);
      console.log(index); // Changes the activeSlide

      this.activeSlide = index;

      if (!$scope.disableControls) {
        $scope.openDropDown = false; // ISpring gotoSlide method

        this.driver.pbController.gotoSlide(index);
        angular.element(document.querySelector('#notesPanel').scrollTop = 0);
      }
    };
    /**
     * @ngdoc function
     * @name  render
     * @description
     * Renders the annotations of the active slide
     */


    File.Ispring.prototype.render = function () {
      // Clear the canvas first
      bgCanvas.clear();
      fgCanvas.clear(); // Only render if there are slides loaded
      // Iframe load happens async, at that point slides are not
      // built and throws error, so we do this check before render

      if (this.slides.length) {
        var annotations = this.slides[this.activeSlide].annotations; // Loops through and renders all the annotations inside it

        for (var i = 0; i < annotations.length; i++) {
          // Check if the annotation is deleted, We actually
          // store the value as null when something is deleted
          if (annotations[i]) {
            annotations[i].bgRender(true);
          }
        } // Check if the pointer object is set and active


        if (Pointer.check()) {
          // Render the pointer on foreground canvas
          Pointer.annotation.fgRender(true);
        }
      }
    };
    /**
     * @ngdoc function
     * @name  removeAnnotation
     * @description
     * Removes the annotation from the slides collection
     * @return {[type]} [description]
     */


    File.Ispring.prototype.removeAnnotation = function (index) {
      // Remove the annotation
      this.slides[this.activeSlide].annotations[index] = null; // Render the slide

      this.render();
    };
    /**
     * ngdoc function
     * @name objectify
     * @description
     * Creates an object instance based on the raw data passed
     * @param  {object} data Raw data to be parsed
     * @return {object} Object of type file
     */


    File.Ispring.objectify = function (data) {
      var file = new File.Ispring({
        label: data.label,
        slides: data.slides,
        activeSlide: data.activeSlide,
        activePanel: data.activePanel,
        stepIndex: data.stepIndex,
        url: data.url,
        boardIndex: $scope.activeBoard.index,
        layout: data.layout,
        cache: {
          slides: data.cache ? data.cache.slides : null,
          thumbs: data.cache ? data.cache.thumbs : null
        }
      });
      return file;
    }; //==============================================================================
    // Image - Image Class that templates a Image Object
    //==============================================================================

    /**
     * @ngdoc object
     * @name  Image
     * @description
     * This will act as a module for all the image type objects
     */


    File.Image = function (options) {
      this.type = 'IMAGE';
      this.label = options.label;
      this.url = options.url; // URL of the page to be loaded in iframe

      this.layout = "16:9";
      this.fileType = 'image';
      this.prepareImage(options);
    };

    File.Image.prototype.prepareImage = function (options) {
      var image = document.createElement('img');
      image.className = 'img-file';
      image.src = this.url;
      image.tabIndex = "-1"; // Import the image element

      this.content = image; // Inject the image into the content area of DOM

      Layout.contentArea.appendChild(image); // Checks whether the image has been redered in the div

      $scope.imgRendered = false;

      image.onload = function () {
        $scope.imgRendered = true;
      }; // return this;

    };

    File.Image.objectify = function (options) {
      var image = new File.Image(options);
      return image;
    }; // Check whether the given slide number is valid or not
    // If valid, go to that slide, else handle it


    $scope.isValidSlide = function (e) {
      var keyCode = e.keyCode != 0 ? e.keyCode : e.charCode;
      var input = e.target; // Handle based on the key pressed
      // Up arrow key

      if (keyCode === 38) {
        $scope.activeBoard.mount.prevSlide(); // Go to previous slide
      } // Down arrow key
      else if (keyCode === 40) {
          $scope.activeBoard.mount.nextSlide(); // Advance to next slide
        } // Left or Right key
        else if (keyCode === 37 || keyCode === 39) {
            e.preventDefault();
          } // Backspace or Delete key
          else if (keyCode === 8 || keyCode === 46) {
              e.preventDefault();
            } // Number keys
            else if (keyCode >= 48 && keyCode <= 57 && input.value + "" + String.fromCharCode(keyCode) <= $scope.activeBoard.mount.slides.length) {
                e.preventDefault();
              } // Enter Key
              else if (keyCode === 13) {
                  if (input.value.length == 0) {
                    $scope.resetValidSlide(); // If empty reset to active slide
                  } else {
                    $scope.activeBoard.mount.gotoSlide(input.value - 1); // Goto slide
                  }
                } // Prevent the update of input
                else {
                    e.preventDefault();
                  }
    }; // Resets the slide input to current active slide


    $scope.resetValidSlide = function (e) {
      if (!$scope.disableControls) {
        e.target.value = $scope.activeBoard.mount.activeSlide + 1;
      }
    };

    window.scroller = new IScroll('#wrapper', {
      mouseWheel: true,
      scrollbars: true
    });
    window.notesScroller = new IScroll('#wrapperNotes', {
      mouseWheel: true,
      scrollbars: true
    });

    $scope.updateScroll = function () {
      scroller.refresh();
    }; //By default notespanel view has to be in true


    if ($scope.user.role == 'teacher') {
      $scope.showNotesPanel = true;
    } //This function is to toggle the notesPanel


    $scope.toggleNotespanel = function () {
      $scope.showNotesPanel = !$scope.showNotesPanel;
    }; //This function is to recalculate Thumbnail panel height when window is resized


    $scope.resizeThumbnail = function () {
      if ($scope.activeBoard && $scope.activeBoard.type === 'ISPRING') {
        var thumbNail = angular.element('#thumbnail-container');
        var height = thumbNail.find('li')[0].getBoundingClientRect().height * 3 - 5; // Modify the thumb height if slide is first or last

        if ($scope.activeBoard.mount.activeSlide == 0 || $scope.activeBoard.mount.activeSlide == $scope.activeBoard.mount.slides.length - 1) {
          height = height - 8;
        }

        thumbNail[0].style.height = height + "px";
      }
    }; //==============================================================================
    // BOARD - Board Class that templates a white board
    //==============================================================================

    /**
     * @ngdoc object
     * @name Board
     *
     * @description
     * Board Object that provides a prototype for object creation
     *
     * @param {object} options A set of options to set for the board
     */


    var Board = function Board(options) {
      this.index = options.index; // Index of the board (Based on currently existing boards)

      this.label = 'Whiteboard'; // Label of the Board Object - Defaults to 'Whiteboard'

      this.mount = null; // File object that will be mounted on Board

      this.mountData = null; // Stores the raw data for mounting

      this.mountCache = null; // Caches any DOM elements to reuse later

      this.type = 'BLANK'; // Default is the BLANK type of whiteboard that is empty

      this.annotations = []; // Holds the annotations
    };
    /**
     * @ngdoc function
     * @name mount
     * @description
     * This will mount a given file object onto the specified whiteboard
     *
     * @param  {object} file The file object that needs to be mounted on canvas
     * @return {boolean} Returns true if there is no error
     */


    Board.prototype.mountFile = function (file) {
      // Mount method for the ppt images loaded through 'ISPRING'
      // Store the file onto the board object
      this.mount = file;
      this.type = file.type;
      this.label = file.label; // Show the mounted file content if it contains any

      if (this.mount.content) {
        this.mount.content.style.display = 'block';
      } // Switch the layout


      Layout["switch"](file.type); // Ugly fix for setting the iframe dimensions

      this.mount.content.width = Layout.drawArea.clientWidth;
    };
    /**
     * @ngdoc function
     * @name unmount
     * @description
     * This will unmount the file on the canvas and makes the board as blank.
     *
     * @return {boolean} Returns true if there is no error
     */


    Board.prototype.unmount = function () {
      // Remove the content part of the Board
      //this.mount.content.remove(); // IE Fix
      this.mount.content.parentNode.removeChild(this.mount.content); // To clear the previous image in the mountData content

      if (this.type == 'IMAGE') {
        this.mountData = null;
      } // Reset the default label


      this.label = 'Whiteboard'; // Switch the layout back

      Layout["switch"]('BLANK');
    };
    /**
     * @ngdoc function
     * @name show
     * @description
     * This will show a whiteboard and render the contents inside it.
     * If the whiteboard has any mounted file associated to it, mounts it.
     * @return {boolean} Returns true if there is no error
     */


    Board.prototype.show = function () {
      // Switch the layout
      Layout["switch"](this.type); // If previous active board had any content in the
      // content area, we have to hide it

      if (previousBoard && previousBoard.mount && previousBoard.mount.content) {
        previousBoard.mount.content.style.display = 'none';

        if (previousBoard.type == "IMAGE") {
          // Clear the previous image in the board
          previousBoard.mount.content.remove();
        }
      } // If current board has any content in the content area,
      // we have to show it


      if (this.mount && this.mount.content) {
        this.mount.content.style.display = 'block';
      }

      if (this.type === 'ISPRING') {
        // Check if the file is already mounted.
        // If so, render the mount, else mount the file.
        if (this.mount) {
          // Apply the scroll bar
          if ($scope.user.role === 'teacher') {
            this.mount.showThumb(this.mount.activeSlide, 100);
          }

          this.mount.render();
        } else {
          var file = File.Ispring.objectify(this.mountData); // Mount the file

          this.mountFile(file);
        }
      } else if (this.type === 'IMAGE') {
        // If mountData exists, objectify the image using mountData or else objectify using mount
        if (this.mountData) {
          var image = File.Image.objectify(this.mountData);
          image.board = $scope.activeBoard.index; // // Send a socket
          // $exchange.publish('wb:import-file', image);
          // Mount the file on whiteboard

          this.mountFile(image);
        } else {
          var imageLoaded = File.Image.objectify(this.mount);
          imageLoaded.board = $scope.activeBoard.index;
          this.mountFile(imageLoaded);
        }

        this.renderAnnotations(this.annotations);
      } else {
        // If Blank, just render its annotations
        this.renderAnnotations(this.annotations);
      }
    };
    /**
     * ngdoc function
     * @name renderAnnotations
     * @param  {array} annotations Array of annotations
     * @return {void}
     */


    Board.prototype.renderAnnotations = function (annotations) {
      // Clear the canvas first
      bgCanvas.clear(); // Loops through and renders all the annotations inside it

      for (var i = 0; i < annotations.length; i++) {
        // Check if the annotation is deleted, We actually
        // store the value as null when something is deleted
        if (annotations[i]) {
          // Render the annotation
          annotations[i].bgRender(true);
        }
      } // Check if the pointer object is set and active


      if (Pointer.check()) {
        // Render the pointer on foreground canvas
        Pointer.annotation.fgRender(true);
      }
    };
    /**
     * @ngdoc function
     * @name close
     * @description
     * This will close the whiteboard and flushes the whole data inside it.
     * If board has any file mounted, it will unmount it.
     */


    Board.prototype.close = function () {
      // Unmount the content from the board
      if (this.type === 'ISPRING' && this.mount) {
        this.unmount();
      }
    };
    /**
     * @ngdoc function
     * @name import
     * @description
     * Imports an annotation object into the whiteboard
     * Based on data creates a new Annotation instance
     * and then adds the reference to the whiteboard
     */


    Board.prototype["import"] = function (obData) {
      // Create an annotation object
      var ob = Annotation.objectify(obData); // Render the element to the base canvas

      ob.bgRender(this); // Add the object to the array

      this.add(ob);
    };
    /**
     * @ngdoc function
     * @name export
     * @description
     * This will prepare the object for socket transport.
     * Will export the object data through corresponding socket.
     */


    Board.prototype["export"] = function () {};
    /**
     * @ngdoc function
     * @name  add
     * @description
     * Adds the give annotation into the stack of the current active frame
     * @param {objet} annotation The annotation to add.
     */


    Board.prototype.add = function (annotation) {
      var annotations = null;

      if (this.type === 'ISPRING') {
        annotations = this.mount.slides[this.mount.activeSlide].annotations;
      } else {
        annotations = this.annotations;
      } // Set the index as the length of annotations array


      annotation.index = annotations.length; // Push the object to the active board

      annotations.push(annotation);
    };
    /**
     * @ngdoc function
     * @name  findObjectAt
     * @description
     * Finds if any object is located at the clicked mouse location
     * @param  {number} x The x-coordinate of the mouse click
     * @param  {number} y The y-coordinate of the mouse click
     */


    Board.prototype.findObjectAt = function (x, y) {
      // Go in reverse order as objects are stacked on top of each other
      // LIFO - approach
      var annotations = null;

      if (this.type === 'ISPRING') {
        annotations = this.mount.slides[this.mount.activeSlide].annotations;
      } else {
        annotations = this.annotations;
      } // console.log('Matching object, at X-' + x + ', at Y-' + y);


      for (var i = annotations.length - 1; i >= 0; i--) {
        var ob = annotations[i];
        if (!ob) continue;

        switch (ob.tool) {
          case 'pencil':
            continue;
          // No select feature for pencil tool

          case 'line':
            if (x >= Math.min(ob.x1, ob.x2) && x <= Math.max(ob.x1, ob.x2) && y >= Math.min(ob.y1, ob.y2) && y <= Math.max(ob.y1, ob.y2)) {
              return ob;
            }

            break;

          case 'square':
          case 'rectangle':
            // console.log('X ' + ob.x + '	Y ' + ob.y + '	W ' + ob.w + '	H ' + ob.h);
            if (findInBetween(ob.x, ob.x + ob.w, x) && findInBetween(ob.y, ob.y + ob.h, y)) {
              return ob;
            }

            break;

          case 'circle':
            var dx = x - ob.centerX; // Distance X

            var dy = y - ob.centerY; // Distance Y

            var rx = ob.rX; // X axis radius

            var ry = ob.rY; // Y axis radius
            // Check if the distance from the point to the center
            // is less than the radius
            // if(dx*dx+dy*dy <= ob.r*ob.r) {

            if (dx * dx / (rx * rx) + dy * dy / (ry * ry) <= 1) {
              //[Bug Fix - checking the distance for ellipse]
              return ob;
            }

            break;

          case 'textbox':
            if (x >= ob.x && x <= ob.x + ob.w && y >= ob.y && y <= ob.y + ob.h) {
              return ob;
            }

            break;

          default:
            // Some default action
            continue;
        }
      }
    };
    /**
     * @ngdoc function
     * @name  findInBetween`
     * @description Finds if given number is inbetween the two numbers
     * @param  {number} n1 One of the value to compare from
     * @param  {number} n2 One of the value to compare from
     * @param  {number} n Value to compare between n1 and n2
     */


    var findInBetween = function findInBetween(n1, n2, n) {
      if (n1 <= n2) {
        if (n >= n1 && n <= n2) {
          return true;
        }
      } else {
        if (n >= n2 && n <= n1) {
          return true;
        }
      }

      return false;
    };
    /**
     * @ngdoc function
     * @name  isPointer`
     * @description
     * Finds if pointer is located at the clicked mouse location
     * @param  {number} x The x-coordinate of the mouse click
     * @param  {number} y The y-coordinate of the mouse click
     */


    Board.prototype.isPointer = function (x, y) {
      // if( x >= Pointer.annotation.bound.x &&
      // 	x <= Pointer.annotation.bound.x+Pointer.annotation.bound.w &&
      // 	y >= Pointer.annotation.bound.y &&
      // 	y <= Pointer.annotation.bound.y+Pointer.annotation.bound.h)
      // 		return true;
      // else
      // 		return false;
      var condition = x >= Pointer.annotation.bound.x && x <= Pointer.annotation.bound.x + Pointer.annotation.bound.w && y >= Pointer.annotation.bound.y && y <= Pointer.annotation.bound.y + Pointer.annotation.bound.h;
      return condition;
    };
    /**
     * @ngdoc function
     * @name  clear
     * @description
     * Clears the whiteboard and removes the data
     */


    Board.prototype.clear = function () {
      // Clear the canvas
      bgCanvas.clear(); // Empty the annotation array

      if (this.type === 'ISPRING') {
        this.mount.slides[this.mount.activeSlide].annotations.length = 0;
      } else {
        this.annotations.length = 0;
      } // Clear the Pointer, if it is on the same board


      if (this.index == Pointer.boardIndex) {
        Pointer.isActive = false;
        fgCanvas.clear();
      }
    };
    /**
     * @ngdoc function
     * @name  render
     * @description
     * Calls the render methods depending on type of board
     */


    Board.prototype.render = function () {
      // Render only the annotations if the whiteboard type is either 'BLANK' / 'IMAGE'
      if (this.type === 'BLANK' || this.type === 'IMAGE') {
        this.renderAnnotations(this.annotations);
      } else if (this.type === 'ISPRING') {
        if (this.mount) {
          // Update the thumbnails
          $scope.thumbs = this.mount.thumbs; // This is causing some error

          this.mount.render();
        }
      }
    }; //==============================================================================
    // ANNOTATION - The object that manages the canvas drawing (our Drawing Library)
    //==============================================================================

    /**
     * @ngdoc object
     * @name  Annotation
     * @description
     * This provides a prototype for object creation
     * @param {string} tool Name of the tool for which the object is created
     *                      That is the annotation type
     */


    var Annotation = function Annotation(tool) {
      this.size = toolbarService.getActiveSize();
      this.color = toolbarService.getActiveColor();
      this.scale = null;
      this.ow = bgCanvas.el.width; // Origin width of canvas when drawn

      this.rotate = null;
      this.transform = null;
      this.opacity = 1;
      this.tool = tool; // For textbox options
      // For now, font properties are static.

      if (tool === 'marker') {
        this.color = toolbarService.getActiveColorAlpha();
      } // Set shape specific object data


      switch (tool) {
        case 'pencil':
        case 'marker':
          this.path = [];
          break;

        case 'eraser-free':
          this.path = [];
          this.opacity = 0;
          break;

        case 'line':
          this.x1 = this.y1 = this.x2 = this.y2 = 0;
          break;

        case 'circle':
          this.x = this.y = this.r = 0;
          break;

        case 'square':
        case 'rectangle':
          this.x = this.y = this.w = this.h = 0;
          break;

        case 'pointer':
          // Initial point will be calculated dynamically
          this.x = this.y = 0;
          this.path = [];
          break;

        case 'textbox':
          this.x = this.y = 0;
          this.w = this.h = 0;
          this.text = '';
          this.status = 'drawing';
          this.fontStyle = toolbarService.getFontStyle();
          this.fontSize = toolbarService.getFontSize();
          this.fontSizeScale = 700; // A constant used in scaling

          break;

        default:
          this.tool = null;
          break;
      }
    };
    /**
     * @ngdoc function
     * @name  startPath
     * @description
     * Starts the annotation path and plots the data.
     * This is usually invoked by the mousedown event on canvas
     *
     * @param  {number} x The x-coordinate of the mouse click
     * @param  {number} y The y-coordinate of the mouse click
     */


    Annotation.prototype.startPath = function (x, y) {
      // Start the object path from the current object
      this.addPoint(x, y); // If the tool is free eraser we can directly draw
      // on the base canvas instead of the ghost, because
      // if we draw on ghost canvas nothing will be erased
      // as ghost only has the current annotation

      if (this.tool === 'eraser-free') {
        this.bgRender();
      } else {
        this.fgRender();
      }
    };
    /**
     * @ngdoc function
     * @name  extendPath
     * @description
     * This is usually invoked by the mousemove event on canvas
     *
     * @param  {number} x The x-coordinate of the mouse click
     * @param  {number} y The y-coordinate of the mouse click
     */


    Annotation.prototype.extendPath = function (x, y) {
      this.addPoint(x, y);

      if (this.tool === 'eraser-free') {
        this.bgRender();
      } else {
        this.fgRender();
      }
    };
    /**
     * @ngdoc function
     * @name  endPath
     * @description
     * Ends the annotation path
     * This is usually invoked by the mouseup event on canvas
     * @param  {number} x The x-coordinate of the mouse click
     * @param  {number} y The y-coordinate of the mouse click
     */


    Annotation.prototype.endPath = function (x, y) {
      // Clear the foreground Canvas
      fgCanvas.clear(); // Check if the pointer object is set and active

      if (toolbarService.getActiveTool() !== 'pointer' && Pointer.check()) {
        // Render the pointer on foreground canvas
        Pointer.annotation.renderOn(fgCanvas.ctx, true);
      } // Render the element to the base canvas


      this.bgRender(); // Set the bounds for the object (i.e. selection boundaries)

      this.setBounds(); // Before adding the board set the other properties

      annotation.ow = bgCanvas.el.width; // Add the object to the active board

      $scope.activeBoard.add(this); // Send a socket to add the annotation

      $exchange.publish('wb:add-annotation', {
        board: $scope.activeBoard.index,
        annotation: this
      });
    };
    /**
     * @ngdoc function
     * @name  addPoint
     * @description
     * Adds a mouse point to the annotation
     * This is usually invoked by start and extend path methods
     * @param  {number} x The x-coordinate of the mouse click
     * @param  {number} y The y-coordinate of the mouse click
     */


    Annotation.prototype.addPoint = function (x, y) {
      switch (toolbarService.getActiveTool()) {
        case 'pencil':
        case 'marker':
        case 'eraser-free':
          this.path.push({
            x: x,
            y: y
          });
          break;

        case 'line':
          this.x1 = this.x1 || x;
          this.y1 = this.y1 || y;
          this.x2 = this.x1 ? x : 0;
          this.y2 = this.y1 ? y : 0;
          break;

        case 'rectangle':
          this.x = this.x || x;
          this.y = this.y || y;
          var txRect = this.x ? x : this.x;
          var tyRect = this.y ? y : this.y;
          this.w = this.adjustMinDimension(txRect - this.x, 10);
          this.h = this.adjustMinDimension(tyRect - this.y, 10);
          /*if(this.w >= 0 && this.w < 10) this.w = 10;
          if(this.w < 0 && this.w < 10) this.w = 10;
          	if(this.h >= 0 && this.h < 10) this.h = 10;
          if(this.h < 0 && this.w < 10) this.h = 10;*/

          break;

        case 'square':
          this.x = this.x || x;
          this.y = this.y || y;
          var txSqu = this.x ? x : this.x;
          var tySqu = this.y ? y : this.y;
          var w = this.adjustMinDimension(txSqu - this.x, 10);
          var h = this.adjustMinDimension(tySqu - this.y, 10);
          var l = Math.abs(w > h ? w : h); // length - square has equal sides of length 'l'
          // To allow square to be drawn to all four sides we need to support
          // negative and positive axes length proportionally.

          this.w = (w > 0 ? 1 : -1) * l;
          this.h = (h > 0 ? 1 : -1) * l;
          break;

        case 'circle':
          this.x = this.x || x;
          this.y = this.y || y;
          var txCir = this.x ? x : this.x;
          var tyCir = this.y ? y : this.y;
          var wCir = this.adjustMinDimension(txCir - this.x, 10);
          var hCir = this.adjustMinDimension(tyCir - this.y, 10); //this.r = Math.max(Math.abs((w>h)?w:h), 5); // Radius of the circle
          //Finding both radius to draw an ellipse.

          this.rX = Math.max(Math.abs(wCir) / 2, 1); //Finding Radius of X axis

          this.rY = Math.max(Math.abs(hCir) / 2, 1); //Finding Radius of Y axis
          //Calculating Center point by finding
          //midpoint between down point and current cursor position

          this.centerX = Math.abs(txCir + this.x) / 2;
          this.centerY = Math.abs(tyCir + this.y) / 2;
          break;

        case 'pointer':
          if (this.x) {
            break;
          } //var r = 20; // Size of arrow


          var r = this.ToolBar.getActiveSize() * 5;
          var t = 6; // Tail proportion of arrow

          this.x = x;
          this.y = y;
          this.r = r;
          this.path.push({
            x: x,
            y: y
          });
          this.path.push({
            x: x - r,
            y: y - r
          });
          this.path.push({
            x: x - r,
            y: y - r / 3
          });
          this.path.push({
            x: x - r * t,
            y: y - r / 3
          });
          this.path.push({
            x: x - r * t,
            y: y + r / 3
          });
          this.path.push({
            x: x - r,
            y: y + r / 3
          });
          this.path.push({
            x: x - r,
            y: y + r
          });
          this.path.push({
            x: x,
            y: y
          });
          break;

        case 'textbox':
          this.x = this.x || x;
          this.y = this.y || y;
          break;

        default:
          break;
      }
    };
    /**
     * @ngdoc function
     * @name adjustMinDimension
     * @description
     * Adjusts the minimum dimensions for the annotation
     * If dimension is less than minimum, replaces to set minimum value
     * @param  {number} actual The actual dimension of the annotation object
     *                         This can be either width or height
     * @param  {number} min Minimum value for the dimension
     */


    Annotation.prototype.adjustMinDimension = function (actual, min) {
      if (actual >= 0 && actual < min) {
        return min;
      } else if (actual < 0 && actual > -1 * min) {
        return -1 * min;
      } else {
        return actual;
      }
    };
    /**
     * @ngdoc function
     * @name  setBounds
     * @description
     * Set bounds for an annotation object.
     * This acts a selection hot spot for the annotation
     * @param  {number} x The x-coordinate of the mouse click
     * @param  {number} y The y-coordinate of the mouse click
     */


    Annotation.prototype.setBounds = function (x, y) {
      this.bound = {};

      switch (this.tool) {
        case 'pencil':
        case 'marker':
        case 'eraser-free':
          var boundX1 = this.path[0].x,
              boundY1 = this.path[0].y,
              boundX2 = this.path[this.path.length - 1].x,
              boundY2 = this.path[this.path.length - 1].y;

          for (var i = 0; i < this.path.length; i++) {
            var p = this.path[i];
            boundX1 = Math.min(boundX1, p.x);
            boundY1 = Math.min(boundY1, p.y);
            boundX2 = Math.max(boundX2, p.x);
            boundY2 = Math.max(boundY2, p.y);
          }

          this.bound.x = boundX1;
          this.bound.y = boundY1;
          this.bound.w = boundX2 - boundX1;
          this.bound.h = boundY2 - boundY1;
          break;

        case 'line':
          this.bound.x = Math.min(this.x1, this.x2);
          this.bound.y = Math.min(this.y1, this.y2);
          this.bound.w = Math.max(this.x1, this.x2) - this.bound.x;
          this.bound.h = Math.max(this.y1, this.y2) - this.bound.y;
          break;

        case 'rectangle':
        case 'square':
        case 'textbox':
          this.bound.x = this.x;
          this.bound.y = this.y;
          this.bound.w = this.w;
          this.bound.h = this.h;
          break;

        case 'circle':
          this.bound.x = this.x - this.r;
          this.bound.y = this.y - this.r;
          this.bound.w = this.x + this.r - this.bound.x;
          this.bound.h = this.y + this.r - this.bound.y;
          break;

        case 'pointer':
          this.bound.x = this.path[3].x; // P4 x-axes

          this.bound.y = this.path[6].y; // P2 y-axes

          this.bound.w = this.path[0].x - this.bound.x;
          this.bound.h = this.path[1].y - this.bound.y;
          break;

        default:
          break;
      } // Modify the bounds to accomodate stroke of the shapes.


      this.bound.x -= this.size;
      this.bound.y -= this.size;
      this.bound.w += this.size * 2;
      this.bound.h += this.size * 2;
    };
    /**
     * @ngdoc function
     * @name  render
     * @description
     * Sets the context to render on the base canvas
     */


    Annotation.prototype.bgRender = function (doScaling) {
      // Clear the Canvas
      ghostCanvas.clear();
      this.renderOn(bgCanvas.ctx, doScaling);
    };
    /**
     * @ngdoc function
     * @name  ghostRender
     * @description
     * Sets the context to render on the ghost canvas.
     * This canvas is mostly used for rendering current annotation.
     * This drastically improved performance, as only the current
     * object is redrawn not whole canvas objects (annotations)
     */


    Annotation.prototype.fgRender = function (doScaling) {
      // Clear the Canvas
      fgCanvas.clear();
      ghostCanvas.clear();
      this.renderOn(fgCanvas.ctx, doScaling); // Check if the pointer object is set and active

      if (this.tool !== 'pointer' && Pointer.check()) {
        // Render the pointer on foreground canvas
        Pointer.annotation.renderOn(fgCanvas.ctx, true); // Always scale the pointer
      }
    };
    /**
     * @ngdoc function
     * @name  renderOn
     * @description
     * Renders the annotation objects on the specified canvas
     * @param  {object} ctx Context of the canvas to render on
     */


    Annotation.prototype.renderOn = function (ctx, doScaling) {
      var renderCtx; // Context where rendering happens
      // Find the scale factor between drawn annotation and current dimensions

      var scaleFactor = (bgCanvas.el.width / this.ow).toFixed(2);

      if (this.tool == 'eraser-free' || this.tool == 'pointer') {
        renderCtx = ctx;
      } else {
        renderCtx = ghostCanvas.ctx;
      } // Only do a scaling if origin and current width are different
      // Saves a lot of process hit, Mostly teacher gets a smooth feel
      // while drawing annotations.


      if (doScaling && bgCanvas.el.width != this.ow) {
        // Save the context state. The transformation matrix will be stored.
        renderCtx.save(); // Manipulate the scaling of values

        renderCtx.scale(scaleFactor, scaleFactor);
      } // Begin a new path


      renderCtx.beginPath(); // Set path properties

      renderCtx.strokeStyle = this.color; // Color of the fill
      // Calculate the dynamic brush size
      //var size = Math.floor(this.size * (bgCanvas.el.width / 200));

      var size = this.size * scaleFactor * 2; //console.log('Brush size : ' + size);

      renderCtx.lineWidth = size; // Size (Thickness) of the line

      renderCtx.lineJoin = 'round'; // Join type between lines

      renderCtx.lineCap = 'round'; // Gives smooth lines
      //renderCtx.globalAlpha = 1;	// Set the alpha to 100%

      var comp = renderCtx.globalCompositeOperation; // Preserve original composition

      switch (this.tool) {
        case 'line':
          renderCtx.moveTo(this.x1, this.y1);
          renderCtx.lineTo(this.x2, this.y2);
          break;

        case 'rectangle':
        case 'square':
          renderCtx.rect(this.x, this.y, this.w, this.h);
          break;

        case 'circle':
          //renderCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
          renderCtx.save(); //Saving current context settings since scale will be applied to context and that has to be restored

          renderCtx.translate(this.centerX, this.centerY); //Moving the pointer to the centerpoint of the circle

          renderCtx.scale(this.rX, this.rY); //Stretching the circle to new width and height

          renderCtx.arc(0, 0, 1, 0, 2 * Math.PI, 0); //Drawing a circle

          renderCtx.restore(); // Restoring back the saved Context

          /*renderCtx.bezierCurveTo(
          	this.centerX + this.w/2, this.centerY - this.h/2, // C1
          	this.centerX + this.w/2, this.centerY + this.h/2, // C2
          	this.centerX,
          	this.centerY + this.h/2
          ); // A2
          	renderCtx.bezierCurveTo(
          	this.centerX - this.w/2, this.centerY + this.h/2, // C3
          	this.centerX - this.w/2, this.centerY - this.h/2, // C4
          	this.centerX,
          	this.centerY - this.h/2
          ); // A1*/

          break;

        case 'eraser-free':
          renderCtx.lineWidth = size * 4;

          for (var indexeraser = 0; indexeraser < this.path.length; indexeraser++) {
            indexeraser ? // For following points - move to the previous point
            renderCtx.moveTo(this.path[indexeraser - 1].x, this.path[indexeraser - 1].y) : // For start point - move to a previous pixel of current point
            renderCtx.moveTo(this.path[indexeraser].x - 1, this.path[indexeraser].y); // Set the composition to remove the destination from source

            renderCtx.globalCompositeOperation = "destination-out";
            renderCtx.strokeStyle = "rgba(0,0,0,1)"; // Draw the line

            renderCtx.lineTo(this.path[indexeraser].x, this.path[indexeraser].y);
          }

          break;

        case 'marker':
        case 'pencil':
          for (var indexPencil = 0; indexPencil < this.path.length; indexPencil++) {
            indexPencil ? // For following points - move to the previous point
            renderCtx.moveTo(this.path[indexPencil - 1].x, this.path[indexPencil - 1].y) : // For start point - move to a previous pixel of current point
            renderCtx.moveTo(this.path[indexPencil].x - 1, this.path[indexPencil].y); // Draw the line

            renderCtx.lineTo(this.path[indexPencil].x, this.path[indexPencil].y);
          }
          /*renderCtx.moveTo(this.path[0].x, this.path[0].y);
          	var i;
          	for (i = 1; i < this.path.length - 2; i++) {
          	var c = (this.path[i].x + this.path[i + 1].x) / 2;
          	var d = (this.path[i].y + this.path[i + 1].y) / 2;
          		renderCtx.quadraticCurveTo(this.path[i].x, this.path[i].y, c, d);
          }
          	if(this.path[i] && this.path[i+1]) {
          	// For the last 2 points
          	renderCtx.quadraticCurveTo(
          		this.path[i].x,
          		this.path[i].y,
          		this.path[i + 1].x,
          		this.path[i + 1].y
          	);
          }*/


          break;

        case 'textbox':
          var offsetY; //var fontSize = Math.floor(this.fontSize * (bgCanvas.el.width / this.fontSizeScale));

          var fontSize = Math.floor(this.fontSize); // Set font styles

          renderCtx.font = fontSize + "pt " + this.fontStyle;
          renderCtx.fillStyle = this.color; // Loop through the text array for multi-line (autowrapped text) to draw as canvas

          for (var i = 0, j = this.text.length; i < j; i++) {
            offsetY = (fontSize + 10) * i + 20; // New offset, 20 is alignment constant

            renderCtx.fillText(this.text[i], this.x, this.y + offsetY);
          }

          break;

        case 'pointer':
          // Change the lineWidth and fill style for the arrow
          renderCtx.lineWidth = 2;
          renderCtx.fillStyle = '#c00'; // Loop thru the path and render the arrow

          for (var indexPointer = 0; indexPointer < this.path.length; indexPointer++) {
            renderCtx.lineTo(this.path[indexPointer].x, this.path[indexPointer].y);
          } // Pointer border should be white color


          renderCtx.strokeStyle = '#fff';
          renderCtx.fill();
          break;

        default:
          break;
      } // Close the path
      //renderCtx.closePath();
      // renderCtx.shadowColor = '#000';
      // renderCtx.shadowBlur = 2;
      // renderCtx.shadowOffsetX = 1;
      // renderCtx.shadowOffsetY = 1;
      // Stroke the path


      renderCtx.stroke(); // Revert the composition back

      renderCtx.globalCompositeOperation = comp;

      if (doScaling && bgCanvas.el.width != this.ow) {
        // Restore the context of the canvas. This will reset the transformation matrix.
        // This resets the above applied scale factor.
        renderCtx.restore();
      }

      if (this.tool != 'eraser-free' && this.tool != 'pointer') {
        // Now copy the ghost data to our live canvas
        ctx.drawImage(ghostCanvas.el, 0, 0);
      }
    };
    /**
     * @ngdoc function
     * @name  select
     * @description
     * Selects an annotation object. Highlights it on canvas.
     */


    Annotation.prototype.select = function () {
      // Render the bgCanvas without the selected object
      // Render the fgCanvas with the selected object
      // Render the selection highlight area
      var ctx = fgCanvas.ctx; // Begin a new path

      ctx.beginPath(); // Set path properties

      ctx.strokeStyle = toolbarService.getRGB('black'); // Color of the stroke

      ctx.lineWidth = this.size; // Size (Thickness) of the line

      ctx.lineJoin = 'round'; // Join type between lines

      ctx.lineCap = "round"; // Gives smooth lines
      // Stroke the borders

      ctx.rect(this.bound.x, this.bound.y, this.bound.w, this.bound.h);
      ctx.lineWidth = 1;
      ctx.stroke(); // Fill the object

      ctx.fillStyle = 'rgba(255, 0, 0, .1)';
      ctx.fill();
    };
    /**
     * @ngdoc function
     * @name  unselect
     * @description
     * Unselects the annotation if it was selected earlier
     * @return {[type]} [description]
     */


    Annotation.prototype.unselect = function () {
      // Clearing the ghost clears the selection
      fgCanvas.clear();
    };
    /**
     * @ngdoc function
     * @name remove
     * @description
     * Removes the annotation and sets to null
     */


    Annotation.prototype.remove = function () {
      if ($scope.activeBoard.type === 'ISPRING') {
        $scope.activeBoard.mount.removeAnnotation(this.index);
      } else {
        $scope.activeBoard.annotations[this.index] = null;
        $scope.activeBoard.renderAnnotations($scope.activeBoard.annotations);
      }
    };
    /**
     * @ngdoc function
     * @name objectify
     * @description
     * 		Returns an annotation object based on object data
     */


    Annotation.objectify = function (obData) {
      // Create a new annotation object
      var ob = new Annotation(obData.tool); // Import the properties for the object

      ob.index = obData.index;
      ob.x = obData.x;
      ob.y = obData.y;
      ob.color = obData.color;
      ob.size = obData.size;
      ob.bound = obData.bound;
      ob.ow = obData.ow;

      switch (obData.tool) {
        case 'pencil':
        case 'marker':
        case 'eraser-free':
          ob.path = obData.path;
          break;

        case 'line':
          ob.x1 = obData.x1;
          ob.y1 = obData.y1;
          ob.x2 = obData.x2;
          ob.y2 = obData.y2;
          break;

        case 'circle':
          ob.centerX = obData.centerX;
          ob.centerY = obData.centerY;
          ob.rX = obData.rX;
          ob.rY = obData.rY;
          ob.r = obData.r;
          break;

        case 'textbox':
          ob.fontStyle = obData.fontStyle;
          ob.fontSize = obData.fontSize;
          ob.text = obData.text;
          break;

        case 'rectangle':
        case 'square':
          ob.w = obData.w;
          ob.h = obData.h;
          break;

        default:
          break;
      }

      return ob;
    }; // If pointer is not defined, define it


    if (!Pointer) {
      //==============================================================================
      // POINTER - The object that contains the pointer data (Only one for each class)
      //==============================================================================
      Pointer = {
        boardIndex: 0,
        // Index of the board
        slideIndex: 0,
        // Index of the slide
        annotation: new Annotation('pointer'),
        isActive: false // Flags if pointer is placed or not

      };
      /**
       * @ngdoc function
       * @name  check
       * @description
       * Checks the existence of pointer in current board and slide if board has ppt.
       * @return {bool} Returns if pointer exists or not
       */

      Pointer.check = function () {
        // Check if pointer is active and current board is
        if (Pointer.isActive == true && Pointer.boardIndex == collection.activeBoard) {
          // Check if board has a PPT, active slide and pointer slide are same or not
          if (collection.boards[collection.activeBoard].type == 'ISPRING' && Pointer.slideIndex != collection.boards[collection.activeBoard].mount.activeSlide) {
            return false;
          }

          return true;
        }
      };

      Pointer.updateCoordinates = function (x, y) {
        var ptrTailWt = 50; // Pointer tail width

        var ptrHeadWt = 18; // Pointer head width

        var ptrTotalWt = ptrHeadWt + ptrTailWt; // Total width of the pointer
        // Segment height - Pointer has 3 equal segments,
        // 1st - above the bar, 2nd - tail (middle bar), 3rd - below the bar

        var ptrSegmentHt = 14; // Total Height of the pointer
        // var ptrTotalHt = ptrSegmentHt * 3;

        /*
        // Check whether it is left most or not
        if (x < ptrTotalWt) {
        	x = ptrTotalWt + 5; // adding extra 5 for lineWidth
        }
        	// Check whether the user clicks at the bottom of the whiteboard
        if ((y + (ptrTotalHt / 2)) >  bgCanvas.el.height) {
        	y = bgCanvas.el.height - ((ptrTotalHt / 2)  + 5 ); // reducing extra 5 for lineWidth
        }
        // Check whether the user clicks at the top of the whiteboard
        else if (y < ptrTotalHt) {
        	y = (ptrTotalHt / 2) + 5; // adding extra 5 for lineWidth
        }
        	// Update the coordinates
        this.annotation.x = x;
        this.annotation.y = y;
        */
        // Update the annotation path

        this.annotation.path = [{
          x: x,
          y: y
        }, {
          x: x - ptrHeadWt,
          y: y + 1.5 * ptrSegmentHt
        }, {
          x: x - ptrHeadWt,
          y: y + 0.5 * ptrSegmentHt
        }, {
          x: x - ptrTotalWt,
          y: y + 0.5 * ptrSegmentHt
        }, {
          x: x - ptrTotalWt,
          y: y - 0.5 * ptrSegmentHt
        }, {
          x: x - ptrHeadWt,
          y: y - 0.5 * ptrSegmentHt
        }, {
          x: x - ptrHeadWt,
          y: y - 1.5 * ptrSegmentHt
        }, {
          x: x,
          y: y
        }]; // Set the pointer selection boundaries

        this.annotation.setBounds(this.annotation.x, this.annotation.y);
      };
    } //==============================================================================
    // MOUSE EVENTS - Mouse events that are binded to canvas
    //==============================================================================


    var annotation; // Define mouse down function

    var mouseDown = function mouseDown(e) {
      try {
        // Disable right click
        if (e.button === 2 || e.which === 2) {
          e.preventDefault();
          return false;
        } // See if any whiteboard is active first


        if (!$scope.activeBoard) return false; // Do Exception Handling

        var mouse = getMouseCoordinates(e);
        var ob = null;

        switch (toolbarService.getActiveTool()) {
          case 'pencil':
          case 'marker':
          case 'line':
          case 'circle':
          case 'square':
          case 'rectangle':
          case 'eraser-free':
            // Create a Canvas Object
            annotation = new Annotation(toolbarService.getActiveTool());
            annotation.startPath(mouse.x, mouse.y); // Unbind the mouse down event

            canvas.removeEventListener('mousedown', mouseDown); // Bind the mouse move event

            canvas.addEventListener('mousemove', mouseMove); // Adding a UP listener on window

            window.addEventListener('mouseup', mouseUp);
            break;

          case 'textbox':
            annotation = new Annotation('textbox');
            annotation.x = mouse.x;
            annotation.y = mouse.y;
            annotation.w = 0;
            annotation.h = 0; //var fontSize = Math.floor(annotation.fontSize * (bgCanvas.el.width / annotation.fontSizeScale));

            var fontSize = Math.floor(annotation.fontSize); // Reset the textbox properties to annotation

            textbox.style.left = Math.abs(annotation.x) + 'px';
            textbox.style.top = Math.abs(annotation.y) + 'px';
            textbox.style.width = 0 + 'px';
            textbox.style.height = 0 + 'px';
            textbox.style.display = 'block';
            textboxInput.style.fontSize = fontSize + "pt";
            textboxInput.style.color = annotation.color;
            textboxInput.value = '';
            canvas.removeEventListener('mousedown', mouseDown);
            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('mouseup', mouseUp);
            break;

          case 'select':
            ob = $scope.activeBoard.findObjectAt(mouse.x, mouse.y); // Clicking anywhere on the screen should unselect the object
            // So lets just clear the ghost canvas that contains selection

            fgCanvas.clear();

            if (ob) {
              ob.select();
            }

            break;

          case 'eraser-path':
            /*
            Check if pointer is located in clicked x and y coordinate.
            If it is true, IF block will executes the otherwise it will executes the ELSE block.
            */
            var isPointer = $scope.activeBoard.isPointer(mouse.x, mouse.y);

            if (isPointer) {
              // Set the flag as inactive
              Pointer.isActive = false; // Clear the fg canvas

              fgCanvas.clear(); // Send a socket to sync pointer

              $exchange.publish('wb:remove-pointer', {
                board: $scope.activeBoard.index
              });
            } else {
              ob = $scope.activeBoard.findObjectAt(mouse.x, mouse.y);
            }

            if (ob) {
              // Remove the annotation object
              ob.remove(); // Show the active board (renders board again)
              //$scope.activeBoard.show(); // Commenting it for now to fix the unwanted loader in image board after path eraser annotation. Will remove it permanently during the directive refactor.
              // Send a socket to sync annotations

              $exchange.publish('wb:remove-annotation', {
                board: $scope.activeBoard.index,
                annotation: ob.index
              });
            }

            break;

          case 'pointer':
            // Update the pointer location/coordinates
            Pointer.annotation.x = mouse.x;
            Pointer.annotation.y = mouse.y; // Update the origin width of the pointer

            Pointer.annotation.ow = bgCanvas.el.width; // Update the board index

            Pointer.boardIndex = $scope.activeBoard.index; // Update the slide index, if board type is ppt

            if ($scope.activeBoard.type == 'ISPRING') {
              Pointer.slideIndex = $scope.activeBoard.mount.activeSlide;
            } // Set the flag as active


            Pointer.isActive = true; // Update the coordinates to auto adjust pointer

            Pointer.updateCoordinates(mouse.x, mouse.y); // Send a socket to update the pointer

            $exchange.publish('wb:update-pointer', {
              board: Pointer.boardIndex,
              slide: Pointer.slideIndex,
              isActive: Pointer.isActive,
              annotation: {
                x: Pointer.annotation.x,
                y: Pointer.annotation.y,
                ow: Pointer.annotation.ow
              }
            }); // Render the pointer on fg canvas

            Pointer.annotation.fgRender(true);
            break;

          case 'default':
            $scope.advanceSlideAnimation();
            break;

          default:
            throw 'CANVAS - Unsupported Tool Used';
        }
      } catch (err) {
        console.log('Error: ', err);
      }
    }; // Method to be called under two conditions.
    // 1. 'default' cursor functionality
    // 2. On clicking the advance animation/ slide button at the top right corner of the ppt


    $scope.advanceSlideAnimation = function () {
      /*if($scope.activeBoard.mount.processing) {
      	console.log('Process in progress. Skipping action');
      }*/
      // Goto next step only if no processing in ppt is going on.
      //if($scope.activeBoard.type === 'ISPRING' && !$scope.activeBoard.mount.processing) {
      if ($scope.activeBoard.type === 'ISPRING' && $scope.user.role == 'teacher') {
        // Sending the data to Analytics factory to track the events
        Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, "Advance Slide Animation");
        $scope.activeBoard.mount.driver.pbController.gotoNextStep(); //$scope.activeBoard.mount.processing = true; // Set the processing flag
      }
    }; // Define mouse move function


    var mouseMove = function mouseMove(e) {
      try {
        // Disable right click
        if (e.button === 2 || e.which === 2) {
          e.preventDefault();
          return false;
        }

        var mouse = getMouseCoordinates(e);

        switch (toolbarService.getActiveTool()) {
          case 'pencil':
          case 'marker':
          case 'line':
          case 'circle':
          case 'square':
          case 'rectangle':
          case 'eraser-free':
            annotation.extendPath(mouse.x, mouse.y);
            break;

          case 'textbox':
            annotation.w = Math.min(mouse.x - annotation.x, fgCanvas.el.width);
            annotation.h = Math.min(mouse.y - annotation.y, fgCanvas.el.height);
            textbox.style.width = annotation.w + 'px';
            textbox.style.height = annotation.h + 'px';
            break;

          default:
            throw 'CANVAS - Unsupported Tool Used';
        }
      } catch (err) {
        console.log('Error: ', err);
      }
    }; // Define mouse up function


    var mouseUp = function mouseUp(e) {
      try {
        // Disable right click
        if (e.button === 2 || e.which === 2) {
          e.preventDefault();
          return false;
        }

        var mouse = getMouseCoordinates(e);

        switch (toolbarService.getActiveTool()) {
          case 'pencil':
          case 'marker':
          case 'line':
          case 'circle':
          case 'square':
          case 'rectangle':
          case 'eraser-free':
            annotation.endPath(mouse.x, mouse.y);
            canvas.removeEventListener('mousemove', mouseMove);
            break;

          case 'textbox':
            // Adjust the W x H, check for min values
            annotation.w = annotation.w < 130 ? 130 : annotation.w;
            annotation.h = annotation.h < 80 ? 80 : annotation.h; // Auto grow to left if right boundary collision occurs

            if (annotation.w + annotation.x > bgCanvas.el.width) {
              annotation.x = bgCanvas.el.width - annotation.w;
            } // Auto grow to top if bottom boundary conflicts


            if (annotation.h + annotation.y > bgCanvas.el.height) {
              annotation.y = bgCanvas.el.height - annotation.h;
            }

            textbox.style.width = annotation.w + 'px';
            textbox.style.height = annotation.h + 'px';
            textbox.style.left = annotation.x + 'px';
            textbox.style.top = annotation.y + 'px'; // textboxInput.addEventListener('keyup', autogrow);
            // Set the cursor inside the textarea

            textboxInput.select(); // Add the on blur to save event to the textbox

            textboxInput.addEventListener('blur', saveText);
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
            return;
          // Bypass the regular flow, textbox has a different function

          default:
            console.log('Invalid tool : Do nothing');
        } // Unset the current object


        annotation = null;
        window.removeEventListener('mouseup', mouseUp);
        canvas.addEventListener('mousedown', mouseDown);
      } catch (err) {
        console.log('Error: ', err);
      }
    };
    /*var autogrow = function() {
    	textbox.style.height = Math.max(textboxInput.scrollHeight, annotation.h);
    };*/

    /**
     * @name applyLineBreaks
     * @description
     * Takes id of the textarea as input and returns the array containing
     * the strings which is actually single string(may be group of words)
     * auto wrapped by browser
     * Source: http://jsfiddle.net/pH79a/218/
     *
     * @param {String} strTextAreaId The id of the text area to break
     * @return {Array} An array containing multiple lines
     */


    var applyLineBreaks = function applyLineBreaks(strTextAreaId) {
      var oTextarea = document.getElementById(strTextAreaId);

      if (oTextarea.wrap) {
        oTextarea.setAttribute("wrap", "off");
      } else {
        oTextarea.setAttribute("wrap", "off");
        var newArea = oTextarea.cloneNode(true);
        newArea.value = oTextarea.value;
        oTextarea.parentNode.replaceChild(newArea, oTextarea);
        oTextarea = newArea;
      }

      var strRawValue = oTextarea.value;
      oTextarea.value = "";
      var nEmptyWidth = oTextarea.scrollWidth; // var nLastWrappingIndex = -1;

      var testBreak = function testBreak(strTest) {
        oTextarea.value = strTest;
        return oTextarea.scrollWidth > nEmptyWidth;
      };

      var findNextBreakLength = function findNextBreakLength(strSource, nLeft, nRight) {
        var nCurrent;

        if (typeof nLeft == 'undefined') {
          nLeft = 0;
          nRight = -1;
          nCurrent = 64;
        } else {
          if (nRight == -1) nCurrent = nLeft * 2;else if (nRight - nLeft <= 1) return Math.max(2, nRight);else nCurrent = nLeft + (nRight - nLeft) / 2;
        }

        var strTest = strSource.substr(0, nCurrent);
        var bLonger = testBreak(strTest);
        if (bLonger) nRight = nCurrent;else {
          if (nCurrent >= strSource.length) return null;
          nLeft = nCurrent;
        }
        return findNextBreakLength(strSource, nLeft, nRight);
      };

      var i = 0,
          j;
      var strNewValue = "";

      while (i < strRawValue.length) {
        var breakOffset = findNextBreakLength(strRawValue.substr(i));

        if (breakOffset === null) {
          strNewValue += strRawValue.substr(i);
          break;
        } // nLastWrappingIndex = -1;


        var nLineLength = breakOffset - 1;

        for (j = nLineLength - 1; j >= 0; j--) {
          var curChar = strRawValue.charAt(i + j);

          if (curChar == ' ' || curChar == '-' || curChar == '+') {
            nLineLength = j + 1;
            break;
          }
        }

        strNewValue += strRawValue.substr(i, nLineLength) + "\n";
        i += nLineLength;
      }

      oTextarea.value = strNewValue;
      oTextarea.setAttribute("wrap", "soft");
      return oTextarea.value.split("\n");
    };
    /**
     * saveText
     * @description This will update the text annotation and renders it
     * @param  {Event} e The blur event object
     */


    var saveText = function saveText(e) {
      // annotation.text = textboxInput.value;
      // Check if there is any text
      annotation.text = applyLineBreaks('textbox-input'); // Remove empty lines at top

      while (annotation.text.length) {
        if (!annotation.text[0].length) annotation.text.splice(0, 1);else break;
      } // Remove empty lines at bottom


      while (annotation.text.length) {
        if (!annotation.text[annotation.text.length - 1].length) annotation.text.splice(annotation.text.length - 1, 1);else break;
      } // Check if empty


      if (!annotation.text.length) {
        annotation = null; // Empty annotation, delete it
      } else {
        // Set the index for annotation object
        annotation.index = $scope.activeBoard.annotations.length;
        annotation.ow = bgCanvas.el.width; // Check you have space is available or not
        // to accomodate this text, if not available move to top

        var requiredHeight = annotation.text.length * (annotation.fontSize + 6);

        if (requiredHeight + annotation.y > bgCanvas.el.height) {
          annotation.y = bgCanvas.el.height - requiredHeight;
        }

        if (annotation.y < annotation.fontSize) {
          annotation.y = annotation.fontSize;
        }

        var maxTextWidth = 0;
        fgCanvas.ctx.font = annotation.fontSize + "pt " + annotation.fontStyle; // Calculating context dimensions

        for (var i = 0; i < annotation.text.length; i++) {
          var textWidth = fgCanvas.ctx.measureText(annotation.text[i]).width;
          maxTextWidth = textWidth > maxTextWidth ? textWidth : maxTextWidth;
        }

        annotation.w = maxTextWidth; // Modify the annotation height to adapt to new height

        annotation.h = requiredHeight; // Apply the bounds for the rendered canvas

        annotation.setBounds(); // Render the annotation

        annotation.bgRender(); // Add the object to the service

        $scope.activeBoard.add(annotation); // Clear the input field which has the previous value

        e.target.value = ""; // Send a socket to add the annotation

        $exchange.publish('wb:add-annotation', {
          board: $scope.activeBoard.index,
          annotation: annotation
        });
      }

      textboxInput.removeEventListener('blur', saveText);
      textbox.style.display = 'none'; // Hide the textbox
      //textboxInput.removeEventListener('keyup', autogrow);

      canvas.addEventListener('mousedown', mouseDown);
    }; // Take a canvas used to bind events.
    // Choosing my best friend ghost canvas. He is light and fast..
    // var canvas = angular.element(document.querySelector('#fg-canvas'));


    var canvas = document.querySelector('#fg-canvas'); // Check if the current user has the privilege

    if (Privilege.currentPrivilege.id === Users.current.id) {
      canvas.addEventListener('mousedown', mouseDown);
    }

    $rootScope.$on('privilege-enabled', function (event, status) {
      // console.log('BOARD : My Privilege - ' + status);
      if (status) {
        // Enable the canvas
        canvas.addEventListener('mousedown', mouseDown);
      } else {
        // Disable the canvas
        canvas.removeEventListener('mousedown', mouseDown);
        canvas.removeEventListener('mousemove', mouseMove);
        canvas.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp); // clear the fg canvas

        fgCanvas.clear(); // Reset the textbox

        textboxInput.removeEventListener('blur', saveText);
        textboxInput.value = '';
        textbox.style.display = 'none'; // Clear the annotation

        annotation = null; // Check pointer and render if it is set

        if (Pointer.check()) {
          // Render the pointer on foreground canvas
          Pointer.annotation.fgRender(true);
        }

        console.log('canvas is disabled');
      }
    }); //Trigger a annotation privilege notification on top of the whiteboard

    $rootScope.$on('privilege-board-notification', function (event, msg) {
      notification.alert("privilege", msg);
    }); //==============================================================================
    // FUNCTIONS - Core functions of the module
    //==============================================================================

    /**
     * @ngdoc function
     * @name  getMouseCoordinates
     * @description
     * Calculates the relative mouse location instead of absolute
     * @param  {number} e [description]
     */

    var getMouseCoordinates = function getMouseCoordinates(e) {
      var x = e.pageX - Math.round(offset(fgCanvas.el).left);
      var y = e.pageY - Math.round(offset(fgCanvas.el).top);
      return {
        x: x,
        y: y
      };
    };
    /**
     * @ngdoc function
     * @name addBoard
     * @description
     * Adds a new tab and a board associated with it
     */


    var addBoard = function addBoard() {
      // Check for the Boards Threshold limit (4 Boards Max.)
      // if(collection.boards.length >= 4 && $scope.user.role === 'teacher') {
      // 	Alert.notify('alert-info', 'Maximum of 4 Whiteboards are only allowed', 2000);
      // 	return false;
      // }
      // Get a new instance of Board
      var board = new Board({
        index: collection.boards.length,
        label: 'Whiteboard'
      }); // Update the Collection

      collection.boards.push(board); // Open the board

      openBoard(board.index); // Return the board object, so it can be used elsewhere

      return board;
    };
    /**
     * Opens the requested tab and board associated to it
     * @param  {number} index The index of the tab / board
     */


    var openBoard = function openBoard(index) {
      // Update the Collection data
      collection.activeBoard = index; // Store the previous active board

      previousBoard = $scope.activeBoard; // Update the active board

      $scope.activeBoard = collection.boards[index];
      console.log('Inside Open Board : Board: ', $scope.activeBoard);
      $scope.activeBoard.show();
      var iframe = document.getElementById("content-area").getElementsByTagName("iframe");

      if (iframe) {
        $timeout(function () {
          for (var i = 0; i < iframe.length; i++) {
            if (iframe[i] && iframe[i].contentDocument) {
              var playing = iframe[i].contentDocument.querySelector('.video_player .controls .play .selected');
              var video = iframe[i].contentDocument.querySelector('video');

              if (iframe[i].style.display == "block") {
                if (playing == null && video != null) {
                  video.click();
                }
              } else {
                if (video != null && playing != null) {
                  video.click();
                }
              }
            }
          }
        }, 500);
      }
    };
    /**
     * Closes the Tab and removes the corresponding Board & Data
     * @param  {number} index The index of the tab / board
     */


    var closeBoard = function closeBoard(index) {
      if (!angular.isDefined(collection.boards[index])) return; // Check if pointer is pinned on any board

      if (Pointer.isActive) {
        // Check if current board has the pointer
        if (Pointer.boardIndex === index) {
          Pointer.isActive = false;
        } // Check if any neighbour board has the pointer
        else if (index < Pointer.boardIndex) {
            Pointer.boardIndex = Pointer.boardIndex - 1;
          }
      } // Run the close function of the board


      collection.boards[index].close();
      /** Check for displaying delete icon when the file is mounted on the whiteboard */

      $scope.$emit('delete-mounted-image', {
        name: collection.boards[index].label,
        index: index,
        action: 'close'
      }); // Note:: Should think of a better strategy
      // in deleting objects and faster garbage collection...
      // Nullify the object first
      // So it will be garbage collected immediately
      // I would not recommend delete. Never...really

      collection.boards[index] = null; // Now we can happily remove the object at index

      collection.boards.splice(index, 1); // Reset the indexes of all the boards in the room
      // Puffy solution like dynamic $index of Angular :)

      for (var i = 0; i < collection.boards.length; i++) {
        collection.boards[i].index = i;
      } // If the closed tab is active tab,
      // we have to open some other tab
      // The below check have been commented to resolve the issue
      // ("On deletion of nextwhiteboard from current board on the dropdown, a white screen appears")
      //if(index <= $scope.activeBoard.index) {
      // Check for neighbour tabs
      // If available show the tab, else create new one
      // Checking Leading Tabs


      if (collection.boards[index]) {
        openBoard(index);
      } // Checking tailing tabs
      else if (collection.boards[index - 1]) {
          openBoard(index - 1);
        } // No neighbours found. There should be atleast one board.
        // So add a new board.
        else {
            addBoard();
          } //}

    };
    /**
     * @ngdoc function
     * @name syncBoards
     * @description
     * Checks if there are boards in the collection and renders
     * If none are found, adds a new whiteboard
     */


    var syncBoards = function syncBoards() {
      // NOTE :: Everytime when screen changes, the UI will be removed
      // So render everytime we visit the Whiteboard screen
      // Should use transition instead of rendering,
      // Lot of booze to fix up :(
      // Reset the collection
      collection = {
        activeBoard: null,
        boards: []
      }; // Reassign the scope reference to avoid object relation losing

      $scope.collection = collection;
      /*
      // Remove all the content in the content area
      // This approach is 99% faster than setting innerHTML to empty
      var node = Layout.contentArea;
      	// Remove all the childs in the element node
      while (node.firstChild) {
      	node.removeChild(node.firstChild);
      }
      */

      var boardData = null;

      if ($scope.$parent.wbData && $scope.$parent.wbData.boards.length) {
        // Loop through all the boards
        // Add Tabs for each board
        for (var i = 0; i < $scope.$parent.wbData.boards.length; i++) {
          // Create the board data
          boardData = $scope.$parent.wbData.boards[i]; // Create a new board instance

          var board = new Board({
            index: boardData.index,
            label: boardData.label,
            type: boardData.type,
            annotations: [] // Have to do object import

          }); // Check and set this as the active board

          if ($scope.$parent.wbData.activeBoard === board.index) {
            $scope.activeBoard = board;
          } // Push into the collection


          collection.boards.push(board); // Based on board type we create it differently

          switch (boardData.type) {
            case 'BLANK':
              // Check if there are any annotations
              if (boardData.annotations) {
                // Import all the annotations into the board
                for (var j = 0; j < boardData.annotations.length; j++) {
                  // Check if the object is available but not null
                  if (boardData.annotations[j]) {
                    board["import"](boardData.annotations[j]);
                  } else {
                    // Directly assign the null value
                    board.annotations[j] = null;
                  }
                }
              }

              break;

            case 'ISPRING':
              // Update the label of the board
              board.label = boardData.mount.label;
              board.type = "ISPRING";
              board.mountData = boardData.mount;
              /** Set the action to ppt to handle the mounted files and
               * display/hide delete icon */

              $scope.$emit('delete-mounted-image', {
                name: board.label,
                index: board.index,
                action: 'ppt'
              });
              break;

            case 'IMAGE':
              // Check if there are any annotations
              if (boardData.annotations) {
                // Import all the annotations into the board
                for (var k = 0; k < boardData.annotations.length; k++) {
                  // Check if the object is available but not null
                  if (boardData.annotations[k]) {
                    board["import"](boardData.annotations[k]);
                  } else {
                    // Directly assign the null value
                    board.annotations[k] = null;
                  }
                }
              } // Update the data, label, type of board


              board.label = boardData.mount.label;
              board.type = boardData.type;
              board.mountData = boardData.mount;
              /** Maintain the name and boardIndex to display the delete icon in the
               * explorer popup based on whether the image is mounted on the whiteboard
              */

              $scope.$emit('delete-mounted-image', {
                name: board.label,
                index: board.index,
                action: 'import'
              });
              break;

            default:
              throw 'Unsupported file encountered';
          }
        } // Update the pointer code


        Pointer.boardIndex = $scope.$parent.wbData.pointer.boardIndex;
        Pointer.slideIndex = $scope.$parent.wbData.pointer.slideIndex;
        Pointer.annotation.x = $scope.$parent.wbData.pointer.annotation.x;
        Pointer.annotation.y = $scope.$parent.wbData.pointer.annotation.y;
        Pointer.annotation.ow = $scope.$parent.wbData.pointer.annotation.ow;
        Pointer.isActive = $scope.$parent.wbData.pointer.isActive;
        Pointer.updateCoordinates(Pointer.annotation.x, Pointer.annotation.y); // Open the active board

        openBoard($scope.$parent.wbData.activeBoard);
      }
    };
    /**
     * @ngdoc function
     * @name syncMountContent
     * @description
     * Syncs the mounted file data of all boards to a object variable
     */


    var syncMountContent = function syncMountContent() {
      var board;

      for (var i = 0; i < collection.boards.length; i++) {
        board = collection.boards[i];

        if (board.type === 'ISPRING') {
          if (board.mount) {
            // Only sync if PPT is already mounted, else we have the raw data already
            board.mountData = {
              url: board.mount.url,
              label: board.mount.label,
              //slides: board.mountData.slides, // Keep the previously available data
              activeSlide: board.mount.activeSlide,
              activePanel: board.mount.activePanel,
              stepIndex: board.mount.stepIndex,
              layout: board.mount.layout,
              // Cache the content of the mount to reuse
              cache: {
                //content: board.mount.content,
                thumbs: board.mount.thumbs,
                slides: board.mount.slides
              }
            };
            board.mount = null; // Remove the mount object data
            // Inject the iframe into the content area of DOM
            //Layout.contentArea.appendChild(board.mount.content);
          }
        } else if (board.type === 'IMAGE') {
          if (board.mount) {
            board.mountData = {
              url: board.mount.url,
              label: board.mount.label,
              layout: board.mount.layout,
              type: board.mount.type
            };
            board.mount = null;
          }
        }
      }
    }; //==============================================================================
    // SCOPE METHODS - Scope methods triggered by DOM are here
    //==============================================================================

    /**
     * @ngdoc function
     * @name  scrollTo
     * @description
     * Scrolls to that particular element, if it is inside a div
     * @param  {object} DOM element
     */


    $scope.scrollTo = function (elem) {
      if (elem) {
        // If element exists scroll to top
        if (elem.parentNode) {
          elem.parentNode.scrollTop = elem.offsetTop - elem.parentNode.offsetTop;
        }
      }
    };

    $scope.slideMenuVisibility = 0; // Controls the visibility of slide menu

    /**
     * @ngdoc function
     * @name  toggleSlideMenu
     * @description
     * Toggles the slide menu in the dropdown button
     * @param  {object} DOM element
     */

    $scope.toggleSlideMenu = function (e) {
      if (!$scope.disableControls) {
        e.preventDefault();
        e.stopPropagation();
        $scope.slideMenuVisibility = !$scope.slideMenuVisibility;

        if ($scope.slideMenuVisibility) {
          $timeout(function () {
            document.getElementById('dropdown-slide-menu').focus();
          }, 100);
        }
      }
    }; //==============================================================================
    // MANAGE TABS/BOARDS - Tab methods that are binded to DOM
    //==============================================================================

    /**
     * @ngdoc function
     * @name addTab
     * @description
     * 		Calls the addTab and triggers a socket request
     */


    $scope.addTab = function () {
      // Sending the data to Analytics factory to track the events
      Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, "Add New Whiteboard"); // Add a board

      var board = addBoard(); // Send Socket :: add-board

      if (board && $scope.user.role === 'teacher') {
        $exchange.publish('wb:add-board');
      }
    };
    /**
     * @ngdoc function
     * @name openTab
     * @description
     * Calls the openBoard function and sends a socket
     * @param  {number} index The index of the tab / board
     */


    $scope.openTab = function (index) {
      // Open the Board (Show)
      openBoard(index); // Cross check - Only teacher has access to this operation

      if ($scope.user.role === 'teacher') {
        $exchange.publish('wb:open-board', {
          index: index
        });

        if ($scope.activeBoard.type == "ISPRING") {
          $scope.showNotesPanel = true;
          $timeout(function () {
            notesScroller.scrollTo(0, 0);
            notesScroller.refresh();
          }, 600);
        }
      }
    };
    /**
     * @ngdoc function
     * @name openTab
     * @description
     * Calls the closeBoard and sends a socket
     * @param  {number} index The index of the tab / board
     */


    $scope.closeTab = function (index, event) {
      // Sending the data to Analytics factory to track the events
      Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, "Close Whiteboard");
      event.stopPropagation();
      event.preventDefault(); // Close the board

      closeBoard(index); // Cross check - Only teacher has access to this operation

      if ($scope.user.role === 'teacher') {
        $exchange.publish('wb:close-board', {
          index: index
        });
      }
    };

    $scope.showTabMenu = false; // controlls the visibility of tab menu.

    /**
     * @ngdoc function
     * @name toggleTabMenu
     * @description
     * Calls the toggleTabMenu function and controls the visibility of the whiteboard tab menu.
     */

    $scope.toggleTabMenu = function () {
      $scope.showTabMenu = !$scope.showTabMenu;

      if ($scope.showTabMenu) {
        $timeout(function () {
          document.getElementById('wb-tab').focus();
        }, 100);
      }
    };
    /**
     * @ngdoc function
     * @name closeTabMenu
     * @description
     * This function is to close the whiteboard tab menu.
     */


    $scope.closeTabMenu = function () {
      $scope.showTabMenu = false;
    }; //==============================================================================
    // SCOPE EVENTS - Scope events will be handled here
    //==============================================================================
    // IMPORT-FILE


    $scope.$on('import-file', function (event, data) {
      if (data.fileType == "ppt") {
        // Check if any board is in active state.
        // Just a security measure. stop process.
        if (!$scope.activeBoard) return; // Check if there is already a mounted file
        // If so, unmount it

        if ($scope.activeBoard.mount) {
          $scope.activeBoard.unmount();
        }

        data.type = 'ISPRING';
        data.label = data.name;
        data.board = $scope.activeBoard.index;
        /** Upload as action ppt. Sends label, board and fileType
        */

        $scope.$emit('delete-mounted-image', {
          name: data.label,
          index: data.board,
          action: 'ppt'
        });

        if ($scope.user.role == "teacher") {
          $scope.showNotesPanel = true;
          scroller.scrollTo(0, 0); //Setting Thumbnail scroller to 0
        } // Unset the pointer if pinned in board


        if (Pointer.boardIndex == $scope.activeBoard.index) {
          Pointer.isActive = false;
        } // A dummy iSpring File instance


        var file = File.Ispring.objectify(data); // Send a socket

        $exchange.publish('wb:import-file', data); // Mount the file on whiteboard

        $scope.activeBoard.mountFile(file);
      } else if (data.fileType == "image") {
        // Check if any board is in active state.
        // Just a security measure. stop process.
        if (!$scope.activeBoard) return; // Check if there is already a mounted file
        // If so, unmount it

        if ($scope.activeBoard.mount) {
          $scope.activeBoard.unmount();
        }

        $scope.$emit('delete-mounted-image', {
          name: data.file.name,
          index: $scope.activeBoard.index,
          action: 'import'
        });
        /** All the below 3 logics are applicable for all conditions
        *  whiteboard -> image; image -> image; ppt -> image
        */
        // Clears the annotations, when an image is loaded either
        // on whiteboard or on a board with image already loaded

        $scope.activeBoard.annotations = []; // Unset the pointer if pinned in board

        if (Pointer.boardIndex == $scope.activeBoard.index) {
          Pointer.isActive = false;
        } // Send a socket to clear all


        $exchange.publish('wb:clear-all', {
          board: $scope.activeBoard.index
        });
        /***************************************************/

        data.file.label = data.file.name;
        var image = File.Image.objectify(data.file);
        image.board = $scope.activeBoard.index; // Send a socket

        $exchange.publish('wb:import-file', image); // Mount the file on whiteboard

        $scope.activeBoard.mountFile(image);
      }
    }); // CLEAR-ALL

    $scope.$parent.$on('clear-all', function () {
      if ($scope.activeBoard.type !== "ISPRING" && !$scope.activeBoard.annotations.length || $scope.activeBoard.type === "ISPRING" && !$scope.activeBoard.mount.slides[$scope.activeBoard.mount.activeSlide].annotations.length) {
        return false;
      } // Clear the active board


      $scope.activeBoard.clear(); // Send a socket to clear all

      $exchange.publish('wb:clear-all', {
        board: $scope.activeBoard.index
      });
    }); //==============================================================================
    // SOCKET LISTENERS - Register for the socket events
    //==============================================================================
    // WB:ADD-BOARD

    var socketAddBoard = function socketAddBoard(msg) {
      // Using $timeout as $scope.$apply() is not working properly
      // It's a Hack, but a good one :)
      $timeout(function () {
        addBoard();
      }, 10);
    };

    $exchange.io.on('wb:add-board', socketAddBoard); // WB:OPEN-BOARD

    var socketOpenBoard = function socketOpenBoard(msg) {
      $timeout(function () {
        openBoard(msg.data.index);
      }, 10);
    };

    $exchange.io.on('wb:open-board', socketOpenBoard); // WB:CLOSE-BOARD

    var socketCloseBoard = function socketCloseBoard(msg) {
      $timeout(function () {
        closeBoard(msg.data.index);
      }, 10);
    };

    $exchange.io.on('wb:close-board', socketCloseBoard); // WB:ADD-ANNOTATION

    var socketAddAnnotation = function socketAddAnnotation(msg) {
      console.log('msg.data.board', msg.data.board);
      checkActiveBoardIndex(msg.data.board);
      console.log('$scope.activeBoard', $scope.activeBoard);
      $scope.activeBoard["import"](msg.data.annotation);
    };

    $exchange.io.on('wb:add-annotation', socketAddAnnotation); // WB:REMOVE-ANNOTATION

    var socketRemoveAnnotation = function socketRemoveAnnotation(msg) {
      checkActiveBoardIndex(msg.data.board);

      if ($scope.activeBoard.type === 'ISPRING') {
        $scope.activeBoard.mount.slides[$scope.activeBoard.mount.activeSlide].annotations[msg.data.annotation].remove();
      } else {
        $scope.activeBoard.annotations[msg.data.annotation].remove();
      } // Render the board


      $scope.activeBoard.render();
    };

    $exchange.io.on('wb:remove-annotation', socketRemoveAnnotation); // WB:CLEAR-ALL

    var socketClearAll = function socketClearAll(msg) {
      checkActiveBoardIndex(msg.data.board); // Clear the active board

      $scope.activeBoard.clear();
    };

    $exchange.io.on('wb:clear-all', socketClearAll); // WB:IMPORT-FILE

    var socketImportFile = function socketImportFile(msg) {
      if (msg.data.type == "ISPRING") {
        checkActiveBoardIndex(msg.data.board);
        $timeout(function () {
          if (!$scope.activeBoard) return; // Unset the pointer if pinned in board

          if (Pointer.boardIndex == $scope.activeBoard.index) {
            Pointer.isActive = false;
          } // Unmount if there is already a file mounted


          if ($scope.activeBoard.mount) {
            $scope.activeBoard.unmount();
          } // Create a file object


          var file = File.Ispring.objectify(msg.data); // Mount the file on whiteboard

          $scope.activeBoard.mountFile(file);
        }, 10);
      } else if (msg.data.type == "IMAGE") {
        $timeout(function () {
          if (!$scope.activeBoard) return; // Unset the pointer if pinned in board

          if (Pointer.boardIndex == $scope.activeBoard.index) {
            Pointer.isActive = false;
          } // Unmount if there is already a file mounted


          if ($scope.activeBoard.mount) {
            $scope.activeBoard.unmount();
          } // Create a image object


          var image = File.Image.objectify(msg.data); // Mount the file on whiteboard

          $scope.activeBoard.mountFile(image);
        }, 10);
      }
    };

    $exchange.io.on('wb:import-file', socketImportFile); // WB:PPT-ACTION

    var socketPPTAction = function socketPPTAction(msg) {
      console.log("socketPPTAction");
      console.log(msg);
      console.log($scope.activeBoard);
      console.log(msg.data.slide); // Check the stepIndex, If set > 0, it means some animation played in current slide (Show Animation)
      // Else, it means slide has changed, (Change Slide)

      if (msg.data.stepIndex) {
        console.log("entered gotoTimestamp");
        $scope.activeBoard.mount.driver.pbController.gotoTimestamp(msg.data.slide, msg.data.stepIndex, 0, true);
      } else {
        console.log("entered gotoSlide");
        $timeout(function () {
          $scope.activeBoard.mount.driver.pbController.gotoSlide(msg.data.slide);
        });
      }
    };

    $exchange.io.on('wb:ppt-action', socketPPTAction); // WB::UPDATE-POINTER

    var socketUpdatePointer = function socketUpdatePointer(msg) {
      // Update the pointer parameters and call in the render function of pointer
      Pointer.boardIndex = msg.data.board;
      Pointer.slideIndex = msg.data.slide;
      Pointer.annotation.x = msg.data.annotation.x;
      Pointer.annotation.y = msg.data.annotation.y;
      Pointer.annotation.ow = msg.data.annotation.ow;
      Pointer.isActive = msg.data.isActive; // Update the coordinates

      Pointer.updateCoordinates(Pointer.annotation.x, Pointer.annotation.y); // Render the pointer

      Pointer.annotation.fgRender(true);
    };

    $exchange.io.on('wb:update-pointer', socketUpdatePointer); // WB::REMOVE-POINTER

    var socketRemovePointer = function socketRemovePointer(msg) {
      // Unset the pointer parameters and set the active flag to false
      Pointer.isActive = false; // Clear the fg canvas

      fgCanvas.clear();
    };

    $exchange.io.on('wb:remove-pointer', socketRemovePointer); // Checks the board indexes, and changes active board if not matched

    var checkActiveBoardIndex = function checkActiveBoardIndex(index) {
      // Compare the board index, if no match change active board
      if ($scope.activeBoard.index != index) {
        $scope.activeBoard = collection.boards[index];
      }
    }; // Check if collection is already updated


    if (!collection.boards.length) {
      // Run the sync process
      syncBoards(); // This means no render has happened, attach the message handlers here
    } else {
      // Open the active board
      openBoard(collection.activeBoard);
    }

    $scope.adjustFont = function ($event, action) {
      var $actionHandle, activeClass, $notesWrapper; // Sending the data to Analytics factory to track the events

      Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, "Adjust Font"); // Get the clicked action handle.

      $actionHandle = angular.element($event.target);
      activeClass = 'current-active'; // active class used to highlight the current action handle.
      // Do nothing if the action handle is already active.

      if ($actionHandle.hasClass(activeClass)) {
        return false;
      } // Get the notes wrapper element


      $notesWrapper = angular.element(document.getElementById('wrapperNotes')); // Remove the classes, before performing any other operations

      $notesWrapper.removeClass('increase decrease'); // Remove the active class from action handles

      angular.element(document.querySelectorAll('.notesControls .font-buttons span')).removeClass(activeClass); // Add active class to the clicked handle.

      $actionHandle.addClass(activeClass); // If the action is not default then add the necessary action to the notes wrapper element.

      if (action !== 'default') {
        $notesWrapper.addClass(action);
      } // Globally setting the font action value for reuse in mutiple state.


      $rootScope.fontAction = action; // Refresh the scroller.

      $timeout(function () {
        notesScroller.refresh();
      }, 300);
    }; //==============================================================================
    // DESTROY LISTENER - Handle any ops before view is destroyed
    //==============================================================================


    $scope.$on('$destroy', function () {
      syncMountContent(); // Sync the mounted contents of the board
      // Removing Event Bindings

      angular.element(window).unbind("resize", Layout.adapt); // Unset socket listeners

      $exchange.io.removeListener('wb:add-board', socketAddBoard);
      $exchange.io.removeListener('wb:open-board', socketOpenBoard);
      $exchange.io.removeListener('wb:close-board', socketCloseBoard);
      $exchange.io.removeListener('wb:add-annotation', socketAddAnnotation);
      $exchange.io.removeListener('wb:remove-annotation', socketRemoveAnnotation);
      $exchange.io.removeListener('wb:clear-all', socketClearAll);
      $exchange.io.removeListener('wb:import-file', socketImportFile);
      $exchange.io.removeListener('wb:ppt-action', socketPPTAction);
      $exchange.io.removeListener('wb:update-pointer', socketUpdatePointer);
      $exchange.io.removeListener('wb:remove-pointer', socketRemovePointer);
    });
  };

  return directive;
}]);
//# sourceMappingURL=board.directive.js.map

"use strict";

DC.directive('brandHeader', function () {
  var directive = {};
  directive.restrict = 'A';
  directive.templateUrl = '/views/brandheader.html';
  return directive;
});
//# sourceMappingURL=brandheader.directive.js.map

"use strict";

/**
 * @directive wbPrivilege
 * @description This directive builds up for Privilege.
 *              It shows the status of annotation privilege inside the classroom.
 *              It manages the grant and revoke functionality for the teachers.
 */
DC.directive('wbBreakout', [// Dependencies
'$exchange', '$rootScope', '$timeout', '$interval', '$http', 'Auth', 'userService', 'BreakoutRoom', 'timerService', // CallBack
function ($exchange, $rootScope, $timeout, $interval, $http, Auth, Users, BreakoutRoom, Timer) {
  //==============================================================================
  // DIRECTIVE - This contains the directive properties and fuctions
  //==============================================================================
  var directive = {};
  directive.restrict = 'E';
  directive.templateUrl = '/views/partials/classroom/whiteboard/breakout.html';
  directive.controller = breakoutController;
  directive.controllerAs = 'breakout';
  directive.bindToController = true; // Scope Isolation

  directive.replace = false;
  return directive; // Controller Function

  function breakoutController($scope) {
    var breakout = this; // Sync the students data

    breakout.students = Users.getStudents();
    breakout.teacher = Users.getTeacher(); //default breakout TimeSlot

    breakout.timeSlot = '-1'; // Breakout room collection

    breakout.rooms = []; // Set the necessary flags

    breakout.isVisible = false; // Controls visibility of directive

    breakout.isVisibleAnimate = false; // Controls initial animation effect

    breakout.studentsAvailable = false; // Controls visibility of students list

    breakout.isRunning = false; // Flag if any breakout is running

    breakout.isDisabled = true; // Flag to disable breakouts

    /**
     * @ngdoc function
     * @name transformUsersData
     * @description Transforms the user data to accomodate breakouts data
     */

    var transformUsersData = function transformUsersData(data) {
      // Set the default data transformations
      for (var stuIndex = 0; stuIndex < breakout.students.length; stuIndex++) {
        // Update the student availability
        breakout.students[stuIndex].isAvailableBreakout = true; // Update the breakout room id to original room

        breakout.students[stuIndex].breakoutRoom = null; // Tracks if user audio is muted

        breakout.students[stuIndex].breakoutMuted = false; // Set the running state to false

        breakout.students[stuIndex].breakoutRunning = false;
      } // Set the default data for teacher


      breakout.teacher.breakoutRoom = null;
      breakout.teacher.breakoutRunning = false;
    };
    /**
     * @ngdoc function
     * @name syncBreakoutData
     * @description Syncs the breakouts to the db data
     */


    var syncBreakoutData = function syncBreakoutData(data) {
      // Sync the breakout status to running flag
      breakout.isRunning = data.isActive;
      $rootScope.$emit('breakout-running', breakout.isRunning); // Link the teacher room

      breakout.teacher.breakoutRoom = data.teacherRoom; // Create rooms based on room data

      for (var i = 0; i < data.rooms.length; i++) {
        var room = new BreakoutRoom({
          id: data.rooms[i].id,
          title: data.rooms[i].title
        }); // Check if breakouts is populated

        if (data.rooms[i].users.length) {
          // Populate the breakout users
          for (var j = 0; j < data.rooms[i].users.length; j++) {
            var user = Users.getUser(data.rooms[i].users[j]);

            if (user) {
              room.addUser(user);
            }
          }
        } // If breakouts was active, start the room


        if (data.isActive) {
          room.start();
        }

        breakout.rooms.push(room);
      }

      if (breakout.isRunning) {
        // Manipulate the audio levels
        breakout.manipulateAudioLevels();

        if (data.timeSlot > 0) {
          // Binding timer in seconds - runningback timer from the remaining time
          bindTimerToBreakout(data.remainingTime);
        } //Binding the timeslot to timer dropdown


        breakout.timeSlot = data.timeSlot;
      }
    };
    /**
     * @ngdoc function
     * @name checkStudentsAvailability
     * @description Checks if students are available in the class
     */


    var checkStudentsAvailability = function checkStudentsAvailability() {
      try {
        // Check if any user is already joined
        for (var studentIndex = 0; studentIndex < breakout.students.length; studentIndex++) {
          if (breakout.students[studentIndex].joined) {
            breakout.studentsAvailable = true;
            break;
          }
        }
      } catch (err) {
        console.log('Error: ' + err);
      } // finally{
      // 	return breakout.studentsAvailable;
      // }

    };
    /**
     * @ngdoc function
     * @name checkBreakoutRunning
     * @description Checks if any breakout is currently running
     */


    var checkBreakoutRunning = function checkBreakoutRunning() {
      breakout.isRunning = false; // Start with false to avoid data mispret
      // Check if any room is running

      for (var roomIndex = 0; roomIndex < breakout.rooms.length; roomIndex++) {
        if (breakout.rooms[roomIndex].isRunning) {
          breakout.isRunning = true;
          break;
        }
      } // Teacher check


      if (breakout.teacher.breakoutRoom || breakout.teacher.breakoutRoom == 0) {
        // Check if there are minimum users in room
        if (breakout.rooms[i].users.length < 2) {
          // Take back teacher to common room
          breakout.teacher.breakoutRoom = null;
          breakout.teacher.breakoutRunning = false;
        }
      } // Unset the active state of rooms if there are no users (two) in any room


      var unset = true;

      for (var roomIndexLength = 0; roomIndexLength < breakout.rooms.length; roomIndexLength++) {
        if (breakout.rooms[roomIndexLength].users.length >= 2) {
          unset = false;
          break;
        }
      } // Apply the state of unset to all the rooms


      if (unset) {
        breakout.isRunning = false;

        for (var roomsIndex = 0; roomsIndex < breakout.rooms.length; roomsIndex++) {
          breakout.rooms[roomsIndex].isActive = false;
          breakout.rooms[roomsIndex].isRunning = false;
        }
      } // Timer Integration


      if (!breakout.isRunning) {
        // -- Clear the timers --
        // Check if timer is set on breakout
        if (breakoutTimer) {
          unBindTimerToBreakout();
        } // Check if interval is set on breakout


        if (intervalClock) {
          unBindIntervalTimer();
        }
      } // If any breakout is running disable teacher controls


      if (breakout.isRunning) {
        disableControls();
      } else {
        enableControls();
      }

      $rootScope.$emit('breakout-running', breakout.isRunning);
    };
    /**
     * @ngdoc function
     * @name enableControls
     * @description Enables privilege and other app controls
     */


    var enableControls = function enableControls() {
      if (Users.current.role == 'teacher') {
        $rootScope.$emit('privilege-enabled', true);
        $rootScope.$emit('enable-controls');
        $rootScope.$emit('enable-privilege');
      }
    };
    /**
     * @ngdoc function
     * @name disableControls
     * @description Disables privilege and other app controls
     */


    var disableControls = function disableControls() {
      if (Users.current.role == 'teacher') {
        $rootScope.$emit('privilege-enabled', false);
        $rootScope.$emit('disable-controls');
        $rootScope.$emit('disable-privilege');
      }
    };

    var getUpdatedBreakoutData = function getUpdatedBreakoutData() {
      var sessionData = Auth.getData();
      return new Promise(function (resolve, reject) {
        $http.get("/api/activity/" + sessionData.activityId + '?' + new Date().getTime()).then(function (response) {
          if (response.data.data) {
            var breakoutsData = response.data.data.dcAppData.wbData.breakouts;
            resolve(breakoutsData);
          } else {
            resolve(response.data);
          }
        }, function (response) {
          reject(response.data.errors);
        });
      });
    };

    var checkBreakoutDisabled = function checkBreakoutDisabled() {
      breakout.isDisabled = true; //Check if the remaining session time more than 5 minutes.

      if (Timer.remainingMinutes <= 5) {
        return;
      } // Check if breakouts can be started


      for (var i = 0; i < breakout.rooms.length; i++) {
        if (breakout.rooms[i].users.length >= 2) {
          breakout.isDisabled = false;
          break;
        }
      }
    }; // Attach the handler into the timer service


    Timer.setBreakoutNotifier(checkBreakoutDisabled);
    /**
     * @ngdoc function
     * @name togglePopup
     * @description Toggles the visibility of the breakout popup (show / hide)
     */

    breakout.togglePopup = function () {
      // Toggle the visibility flag
      breakout.isVisible = !breakout.isVisible;
    };
    /**
     * @ngdoc function
     * @name dropToBreakoutRoom
     * @description Handler when a user is dropped into a breakout room
     */


    breakout.dropToBreakoutRoom = function (event, index, item, external, type, roomIndex, selectedRoom) {
      // Fetch student reference from service, since item is not a reference
      var student = Users.users[item.id]; // Fetch the room reference

      var room = this.rooms[roomIndex]; // If user is already in a breakout room remove from previous room

      if (!student.isAvailableBreakout) {
        var previousRoom = this.rooms[student.breakoutRoom]; // If both rooms are same skip

        if (previousRoom.id === room.id) {
          return;
        } // Remove user from previous room / location


        previousRoom.removeUser(student); // Insert the user into the dropped room

        room.addUser(student, index); // Check if room does not have two users

        /*if (previousRoom.users.length < 2) {
        		previousRoom.signal(true);
        }
        else {
        		previousRoom.signal(false);
        }*/
        // Special socket for major issue quick fix
        // TEMP fix, should handle this in MongoDB concurrency
        // Caused when two sockets parallely fetch the data and update
        // The first updated data will be lost and second updated will overwrite evrything
        // So to avoid parallel sockets we are firing a single operation SWAP

        $exchange.publish('breakout:swap-user', {
          user: student.id,
          fromRoom: previousRoom.id,
          toRoom: room.id,
          toIndex: index
        });
      } else {
        // Insert the user into the dropped room
        // room.addUser(student, index).signal();
        room.addUser(student, index);
        room.signal();
      }

      checkBreakoutRunning();
      checkBreakoutDisabled(); // Manipulate audio controls

      breakout.manipulateAudioLevels();
    }; // 1. setting timer to breakout rooms
    // 2. when the selected time is reached - breakouts has to stop automatically
    // 3. selected time from UI is sent here


    var breakoutTimer; // Controls the timer promise object

    /**
     * @ngdoc function
     * @name bindTimerToBreakout
     * @description Binds the breakout timer
     */

    var bindTimerToBreakout = function bindTimerToBreakout(time) {
      breakoutTimer = $timeout(function () {
        breakoutTimer = null;
        breakout.stopAllRooms(true);
      }, time * 1000); // Bind timer to breakout

      bindIntervalTimer(time);
    };
    /**
     * @ngdoc function
     * @name unBindTimerToBreakout
     * @description Unbinds the breakout timer, if teacher stops breakout before the timer ends
     */


    var unBindTimerToBreakout = function unBindTimerToBreakout() {
      if (breakoutTimer) {
        // Cancel the running timer
        $timeout.cancel(breakoutTimer); // Nullify the timer variable

        breakoutTimer = null; // Reset the time slot

        breakout.timeSlot = -1;
      }
    }; //To store interval detail


    var intervalClock;
    /**
     * @ngdoc function
     * @name bindIntervalTimer
     * @description Binds the countdown timer
     */

    var bindIntervalTimer = function bindIntervalTimer(time) {
      //for timelimit
      var timeLimit = time; //Claculates the countdown timer

      intervalClock = $interval(function () {
        if (breakout.isRunning) {
          // converting to minutes from the chosen time limit
          var min = Math.floor(timeLimit / 60); // converting to seconds from time limit

          var sec = timeLimit % 60; // to display seconds in two digits - participant panel

          sec = sec < 10 ? "0" + sec : sec; // updating every second to the timelimit

          timeLimit = timeLimit - 1; //binding the time to participant panel
          //00 - hours
          //0 - mins(prefix)

          $rootScope.remainingTime = "00:0" + min + ":" + sec; // If timelimit reaches 0, countdown timer has to end

          if (timeLimit <= 0) {
            unBindIntervalTimer();
          }
        } else {
          unBindIntervalTimer();
        }
      }, 1000);
    };
    /**
     * @ngdoc function
     * @name unBindIntervalTimer
     * @description Unbinds the countdown timer from the breakout
     */


    var unBindIntervalTimer = function unBindIntervalTimer() {
      // Check whether interval is available
      if (intervalClock) {
        $interval.cancel(intervalClock); // Nullify the remaining time

        $rootScope.remainingTime = null;
        intervalClock = null;
      }
    };
    /**
     * @ngdoc function
     * @name dropToOriginalRoom
     * @description Handler when a user is dropped back into original room
     */


    breakout.dropToOriginalRoom = function (event, index, item, external, type) {
      // Getting user reference from service, since item is not a reference
      var student = Users.users[item.id]; // If student is already in original room, skip

      if (student.isAvailableBreakout) {
        return;
      } // Fetch the room reference


      var room = this.rooms[student.breakoutRoom]; // Remove user from previous room / location

      room.removeUser(student).signal();
      checkBreakoutRunning();
      checkBreakoutDisabled(); // Manipulate audio controls

      breakout.manipulateAudioLevels();
    };
    /**
     * @ngdoc function
     * @name startRoom
     * @description Starts the given breakout room
     */

    /*breakout.startRoom = function (roomIndex) {
    		// Check if minimum two users are in room
    	if (breakout.rooms[roomIndex].users.length < 2 || breakout.rooms[roomIndex].users.length > 4) {
    		return;
    	}
    		var room = this.rooms[roomIndex];
    		// Start the room
    	room.start();
    		// Flag that breakout is running
    	breakout.isRunning = true;
    		// Disable the controls
    	disableControls();
    		// Transform data model to hold only student id's
    	var data = {
    		id: room.id,
    		title: room.title,
    		users: []
    	};
    		for (var i=0; i < room.users.length; i++) {
    		data.users.push(room.users[i].id);
    	}
    		// Send socket message
    	$exchange.publish('wb:breakout-start', data);
    };*/

    /**
     * @ngdoc function
     * @name stopRoom
     * @description Stops the given breakout room
     */

    /*breakout.stopRoom = function (roomIndex) {
    		var room = this.rooms[roomIndex];
    		// Stop the room
    	room.stop();
    		// Check the running status
    	checkBreakoutRunning();
    		var data = {
    		id: room.id
    	};
    		// Send socket message
    	$exchange.publish('wb:breakout-stop', data);
    };*/

    /**
     * @ngdoc function
     * @name startAllRooms
     * @description Starts all the running breakout rooms
     */


    breakout.startAllRooms = function () {
      // Find the room in which the user was before
      for (var indexRoom = 0; indexRoom < this.rooms.length; indexRoom++) {
        this.rooms[indexRoom].start();
      } // Flag that breakout is running


      breakout.isRunning = true;
      $rootScope.$emit('breakout-running', breakout.isRunning); // Manipulate audio controls

      breakout.manipulateAudioLevels(); // Enable the controls

      disableControls();

      if (breakout.timeSlot > 0) {
        // Bind timer in seconds
        bindTimerToBreakout(breakout.timeSlot * 60);
      } // Signal to other users, including time slot


      $exchange.publish('breakout:start', {
        timeSlot: breakout.timeSlot
      });
    };
    /**
     * @ngdoc function
     * @name stopAllRooms
     * @description Stops all the running breakout rooms
     */


    breakout.stopAllRooms = function (noSignal) {
      // Find the room in which the user was before
      for (var i = 0; i < this.rooms.length; i++) {
        this.rooms[i].stop(); // Remove all users from room

        this.rooms[i].removeAllUsers();
      } // Reset teacher


      breakout.teacher.breakoutRoom = null;
      breakout.teacher.breakoutRunning = false; // Flag that breakout is not running

      breakout.isRunning = false;
      $rootScope.$emit('breakout-running', breakout.isRunning); // Disabling the end button

      breakout.isDisabled = true; // Manipulate audio controls

      breakout.manipulateAudioLevels(); // Reintializing the time slot

      breakout.timeSlot = -1; // Enable the controls

      enableControls(); // Unbind timer

      unBindTimerToBreakout(); // Check disabled status

      checkBreakoutDisabled();

      if (!noSignal) {
        // Signal to other users
        $exchange.publish('breakout:stop');
      }
    };
    /**
     * @ngdoc function
     * @name toggleRooms
     * @description Toggles breakout rooms to start or stop
     */


    breakout.toggleRooms = function () {
      if (breakout.isRunning) {
        breakout.stopAllRooms();
      } else {
        breakout.startAllRooms();
      }
    };
    /**
     * @ngdoc function
     * @name manipulateAudioLevels
     * @description Manipulates the users audio levels based on the breakouts
     */


    breakout.manipulateAudioLevels = function () {
      // Find room of current user
      var room = this.rooms[Users.current.breakoutRoom];
      var teacher = Users.getTeacher();
      var students = Users.getStudents(); // If breakout room is found and running

      if (room && room.isRunning) {
        // my room id and teacher room id are same
        if (teacher.breakoutRoom === room.id && teacher.breakoutRoom !== null) {
          if (teacher.micEnabled) {
            breakout.enableAudio(teacher.id); // this has to be removed for self subscribing audio.
          } else {
            breakout.disableAudio(teacher.id);
          }
        } else {
          breakout.disableAudio(teacher.id);
        }

        for (var _i = 0; _i < students.length; _i++) {
          // Disable audio if participant is not in room
          if (students[_i].breakoutRoom === room.id && students[_i].breakoutRoom !== null) {
            if (!students[_i].micEnabled) {
              breakout.disableAudio(students[_i].id);
            } else {
              if (students[_i].micHardMuted) {
                breakout.disableAudio(students[_i].id);
              } else {
                breakout.enableAudio(students[_i].id);
              }
            }
          } // Enable audio if participant is in room
          else {
              breakout.disableAudio(students[_i].id);
            }
        }
      } else {
        // Enable audio if teacher is not in any room
        if (teacher.breakoutRoom >= 0 && teacher.breakoutRoom !== null) {
          breakout.disableAudio(teacher.id);
        } else {
          if (teacher.micEnabled) {
            breakout.enableAudio(teacher.id); // this has to be removed for self subscribing audio.
          } else {
            breakout.disableAudio(teacher.id);
          }
        }

        for (var _i2 = 0; _i2 < students.length; _i2++) {
          // Enable audio if participant is not in any room
          // if (students[i].breakoutRoom === null || !this.rooms[students[i].breakoutRoom].isRunning) {
          if (students[_i2].breakoutRoom >= 0 && students[_i2].breakoutRoom !== null) {
            breakout.disableAudio(students[_i2].id);
          } // Disable audio if participant is in any room
          else {
              if (!students[_i2].micEnabled) {
                breakout.disableAudio(students[_i2].id);
              } else {
                if (students[_i2].micHardMuted) {
                  breakout.disableAudio(students[_i2].id);
                } else {
                  breakout.enableAudio(students[_i2].id);
                }
              }
            }
        }
      }
    };

    breakout.enableAudio = function (userId) {
      $rootScope.$emit('play:audio', userId);
    };
    /* should be deleted after the testing */
    // if($scope.$parent && $scope.$parent.subscriberList) {
    // 	if($scope.$parent.subscriberList[userId]) {
    //     console.log('$scope.$parent.subscriberList[userId]', $scope.$parent.subscriberList[userId]);
    // 		$scope.$parent.subscriberList[userId].subscribeToAudio(true);
    //     $scope.$parent.subscriberList[userId].setAudioVolume(100);
    // 	}
    // }


    breakout.disableAudio = function (userId) {
      $rootScope.$emit('stop:audio', userId);
    }; // Re-check the availability whenever a new user joins


    $exchange.io.on('user:joined', function (msg) {
      checkStudentsAvailability();
    }); // OFFLINE signal

    $exchange.io.on('user:online', function (msg) {
      var data = msg.data; // If user went offline, handle the scenario (only when breakout is running)

      if (!data.status) {
        // Fetch user reference
        var user = Users.getUser(data.userId);

        if (user.role === 'teacher') {
          breakout.teacher.breakoutRoom = null;
          breakout.teacher.breakoutRunning = false;
          checkBreakoutRunning();
          checkBreakoutDisabled(); // Manipulate audio controls

          breakout.manipulateAudioLevels();
        } else {
          // Check if user is in breakouts
          // If current user is teacher, stop the room and remove only offline user
          // If current user is student, stop the room and remove all students in room
          if (user && !user.isAvailableBreakout) {
            console.log('User is in some room, remove and manipulate audios');
            var room = breakout.rooms[user.breakoutRoom]; // Remove only offline user

            room.removeUser(user);
            checkBreakoutRunning();
            checkBreakoutDisabled(); // Manipulate audio controls

            breakout.manipulateAudioLevels();
          } else {
            console.log('User is not in any room, do nothing');
          }
        }
      } else {
        breakout.manipulateAudioLevels();
      }
    }); // ADD USER signal

    $exchange.io.on('breakout:add-user', function (msg) {
      var data = msg.data;
      var room = breakout.rooms[data.room];
      var student = Users.users[data.user]; // Insert the user

      room.addUser(student, data.index);
      checkBreakoutRunning();
      checkBreakoutDisabled(); // Manipulate audio controls

      breakout.manipulateAudioLevels();
    }); // REMOVE USER signal

    $exchange.io.on('breakout:remove-user', function (msg) {
      var data = msg.data;
      var room = breakout.rooms[data.room];
      var student = Users.users[data.user]; // Remove the user

      room.removeUser(student, data.index);

      if (!data.noCheck) {
        checkBreakoutRunning();
        checkBreakoutDisabled();
      } // Manipulate audio controls


      breakout.manipulateAudioLevels();
    }); // REMOVE USER signal

    $exchange.io.on('breakout:swap-user', function (msg) {
      var data = msg.data;
      var fromRoom = breakout.rooms[data.fromRoom];
      var toRoom = breakout.rooms[data.toRoom];
      var student = Users.users[data.user]; // Remove the user from previous room

      fromRoom.removeUser(student); // Add the user to the new room

      toRoom.addUser(student, data.index);
      checkBreakoutRunning();
      checkBreakoutDisabled(); // Manipulate audio controls

      breakout.manipulateAudioLevels();
    }); // START signal

    $exchange.io.on('breakout:start', function (msg) {
      var data = msg.data; // Flag that breakout is not running

      breakout.isRunning = true;
      $rootScope.$emit('breakout-running', breakout.isRunning);

      for (var i = 0; i < breakout.rooms.length; i++) {
        // Update the room data
        var room = breakout.rooms[i]; // Start the room

        room.start();
      } // Manipulate audio controls


      breakout.manipulateAudioLevels(); // Update the timeslot

      breakout.timeSlot = data.timeSlot;

      if (data.timeSlot > 0) {
        // Bind timer in seconds
        bindTimerToBreakout(data.timeSlot * 60);
      }
    }); // STOP signal

    $exchange.io.on('breakout:stop', function (msg) {
      // Flag that breakout is not running
      breakout.isRunning = false;
      $rootScope.$emit('breakout-running', breakout.isRunning);
      breakout.teacher.breakoutRoom = null;
      breakout.teacher.breakoutRunning = false;

      for (var i = 0; i < breakout.rooms.length; i++) {
        // Update the room data
        var room = breakout.rooms[i]; // Stop the room

        room.stop(); // Remove all users from room

        room.removeAllUsers();
      } // Manipulate audio controls


      breakout.manipulateAudioLevels();
    }); // TEACHER LINK signal

    $exchange.io.on('breakout:teacher-link', function (msg) {
      var data = msg.data;
      console.log('Teacher linking to room ' + data.room);

      if (breakout.isRunning) {
        console.log('Teacher connected to room ' + data.room);
        breakout.teacher.breakoutRoom = data.room;
        breakout.teacher.breakoutRunning = breakout.rooms[data.room] ? breakout.rooms[data.room].isRunning : false; // Manipulate audio controls

        breakout.manipulateAudioLevels();
      } else {
        console.log('Teacher failed to connect');
      }
    });
    $exchange.io.on('remote:mute-all-mic', function (msg) {
      console.log('trigger manipulateAudioLevels on mute all');
      breakout.manipulateAudioLevels();
    });
    $rootScope.$on('manipulate:audios', function () {
      // console.log('manipulate audios');
      breakout.manipulateAudioLevels();
    }); // Toggle popup handler

    $rootScope.$on('toggle-breakout-popup', function () {
      breakout.togglePopup();
    });
    $rootScope.$on('teacher-connect', function (event, room) {
      console.log('Breakout connecting... ROOM : ' + room);

      if (breakout.isRunning) {
        var linkRoom = null;

        if (breakout.rooms[room] && breakout.rooms[room].users.length >= 2) {
          linkRoom = room;
        }

        console.log('Teacher connected to room ' + linkRoom); // Signal to other users

        $exchange.publish('breakout:teacher-link', {
          room: linkRoom
        });
        breakout.teacher.breakoutRoom = linkRoom;
        breakout.teacher.breakoutRunning = linkRoom === null ? false : true; // Manipulate audio controls

        breakout.manipulateAudioLevels();
      } else {
        console.log('Failed to connect to breakout');
      }
    }); // INIT
    //
    // Run the base functions by default

    transformUsersData();
    getUpdatedBreakoutData().then(function (response) {
      if (response) {
        syncBreakoutData(response);
      }

      checkBreakoutRunning();
    })["catch"](function (err) {});
    checkStudentsAvailability();
    checkBreakoutDisabled();
  }
}]);
//# sourceMappingURL=breakout.directive.js.map

"use strict";

angular.module('digitalclassroom').directive('textChat', [//Dependencies
'$rootScope', '$exchange', '$timeout', 'userService', 'Auth', 'Chat', 'RTC_PROVIDER', // CallBack
function ($rootScope, $exchange, $timeout, userService, Auth, Chat, RTC_PROVIDER) {
  //==============================================================================
  // DIRECTIVE - This contains the directive properties and fuctions
  //==============================================================================
  var directive = {}; // Restricts the directive to Attribute by default

  directive.templateUrl = '/views/partials/classroom/chat/chatpanel.html'; // Template URL for directive.

  directive.controller = chatController;
  directive.controllerAs = 'chat';
  directive.bindToController = true; // Scope Isolation
  //directive.require = 'ngModel, ngChange';

  return directive;

  function chatController($scope) {
    var chat = this; //Assigns 'this' to variable chat. To avoid confusion.

    var elmnt = document.getElementById("chat-view"); //Get the chat-view element and use for Chat Notification reset to zero

    var sessionData = Auth.getData(); // Holds the auth content

    var chatMethods = {}; //Object that holds various function corresponds to chat module

    chat.userList = true; //Flag, used to identify chat user list screen and chat screen

    chat.isOpened = false; // Indicates whether the chat panel is opened or not

    /** Fetches the total list of users in the activity */

    chat.users = userService.getUsers();
    /** Consider, teacher is in diagnostics page(not entered class)
     * Student(mobile) has entered the class
     * Teacher is entering the class, student's deviceType will not get displayed
     * To resolve it, we are fetching the updated userlist from API and updating the deviceStatus
     */

    userService.updateDeviceType(chat.users).then(function (data) {
      chat.users = data;
    });
    chat.currentUser = userService.getCurrentUser(); // Get the current user details
    //$scope.unreadMsg = false;
    // By Default Chat should be opened for students

    if (chat.currentUser.role == 'student') {
      chat.className = 'slideIn';
      chat.isOpened = true;
    } //$scope.countAfterHeaderBand = 0;
    // Store the activity ID of current user
    // Auth is the factory being referred to


    chat.currentUser.activityId = sessionData.activityId; //Used to tag the user by referring to last selected user

    chat.currentTaggedUser = '';
    chat.hasUserJoined = false; //To display "Participants not joined yet" message on page load

    chat.action = {
      input: null // Set to null, in order to show the default placeholder

    };
    chat.objEveryone = {
      userName: 'Everyone',
      //To differentiate between public and private chat; Defaults to 'everyone'
      id: "EVERYONE" //Used to differentiate public & private chat functions by using id

    };
    chat.action.target = chat.objEveryone; //Assigning the default value to the target

    $scope.chatUsers = []; //Holds the list of users currently joined in the session, enable tagging
    // Holds the chat history for private, public chat -
    // Needs to be initialized for maintaining message sync even when the user
    // does not selects the chat from userlist

    chat.chatAllUsers = Chat.generateUserArr('userArr', chat.users, chat.currentUser); // Holds the chat notification for private and public chats

    chat.chatNotifications = Chat.generateUserArr('notificationArr', chat.users, chat.currentUser);
    chat.connObj = {};
    chat.action.input = '';
    chat.emoticons = Chat.emojiArr;
    $scope.showEmojis = null; //Function to toggle emoji window
    // Function to be called when the directive loads for the first time

    function initializeChat() {
      // Function to fetch the chat history of Public Chat from database
      // Fetch the chat data by passing activityId
      Chat.fetchPublicChat(sessionData.activityId).then(function (data) {
        // Checks if message exists in the array
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            var chatObj = Chat.formatChatMessage(data[i], chat.users, chat.currentUser);
            chatObj.onlyEmoji = Chat.hasOnlyEmoji(data[i]);
            chat.chatAllUsers['EVERYONE'].push(chatObj);
          }
        }
      })["catch"](function (error) {
        // Catch and handle the authentication error
        console.error(error + 'Could not fetch public chat history');
      }); // Function to fetch the chat history of Private Chat from database
      // Fetch the chat data by passing activityId

      Chat.fetchPrivateChat(sessionData.activityId, chat.currentUser.id).then(function (privateChat) {
        // Checks if message exists in the array
        angular.forEach(privateChat, function (val, key) {
          if (val.length > 0) {
            angular.forEach(val, function (message, user) {
              var chatObj = Chat.formatChatMessage(message, chat.users, chat.currentUser);
              chatObj.onlyEmoji = Chat.hasOnlyEmoji(message); // Checks with whom the conversation has been made in private chat and pushes the messages to them

              var toChatUserId = message.sender.id != chat.currentUser.id ? message.sender.id : message.recipient;
              chat.chatAllUsers[toChatUserId].push(chatObj);
            });
          }
        });
      })["catch"](function (error) {
        // Catch and handle the authentication error
        console.error(error + 'Could not fetch private chat history');
      }); // Function to fetch the notification count of all users
      // Fetch the notification count by passing activityId

      Chat.fetchNotificationCount(sessionData.activityId, chat.currentUser.id).then(function (data) {
        chat.chatNotifications = data;
        totalNotificationCount();
      })["catch"](function (error) {
        // Catch and handle the authentication error
        console.error(error + 'Could not fetch public chat history');
      });
    } // The timeout has been implemented here to handle the missing messages and notification count
    // when the student refreshes the screen. It happens when the Opentok takes time to initialize,
    // and the chat APIs are called in the meantime.


    $timeout(function () {
      initializeChat(); // Calling the initialize method when the directive loads
    }, 750); // Function to toggle the chatbox(open/close)

    chat.toggleChatBox = function () {
      // Toggle the current chat box opened state
      chat.isOpened = !chat.isOpened;
      $rootScope.$emit('chat-box-toggled', chat.isOpened);
      chat.userList = true;
      $scope.showEmojis = null; // Update the chat classname

      chatMethods.updateChatClassName();
    }; // Updates the classname for chat


    chatMethods.updateChatClassName = function () {
      var conversationName = chat.action.target.userName.toLowerCase(); // If classname is not set yet

      if (chat.className === '' || chat.isOpened) {
        if (conversationName == 'Everyone') {
          chat.className = 'slideIn group';
        } else {
          chat.className = 'slideIn private';
        }
      } else {
        if (conversationName == 'Everyone') {
          chat.className = 'slideOut group';
        } else {
          chat.className = 'slideOut private';
        }
      }
    }; // Check if user joined initially and displays the message
    // "Participants yet to join" if no one has joined


    chatMethods.checkHasUserJoined = function () {
      for (var user in chat.users) {
        if (chat.users[user].id != chat.currentUser.id && chat.users[user].joined == true) {
          chat.hasUserJoined = true;
          break;
        }
      }
    };

    chatMethods.checkHasUserJoined(); //Function to switch the chat list to public/private chat window

    chat.switchChatWindow = function (user) {
      chat.userList = false;
      $scope.showEmojis = null; //To clear the chat array when the user switches to different recipient
      //Updated on clicking back arrow

      if (chat.currentRecipientId != user.id) {
        //Clears the input textarea when the user swaps between user in chatlist
        chat.action.input = '';
      }

      if (user.id == 'EVERYONE') {
        //Public Chat
        chat.action.target = chat.objEveryone;
        /*for (var i in chat.chatAllUsers.EVERYONE) {
        	if(chat.chatAllUsers.EVERYONE[i].unreadMessage == 'true'){
        		chat.chatAllUsers.EVERYONE[i].unreadMessage = '';
        	}
        }*/
        //$scope.placeholderContent = "Write a message";
      } else if (user.id != 'EVERYONE') {
        //Private Chat
        chat.action.target = chat.users[user.id];
        /*var thisUser = chat.chatAllUsers[user.id];
        for(var i=0; i<thisUser.length;i++)
        {
        	if(thisUser[i].unreadMessage == 'true')
        	{
        		thisUser[i].unreadMessage = '';
        	}
        }*/

        /*for (var i in chat.chatAllUsers.EVERYONE) {
        	if(chat.chatAllUsers.EVERYONE[i].unreadMessage == 'true'){
        		chat.chatAllUsers.EVERYONE[i].unreadMessage = '';
        	}
        }*/
        //$scope.placeholderContent = chat.action.target.online?'Write a message':chat.action.target.firstName +' is offline';
      } //Setting up the chatArray based on the current user selected from userlist


      if (chat.chatAllUsers[chat.action.target.id] == undefined) {
        //If the user does not exist in array, create a new object for the user
        chat.chatAllUsers[chat.action.target.id] = [];
      }

      chat.chatNotifications[chat.action.target.id] = 0; // Function to recalculate and display notification at header band

      var notificationSum = Chat.calculateHeaderNotification(chat.chatNotifications, chat.action.target.id);
      $scope.$emit("notification:count", notificationSum); // emitted to the classroom controller to display on header band

      chat.chatNotifications[chat.action.target.id] = 0; // setting the current user notification value to zero
      // Primus call to clear chat:notification

      $exchange.publish('chat:notification', {
        senderId: chat.currentUser.id,
        receiverId: chat.action.target.id,
        notificationCount: 0
      });
      $timeout(function () {
        document.getElementById("chat-message").focus(); // Autofocus the Chat box textarea by default
      }, 500);
    }; //Function to switch back to user list window


    chat.showUserList = function (user) {
      //Updates the current recipient (last viewed before moving back to chat user list)
      chat.currentRecipientId = user.id;
      chat.userList = true;
    }; //User Tagging functionality - Maintains the chatUsers array
    //Helps displaying suggestion of user joined and online status


    angular.forEach(chat.users, function (value, key) {
      if (value.id != chat.currentUser.id && value.joined == true) {
        //Restricts the current user from tagging himself
        $scope.chatUsers.push(value);
      }
    }); //Function for handling user tagging on typing in textarea when user types the first letter as '@'

    chat.onChatValueChange = function (input) {
      if (input != '') {
        if (input.charAt(0) == "@" && $scope.chatUsers.length > 0) {
          $scope.showEmojis = null;
          $scope.showTagging = true; //Displays tagging popup

          $scope.tagValue = input.slice(1); //Removes the '@' and helps to filter the chatUsers array
        }
      } else {
        $scope.showTagging = false; //Hides the tagging popup if the textarea is empty
      }
    }; //Function to remove static unread message on focus

    /*chat.onTextareaFocus = function(){
    	if(document.getElementById('chat-view').scrollTop == (document.getElementById('chat-view').scrollHeight - document.getElementById('chat-view').offsetHeight)) {
    		$scope.countAfterHeaderBand = 0;
          var staticText = document.getElementById("statictext");
          	if(staticText){
          		$scope.unreadMsg = false;
          		var classUnread = document.querySelector(".unread-msg");
          		staticText.outerHTML = "";
          		delete staticText;
          		classUnread.classList.remove("unread-msg");
          		document.getElementById('chat-view').scrollTop = ((document.getElementById('chat-view').scrollHeight - document.getElementById('chat-view').offsetHeight) - 1)
          		//Adjust the Chat window height once Unread Message Band is removed
          	}
        }
    }*/
    //Event to close the tagging popup & tag the selected user to the textarea


    chat.tagChatUser = function (user) {
      $scope.showTagging = false; //Hides tagging popup on tagging user

      chat.currentTaggedUser = user; //Maintains the user tagged for the recent message

      user.role == 'teacher' ? chat.action.input = "@Teacher" : chat.action.input = "@" + user.userName;
    }; //Function to show/hide emoji popup


    $scope.toggleEmojis = function (input) {
      $scope.showTagging = false;
      $scope.showEmojis = !input;
    };
    /*$scope.scrollToUnreadMsg = function(){
    	$scope.unreadMsg = false;
    	document.getElementById('chat-view').scrollTop = document.querySelector('.unread-msg').offsetTop - 135;
    }*/
    //Function to get emoji code and display on textarea


    chat.insertEmoji = function (emoticon) {
      // Find the shortcut(if exists) of the selected icon, so next time
      // it will help the user to use the app
      chat.action.input = chat.action.input + " " + Chat.invertedEmojiMap(emoticon.name) || emoticon.name;
    }; //Function to send chat message


    chat.sendMessage = function (message) {
      console.log('send message');

      if (message) {
        //Checks of availability of currentTaggedUser to send the tagged User data for generating chatHeader
        chat.sendTextMessage(chat.action.target.id, message, chat.currentTaggedUser ? chat.currentTaggedUser.id : ''); // Updates notification for both online and offline users based on recipient- updates to DB

        $exchange.publish('chat:notification', {
          senderId: chat.currentUser.id,
          receiverId: chat.action.target.id,
          notificationCount: 1
        });
        chat.action.input = '';
      }

      chat.currentTaggedUser = '';
      $scope.showTagging = false; //Hides tagging popup

      $scope.showEmojis ? $scope.showEmojis = null : void 0; // $scope.showEmojis = false? $scope.showEmojis = true: $scope.showEmojis = null;
    }; //TEXT CHAT


    chat.sendTextMessage = function (recipient, message, taggedUser) {
      var messageData = {
        text: message,
        sender: {
          id: userService.current.id
        },
        taggedTo: taggedUser,
        recipient: recipient,
        sentOn: Date.now()
      };

      if (recipient.toLowerCase() == "everyone") {
        if ($scope.$parent.rtcProvider === RTC_PROVIDER.zoom) {
          $scope.$parent.ZoomService.sendMessage(JSON.stringify(messageData), true).then(function () {
            // Store the sent message
            $exchange.publish('chat:public', messageData); // have the message in the self window

            $rootScope.$emit('chat:public', messageData);
          })["catch"](function (err) {
            console.log(err);
          });
        } else {
          $scope.$parent.session.signal({
            type: 'textChat',
            data: JSON.stringify(messageData)
          }, function (error) {
            if (error) {
              var errorMessage = 'Error occured while sending a message. '; // To do: Need to log this event

              if (error.code === 413) {
                errorMessage += 'The chat message is over size limit.';
              } else if (error.code === 500) {
                errorMessage += 'Check your network connection.';
              }

              console.log(errorMessage);
            } else {
              console.log('Message sent successfully'); // Store the sent message

              $exchange.publish('chat:public', messageData);
            }
          });
        }
      } else if (recipient.toLowerCase() !== undefined && recipient.toLowerCase() !== "everyone") {
        if ($scope.$parent.rtcProvider === RTC_PROVIDER.zoom) {
          $scope.$parent.ZoomService.sendMessage(JSON.stringify(messageData), false).then(function () {
            // Store the sent message
            $exchange.publish('chat:private', messageData); // have the message in the self window

            $rootScope.$emit('chat:private', messageData);
          })["catch"](function (err) {
            console.log(err);
          });
        } else {
          var subscriber = $scope.$parent.subscriberList[recipient];
          var connObj = subscriber.stream.connection;
          $scope.$parent.session.signal({
            to: connObj,
            type: 'textChat',
            data: JSON.stringify(messageData)
          }, function (error) {
            if (error) {
              var errorMessage = 'Error occured while sending a message. '; // To do: Need to log this event

              if (error.code === 413) {
                errorMessage += 'The chat message is over size limit.';
              } else if (error.code === 500) {
                errorMessage += 'Check your network connection.';
              }

              console.log(errorMessage);
            } else {
              console.log('Message sent successfully'); // Store the sent message

              $exchange.publish('chat:private', messageData); // To do: Need to log this event

              $rootScope.$emit('chat:private', messageData);
            }
          });
        }
      }
    };

    function onMessageReceive(data) {
      var chatData = JSON.parse(data.data); //var userNotification = chatData.recipient == 'EVERYONE'?chatData.recipient: chatData.sender.id;
      //Chat users array is passed as second parameter to display the "from user" on the title
      //3rd param states the current user inorder to send display appropriate chat headerq
      // Manage notification content based on user's existence in userlist/ chatmessage
      // Increments the message count by 1

      /*if(chat.userList == false){
      	if(chat.currentUser.id != chatData.sender.id){
      		if(chat.action.target.id == userNotification){
      			// Chat Notification if the user in the same window
      			chat.chatNotifications[userNotification] = chat.chatNotifications[userNotification] + 1;
      			$scope.unreadMsg = true; // Set Unread Message FLag as TRUE
      		}
      	}
      	// Dont show notification if the chatbox is fully visible without scroll
      	if (elmnt.clientHeight == elmnt.scrollHeight) {
      		$scope.updateChatNotification();
      		$scope.unreadMsg = false; // Set Unread Message FLag as FALSE
      		$exchange.publish('chat:notification', {senderId: chat.currentUser.id, receiverId: chat.action.target.id, notificationCount: -1});
      				}
      				if($scope.unreadMsg == true){
      					$scope.countAfterHeaderBand++;
      					chatData.unreadMsg = $scope.unreadMsg;
      					$scope.countAfterHeaderBand == 1 ? chatData.showBand = true : chatData.showBand = false;
      		var chatObj = Chat.formatChatMessage(chatData, chat.users, chat.currentUser);
      				}
      }*/

      var chatObj = Chat.formatChatMessage(chatData, chat.users, chat.currentUser);
      chatObj.onlyEmoji = Chat.hasOnlyEmoji(chatData);
      console.log('chatObj', chatObj);

      if (chatObj.toUserId != 'EVERYONE') {
        //differentiates between private & public chats
        chat.chatAllUsers[chatObj.fromUserId] !== undefined ? chat.chatAllUsers[chatObj.fromUserId].push(chatObj) : ''; //Maintains the user history by pushing to the appropriate chat holder
      } else {
        chatObj.currentUserId === chatObj.fromUserId ? '' : chat.chatAllUsers['EVERYONE'].push(chatObj);
      } // Manage notification content based on user's existence in userlist/ chatmessage
      // Increments the message count by 1


      var userNotification = chatObj.toUserId == 'EVERYONE' ? chatObj.toUserId : chatObj.fromUserId; // Pushes notification for all users other than current user window
      // and when the user is in userlist window

      if (userNotification != chat.action.target.id || chat.userList == true) {
        //Pushes to notification count array based on private/public chat
        chat.chatNotifications[userNotification] = chat.chatNotifications[userNotification] + 1;
      }

      if (chat.userList == false) {
        if (chat.currentUser.id != chatObj.fromUserId) {
          if (chat.action.target.id == userNotification) {
            // Chat Notification if the user in the same window
            chat.chatNotifications[userNotification] = chat.chatNotifications[userNotification] + 1;
          }
        } // else{
        // 	// Resets the DB count to zero for current user window(send)
        // 	chat.chatNotifications[chat.action.target.id] = 0;
        // 	$exchange.publish('chat:notification', {senderId: chat.currentUser.id, receiverId: chat.action.target.id, notificationCount: 0});
        // }
        // Dont show notification if the chatbox is fully visible without scroll


        if (elmnt !== null && elmnt.clientHeight == elmnt.scrollHeight) {
          $scope.updateChatNotification();
          $exchange.publish('chat:notification', {
            senderId: chat.currentUser.id,
            receiverId: chat.action.target.id,
            notificationCount: -1
          });
        }
      } // Count the total notification and displays it on the header band


      totalNotificationCount();
    }
    /**
     * the message received is emitted from the classroom controller.
     */


    $rootScope.$on('message-received', function (event, msgData) {
      onMessageReceive(msgData);
    });
    /**
     * the event for opentok is emitted from the classroom controller
     */

    $rootScope.$on('signal:textChat', function (event, data) {
      onMessageReceive(data);
    });

    $scope.updateChatNotification = function () {
      // Reset the notification count to zero if the user scrolls to the bottom of the user chat window
      chat.chatNotifications[chat.action.target.id] = 0; //$scope.unreadMsg = false;

      $exchange.publish('chat:notification', {
        senderId: chat.currentUser.id,
        receiverId: chat.action.target.id,
        notificationCount: 0
      });
      var notificationSum = Chat.calculateHeaderNotification(chat.chatNotifications, chat.action.target.id);
      $scope.$emit("notification:count", notificationSum); // emitted to the classroom controller to display on header band
    }; // Function to the sum of all notification count


    function totalNotificationCount() {
      var notificationSum = Chat.totalNotificationCount(chat.chatNotifications);
      $scope.$emit("notification:count", notificationSum); // emitted to the classroom controller to display on header band
    } // Function to receive message sent event


    $rootScope.$on('chat:private', function (event, data) {
      pushMessageToSelfWindow(data);
    });
    $rootScope.$on('chat:public', function (event, data) {
      pushMessageToSelfWindow(data);
    });

    function pushMessageToSelfWindow(data) {
      var chatData = data;
      var chatObj = Chat.formatChatMessage(chatData, chat.users, chat.currentUser);
      chatObj.onlyEmoji = Chat.hasOnlyEmoji(chatData);
      chat.chatAllUsers[chatObj.toUserId].push(chatObj); //Maintains the user history by pushing to the appropriate chat holder
    } // Binding the toggle to rootscope


    $rootScope.$on('toggle-chat-box', function () {
      chat.toggleChatBox();
    }); // Event received on user join. To hide the "Participants yet to join"
    // message when first student joins the chat

    $rootScope.$on("users-joined", function (event, msg) {
      // var user = userService.getUser(msg.data.userId);
      if (chat.currentUser.id != msg.data.userId) {
        if ($scope.chatUsers.indexOf(chat.users[msg.data.userId]) < 0) {
          $scope.chatUsers.push(chat.users[msg.data.userId]); //Holds the list of chat users to be tagged
        }

        chat.hasUserJoined = true;
      }
    }); // Event received on user connection status change - to set online/offline

    $rootScope.$on('users-updated', function (event, data) {
      var userData = data.data;
      /** For the self booking user, if the data is unavailable fetch the data once again */

      var users = userService.getUsers();
      /** Compare the users array and update only for the new user */

      if (users[userData.userId] && chat.users[userData.userId].deviceType == null) {
        /** Sets the user's deviceType on user log in using the online status */
        chat.users[userData.userId].deviceType = userData.deviceType;
      }

      var chatUserArr = angular.copy(chat.chatAllUsers),
          chatNotificationArr = angular.copy(chat.chatNotifications);
      /** For the newly joined(self booked, last min) user chat message length will be 0 */

      if (chat.chatAllUsers[userData.userId] == chat.currentUser && chat.chatAllUsers[userData.userId] && chat.chatAllUsers[userData.userId].length === 0) {
        /** Update the existing user array with the newly joined(self-booked) user */
        chat.chatAllUsers = Chat.updateUserArr('userArr', chatUserArr, userData.userId);
        /** Update the existing notification count array with the newly joined(self-booked) user */

        chat.chatNotifications = Chat.updateUserArr('notificationArr', chatNotificationArr, userData.userId);
      }
    });
    $exchange.io.on('user:online', function (data) {
      var userData = data.data;

      if (chat.users[userData.userId]) {
        /** Update user's online status */
        chat.users[userData.userId].online = userData.status;
        /** Sets the user's deviceType on user log in using the online status */

        chat.users[userData.userId].deviceType = userData.deviceType;
      }
    });
  }
}]);
//# sourceMappingURL=chat.directive.js.map

"use strict";

//Directive to know when the element is visible in the DOM
DC.directive('elementReady', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      $timeout(function () {
        element.ready(function () {
          scope.$apply(function () {
            $rootScope.$broadcast("".concat(attrs.elementReady, ":ready"));
          });
        });
      });
    }
  };
}]);
//# sourceMappingURL=element-ready.directive.js.map

"use strict";

/**
 * @directive wbToolbar
 * @description This directive builds up a ToolBar with annotation tools.
 *              It registers with the ToolBar services.
 *              It manages visibility depending on the privilege level
 */
DC.directive('wbFileexplorer', [// Dependencies
'toolbarService', '$exchange', '$timeout', 'Analytics', 'cms', // cms factory to handle persistent ppts to all class types
'$rootScope', // CallBack
function (toolbarService, $exchange, $timeout, Analytics, cms, $rootScope) {
  //==============================================================================
  // DIRECTIVE - This contains the directive properties and fuctions
  //==============================================================================
  var directive = {}; // Restrict the directive to Element

  directive.restrict = 'E';
  directive.templateUrl = '/views/partials/classroom/whiteboard/fileexplorer.html'; // Controller Function

  directive.controller = function ($scope, $http) {
    // Default to 'file' on page load - Flag to display the Unit/ Stage name next to classType
    // Sets to 'file' since the files of booked unit under classType is fetched
    $scope.viewContent = 'file';
    $scope.showExplorer = false;
    $scope.$on('show-explorer', function () {
      $scope.toggleFileExplorer();
    });

    $scope.toggleFileExplorer = function () {
      $scope.showExplorer = !$scope.showExplorer; // Clear selected file holder - Used to display selected 'active' design

      $scope.fileSelected = {};
    }; // Method to call API and list entire unit/stage directories with the PPT content


    $scope.fetchAllUnits = function (input) {
      // Sending the data to Analytics factory to track the events
      Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, "Breadcrumbs Root Directory"); // Send the unit value as null to fetch all the units under the classType

      input.unit = null; // Displays the loader on the explorer window while making API call to fetch folders

      $scope.loadFolders = false;
      cms.fetchPPTs(input).then(function (response) {
        // Clear the search field - To avoid hidden contents if the searchText does not match the resultant files
        $scope.searchFile = {
          name: ''
        }; // Flag to differentiate between folder view and file view
        // Sets to 'folder' since list of all folder under a classType is fetched

        $scope.viewContent = 'folder'; // Hides the loader on the explorer window on fetching the folders

        $scope.loadFolders = true; // Clear selected file holder - Folder cannot be imported

        $scope.fileSelected = {};
        $scope.folders = response;

        for (var i = 0; i < $scope.folders.length; i++) {
          $scope.folders[i].name = $scope.folders[i].Unit;
        }
      })["catch"](function (error) {
        $scope.loadFolders = true; // Catch and handle the authentication error

        console.error(error + 'Could not fetch uploaded files');
      });
    }; // Fetch the files of selected folder(Unit/ Stage)


    $scope.fetchFiles = function (file) {
      // Construct the request type to fetch the ppts under selected units
      var classData = {
        "class": $scope.classData["class"],
        stage: file.stage ? file.stage : null,
        unit: file.Unit
      }; // Displays the loader on the explorer window while making API call to fetch folders

      $scope.loadFolders = false;
      cms.fetchPPTs(classData).then(function (response) {
        // Clear the search field - To avoid hidden contents if the searchText does not match the resultant files
        $scope.searchFile = {
          name: ''
        }; // Set the Unit/ Stage name to be displayed next to the classType - On the header area
        // Set on success call so the unit name is set correctly only if the API response is received
        // Change only the Unit/ Stage since other data needs to be retained from the initially set value

        $scope.classData.unit = classData.unit ? classData.unit : '';
        $scope.classData.stage = classData.stage ? classData.stage : ''; // Flag to differentiate between folder view and file view
        // Sets to 'file' since the files under a particular unit is fetched

        $scope.viewContent = 'file'; // Hides the loader on the explorer window on fetching the folders

        $scope.loadFolders = true; // Hot fix to implement generic search functionality for all file types

        $scope.ppts = response;

        for (var i = 0; i < $scope.ppts.length; i++) {
          $scope.ppts[i].name = $scope.ppts[i].title;
        }
      })["catch"](function (error) {
        // Hides the loader on the explorer window on fetching the folders
        $scope.loadFolders = true; // Catch and handle the authentication error

        console.error(error + 'Could not fetch uploaded files');
      });
    }; // Function to sort the integer files
    // Since the Angular does not support orderBy on integer as string. e.g.: {'Unit':'23'}


    $scope.sortUnit = function (folder) {
      return parseInt(folder.Unit);
    }; // On selecting any file(ppt, image)


    $scope.selectFile = function (file, index) {
      // Clear selected file holder
      $scope.fileSelected = file ? file : {}; // Sets the newly selected file to the holder
      // $scope.fileSelected = file;
    }; // Called on selecting a file from the explorer window


    $scope.importFile = function (file) {
      try {
        // The ppt has the file type 'ppt'. If not, then its considered as an image file
        if (file.type == 'ppt') {
          var ppt = {
            name: file.title,
            url: file['Blob URL'],
            layout: '16:9',
            fileType: file.type
          };
          $scope.$broadcast('import-file', ppt); // Close the explorer after loading

          $scope.toggleExplorer();
        } else {
          // Broadcast the selected file value to the board
          $scope.$broadcast('import-file', {
            file: file,
            fileType: "image"
          }); // Close the explorer after loading

          $scope.toggleExplorer();
        }
      } catch (exception) {
        console.log("File Import Exception" + exception);
      }
    }; // Call to cms factory to fetch the list of PPTs based on class booking(Online Encounter, Live Class, Channel WSE)


    $scope.fetchPPTs = function (input) {
      cms.fetchPPTs(input).then(function (response) {
        if ($scope.classData["class"] == "online_encounter") {
          // Clear the search field - To avoid hidden contents if the searchText does not match the resultant files
          $scope.searchFile = {
            name: ''
          };
        } else {
          // Set the selected file name in the search field by default.
          // For all classType other than Online Encounter
          $scope.searchFile = {
            name: $scope.classData.scd
          };
        } // Flag to differentiate between folder view and file view
        // Sets to 'file' since the files of booked unit is fetched


        $scope.viewContent = 'file'; // Quickfix - The key for 'folder: Unit', 'ppt: title', 'file: name(by default of the ng-file-upload)'
        // All key should be maintained as 'name' to enable filter with a single search field

        $scope.ppts = response;

        for (var i = 0; i < $scope.ppts.length; i++) {
          $scope.ppts[i].name = $scope.ppts[i].title;
        }
      })["catch"](function (error) {
        // Catch and handle the authentication error
        console.error(error + 'Could not fetch uploaded files');
      });
    }; // Method to fetch the ppts initially based on the classType, unit / stage values
    // Called on page load


    function initializePPTs() {
      try {
        // Get the class type and unit/ stage value from the $rootScope
        // Used to display in the fileexplorer window on the whiteboard
        var classData = $rootScope.classData; // Store a separate bookedStages to display list of all selected stage levels.
        // Handled before finding out the least stage value

        var bookedStages = $rootScope.classData.stage ? $rootScope.classData.stage : 'none';
        bookedStages = bookedStages.toString().split(',').join(', '); // Generate a scope variable for classData to handle

        $scope.classData = {
          bookedStages: bookedStages,
          unit: classData.unit,
          stage: classData.stage,
          scd: classData.scd,
          "class": cms.formatClassTypeName(classData.classTypeName),
          // Use the formatted class type name for APIs
          classTypeName: classData.classTypeName // Used to display on the frontend

        }; // Based on the classTypeName the appropriate method is called to fetch the ppt files from OSCAR

        if ($scope.classData["class"]) {
          // 'Units' are taken for the class type 'online encounter'
          if ($scope.classData["class"] == "online_encounter") {
            // Display as the ppt list
            if ($scope.classData.unit != null) {
              $scope.fetchPPTs($scope.classData);
            } // Display as the folder structure
            else if ($scope.classData.unit == null) {
                $scope.fetchAllUnits($scope.classData);
              }
          } else {
            // Find the least stage name from the appData from S&B
            $scope.classData.stage = cms.sortLeastStage($scope.classData);
            $scope.fetchPPTs($scope.classData);
          }
        }
      } catch (exception) {
        console.log("ClassType Error: " + exception);
      }
    }

    initializePPTs();
  }; // Return the directive so its prototype will be defined by Angular


  return directive;
}]);
//# sourceMappingURL=explorer.directive.js.map

"use strict";

// Re-compiles the inserted HTML before binding into view
DC.directive('compile', ['$compile', function ($compile) {
  return function (scope, element, attrs) {
    scope.$watch(function (scope) {
      // watch the 'compile' expression for changes
      return scope.$eval(attrs.compile);
    }, function (value) {
      // when the 'compile' expression changes
      // assign it into the current DOM
      element.html(value); // compile the new DOM and link it to the current
      // scope.
      // NOTE: we only compile .childNodes so that
      // we don't get into infinite loop compiling ourselves

      $compile(element.contents())(scope);
    });
  };
}]);
//# sourceMappingURL=htmlcompile.directive.js.map

"use strict";

DC.directive('userNotifications', ['notificationService', function (notificationService) {
  var directive = {};
  var html = '<li role="alert" ng-repeat="notify in notifyName" ng-class="{ \'animated fadeInRight\' : notify.animation , \'animated fadeOutRight\' : !notify.animation }" class="student_join"><strong>{{notify.userName}}</strong> has {{notify.type}} </li>';
  directive.restrict = 'A';
  directive.template = html;

  directive.link = function link(scope, element, attrs) {
    element.addClass('student_join');
  };

  directive.controller = function NotificationsCtrl($scope) {
    $scope.notifyName = notificationService.getQueue("user");
  };

  return directive;
}]);
//# sourceMappingURL=notifyDir.js.map

"use strict";

/**
 * @directive wbPrivilege
 * @description This directive builds up for Privilege.
 *              It shows the status of annotation privilege inside the classroom.
 *              It manages the grant and revoke functionality for the teachers.
 */
DC.directive('wbPrivilege', [// Dependencies
'$exchange', '$rootScope', 'toolbarService', '$timeout', 'userService', 'privilegeService', // CallBack
function ($exchange, $rootScope, toolbarService, $timeout, Users, privilegeService) {
  //==============================================================================
  // DIRECTIVE - This contains the directive properties and fuctions
  //==============================================================================
  var directive = {};
  directive.restrict = 'E';
  directive.templateUrl = '/views/partials/classroom/whiteboard/privilege.html';
  directive.controller = privilegeController;
  directive.controllerAs = 'privilege';
  directive.bindToController = true; // Scope Isolation

  directive.replace = false;
  return directive; // Controller Function

  function privilegeController($scope) {
    var privilege = this;
    privilege.isVisible = false; // Controls the visibility of the directive

    privilege.isVisibleAnimate = false; // Controls the initial animation effect

    privilege.usersAvailable = false; // Show the user list
    // Initialize the students data with scope data

    privilege.students = Users.getStudents();

    var checkAvailableUsers = function checkAvailableUsers() {
      // Check if any user is already joined
      for (var i = 0; i < privilege.students.length; i++) {
        if (privilege.students[i].joined) {
          privilege.usersAvailable = true;
          break;
        }
      }
    };

    checkAvailableUsers(); // Call on init
    // Bind to service data

    privilege.current = privilegeService.currentPrivilege;
    console.log(privilege.current); // Flag to enable privilege for user

    privilege.enabled = Users.current.id === privilege.current.id ? true : false;
    console.log('Privilege is enabled - ' + privilege.enabled); // Toggles the visibility of the privilege popup (show / hide)

    privilege.togglePopup = function () {
      privilege.selected = null;
      privilege.selectedId = null;
      privilege.isVisible = !privilege.isVisible;
    }; // Shows the participant list


    privilegeService.showList = function () {
      // If show is previously true and enabled is true, turn this to false
      if (privilege.isVisible && privilege.enabled) {
        privilege.isVisible = false;
      } else {
        privilege.isVisible = true;
        privilege.isVisibleAnimate = true;
      }
    };

    privilegeService.hideList = function () {
      privilege.isVisible = false;
    };

    var msg = null; // Grants privilege to a particular user

    privilege.grant = function (id) {
      var user; // Find the user by id

      for (var i = 0; i < privilege.students.length; i++) {
        if (id === privilege.students[i].id) {
          user = privilege.students[i];
        }
      } // Check if user found and is online


      if (!(user && user.online)) return;
      privilege.enabled = false;
      privilege.selected = null;
      privilege.selectedId = null;
      $rootScope.$emit('privilege-enabled', false);
      $rootScope.$emit('disable-controls');
      $rootScope.$emit('disable-breakouts'); // [TODO] Interpolate this string

      msg = 'Annotation privilege passed to ' + user.userName;
      $rootScope.$emit('privilege-board-notification', msg); // Update to the service

      privilegeService.updatePrivilege({
        id: user.id,
        role: user.role
      });
      privilege.isVisible = false;
    }; // Revokes the privilege given to other user


    privilege.revoke = function () {
      privilege.selected = null; // Unselect the selected user

      privilege.selectedId = null; // Hide the privilege manager

      privilege.enabled = true;
      privilege.isVisible = false;
      $rootScope.$emit('privilege-enabled', true);
      $rootScope.$emit('enable-controls');
      $rootScope.$emit('enable-breakouts');
      msg = 'Annotation privilege has been returned'; // To emit the annotation privilege notification on top of whiteboard

      $rootScope.$emit('privilege-board-notification', msg); //$rootScope.$emit('enable-controls');
      // Update to the service

      privilegeService.updatePrivilege({
        id: Users.teacher.id,
        role: Users.teacher.role
      });
    }; // INIT


    privilege.selected = null; // Select a student to share privilege

    privilege.selectStudent = function (index, student) {
      if (student.id !== privilege.current.id && student.online === true) {
        if (privilege.selected !== index) {
          privilege.selectedId = student.id;
          privilege.selected = index;
        } else {
          privilege.selected = null;
          privilege.selectedId = null;
        }
      }
    };

    $rootScope.$on('enable-controls', function () {
      if (Users.current.role == 'teacher') {
        privilege.enabled = true;
      }
    });
    $rootScope.$on('disable-controls', function () {
      if (Users.current.role == 'teacher') {
        privilege.enabled = false;
      }
    });
    $rootScope.$on('toggle-privilege-popup', function () {
      privilege.togglePopup();
    }); // Re-Sync the data whenever a new user joins
    // JOINED tracking

    $exchange.io.on('user:joined', function (msg) {
      var data = msg.data; // If user is available update his/her online status

      if (Users.users[data.userId]) {
        Users.users[data.userId].joined = true;
        checkAvailableUsers();
      }
    }); // OFFLINE status handling

    $exchange.io.on('user:online', function (msg) {
      var data = msg.data;
      var user = Users.users[data.userId];

      if (!data.status && user && user.id === privilege.selectedId) {
        $timeout(function () {
          privilege.selected = null;
          privilege.selectedId = null;
        }, 10);
      }
    });
  }
}]);
//# sourceMappingURL=privilege.directive.js.map

"use strict";

DC.directive('sampleAudio', ['Analytics', 'userService', '$rootScope', function (Analytics, Users, $rootScope) {
  return {
    scope: {
      stopaudio: '=',
      page: "@" //To disable the micHandling feature when the teacher is in 'Diagnostics' page

    },
    restrict: 'A',
    template: "<div class=\"sample-audio-wrapper\">\n\t\t\t<div class=\"d-flex align-items-center w-100\">\n\t\t\t\t<i class=\"dc-icon dc-speaker_dc pull-left device-icon test-audio\"></i>\n\t\t\t\t<a href=\"#\" data-id=\"rp-playTestSound\" class=\"test-sound\" ng-if=\"!audioProgressBar\" ng-click=\"playSampleSound()\">\n\t\t\t\t\t\tPlay test sound</a>\n\t\t\t\t\t\t<audio id=\"playSampleSound\">\n\t\t\t\t\t\t<source src=\"\" type=\"audio/mpeg\">\n\t\t\t\t</audio>\n\t\t\t\t<progress id=\"progressbar\" value=\"0\" max=\"1\" style=\"width:200px;\" ng-if=\"audioProgressBar\"></progress>\n\t\t\t</div>\n\t</div>",
    link: function link(scope, element, attrs) {
      scope.audioProgressBar = false;
      var testAudio = document.getElementById("playSampleSound"),
          currentMicStatus = angular.copy(Users.current.micEnabled);
      testAudio.src = "../sounds/sampleaudio.mp3";

      scope.playSampleSound = function () {
        currentMicStatus = angular.copy(Users.current.micEnabled); // Sending the data to Analytics factory to track the events

        Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().userInteraction, "Play Sample Sound"); // Disables the User audio to be heard by others

        if (currentMicStatus) {
          toggleMicOnTestAudio(true);
        }

        scope.audioProgressBar = !scope.audioProgressBar;

        if (scope.audioProgressBar) {
          // Allow the user audio to be heard for the all other users
          testAudio.play();
        }

        testAudio.onended = function () {
          scope.audioProgressBar = false;
          scope.$apply();
          console.log('testAudio.onended', scope.audioProgressBar); // Retains the changes to the state before playing the test audio

          if (currentMicStatus) {
            toggleMicOnTestAudio(true);
          }
        };

        testAudio.ontimeupdate = function () {
          try {
            document.getElementById('progressbar').setAttribute("value", this.currentTime / this.duration);
          } catch (e) {
            console.log("Test Sound: Progressbar value is null and cannot be set. " + e);
          }
        };
      };

      scope.$watch('stopaudio', function () {
        testAudio.pause();
        testAudio.currentTime = 0; // Retains the changes to the state before playing the test audio

        if (scope.audioProgressBar && currentMicStatus) {
          toggleMicOnTestAudio(true);
        }

        scope.audioProgressBar = false;
      });

      function toggleMicOnTestAudio(micEnabled) {
        // Do not consider if the user is in diagnostics page(i.e. out of session)
        if (scope.page != 'diagnostics') {
          // Toggles the microphone for other users based on the input param's[micEnabled] condition
          if (micEnabled) {
            $rootScope.$emit("toggle-mic-test-audio");
          }
        }
      }
    }
  };
}]);
//# sourceMappingURL=settings.directive.js.map

"use strict";

/**
 * @directive wbToolbar
 * @description This directive builds up a ToolBar with annotation tools.
 *              It registers with the ToolBar services.
 *              It manages visibility depending on the privilege level
 */
DC.directive('wbToolbar', [// Dependencies
'toolbarService', '$window', '$timeout', 'Analytics', 'privilegeService', 'userService', '$rootScope', // CallBack
function (toolbarService, $window, $timeout, Analytics, privilege, Users, $rootScope) {
  //==============================================================================
  // DIRECTIVE - This contains the directive properties and fuctions
  //==============================================================================
  var directive = {}; // Restrict the directive to Element

  directive.restrict = 'E';
  directive.templateUrl = '/views/partials/classroom/whiteboard/toolbar.html'; // Link Function

  directive.controller = function ($scope) {
    $scope.toolsets = {
      color: {
        toolbarEvents: true,
        toggled: false,
        toggledFlag: false,
        icon: 'dc-color color-black',
        active: 'black'
      },
      size: {
        toolbarEvents: true,
        toggled: false,
        toggledFlag: false,
        icon: 'dc-size-m',
        active: 'm'
      },
      shape: {
        toolbarEvents: true,
        toggled: false,
        toggledFlag: false,
        icon: 'dc-circle',
        active: 'circle'
      },
      pencil: {
        toolbarEvents: true,
        toggled: false,
        toggledFlag: false,
        icon: 'dc-pencil',
        active: 'pencil'
      },
      eraser: {
        toolbarEvents: true,
        toggled: false,
        toggledFlag: false,
        icon: 'dc-eraser',
        active: 'eraser-free'
      },
      select: {
        toolbarEvents: true,
        toggled: false,
        toggledFlag: false,
        icon: 'dc-upload',
        active: 'select'
      },
      pointer: {
        toolbarEvents: true,
        toggled: false,
        toggledFlag: false,
        icon: 'dc-pointer',
        active: 'pointer'
      },
      textbox: {
        toolbarEvents: true,
        toggled: false,
        toggledFlag: false,
        icon: 'dc-text-edit',
        active: 'textbox'
      } //default:{ toggled: false, toggledFlag: false, icon :'dc-pointer', active: 'default' },

    };
    var previousToolset = null; // Stores the tool that was previously opened
    //$scope.activeTool = 'default'; // Stores the currently active tool

    toolbarService.setActiveColor('black'); // set the active color to black

    toolbarService.setActiveSize('m'); // set the active color to medium

    $scope.hasPrivilege = Users.current.id === privilege.currentPrivilege.id ? true : false;
    $rootScope.$on('privilege-enabled', function (event, status) {
      $scope.hasPrivilege = status;
      $scope.disableControls = !status;
      canvasMousePointer.icon = 'cur-default'; // Default the mouse icon

      $scope.changeTool('default', 'default');
    }); // Toggles the ToolSets

    $scope.toggleToolset = function (toolset) {
      //onmouseover remove the class which was appended during tool selection.
      $scope.toolsets[toolset].toolbarEvents = true; // On mouse over will check the user's disable controls status, if the disable controls status is false then the toolset will be open. 

      if ($scope.disableControls) {
        return false;
      } else {
        // This is to change the hover behaviour for new requirement
        // Toggle will now act as open. Close will not be handled here.
        $scope.toolsets[toolset].toggledFlag = true;
        if (previousToolset == toolset) return; // Toggle the toolset state

        $scope.toolsets[toolset].toggled = $scope.toolsets[toolset].toggled ? false : true; // If any other toolset is open currently close that
        // PreCond :: Check if previousToolset is set
        // PreCond :: Check if previousToolset is in open state
        // PreCond :: Check if currentTool is not previous tool

        if (previousToolset && $scope.toolsets[previousToolset].toggled && previousToolset != toolset) {
          $scope.toolsets[previousToolset].toggled = false;
        } // Update the tool to previous tool


        previousToolset = toolset;
        var el = document.getElementById('toolbar'); // Focus the toolset if toggled

        if ($scope.toolsets[toolset].toggled) {
          // Using timeout as the element will be visible
          // only after animation starts
          $timeout(function () {
            el.focus();
          }, 100);
        }
      }
    };

    $scope.bindToolset = function (toolset, tool, icon) {
      $scope.toolsets[toolset].icon = icon;
      $scope.toolsets[toolset].active = tool;
    };

    $scope.changeTool = function (tool, toolset) {
      if (!$scope.disableControls) {
        if (tool != 'default') {
          // Disabling the google analytics tracking for the default tool. 
          // Sending the data to Analytics factory to track the events
          Analytics.sendEvent(Analytics.eventAction().click, Analytics.eventCategory().annotationTools, tool ? tool : '');
        } // Change the active tool and toolset


        $scope.activeTool = tool;
        $scope.activeToolset = toolset; // Update the active tool to toolbar service

        toolbarService.setActiveTool(tool);
        /*if(previousToolset && $scope.toolsets[previousToolset].toggled)
        	$scope.toolsets[previousToolset].toggled = false;*/
        // Mouse Icon Switch

        switch (tool) {
          case 'default':
            canvasMousePointer.icon = 'cur-default';
            break;

          case 'pencil':
            canvasMousePointer.icon = 'cur-pencil';
            break;

          case 'marker':
            canvasMousePointer.icon = 'cur-marker';
            break;

          case 'circle':
          case 'rectangle':
          case 'line':
            canvasMousePointer.icon = 'cur-shape';
            break;

          case 'eraser-free':
          case 'eraser-path':
            canvasMousePointer.icon = 'cur-eraser';
            break;

          case 'textbox':
            canvasMousePointer.icon = 'cur-text';
            break;

          case 'pointer':
            canvasMousePointer.icon = 'cur-pointer';
            break;

          default: // Some default pointer or default browser pointer will load up

        }

        if (toolset != "default") {
          //remove the binded toolset
          $scope.removeToolSet(toolset);
        }
      }
    }; //remove the binded toolset.


    $scope.removeToolSet = function (toolset) {
      // console.log($scope.toolsets);
      // console.log(toolset);
      // console.log($scope.toolsets[toolset]);
      //This was added because user can able to select other tools during the animation fadeout.This should be disabled. So added a class to remove the click property.
      $scope.toolsets[toolset].toolbarEvents = false;
      $timeout(function () {
        $scope.toolsets[toolset].toggledFlag = false;
      }, 500);
    };

    $scope.closeToolset = function () {
      // Using timeout, if not element is removed and any click on
      // the ul > li will not get triggered
      // This will trigger the click and than perform closing
      $timeout(function () {
        if (previousToolset) {
          $scope.toolsets[previousToolset].toggled = false; //remove the binded toolset

          $scope.removeToolSet(previousToolset);
        } // Added due to new change to work on hover instead on click


        previousToolset = null;
      }, 400);
    };

    $scope.changeColor = function (color) {
      toolbarService.setActiveColor(color);
      if (previousToolset && $scope.toolsets[previousToolset].toggled) $scope.toolsets[previousToolset].toggled = false; //remove the binded toolset

      $scope.removeToolSet('color');
    };

    $scope.changeSize = function (size) {
      toolbarService.setActiveSize(size);
      if (previousToolset && $scope.toolsets[previousToolset].toggled) $scope.toolsets[previousToolset].toggled = false; //remove the binded toolset

      $scope.removeToolSet('size');
    };

    $scope.toggleExplorer = function () {
      if (!$scope.disableControls) $scope.$emit('show-explorer');
    };
    /**
     * @module toggleAssessment
     * @desc Method to emit the click event handler to the assessment directive
     * 		 Toggles the window on / off
     */


    $scope.toggleAssessment = function () {
      $scope.$emit('assessment');
    };

    $scope.loadFile = function () {
      $scope.$emit('import-file');
    }; // Clears all the objects in the current canvas permanently


    $scope.clearAll = function () {
      // Emit the event so board directive can propagate this
      if (!$scope.disableControls) $scope.$emit('clear-all');
    };

    $scope.changeTool('default', 'default');
  }; // Return the directive so its prototype will be defined by Angular


  return directive;
}]); // This is a temporary hack

var canvasMousePointer = {
  icon: 'null'
};
//# sourceMappingURL=toolbar.directive.js.map

DC.directive('assessment', [

	//Dependencies
	'$rootScope',
	'$timeout',
	'userService',
	'Auth',
	'AssessmentService',

	// CallBack
	function ($rootScope, $timeout, userService, Auth, AssessmentService) {



		//==============================================================================
		// DIRECTIVE - This contains the directive properties and fuctions
		//==============================================================================
		var directive = {};

		// Restricts the directive to Attribute by default
		directive.templateUrl = '/views/partials/classroom/assessment/assessment.html'; // Template URL for directive.
		directive.controller = assessmentCtrl;
		directive.controllerAs = 'assessmentCtrl';
		directive.$inject = ['$scope'];
		directive.bindToController = true; // Scope Isolation

		/**
		 * I have followed the ES6's arrow function for this directive
		 * If any issue is faced in future reg. browser support for ES6, the entire directive method code
		 * needs to be changed, or we can use the 'MORDERNIZER JS' to support older browser versions
		 */
		function assessmentCtrl($scope) {

			var sessionData = Auth.getData(), // Holds the auth content

				/** Fetches the total list of users in the activity */
				// usersFrmDCdb = userService.getUsers(),
				assessmentErrorTimer = null,
				assessmentSuccessTimer = null,

				/** ID to be passed with comments, PUT call */
				unknownId = null,

				totalItemCount = 0,

				/** resultsMock - Array used to hold the result template
				 * Will be assigned to each students
				*/
				resultsMock = {};

			const defaultValues = AssessmentService.defaultValues();

			$scope.feedBackInfo = {
				userId: null,
				comments: "",
				name: ""
			};


			$scope.isClosed = false;

			$scope.displayAssessment = false;

			/** Maintains both partial and full result of all students
			 * Master Object that holds the entire data of the form
			 */
			$scope.results = {};

			/** Fetches the total list of users in the activity */
			$scope.users = [];

			/** Get the current user details - Teacher */
			$scope.currentUser = userService.getCurrentUser();

			function Assessment() {

			}

			/**
			 * Method to Call API to fetch the class students results
			 * Used for the all class types
			 * @return {}
			 */
			Assessment.prototype.fetchNonEncounterClassStudentsResults = function (activityId, resultObject) {
				/** Get the class skills schema by calling the API */
				var parsedNonEncounterResultObject = JSON.parse(angular.toJson(resultObject));

				AssessmentService.fetchClassStudentsResults(activityId).then(function (data) {
					$scope.displaySpinner = false;
					var studentResultNonEncounter = data.results;

					studentResultNonEncounter.map((result, index, array) => {
						var studentId = result.studentId;

						for(let key in parsedNonEncounterResultObject) {
							if(studentId === key) {
								parsedNonEncounterResultObject[studentId].comments = result.result;
							}
						}

						defaultValues.resultTypes.nonEncounter.forEach((type) => {
							if (type.id === result.contentItemResultTypeId) {
								if(parsedNonEncounterResultObject[studentId]) {
									parsedNonEncounterResultObject[studentId].result = type;
								}
							}
						});

					});

					$scope.results = parsedNonEncounterResultObject;
				});
			};


			/**
			 * @module classNonEncounterResults
			 * @desc Sends the selected partial results through the API
			 */
			Assessment.prototype.classNonEncounterPartialResults = function (results, user) {

				var request = {
					classId: unknownId,
					comment: results[user.lsId].comments || null,
					contentItemResultType: results[user.lsId].result ? defaultValues.resultTypes.nonEncounter[0].id : defaultValues.resultTypes.nonEncounter[1].id,
					studentId: user.lsId
				};

				AssessmentService.classNonEncounterPartialResults(request).then(function (data) {
					console.log('data', data);
				})
					.catch(function (error) {
						console.error("Assessment Error: ", error);
						assessment.handleAssessmentError(defaultValues.errorMessages.updateResult);
					});
			};


			/**
			 * @module closeNonEncounter
			 * @desc Method to Call API to store the summarized rating of all the fields
			 */
			Assessment.prototype.closeNonEncounter = function (unknownId) {

				$scope.displaySpinner = true;
				AssessmentService.closeNonEncounter(unknownId).then(function (response) {
					AssessmentService.fetchStudentsList(sessionData.activityId).then(function (data) {
						$scope.displaySpinner = false;
						$scope.isClosed = data.isClosed;

						if (data.isClosed) {
							assessment.handleAssessmentSuccess(defaultValues.successMessages.submittedSuccessfully);
						} else {
							assessment.handleAssessmentError(defaultValues.errorMessages.errorInHandlingData);
						}

					});
				}).catch(function (error) {
					console.error("Assessment Error: ", error);
					assessment.handleAssessmentError(error.message ? error.message
						: defaultValues.errorMessages.updateResult);
				});
			};


			/**
			 * @module classEncounterAllResults
			 * @desc Method to Call API to store the summarized rating of all the fields
			 */
			Assessment.prototype.classEncounterAllResults = function (input) {
				/** Stores the summarized results by calling the API */
				AssessmentService.classEncounterAllResults(input).then(function (data) {
				})
					.catch(function (error) {
						console.error("Assessment Error: ", error);
						assessment.handleAssessmentError(defaultValues.errorMessages.updateResult);
					});
			};


			/**
			 * @module selectNonEncounterResultType
			 * @desc Method to Call API to store the summarized rating of all the fields
			 */
			Assessment.prototype.selectNonEncounterResultType = function (input) {
				/** Stores the summarized results by calling the API */
				AssessmentService.classNonEncounterPartialResults(input).then(function (data) {
				})
					.catch(function (error) {
						console.error("Assessment Error: ", error);
						assessment.handleAssessmentError(defaultValues.errorMessages.updateResult);
					});
			};


			/**
			 * @module classEncounterPartialResults
			 * @desc Method to Call API to store the partial rating for each questions
			 */
			Assessment.prototype.classEncounterPartialResults = function (index, outerIndex, topic, result, rating) {

				/** If the class is closed, do not allow the teacher to enter any ratings, comments, finish/ save class again */
				if ($scope.isClosed) {
					assessment.handleAssessmentSuccess(defaultValues.successMessages.classHasEnded);
					return;
				}

				var request = {
					classId: sessionData.activityId,
					ratingSchemaPartItemId: AssessmentService.extractDataId(topic[index]),
					result: rating,
					studentId: $scope.users[outerIndex].lsId,
					teacherId: $scope.currentUser.lsId ? $scope.currentUser.lsId : null
				};

				let partNo = AssessmentService.getPartNo(request.ratingSchemaPartItemId, result.partialResults);

				var studentResult = $scope.results[request.studentId];

				if (studentResult.partialResults[partNo][index][request.ratingSchemaPartItemId] === rating) {
					rating = request.result = defaultValues.ratings[0];
				}

				studentResult.partialResults[partNo][index][request.ratingSchemaPartItemId] = rating;

				var calculatedScoreObject = AssessmentService.calculateStudentScore(studentResult, totalItemCount);

				studentResult.score = calculatedScoreObject.score || defaultValues.score.notEnoughData;

				studentResult.isAllRatingChecked = calculatedScoreObject.isAllRatingChecked;

				if (studentResult.score != defaultValues.score.notEnoughData) {

					/** On awarding rating for the n'th question, the score will return value instead of zero.
					 * At that time, the partialResult for the n'th question is submitted first, followed by allResults API
					 */
					/** Stores the complete result by calling the API */
					AssessmentService.classEncounterPartialResults(request)
						.then(function (data) {

							if (studentResult.score >= defaultValues.score.threshold) {
								studentResult.result = defaultValues.resultTypes.encounter[0];
							} else {
								studentResult.result = defaultValues.resultTypes.encounter[1];
							}

							let allResultsRequestData = {
								classId: unknownId,
								comment: studentResult.comments ? studentResult.comments : null,
								contentItemResultType: studentResult.result.id,
								score: studentResult.score,
								studentId: request.studentId
							};

							/** Stores the complete result by calling the API */
							AssessmentService.classEncounterAllResults(allResultsRequestData)
								.then(function (data) {
								}).catch(function (error) {
									console.error("Assessment Error: ", error);
									assessment.handleAssessmentError(defaultValues.errorMessages.updateResult);
								});
						})
						.catch(function (error) {
							console.error("Assessment Error: ", error);
							assessment.handleAssessmentError(defaultValues.errorMessages.updateResult);
						});


				} else {

					/** Reset the result dropdown */
					studentResult.result = {};
					studentResult.score = 0;

					if (request.result == 0) {
						request.result = null;
					}

					/** Stores the complete result by calling the API */
					AssessmentService.classEncounterPartialResults(request).then(function (data) {
						let allResultsRequestData = {
							classId: unknownId,
							comment: studentResult.comments ? studentResult.comments : null,
							contentItemResultType: null,
							score: null,
							studentId: request.studentId
						};

							AssessmentService.classEncounterAllResults(allResultsRequestData)
								.then(function (data) {
								}).catch(function (error) {
									console.error("Assessment Error: ", error);
									assessment.handleAssessmentError(defaultValues.errorMessages.updateResult);
								});

					})
						.catch(function (error) {
							console.error("Assessment Error: ", error);
							assessment.handleAssessmentError(defaultValues.errorMessages.updateResult);
						});
				}
			};


			/**
			 * @module closeEncounter
			 * @desc Method to Call API to close the encounter's assessment
			 */
			Assessment.prototype.closeEncounter = function (unknownId) {

				$scope.displaySpinner = true;

				AssessmentService.closeEncounter(unknownId).then(function (response) {

					AssessmentService.fetchStudentsList(sessionData.activityId).then(function (data) {

						$scope.isClosed = data.isClosed;

						if (data.isClosed) {
							assessment.handleAssessmentSuccess(defaultValues.successMessages.submittedSuccessfully);
							$scope.displaySpinner = false;
						} else {
							assessment.handleAssessmentError(defaultValues.errorMessages.errorInHandlingData);
						}
					});
				})
					.catch(function (error) {
						console.error("Assessment Error: ", error);
						assessment.handleAssessmentError(error.message ? error.message
							: defaultValues.errorMessages.updateResult);
					});
			};


			/**
			 * Method to Call API to fetch the class students results
			 * Used for the all class types
			 * @return {}
			 */
			Assessment.prototype.fetchEncounterClassStudentsResults = function (activityId, resultObject) {

				AssessmentService.fetchClassStudentsResults(activityId).then(function (data) {

					$scope.displaySpinner = false;

					let parsedResultObject = JSON.parse(angular.toJson(resultObject));

					if(data.partialResults.length > 0) {
						data.partialResults.forEach((studentPartialResult) => {
							const studentId = studentPartialResult.studentId;

							studentPartialResult.itemResultsViewModel.map((ratingFromApi, index, array) => {
								for(let key in parsedResultObject[studentPartialResult.studentId].partialResults) {
									parsedResultObject[studentId].partialResults[key].map((questionObject, index, arr) => {
										if(questionObject[ratingFromApi.ratingSchemaPartItemId] !== undefined) {
											questionObject[ratingFromApi.ratingSchemaPartItemId] = ratingFromApi.result;
										}
									});
								}
							});
						});
					} else {
						console.log('empty partial results');
					}

					$scope.results = parsedResultObject;

					if(data.results.length > 0) {
						/** Update the comments, score and result type */
						angular.forEach(data.results, (resultsValue, resultsKey) => {
							$scope.results[resultsValue.studentId].comments = resultsValue.result;
							$scope.results[resultsValue.studentId].score = resultsValue.score;
							//$scope.results[resultsValue.studentId].result = resultsValue.contentItemResultTypeId;
							var getResultType = AssessmentService.getResultType(defaultValues, resultsValue.contentItemResultTypeId, $rootScope.classData.classTypeName);
							$scope.results[resultsValue.studentId].result = getResultType;
						});
					} else {
						console.log('No result object which contains score');
					}
				});
			};


			/**
			 * Method to fetch the students list. For Online Encounter:
			 * Set of questions to be displayed on load
			 * @param { unitId }
			 * @return { }
			 */
			Assessment.prototype.fetchStudentsList = function (activityId, mockResult) {

				var studentsList = [],
					resultList = {};

				/** Get the class skills schema by calling the API */
			  AssessmentService.fetchStudentsList(activityId).then(function (data) {

					$scope.isClosed = data.isClosed;
					unknownId = data.id;
					$scope.currentUser.lsId = data.teacherId;
					if (data.bookedStudents.length <= 0) {
						// assessment.handleAssessmentError(defaultValues.errorMessages.noStudentsJoined);
						$scope.displaySpinner = false;
						$scope.isStudentBooked = 'false';
						return;
					} else {
						$scope.isStudentBooked = 'true';
					}

					let bookedStudents = data.bookedStudents,
						students = userService.getStudents();

					console.log('app-joined order', students);

					angular.forEach(bookedStudents, function (value) {

						let studentDetails = {
							ssdsId: value.student.ssdsId,
							lsId: value.student.userId,
							firstName: value.student.firstName,
							lastName: value.student.lastName,
							photoUri: Object.keys(value.student.photoUris).length > 0 ? value.student.photoUris.big : null
						};


						students.forEach(function (user) {
							if (user.id === studentDetails.ssdsId) {
								studentDetails.joinedTime = user.joinedTime ? user.joinedTime : 0;
							}
						});

						/** Generate results array template using the results mock object */
						// extra line
						resultList[studentDetails.lsId] = mockResult;


						if(studentDetails.joinedTime) {
							resultList[studentDetails.lsId].joinedTime = studentDetails.joinedTime;
						}

						/** Generate users array to be displayed on the top (landscape) */
						studentsList.push(studentDetails);

					});
					var sortedUser = AssessmentService.rearrangeStudents(studentsList);

					console.log('sortedUser', sortedUser);
					$scope.users = sortedUser;

					/** Sets the list of sorted students on the users array */
					// $scope.users = AssessmentService.sortStudentsByJoinedTime(studentsList);

					$scope.results = resultList;


					if ($rootScope.classData.classTypeName == defaultValues.class.onlineEncounter && $rootScope.classData.unit) {
						assessment.fetchEncounterClassStudentsResults(sessionData.activityId, resultList);
					} else {
						$scope.resultTypesNonEncounter = defaultValues.resultTypes.nonEncounter;
						assessment.fetchNonEncounterClassStudentsResults(activityId, resultList);
					}
				});
			};


			/**
			 * Method to fetch Class Skills Schema for Online Encounter
			 * Set of questions to be displayed on load
			 * @param { unitId }
			 * @return {}
			 */
			Assessment.prototype.fetchClassSkillsSchema = function (unitId) {

				/** Get the class skills schema by calling the API */
				AssessmentService.fetchClassSkillsSchema(unitId)
					.then(function (data) {

						/** Generate users array to be displayed on the left(Portrait) */
						$scope.classSkills = data;

						totalItemCount = AssessmentService.setTotalItemCount(data);

						$scope.resultTypes = defaultValues.resultTypes.encounter;

						for (let i = 0; i < data.length; i++) {

							resultsMock.partialResults['Part' + data[i].number] = [];

							for (let j = 0; j < data[i].ratingSchemaPartItems.length; j++) {

								$scope.classSkills[i].ratingSchemaPartItems[j].formattedHelpText = data[i].ratingSchemaPartItems[j].helpText.split("\n");

								resultsMock.partialResults['Part' + data[i].number].push({ [data[i].ratingSchemaPartItems[j].id]: 0 });
							}
						}

						$scope.results = resultsMock;

						assessment.fetchStudentsList(sessionData.activityId, resultsMock);

					});
			};


			/**
			 * Method to fetch the class skills schema. For Online Encounter:
			 * Set of questions to be displayed on load
			 * @param { unitId }
			 * @return {}
			 */
			Assessment.prototype.loadEncounterClass = function (activityId) {
				resultsMock = {
					comments: null,
					result: null,
					score: null,
					joinedTime: 0,
					partialResults: {}
				};
				AssessmentService.fetchUnitId().then(function (data) {
					AssessmentService.getUnitId(data, $rootScope.classData.unit).then(function (unitId) {
						assessment.fetchClassSkillsSchema(unitId)
					});
				});

			};

			/**
			 * Method to load the prerequisites for Non Encounter Class Types
			 * For Non Encounter Class Types: Displays The Comments and Attendance
			 * @param {}
			 * @return {}
			 */
			Assessment.prototype.loadNonEncounterClass = function (activityId) {

				resultsMock = defaultValues.nonEncounterResultsMock;

				assessment.fetchStudentsList(activityId, resultsMock);
			};


			/**
			 * @module handleAssessmentError
			 * @desc Method to hide the error message after displaying it for 'n' seconds
			 */
			Assessment.prototype.handleAssessmentError = function (error) {

				$scope.assessmentError = {
					title: JSON.stringify(error).substr(1).slice(0, -1),
				};

				assessmentErrorTimer = $timeout(function () {
					$timeout.cancel(assessmentErrorTimer);
					$scope.assessmentError = null;
				}, defaultValues.notificationTimeout);

			};


			/**
			 * @module handleAssessmentSuccess
			 * @desc Method to hide the success message after displaying it for 'n' seconds
			 */
			Assessment.prototype.handleAssessmentSuccess = function (success) {

				$scope.assessmentSuccess = {
					title: success
					//message: success
				};

				assessmentSuccessTimer = $timeout(function () {
					$timeout.cancel(assessmentSuccessTimer);
					$scope.assessmentSuccess = null;
				}, defaultValues.notificationTimeout);

			};


			/**
			 * Method to be call on the directive load
			 * @param {}
			 * @return {}
			 */
			Assessment.prototype.initialize = function () {

				$scope.displaySpinner = true;

				if ($rootScope.classData.classTypeName == defaultValues.class.onlineEncounter && $rootScope.classData.unit) {
					$scope.encounterFeedback = true;
					assessment.loadEncounterClass(sessionData.activityId);
				}
				else {
					$scope.encounterFeedback = false;
					assessment.loadNonEncounterClass(sessionData.activityId);
				}

			};

			var assessment = new Assessment();

			$scope.getRating = function (data) {
				return Object.values(data)[0];
			};

			$scope.selectEncounterResultType = function (data, results, userId) {

				$scope.results[userId].result = data;

				let resultData = {
					classId: unknownId,
					comment: results[userId].comments,
					contentItemResultType: data.id,
					score: results[userId].score,
					studentId: userId
				};
				assessment.classEncounterAllResults(resultData);
			};


			$scope.selectNonEncounterResultType = function (data, results, user) {

				$scope.results[user.lsId].result = data;

				let resultData = {
					classId: unknownId,
					comment: results[user.lsId].comments ? results[user.lsId].comments : null,
					contentItemResultType: data.id,
					studentId: user.lsId
				};
				assessment.selectNonEncounterResultType(resultData);
			};


			$scope.classEncounterPartialResults = function (index, outerIndex, topic, result, rating) {
				assessment.classEncounterPartialResults(index, outerIndex, topic, result, rating);
			};


			$scope.classNonEncounterPartialResults = function (results, user) {
				assessment.classNonEncounterPartialResults(results, user);
			};


			$scope.getFeedback = function (input, userInfo) {

				/** If the class is closed, do not allow the teacher to enter any ratings, comments, finish/ save class again */
				if ($scope.isClosed) {
					assessment.handleAssessmentSuccess(defaultValues.successMessages.classHasEnded);
					return;
				}

				if (input) {
					$scope.feedBackInfo.name = userInfo.firstName + " " + userInfo.lastName;
					$scope.feedBackInfo.comments = $scope.results[userInfo.lsId].comments;
					$scope.feedBackInfo.userId = userInfo.lsId;
				}
				$scope.showFeedbackpopup = input;
			};

			$scope.updateFeedback = function () {

				/** If the class is closed, do not allow the teacher to enter any ratings, comments, finish/ save class again */
				if ($scope.isClosed) {
					assessment.handleAssessmentSuccess(defaultValues.successMessages.classHasEnded);
					return;
				}

				$scope.results[$scope.feedBackInfo.userId].comments = $scope.feedBackInfo.comments || "";

				var requestData = {
					classId: unknownId,
					comment: $scope.results[$scope.feedBackInfo.userId].comments ? $scope.results[$scope.feedBackInfo.userId].comments : null,
					contentItemResultType: $scope.results[$scope.feedBackInfo.userId].result ? $scope.results[$scope.feedBackInfo.userId].result.id : null,
					studentId: $scope.feedBackInfo.userId
				};

				if ($rootScope.classData.classTypeName == defaultValues.class.onlineEncounter && $rootScope.classData.unit) {

					requestData.score = $scope.results[$scope.feedBackInfo.userId].score;

					/** Stores the complete result by calling the API */
					AssessmentService.classEncounterAllResults(requestData).then(function (data) {
					}).catch(function (error) {
						console.error("Assessment Error: ", error);
						assessment.handleAssessmentError(defaultValues.errorMessages.updateFeedback);
					});

				} else {
					/** Stores the complete result by calling the API */
					AssessmentService.classNonEncounterPartialResults(requestData).then(function (data) {
					}).catch(function (error) {
						console.error("Assessment Error: ", error);
						assessment.handleAssessmentError(defaultValues.errorMessages.updateFeedback);
					});

				}

				$scope.getFeedback(false);
				$scope.feedBackInfo.comments = "";
			};


			$scope.toggleResultType = function (selectedUser, event) {
				/** If the class is closed, do not allow the teacher to enter any ratings, comments, finish/ save class again */
				if ($scope.isClosed) {
					assessment.handleAssessmentSuccess(defaultValues.successMessages.classHasEnded);
					return;
				}

				$scope.selectedUserResultType = selectedUser.lsId;

				selectedUser.showSelectedUserResultTypes = !selectedUser.showSelectedUserResultTypes;

				$scope.users.map(function(user) {
					if(user.lsId !== selectedUser.lsId) {
						user.showSelectedUserResultTypes = false;
					}
				});

				try {
					event.stopPropagation();
				} catch (e) {
					console.log("Error in toggling result type", e);
				}
			};


			$scope.closeEncounter = function () {

				/** If the class is closed, do not allow the teacher to enter any ratings, comments, finish/ save class again */
				if ($scope.isClosed) {
					assessment.handleAssessmentSuccess(defaultValues.successMessages.classHasEnded);
					// $scope.displayAssessment = false;
					$scope.displaySpinner = false;
					return;
				}

				if (!AssessmentService.isAllResultsArePresent($scope.results, defaultValues)) {
					assessment.closeEncounter(unknownId);
				} else {
					assessment.handleAssessmentError(defaultValues.errorMessages.allScoreNotValidated);
				}

			};


			$scope.closeNonEncounter = function () {

				/** If the class is closed, do not allow the teacher to enter any ratings, comments, finish/ save class again */
				if ($scope.isClosed) {
					assessment.handleAssessmentSuccess(defaultValues.successMessages.classHasEnded);
					// $scope.displayAssessment = false;
					$scope.displaySpinner = false;
					return;
				}

				if (!AssessmentService.isAllAttendanceEntered($scope.results)) {
					assessment.closeNonEncounter(unknownId);
				} else {
					assessment.handleAssessmentError(defaultValues.errorMessages.allAttendanceNotEntered);
				}

			};


			/** Receives the emitted value for opening the assessment popup window */
			$scope.$on("assessment", function () {
				$scope.displayAssessment = true;

				if ($scope.currentUser.role == defaultValues.roles.TEACHER && sessionData.createdBy !== defaultValues.createdBy.QUICK_SLOT) {
					assessment.initialize();
				}

				// assessment.initialize();

			});


			/** Method called on close button click of assessment popup */
			$scope.closeAssessment = function () {
				delete $scope.isStudentBooked;
				$scope.displayAssessment = false;
			};

			window.onclick = function () {
				if ($scope.selectedUserResultType) {
					$scope.selectedUserResultType = false;
				}

				$scope.users.map(function(user) {
					user.showSelectedUserResultTypes = false;
				});

			};

		}

		return directive;

	}

]);
