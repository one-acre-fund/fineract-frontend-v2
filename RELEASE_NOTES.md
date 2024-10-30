# Release Notes

## Version 1.3.5 - Community 1.0.0
    * [SER-2577] - Allow group movement regardless of loan status and office
    * [SER-3227] - Change link color for group and office labels in the client detail page.

## Version 1.3.4 - Community 1.0.0

    * [SER-3008] - Added ability to load organisational units (OUs) up to custom levels of the OU hierarchy config
    * [SER-2803] - Added configuration for automatically triggerring deployment with Github Release

## Version 1.3.3 - Community 1.0.0

    * [SER-2961] - Client's Date of Birth (DOB) should be available on the client profile.
    * [SER-2955] - Revise the global configuration pages to incorporate the new isStringValue flag field.
    * [SER-2902] - Disable loan submit button for a specific period to avoid double clicks.
    * [SER-2664] -  Show only client eligible loan products
    * [SER-2881] -  Re-enable configuration of the currency multiple from directly on the UI during Loan Definition
## Version 1.3.2 - Community 1.0.0

    * [SER-2947] - Show or hide some menus based on user permissions.
    * [SER-2956] - Fix regression on Display Terms&Conditions on loan product page
## Version 1.3.1 - Community 1.0.0

    * [SER-2854] Editing a loan product leads to loss of attached charges
    * [SER-2854] - Removed currency control subscription on charges step during loan product update that clears charges on currency change
    * [SER-2929] - Show only active offices when creating clients and load only active offices when searcing offices by country.
    * [SER-2859] - Accept a string value to be passed when creating a new configuration, but only for the 'skip-ocr-credit-score-users' config at this time.

## Version 1.3.0 - Community 1.0.0

    * [SER-1406] - Fix create client errors
    * [SER-842] - Allow an authorised user to select an active country so that s/he can make any changes to a specific country
    * [SER-1544] - Office dropdown in Create/Edit Client interface should be searchable
    * [SER-1543] - Office dropdown in Import Client interface should be searchable
    * [SER-1541] - Office dropdownlist in the transfer client interface should be searchable
    * [SER-1569] - Check how transfer client endpoint works
    * [SER-1538] - Implement healthy path upload in Fineract UI v2
    * [SER-1542] - Fix new loan application error
    * [SER-1617] - Fix error when accessing group member details from Group details page
    * [SER-1536] - Implement Loan Top-up in Fineract UI
    * [SER-1618] - Search Client on the client list interface by multiple fields as done in the old version
    * [SER-1895] - Fix Fineract UI Signout Redirect Keycloak Error
    * [SER-1532] - Hide fields in the loan creation process
    * [SER-1924] - Allow some transaction types clickable
    * [SER-1524] - Fix pagination issue
    * [SER-1916] - Create a UI for repayments download
    * [SER-1112] - Create UI for field configuration (CRUD)
    * [SER-1963] - Fix the OU tree selection issue on the loan product creation
    * [SER-1898] - Fix Office Bulk Import
    * [SER-1899] - Fix Clients Bulk Import
    * [SER-1900] - Fix Groups Bulk Import
    * [SER-2043] - Hide unused bulk import items
    * [SER-1562] - Refresh automatically after uploading a file
    * [SER-1521] - As a country admin, I should be able to add an extension charge
    * [SER-2030] - Implement loan terms and conditions
    * [SER-2045] - Add delete button for loan product
    * [SER-2093] - Add qualification rules on loan products
    * [SER-2438] - Fix view client details
    * [SER-2093] - Add qualification rules on loan products
    * [SER-2396] - Deploy fineract UI v2 on the integration cluster (Added missing envs)
    * [SER-2440] - Revise the country selection option to check for the Head Office instead of roles
    * [SER-2446] - Add ng-select as drop down in client and group creation
    * [SER-2458] - Replace mat-select-filter in all interfaces with ng select
    * [SER-2304] - Upgrade to angular 14
    * [SER-2036] - Return groups based on the selected country
    * [SER-2034] - Return clients based on the selected country.
    * [SER-2039] - Return loan products based on the selected country.
    * [SER-2510] - show office hierrachy path name, show only required menus.
    * [SER-1922] - Fineract v2  - Loan type to be visible in loan product view and edit screens
    * [SER-1912] - Fineract v2  - Show OU Location Hierarchy Details When Displaying Clients
    * [SER-1911] - Fineract v2  - Show OU Location Hierarchy Details When Displaying Groups
    * [SER-2486] - Creating savings account and mapping it to loans and country
    * [SER-2523] - Implementation of payment channel selection in configuration
    * [SER-1896] - Hide the add button on the lowest level OU in the tree.
    * [SER-1561] - show the proper office name instead of the name decorated.
    * [SER-1908] - Include Phone Number in Repayment Transaction Details
    * [SER-1913] - Exclude the ability to Edit Repayments in Fineract
    * [SER-2549] - Implement Loan Account Bulk Upload in Fineract v2
    * [SER-2595] - Fix Add hooks interface for Rabbit MQ template, also clears cached data when there is a PUT,POST or DELETE request, a fix for the reacitvate interface.
    * [SER-2600] - Fix edit loan product failing due to unsupported fields being submitted
    * [SER-2600] - Fix terms and conditions not being populated correctly on create & edit loan product pages
    * [SER-2600] - User creation: Set sendPasswordToEmail to always be false
    * [SER-2600] - Group management: Fix adding client to a group failing due to initialization error.
    * [SER-2601] - Show credit score data if available for a client, show client identity value, show OU path when you search for a client.
    * [SER-2606] - Remove staff id from payload when creating users.
    * [SER-2663] - Show overpaid amount if possible on the account summary and also removing the interests sub-column from the transactions interface.
    * [SER-2680] - change input type for mobile number field from number to tel to client create and edit interfaces
    * [SER-2686] - fix hook routing key editing bug, fix resetting the selected office parent when you select radio button, and fix keycloak error.
    * [SER-2701] - fix credit score label data, ability to activate, deactivate and delete and office from UI
    * [SER-2735] - show currency and loan product name when displaying savings products in list, view and edit view.
    * [SER-2742] - show activate button when a group has been deactivated.
    * [SER-2763] - fix for view client signature and click group name from client view
    * [SER-2805] - show proper error message when error status is 400, show client office in the client view,show a searchable dropdown when creating a new client loan.
    * [SER-2537] - Add country link to SMS campaigns
    * [SER-2809] - Fix navigations in the group view interface
    * [SER-2507] - Require OTP validation when updating clients
    * [SER-2818] - Remove templates link to organisation.
    * [SER-2803] - Move build from Azure pipeline to GitHub Actions
    * [SER-2745] - Fix file name in the bulk import downloads to use file name from the API
    * [SER-2847] - Allow overide of OCR checks if a user has the SKIP_VERIFICATION_CLIENT permission.
    * [SER-2892] - Search fields on Client Search and Filter Bars are labeled with "Search for Client" and "Filter by Client" respectively and fix null objects in the view jobs interface.
    * [SER-2926] - Remove loan payment button from the UI

## Version 1.0.0 - for use with Fineract Web App

    * This repository was forked from Mifos Web App
    ## to force a commit.
