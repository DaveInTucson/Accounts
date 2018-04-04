(function ()
{
  'use strict';

  angular.module('DB')
    .service('AccountDBService', AccountDBService);

  // float_re is incomplete, but close enough for my purposes
  let int_re   = /^-?\d+$/;
  let float_re = /^-?\d+\.\d+$/;
  let date_re  = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;

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

    // We can't just call parseFloat(value) and check if that's a number, because
    // parseFloat('2018-04-01') === 2018, which would result in lost data
    if (int_re.exec(value))
      return parseInt(value);
    if (float_re.exec(value))
      return parseFloat(value);
    return value;
  }

  AccountDBService.$inject = ['ApiBasePath', '$http', '$q'];
  function AccountDBService (ApiBasePath, $http, $q)
  {
    let service = this;
    console.log('in AccountDBService');
    service.accounts = null;

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
      return ajaxGet({ url: ApiBasePath + '/get-deposit-balances' });
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
    service.getAccounts = function()
    {
      if (service.accounts)
      {
        let deferred = $q.defer();
        deferred.resolve(service.accounts);
        return deferred.promise;
      }
      return ajaxGet({ url: ApiBasePath + '/get-accounts' })
      .then(function(accounts)
      {
        service.accounts = accounts;
        return accounts;
      });
    }
  };

  console.log('accountdb.service.js done');
})();
