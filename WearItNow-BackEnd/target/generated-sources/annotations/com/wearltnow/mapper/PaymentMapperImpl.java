package com.wearltnow.mapper;

import com.wearltnow.dto.request.payment.PaymentRequest;
import com.wearltnow.model.Payment;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-14T21:11:29+0700",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 23.0.2 (Oracle Corporation)"
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
