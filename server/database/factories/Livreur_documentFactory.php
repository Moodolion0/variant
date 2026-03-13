<?php

namespace Database\Factories;

use App\Models\Livreur_document;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Livreur_document>
 */
class Livreur_documentFactory extends Factory
{
    protected $model = Livreur_document::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'doc_type' => $this->faker->randomElement([
                'carte_identite',
                'permis_conduire',
                'carte_professionnelle',
                'vehicule_registration',
                'assurance',
            ]),
            'file_url' => $this->faker->imageUrl(800, 600, 'documents'),
            'status' => 'en_attente',
            'admin_note' => null,
        ];
    }
}
