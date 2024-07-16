<?php

namespace App\Http\Controllers;

use App\Models\ControlProduction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ControlFinalController extends Controller
{
    // Fetch the ControlProduction data for a specific model and chain
    public function show($modelId, $chainId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Contrôle_final']);

        $controlProduction = ControlProduction::where('model_id', $modelId)
                                               ->where('chain_id', $chainId)
                                               ->first();
        if ($controlProduction) {
            return response()->json($controlProduction);
        } else {
            return response()->json(['message' => 'Data not found'], 404);
        }
    }

    // Update the ControlProduction value for a specific model and chain
    public function update(Request $request, $modelId, $chainId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Contrôle_final']);

        $request->validate([
            'value' => 'required|integer',
            'retouch' => 'required|integer',
            'posts' => 'nullable|string',
        ]);

        $controlProduction = ControlProduction::updateOrCreate(
            ['model_id' => $modelId, 'chain_id' => $chainId],
            ['value' => $request->value, 'retouch' => $request->retouch, 'posts' => $request->posts]
        );

        return response()->json($controlProduction, 200);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
