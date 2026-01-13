<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone_number' => ['nullable', 'string', 'max:50', 'unique:users,phone_number'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:admin,client,livreur'],
            'status' => ['nullable', 'in:en_attente,valide,bloque'],
        ];
    }
}
