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

    public function show($id)
    {
        $this->authorize(['Logistique' , 'developer' , 'admin' , 'superadmin']);

        return Models::findOrFail($id);
    }

    public function store(Request $request)
    {
        $this->authorize(['Logistique', 'developer', 'admin', 'superadmin']);
        
        $request->validate([
            'modele' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'client' => 'required|string|max:255',
            'quantite_demandee' => 'required|integer',
            'quantityReceived' => 'nullable|integer',
            'qte_societe' => 'required|integer',
            'prixMOver' => 'required|numeric',
            'devise' => 'required|string|max:255',
            'prixFacture' => 'required|numeric',
            'dateEtude' => 'nullable|date',
            'cours_devise_etude' => 'nullable|numeric',
            'dateImport' => 'required|date',
            'cours_devise_import' => 'required|numeric',
            'dateExport' => 'nullable|date',
            'consStandardFil' => 'nullable|numeric',
            'consoStandardPlastique' => 'nullable|numeric',
        ]);
    
        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }
    
        // Create new model record
        $model = new Models();
        $model->modele = $request->input('modele');
        $model->category = $request->input('category');
        $model->image = $imagePath ? Storage::url($imagePath) : null;
        $model->client = $request->input('client');
        $model->quantite_demandee = $request->input('quantite_demandee');
        $model->quantityReceived = $request->input('quantityReceived');
        $model->qte_societe = $request->input('qte_societe');
        $model->prixMOver = $request->input('prixMOver');
        $model->devise = $request->input('devise');
        $model->prixFacture = $request->input('prixFacture');
        $model->dateEtude = $request->input('dateEtude');
        $model->cours_devise_etude = $request->input('cours_devise_etude');
        $model->dateImport = $request->input('dateImport');
        $model->cours_devise_import = $request->input('cours_devise_import');
        $model->dateExport = $request->input('dateExport');
        $model->consStandardFil = $request->input('consStandardFil');
        $model->consoStandardPlastique = $request->input('consoStandardPlastique');
        
        // Save the model
        $model->save();
    
        // Return a response or redirect
        return response()->json([
            'message' => 'Model created successfully',
            'model' => $model
        ], 201);
    }
    
    
    public function update(Request $request, $id)
    {
        $this->authorize(['Logistique', 'developer', 'admin', 'superadmin']);
    
        $model = Models::findOrFail($id);
    
        $validatedData = $request->validate([
            'modele' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'client' => 'sometimes|required|string|max:255',
            'quantite_demandee' => 'sometimes|required|integer',
            'quantityReceived' => 'nullable|integer',
            'qte_societe' => 'sometimes|required|integer',
            'prixMOver' => 'sometimes|required|numeric',
            'devise' => 'sometimes|required|string|max:255',
            'prixFacture' => 'sometimes|required|numeric',
            'dateEtude' => 'nullable|date',
            'cours_devise_etude' => 'nullable|numeric',
            'dateImport' => 'sometimes|required|date',
            'cours_devise_import' => 'sometimes|required|numeric',
            'dateExport' => 'nullable|date',
            'consStandardFil' => 'nullable|numeric',
            'consoStandardPlastique' => 'nullable|numeric',
        ]);
    
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($model->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $model->image));
            }
            // Store the new image
            $imagePath = $request->file('image')->store('images', 'public');
            $validatedData['image'] = Storage::url($imagePath);
        }
    
        // Update the model with the validated data
        $model->update($validatedData);
    
        // Return a response or redirect
        return response()->json([
            'message' => 'Model updated successfully',
            'model' => $model
        ], 200);
    }
    
    public function destroy($id)
    {
        $this->authorize(['Logistique' , 'developer' , 'admin' , 'superadmin']);

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
