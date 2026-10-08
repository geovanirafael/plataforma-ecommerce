<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientStockException;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService)
    {
    }

    public function checkout(Request $request): JsonResponse
    {
        try {
            $order = $this->orderService->checkout($request->user()->id);
        } catch (InsufficientStockException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json($order, 201);
    }

    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()->role === 'admin'
            ? $this->orderService->listAll()
            : $this->orderService->listForUser($request->user()->id);

        return response()->json($orders);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $order = $this->orderService->findOrFail($id);

        $this->authorize('view', $order);

        return response()->json($order);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => 'required|in:pending,paid,shipped,cancelled',
        ]);

        $order = $this->orderService->findOrFail($id);

        return response()->json($this->orderService->updateStatus($order, $data['status']));
    }
}