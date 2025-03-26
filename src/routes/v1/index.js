import { Router } from "express";

import authRoutes from "./auth.routes.js";
import docsRoutes from "./docs.routes.js";
import { AppConfig, swaggerSpecs } from "../../config/index.js";

const router = Router({
  mergeParams: true
});

router.use("/auth", authRoutes);

// Serve the OpenAPI spec JSON for ReDoc
router.get("/swagger.json", (req, res) => {
  res.json(swaggerSpecs);
});

if (AppConfig.NODE_ENV === "development") {
  router.use("/docs", docsRoutes);
}

export default router;
