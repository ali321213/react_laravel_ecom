<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Electronics',
            'Fashion',
            'Books',
            'Home & Garden',
            'Beauty',
            'Sports',
            'Toys',
            'Automotive',
            'Bags',
            'Shirts',
            'Pants',
            'Accessories',
        ];

        foreach ($categories as $categoryName) {
            Category::create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
                'status' => 'active',
            ]);
        }

        // Optional: create some subcategories
        $electronics = Category::where('slug', 'electronics')->first();
        if ($electronics) {
            $subcategories = ['Phones', 'Laptops', 'Cameras'];
            foreach ($subcategories as $subName) {
                Category::create([
                    'name' => $subName,
                    'slug' => Str::slug($subName),
                    'parent_id' => $electronics->id,
                    'status' => 'active',
                ]);
            }
        }
    }
}
