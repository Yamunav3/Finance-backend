const getHealth = (_req, res) => {
  res.json({
    status: "ok",
    service: "finance-backend",
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getHealth,
};
