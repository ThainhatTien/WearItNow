package com.wearltnow.mapper;

import com.wearltnow.dto.request.price.PriceRequest;
import com.wearltnow.dto.response.price.PriceResponse;
import com.wearltnow.model.Price;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class PriceMapperImpl implements PriceMapper {

    @Override
    public Price toEntity(PriceRequest priceRequestDto) {
        if ( priceRequestDto == null ) {
            return null;
        }

        Price.PriceBuilder price = Price.builder();

        price.code( priceRequestDto.getCode() );
        price.endDate( priceRequestDto.getEndDate() );
        price.name( priceRequestDto.getName() );
        price.startDate( priceRequestDto.getStartDate() );

        return price.build();
    }

    @Override
    public PriceResponse toResponse(Price price) {
        if ( price == null ) {
            return null;
        }

        PriceResponse.PriceResponseBuilder priceResponse = PriceResponse.builder();

        priceResponse.code( price.getCode() );
        priceResponse.endDate( price.getEndDate() );
        priceResponse.id( price.getId() );
        priceResponse.name( price.getName() );
        priceResponse.startDate( price.getStartDate() );

        return priceResponse.build();
    }
}
