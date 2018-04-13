# Accounts (Angular)

## Introduction

This is an AngularJS-based SPA for managing the contents of my financial
accounts database. I had originally implemented a version of this using
the Handlebars library, but I feel like AngularJS provides me a better
platform for extending it beyond where I got using Handlebars

## Phase 1

The first step is to replicate more or less the functionality that's already
working in the Handlebars version.

* Implemented depostbalances state, started on accountTransactions state
* Implemented basic transactions display
* Added account-link component and account links to transactions display
* Added status selector and logic to update database
* Refactored Ajax logic into AjaxUtilsService, removed some log calls, cleaned
  up the logic in computeBalances (accounttransactionsstate.js)
* Refactored transaction annotation logic to simplify balance calculation and
  account access, bug fixes
* Created AccountCacheService and refactored AccountTransactionsStateController
  to use it
* Added code to rebalance account when status changes, bug fix
* refactored transaction detail table into its own component
* Added transaction summary table, bug fixes
* added active date navigation to account transaction state

### To Do:

* navigation by account
* graph of deposit account balance totals over time
* edit existing transactions
* insert new transactions
* account management
* summarize accounts by category
* display all pending transactions
* next/previous links
* log DB access error
