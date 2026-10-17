import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { OfficeFlatNode, OfficeTreeNode } from '../office-tree-view/office-tree-node';
import { SelectionModel } from '@angular/cdk/collections';

const _transformer = (node: OfficeTreeNode, level: number) => {
  return {
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level: level,
    id: node.id,
    checked: node.checked
  };
};

const treeFlattener = new MatTreeFlattener(
  _transformer,
  (node) => node.level,
  (node) => node.expandable,
  (node) => node.children
);

@Component({
  selector: 'mifosx-country-tree-view',
  templateUrl: './country-tree-view.component.html',
  styleUrls: ['./country-tree-view.component.scss'],
})
export class CountryTreeViewComponent implements OnInit, AfterViewInit {
  constructor(private router: Router) {}

  @Input() treeDataSource: OfficeTreeNode[] = [];
  /** Offices that may not be picked here, e.g. because another down payment configuration already owns them */
  @Input() disabledOfficeIds: number[] = [];
  /**
   * Ticking an office picks that office alone, instead of its whole subtree. Down payment configurations work this
   * way because the API already applies a configuration to the offices under the one it names.
   */
  @Input() selectOfficeOnly = false;
  @Output() checkedOffices = new EventEmitter<any>();

  @ViewChild('officeTree') officeTree!: any;
  treeControl = new FlatTreeControl<OfficeFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlattener);
  checklistSelection = new SelectionModel<OfficeFlatNode>(true);

  hasChild = (_: number, node: OfficeFlatNode) => node.expandable;

  getLevel = (node: OfficeFlatNode) => node.level;
  isExpandable = (node: OfficeFlatNode) => node.expandable;

  ngOnInit(): void {
    this.dataSource.data = this.treeDataSource;
  }

  /** Whether an office is spoken for, so it can neither be ticked on its own nor through its parent */
  isDisabled = (node: OfficeFlatNode): boolean => (this.disabledOfficeIds || []).indexOf(node.id) > -1;

  ngAfterViewInit() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.isDisabled(this.treeControl.dataNodes[i])) {
        continue;
      }
      if (this.treeControl.dataNodes[i].checked === true) {
        this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
        this.checklistSelection.select(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i]);
      }
    }
  }

  /** What the checkbox of an office with children shows */
  isChecked(node: OfficeFlatNode): boolean {
    return this.selectOfficeOnly ? this.checklistSelection.isSelected(node) : this.descendantsAllSelected(node);
  }

  isIndeterminate(node: OfficeFlatNode): boolean {
    return this.selectOfficeOnly ? false : this.descendantsPartiallySelected(node);
  }

  descendantsAllSelected(node: OfficeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every((child) => {
      this.checklistSelection.isSelected(child);
      this.checkedOffices.emit(this.checklistSelection.selected);
    });
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: OfficeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: OfficeFlatNode): void {
    if (this.isDisabled(node)) {
      return;
    }
    if (this.selectOfficeOnly) {
      this.toggleOfficeOnly(node);
      return;
    }
    this.checklistSelection.toggle(node);
    // a disabled descendant stays out of the selection, so ticking a parent cannot claim an office someone else owns
    const descendants = this.treeControl.getDescendants(node).filter((child) => !this.isDisabled(child));
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Deselect all selected nodes if any */
  deselectAllNodes(): void {
    if (this.checklistSelection.selected.length > 0) {
      this.checklistSelection.clear();
      this.checkedOffices.emit(this.checklistSelection.selected);
    }
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: OfficeFlatNode): void {
    if (this.isDisabled(node)) {
      return;
    }
    if (this.selectOfficeOnly) {
      this.toggleOfficeOnly(node);
      return;
    }
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /** Picks or drops one office, leaving the offices above and below it as they are */
  private toggleOfficeOnly(node: OfficeFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkedOffices.emit(this.checklistSelection.selected);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: OfficeFlatNode): void {
    let parent: OfficeFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: OfficeFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
    this.checkedOffices.emit(this.checklistSelection.selected);
  }

  /* Get the parent node of a node */
  getParentNode(node: OfficeFlatNode): OfficeFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  refreshDataSource(datasource: OfficeTreeNode[]) {
    this.dataSource.data = datasource;
  }
}
