package com.wearltnow.mapper;

import com.wearltnow.dto.request.payment.PaymentRequest;
import com.wearltnow.model.Payment;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-13T00:42:22+0700",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class PaymentMapperImpl implements PaymentMapper {

    @Override
    public Payment toPayment(PaymentRequest paymentRequest) {
        if ( paymentRequest == null ) {
            return null;
        }

        Payment.PaymentBuilder payment = Payment.builder();

        return payment.build();
    }

    @Override
    public PaymentRequest toPaymentRequest(Payment payment) {
        if ( payment == null ) {
            return null;
        }

        PaymentRequest paymentRequest = new PaymentRequest();

        return paymentRequest;
    }
}
