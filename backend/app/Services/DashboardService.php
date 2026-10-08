<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    public function totalSales(): float
    {
        return Cache::remember('dashboard.total_sales', now()->addMinutes(5), function () {
            return (float) Order::where('status', 'paid')->sum('total');
        });
    }

    public function ordersByStatus(): array
    {
        return Cache::remember('dashboard.orders_by_status', now()->addMinutes(5), function () {
            return Order::selectRaw('status, count(*) as status_count')
                ->groupBy('status')
                ->pluck('status_count', 'status')
                ->toArray();
        });
    }

    public function topProducts(int $limit = 5): array
    {
        return Cache::remember("dashboard.top_products.{$limit}", now()->addMinutes(15), function () use ($limit) {
            return OrderItem::selectRaw('product_id, SUM(quantity) as total_sold')
                ->groupBy('product_id')
                ->orderByDesc('total_sold')
                ->limit($limit)
                ->with('product:id,name,price')
                ->get()
                ->map(fn ($item) => [
                    'product_id' => $item->product_id,
                    'name' => $item->product->name ?? 'Produto removido',
                    'total_sold' => (int) $item->total_sold,
                ])
                ->toArray();
        });
    }

    public function lowStockProducts(int $threshold = 5): array
    {
        return Product::where('stock', '<=', $threshold)
            ->select('id', 'name', 'stock')
            ->orderBy('stock')
            ->get()
            ->toArray();
    }

    public function recentOrders(int $limit = 10): array
    {
        return Order::with('user:id,name,email')
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function summary(): array
    {
        return [
            'total_sales' => $this->totalSales(),
            'orders_by_status' => $this->ordersByStatus(),
            'top_products' => $this->topProducts(),
            'low_stock_products' => $this->lowStockProducts(),
            'recent_orders' => $this->recentOrders(),
        ];
    }
}