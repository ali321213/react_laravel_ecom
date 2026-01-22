<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Vendor;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Get all users with vendor role
        $vendorUsers = User::role('vendor')->get();

        if ($vendorUsers->isEmpty()) {
            $this->command->info('No users with vendor role found. Add some first.');
            return;
        }

        foreach ($vendorUsers as $user) {
            Vendor::create([
                'user_id' => $user->id,
                'store_name' => $faker->company,
                'store_slug' => Str::slug($faker->company) . '-' . Str::random(5),
                'store_description' => $faker->paragraph,
                'logo' => null, // you can add fake logos later
                'commission_percentage' => $faker->randomFloat(2, 0, 20), // 0% - 20%
                'status' => 'approved', // or randomly: pending, rejected, suspended
            ]);
        }
    }
}
