<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Use Spatie role scope
        $vendors = User::role('vendor')->pluck('id')->toArray();
        $categories = Category::pluck('id')->toArray();

        if (empty($vendors) || empty($categories)) {
            $this->command->info('No vendors or categories found. Add some first.');
            return;
        }

        for ($i = 0; $i < 20; $i++) {
            $name = $faker->words(3, true);
            Product::create([
                'vendor_id' => $faker->randomElement($vendors),
                'category_id' => $faker->randomElement($categories),
                'name' => ucfirst($name),
                'slug' => Str::slug($name) . '-' . Str::random(5),
                'description' => $faker->paragraph(),
                'price' => $faker->randomFloat(2, 10, 200),
                'sale_price' => $faker->boolean(50) ? $faker->randomFloat(2, 5, 150) : null,
                'sku' => strtoupper(Str::random(8)),
                'stock' => $faker->numberBetween(0, 100),
                'status' => $faker->randomElement(['draft', 'active', 'inactive', 'out_of_stock']),
            ]);
        }
    }
}
