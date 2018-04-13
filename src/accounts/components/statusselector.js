(function ()
{
  'use strict';

  angular.module('Accounts')
    .component('statusSelector', {
      templateUrl: 'src/accounts/templates/statusselector.component.html',
      controller: StatusSelectorController,
      bindings: {
        transaction: '<',
      },
    });

  StatusSelectorController.$inject = ['AccountDBService', '$scope'];
  function StatusSelectorController(AccountDBService, $scope)
  {
    let $ctrl = this;
    if ($ctrl.transaction) $ctrl.originalStatus = $ctrl.transaction.status;

    $ctrl.onChange = function()
    {
      AccountDBService.updateTransactionStatus($ctrl.transaction)
      .then(function(result)
      {
        //console.log('transaction status updated, result=', result);
        $ctrl.originalStatus = $ctrl.transaction.status;
        $scope.$emit('accountdetails:recomputeBalance')
      })
      .catch(function(result) {
        console.log('transaction status error, caught result=', result)
        $ctrl.transaction.status = $ctrl.originalStatus;
      });
    }
  } // StatusSelectorController
})();
