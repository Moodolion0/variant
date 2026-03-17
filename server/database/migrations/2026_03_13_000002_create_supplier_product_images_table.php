<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     * DEPRECATED - Images are now admin-only in product_images table
     */
    public function up(): void
    {
        // This table is no longer needed
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to reverse
    }
};
