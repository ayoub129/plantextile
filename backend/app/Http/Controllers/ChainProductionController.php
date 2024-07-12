<?php

namespace App\Http\Controllers;

use App\Models\ChainProduction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChainProductionController extends Controller
{
    // Fetch the CoupeProduction data for a specific model
    public function show($modelId, $chainId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'production_chain']);

        $chainProduction = ChainProduction::where('model_id', $modelId)
                                          ->where('chain_id', $chainId)
                                          ->first();

        if ($chainProduction) {
            return response()->json($chainProduction);
        } else {
            return response()->json(['message' => 'Data not found'], 404);
        }
    }

    // Update the CoupeProduction value for a specific model
    public function update(Request $request, $modelId, $chainId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'production_chain']);

        $request->validate([
            'value' => 'required|integer'
        ]);

        $chainProduction = ChainProduction::updateOrCreate(
            ['model_id' => $modelId, 'chain_id' => $chainId],
            ['value' => $request->value]
        );

        return response()->json($chainProduction, 200);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}