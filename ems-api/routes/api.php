<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;

Route::get('/ping', function () {
    return response()->json(['status' => 'API OK']);
});

// ✅ Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ✅ Protected Routes (requires login)
Route::middleware('auth:sanctum')->group(function () {

    // Logout for all roles
    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ Admin-only routes
    Route::middleware('is_admin')->group(function () {
        Route::get('/employees', [EmployeeController::class, 'index']);
        Route::get('/employees/{id}', [EmployeeController::class, 'show']);
        Route::post('/employees', [EmployeeController::class, 'store']);
        Route::put('/employees/{id}', [EmployeeController::class, 'update']);
        Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
    });

    // ✅ Logged-in user can view and update their profile
    Route::get('/user', function () {
        return auth()->user();
    });

    Route::put('/user/update', function (Request $request) {
        $user = auth()->user();
        $user->name = $request->name;

        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }

        $user->save();
        return $user;
    });
});
