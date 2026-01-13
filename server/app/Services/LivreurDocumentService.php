<?php

namespace App\Services;

use App\Models\Livreur_document;

class LivreurDocumentService
{
    public function create(array $data): Livreur_document
    {
        return Livreur_document::create($data);
    }

    public function update(Livreur_document $doc, array $data): Livreur_document
    {
        $doc->fill($data);
        $doc->save();

        return $doc;
    }

    public function delete(Livreur_document $doc): bool
    {
        return $doc->delete();
    }
}
