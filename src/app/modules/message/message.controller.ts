import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { MessageService } from "./message.service";

const getMessagesByTravelPlanId = catchAsync(async (req: Request, res: Response) => {
    const { travelPlanId } = req.params;
    const result = await MessageService.getMessagesByTravelPlanId(travelPlanId);

    res.status(200).json({
        success: true,
        message: "Messages retrieved successfully",
        data: result,
    });
});

export const MessageController = {
    getMessagesByTravelPlanId,
};
