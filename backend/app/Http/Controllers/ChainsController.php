<?php

namespace App\Http\Controllers;

use App\Models\Chains;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChainsController extends Controller
{
    // Get all chains
    public function index()
    {
        $this->authorize(['Méthode' , 'developer' , 'admin' , 'superadmin']);

        $chains = Chains::all();
        return response()->json($chains);
    }

    // Get a single chain
    public function show($id)
    {
        $this->authorize(['Méthode' , 'developer' , 'admin' , 'superadmin']);

        $chain = Chains::find($id);
        if ($chain) {
            return response()->json($chain);
        } else {
            return response()->json(['message' => 'Chain not found'], 404);
        }
    }

    // Create a new chain
    public function store(Request $request)
    {
        $this->authorize(['Méthode' , 'developer' , 'admin' , 'superadmin']);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $chain = Chains::create([
            'name' => $request->name,
        ]);

        return response()->json($chain, 201);
    }

    // Delete a chain
    public function destroy($id)
    {
        $this->authorize(['Méthode' , 'developer' , 'admin' , 'superadmin']);

        $chain = Chains::find($id);

        if ($chain) {
            $chain->delete();
            return response()->json(['message' => 'Chain deleted successfully']);
        } else {
            return response()->json(['message' => 'Chain not found'], 404);
        }
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}
