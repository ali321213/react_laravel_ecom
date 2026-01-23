<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'store_name',
        'store_slug',
        'store_description',
        'logo',
        'commission_percentage',
        'status',
    ];

    /* Auto-generate store slug */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($vendor) {
            if (empty($vendor->store_slug)) {
                $vendor->store_slug = Str::slug($vendor->store_name);
            }
        });
    }

    /* Vendor belongs to a user (account) */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /* Vendor has many products */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /* Vendor orders (optional but recommended later) */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /* Scope: only approved vendors */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}
