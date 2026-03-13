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
        Schema::create('supplier_product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_product_id')
                ->constrained('supplier_products')
                ->onDelete('cascade');
            $table->string('file_url');
            $table->string('cloudinary_public_id')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier_product_images');
    }
};
