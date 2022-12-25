import { List_Product_Image } from "./list_product_Image";

export class List_Product {
    id: string = "";
    name: string = "";
    amountOfStock: number = 0;
    price: number = 0;
    brandCode: number = 1;
    productImageFiles?: List_Product_Image[] = new List_Product_Image[0];
    createdDate: Date = new Date();
    updatedDate: Date = new Date();
    imagePath?: string;
}