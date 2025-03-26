import httpStatus from "http-status";

import { tokenUtil, ApiError, catchAsync } from "../utils/index.js";

export const verifyAccess = catchAsync(async (req, _, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]);
  }

  const payload = await tokenUtil.verifyAccessToken(token);
  req.user = payload;
  next();
});
