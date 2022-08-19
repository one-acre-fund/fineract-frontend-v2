import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable, ViewChild,OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import { OfficeHierarchyFlatNode, OfficeHierarchy } from '../office-tree-view/office-tree-node';


let TREE_DATA = {
  '': {
  }
};

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<OfficeHierarchy[]>([]);

  get data(): OfficeHierarchy[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `OfficeHierarchy` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `OfficeHierarchy`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): OfficeHierarchy[] {
    return Object.keys(obj).reduce<OfficeHierarchy[]>((accumulator, key) => {
      const value = obj[key];
      const node = new OfficeHierarchy();
      node.hierarchyLevel = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.descendant = this.buildFileTree(value, level + 1);
        } else {
          node.hierarchyLevel = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
insertItem(parent: OfficeHierarchy, name: string) {  
    if (!parent.descendant) parent.descendant=[];
    parent.descendant.push({ hierarchyLevel: name,hierarchyType:'OAF' } as OfficeHierarchy);
    this.dataChange.next(this.data);
}

  updateItem(node: OfficeHierarchy, name: string) {
    
    node.hierarchyLevel = name;
    this.dataChange.next(this.data);
  }
}

@Component({
  selector: 'mifosx-office-hierarchy',
  templateUrl: './office-hierarchy.component.html',
  styleUrls: ['./office-hierarchy.component.scss'],
  providers: [ChecklistDatabase]
})
export class OfficeHierarchyComponent implements OnInit {
  hasData:boolean=false;
  ngOnInit(): void {
  }

  flatNodeMap = new Map<OfficeHierarchyFlatNode, OfficeHierarchy>();

  @ViewChild('tree') tree;

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<OfficeHierarchy, OfficeHierarchyFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: OfficeHierarchyFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<OfficeHierarchyFlatNode>;

  treeFlattener: MatTreeFlattener<OfficeHierarchy, OfficeHierarchyFlatNode>;

  dataSource: MatTreeFlatDataSource<OfficeHierarchy, OfficeHierarchyFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<OfficeHierarchyFlatNode>(true /* multiple */);

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<OfficeHierarchyFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: OfficeHierarchyFlatNode) => node.level;

  isExpandable = (node: OfficeHierarchyFlatNode) => true;

  getChildren = (node: OfficeHierarchy): OfficeHierarchy[] => node.descendant;

  hasChild = (_: number, _nodeData: OfficeHierarchyFlatNode) => true;

  hasNoContent = (_: number, _nodeData: OfficeHierarchyFlatNode) => _nodeData.hierarchyLevel === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: OfficeHierarchy, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.hierarchyLevel === node.hierarchyLevel
        ? existingNode
        : new OfficeHierarchyFlatNode();
    flatNode.hierarchyLevel = node.hierarchyLevel;
    flatNode.level = level;
    flatNode.expandable = true;                   // edit this to true to make it always expandable
    flatNode.hasChild = !!node.descendant;  // add this line. this property will help 
                                              // us to hide the expand button in a node
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: OfficeHierarchyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: OfficeHierarchyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: OfficeHierarchyFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: OfficeHierarchyFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: OfficeHierarchyFlatNode): void {
    let parent: OfficeHierarchyFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: OfficeHierarchyFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: OfficeHierarchyFlatNode): OfficeHierarchyFlatNode | null {
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

  /** Select the category so we can insert the new item. */
  addNewItem(node: OfficeHierarchyFlatNode) {
    
    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: OfficeHierarchyFlatNode, itemValue: string) {
    
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
    this.treeControl.expand(node);
    this.tree.treeControl.expandAll();
  }

  ngAfterViewInit() {
    this.tree?.treeControl.expandAll();
  }
}
