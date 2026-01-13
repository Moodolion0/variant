<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\livreur_document>
 */
class LivreurDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $docTypes = ['carte_biométrique', 'cip', 'permis_conduire'];

        return [
            'user_id' => \App\Models\User::factory(),
            'doc_type' => $this->faker->randomElement($docTypes),
            'file_url' => $this->faker->imageUrl(640, 480, 'documents', true),
            'status' => \App\Models\Livreur_document::STATUS_EN_ATTENTE,
            'admin_note' => null,
        ];
    }
}
