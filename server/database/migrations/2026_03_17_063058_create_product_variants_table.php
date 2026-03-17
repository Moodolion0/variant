<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     * DEPRECATED - Properties stored as JSON in products table instead
     */
    public function up(): void
    {
        // No longer needed
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to reverse
    }
};
