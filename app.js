const path = require('path');
const express = require('express');
const logger = require('morgan');
const methodOverride = require('method-override');
const multer  = require('multer');
const server = initServer(initControllers(initMiddleware(initApp())));

require("./serverIO").init(server);
function initApp() {
    let app = express();
    app.set("view engine", "ejs");

    require('ejsc-views').compile();
    require("./model").connect();

    return app;
}

function initMiddleware(app) {
    app.use(logger('dev'));
    app.use(express.urlencoded( {
        extended: false
    }));
    app.use(express.json({limit: '4MB'}));
    app.use("/home",multer().none());

    let staticOptions = {
        "setHeaders" : function (res, path, stat) {
            if(path.includes(".js")){
                res.set("Content-type", "text/javascript")
            }
        }
    };
    app.use(express.static(path.join(__dirname, "public"), staticOptions));
    app.use(methodOverride("_method"));
    return app;
}
function initControllers(app) {
    const routers = require("./routes");
    app.use("/home/login/register",routers["register"]);
    app.use("/home/login",routers["login"]);
    app.use("/home",routers["home"]);
    


    app.use(function(req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err)
    });
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        })
    });

    return app;
}

function initServer(app) {

    app.set("port", process.env.PORT || 8989);

    let server = app.listen(app.get("port"));

    server.on('listening', function() {
        console.log('Express server listening on http://localhost:' + server.address().port);
    });

    return server;
}