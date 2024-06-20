<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    public function index()
    {
        $this->authorize(['developer', 'superadmin']);

        $companies = Company::all();
        return response()->json($companies);
    }

    public function store(Request $request)
    {
        $this->authorize(['developer', 'superadmin']);

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $company = Company::create($request->all());
        return response()->json($company, 201);
    }

    public function destroy($id)
    {
        $this->authorize(['developer', 'superadmin']);

        $company = Company::findOrFail($id);
        $company->delete();

        return response()->json(null, 204);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}
