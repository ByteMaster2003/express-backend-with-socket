import { Logger } from "../config/index.js";
import { catchAsync, ApiResponse } from "../utils/index.js";

const status = catchAsync(async (req, res) => {
  Logger.info("From status controller");

  // Send Api response
  ApiResponse.error(res);
});

export default {
  status
};
