<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private PaymentService $paymentService)
    {
    }

    public function pay(Request $request, int $orderId): JsonResponse
    {
        $order = Order::findOrFail($orderId);

        $this->authorize('view', $order); // reutiliza a OrderPolicy — só o dono ou admin

        $payment = $this->paymentService->pay($order);

        $status = $payment->status === 'approved' ? 201 : 422;

        return response()->json($payment, $status);
    }
}