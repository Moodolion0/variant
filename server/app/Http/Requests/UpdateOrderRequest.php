<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'livreur_id' => ['sometimes','nullable','exists:users,id'],
            'status' => ['sometimes','in:en_attente,paye,en_cours_livraison,livre,termine,annule'],
            'delivery_lat' => ['sometimes','numeric','between:-90,90'],
            'delivery_long' => ['sometimes','numeric','between:-180,180'],
            'total_price' => ['sometimes','numeric','min:0'],
            'delivery_fee' => ['sometimes','numeric','min:0'],
            'declared_finished_at' => ['sometimes','nullable','date'],
            'confirmed_at' => ['sometimes','nullable','date'],
        ];
    }
}
