package com.wearltnow.mapper;

import com.wearltnow.dto.response.product.ProductCommentResponse;
import com.wearltnow.model.Product;
import com.wearltnow.model.ProductComment;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class ProductCommentMapperImpl implements ProductCommentMapper {

    @Override
    public ProductCommentResponse toResponse(ProductComment productComment) {
        if ( productComment == null ) {
            return null;
        }

        ProductCommentResponse.ProductCommentResponseBuilder productCommentResponse = ProductCommentResponse.builder();

        productCommentResponse.commentId( productComment.getId() );
        productCommentResponse.productId( productCommentProductProductId( productComment ) );
        productCommentResponse.userId( mapUserToUserId( productComment.getUser() ) );
        productCommentResponse.content( productComment.getContent() );
        productCommentResponse.createdAt( productComment.getCreatedAt() );
        productCommentResponse.parentId( productComment.getParentId() );
        productCommentResponse.rate( productComment.getRate() );

        return productCommentResponse.build();
    }

    private Long productCommentProductProductId(ProductComment productComment) {
        if ( productComment == null ) {
            return null;
        }
        Product product = productComment.getProduct();
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
