<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
            'delivery_lat' => ['required','numeric','between:-90,90'],
            'delivery_long' => ['required','numeric','between:-180,180'],
            'total_price' => ['required','numeric','min:0'],
            'delivery_fee' => ['nullable','numeric','min:0'],
            'status' => ['nullable','in:en_attente,paye,en_cours_livraison,livre,termine,annule'],
        ];
    }
}
