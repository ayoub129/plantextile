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
        $this->authorize(['developer', 'superadmin', 'admin', 'production_chain']);

        $chainProduction = ChainProduction::where('model_id', $modelId)
                                          ->where('chain', $chainId)
                                          ->whereDate('created_at', today())
                                          ->first();

        if ($chainProduction) {
            return response()->json($chainProduction);
        } else {
            return response()->json(['message' => 'Data not found'], 404);
        }
    }

    // Update the production data for a specific model and chain for today
    public function update(Request $request, $modelId, $chainId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'production_chain']);

        $request->validate([
            'production' => 'required|integer',
            'entre' => 'required|integer',
            'sortie' => 'required|integer'
        ]);

        $chainProduction = ChainProduction::where('model_id', $modelId)
                                          ->where('chain', $chainId)
                                          ->whereDate('created_at', today())
                                          ->first();

        if ($chainProduction) {
            // Update the existing record for today
            $chainProduction->update([
                'production' => $request->production,
                'entre' => $request->entre,
                'sortie' => $request->sortie
            ]);
        } else {
            // Create a new record if no record exists for today
            $chainProduction = ChainProduction::create([
                'model_id' => $modelId,
                'chain' => $chainId,
                'production' => $request->production,
                'entre' => $request->entre,
                'sortie' => $request->sortie
            ]);
        }

        return response()->json($chainProduction, 200);
    }

    // Handle retouch and posts for a specific model and chain for today
    public function retouch(Request $request, $modelId, $chainId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'production_chain']);

        $request->validate([
            'retouch' => 'required|integer',
            'posts' => 'required|string',
        ]);

        $chainProduction = ChainProduction::where('model_id', $modelId)
                                          ->where('chain', $chainId)
                                          ->whereDate('created_at', today())
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
