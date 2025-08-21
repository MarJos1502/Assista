export interface GenderStat {
    gender: string;
    count: number;
}

export interface RecentActivity {
    message: string;
    time: string;
    type: string;
}

export interface SystemStats {
    activeSessions: number;
    newApplicantsToday: number;
    systemLoad: number;
}

export interface DashboardStats {
    totalApplicants: number;
    genderStats: GenderStat[];
    recentActivities: RecentActivity[];
    systemStats: SystemStats;
}

