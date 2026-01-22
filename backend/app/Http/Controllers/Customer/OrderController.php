<?php

namespace App\Http\Controllers\Customer;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use DB;

class OrderController extends Controller
{
    /**
     * Customer orders
     */
    public function index(Request $request)
    {
        return $request->user()->orders()->with('items')->latest()->paginate(10);
    }

    /**
     * Place order (Multi-vendor)
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'payment_method'     => 'required|in:cod,stripe,paypal',
        ]);

        return DB::transaction(function () use ($request, $data) {
            $total = 0;
            $order = Order::create([
                'user_id'        => $request->user()->id,
                'order_number'   => 'ORD-' . strtoupper(Str::random(8)),
                'total_amount'   => 0,
                'payment_method' => $data['payment_method'],
            ]);
            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $product->price * $item['quantity'];
                $total += $subtotal;
                OrderItem::create([
                    'order_id'  => $order->id,
                    'vendor_id' => $product->vendor_id,
                    'product_id'=> $product->id,
                    'price'     => $product->price,
                    'quantity'  => $item['quantity'],
                    'subtotal'  => $subtotal,
                ]);
            }

            $order->update(['total_amount' => $total]);
            return response()->json($order->load('items'), 201);
        });
    }
}
