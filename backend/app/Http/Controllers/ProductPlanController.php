<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductPlan;
use App\Models\ProductPlanHour;
use App\Models\Model;
use Illuminate\Support\Facades\Auth;

class ProductPlanController extends Controller
{
    public function index()
    {
        $this->authorize(['developer' , 'Method' ,'admin']);

        $productPlans = ProductPlan::all();
        return response()->json($productPlans);
    }

    public function store(Request $request)
    {
        $this->authorize(['developer' , 'Method' ,'admin']);

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'qte' => 'required|integer',
            'model_id' => 'required|exists:models,id',
            'chain' => 'required|string',
            'consummation_standard_fil' => 'required|integer',
            'consummation_standard_plastique' => 'required|integer',
        ]);

        $productPlan = ProductPlan::create($request->all());

        return response()->json($productPlan, 201);
    }

    public function show(ProductPlan $productPlan)
    {
        $this->authorize(['developer' , 'Method' ,'admin']);

        $hours = $productPlan->productPlanHours;

        return response()->json(['productPlan' => $productPlan, 'hours' => $hours]);
    }

    public function update(Request $request, ProductPlan $productPlan)
    {
        $this->authorize(['developer' , 'Method' ,'admin']);

        $request->validate([
            'start_date' => 'date',
            'end_date' => 'date',
            'qte' => 'integer',
            'model_id' => 'exists:models,id',
            'chain' => 'string',
            'consummation_standard_fil' => 'integer',
            'consummation_standard_plastique' => 'integer',
        ]);

        $productPlan->update($request->all());

        return response()->json($productPlan);
    }

    public function destroy(ProductPlan $productPlan)
    {
        $this->authorize(['developer' , 'Method' ,'admin']);

        $productPlan->delete();

        return response()->json(null, 204);
    }

    public function storeHour(Request $request, $productPlanId)
    {
        $this->authorize(['developer' , 'Method' ,'admin']);

        $request->validate([
            'hour' => 'required|integer',
            'models_finished' => 'required|integer',
        ]);

        $productPlanHour = ProductPlanHour::create([
            'product_plan_id' => $productPlanId,
            'hour' => $request->hour,
            'models_finished' => $request->models_finished,
        ]);

        return response()->json($productPlanHour, 201);
    }

    public function getHours($productPlanId)
    {
        $this->authorize(['developer' , 'Method' ,'admin']);

        $productPlan = ProductPlan::findOrFail($productPlanId);
        $hours = $productPlan->productPlanHours;

        return response()->json($hours);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->authorization_level, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}
