export class OfficeTreeNode {
    name: string
    id:number
    levelName?:string
    children?: OfficeTreeNode[]   
    constructor() {
        
    }
}

export class OfficeFlatNode {
    expandable: boolean
    name: string
    level: number
    id:number
    hasChild:boolean
  }

  export class OfficeHierarchy{
    hierarchyLevel:string;
    hierarchyType:string='OAF';
    descendant?:OfficeHierarchy[]
  }
  export class OfficeHierarchyFlatNode {
    expandable: boolean
    hierarchyLevel: string
    level: number
    id:number
    hasChild:boolean
  }