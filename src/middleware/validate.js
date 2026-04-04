const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body || {},
    params: req.params || {},
    query: req.query || {},
  });

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    throw new ApiError(400, "Validation failed", issues);
  }

  req.body = result.data.body;
  req.params = result.data.params;
  req.query = result.data.query;
  next();
};

module.exports = validate;
