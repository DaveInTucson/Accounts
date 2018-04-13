(function ()
{
  'use strict';

  angular.module('Accounts')
    .component('accountActivityNavigation', {
      templateUrl: 'src/accounts/templates/accountactivitynavigation.component.html',
      controller: AccountActivityNavigationController,
      bindings: {
        accountActivity: '=',
        accountId: '@',
        currentMonth: '@',
      },
    });


  let closedTriangle = "▶";
  let openTriangle   = "▼";

  AccountActivityNavigationController.$inject = ['UtilsService', '$state'];
  function AccountActivityNavigationController(UtilsService, $state)
  {
    let $ctrl = this;

    let treeIsOpenState = [];
    $ctrl.$onInit = function()
    {
      $ctrl.activeYears = makeActiveYears($ctrl.accountActivity);
      let dateToOpen = UtilsService.parseSQLDate($ctrl.currentMonth);
      for (let i = 0; i < $ctrl.activeYears.length; i++)
      {
        if (dateToOpen.year === $ctrl.activeYears[i].year)
        {
          treeIsOpenState[i] = true;
          break;
        }
      }
    };

    $ctrl.treeIsOpen = function(index)
    {
      return treeIsOpenState[index];
    };

    $ctrl.toggleTree = function(index)
    {
      treeIsOpenState[index] = !treeIsOpenState[index];
    };

    $ctrl.triangle = function(index)
    {
      return $ctrl.treeIsOpen(index) ? openTriangle : closedTriangle;
    };

    $ctrl.selectMonth = function(month)
    {
      $state.go('accountTransactions', { accountID: $ctrl.accountId, month:month });
    };

    // This function takes the list of months the account has been active (as
    // provided by the database) and converts it to a two-level year/month
    // hierarchy suitable for rendering the navigation tree
    function makeActiveYears(accountActivity)
    {
      let lastYearValue = 0;

      let activeYears = [];
      let currentYear = null;
      for (let i = 0; i < accountActivity.length; i++)
      {
        let date = UtilsService.parseSQLDate(accountActivity[i].month);
        //console.log('makeActiveYears, date=', date);
        if (date.year !== lastYearValue)
        {
          currentYear = [];
          activeYears.push({ year:date.year, months:currentYear});
          lastYearValue = date.year;
        }
        currentYear.push({ monthName: date.monthName, fullDate:accountActivity[i].month});
      }
      return activeYears;
    } // makeDateHierarchy

  } // AccountActivityNavigationController
})();
