<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWallet_transactionRequest extends FormRequest
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
            'type' => ['sometimes','in:credit_livraison,penalite_annulation,retrait'],
            'amount' => ['sometimes','numeric','min:0'],
            'order_id' => ['sometimes','nullable','exists:orders,id'],
        ];
    }
}
