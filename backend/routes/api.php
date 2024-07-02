<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductPlanController;
use App\Http\Controllers\SystemconstantController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Get Model
    Route::get('/models', [ModelController::class,'index']);
    // Get singel Model
    Route::get('/models/{id}', [ModelController::class,'show']);
    // Create a new model
    Route::post('/models', [ModelController::class, 'store']);
    // Update a model
    Route::put('/models/{id}', [ModelController::class, 'update']);
    // Delete a model
    Route::delete('/models/{id}', [ModelController::class, 'destroy']);

    // Get users
    Route::get('/users', [AuthController::class, 'index']);
    // Get a single user
    Route::get('/users/{id}', [AuthController::class, 'show']);
    // Create a new user
    Route::post('/users', [AuthController::class, 'store']);
    // update a user
    Route::put('/users/{id}', [AuthController::class, 'update']);
    // delete a user
    Route::delete('/users/{id}', [AuthController::class, 'destroy']);

    // Get Companies
    Route::get('/companies', [CompanyController::class, 'index']);
    // Create a new company
    Route::post('/companies', [CompanyController::class, 'store']);
    // Delete company
    Route::delete('companies/{id}', [CompanyController::class, 'destroy']);

    // System Constants 
    Route::post('/system_constants', [SystemconstantController::class, 'store']);
    // Update System Constants
    Route::put('/system_constants/{id}', [SystemconstantController::class, 'update']);
    // get one
    Route::get('/system_constants_latest', [SystemconstantController::class, 'show']); 
    // get all system constants
    Route::get('/system_constants', [SystemconstantController::class, 'index']); 

    Route::get('product_plans', [ProductPlanController::class, 'index']);

    Route::post('product_plans', [ProductPlanController::class, 'store']);
    
    Route::get('product_plans/{productPlan}', [ProductPlanController::class, 'show']);
    
    Route::put('product_plans/{productPlan}', [ProductPlanController::class, 'update']);
    
    Route::delete('product_plans/{productPlan}', [ProductPlanController::class, 'destroy']);
    
    Route::post('product_plans/{productPlan}/hours', [ProductPlanController::class, 'storeHour']);
    
    Route::get('product_plans/{productPlan}/hours', [ProductPlanController::class, 'getHours']);

    Route::get('product_plans/{modelId}' , [ProductPlanController::class, 'getPlanningByModel']);

    Route::get('/posts', [PostController::class,'index']);

    Route::get('/posts/{id}', [PostController::class,'show']);
    
    Route::post('/posts', [PostController::class, 'store']);
    
    Route::put('/posts/{id}', [PostController::class, 'update']);
    
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);

});


Route::post('/login', [AuthController::class, 'login']);