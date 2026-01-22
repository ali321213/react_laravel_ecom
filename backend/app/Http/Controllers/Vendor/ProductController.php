<?php

namespace App\Http\Controllers\Vendor;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /* Vendor products only */
    public function index(Request $request)
    {
        $vendor = $request->user()->vendor;
        return Product::where('vendor_id', $vendor->id)->latest()->paginate(15);
    }

    /* Create product */
    public function store(Request $request)
    {
        $vendor = $request->user()->vendor;
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'category_id'=> 'required|exists:categories,id',
            'description'=> 'required',
            'price'       => 'required|numeric',
            'sale_price'  => 'nullable|numeric',
            'stock'       => 'required|integer|min:0',
        ]);
        $product = Product::create([
            ...$data,
            'vendor_id' => $vendor->id,
            'slug'      => Str::slug($data['name']),
            'sku'       => strtoupper(Str::random(8)),
            'status'    => 'active',
        ]);
        return response()->json($product, 201);
    }

    /* Update product */
    public function update(Request $request, Product $product)
    {
        $this->authorize('update', $product);
        $product->update($request->only([
            'name', 'description', 'price', 'sale_price', 'stock', 'status'
        ]));
        return response()->json($product);
    }

    /* Delete product */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
