import { prisma } from "../../prisma/prisma";

const getDashboardStats = async () => {
    // Aggregate queries in parallel to boost performance
    const [
        totalUsers,
        totalTravelPlans,
        completedTrips,
        totalJoinRequests,
        totalRevenueData
    ] = await Promise.all([
        prisma.user.count(),
        prisma.travelPlan.count(),
        prisma.travelPlan.count({ where: { status: "COMPLETED" } }),
        prisma.joinRequest.count(),
        prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: "succeeded",
            }
        })
    ]);

    return {
        totalUsers,
        totalTravelPlans,
        completedTrips,
        totalJoinRequests,
        totalRevenue: totalRevenueData._sum.amount || 0,
    };
};

export const AdminService = {
    getDashboardStats,
};
