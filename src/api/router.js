const fs = require('fs');
const path = require('path');
const routesDir = path.join(__dirname, '/routes');

module.exports = (app) => {
  fs.readdirSync(routesDir).forEach((dir) => {
    const router = require(path.join(routesDir, dir));
    app.use(`/api/${router.route}`, router.endpoints);
  });
};
