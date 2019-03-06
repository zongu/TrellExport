(function () {
    "use strict";
    angular
        .module("trellexport")
        .controller("BoardController", BoardController);

    BoardController.$inject = ["BoardService", "ngProgressFactory", "ngNotify", "$state"];
    function BoardController(BoardService, ngProgressFactory, ngNotify, $state) {
        var vm = this;
        vm.Auth = {
            key: "0e362b29dbce139c4846fcfd50e79a33",
            token: "d79a71e5617d2abbcff031c5aa96b758b358b395b0c855a4108d3628b01b92a4"
        }

        init();
        function init() {
            vm.progressBar = ngProgressFactory.createInstance();
        }

        vm.TrellLogin = () => {
            if (!vm.Auth.key || vm.Auth.key === "" || !vm.Auth.token || vm.Auth.token === '') {
                ngNotify.set("Key Token請檢察", "warn");
                return;
            }

            vm.progressBar.start();
            BoardService.query(vm.Auth).$promise.then(function (data) {
                vm.progressBar.complete();
                vm.Boards = data;
            }, function (error) {
                vm.progressBar.complete();
                ngNotify.set(error.data, "error");
            });
        }

        vm.DashBoardChoice = (boardId) => {
            $state.go("Card", {
                BoardId: boardId,
                Key: vm.Auth.key,
                Token: vm.Auth.token
            })
        }
    }
})();