<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\ProductPlanController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Get Model
    Route::get('/models', [ModelController::class,'index']);
    // Get singel Model
    Route::get('/models/{id}', [ModelController::class,'model']);
    // Create a new model
    Route::post('/models', [ModelController::class, 'store']);
    // Update a model
    Route::put('/models/{id}', [ModelController::class, 'update']);
    // Delete a model
    Route::delete('/models/{id}', [ModelController::class, 'destroy']);

    // Get users
    Route::get('users', [AuthController::class, 'index']);
    // Get a single user
    Route::get('users/{id}', [AuthController::class, 'show']);
    // Create a new user
    Route::post('users', [AuthController::class, 'store']);
    // update a user
    Route::put('users/{id}', [AuthController::class, 'update']);
    // delete a user
    Route::delete('users/{id}', [AuthController::class, 'destroy']);


    Route::get('product_plans', [ProductPlanController::class, 'index']);

    Route::post('product_plans', [ProductPlanController::class, 'store']);
    
    Route::get('product_plans/{productPlan}', [ProductPlanController::class, 'show']);
    
    Route::put('product_plans/{productPlan}', [ProductPlanController::class, 'update']);
    
    Route::delete('product_plans/{productPlan}', [ProductPlanController::class, 'destroy']);
    
    Route::post('product_plans/{productPlan}/hours', [ProductPlanController::class, 'storeHour']);
    
    Route::get('product_plans/{productPlan}/hours', [ProductPlanController::class, 'getHours']);
});


Route::post('/login', [AuthController::class, 'login']);