// Run tests in a timezone ahead of UTC, where converting a local date through
// toISOString() moves it to the previous day. Catches timezone bugs.
module.exports = () => {
  process.env.TZ = "Europe/Rome";
};
