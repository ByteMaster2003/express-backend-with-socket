import httpStatus from "http-status";

import { ApiError, catchAsync } from "../utils/index.js";

export const verifyRole = (role) =>
  catchAsync(async (req, _, next) => {
    const { role: userRole } = req.user;
    if (role !== userRole) {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[httpStatus.FORBIDDEN]);
    }

    next();
  });
