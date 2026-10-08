<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private UserService $userService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json($this->userService->listAll());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->userService->findOrFail($id));
    }

    public function promote(int $id): JsonResponse
    {
        return response()->json($this->userService->promoteToAdmin($id));
    }

    public function demote(int $id): JsonResponse
    {
        return response()->json($this->userService->demoteToCustomer($id));
    }
}