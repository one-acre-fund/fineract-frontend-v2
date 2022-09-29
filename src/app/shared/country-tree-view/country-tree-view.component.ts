import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
export class CountryTreeViewComponent implements OnInit {
  constructor(private router: Router) {}

  @Input() treeDataSource: OfficeTreeNode[] = [];
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
    const result = descendants.some((child) => {
      this.checklistSelection.isSelected(child);
      this.checkedOffices.emit(this.checklistSelection.selected);
    });
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: OfficeFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }
}
