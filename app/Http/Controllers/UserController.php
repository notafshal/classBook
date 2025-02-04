<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $incomingFields = $request->validate([
            'loginname' => 'required',
            'loginpassword' => 'required',
        ]);
    
        if (Auth::attempt(['name' => $incomingFields['loginname'], 'password' => $incomingFields['loginpassword']])) {
            $request->session()->regenerate();
            $user = Auth::user();
            return response()->json(['message' => 'Login successful',   'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],], 200); 
        }
    
        return response()->json(['message' => 'Invalid login credentials'], 401);
    }
    
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logout successful'], 200); 
    }
    
    public function register(Request $request)

    {
        $incomingFields = $request->validate([
            'name' => ['required', 'min:3', 'max:10', Rule::unique('users', 'name')],
            'email' => ['required', 'email', Rule::unique('users', 'email')],
            'password' => ['required', 'min:3', 'max:20'],
            'role' => ['required', Rule::in(['student', 'staff', 'admin'])],
        ]);
    
        $incomingFields['password'] = bcrypt($incomingFields['password']);
    
        $user = User::create($incomingFields);
        Auth::login($user);
    
        return response()->json(['message' => 'Registration successful'], 201); 
    }
    public function getUser($id)
{
    $user = User::findOrFail($id);

    return response()->json([
        'message' => 'User retrieved successfully',
        'user' => $user,
    ], 200);
}

public function updateUser(Request $request, $id)
{
    $user = User::findOrFail($id);

    $incomingFields = $request->validate([
        'name' => ['required', 'min:3', 'max:10', Rule::unique('users', 'name')->ignore($id)],
        'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($id)],
        'password' => ['nullable', 'min:3', 'max:20'],
        'role' => ['required', Rule::in(['student', 'staff', 'admin'])],
    ]);

    if ($request->filled('password')) {
        $incomingFields['password'] = Hash::make($incomingFields['password']);
    } else {
        unset($incomingFields['password']);
    }

    $user->update($incomingFields);

    return response()->json([
        'message' => 'User updated successfully',
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ],
    ], 200);
}
}
