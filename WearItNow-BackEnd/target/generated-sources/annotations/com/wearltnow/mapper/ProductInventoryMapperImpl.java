package com.wearltnow.mapper;

import com.wearltnow.dto.request.product.ProductInventoryCreationRequest;
import com.wearltnow.dto.request.product.ProductInventoryUpdationRequest;
import com.wearltnow.dto.response.product.ProductInventoryResponse;
import com.wearltnow.model.Product;
import com.wearltnow.model.ProductInventory;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class ProductInventoryMapperImpl implements ProductInventoryMapper {

    @Override
    public ProductInventory toProductInventory(ProductInventoryCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        ProductInventory.ProductInventoryBuilder productInventory = ProductInventory.builder();

        productInventory.color( request.getColor() );
        productInventory.purchasePrice( request.getPurchasePrice() );
        productInventory.quantity( request.getQuantity() );
        productInventory.size( request.getSize() );

        return productInventory.build();
    }

    @Override
    public ProductInventoryResponse toProductInventoryResponse(ProductInventory request) {
        if ( request == null ) {
            return null;
        }

        ProductInventoryResponse.ProductInventoryResponseBuilder productInventoryResponse = ProductInventoryResponse.builder();

        productInventoryResponse.productId( requestProductProductId( request ) );
        productInventoryResponse.color( request.getColor() );
        productInventoryResponse.productInventoryId( request.getProductInventoryId() );
        productInventoryResponse.purchasePrice( request.getPurchasePrice() );
        productInventoryResponse.quantity( request.getQuantity() );
        productInventoryResponse.size( request.getSize() );

        productInventoryResponse.totalPrice( calculateTotalPrice(request.getQuantity(), request.getPurchasePrice()) );

        return productInventoryResponse.build();
    }

    @Override
    public void updateProductInventory(ProductInventory productInventory, ProductInventoryUpdationRequest request) {
        if ( request == null ) {
            return;
        }

        productInventory.setColor( request.getColor() );
        productInventory.setPurchasePrice( request.getPurchasePrice() );
        productInventory.setQuantity( request.getQuantity() );
        productInventory.setSize( request.getSize() );
    }

    private Long requestProductProductId(ProductInventory productInventory) {
        if ( productInventory == null ) {
            return null;
        }
        Product product = productInventory.getProduct();
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
