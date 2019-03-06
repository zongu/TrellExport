(function () {
    "use strict";
    angular
        .module("trellexport")
        .controller("CardController", CardController)
        .controller("ExportMemoController", ExportMemoController);

    CardController.$inject = ["ngProgressFactory", "ngNotify", "$state", "$stateParams", "$resource", "$uibModal"];
    function CardController(ngProgressFactory, ngNotify, $state, $stateParams, $resource, $uibModal) {
        var vm = this;
        vm.BoardId = $stateParams.BoardId;
        vm.MemberId = $stateParams.MemberId;
        vm.Auth = $stateParams.Auth;
        vm.DataList = [];
        vm.ContentStyle = {
            "overflow": "auto",
            "min-width": "800px"
        }

        init();
        function init() {
            vm.progressBar = ngProgressFactory.createInstance();
            vm.progressBar.start();
            let listSvc = $resource("https://api.trello.com/1/boards/" + vm.BoardId + "/lists", null);

            listSvc.query(vm.Auth).$promise.then(function (data) {
                vm.DataList = data;
                let contentWidth = (vm.DataList.length * 300);
                vm.ContentStyle= {
                    "overflow": "auto",
                    "min-width": contentWidth + "px"
                }

                for (let data of vm.DataList) {
                    let customFieldSvc = $resource("https://api.trello.com/1/boards/" + data.idBoard + "/customFields", null);
                    let cardSvc = $resource("https://api.trello.com/1/lists/" + data.id + "/cards", null);
                    //// 客製化參數取ID
                    customFieldSvc.query(vm.Auth).$promise.then((customFields) => {
                        let progessRateCustomFilds = customFields.filter(c => c.name === "總進度%");
                        let preparedFormallyCustomFilds = customFields.filter(c => c.name === "預正式");
                        let begainDateCustomFilds = customFields.filter(c => c.name === "預啟始");

                        let cardParams = {
                            key: vm.Auth.key,
                            token: vm.Auth.token,
                            customFieldItems: true,
                            fields: "name,badges,idBoard,shortUrl,idMembers"
                        };

                        cardSvc.query(cardParams).$promise.then((cards) => {
                            data.Cards = cards;

                            for (let card of cards) {
                                card.CustomItems = {
                                    ProgessRate: null,
                                    PreparedFormally: null,
                                    BegainDate: null
                                }

                                let progessRateId = progessRateCustomFilds && progessRateCustomFilds.length > 0 ? progessRateCustomFilds[0].id : "";
                                let preparedFormallyId = preparedFormallyCustomFilds && preparedFormallyCustomFilds.length > 0 ? preparedFormallyCustomFilds[0].id : "";
                                let begainDateId = begainDateCustomFilds && begainDateCustomFilds.length > 0 ? begainDateCustomFilds[0].id : "";

                                let progessRateValues = card.customFieldItems.filter(c => c.idCustomField === progessRateId);
                                let preparedFormallyValues = card.customFieldItems.filter(c => c.idCustomField === preparedFormallyId);
                                let begainDateValues = card.customFieldItems.filter(c => c.idCustomField === begainDateId);

                                card.CustomItems.ProgessRate = progessRateValues && progessRateValues.length > 0 ? progessRateValues[0].value.number : "";
                                card.CustomItems.PreparedFormally = preparedFormallyValues && preparedFormallyValues.length > 0 ? moment(preparedFormallyValues[0].value.date) : null;
                                card.CustomItems.BegainDate = begainDateValues && begainDateValues.length > 0 ? moment(begainDateValues[0].value.date) : null;
                            }
                        }
                            , (error) => {
                                vm.progressBar.complete();
                                ngNotify.set(error.data, "error");
                            });

                    }, (error) => {
                        vm.progressBar.complete();
                        ngNotify.set(error.data, "error");
                    })
                }

                vm.progressBar.complete();
            }, function (error) {
                vm.progressBar.complete();
                ngNotify.set(error.data, "error");
            });
        }

        vm.Reflash = () => {
            vm.progressBar.start();
            let listSvc = $resource("https://api.trello.com/1/boards/" + vm.BoardId + "/lists", null);

            listSvc.query(vm.Auth).$promise.then(function (data) {
                vm.DataList = data;
                let contentWidth = (vm.DataList.length * 300);
                vm.ContentStyle= {
                    "overflow": "auto",
                    "min-width": contentWidth + "px"
                }
                
                for (let data of vm.DataList) {
                    let customFieldSvc = $resource("https://api.trello.com/1/boards/" + data.idBoard + "/customFields", null);
                    let cardSvc = $resource("https://api.trello.com/1/lists/" + data.id + "/cards", null);
                    //// 客製化參數取ID
                    customFieldSvc.query(vm.Auth).$promise.then((customFields) => {
                        let progessRateCustomFilds = customFields.filter(c => c.name === "總進度%");
                        let preparedFormallyCustomFilds = customFields.filter(c => c.name === "預正式");

                        let cardParams = {
                            key: vm.Auth.key,
                            token: vm.Auth.token,
                            customFieldItems: true,
                            fields: "name,badges,idBoard,shortUrl,idMembers"
                        };

                        cardSvc.query(cardParams).$promise.then((cards) => {
                            data.Cards = cards;

                            for (let card of cards) {
                                card.CustomItems = {
                                    ProgessRate: null,
                                    PreparedFormally: null
                                }

                                let progessRateId = progessRateCustomFilds && progessRateCustomFilds.length > 0 ? progessRateCustomFilds[0].id : "";
                                let preparedFormallyId = preparedFormallyCustomFilds && preparedFormallyCustomFilds.length > 0 ? preparedFormallyCustomFilds[0].id : "";
                                let progessRateValues = card.customFieldItems.filter(c => c.idCustomField === progessRateId);
                                let preparedFormallyValues = card.customFieldItems.filter(c => c.idCustomField === preparedFormallyId);
                                card.CustomItems.ProgessRate = progessRateValues && progessRateValues.length > 0 ? progessRateValues[0].value.number : "";
                                card.CustomItems.PreparedFormally = preparedFormallyValues && preparedFormallyValues.length > 0 ? moment(preparedFormallyValues[0].value.date) : null;
                            }
                        }
                            , (error) => {
                                vm.progressBar.complete();
                                ngNotify.set(error.data, "error");
                            });

                    }, (error) => {
                        vm.progressBar.complete();
                        ngNotify.set(error.data, "error");
                    })
                }

                vm.progressBar.complete();
            }, function (error) {
                vm.progressBar.complete();
                ngNotify.set(error.data, "error");
            });
        }

        vm.CardChoice = (card) => {
            if (card.IsChoice) {
                var modalInstance = $uibModal.open({
                    templateUrl: "ExportMemo.html",
                    controller: "ExportMemoController",
                    controllerAs: "exportMemoCtrl",
                    windowTopClass: "modalTop",
                    size: "lg",
                    resolve: {
                        CardId: function () {
                            return card.id;
                        },
                        Auth: () => {
                            return vm.Auth;
                        }
                    }
                }).result.then((comment) => {
                    card.ExportMemo = comment;
                    card.Members = "";
                    if (card.idMembers.length > 0) {
                        for (let member of card.idMembers) {
                            let memberInfoSvc = $resource("https://api.trello.com/1/members/" + member, null);
                            memberInfoSvc.get().$promise.then((memberInfo) => {
                                card.Members += memberInfo.fullName;
                                card.Members += ",";
                            }, (error) => {
                                console.log(error);
                            })
                        }
                    }
                }, (error) => {
                    card.IsChoice = false;
                });
            }
            else {
                card.ExportMemo = "";
            }
        }

        vm.Export = (data) => {
            let choiceCards = data.Cards.filter((item, index, array) => {
                return item.IsChoice;
            });

            if (choiceCards.length === 0) {
                return;
            }

            let output = [];
            for (let card of choiceCards) {
                output.push({
                    CardName: card.name,
                    CardUrl: card.shortUrl,
                    ListName: data.name,
                    Comment: card.ExportMemo,
                    Members: card.Members,
                    ProgessRate: card.CustomItems.ProgessRate ? card.CustomItems.ProgessRate : "",
                    PreparedFormally: card.CustomItems.PreparedFormally ? card.CustomItems.PreparedFormally.format() : "",
                    DueDate: card.badges.due && card.badges.due !== "" ? moment(card.badges.due).format() : "",
                    BegainDate: card.CustomItems.BegainDate ? card.CustomItems.BegainDate.format() : ""
                })
            }
            
            alasql('SELECT CardName,CardUrl,ListName,Comment,Members,ProgessRate,PreparedFormally,BegainDate,DueDate INTO XLSX( "Export.xlsx", {headers:true} ) FROM ?', [output]);
        }

        vm.GoBack = () => {
            $state.go("TeamBoard", {
                Auth: vm.Auth,
                MemberId: vm.MemberId
            });
        }
    }
})();

ExportMemoController.$inject = ['$uibModalInstance', 'CardId', 'Auth', 'ngProgressFactory', 'ngNotify', '$resource'];
function ExportMemoController($uibModalInstance, CardId, Auth, ngProgressFactory, ngNotify, $resource) {
    var vm = this;
    vm.progressBar = ngProgressFactory.createInstance();
    vm.CardId = CardId;
    vm.Auth = Auth;

    init();
    function init() {
        vm.progressBar.start();

        let actionSvc = $resource("https://api.trello.com/1/card/" + vm.CardId + "/actions", null);
        actionSvc.query(vm.Auth).$promise.then((action) => {
            vm.progressBar.complete();
            vm.MemoList = action;
        }
            , (error) => {
                vm.progressBar.complete();
                ngNotify.set(error.data, "error");
            });
    }

    vm.CommentChoice = (comment) => {
        $uibModalInstance.close(comment);
    }
}