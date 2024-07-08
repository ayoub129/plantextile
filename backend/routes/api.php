<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChainsController;
use App\Http\Controllers\CoupeProductionController;
use App\Http\Controllers\EffectiveRealController;
use App\Http\Controllers\EffectiveStandardController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductPlanController;
use App\Http\Controllers\SystemconstantController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    /**
     * Users Controller
     */
    // Get users
    Route::get('/users', [AuthController::class, 'index']);
    // get profile picture
    Route::get('/user/profile_picture', [AuthController::class, 'getProfilePicture']);
    // delete a user
    Route::delete('/users/{id}', [AuthController::class, 'destroy']);
    // Get a single user
    Route::get('/users/{id}', [AuthController::class, 'show']);
    // update a user
    Route::post('/users/{id}', [AuthController::class, 'update']);
    // Create a new user
    Route::post('/users', [AuthController::class, 'store']);
    // update password
    Route::post('/update-password', [AuthController::class, 'updatePassword']);

    /**
     * Models Controller
     */
    // Get Model
    Route::get('/models', [ModelController::class,'index']);
    // Get singel Model
    Route::get('/models/{id}', [ModelController::class,'show']);
    // Create a new model
    Route::post('/models', [ModelController::class, 'store']);
    // Update a model
    Route::post('/models/{id}', [ModelController::class, 'update']);
    // Delete a model
    Route::delete('/models/{id}', [ModelController::class, 'destroy']);
    
    /**
     * Chains Controller
     */
    // Get chain
    Route::get('/chains', [ChainsController::class,'index']);
    // Get singel chain
    Route::get('/chains/{id}', [ChainsController::class,'show']);
    // Create a new chain
    Route::post('/chains', [ChainsController::class, 'store']);
    // Delete a chains
    Route::delete('/chains/{id}', [ChainsController::class, 'destroy']);

    /**
     * Product plan
     */
    // get a single plan 
    Route::get('product_plans_single/{id}', [ProductPlanController::class, 'show']);
    // get a single plan by model id
    Route::get('product_plans_model/{modelId}' , [ProductPlanController::class, 'getPlanningByModel']);
    // create a new plan
    Route::post('product_plans', [ProductPlanController::class, 'store']);
    // update product plan information
    Route::post('product_plans/{id}', [ProductPlanController::class, 'update']);
    // delete product plan 
    Route::delete('product_plans/{id}', [ProductPlanController::class, 'destroy']);
    
    /**
     * Product plan hours
     */
    // get the product plans by hour base on model id 
    Route::get('product_plans_hours/{id}', [ProductPlanController::class, 'getHours']);
    // get the product plans by hour base on product plan id and hour and day
    Route::post('product_plans_hours/search', [ProductPlanController::class, 'search']);
    // update the product plans by hour base on id
    Route::post('product_plans_hours/{id}', [ProductPlanController::class, 'updateHours']);
    // delete the product plans by hour base on id
    Route::delete('product_plans_hours/{id}', [ProductPlanController::class, 'deleteHours']);
    // create a new product plan hours
    Route::post('product_plans_hours', [ProductPlanController::class, 'setHours']);

    /**
     * Effective Standard  
     */
    // create an effective standard 
    Route::post('effective_standard', [EffectiveStandardController::class, 'store']);
    // update effective standard 
    Route::post('effective_standard/{id}', [EffectiveStandardController::class, 'update']);
    // delete effective standard 
    Route::delete('effective_standard/{id}', [EffectiveStandardController::class, 'destroy']);
    // get the effective standard by model
    Route::get('effective_standard/{modelId}', [EffectiveStandardController::class, 'getEffectiveByModel']);

    /**
     * Effective Real
     */
    // create an effective standard 
    Route::post('effective_real', [EffectiveRealController::class, 'store']);
    // update effective standard 
    Route::post('effective_real/{id}', [EffectiveRealController::class, 'update']);
    // delete effective standard 
    Route::delete('effective_real/{id}', [EffectiveRealController::class, 'destroy']);
    // get the effective standard by model
    Route::get('effective_real/{modelId}', [EffectiveRealController::class, 'getEffectiveByModel']);




    // System Constants 
    Route::post('/system_constants', [SystemconstantController::class, 'store']);
    // Update System Constants
    Route::put('/system_constants/{id}', [SystemconstantController::class, 'update']);
    // get one
    Route::get('/system_constants_latest', [SystemconstantController::class, 'show']); 
    // get all system constants
    Route::get('/system_constants', [SystemconstantController::class, 'index']); 

    Route::get('/posts', [PostController::class,'index']);

    Route::get('/posts/{id}', [PostController::class,'show']);
    
    Route::post('/posts', [PostController::class, 'store']);
    
    Route::put('/posts/{id}', [PostController::class, 'update']);
    
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);

    // coupe-productions
    Route::get('/coupe-productions' , [CoupeProductionController::class, 'index']);
    Route::post('/coupe-productions' , [CoupeProductionController::class,'store']);
    Route::post('/coupe-productions/search' , [CoupeProductionController::class,'show']);
    Route::put('/coupe-productions/{id}' , [CoupeProductionController::class,'update']);
    Route::delete('/coupe-productions/{id}' , [CoupeProductionController::class,'delete']);
});

// the only available route without token is the login
Route::post('/login', [AuthController::class, 'login']);