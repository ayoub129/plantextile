<?php

namespace App\Http\Controllers;

use App\Models\Models;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
        $this->authorize(['logistique', 'developer']);
    
        $request->validate([
            'modele' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'photos' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'client' => 'required|string|max:255',
            'quantite_demandee' => 'required|integer',
            'quantityReceived' => 'required|integer',
            'qte_societe' => 'required|integer',
            'prixMOver' => 'required|numeric',
            'devise' => 'required|string|max:255',
            'prixFacture' => 'required|numeric',
            'dateEtude' => 'required|date',
            'cours_devise_etude' => 'required|numeric',
            'dateImport' => 'required|date',
            'cours_devise_import' => 'required|numeric',
            'dateExport' => 'required|date',
            'consStandardFil' => 'required|numeric',
            'consoStandardPlastique' => 'required|numeric',
        ]);
    
        // Handle file upload if 'photos' field is present in the request
        if ($request->hasFile('photos')) {
            $imagePath = $request->file('photos')->store('images', 'public');
        
            // Get the public path of the stored image
            $publicPath = Storage::disk('public')->url($imagePath);
        
            // Update the request with the public path
            $request->merge(['photos' => $publicPath]);
        }
            
        // Create a new Models instance with validated data
        $model = Models::create($request->all());
    
        return response()->json($model, 201);
    }
    
    public function show($id)
    {
        $this->authorize(['logistique' , 'developer' , 'admin' , 'super-admin']);

        return Models::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $this->authorize(['logistique', 'developer']);

        $model = Models::findOrFail($id);

        $validatedData = $request->validate([
            'modele' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'photos' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'client' => 'sometimes|required|string|max:255',
            'quantite_demandee' => 'sometimes|required|integer',
            'quantityReceived' => 'sometimes|required|integer',
            'qte_societe' => 'sometimes|required|integer',
            'prixMOver' => 'sometimes|required|numeric',
            'devise' => 'sometimes|required|string|max:255',
            'prixFacture' => 'sometimes|required|numeric',
            'dateEtude' => 'sometimes|required|date',
            'cours_devise_etude' => 'sometimes|required|numeric',
            'dateImport' => 'sometimes|required|date',
            'cours_devise_import' => 'sometimes|required|numeric',
            'dateExport' => 'sometimes|required|date',
            'consStandardFil' => 'sometimes|required|numeric',
            'consoStandardPlastique' => 'sometimes|required|numeric',
        ]);

        if ($request->hasFile('photos')) {
            $imagePath = $request->file('photos')->store('images', 'public');
            $validatedData['photos'] = Storage::disk('public')->url($imagePath);
        }

        $model->update($validatedData);

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
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
