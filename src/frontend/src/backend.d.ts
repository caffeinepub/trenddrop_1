import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductInput {
    isOnSale: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    badge?: string;
    salePrice?: number;
    rating: number;
    price: number;
    reviewCount: bigint;
    isTrending: boolean;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: string;
    isOnSale: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    badge?: string;
    salePrice?: number;
    rating: number;
    price: number;
    reviewCount: bigint;
    isTrending: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addNewsletterEmail(email: string): Promise<void>;
    addProduct(productInput: ProductInput): Promise<void>;
    addSampleProducts(): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getNewsletterEmails(): Promise<Array<string>>;
    getProduct(productId: string): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeProduct(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(productId: string, productInput: ProductInput): Promise<void>;
}
