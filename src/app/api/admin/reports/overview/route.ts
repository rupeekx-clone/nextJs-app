import { NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import LoanApplication from '@/models/LoanApplication';
import MembershipCard from '@/models/MembershipCard';
import BankPartner from '@/models/BankPartner';

const getOverviewReportHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const startDate = new Date(url.searchParams.get('start_date') || new Date().toISOString());
    const endDate = new Date(url.searchParams.get('end_date') || new Date().toISOString());
    // const reportType = url.searchParams.get('report_type') || 'overview';

    await connectToDatabase();

    // Get date range for previous period (for growth calculations)
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(endDate);
    const periodLength = endDate.getTime() - startDate.getTime();
    previousStartDate.setTime(previousStartDate.getTime() - periodLength);
    previousEndDate.setTime(previousEndDate.getTime() - periodLength);

    // User Analytics
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      created_at: { $gte: startDate, $lte: endDate }
    });
    const activeUsers = await User.countDocuments({ status: 'active' });
    
    // Previous period users for growth calculation
    const previousPeriodUsers = await User.countDocuments({
      created_at: { $gte: previousStartDate, $lte: previousEndDate }
    });
    const userGrowthRate = previousPeriodUsers > 0 
      ? ((newUsersThisMonth - previousPeriodUsers) / previousPeriodUsers) * 100 
      : 0;

    // Loan Analytics
    const totalApplications = await LoanApplication.countDocuments();
    const approvedApplications = await LoanApplication.countDocuments({ status: 'approved' });
    const rejectedApplications = await LoanApplication.countDocuments({ status: 'rejected' });
    const pendingApplications = await LoanApplication.countDocuments({ 
      status: { $in: ['submitted', 'under_review', 'requires_documents'] } 
    });

    // Loan amounts
    const loanAmounts = await LoanApplication.aggregate([
      {
        $group: {
          _id: null,
          total_requested: { $sum: '$amount_requested' },
          total_approved: { $sum: '$amount_approved' }
        }
      }
    ]);

    const totalAmountRequested = loanAmounts[0]?.total_requested || 0;
    const totalAmountApproved = loanAmounts[0]?.total_approved || 0;
    const approvalRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;

    // Average processing time (mock calculation)
    const averageProcessingTime = Math.floor(Math.random() * 10) + 5; // 5-15 days

    // Membership Analytics
    const totalMembershipsSold = await MembershipCard.countDocuments();
    const silverMembershipsSold = await MembershipCard.countDocuments({ 
      card_type_name: 'Silver Membership Card' 
    });
    const goldMembershipsSold = await MembershipCard.countDocuments({ 
      card_type_name: 'Gold Membership Card' 
    });

    // Previous period memberships for growth calculation
    const previousPeriodMemberships = await MembershipCard.countDocuments({
      purchase_date: { $gte: previousStartDate, $lte: previousEndDate }
    });
    const currentPeriodMemberships = await MembershipCard.countDocuments({
      purchase_date: { $gte: startDate, $lte: endDate }
    });
    const membershipGrowthRate = previousPeriodMemberships > 0 
      ? ((currentPeriodMemberships - previousPeriodMemberships) / previousPeriodMemberships) * 100 
      : 0;

    // Revenue calculation (mock)
    const revenue = (silverMembershipsSold * 199) + (goldMembershipsSold * 399);

    // Partner Analytics
    const totalPartners = await BankPartner.countDocuments();
    const activePartners = await BankPartner.countDocuments({ status: 'active' });
    const averageApprovalRate = Math.floor(Math.random() * 20) + 70; // 70-90%
    const topPerformingPartner = 'State Bank of India'; // Mock data

    const reportData = {
      users: {
        total: totalUsers,
        new_this_month: newUsersThisMonth,
        active: activeUsers,
        growth_rate: userGrowthRate,
      },
      loans: {
        total_applications: totalApplications,
        approved_applications: approvedApplications,
        rejected_applications: rejectedApplications,
        pending_applications: pendingApplications,
        total_amount_requested: totalAmountRequested,
        total_amount_approved: totalAmountApproved,
        approval_rate: approvalRate,
        average_processing_time: averageProcessingTime,
      },
      memberships: {
        total_sold: totalMembershipsSold,
        silver_sold: silverMembershipsSold,
        gold_sold: goldMembershipsSold,
        revenue: revenue,
        growth_rate: membershipGrowthRate,
      },
      partners: {
        total_partners: totalPartners,
        active_partners: activePartners,
        average_approval_rate: averageApprovalRate,
        top_performing_partner: topPerformingPartner,
      },
    };

    return NextResponse.json(reportData, { status: 200 });

  } catch (error) {
    console.error('Error generating overview report:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred while generating the report'
    }, { status: 500 });
  }
};

export const GET = withAdminAuth(getOverviewReportHandler);
