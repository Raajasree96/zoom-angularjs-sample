(function () {
    'use strict';

    angular.module('app.todos.list', ['ngAnimate', 'app.zoomService'])

            .controller('TodosListController', TodosListController);

    TodosListController.$inject = ['$scope', 'zoomService'];

    function TodosListController($scope, zoomService) {
        var vm = this;

        vm.deleteCompleted = deleteCompleted;
        vm.joinSession = joinSession;
        vm.joinBreakoutSession = joinBreakoutSession;
        vm.joinBreakoutSession2 = joinBreakoutSession2;
        vm.reJoinBreakoutSession = reJoinBreakoutSession;
        vm.leaveSession = leaveSession;

        function deleteCompleted() {
            $scope.IC.todos = $scope.IC.todos.filter(function (item) {
                return !item.done;
            });
        }

        function joinSession() {
            console.log('hooo')
            return zoomService.joinSession();
        }

        function joinBreakoutSession() {
            console.log('breakout 1')
            return zoomService.joinBreakoutSession();
        }

        function joinBreakoutSession2() {
            console.log('breakout 2')
            return zoomService.joinBreakoutSession2();
        }

        function reJoinBreakoutSession() {
            console.log('rejoin')
            return zoomService.reJoinBreakoutSession();
        }

        function leaveSession() {
            console.log('leaveSession')
            return zoomService.leaveSession();
        }
        
    }
})();
