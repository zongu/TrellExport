(function () {
    "use strict";
    angular
        .module("trellexport")
        .factory("BoardService", BoardService);

    BoardService.$inject = ["$resource"];
    function BoardService($resource) {
        return $resource("https://api.trello.com/1/members/me/boards", null, {
            get: { method: 'GET' },
            post: { method: 'POST' },
            update: { method: 'PUT' },
            delete: { method: "DELETE" }
        });
    }
})();