(function () {
    "use strict";

    deferredBootstrapper.bootstrap({
        element: document.body,
        module: "trellexport",
        resolve: {
        }
    });

    angular.module("trellexport", [
        "ngResource",
        "ngSanitize",
        "ui.bootstrap",
        "ui.select",
        "frapontillo.bootstrap-switch",
        "ngNotify",
        "ui.router",
        "ncy-angular-breadcrumb",
        "angular-cron-jobs",
        "ngProgress"])
        .run(function () {
            angular.element("#pageloader").addClass("hidden");
            angular.element("#maincontainer").removeClass("hidden");
        })
        .config(RouteConfig);


    RouteConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
    function RouteConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("TeamBoard", {
                url: "/TeamBoard",
                templateUrl: "/app/TeamBoard.html",
                controller: "TeamBoardController as ctrl",
                ncyBreadcrumb: {
                    label: "TeamBoard"
                },
                params: {
                    MemberId: null,
                    Auth: null
                }
            }).state("Board", {
                url: "/Board",
                templateUrl: "/app/Board.html",
                controller: "BoardController as ctrl",
                ncyBreadcrumb: {
                    label: "Board"
                },
                params: {
                    Auth: null
                }
            }).state("Card", {
                url: "/Card",
                templateUrl: "/app/Card.html",
                controller: "CardController as ctrl",
                ncyBreadcrumb: {
                    label: "Card"
                },
                params: {
                    MemberId: null,
                    BoardId: null,
                    Auth: null
                }
            });

        $urlRouterProvider.otherwise("/TeamBoard");
    }
})();