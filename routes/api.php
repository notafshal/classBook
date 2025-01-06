<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::put('/user/{id}', [UserController::class, 'updateUser']);
Route::post('/test-post', function (\Illuminate\Http\Request $request) {
    return response()->json([
        'message' => 'Post route is working!',
        'data' => $request->all(),]);
});