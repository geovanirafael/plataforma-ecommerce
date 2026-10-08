<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private CartService $cartService)
    {
    }

    public function show(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreate($request->user()->id);

        return response()->json(new CartResource($cart));
    }

    public function addItem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->cartService->addItem($request->user()->id, $data['product_id'], $data['quantity']);

        return response()->json(new CartResource($cart), 201);
    }

    public function updateItem(Request $request, int $itemId): JsonResponse
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->cartService->updateItemQuantity($request->user()->id, $itemId, $data['quantity']);

        return response()->json(new CartResource($cart));
    }

    public function removeItem(Request $request, int $itemId): JsonResponse
    {
        $cart = $this->cartService->removeItem($request->user()->id, $itemId);

        return response()->json(new CartResource($cart));
    }
}