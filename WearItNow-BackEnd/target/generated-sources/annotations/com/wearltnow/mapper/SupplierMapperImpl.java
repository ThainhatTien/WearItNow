package com.wearltnow.mapper;

import com.wearltnow.dto.request.supplier.SupplierCreationRequest;
import com.wearltnow.dto.request.supplier.SupplierUpdateRequest;
import com.wearltnow.dto.response.supplier.SupplierResponse;
import com.wearltnow.model.Supplier;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class SupplierMapperImpl implements SupplierMapper {

    @Override
    public Supplier toSupplier(SupplierCreationRequest supplier) {
        if ( supplier == null ) {
            return null;
        }

        Supplier.SupplierBuilder supplier1 = Supplier.builder();

        supplier1.contactPerson( supplier.getContactPerson() );
        supplier1.description( supplier.getDescription() );
        supplier1.email( supplier.getEmail() );
        supplier1.name( supplier.getName() );
        supplier1.phone( supplier.getPhone() );
        supplier1.taxCode( supplier.getTaxCode() );
        supplier1.website( supplier.getWebsite() );

        return supplier1.build();
    }

    @Override
    public SupplierResponse toSupplierResponse(Supplier supplier) {
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

    @Override
    public void updateSupplier(Supplier supplier, SupplierUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        supplier.setContactPerson( request.getContactPerson() );
        supplier.setDescription( request.getDescription() );
        supplier.setEmail( request.getEmail() );
        supplier.setName( request.getName() );
        supplier.setPhone( request.getPhone() );
        supplier.setTaxCode( request.getTaxCode() );
        supplier.setWebsite( request.getWebsite() );
    }
}
