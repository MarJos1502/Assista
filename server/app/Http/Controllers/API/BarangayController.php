<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
use Illuminate\Http\Request;

class BarangayController extends Controller
{
    public function loadBarangays()
    {
        $barangays = Barangay::where('tbl_barangays.is_deleted', false)
            ->get();

        return response()->json([
            'barangays' => $barangays
        ], 200);
    }

    public function storeBarangay(Request $request)
    {
        $validated = $request->validate([
            'barangay' => ['required', 'min:3', 'max:30']
        ]);

        Barangay::create([
            'barangay' => $validated['barangay']
        ]);

        return response()->json([
            'message' => 'barangay Successfully Saved.'
        ], 200);
    }

    public function getBarangay($barangayId)
    {
        $barangay = Barangay::find($barangayId);

        return response()->json([
            'barangay' => $barangay
        ], 200);
    }

    public function updateBarangay(Request $request, Barangay $barangay)
    {
        $validated = $request->validate([
            'barangay' => ['required', 'min:3', 'max:30']
        ]);

        $barangay->update([
            'barangay' => $validated['barangay']
        ]);

        return response()->json([
            'barangay' => $barangay,
            'message' => 'Barangay Successfully Updated.'
        ], 200);
    }

    public function destroyBarangay(Barangay $barangay)
    {
        $barangay->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Barangay Successfully Deleted.'
        ], 200);
    }
}