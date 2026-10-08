<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    public function listAll(): Collection
    {
        return User::select('id', 'name', 'email', 'role', 'created_at')->get();
    }

    public function findOrFail(int $id): User
    {
        return User::select('id', 'name', 'email', 'role', 'created_at')->findOrFail($id);
    }

    public function promoteToAdmin(int $id): User
    {
        $user = User::findOrFail($id);
        $user->update(['role' => 'admin']);

        return $user;
    }

    public function demoteToCustomer(int $id): User
    {
        $user = User::findOrFail($id);
        $user->update(['role' => 'customer']);

        return $user;
    }
}