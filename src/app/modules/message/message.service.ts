import { prisma } from "../../prisma/prisma";

const getMessagesByTravelPlanId = async (travelPlanId: string) => {
    const result = await prisma.message.findMany({
        where: {
            travelPlanId,
        },
        orderBy: {
            createdAt: "asc", // Oldest to newest
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    profilePicture: true,
                },
            },
        },
    });
    return result;
};

export const MessageService = {
    getMessagesByTravelPlanId,
};
