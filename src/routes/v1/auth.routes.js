import { Router } from "express";

import authController from "../../controllers/auth.controller.js";
import { rateLimiter } from "../../middlewares/index.js";

const router = Router({
  mergeParams: true
});

router.route("/status").get(rateLimiter(), authController.status);

export default router;
