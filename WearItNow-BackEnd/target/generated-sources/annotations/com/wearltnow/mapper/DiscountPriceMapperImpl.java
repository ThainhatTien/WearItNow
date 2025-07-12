package com.wearltnow.mapper;

import com.wearltnow.dto.request.discount_price.DiscountPriceRequest;
import com.wearltnow.dto.response.category.CategoryResponse;
import com.wearltnow.dto.response.category.SubCategoryResponse;
import com.wearltnow.dto.response.discount_price.DiscountPriceResponse;
import com.wearltnow.dto.response.product.ProductInventoryResponse;
import com.wearltnow.dto.response.product.ProductResponse;
import com.wearltnow.dto.response.supplier.SupplierResponse;
import com.wearltnow.model.Category;
import com.wearltnow.model.DiscountPrice;
import com.wearltnow.model.Product;
import com.wearltnow.model.ProductInventory;
import com.wearltnow.model.Supplier;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class DiscountPriceMapperImpl implements DiscountPriceMapper {

    @Override
    public DiscountPrice toEntity(DiscountPriceRequest request) {
        if ( request == null ) {
            return null;
        }

        DiscountPrice.DiscountPriceBuilder discountPrice = DiscountPrice.builder();

        discountPrice.product( discountPriceRequestToProduct( request ) );
        discountPrice.discountRate( request.getDiscountRate() );
        discountPrice.endDate( request.getEndDate() );
        discountPrice.startDate( request.getStartDate() );

        return discountPrice.build();
    }

    @Override
    public void updateDiscountPrice(DiscountPrice discountPrice, DiscountPriceRequest request) {
        if ( request == null ) {
            return;
        }

        discountPrice.setDiscountRate( request.getDiscountRate() );
        discountPrice.setEndDate( request.getEndDate() );
        discountPrice.setStartDate( request.getStartDate() );
    }

    @Override
    public DiscountPriceResponse toResponse(DiscountPrice discountPrice) {
        if ( discountPrice == null ) {
            return null;
        }

        DiscountPriceResponse discountPriceResponse = new DiscountPriceResponse();

        discountPriceResponse.setProduct( productToProductResponse( discountPrice.getProduct() ) );
        discountPriceResponse.setProductId( discountPriceProductProductId( discountPrice ) );
        discountPriceResponse.setDiscountRate( discountPrice.getDiscountRate() );
        discountPriceResponse.setEndDate( discountPrice.getEndDate() );
        discountPriceResponse.setId( discountPrice.getId() );
        discountPriceResponse.setStartDate( discountPrice.getStartDate() );

        return discountPriceResponse;
    }

    protected Product discountPriceRequestToProduct(DiscountPriceRequest discountPriceRequest) {
        if ( discountPriceRequest == null ) {
            return null;
        }

        Product.ProductBuilder product = Product.builder();

        product.productId( discountPriceRequest.getProductId() );

        return product.build();
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

    protected CategoryResponse categoryToCategoryResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryResponse.CategoryResponseBuilder categoryResponse = CategoryResponse.builder();

        categoryResponse.categoryId( category.getCategoryId() );
        categoryResponse.description( category.getDescription() );
        categoryResponse.image( category.getImage() );
        categoryResponse.name( category.getName() );
        categoryResponse.slug( category.getSlug() );
        categoryResponse.status( category.getStatus() );
        categoryResponse.subCategories( categoryListToSubCategoryResponseList( category.getSubCategories() ) );
        categoryResponse.supplier( supplierToSupplierResponse( category.getSupplier() ) );

        return categoryResponse.build();
    }

    protected ProductInventoryResponse productInventoryToProductInventoryResponse(ProductInventory productInventory) {
        if ( productInventory == null ) {
            return null;
        }

        ProductInventoryResponse.ProductInventoryResponseBuilder productInventoryResponse = ProductInventoryResponse.builder();

        productInventoryResponse.color( productInventory.getColor() );
        productInventoryResponse.productInventoryId( productInventory.getProductInventoryId() );
        productInventoryResponse.purchasePrice( productInventory.getPurchasePrice() );
        productInventoryResponse.quantity( productInventory.getQuantity() );
        productInventoryResponse.size( productInventory.getSize() );

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

    protected ProductResponse productToProductResponse(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductResponse.ProductResponseBuilder productResponse = ProductResponse.builder();

        productResponse.name( product.getName() );
        productResponse.price( product.getPrice() );
        productResponse.description( product.getDescription() );
        productResponse.category( categoryToCategoryResponse( product.getCategory() ) );
        productResponse.image( product.getImage() );
        productResponse.inventories( productInventoryListToProductInventoryResponseList( product.getProductInventories() ) );
        productResponse.productId( product.getProductId() );

        return productResponse.build();
    }

    private Long discountPriceProductProductId(DiscountPrice discountPrice) {
        if ( discountPrice == null ) {
            return null;
        }
        Product product = discountPrice.getProduct();
        if ( product == null ) {
            return null;
        }
        Long productId = product.getProductId();
        if ( productId == null ) {
            return null;
        }
        return productId;
    }
}
