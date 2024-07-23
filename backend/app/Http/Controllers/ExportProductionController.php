<?php

namespace App\Http\Controllers;

use App\Models\ExportProduction;
use App\Http\Requests\StoreExportProductionRequest;
use App\Http\Requests\UpdateExportProductionRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\ProductPlan;

class ExportProductionController extends Controller
{
    public function update(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);

        $request->validate([
            'value' => 'required|integer',
            'date' => 'required|date'
        ]);

        $repassageProduction = ExportProduction::create([
            'model_id' => $modelId,
            'value' => $request->value,
            'date' => $request->date
        ]);

        return response()->json($repassageProduction, 201);
    }

    public function show($modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);

        $totalProduction = ExportProduction::where('model_id', $modelId)
            ->sum('value');

        return response()->json(['total' => $totalProduction], 200);
    }

    /**
     * Get the sum of all values.
     */
    public function getTotalValue()
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);

        $totalValue = ExportProduction::sum('value');
        
        return response()->json(['total_value' => $totalValue], 200);
    }

    public function getTotalExportByModel($modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);
    
        // Fetch the product plan for the given model
        $productPlan = ProductPlan::where('model_id', $modelId)->first();
    
        if (!$productPlan) {
            return response()->json(['message' => 'No planning found for this model'], 404);
        }
    
        // Get the start and end dates of the plan
        $startDate = new \DateTime($productPlan->start_date);
        $endDate = new \DateTime($productPlan->end_date);
    
        // Create a date range
        $dateInterval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod($startDate, $dateInterval, $endDate->modify('+1 day'));
    
        // Initialize array to hold daily export values
        $dailyExportValues = [];
        foreach ($dateRange as $date) {
            $formattedDate = $date->format('Y-m-d');
            $totalExportValueForDate = ExportProduction::where('model_id', $modelId)
                ->where('date', $formattedDate)
                ->sum('value');
            
            $dailyExportValues[$formattedDate] = $totalExportValueForDate;
        }
    
        return response()->json([
            'daily_export_values' => $dailyExportValues,
            'start_date' => $productPlan->start_date,
            'end_date' => $productPlan->end_date,
        ], 200);
    }
    

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }


}
