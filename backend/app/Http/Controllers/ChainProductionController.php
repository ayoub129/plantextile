<?php

namespace App\Http\Controllers;

use App\Models\ChainProduction;
use App\Models\ProductPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChainProductionController extends Controller
{
    // Fetch the production data for a specific model and chain for today
    public function show($modelId, $chainId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Chaîne_production_entrée', 'Chaîne_production_sortie']);

        $chainProduction = ChainProduction::where('model_id', $modelId)
                                          ->where('chain', $chainId)
                                          ->sum('entre');

        return response()->json($chainProduction);
    }

        // Fetch the production data for a specific model and chain for today
        public function showSortie($modelId, $chainId)
        {
            $this->authorize(['developer', 'superadmin', 'admin', 'Chaîne_production_entrée', 'Chaîne_production_sortie']);
            
            // Get the sum of 'entre' and 'retouch'
            $sumValues = ChainProduction::where('model_id', $modelId)
                                        ->where('chain', $chainId)
                                        ->selectRaw('SUM(entre) as entre, SUM(retouch) as retouch')
                                        ->first();
        
            // Get the latest 'sortie' value
            $latestSortie = ChainProduction::where('model_id', $modelId)
                                            ->where('chain', $chainId)
                                            ->latest('created_at') 
                                            ->value('sortie'); 
        
            return response()->json([
                'entre' => $sumValues->entre ?? 0, 
                'retouch' => $sumValues->retouch ?? 0, 
                'sortie' => $latestSortie ?? 0,
            ]);
        }
                    

    // Update the production data for a specific model and chain for today
    public function update(Request $request, $modelId, $chainId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Chaîne_production_entrée', 'Chaîne_production_sortie']);

        $request->validate([
            'entre' => 'nullable|integer',
            'sortie' => 'nullable|integer'
        ]);

        $chainProduction = ChainProduction::create([
            'model_id' => $modelId,
            'chain' => $chainId,
            'entre' => $request->entre,
            'sortie' => $request->sortie
        ]);

        return response()->json($chainProduction, 201);
    }

    public function getChainData(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Chaîne_production_entrée', 'Chaîne_production_sortie']);
        
        $chainId = $request->query('chain');
    
        // Create a query to fetch production data
        $query = ChainProduction::where('model_id', $modelId);
    
        if ($chainId) {
            $query->where('chain', $chainId);
        }
    
        // Fetch data grouped by 'chain'
        $chainData = $query->get()
            ->groupBy('chain')
            ->map(function ($items, $chain) {
                $totalEntre = $items->sum('entre');
                $latestSortie = $items->sortByDesc('created_at')->first()->sortie ?? 0;
                
                return [
                    'totalEntre' => $totalEntre,
                    'latestSortie' => $latestSortie
                ];
            });
    
        if ($chainData->isEmpty()) {
            return response()->json(['message' => 'Data not found'], 404);
        }
    
        return response()->json($chainData);
    }
    
    // Calculate the total sortie for a specific model
    public function calculateSortie($modelId)
    {
        $latestChainProduction = ChainProduction::where('model_id', $modelId)
        ->latest('created_at') 
        ->first();
    
        return response()->json(['totalSortie' => $latestChainProduction], 200);
    }

    // Calculate the total sortie for a specific model
    public function getTotalExportByModel($modelId, $date = null)
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
            $sortie = ChainProduction::where('model_id', $modelId)
                ->whereDate('created_at', $date)
                ->get();

            $dailyPlanning[$date] = $sortie;
        } else {
            // Get daily sum for each date in the range
            foreach ($dateRange as $dateObj) {
                $formattedDate = $dateObj->format('Y-m-d');
    
                $dailySum = ChainProduction::where('model_id', $modelId)
                    ->whereDate('created_at', $formattedDate)
                    ->sum('sortie');
    
                $dailyPlanning[$formattedDate] = $dailySum;
            }
        }
    
        return response()->json([
            'planning' => $dailyPlanning,
            'start_date' => $productPlan->start_date,
            'end_date' => $productPlan->end_date,
        ]);
    }
        
    // Calculate the total sortie for a specific model
    public function calculateEntre($modelId)
    {
        $totalEntre = ChainProduction::where('model_id', $modelId)
                                      ->sum('entre');

       return response()->json(['totalEntre' => $totalEntre], 200);
    }
    

    // Handle retouch and posts for a specific model and chain for today
    public function retouch(Request $request, $modelId, $chainId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Chaîne_production_entrée', 'Chaîne_production_sortie']);

        $request->validate([
            'retouch' => 'required|integer',
            'posts' => 'required|string',
        ]);

        $chainProduction = ChainProduction::where('model_id', $modelId)
                                          ->where('chain', $chainId)
                                          ->first();

        if ($chainProduction) {
            $chainProduction->update([
                'retouch' => $request->retouch,
                'posts' => $request->posts
            ]);
        } else {
            $chainProduction = ChainProduction::create([
                'model_id' => $modelId,
                'chain' => $chainId,
                'retouch' => $request->retouch,
                'posts' => $request->posts
            ]);
        }

        return response()->json($chainProduction, 200);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
