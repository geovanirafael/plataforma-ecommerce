<?php

namespace App\Services\Payment;

class MockPaymentGateway implements PaymentGatewayInterface
{
    public function charge(float $amount, string $reference): PaymentResult
    {
        // Simulação: em ambiente real, aqui haveria uma chamada HTTP
        // a um gateway externo (Stripe, PayPal, Multicaixa Express, etc.)
        // Simulamos aprovação automática — falha só se o valor for <= 0.

        if ($amount <= 0) {
            return new PaymentResult(
                success: false,
                reference: $reference,
                failureReason: 'Valor inválido para cobrança.',
            );
        }

        return new PaymentResult(
            success: true,
            reference: $reference,
        );
    }
}