export type User = {
    id: string;
    name: string;
    email: string;
}

export type Component = {
    _id: string;
    image: string;
    component: string;
    category: string;
    inStock: number;
    inUse: number;
}

export type Request = {
    _id: string;
    inventoryId: string;
    component: string;
    image: string;
    name: string;
    email: string;
    phone: string;
    purpose: string;
    quantity: number;
    date: string;
    status: string;
    returned: boolean;
}