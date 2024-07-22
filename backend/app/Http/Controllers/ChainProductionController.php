<?php

namespace App\Http\Controllers;

use App\Models\ChainProduction;
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
        
            $chainProduction = ChainProduction::where('model_id', $modelId)
                                              ->where('chain', $chainId)
                                              ->selectRaw('SUM(entre) as entre, SUM(sortie) as sortie, SUM(retouch) as retouch')
                                              ->first();
        
            return response()->json($chainProduction);
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
        $chain = $request->query('chain');

        if ($chain) {
            $chainProduction = ChainProduction::where('model_id', $modelId)
                                              ->where('chain_id', $chain)
                                              ->get();
        } else {
            $chainProduction = ChainProduction::where('model_id', $modelId)
                                              ->get();
        }

        if ($chainProduction->isNotEmpty()) {
            return response()->json($chainProduction);
        } else {
            return response()->json(['message' => 'Data not found'], 404);
        }
    }

    // Calculate the total sortie for a specific model
    public function calculateSortie($modelId)
    {
        $totalSortie = ChainProduction::where('model_id', $modelId)
                                      ->sum('sortie');
    
        return response()->json(['totalSortie' => $totalSortie], 200);
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
