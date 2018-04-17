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
new and improved features). I'm really pleased with how the month navigation
component came out, as well as the fact that routing URLs means it will now
just redisplay the old page on reload (instead of going back to the "front page").

## Phase 2

### To Do:
* next/previous month links
* search feature (display all pending transactions)
* do something else when navigating to date prior to first account transaction?
* it would be good to do something sensible in accountTransactions when an
  account doesn't have any transactions
* graph of deposit account balance totals over time
* edit existing transactions
* insert new transactions
* account management
* summarize accounts by category
* testing and bug fixes as necessary
