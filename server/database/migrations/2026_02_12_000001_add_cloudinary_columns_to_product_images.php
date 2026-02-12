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
        Schema::table('product_images', function (Blueprint $table) {
            if (!Schema::hasColumn('product_images', 'cloudinary_public_id')) {
                $table->string('cloudinary_public_id')->nullable();
            }
            if (!Schema::hasColumn('product_images', 'width')) {
                $table->integer('width')->nullable();
            }
            if (!Schema::hasColumn('product_images', 'height')) {
                $table->integer('height')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            $table->dropColumnIfExists('cloudinary_public_id');
            $table->dropColumnIfExists('width');
            $table->dropColumnIfExists('height');
        });
    }
};
