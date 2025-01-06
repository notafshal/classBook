<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ClassroomController;
use App\Models\Booking;

Route::get('/profile',function(){
    return inertia::render('Profile');
});
Route::get('/profile/edit', function () {
    return Inertia::render('EditProfile');
})->name('profile.edit');
Route::post('/logout', [UserController::class, 'logout'] );

Route::get('/', function () {
    return Inertia::render('Home'); 
})->name('home');
Route::get('/login', fn() => Inertia::render('Login'));
Route::post('/login', [UserController::class, 'login']);
Route::get('/register', fn() => Inertia::render('Register'));
Route::post('/register', [UserController::class, 'register']);
Route::get('/user/{id}', [UserController::class, 'getUser']);
Route::put('/user/{id}', [UserController::class, 'updateUser'])->name('updateUser');
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});
Route::get('/book-mgmt', function () {
    return Inertia::render('BookMgmt');
});
Route::get('/rooms', [ClassroomController::class, 'index'])->name('index');
Route::get('/rooms/create', [ClassroomController::class, 'create'])->name('create');

Route::middleware(['role:admin'])->group(function () {  
    Route::post('/rooms/{id}/block', [ClassroomController::class, 'toggleBlock'])->name('toggleBlock');

    Route::post('/rooms', [ClassroomController::class, 'store'])->name('store');
    Route::get('/rooms/{id}/edit', [ClassroomController::class, 'edit'])->name('edit');
    Route::put('/rooms/{id}', [ClassroomController::class, 'update'])->name('update');
    Route::delete('/rooms/{id}', [ClassroomController::class, 'destroy'])->name('destroy');
});

Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus'])->name('bookings.updateStatus');

Route::get('/bookings', [BookingController::class, 'index'])->name('index');
Route::get('/bookings/create', [BookingController::class, 'create'])->name('create');
Route::post('/bookings', [BookingController::class, 'store'])->name('store');
Route::get('/bookings/{userId}', fn() => Inertia::render('ViewBooking'))->name('show');
 Route::get('/bookings/{userId}', [BookingController::class, 'show'])->name('show');
Route::get('/bookings/{id}/edit', [BookingController::class, 'edit'])->name('edit');
Route::put('/bookings/{id}', [BookingController::class, 'update'])->name('update');
Route::delete('/bookings/{id}', [BookingController::class, 'destroy'])->name('destroy');