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
            joinBreakoutSession2: joinBreakoutSession2,
            reJoinBreakoutSession: reJoinBreakoutSession,
            leaveSession: leaveSession
        };

        function leaveSession() {
            vm.client.leave();
        }

        function reJoinBreakoutSession() {
            vm.client.leave().then(data => {
                console.log('Leave breakout session started')
                stopRenderVideo()
                joinSession()
            })
        }

        function joinBreakoutSession2() {
            vm.client.leave().then(data => {
                console.log('Leave session started')
                stopRenderVideo()
                $http.post('https://videosdk-sample-signature.herokuapp.com', {
				sessionName: 'Breakout123456',
	            sessionPasscode: ''
                }).then(response => {
                    if(response.data.signature) {
                        console.log(response.data.signature)
                        console.log('Breakout session 2 started')
                        initVideoAndAudio('Breakout123456', response.data.signature, 'Tommy', 'breakpas2')
                    }
                })
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
                        console.log('Breakout session 1 started')
                        initVideoAndAudio('Breakout123', response.data.signature, 'Tommy', 'breakpas')
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
                    return initiateListener();
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

        function initiateListener() {
            vm.client.on('user-added', () => { onParticipantChange()})
            vm.client.on('user-updated', () => { onParticipantChange()})
            vm.client.on('user-removed', () => { onParticipantChange()})
        }

        function onParticipantChange() {
            console.log('onParticipantChange')
            vm.participants = vm.client.getAllUser();
            vm.previousParticipantList = [...vm.otherParticipantsList || []];
            vm.otherParticipantsList = vm.participants.filter((user) => user.bVideoOn && user.userId !== vm.selfId)
      
            vm.addedParticipants = [], vm.removedParticipants = [];
            vm.addedParticipants = vm.otherParticipantsList.filter(
              (participant) => vm.previousParticipantList.findIndex(previousParticipant => {
                return previousParticipant.userId === participant.userId
              }) === -1,
            );
      
            vm.removedParticipants = vm.previousParticipantList.filter(
              (participant) => vm.otherParticipantsList.findIndex(previousParticipant => {
                return previousParticipant.userId === participant.userId
              }) === -1,
            );
            console.log('vm.addedParticipants', vm.addedParticipants)
            console.log('vm.participants', vm.participants)
            const sortedStudentList = vm.addedParticipants.sort((a,b) => a.userId - b.userId)

            // added participants
            if (vm.addedParticipants.length > 0) {
                vm.addedParticipants.forEach((participant) => {
                    console.log('participant', participant)
                    // for single canvas
                    // const otherCanvas = document.getElementById('video-canvas-other');
                    // vm.updatedIndex = sortedStudentList.findIndex(student => student.userId == participant.userId)
                    // console.log('vm.sortedStudentList', sortedStudentList)
                    // console.log('vm.updatedIndex', vm.updatedIndex)
                    // vm.mediaStream.renderVideo(otherCanvas, participant.userId, 300, 100, 300 * vm.updatedIndex, 0, 1);

                    // for multi canvas
                    if (participant.isHost) {
                        const canvas = document.getElementById('video-canvas-teacher');
                        vm.mediaStream.renderVideo(canvas, participant.userId, 300, 100, 0, 0, 1);
                    } else {
                        const otherCanvas = document.getElementById('video-canvas-other');
                        vm.updatedIndex = sortedStudentList.findIndex(student => student.userId == participant.userId)
                        console.log('vm.sortedStudentList', sortedStudentList)
                        console.log('vm.updatedIndex', vm.updatedIndex)
                        vm.mediaStream.renderVideo(otherCanvas, participant.userId, 300, 100, 300 * vm.updatedIndex, 0, 1);
                    }
                });
            }
            // removedParticipants
            if (vm.removedParticipants.length > 0) {
                vm.removedParticipants.forEach((participant) => {
                    // for single canvas
                    // vm.mediaStream && vm.mediaStream.stopRenderVideo(
                    //     document.getElementById('video-canvas-teacher'),
                    //     participant.userId,
                    // );
                    // For multi canvas
                    if (participant.isHost) {
                        vm.mediaStream && vm.mediaStream.stopRenderVideo(
                            document.getElementById('video-canvas-teacher'),
                            participant.userId,
                        );
                    } else {
                        vm.mediaStream && vm.mediaStream.stopRenderVideo(
                            document.getElementById('video-canvas-other'),
                            participant.userId,
                        );
                    }
                });
            }            
        }
    }
})();
