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
        $this->authorize(['developer', 'Méthode', 'admin', 'superadmin']);
    
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'qte' => 'required|integer',
            'model_id' => 'required|exists:models,id',
            'chain' => 'required|string',
            'consummation_standard_fil' => 'required|integer',
            'consummation_standard_plastique' => 'required|integer',
        ]);
    
        // Adjust the dates by adding one day
        $startDate = (new \DateTime($request->start_date))->modify('+1 day')->format('Y-m-d');
        $endDate = (new \DateTime($request->end_date))->modify('+1 day')->format('Y-m-d');
        
        $productPlan = ProductPlan::create([
            'start_date' => $startDate,
            'end_date' => $endDate,
            'qte' => $request->qte,
            'model_id' => $request->model_id,
            'chain' => $request->chain,
            'consummation_standard_fil' => $request->consummation_standard_fil,
            'consummation_standard_plastique' => $request->consummation_standard_plastique,
        ]);
    
        return response()->json($productPlan, 201);
    }

    public function handleAction(Request $request)
    {
        $this->authorize(['developer', 'Méthode', 'admin', 'superadmin']);
        
        $action = $request->input('action');
        $id = $request->input('id');
        
        // Validate the action
        if (!in_array($action, ['accept', 'refuse'])) {
            return response()->json(['message' => 'Invalid action'], 400);
        }
        
        // Find the product plan by ID
        $productPlan = ProductPlan::find($id);
        
        if (!$productPlan) {
            return response()->json(['message' => 'No data found for this plan'], 404);
        }
        
        // Perform action (accept or refuse)
        if ($action === 'accept') {
            $productPlan->status = 'accepted'; // Assuming you have a status column
        } else {
            $productPlan->status = 'refused'; // Assuming you have a status column
        }
        
        $productPlan->save();
        
        return response()->json(['message' => 'Action successfully recorded']);
    }
            
    public function show($id)
    {
        $this->authorize(['developer', 'Méthode', 'admin' , 'superadmin']);

        return ProductPlan::findOrFail($id);
    }

    public function getdashPlanningByModel($modelId, $date = null)
    {
        $productPlan = ProductPlan::where('model_id', $modelId)->first();
    
        if (!$productPlan) {
            return response()->json(['message' => 'No planning found for this model'], 404);
        }
    
        $startDate = new \DateTime($productPlan->start_date);
        $endDate = new \DateTime($productPlan->end_date);
        $endDate->modify('+1 day'); // To include the end date
    
        $dateInterval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod($startDate, $dateInterval, $endDate);
    
        $dailyPlanning = [];
    
        if ($date !== null) {
            // Get hourly data for the specific date
            $hoursPlanning = ProductPlanHour::where('product_plan_id', $productPlan->id)
                ->whereDate('date', $date)
                ->get();
    
            $dailyPlanning[$date] = $hoursPlanning;
        } else {
            // Get daily sum for each date in the range
            foreach ($dateRange as $dateObj) {
                $formattedDate = $dateObj->format('Y-m-d');
    
                $dailySum = ProductPlanHour::where('product_plan_id', $productPlan->id)
                    ->whereDate('date', $formattedDate)
                    ->sum('models_finished');
    
                $dailyPlanning[$formattedDate] = $dailySum;
            }
        }
    
        return response()->json([
            'planning' => $dailyPlanning,
            'start_date' => $productPlan->start_date,
            'end_date' => $productPlan->end_date,
        ]);
    }
            
    public function getdashPlanningByModelAndNoHour($modelId)
    {
        // Fetch the sum of 'qte' for all product plans for the given model ID
        $totalFinishedModels = ProductPlan::where('model_id', $modelId)
            ->sum('qte');
    
        // Check if the total sum is zero
        if ($totalFinishedModels === 0) {
            return response()->json(['message' => 'No planning found for this model'], 404);
        }
    
        // Return the total finished models in the JSON response
        return response()->json([
            'total_finished_models' => $totalFinishedModels,
        ]);
    }
        

    public function getPlanningByModel($modelId , $chainId)
    {
        $this->authorize(['developer', 'Méthode', 'admin' , 'superadmin']);

        $productPlan = ProductPlan::where('model_id', $modelId)->where('chain' , $chainId)->first();

        if (!$productPlan) {
            return response()->json(['message' => 'No planning found for this model'], 404);
        }

        return response()->json($productPlan);
    }

    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'Méthode', 'admin', 'superadmin']);
    
        $productPlan = ProductPlan::findOrFail($id);
    
        $data = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'qte' => 'sometimes|integer',
            'model_id' => 'sometimes|exists:models,id',
            'chain' => 'sometimes|string',
            'consummation_standard_fil' => 'sometimes|integer',
            'consummation_standard_plastique' => 'sometimes|integer',
        ]);
    
        // Adjust the dates by adding one day if they are present
        if (isset($data['start_date'])) {
            $data['start_date'] = (new \DateTime($data['start_date']))->modify('+1 day')->format('Y-m-d');
        }
        if (isset($data['end_date'])) {
            $data['end_date'] = (new \DateTime($data['end_date']))->modify('+1 day')->format('Y-m-d');
        }
        
        $productPlan->update($data);
    
        return response()->json($productPlan);
    }
    
    public function destroy($id)
    {
        $this->authorize(['developer', 'Méthode', 'admin' , 'superadmin']);

        $productPlan = ProductPlan::findOrFail($id);
        
        $productPlan->delete();
        
        return response()->json(null, 204);
    }

    public function updateHours(Request $request, $id)
    {
        $this->authorize(['developer', 'Méthode', 'admin' , 'superadmin']);

        $productPlanHour = ProductPlanHour::findOrFail($id);

        $data = $request->validate([
            'hour' => 'required|string',
            'models_finished' => 'required|integer',
            'date' => 'required',
            'product_plan_id' => 'required|integer',  
        ]);

        $productPlanHour->update($data);

        return response()->json($productPlanHour);
    }

    public function sendToAdmin(Request $request, $id)
    {
        $this->authorize(['developer', 'Méthode', 'admin', 'superadmin']);

        $request->validate([
            'message' => 'required|string',
            'taux' => 'required|numeric',
        ]);

        $productPlan = ProductPlan::findOrFail($id);

        // Save the taux and message (assuming you have columns for them in your ProductPlan model)
        $productPlan->taux = $request->taux;
        $productPlan->save();

        return response()->json(['message' => 'Data sent to admin successfully.'], 200);
    }

    public function getAdminData()
    {
        $this->authorize(['developer', 'Méthode', 'admin', 'superadmin']);

        $productPlan = ProductPlan::whereNotNull('taux')->first();

        if (!$productPlan) {
            return response()->json(['message' => 'No data found for this plan'], 404);
        }
    
        return response()->json($productPlan);
    }

    public function deleteHours($id)
    {
        $this->authorize(['developer', 'Méthode', 'admin' , 'superadmin']);

        $productPlanHour = ProductPlanHour::findOrFail($id);

        $productPlanHour->delete();

        return response()->json(null, 204);
    }

    public function setHours(Request $request)
    {
        $this->authorize(['developer', 'Méthode', 'admin' , 'superadmin']);

        $request->validate([
            'hour' => 'required|string',
            'models_finished' => 'required|integer',
            'date' => 'required|date',
            'product_plan_id' => 'required|integer',  
        ]);

        $productPlan = ProductPlan::findOrFail($request->product_plan_id);
        $totalModelsFinished = ProductPlanHour::where('product_plan_id', $request->product_plan_id)->sum('models_finished');
        $newTotal = $totalModelsFinished + $request->models_finished;

        if ($newTotal > $productPlan->qte) {
            return response()->json(['message' => 'Quantity cannot exceed Quantity Société.'], 400);
        }

        $productPlanHour = ProductPlanHour::create([
            'product_plan_id' => $request->product_plan_id,
            'hour' => $request->hour,
            'date' =>  $request->date,
            'models_finished' => $request->models_finished,
        ]);

        return response()->json($productPlanHour, 201);
    }

    public function getHours($id)
    {
        $this->authorize(['developer', 'Méthode', 'admin', 'superadmin']);
    
        $productPlanHours = ProductPlanHour::where('product_plan_id', $id)->get();
    
        if ($productPlanHours->isNotEmpty()) {
            return response()->json($productPlanHours);
        } else {
            return response()->json([], 200);
        }
    }
    
    public function search(Request $request)
    {
        $this->authorize(['developer', 'Méthode', 'admin', 'superadmin']);
    
        $validatedData = $request->validate([
            'hour' => 'required|string',
            'product_plan_id' => 'required|integer',
            'date' => 'required',
        ]);

        $productPlanHour = ProductPlanHour::where('hour', $validatedData['hour'])
            ->where('product_plan_id', $validatedData['product_plan_id'])
            ->where('date', $validatedData['date'])
            ->get();
    
        if ($productPlanHour->isNotEmpty()) {
            return response()->json($productPlanHour);
        } else {
            return response()->json(['message' => 'No matching plan hour found'], 200);
        }
    }

    public function getWorkedHours($modelId)
    {
        $this->authorize(['developer', 'Méthode', 'admin', 'superadmin']);
    
        // Get all product plans that match the model_id
        $productPlans = ProductPlan::where('model_id', $modelId)->get();
    
        // Check if any product plans exist
        if ($productPlans->isEmpty()) {
            return response()->json(['error' => 'No product plans found'], 404);
        }
    
        $workedHoursCount = 0;
    
        // Iterate over each product plan and count the worked hours
        foreach ($productPlans as $productPlan) {
            $workedHoursCount += ProductPlanHour::where('product_plan_id', $productPlan->id)
                ->where('models_finished', '>', 0)
                ->count();
        }
    
        return response()->json(['worked_hours_count' => $workedHoursCount]);
    }
    
    
    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
