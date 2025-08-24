<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\House;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function loadHouses()
    {
        $houses = House::where('tbl_houses.is_deleted', false)
            ->get();

        return response()->json([
            'houses' => $houses
        ], 200);
    }

    public function storeHouse(Request $request)
    {
        $validated = $request->validate([
            'house' => ['required', 'min:3', 'max:30']
        ]);

        House::create([
            'house' => $validated['house']
        ]);

        return response()->json([
            'message' => 'House Successfully Saved.'
        ], 200);
    }

    public function getHouse($houseId)
    {
        $house = House::find($houseId);

        return response()->json([
            'house' => $house
        ], 200);
    }

    public function updateHouse(Request $request, House $house)
    {
        $validated = $request->validate([
            'house' => ['required', 'min:3', 'max:30']
        ]);

        $house->update([
            'house' => $validated['house']
        ]);

        return response()->json([
            'house' => $house,
            'message' => 'House Successfully Updated.'
        ], 200);
    }

    public function destroyHouse(House $house)
    {
        $house->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'House Successfully Deleted.'
        ], 200);
    }
}