<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'unit_price' => (float) $item->product->price,
                'quantity' => $item->quantity,
                'subtotal' => (float) $item->product->price * $item->quantity,
            ];
        });

        return [
            'id' => $this->id,
            'items' => $items,
            'total' => (float) $items->sum('subtotal'),
        ];
    }
}