(function ()
{
  'use strict';

  angular.module('DB')
    .service('AccountDBService', AccountDBService);

  AccountDBService.$inject = ['AjaxUtilsService'];
  function AccountDBService (AjaxUtilsService)
  {
    let service = this;
    //console.log('in AccountDBService');
    service.accounts = null;

    service.getDepositBalances = function()
    {
      return AjaxUtilsService.ajaxGet({ url: ApiBasePath + '/get-deposit-balances' });
    };

    service.getTransactionDetails = function(accountID, month)
    {
      return AjaxUtilsService.ajaxGet({
        url: ApiBasePath + '/get-transaction-details',
        params : {
          'accountID' : accountID,
          'month' : month,
        }
      });
    };

    service.getAccounts = function()
    {
      if (service.accounts)
      {
        return AjaxUtilsService.promisify(service.accounts);
      }
      return AjaxUtilsService.ajaxGet({ url: ApiBasePath + '/get-accounts' })
      .then(function(accounts)
      {
        service.accounts = accounts;
        return accounts;
      });
    };

    service.updateTransactionStatus = function(transaction)
    {
      return AjaxUtilsService.ajaxPost({
        url: ApiBasePath + '/update-transaction-status',
        data : {
          date_posted : transaction.date_posted,
          from_id     : transaction.from_id,
          to_id       : transaction.to_id,
          id          : transaction.id,
          status      : transaction.status,
        },
      });
    };
  };

})();
