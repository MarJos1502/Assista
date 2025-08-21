<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\Gender;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function test()
    {
        return response()->json([
            'success' => true,
            'message' => 'Statistics controller is working!'
        ]);
    }

    public function dashboard()
    {
        try {
            // Get applicant statistics
            $totalApplicants = Applicant::where('is_deleted', false)->count();
            $newApplicantsToday = Applicant::where('is_deleted', false)
                ->whereDate('created_at', today())
                ->count();
            
            // Get applicant gender stats
            $applicantGenderStats = DB::table('tbl_applicants')
                ->join('tbl_genders', 'tbl_applicants.gender_id', '=', 'tbl_genders.gender_id')
                ->where('tbl_applicants.is_deleted', false)
                ->where('tbl_genders.is_deleted', false)
                ->select('tbl_genders.gender', DB::raw('count(*) as count'))
                ->groupBy('tbl_genders.gender_id', 'tbl_genders.gender')
                ->get();
            
            // Get recent applicant activities
            $recentActivities = Applicant::where('is_deleted', false)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($applicant) {
                    return [
                        'message' => "Applicant {$applicant->first_name} {$applicant->last_name} registered",
                        'time' => $applicant->created_at->diffForHumans(),
                        'type' => 'registration'
                    ];
                });

            // Get system stats
            $systemStats = [
                'active_sessions' => rand(20, 30), // Placeholder
                'new_applicants_today' => $newApplicantsToday,
                'system_load' => rand(60, 80) // Placeholder
            ];
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_applicants' => $totalApplicants,
                    'gender_stats' => $applicantGenderStats,
                    'recent_activities' => $recentActivities,
                    'system_stats' => $systemStats
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Dashboard statistics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function gender()
    {
        try {
            $genderStats = DB::table('tbl_applicants')
                ->join('tbl_genders', 'tbl_applicants.gender_id', '=', 'tbl_genders.gender_id')
                ->where('tbl_applicants.is_deleted', false)
                ->where('tbl_genders.is_deleted', false)
                ->select('tbl_genders.gender', DB::raw('count(*) as count'))
                ->groupBy('tbl_genders.gender_id', 'tbl_genders.gender')
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $genderStats
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Gender statistics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch gender statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function applicant()
    {
        try {
            $totalApplicants = Applicant::where('is_deleted', false)->count();
            $newApplicantsToday = Applicant::where('is_deleted', false)
                ->whereDate('created_at', today())
                ->count();
                
            return response()->json([
                'success' => true,
                'data' => [
                    'total_applicants' => $totalApplicants,
                    'new_applicants_today' => $newApplicantsToday
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Applicant statistics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch applicant statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
