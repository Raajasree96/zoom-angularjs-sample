(function () {
    'use strict';

    angular.module('app.zoomService', [])

            .factory('zoomService', zoomService);

    zoomService.$inject = ['$http', '$log', '$q'];

    function zoomService($http, $log, $q) {
        var vm = this;
        vm.client = WebVideoSDK.default.createClient();
                
        return {
            joinSession: joinSession,
            joinBreakoutSession: joinBreakoutSession,
            reJoinBreakoutSession: reJoinBreakoutSession
        };

        function reJoinBreakoutSession() {
            vm.client.leave().then(data => {
                console.log('Leave breakout session started')
                stopRenderVideo()
                joinSession()
            })
        }

        function joinBreakoutSession() {
            vm.client.leave().then(data => {
                console.log('Leave session started')
                stopRenderVideo()
                $http.post('https://videosdk-sample-signature.herokuapp.com', {
				sessionName: 'Breakout123',
	            sessionPasscode: ''
                }).then(response => {
                    if(response.data.signature) {
                        console.log(response.data.signature)
                        console.log('Breakout session started')
                        initVideoAndAudio('Breakout123', response.data.signature, 'Tommy', 'breakpas')
                        // vm.client.join('Breakout123', response.data.signature, 'Tommy','breakpas').then(() => {
                        //     vm.mediaStream = vm.client.getMediaStream();
                        //     vm.selfId = vm.client.getSessionInfo().userId
                        //     console.log('breakout meeting success');
                        //     initVideoAndAudio()
                        // }).catch((error) => {
                        //     console.error(error);
                        // }); 
                    }
                })
            })
        }

        function joinSession() {
            vm.client.init('en-US', `Global`);
            $http.post('https://videosdk-sample-signature.herokuapp.com', {
				sessionName: 'testSDK12',
	            sessionPasscode: ''
			}).then(response => {
				if(response.data.signature) {
                    console.log(response.data.signature)
                    initVideoAndAudio('testSDK12', response.data.signature, 'Tommy', '')
                }
			})            
        }

        function initVideoAndAudio(sessionName, signature, name, password) {
            $q.when()
                .then(() => {
                    return join(sessionName, signature, name, password);
                })
                .then(() => {
                    return startVideo();
                })
                .then(() => {
                    return renderVideo();
                })
                .then(() => {
                    return startAudio();
                })
                .catch((err) => {
                    console.log('Error =======>', err)
                })
        }

        function join(sessionName, signature, name, password) {
            return vm.client.join(sessionName, signature, name, password).then(() => {
                vm.mediaStream = vm.client.getMediaStream();
                vm.selfId = vm.client.getSessionInfo().userId
                console.log('Join meeting success');
                // initVideoAndAudio()
            }).catch((error) => {
                console.error(error);
            });
        }

        function startVideo() {
            return vm.mediaStream.startVideo().then(success => {
                console.log('video start success');
              }, err => {
                console.log('errrrrrr======>>>', err)
            });
        }

        function stopVideo() {
            return vm.mediaStream.stopVideo().then(success => {
                console.log('video stopped success');
              }, err => {
                console.log('errrrrrr======>>>', err)
            });
        }

        function startAudio() {
            return vm.mediaStream.startAudio().then(success => {
                console.log('start audio success');
              }, err => {
                console.log('errrrrrr======>>>', err)
            });
        }

        function renderVideo() {
            return vm.mediaStream.renderVideo(
                document.getElementById('video-canvas-teacher'),
                vm.selfId,
                document.getElementById('video-canvas-teacher').getBoundingClientRect().width,
                document.getElementById('video-canvas-teacher').getBoundingClientRect().height,
                0,
                0,
                1,
              ).then(success => {
                console.log('video rendered success');
              }, err => {
                console.log('errrrrrr======>>>', err)
            });
        }

        function stopRenderVideo() {
            return vm.mediaStream.stopRenderVideo(
                document.getElementById('video-canvas-teacher'),
                vm.selfId
              ).then(success => {
                console.log('stopped video rendered success');
              }, err => {
                console.log('errrrrrr======>>>', err)
            });
        }
    }
})();
