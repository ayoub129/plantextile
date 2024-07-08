<?php

namespace App\Http\Controllers;

use App\Models\Coupe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoupeController extends Controller
{
    public function index()
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        return Coupe::all();
    }

    public function store(Request $request)
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        $request->validate([
            'effectif_indirect_id' => 'required|exists:effectif_indirects,id',
            'matlasseurs' => 'nullable|integer',
            'coupeurs' => 'nullable|integer',
            'tiquitage' => 'nullable|integer',
            'vesline' => 'nullable|integer',
        ]);

        $coupe = new Coupe($request->all());
        $coupe->save();

        return response()->json($coupe, 201);
    }

    public function show($id)
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        return Coupe::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        $coupe = Coupe::findOrFail($id);

        $request->validate([
            'matlasseurs' => 'nullable|integer',
            'coupeurs' => 'nullable|integer',
            'tiquitage' => 'nullable|integer',
            'vesline' => 'nullable|integer',
        ]);

        $coupe->update($request->all());

        return response()->json($coupe, 200);
    }

    public function destroy($id)
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        $coupe = Coupe::findOrFail($id);
        $coupe->delete();

        return response()->json(null, 204);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
