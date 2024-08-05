<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChainsController;
use App\Http\Controllers\ControlFinalController;
use App\Http\Controllers\CoupeProductionController;
use App\Http\Controllers\EffectiveRealController;
use App\Http\Controllers\EffectiveStandardController;
use App\Http\Controllers\MagasinController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductPlanController;
use App\Http\Controllers\RepassageProductionController;
use App\Http\Controllers\SystemConstController;
use App\Http\Controllers\ChainProductionController;
use App\Http\Controllers\PrimeController;
use App\Http\Controllers\ExportProductionController;
use App\Http\Controllers\ChainProductionRetouchController;
use App\Http\Controllers\MagasinFournitureProductionController;
use App\Http\Controllers\PlastiqueFilController;
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
    // total chain
    Route::get('/total_chain', [ChainsController::class, 'total_chain']);

    /**
     * Product plan
     */
    // get a single plan 
    Route::get('product_plans_single/{id}', [ProductPlanController::class, 'show']);
    // get a single plan by model id
    Route::get('product_plans_model/{modelId}/{chainId}' , [ProductPlanController::class, 'getPlanningByModel']);
    // get a dashboard plan by model id
    Route::get('product_plans_model_dash/{modelId}/{date?}', [ProductPlanController::class, 'getdashPlanningByModel']);
    // create a new plan
    Route::post('product_plans', [ProductPlanController::class, 'store']);
    // update product plan information
    Route::post('product_plans/{id}', [ProductPlanController::class, 'update']);
    // delete product plan 
    Route::delete('product_plans/{id}', [ProductPlanController::class, 'destroy']);
    // get the admin product plan 
    Route::get('/product_plans_admin', [ProductPlanController::class, 'getAdminData']);
    // post the admin product plan
    Route::post('/product_plans_admin/{id}', [ProductPlanController::class, 'sendToAdmin']);
    // accept and refuse
    Route::post('/product_plans_admin', [ProductPlanController::class, 'handleAction']);

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
    // getWorkedHours
    Route::get('product_plans_worked_hours/{modelId}', [ProductPlanController::class, 'getWorkedHours']);
    // getdashPlanningByModelAndNoHour
    Route::get('product_plans_worked/{modelId}', [ProductPlanController::class, 'getdashPlanningByModelAndNoHour']);
     
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
    // get the effective standard 
    Route::get('effective_data/{modelId}', [EffectiveStandardController::class, 'getEffectiveData']);
    // get the effective standard total
    Route::get('effective_data_total/{modelId}', [EffectiveStandardController::class, 'getEffectiveSumData']);
    // get the effective indirect
    Route::get('effective_indirect_standard', [EffectiveStandardController::class, 'getEffectiveIndirect']);
    // total effective indirect
    Route::get('effective_indirect_total', [EffectiveStandardController::class, 'totalEffectifIndirect']);
    // get the effective real by model and date
    Route::get('effective_real_date/{modelId}', [EffectiveStandardController::class, 'getEffectiveByModelAndDate']);
    // get the total effectif direct
    Route::get('effective_direct_standard/{modelId}', [EffectiveStandardController::class, 'totalEffectifDirect']);

    /**
     * Effective Real
     */
    // create an effective real 
    Route::post('effective_real', [EffectiveRealController::class, 'store']);
    // update effective real 
    Route::post('effective_real/{id}', [EffectiveRealController::class, 'update']);
    // delete effective real 
    Route::delete('effective_real/{id}', [EffectiveRealController::class, 'destroy']);
    // get the effective real by model
    Route::get('effective_real/{modelId}', [EffectiveRealController::class, 'getEffectiveByModel']);
    // get the effective real 
    Route::get('effective_real_data/{modelId}', [EffectiveRealController::class, 'getEffectiveData']);
    // get the effective real total
    Route::get('effective_real_total/{modelId}', [EffectiveRealController::class, 'getEffectiveSumData']);
    // get the effective indirect
    Route::get('effective_indirect_real', [EffectiveRealController::class, 'getEffectiveIndirect']);
    // get the total effectif indirect
    Route::get('effective_indirect', [EffectiveRealController::class, 'totalEffectifIndirect']);
    // get the total effectif direct
    Route::get('effective_direct_real/{modelId}', [EffectiveRealController::class, 'totalEffectifDirect']);

    /**
     * System Constant
     */
    // get one
    Route::get('/system_constants_latest', [SystemConstController::class, 'show']); 
    // Update System Constants
    Route::post('/system_constants/{id}', [SystemConstController::class, 'update']);
    // get salaries
    Route::get('/salaries', [SystemConstController::class, 'salaries']); 
    // by date range
    Route::get('/system-constants/by-date-range', [SystemConstController::class, 'getRecordsByDateRange']);

    

    /**
     * Coupe Production
     */
    // get coupe production
    Route::get('/coupe_production/{modelId}', [CoupeProductionController::class, 'show']);
    // send coupe production
    Route::post('/coupe_production/{modelId}', [CoupeProductionController::class, 'update']);

    /**
     * Chain Production
     */
    // get chain production
    Route::get('/chain_production/{modelId}/{chainId}', [ChainProductionController::class, 'show']);

    Route::get('/chain_production_sortie/{modelId}/{chainId}', [ChainProductionController::class, 'showSortie']);
    // getchainData
    Route::get('/chain_production_data/{modelId}', [ChainProductionController::class, 'getChainData']);
    // send chain production
    Route::post('/chain_production/{modelId}/{chainId}', [ChainProductionController::class, 'update']);
    // chain retouch
    Route::post('/chain_production_retouch/{modelId}/{chainId}', [ChainProductionController::class, 'retouch']);
    // Calculate total sortie for a model
    Route::get('/production_chains/{modelId}/sortie', [ChainProductionController::class, 'calculateSortie']);
    // Calculate total entre for a model
    Route::get('/production_chains/{modelId}/entre', [ChainProductionController::class, 'calculateEntre']);

    /**
     * repassage Production
     */
    // get repassage production
    Route::get('/repassage_production/{modelId}', [RepassageProductionController::class, 'show']);
    // send repassage production
    Route::post('/repassage_production/{modelId}', [RepassageProductionController::class, 'update']);

    /**
     * magasin Production
     */
    // get magasin production
    Route::get('/magasin_production/{modelId}', [MagasinController::class, 'show']);
    // send repassage production
    Route::post('/magasin_production/{modelId}', [MagasinController::class, 'update']);

    /**
     * magasin Production
     */
    // get magasin production
    Route::get('/magasin_fourniture_production/{modelId}', [MagasinFournitureProductionController::class, 'show']);
    // send repassage production
    Route::post('/magasin_fourniture_production/{modelId}', [MagasinFournitureProductionController::class, 'update']);

    /**
     * control Production
     */
    // get magasin production
    Route::get('/control_production/{modelId}', [ControlFinalController::class, 'show']);
    // send repassage production
    Route::post('/control_production/{modelId}', [ControlFinalController::class, 'update']);

    /**
     * Export
     */
    // show
    Route::get('/export/{modelId}' , [ExportProductionController::class, 'show']);
    // add
     Route::post('/export/{modelId}' , [ExportProductionController::class, 'update']);
    //  getTotalValue
    Route::get('/export_total' , [ExportProductionController::class , 'getTotalValue']);
    // get Total Export By Model
    Route::get('/export_total/{modelId}/{date?}' , [ChainProductionController::class , 'getTotalExportByModel']);

    /**
     * Posts
     */
    Route::get('/posts', [PostController::class,'index']);

    Route::get('/posts/{id}', [PostController::class,'show']);
    
    Route::post('/posts', [PostController::class, 'store']);
    
    Route::post('/posts/{id}', [PostController::class, 'update']);
    
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);

    /**
     * Prime Controller
     */
    // Get all primes
    Route::get('/primes', [PrimeController::class, 'index']);
    // Create a new prime
    Route::post('/primes', [PrimeController::class, 'store']);
    // Update a prime
    Route::post('/primes/{id}', [PrimeController::class, 'update']);
    // Delete a prime
    Route::delete('/primes/{id}', [PrimeController::class, 'destroy']);

    /**
     * Retouches
     */
    // get all retouches
    Route::get("/retouch" , [ChainProductionRetouchController::class, 'index']);
    // create a new retouches
    Route::post("/retouch" , [ChainProductionRetouchController::class, 'store']);

    /**
     * plastique and fil
     */

     Route::get('/plastique_fil/{model_id}', [PlastiqueFilController::class, 'show']);
    
     Route::post('/plastique_fil/{model_id}', [PlastiqueFilController::class, 'store']);


});

// the only available route without token is the login
Route::post('/login', [AuthController::class, 'login']);