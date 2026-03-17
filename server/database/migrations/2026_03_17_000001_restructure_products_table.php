<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     * DEPRECATED - Already handled in create_products_table migration
     */
    public function up(): void
    {
        // No longer needed - structure already in place
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to reverse
    }
};