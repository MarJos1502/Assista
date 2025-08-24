<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Street;
use Illuminate\Http\Request;

class StreetController extends Controller
{
    public function loadStreets()
    {
        $streets = Street::where('tbl_streets.is_deleted', false)
            ->get();

        return response()->json([
            'streets' => $streets
        ], 200);
    }

    public function storeStreet(Request $request)
    {
        $validated = $request->validate([
            'street' => ['required', 'min:3', 'max:30']
        ]);

        Street::create([
            'street' => $validated['street']
        ]);

        return response()->json([
            'message' => 'Street Successfully Saved.'
        ], 200);
    }

    public function getStreet($streetId)
    {
        $street = Street::find($streetId);

        return response()->json([
            'street' => $street
        ], 200);
    }

    public function updateStreet(Request $request, Street $street)
    {
        $validated = $request->validate([
            'street' => ['required', 'min:3', 'max:30']
        ]);

        $street->update([
            'street' => $validated['street']
        ]);

        return response()->json([
            'street' => $street,
            'message' => 'Street Successfully Updated.'
        ], 200);
    }

    public function destroyStreet(Street $street)
    {
        $street->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Street Successfully Deleted.'
        ], 200);
    }
}