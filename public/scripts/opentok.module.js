/*!
 *  opentok-angular (https://github.com/aullman/OpenTok-Angular)
 *
 *  Angular module for OpenTok
 *
 *  @ng-module: DC COM
 *  @Author: Adam Ullman (http://github.com/aullman)
 *  @Copyright (c) 2014 Adam Ullman
 *  @License: Released under the MIT license (http://opensource.org/licenses/MIT)
 **/

// Check if opentok library is available or not
if (!window.TB) throw new Error('You must include the TB library before the TB_Angular library');

// Define MODULE
angular.module('opentok', [])

// Define TB factory - Exposes the TokBox library as a ng component
.factory('TB', function() {
	return TB;
})

// Define Config values
// .value('apiKey', '45292602') // Stores the API KEY of the OpenTok