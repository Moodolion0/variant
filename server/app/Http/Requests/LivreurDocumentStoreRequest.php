<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LivreurDocumentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'doc_type' => ['required', 'string', 'max:100'],
            'file_url' => ['required', 'url', 'max:2048'],
            'status' => ['nullable', 'in:en_attente,approuve,rejete'],
            'admin_note' => ['nullable', 'string'],
        ];
    }
}
