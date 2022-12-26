/** Savings Account Buttons Configuration */
export class SavingsButtonsConfiguration {

  optionArray: {
    name: string,
    taskPermissionName: string,
  }[];

  buttonsArray: {
    name: string,
    icon: string,
    taskPermissionName: string,
  }[];

  constructor(status: string) {
    this.setOptions(status);
    this.setButtons(status);
  }

  get singleButtons() {
    return this.buttonsArray;
  }

  get options() {
    return this.optionArray;
  }

  setButtons(status: string) {
    switch (status) {
      case 'Active':
        this.buttonsArray = [
          {
            name: 'Deposit',
            icon: 'arrow-up',
            taskPermissionName: 'DEPOSIT_SAVINGSACCOUNT'
          },
          {
            name: 'Withdraw',
            icon: 'arrow-down',
            taskPermissionName: 'WITHDRAW_SAVINGSACCOUNT'
          },
          {
            name: 'Hold Amount',
            icon: 'lock',
            taskPermissionName: 'HOLDAMOUNT_SAVINGSACCOUNT'
          },
          {
            name: 'Calculate Interest',
            icon: 'table',
            taskPermissionName: 'CALCULATEINTEREST_SAVINGSACCOUNT'
          },
          {
            name: 'Post Interest As On',
            icon: 'arrow-right',
            taskPermissionName: 'POSTINTEREST_SAVINGSACCOUNT',
          },
        ];
        break;
      case 'Submitted and pending approval':
        this.buttonsArray = [
          {
            name: 'Modify Application',
            icon: 'pen',
            taskPermissionName: 'UPDATE_SAVINGSACCOUNT'
          },
          {
            name: 'Approve',
            icon: 'check',
            taskPermissionName: 'APPROVE_SAVINGSACCOUNT'
          }
        ];
        break;
      case 'Approved':
        this.buttonsArray = [
          {
            name: 'Undo Approval',
            icon: 'undo',
            taskPermissionName: 'APPROVALUNDO_SAVINGSACCOUNT'
          },
          {
            name: 'Activate',
            icon: 'check',
            taskPermissionName: 'ACTIVATE_SAVINGSACCOUNT'
          },
          {
            name: 'Add Charge',
            icon: 'plus',
            taskPermissionName: 'CREATE_SAVINGSACCOUNTCHARGE'
          }
        ];
      break;
      default:
        this.buttonsArray = [];
    }
  }

  setOptions(status: string) {
    switch (status) {
      case 'Active':
        this.optionArray = [
          {
            name: 'Post Interest',
            taskPermissionName: 'POSTINTEREST_SAVINGSACCOUNT'
          },
          {
            name: 'Add Charge',
            taskPermissionName: 'CREATE_SAVINGSACCOUNTCHARGE'
          },
          {
            name: 'Close',
            taskPermissionName: 'CLOSE_SAVINGSACCOUNT'
          }
        ];
        break;
      case 'Submitted and pending approval':
        this.optionArray = [
          {
            name: 'Reject',
            taskPermissionName: 'REJECT_SAVINGSACCOUNT'
          },
          {
            name: 'Withdraw By Client',
            taskPermissionName: 'WITHDRAW_SAVINGSACCOUNT'
          },
          {
            name: 'Add Charge',
            taskPermissionName: 'CREATE_SAVINGSACCOUNTCHARGE'
          },
          {
            name: 'Delete',
            taskPermissionName: 'DELETE_SAVINGSACCOUNT'
          }
        ];
        break;
      case 'Approved':
      default:
        this.optionArray = [];
    }
  }

  addOption(option: {name: string, taskPermissionName: string}) {
    this.optionArray.push(option);
  }

}
