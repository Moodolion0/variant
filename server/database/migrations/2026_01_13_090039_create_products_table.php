<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade');
            
            // Supplier-defined fields
            $table->string('name_supplier');
            $table->text('description_supplier')->nullable();
            $table->decimal('price_supplier', 10, 2)->default(0.00);
            $table->integer('stock_quantity')->default(0);
            
            // Properties as JSON (e.g., {"size": {"S": 10, "M": 15}, "color": {"Red": 5}})
            $table->json('properties')->nullable();
            
            // Admin-defined fields
            $table->string('name_by_admin')->nullable();
            $table->text('description_by_admin')->nullable();
            $table->string('category')->nullable();
            $table->decimal('interest', 5, 2)->default(0.00); // Markup
            $table->boolean('visible_in_catalog')->default(false);
            $table->timestamp('admin_updated_at')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
