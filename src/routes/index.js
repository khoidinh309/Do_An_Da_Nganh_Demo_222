const siteRouter = require('./site');
const testRouter = require('./test');

function route(app) {
    app.use('/test', testRouter);
    //app.use('/update/all', updateAllController.index());
    //app.use('/', siteRouter);
}

module.exports = route;
