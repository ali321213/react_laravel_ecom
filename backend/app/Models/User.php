<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    /* The attributes that are mass assignable */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'status',
        'last_login_at',
        'last_login_ip',
    ];

    /* The attributes that should be hidden for serialization */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /* The attributes that should be cast */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at'     => 'datetime',
    ];

    /* --------------------- RELATIONSHIPS --------------------- */

    // User → Vendor (One to One)
    public function vendor()
    {
        return $this->hasOne(Vendor::class);
    }

    // User → Orders (One to Many)
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // User → Addresses (One to Many)
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    // User → Reviews (One to Many)
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // User → Wishlist (One to Many)
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    /* --------------------- ACCESSORS & HELPERS --------------------- */

    // Check if user is admin
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    // Check if user is vendor
    public function isVendor(): bool
    {
        return $this->hasRole('vendor');
    }

    // Check if user is customer
    public function isCustomer(): bool
    {
        return $this->hasRole('customer');
    }

    // Check if user is active
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /* ---------------- MODEL EVENTS (OPTIONAL BUT PRO) ---------------- */
    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->status)) {
                $user->status = 'active';
            }
        });
    }
}
