<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $categoryService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json($this->categoryService->listAll());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->categoryService->findOrFail($id));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
        ]);

        return response()->json($this->categoryService->create($data), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,' . $id,
        ]);

        return response()->json($this->categoryService->update($id, $data));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->categoryService->delete($id);

        return response()->json(null, 204);
    }
}