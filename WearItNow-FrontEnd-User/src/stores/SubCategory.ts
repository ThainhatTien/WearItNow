export interface SubCategory {
    categoryId: number;
    name: string;
    image: string | null;
    description: string;
    status: boolean;
    slug: string;
    parentId: number | null;
    subCategories: SubCategory[];
}
  