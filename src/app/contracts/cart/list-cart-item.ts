export class ListCartItem {
    cartItemId: string;
    productId: string;
    productName: string;
    productLink?: string;
    brandName?: string;
    brandCode?: number;
    isActive: boolean;
    price: number;
    quantity: number;
    imagePath?: string;
}
