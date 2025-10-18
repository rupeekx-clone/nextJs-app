import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import LoanApplication from '@/models/LoanApplication';
import MembershipCard from '@/models/MembershipCard';

const getDashboardStatsHandler = async (req: NextRequestWithAdmin) => {
  try {
    await connectToDatabase();

    // Get current date and 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Parallel queries for better performance
    const [
      totalUsers,
      usersLastMonth,
      pendingApplications,
      activeMemberships,
      totalApplications,
      approvedApplications,
      monthlyMemberships,
    ] = await Promise.all([
      // Total users
      User.countDocuments({ user_type: { $ne: 'admin' } }),
      
      // Users registered in last 30 days
      User.countDocuments({ 
        user_type: { $ne: 'admin' },
        createdAt: { $gte: thirtyDaysAgo }
      }),
      
      // Pending loan applications
      LoanApplication.countDocuments({ 
        status: { $in: ['submitted', 'under_review', 'requires_documents'] }
      }),
      
      // Active memberships
      MembershipCard.countDocuments({ status: 'active' }),
      
      // Total applications
      LoanApplication.countDocuments(),
      
      // Approved applications
      LoanApplication.countDocuments({ status: 'approved' }),
      
      // Memberships purchased this month
      MembershipCard.countDocuments({ 
        purchase_date: { $gte: startOfMonth }
      }),
    ]);

    // Calculate growth percentage
    const userGrowth = totalUsers > 0 ? 
      Math.round(((usersLastMonth / totalUsers) * 100) * 10) / 10 : 0;

    // Calculate approval rate
    const approvalRate = totalApplications > 0 ? 
      Math.round((approvedApplications / totalApplications) * 100) : 0;

    // Calculate monthly revenue (assuming average membership price)
    const averageMembershipPrice = 500; // Average of Silver (677) and Gold (399)
    const monthlyRevenue = monthlyMemberships * averageMembershipPrice;

    // Mock recent activities (in a real app, this would come from an activity log)
    const recentActivities = [
      {
        id: '1',
        type: 'user_registration',
        description: 'New user registered',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'success',
      },
      {
        id: '2',
        type: 'loan_application',
        description: 'Loan application submitted',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: '3',
        type: 'membership_purchase',
        description: 'Gold membership purchased',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'success',
      },
      {
        id: '4',
        type: 'loan_application',
        description: 'Loan application approved',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'success',
      },
      {
        id: '5',
        type: 'user_registration',
        description: 'New user registered',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'success',
      },
    ];

    return NextResponse.json({
      totalUsers,
      pendingApplications,
      activeMemberships,
      monthlyRevenue,
      userGrowth,
      approvalRate,
      recentActivities,
    }, { status: 200 });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred while fetching dashboard stats.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const GET = withAdminAuth(getDashboardStatsHandler);
