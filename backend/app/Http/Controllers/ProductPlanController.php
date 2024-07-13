<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductPlan;
use App\Models\ProductPlanHour;
use Illuminate\Support\Facades\Auth;

class ProductPlanController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize(['developer', 'Method', 'admin' , 'superadmin']);

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'qte' => 'required|integer',
            'model_id' => 'required|exists:models,id',
            'chain' => 'required|string',
            'Quenta' => 'required|string',
            'consummation_standard_fil' => 'required|integer',
            'consummation_standard_plastique' => 'required|integer',
        ]);

        $productPlan = ProductPlan::create($request->all());

        return response()->json($productPlan, 201);
    }

    public function show($id)
    {
        $this->authorize(['developer', 'Method', 'admin' , 'superadmin']);

        return ProductPlan::findOrFail($id);
    }

    public function getdashPlanningByModel($modelId)
    {
        $this->authorize(['developer', 'Method', 'admin', 'superadmin']);
    
        $productPlan = ProductPlan::where('model_id', $modelId)->first();
    
        if (!$productPlan) {
            return response()->json(['message' => 'No planning found for this model'], 404);
        }
    
        $startDate = new \DateTime($productPlan->start_date);
        $endDate = new \DateTime($productPlan->end_date);
    
        $dateInterval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod($startDate, $dateInterval, $endDate->modify('+1 day'));
    
        $dailyPlanning = [];
        foreach ($dateRange as $date) {
            $formattedDate = $date->format('Y-m-d');
            $modelsFinished = ProductPlanHour::where('product_plan_id', $productPlan->id)
                ->where('date', $formattedDate)
                ->sum('models_finished');
            
            $dailyPlanning[$formattedDate] = $modelsFinished;
        }
    
        return response()->json([
            'planning' => $dailyPlanning,
            'start_date' => $productPlan->start_date,
            'end_date' => $productPlan->end_date,
        ]);
    }

    public function getPlanningByModel($modelId)
    {
        $this->authorize(['developer', 'Method', 'admin' , 'superadmin']);

        $productPlan = ProductPlan::where('model_id', $modelId)->first();

        if (!$productPlan) {
            return response()->json(['message' => 'No planning found for this model'], 404);
        }

        return response()->json($productPlan);
    }

    
    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'Method', 'admin' , 'superadmin']);
        
        $productPlan = ProductPlan::findOrFail($id);

        $data = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'qte' => 'sometimes|integer',
            'model_id' => 'sometimes|exists:models,id',
            'Quenta' => 'sometimes|string',
            'chain' => 'sometimes|string',
            'consummation_standard_fil' => 'sometimes|integer',
            'consummation_standard_plastique' => 'sometimes|integer',
        ]);

        $productPlan->update($data);

        return response()->json($productPlan);
    }

    public function destroy($id)
    {
        $this->authorize(['developer', 'Method', 'admin' , 'superadmin']);

        $productPlan = ProductPlan::findOrFail($id);
        
        $productPlan->delete();
        
        return response()->json(null, 204);
    }

    public function updateHours(Request $request, $id) {
        $this->authorize(['developer', 'Method', 'admin' , 'superadmin']);

        $productPlanHour = ProductPlanHour::findOrFail($id);

        $data = $request->validate([
            'hour' => 'required|string',
            'models_finished' => 'required|integer',
            'day' => 'required|string',
            'product_plan_id' => 'required|integer',  
        ]);

        $productPlanHour->update($data);

        return response()->json($productPlanHour);

    }

    public function deleteHours($id) {
        $this->authorize(['developer', 'Method', 'admin' , 'superadmin']);

        $productPlanHour = ProductPlanHour::findOrFail($id);
        
        $productPlanHour->delete();
        
        return response()->json(null, 204);
    }

    public function setHours(Request $request)
    {
        $this->authorize(['developer', 'Method', 'admin' , 'superadmin']);

        $request->validate([
            'hour' => 'required|string',
            'models_finished' => 'required|integer',
            'day' => 'required|string',
            'date' => 'required|date',
            'product_plan_id' => 'required|integer',  
        ]);

        $productPlanHour = ProductPlanHour::create([
            'product_plan_id' => $request->product_plan_id,
            'hour' => $request->hour,
            'date' =>  $request->date,
            'models_finished' => $request->models_finished,
            'day' => $request->day,  
        ]);

        return response()->json($productPlanHour, 201);
    }

    public function getHours($id)
    {
        $this->authorize(['developer', 'Method', 'admin', 'superadmin']);
    
        // Fetch all product plan hours for the given product plan id
        $productPlanHours = ProductPlanHour::where('product_plan_id', $id)->get();
    
        if ($productPlanHours->isNotEmpty()) {
            return response()->json($productPlanHours);
        } else {
            return response()->json([], 200);
        }
    }
    
    public function search(Request $request)
    {
        $this->authorize(['developer', 'Method', 'admin', 'superadmin']);
    
        $validatedData = $request->validate([
            'hour' => 'required|string',
            'product_plan_id' => 'required|integer',
            'day' => 'required|string', 
        ]);
    
        $productPlanHour = ProductPlanHour::where('hour', $validatedData['hour'])
            ->where('product_plan_id', $validatedData['product_plan_id'])
            ->where('day', $validatedData['day'])
            ->get();
    
        if ($productPlanHour->isNotEmpty()) {
            return response()->json($productPlanHour);
        } else {
            return response()->json(['message' => 'No matching plan hour found'], 200);
        }
    }
    
    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}
