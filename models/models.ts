export type User = {
    id: string;
    name: string;
    email: string;
}
export type Usage = {
    _id: string;
    project: boolean;
    name: string;
    email: string;
    phone: string;
    quantity: number;
}

export type Component = {
    _id: string;
    image: string;
    component: string;
    category: string;
    inStock: number;
    inUse: number;
    usedWhere: Usage[];
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
    returnedProject: string;
}

export type Project = {
    _id: string;
    title: string;
    leadName: string;
    leadEmail: string;
    image: string;
    completed: boolean;
    startDate: string;
    endDate: string;
}

export type userInventory = {
    _id: string;
    inventoryId: string;
    inventoryName: string;
    inventoryImage: string;
    quantity: string;
    purpose: string;
    returningData: string;
    returned: boolean;
    status: boolean;
}