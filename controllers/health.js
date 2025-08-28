const { constant } = require('../constant');

exports.checkHealth = async (req, res) => {
  const { c200, c500, health } = constant();
  try {
    // Send response with user data
    res.status(c200).send({ ...health.valid });
  } catch (error) {
    console.error(error);
    res.status(c500).send({ ...health.error });
  }
};
