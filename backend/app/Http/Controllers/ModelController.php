<?php

namespace App\Http\Controllers;

use App\Models\Models;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Models::all();
    }

    public function store(Request $request)
    {
        $this->authorize(['logistique' , 'developer']);

        $request->validate([
            'code' => 'required|string|max:255',
            'categorie' => 'required|string|max:255',
            'client' => 'required|string|max:255',
            'quantite_demandee' => 'required|integer',
            'quantite_recue' => 'required|integer',
            'qte_societe' => 'required|integer',
            'prix_unitaire' => 'required|numeric',
            'devise' => 'required|string|max:255',
            'date_import' => 'required|date',
            'cours_devise_import' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $model = new Models($request->all());

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $model->image = $imagePath;
        }

        $model->save();

        return response()->json($model, 201);
    }

    public function show($id)
    {
        $this->authorize(['logistique' , 'developer' , 'admin' , 'super-admin']);

        return Models::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $this->authorize(['logistique' , 'developer' ]);

        $model = Models::findOrFail($id);

        $request->validate([
            'code' => 'sometimes|required|string|max:255',
            'categorie' => 'sometimes|required|string|max:255',
            'client' => 'sometimes|required|string|max:255',
            'quantite_demandee' => 'sometimes|required|integer',
            'quantite_recue' => 'sometimes|required|integer',
            'qte_societe' => 'sometimes|required|integer',
            'prix_unitaire' => 'sometimes|required|numeric',
            'devise' => 'sometimes|required|string|max:255',
            'date_import' => 'sometimes|required|date',
            'cours_devise_import' => 'sometimes|required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $model->update($request->all());

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $model->image = $imagePath;
        }

        return response()->json($model, 200);
    }

    public function destroy($id)
    {
        $this->authorize(['developer' ,  'super-admin']);

        $model = Models::findOrFail($id);
        $model->delete();

        return response()->json(null, 204);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->authorization_level, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
