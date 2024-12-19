export class OfficeDataModel {

    id: number;
    name: string;
    nameDecorated: string;
    openingDate: any;
    status: boolean;
    hierarchy: string;
    parentId: number;
    parentName: string;
    isCountry: boolean;
    officeCountryId: number;
    officeCountryName: string;
    officeCountryHierarchyId: number;
    officeCountryHierarchyLevelName: string;
    isLowestOffice: boolean;
}

export class CountryResponseModel {
    id: number;
    name: string;
    openingDate: any;
    status: boolean;
}