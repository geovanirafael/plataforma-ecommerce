<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    private const array VALID_TRANSITIONS = [
        'pending' => ['paid', 'cancelled'],
        'paid' => ['shipped'],
        'shipped' => [],
        'cancelled' => [],
    ];

    public function checkout(int $userId): Order
    {
        $cart = Cart::with('items.product')->where('user_id', $userId)->first();

        if (! $cart || $cart->items->isEmpty()) {
            throw ValidationException::withMessages([
                'cart' => 'O carrinho está vazio.',
            ]);
        }

        return DB::transaction(function () use ($cart, $userId) {
            $total = 0;
            $orderItemsData = [];

            foreach ($cart->items as $cartItem) {
                // lockForUpdate: garante exclusividade sobre esta linha até a transação terminar
                $product = Product::lockForUpdate()->findOrFail($cartItem->product_id);

                if ($product->stock < $cartItem->quantity) {
                    throw new InsufficientStockException($product->name, $product->stock);
                }

                $product->decrement('stock', $cartItem->quantity);

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $product->price, // preço congelado no momento da compra
                ];

                $total += $product->price * $cartItem->quantity;
            }

            $order = Order::create([
                'user_id' => $userId,
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($orderItemsData as $itemData) {
                OrderItem::create([...$itemData, 'order_id' => $order->id]);
            }

            $cart->items()->delete();

            return $order->load('items.product');
        });
    }

    public function listForUser(int $userId): Collection
    {
        return Order::with('items.product')->where('user_id', $userId)->latest()->get();
    }

    public function listAll(): Collection
    {
        return Order::with('items.product', 'user')->latest()->get();
    }

    public function findOrFail(int $id): Order
    {
        return Order::with('items.product', 'user')->findOrFail($id);
    }

    public function updateStatus(Order $order, string $newStatus): Order
    {
        $allowed = self::VALID_TRANSITIONS[$order->status] ?? [];

        if (! in_array($newStatus, $allowed, true)) {
            throw ValidationException::withMessages([
                'status' => "Transição de \"{$order->status}\" para \"{$newStatus}\" não é permitida.",
            ]);
        }

        $order->update(['status' => $newStatus]);

        return $order;
    }
}