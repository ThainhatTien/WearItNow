import { Category } from "types/CategoryType";

export interface Supplier {
  supplierId: number;
  description?: string; // Thêm dấu ? để làm tuỳ chọn
  email: string;
  contactPerson?: string; // Thêm dấu ? để làm tuỳ chọn
  name: string;
  website?: string; // Thêm dấu ? để làm tuỳ chọn
  phone: string;
  taxCode: string;
  categories?: Category[];
}
