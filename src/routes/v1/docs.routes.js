import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerSpecs } from "../../config/index.js";

const router = Router({
  mergeParams: true
});

// Swagger UI route (if you still want to use Swagger UI)
router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(swaggerSpecs, {
    explorer: true
  })
);

export default router;
