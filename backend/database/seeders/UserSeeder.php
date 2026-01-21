<?php

namespace Database\Seeders;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ------------------ Create Roles (if not exists) ------------------
        $adminRole    = Role::firstOrCreate(['name' => 'admin']);
        $vendorRole   = Role::firstOrCreate(['name' => 'vendor']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);

        // ------------------ Admin User ------------------
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );

        $admin->assignRole($adminRole);

        // ------------------ Vendor User ------------------
        $vendorUser = User::firstOrCreate(
            ['email' => 'vendor@example.com'],
            [
                'name' => 'Demo Vendor',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );

        $vendorUser->assignRole($vendorRole);

        // Vendor profile
        Vendor::firstOrCreate(
            ['user_id' => $vendorUser->id],
            [
                'store_name' => 'Demo Store',
                'store_slug' => 'demo-store',
                'commission_percentage' => 10,
                'status' => 'approved',
            ]
        );

        // ------------------ Customer User ------------------
        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Demo Customer',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );

        $customer->assignRole($customerRole);
    }
}
