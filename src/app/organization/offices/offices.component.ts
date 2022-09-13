/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { OfficeTreeNode } from 'app/shared/office-tree-view/office-tree-node';

/** rxjs Imports */
import { of } from 'rxjs';
import { OrganizationService } from 'app/organization/organization.service';

/**
 * Offices component.
 */
@Component({
  selector: 'mifosx-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss']
})
export class OfficesComponent implements OnInit {
  /** Offices data. */
  officesData: any;
  /** Columns to be displayed in offices table. */
  displayedColumns: string[] = ['name', 'externalId', 'parentName', 'openingDate'];
  /** Data source for offices table. */
  dataSource: MatTableDataSource<any>;
  treeDataSource: OfficeTreeNode[] = [];
  toggleText = 'Tree View';
  treeView = false;
  /** Paginator for offices table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for offices table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /**
   * Retrieves the offices data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor (private route: ActivatedRoute,private organizationService:OrganizationService) {
    this.route.data.subscribe((data: { offices: any }) => {
      this.officesData = data.offices;
    });
  }

  /**
   * Filters data in offices table based on passed value.
   * @param {string} filterValue Value to filter data.
   */
  applyFilter (filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Sets the offices table.
   */
  ngOnInit () {
    this.setOffices();
  }

  /**
   * Initializes the data source, paginator and sorter for offices table.
   */
  setOffices () {
    this.dataSource = new MatTableDataSource(this.officesData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  serachOffice(){
    this.organizationService.searchOfficeTreeHierarchy(true,'OAF').subscribe(response=>{
      if(response){
        const data = response.map((item: any) => ({
          name: item.name,
          id: item.id,
          parentId: item.parentId,
          levelName: item.isCountry ? 'Country' : item.officeCountryHierarchyLevelName
        }));
        this.treeDataSource = data.reduce(
          (initial: any, value: any, index: any, original: any) => {
            if (!value.parentId || value.parentId === null) {
              if (initial.left.length) {
                this.checkLeftOvers(initial.left, value);
              }
              delete value.parentId;
              const displayName = [value.levelName, value.name]
                .filter(word => undefined !== word && word.length > 0)
                .join(' - ');
              value.name = displayName;
              initial.nested.push(value);
            } else {
              const parentFound = this.findParent(initial.nested, value);
              if (parentFound) {
                this.checkLeftOvers(initial.left, value);
              } else {
                const displayName = [value.levelName, value.name]
                  .filter(word => undefined !== word && word.length > 0)
                  .join(' - ');
                value.name = displayName;
                initial.left.push(value);
              }
            }
            return index < original.length - 1 ? initial : initial.nested;
          },
          { nested: [], left: [] }
        );
      }
    })
  }

  makeOfficeTreeNode (btntext: string) {
    this.treeView = btntext === 'Tree View' ? true : false;
    if (this.treeView) {
      this.toggleText = 'List View';
      this.serachOffice();
    } else {
      this.toggleText = 'Tree View';
    }
  }

  checkLeftOvers (leftOvers: any, possibleParent: any) {
    for (let i = 0; i < leftOvers.length; i++) {
      if (leftOvers[i].parentId === possibleParent.id) {
        delete leftOvers[i].parentId;
        const displayName = [leftOvers[i].levelName, leftOvers[i].name]
        .filter(word => undefined !== word && word.length > 0)
        .join(' - ');
        leftOvers[i].name = displayName;
        possibleParent.children
          ? possibleParent.children.push(leftOvers[i])
          : (possibleParent.children = [leftOvers[i]]);
        const addedObj = leftOvers.splice(i, 1);
        this.checkLeftOvers(leftOvers, addedObj[0]);
      }
    }
  }

  findParent (possibleParents: any, possibleChild: any): boolean {
    let found = false;
    for (let i = 0; i < possibleParents.length; i++) {
      if (possibleParents[i].id === possibleChild.parentId) {
        found = true;
        delete possibleChild.parentId;
        const displayName = [possibleChild.levelName, possibleChild.name]
        .filter(word => undefined !== word && word.length > 0)
        .join(' - ');
        possibleChild.name = displayName;
        if (possibleParents[i].children) {
           possibleParents[i].children.push(possibleChild);
        } else {
          possibleParents[i].children = [possibleChild];
        }
        return true;
      } else if (possibleParents[i].children) {
        found = this.findParent(possibleParents[i].children, possibleChild);
       }
    }
    return found;
  }
}
