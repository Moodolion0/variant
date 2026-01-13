<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LivreurDocumentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'doc_type' => ['sometimes', 'required', 'string', 'max:100'],
            'file_url' => ['sometimes', 'required', 'url', 'max:2048'],
            'status' => ['sometimes', 'nullable', 'in:en_attente,approuve,rejete'],
            'admin_note' => ['nullable', 'string'],
        ];
    }
}
