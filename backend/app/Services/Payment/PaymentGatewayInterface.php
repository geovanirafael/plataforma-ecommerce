<?php

namespace App\Services\Payment;

interface PaymentGatewayInterface
{
    public function charge(float $amount, string $reference): PaymentResult;
}