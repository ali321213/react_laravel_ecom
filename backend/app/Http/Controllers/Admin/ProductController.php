<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a paginated list of all products (for admin).
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'vendor.user'])
            ->orderByDesc('created_at');
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }
        $perPage = (int) ($request->get('perPage', 10));
        return $query->paginate($perPage);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric',
            'stock'       => 'nullable|integer|min:0',
            'is_active'   => 'sometimes|boolean',
            'category_id' => 'nullable|exists:categories,id',
            'vendor_id'   => 'nullable|exists:vendors,id',
        ]);
        $product = new Product();
        $product->name        = $data['name'];
        $product->description = $data['description'] ?? null;
        $product->price       = $data['price'];
        $product->stock       = $data['stock'] ?? 0;
        $product->status      = ($data['is_active'] ?? true) ? 'active' : 'inactive';
        if (isset($data['category_id'])) {
            $product->category_id = $data['category_id'];
        }
        if (isset($data['vendor_id'])) {
            $product->vendor_id = $data['vendor_id'];
        }
        $product->save();
        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'vendor.user']);
        return response()->json($product);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price'       => 'sometimes|numeric',
            'stock'       => 'sometimes|integer|min={0}',
            'is_active'   => 'sometimes|boolean',
            'category_id' => 'sometimes|nullable|exists:categories,id',
            'vendor_id'   => 'sometimes|nullable|exists:vendors,id',
        ]);
        if (array_key_exists('is_active', $data)) {
            $data['status'] = $data['is_active'] ? 'active' : 'inactive';
            unset($data['is_active']);
        }
        $product->update($data);
        return response()->json($product->fresh(['category', 'vendor.user']));
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }

    /**
     * Toggle the status (active/inactive) for a product.
     */
    public function toggleStatus(Product $product)
    {
        $product->status = $product->status === 'active' ? 'inactive' : 'active';
        $product->save();
        return response()->json($product);
    }
}