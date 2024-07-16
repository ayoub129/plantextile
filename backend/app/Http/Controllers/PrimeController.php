<?php

namespace App\Http\Controllers;

use App\Models\Prime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PrimeController extends Controller
{
    public function index()
    {
        $this->authorize(['developer', 'admin', 'superadmin' , 'Méthode']);

        $primes = Prime::with('model')->get();
        return response()->json($primes);
    }

    public function store(Request $request)
    {
        $this->authorize(['developer', 'admin', 'superadmin' , 'Méthode']);

        $validated = $request->validate([
            'model_id' => 'required|exists:models,id',
            'amount' => 'required|numeric',
        ]);

        $prime = Prime::create($validated);
        $prime->load('model');
        return response()->json($prime, 201);
    }

    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'admin', 'superadmin' , 'Méthode']);

        $prime = Prime::findOrFail($id);

        $validated = $request->validate([
            'amount' => 'required|numeric',
        ]);

        $prime->update($validated);
        $prime->load('model');
        return response()->json($prime);
    }

    public function destroy($id)
    {
        $this->authorize(['developer', 'admin', 'superadmin' , 'Méthode']);

        $prime = Prime::findOrFail($id);
        $prime->delete();

        return response()->json(null, 204);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}
