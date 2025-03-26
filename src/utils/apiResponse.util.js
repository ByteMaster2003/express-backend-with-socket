import { StatusCode } from "../constants/statusCodes.js";
import { languageService } from "../services/index.js";

class ApiResponse {
  static send(res, statusCode, messageKey, data = null) {
    const lang = res.req?.language;
    return res.status(statusCode).json({
      statusCode,
      success: statusCode < 400,
      message: languageService.getMessage(messageKey, lang),
      data
    });
  }

  // Simplified success responses
  static ok(res, messageKey = "SUCCESS.DEFAULT", data = null) {
    return this.send(res, StatusCode.OK, messageKey, data);
  }

  static created(res, messageKey = "SUCCESS.CREATED", data = null) {
    return this.send(res, StatusCode.CREATED, messageKey, data);
  }

  // Simplified error responses
  static badRequest(res, messageKey = "ERROR.BAD_REQUEST", data = null) {
    return this.send(res, StatusCode.BAD_REQUEST, messageKey, data);
  }

  static notFound(res, messageKey = "ERROR.NOT_FOUND", data = null) {
    return this.send(res, StatusCode.NOT_FOUND, messageKey, data);
  }

  static error(res, messageKey = "ERROR.DEFAULT", data = null) {
    return this.send(res, StatusCode.INTERNAL_ERROR, messageKey, data);
  }
}

export { ApiResponse };
