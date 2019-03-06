(function () {
    "use strict";
    angular
        .module("trellexport")
        .controller("TeamBoardController", TeamBoardController);

    TeamBoardController.$inject = ["ngProgressFactory", "ngNotify", "$state", "$resource", "$stateParams"];
    function TeamBoardController(ngProgressFactory, ngNotify, $state, $resource, $stateParams) {
        var vm = this;
        vm.MemberId = "";
        vm.Auth = {
            key: "",
            token: ""
        }

        vm.MemberId = $stateParams.MemberId ? $stateParams.MemberId : "";
        vm.Auth = $stateParams.Auth ? $stateParams.Auth : { key: "", token: "" };
        vm.Boards = [];

        init();
        function init() {
            vm.progressBar = ngProgressFactory.createInstance();
            if ($stateParams.MemberId && $stateParams.Auth) {
                vm.Boards = [];
                vm.progressBar.start();
                let MemberInfoSvc = $resource("https://api.trello.com/1/members/" + vm.MemberId, null);

                MemberInfoSvc.get().$promise.then(function (memberInfo) {
                    let TeamSvc = $resource("https://api.trello.com/1/members/" + memberInfo.id + "/organizations", null);

                    TeamSvc.query(vm.Auth).$promise.then((teamInfos) => {
                        for (let teamInfo of teamInfos) {
                            for (let boardId of teamInfo.idBoards) {
                                let BoardSvc = $resource("https://api.trello.com/1/boards/" + boardId, null);

                                BoardSvc.get(vm.Auth).$promise.then((boardInfo) => {
                                    vm.Boards.push(boardInfo);
                                }, (error) => {
                                    vm.progressBar.complete();
                                    ngNotify.set(error.data, "error");
                                })
                            }
                        }

                        vm.progressBar.complete();
                    }, (error) => {
                        vm.progressBar.complete();
                        ngNotify.set(error.data, "error");
                    })
                }, function (error) {
                    vm.progressBar.complete();
                    ngNotify.set(error.data, "error");
                });
            }
        }

        vm.TrellLogin = () => {
            if (!vm.MemberId || vm.MemberId === "" || !vm.Auth.key || vm.Auth.key === "" || !vm.Auth.token || vm.Auth.token === '') {
                ngNotify.set("MemberId Key Token請檢察", "warn");
                return;
            }

            vm.Boards = [];
            vm.progressBar.start();
            MemberInfoSvc(vm.MemberId).get().$promise.then(function (memberInfo) {
                TeamSvc(memberInfo.id).query(vm.Auth).$promise.then((teamInfos) => {
                    for (let teamInfo of teamInfos) {
                        for (let boardId of teamInfo.idBoards) {
                            BoardSvc(boardId).get(vm.Auth).$promise.then((boardInfo) => {
                                vm.Boards.push(boardInfo);
                            }, (error) => {
                                vm.progressBar.complete();
                                ngNotify.set(error.data, "error");
                            })
                        }
                    }

                    vm.progressBar.complete();
                }, (error) => {
                    vm.progressBar.complete();
                    ngNotify.set(error.data, "error");
                })
            }, function (error) {
                vm.progressBar.complete();
                ngNotify.set(error.data, "error");
            });
        }

        vm.DashBoardChoice = (boardId) => {
            $state.go("Card", {
                MemberId: vm.MemberId,
                BoardId: boardId,
                Auth: vm.Auth
            })
        }

        let MemberInfoSvc = (memberId) => {
            return $resource("https://api.trello.com/1/members/" + memberId, null);
        }

        let TeamSvc = (id) => {
            return $resource("https://api.trello.com/1/members/" + id + "/organizations", null);
        }

        let BoardSvc = (boardId) => {
            return $resource("https://api.trello.com/1/boards/" + boardId, null);
        }
    }
})();