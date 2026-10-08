<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Services\Payment\PaymentGatewayInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    public function __construct(private PaymentGatewayInterface $gateway)
    {
    }

    public function pay(Order $order): Payment
    {
        if ($order->status !== 'pending') {
            throw ValidationException::withMessages([
                'order' => "Este pedido não pode ser pago (status atual: \"{$order->status}\").",
            ]);
        }

        $reference = 'ORD-' . $order->id . '-' . Str::random(8);
        $result = $this->gateway->charge((float) $order->total, $reference);

        return DB::transaction(function () use ($order, $result) {
            $payment = Payment::create([
                'order_id' => $order->id,
                'provider' => 'mock',
                'status' => $result->success ? 'approved' : 'failed',
                'amount' => $order->total,
            ]);

            if ($result->success) {
                $order->update(['status' => 'paid']);
            } else {
                // Pagamento recusado de forma definitiva: liberta o stock reservado
                foreach ($order->items as $item) {
                    $item->product()->increment('stock', $item->quantity);
                }
                $order->update(['status' => 'cancelled']);
            }

            return $payment;
        });
    }
}