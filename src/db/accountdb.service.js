(function ()
{
  'use strict';

  angular.module('DB')
    .service('AccountDBService', AccountDBService);

  function parseNumbers(value)
  {
    if (undefined === value) return value;
    if (null === value) return value;
    if ('number' == typeof value) return value;

    if (Array.isArray(value))
    {
      for (let i = 0; i < value.length; i++)
        value[i] = parseNumbers(value[i]);
      return value;
    }

    if (typeof value === 'object')
    {
      for (let key in value)
        value[key] = parseNumbers(value[key]);
      return value;
    }

    if ('string' !== typeof value)
      return value;

    let number = parseFloat(value);
    if (isNaN(number)) return value;
    return number;
  }

  AccountDBService.$inject = ['ApiBasePath', '$http'];
  function AccountDBService (ApiBasePath, $http)
  {
    let service = this;
    console.log('in AccountDBService');

    function ajaxGet(config)
    {
      if (config.hasOwnProperty('method'))
      config.method = 'GET';

      return $http(config).then(function(response) {
        return parseNumbers(response.data);
      });
    }

    service.getDepositBalances = function()
    {
      return ajaxGet({
        url: ApiBasePath + '/get-deposit-balances',
      })
    };

    service.getTransactionDetails = function(accountID, month)
    {
      return ajaxGet({
        url: ApiBasePath + '/get-transaction-details',
        params : {
          'accountID' : accountID,
          'month' : month,
        }
      });
    }
  };

  console.log('accountdb.service.js done');
})();
