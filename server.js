const express = require('express');
const app = express()

require('./settings/config')(app, express);

require('./settings/db')();

require('./settings/logging')();

const routes = require('./modules');

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`> Server ready on http://localhost:${PORT}`);
});