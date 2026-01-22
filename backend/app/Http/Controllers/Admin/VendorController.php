<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Models\User;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * List all vendors
     */
    public function index()
    {
        return Vendor::with('user')->latest()->paginate(15);
    }

    /**
     * Approve / Update vendor
     */
    public function update(Request $request, Vendor $vendor)
    {
        $data = $request->validate([
            'commission_percentage' => 'required|numeric|min:0|max:100',
            'status' => 'required|in:approved,rejected,suspended',
        ]);
        $vendor->update($data);
        return response()->json([
            'message' => 'Vendor updated successfully',
            'vendor'  => $vendor,
        ]);
    }

    /**
     * Delete vendor
     */
    public function destroy(Vendor $vendor)
    {
        $vendor->delete();
        return response()->json(['message' => 'Vendor deleted']);
    }
}
