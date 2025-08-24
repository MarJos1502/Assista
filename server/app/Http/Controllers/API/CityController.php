<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function loadCitys()
    {
        $citys = City::where('tbl_citys.is_deleted', false)
            ->get();

        return response()->json([
            'citys' => $citys
        ], 200);
    }

    public function storeCity(Request $request)
    {
        $validated = $request->validate([
            'city' => ['required', 'min:3', 'max:30']
        ]);

        City::create([
            'city' => $validated['city']
        ]);

        return response()->json([
            'message' => 'City Successfully Saved.'
        ], 200);
    }

    public function getCity($cityId)
    {
        $city = City::find($cityId);

        return response()->json([
            'city' => $city
        ], 200);
    }

    public function updateCity(Request $request, City $city)
    {
        $validated = $request->validate([
            'city' => ['required', 'min:3', 'max:30']
        ]);

        $city->update([
            'city' => $validated['city']
        ]);

        return response()->json([
            'city' => $city,
            'message' => 'City Successfully Updated.'
        ], 200);
    }

    public function destroyCity(City $city)
    {
        $city->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'City Successfully Deleted.'
        ], 200);
    }
}