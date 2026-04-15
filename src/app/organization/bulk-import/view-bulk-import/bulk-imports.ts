import { BulkImportsConstants } from "./bulk-imports-constant";

/** TODO: Refactor Permissions */
export const BulkImports = [
    {
      name: BulkImportsConstants.OFFICES_IMPORT,
      entityType: 'offices',
      urlSuffix: '/offices',
      permission: 'READ_OFFICE',
      formFields: 0
    },
    {
      name: BulkImportsConstants.USERS_IMPORT,
      entityType: 'users',
      urlSuffix: '/users',
      permission: 'READ_CLIENT',
      formFields: 2
    },
    {
      name: BulkImportsConstants.GROUPS_IMPORT,
      entityType: 'groups',
      urlSuffix: '/groups',
      permission: 'READ_CLIENT',
      formFields: 2
    },
    {
      name: BulkImportsConstants.CENTERS_IMPORT,
      entityType: 'centers',
      urlSuffix: '/centers',
      permission: 'READ_CENTERS',
      formFields: 2
    },
    {
      name: BulkImportsConstants.CLIENTS_IMPORT,
      entityType: 'client',
      urlSuffix: '/clients',
      permission: 'READ_CLIENT',
      formFields: 3
    },
    {
      name: BulkImportsConstants.CLIENT_TRANSFER_IMPORT,
      entityType: 'clienttransfer',
      urlSuffix: '/clients/transfer',
      permission: 'READ_CLIENT',
      formFields: 2
    },
    {
      name: 'Employees',
      entityType: 'staff',
      urlSuffix: '/staff',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: 'Guarantors',
      entityType: 'guarantors',
      urlSuffix: '/loans/1/guarantors',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: 'Journal Entries',
      entityType: 'gljournalentries',
      urlSuffix: '/journalentries',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: BulkImportsConstants.LOAN_ACCOUNTS_IMPORT,
      entityType: 'loans',
      urlSuffix: '/loans',
      permission: 'READ_CLIENT',
      formFields: 2
    },
    {
      name: 'Savings Accounts',
      entityType: 'savingsaccount',
      urlSuffix: '/savingsaccounts',
      permission: 'READ_CLIENT',
      formFields: 2
    },
    {
      name: 'Fixed Deposit Accounts',
      entityType: 'fixeddepositaccounts',
      urlSuffix: '/fixeddepositaccounts',
      permission: 'READ_CLIENT',
      formFields: 2
    },
    {
      name: 'Recurring Deposit Accounts',
      entityType: 'recurringdeposits',
      urlSuffix: '/recurringdepositaccounts',
      permission: 'READ_CLIENT',
      formFields: 2
    },
    {
      name: 'Chart of Accounts',
      entityType: 'chartofaccounts',
      urlSuffix: '/glaccounts',
      permission: 'READ_CLIENT',
      formFields: 2
    },
    {
      name: 'Share Accounts',
      entityType: 'shareaccounts',
      urlSuffix: '/accounts/share',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: BulkImportsConstants.LOAN_REPAYMENTS_IMPORT,
      entityType: 'loantransactions',
      urlSuffix: '/loans/repayments',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: BulkImportsConstants.SAVINGS_TRANSACTIONS_IMPORT,
      entityType: 'savingstransactions',
      urlSuffix: '/savingsaccounts/transactions',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: 'Fixed Deposit Transactions',
      entityType: 'fixeddeposittransactions',
      urlSuffix: '/fixeddepositaccounts/transaction',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: 'Recurring Deposit Transactions',
      entityType: 'recurringdepositstransactions',
      urlSuffix: '/recurringdepositaccounts/transactions',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: 'Healthy Path',
      entityType: 'loanproducthealthypath',
      urlSuffix: '/loanproducthealthypaths',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: BulkImportsConstants.ACCOUNT_TRANSFER_TRANSACTION_IMPORT,
      entityType: 'accounttransferstransaction',
      urlSuffix: '/accounttransfers',
      permission: 'READ_CLIENT',
      formFields: 1
    },
    {
      name: BulkImportsConstants.GROUP_OFFICE_TRANSFER_IMPORT,
      entityType: 'groupofficetransfer',
      urlSuffix: '/groups/transferoffice',
      permission: 'READ_CLIENT',
      formFields: 1
    },
  ];
