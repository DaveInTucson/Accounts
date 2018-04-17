# Accounts (Angular)

## Introduction

This is an AngularJS-based SPA for managing the contents of my financial
accounts database. I had originally implemented a version of this using
the Handlebars library, but I feel like AngularJS provides me a better
platform for extending it beyond where I got using Handlebars

## Phase 1

The first step is to replicate more or less the functionality that's already
working in the Handlebars version.

* Implemented depostbalances state, displays deposit accounts, balances, and
  cumulative balances (pending and cleared)
* Implemented accountTransactions state, display account transactions for a given month
  * basic transactions display
  * account links
  * status selector and logic to update database
  * balance update when a transaction status changes
  * transaction summary table
  * active date navigation
* global link to deposit balance page
* global account selector
* reload button
* log DB access error/show system status
* display negative amounts and balances in red

Everything from the old version is now working in the Angular version (plus some
new and improved features)
* dog food

## Phase 2

### To Do:
* search feature
* do something else when navigating to date prior to first account transaction?
* it would be good to do something sensible in accountTransactions when an
  account doesn't have any transactions
* graph of deposit account balance totals over time
* edit existing transactions
* insert new transactions
* account management
* summarize accounts by category
* display all pending transactions
* next/previous month links
* testing and bug fixes as necessary
