package com.wearltnow.mapper;

import com.wearltnow.dto.request.category.CategoryCreationRequest;
import com.wearltnow.dto.response.category.CategoryResponse;
import com.wearltnow.dto.response.category.SubCategoryResponse;
import com.wearltnow.dto.response.supplier.SupplierResponse;
import com.wearltnow.model.Category;
import com.wearltnow.model.Supplier;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public Category toCategory(CategoryCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Category.CategoryBuilder category = Category.builder();

        category.description( request.getDescription() );
        category.name( request.getName() );
        category.slug( request.getSlug() );
        category.status( request.getStatus() );

        return category.build();
    }

    @Override
    public CategoryResponse toCategoryResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryResponse.CategoryResponseBuilder categoryResponse = CategoryResponse.builder();

        categoryResponse.parentId( categoryParentCategoryCategoryId( category ) );
        categoryResponse.categoryId( category.getCategoryId() );
        categoryResponse.description( category.getDescription() );
        categoryResponse.image( category.getImage() );
        categoryResponse.name( category.getName() );
        categoryResponse.slug( category.getSlug() );
        categoryResponse.status( category.getStatus() );
        categoryResponse.supplier( supplierToSupplierResponse( category.getSupplier() ) );

        categoryResponse.subCategories( mapSubCategories(category.getSubCategories()) );

        return categoryResponse.build();
    }

    @Override
    public SubCategoryResponse toSubCategoryResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        SubCategoryResponse.SubCategoryResponseBuilder subCategoryResponse = SubCategoryResponse.builder();

        subCategoryResponse.parentId( categoryParentCategoryCategoryId( category ) );
        subCategoryResponse.categoryId( category.getCategoryId() );
        subCategoryResponse.name( category.getName() );
        subCategoryResponse.slug( category.getSlug() );
        subCategoryResponse.subCategories( mapSubCategories( category.getSubCategories() ) );

        return subCategoryResponse.build();
    }

    @Override
    public void updateCategory(CategoryCreationRequest request, Category category) {
        if ( request == null ) {
            return;
        }

        category.setDescription( request.getDescription() );
        category.setName( request.getName() );
        category.setSlug( request.getSlug() );
        category.setStatus( request.getStatus() );
    }

    private Long categoryParentCategoryCategoryId(Category category) {
        if ( category == null ) {
            return null;
        }
        Category parentCategory = category.getParentCategory();
        if ( parentCategory == null ) {
            return null;
        }
        Long categoryId = parentCategory.getCategoryId();
        if ( categoryId == null ) {
            return null;
        }
        return categoryId;
    }

    protected SupplierResponse supplierToSupplierResponse(Supplier supplier) {
        if ( supplier == null ) {
            return null;
        }

        SupplierResponse.SupplierResponseBuilder supplierResponse = SupplierResponse.builder();

        supplierResponse.contactPerson( supplier.getContactPerson() );
        supplierResponse.description( supplier.getDescription() );
        supplierResponse.email( supplier.getEmail() );
        supplierResponse.name( supplier.getName() );
        supplierResponse.phone( supplier.getPhone() );
        supplierResponse.supplierId( supplier.getSupplierId() );
        supplierResponse.taxCode( supplier.getTaxCode() );
        supplierResponse.website( supplier.getWebsite() );

        return supplierResponse.build();
    }
}
