<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;
use Faker\Factory as Faker;

class ProductImageSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $products = Product::all();

        foreach ($products as $product) {
            // Each product will have 1-4 images
            $imageCount = rand(1, 4);

            for ($i = 0; $i < $imageCount; $i++) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'https://picsum.photos/seed/' . rand(1, 1000) . '/600/600', // random image
                    'is_primary' => $i === 0, // first image as primary
                ]);
            }
        }
    }
}
