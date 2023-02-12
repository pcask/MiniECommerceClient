export class UserAddress {
    id?:string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    provinceId: number;
    provinceName:string;
    districtId: number;
    districtName:string;
    neighborhoodId: number;
    neighborhoodName:string;
    zipCode:number;
    addressDetail: string;
    addressTitle: string;
    tin?: string;
    taxOffice?: string;
    companyName?: string;
    isEInvoicePayer?: boolean;
    showcase:boolean;
}