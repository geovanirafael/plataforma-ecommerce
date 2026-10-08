<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Validation\ValidationException;

class CartService
{
    public function getOrCreate(int $userId): Cart
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        return $cart->load('items.product');
    }

    public function addItem(int $userId, int $productId, int $quantity): Cart
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $product = Product::findOrFail($productId);

        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->first();

        $newQuantity = $quantity + ($existingItem->quantity ?? 0);

        if ($newQuantity > $product->stock) {
            throw ValidationException::withMessages([
                'quantity' => "Quantidade solicitada excede o stock disponível ({$product->stock}).",
            ]);
        }

        if ($existingItem) {
            $existingItem->update(['quantity' => $newQuantity]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return $cart->load('items.product');
    }

    public function updateItemQuantity(int $userId, int $itemId, int $quantity): Cart
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        $item = CartItem::where('cart_id', $cart->id)->findOrFail($itemId);

        if ($quantity > $item->product->stock) {
            throw ValidationException::withMessages([
                'quantity' => "Quantidade solicitada excede o stock disponível ({$item->product->stock}).",
            ]);
        }

        $item->update(['quantity' => $quantity]);

        return $cart->load('items.product');
    }

    public function removeItem(int $userId, int $itemId): Cart
    {
        $cart = Cart::firstOrCreate(['user_id' => $userId]);
        CartItem::where('cart_id', $cart->id)->findOrFail($itemId)->delete();

        return $cart->load('items.product');
    }
}