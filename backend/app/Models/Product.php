<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'sale_price',
        'sku',
        'stock',
        'status',
    ];

    /* Auto slug + SKU */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($product) {
            $product->slug = Str::slug($product->name);
            $product->sku = strtoupper(Str::random(8));
        });
    }

    /* Product belongs to category */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /* Product belongs to vendor */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
