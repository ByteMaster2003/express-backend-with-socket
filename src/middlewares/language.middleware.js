export const languageMiddleware = (req, _, next) => {
  // Check Accept-Language header or query parameter
  const lang =
    req.headers["accept-language"]?.split(",")[0]?.split("-")[0] || req.query.lang || "en";

  // Attach language to request object
  req.language = ["en", "hi"].includes(lang) ? lang : "en";
  next();
};
