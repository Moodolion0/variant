<?php

namespace App\Http\Controllers;

use App\Models\Livreur_document;
use App\Http\Requests\LivreurDocumentStoreRequest;
use App\Http\Requests\LivreurDocumentUpdateRequest;
use App\Services\LivreurDocumentService;
use Illuminate\Http\JsonResponse;

class LivreurDocumentController extends Controller
{
    protected LivreurDocumentService $service;

    public function __construct(LivreurDocumentService $service)
    {
        $this->service = $service;
        $this->authorizeResource(Livreur_document::class, 'livreur_document');
    }

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Livreur_document::class);
        $docs = Livreur_document::with('user')->paginate();

        return response()->json($docs);
    }

    public function store(LivreurDocumentStoreRequest $request): JsonResponse
    {
        $this->authorize('create', Livreur_document::class);
        $data = $request->validated();
        $data['user_id'] = auth()->id() ?? $data['user_id'] ?? null;

        $doc = $this->service->create($data);

        return response()->json($doc, 201);
    }

    public function show(Livreur_document $livreur_document): JsonResponse
    {
        $this->authorize('view', $livreur_document);
        return response()->json($livreur_document->load('user'));
    }

    public function update(LivreurDocumentUpdateRequest $request, Livreur_document $livreur_document): JsonResponse
    {
        $this->authorize('update', $livreur_document);
        $doc = $this->service->update($livreur_document, $request->validated());

        return response()->json($doc);
    }

    public function destroy(Livreur_document $livreur_document): JsonResponse
    {
        $this->authorize('delete', $livreur_document);
        $this->service->delete($livreur_document);

        return response()->json(null, 204);
    }
}
