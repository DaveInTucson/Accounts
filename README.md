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
