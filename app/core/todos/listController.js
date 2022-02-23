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
        vm.reJoinBreakoutSession = reJoinBreakoutSession;

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
            console.log('breakout')
            return zoomService.joinBreakoutSession();
        }

        function reJoinBreakoutSession() {
            console.log('rejoin')
            return zoomService.reJoinBreakoutSession();
        }
    }
})();
