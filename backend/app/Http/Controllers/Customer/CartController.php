<?php

namespace App\Http\Controllers\Customer;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /* Get current user's cart */
    public function index(Request $request)
    {
        $cart = Cart::with('items.product.vendor.user')
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->first();

        return response()->json($cart);
    }

    /* Add product to cart */
    public function add(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $user = $request->user();
        $product = Product::with('vendor')->findOrFail($data['product_id']);

        // Get or create active cart
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'active']
        );

        // Check if product already in cart
        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($item) {
            $item->increment('quantity', $data['quantity'] ?? 1);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'vendor_id' => $product->vendor_id,
                'quantity' => $data['quantity'] ?? 1,
                'price' => $product->sale_price ?? $product->price,
            ]);
        }

        return response()->json(['message' => 'Added to cart']);
    }

    /* Update quantity */
    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        $cartItem->update(['quantity' => $request->quantity]);
        return response()->json(['message' => 'Cart updated']);
    }

    /* Remove item */
    public function remove(CartItem $cartItem)
    {
        $cartItem->delete();
        return response()->json(['message' => 'Item removed']);
    }

    public function count(Request $request)
    {
        $cart = Cart::where('user_id', $request->user()->id)
            ->where('status', 'active')->with('items')->first();
        $count = $cart ? $cart->items->sum('quantity') : 0;
        return response()->json([
            'count' => $count
        ]);
    }
}
