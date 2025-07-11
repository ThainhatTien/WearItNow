export interface DiscountCode {
    id: number;
    code: string;
    amount: number;
    type: 'PERCENTAGE' | 'FIXED';
    usageLimit: number;
    startDate: string;
    endDate: string;
    userGroupId: number;
    status: 'ACTIVE' | 'INACTIVE';
}