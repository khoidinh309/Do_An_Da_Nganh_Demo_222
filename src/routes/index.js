const siteRouter = require('./site');
const testRouter = require('./test');

function route(app) {
    //app.use('/update/all', updateAllController.index());
    app.use('/', siteRouter);
}

module.exports = route;
