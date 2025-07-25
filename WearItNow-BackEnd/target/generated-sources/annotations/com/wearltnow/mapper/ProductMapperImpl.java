package com.wearltnow.mapper;

import com.wearltnow.dto.request.product.ProductCreationRequest;
import com.wearltnow.dto.request.product.ProductUpdateRequest;
import com.wearltnow.dto.response.category.CategoryResponse;
import com.wearltnow.dto.response.category.SubCategoryResponse;
import com.wearltnow.dto.response.product.ProductImageResponse;
import com.wearltnow.dto.response.product.ProductInventoryResponse;
import com.wearltnow.dto.response.product.ProductResponse;
import com.wearltnow.dto.response.product.ProductSlugCategoryResponse;
import com.wearltnow.dto.response.supplier.SupplierResponse;
import com.wearltnow.model.Category;
import com.wearltnow.model.Product;
import com.wearltnow.model.ProductImage;
import com.wearltnow.model.ProductInventory;
import com.wearltnow.model.Supplier;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-14T21:11:29+0700",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public Product toProduct(ProductCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Product.ProductBuilder product = Product.builder();

        product.name( request.getName() );
        product.description( request.getDescription() );
        if ( request.getPrice() != null ) {
            product.price( request.getPrice().doubleValue() );
        }

        return product.build();
    }

    @Override
    public ProductResponse toProductResponse(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductResponse.ProductResponseBuilder productResponse = ProductResponse.builder();

        productResponse.images( productImageListToProductImageResponseList( product.getProductImages() ) );
        productResponse.inventories( productInventoryListToProductInventoryResponseList( product.getProductInventories() ) );
        productResponse.category( categoryToCategoryResponse( product.getCategory() ) );
        productResponse.productId( product.getProductId() );
        productResponse.name( product.getName() );
        productResponse.image( product.getImage() );
        productResponse.description( product.getDescription() );

        return productResponse.build();
    }

    @Override
    public ProductSlugCategoryResponse toProductSlugCategoryResponse(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductSlugCategoryResponse.ProductSlugCategoryResponseBuilder productSlugCategoryResponse = ProductSlugCategoryResponse.builder();

        productSlugCategoryResponse.category( categoryToCategoryResponse( product.getCategory() ) );
        productSlugCategoryResponse.inventories( productInventoryListToProductInventoryResponseList( product.getProductInventories() ) );
        productSlugCategoryResponse.productId( product.getProductId() );
        productSlugCategoryResponse.name( product.getName() );
        productSlugCategoryResponse.image( product.getImage() );
        productSlugCategoryResponse.description( product.getDescription() );

        return productSlugCategoryResponse.build();
    }

    @Override
    public void updateProduct(Product product, ProductUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        product.setName( request.getName() );
        product.setDescription( request.getDescription() );
        if ( request.getPrice() != null ) {
            product.setPrice( request.getPrice().doubleValue() );
        }
        else {
            product.setPrice( null );
        }
    }

    protected ProductImageResponse productImageToProductImageResponse(ProductImage productImage) {
        if ( productImage == null ) {
            return null;
        }

        ProductImageResponse.ProductImageResponseBuilder productImageResponse = ProductImageResponse.builder();

        productImageResponse.imageId( productImage.getImageId() );
        productImageResponse.imageUrl( productImage.getImageUrl() );

        return productImageResponse.build();
    }

    protected List<ProductImageResponse> productImageListToProductImageResponseList(List<ProductImage> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductImageResponse> list1 = new ArrayList<ProductImageResponse>( list.size() );
        for ( ProductImage productImage : list ) {
            list1.add( productImageToProductImageResponse( productImage ) );
        }

        return list1;
    }

    protected ProductInventoryResponse productInventoryToProductInventoryResponse(ProductInventory productInventory) {
        if ( productInventory == null ) {
            return null;
        }

        ProductInventoryResponse.ProductInventoryResponseBuilder productInventoryResponse = ProductInventoryResponse.builder();

        productInventoryResponse.productInventoryId( productInventory.getProductInventoryId() );
        productInventoryResponse.color( productInventory.getColor() );
        productInventoryResponse.size( productInventory.getSize() );
        productInventoryResponse.quantity( productInventory.getQuantity() );
        productInventoryResponse.purchasePrice( productInventory.getPurchasePrice() );

        return productInventoryResponse.build();
    }

    protected List<ProductInventoryResponse> productInventoryListToProductInventoryResponseList(List<ProductInventory> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductInventoryResponse> list1 = new ArrayList<ProductInventoryResponse>( list.size() );
        for ( ProductInventory productInventory : list ) {
            list1.add( productInventoryToProductInventoryResponse( productInventory ) );
        }

        return list1;
    }

    protected List<SubCategoryResponse> categoryListToSubCategoryResponseList(List<Category> list) {
        if ( list == null ) {
            return null;
        }

        List<SubCategoryResponse> list1 = new ArrayList<SubCategoryResponse>( list.size() );
        for ( Category category : list ) {
            list1.add( categoryToSubCategoryResponse( category ) );
        }

        return list1;
    }

    protected SubCategoryResponse categoryToSubCategoryResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        SubCategoryResponse.SubCategoryResponseBuilder subCategoryResponse = SubCategoryResponse.builder();

        subCategoryResponse.categoryId( category.getCategoryId() );
        subCategoryResponse.name( category.getName() );
        subCategoryResponse.slug( category.getSlug() );
        subCategoryResponse.subCategories( categoryListToSubCategoryResponseList( category.getSubCategories() ) );

        return subCategoryResponse.build();
    }

    protected SupplierResponse supplierToSupplierResponse(Supplier supplier) {
        if ( supplier == null ) {
            return null;
        }

        SupplierResponse.SupplierResponseBuilder supplierResponse = SupplierResponse.builder();

        supplierResponse.supplierId( supplier.getSupplierId() );
        supplierResponse.description( supplier.getDescription() );
        supplierResponse.email( supplier.getEmail() );
        supplierResponse.contactPerson( supplier.getContactPerson() );
        supplierResponse.name( supplier.getName() );
        supplierResponse.website( supplier.getWebsite() );
        supplierResponse.phone( supplier.getPhone() );
        supplierResponse.taxCode( supplier.getTaxCode() );

        return supplierResponse.build();
    }

    protected CategoryResponse categoryToCategoryResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryResponse.CategoryResponseBuilder categoryResponse = CategoryResponse.builder();

        categoryResponse.categoryId( category.getCategoryId() );
        categoryResponse.name( category.getName() );
        categoryResponse.image( category.getImage() );
        categoryResponse.description( category.getDescription() );
        categoryResponse.status( category.getStatus() );
        categoryResponse.slug( category.getSlug() );
        categoryResponse.subCategories( categoryListToSubCategoryResponseList( category.getSubCategories() ) );
        categoryResponse.supplier( supplierToSupplierResponse( category.getSupplier() ) );

        return categoryResponse.build();
    }
}
