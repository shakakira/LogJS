/**
 * LogJS (c)2013 Brett Fattori
 * Lightweight JavaScript logging framework
 * MIT Licensed
 */
(function(global, undefined){

    var LogJS = {
        ERROR: 'ERROR',
        WARN: 'WARN',
        INFO: 'INFO',

        version: 'LogJS v1.1.0'
    };

    var appenders = {};

    // This is the method for logging.  It passes off to the
    // appenders to perform the actual logging.
    var log = function (type, message, url, lineNumber) {
        var now = new Date().getTime();
        for (var appender in appenders) {
            if (appenders.hasOwnProperty(appender)) {
                appenders[appender].log(type, now, message, url, lineNumber);
            }
        }
    };

    // Redirect the onerror handler for the global object (if it exists)
    var gErrorHandler;
    if (global.onerror !== undefined) {
        gErrorHandler = global.onerror;
    }

    global.onerror = function(message, url, lineNumber) {
        log(LogJS.ERROR, '[EXCEPTION] ' + message, url, lineNumber);
        if (gErrorHandler) {
            gErrorHandler(message, url, lineNumber);
        }
    };

    // --------------------------------------------------------------------------------------------------

    LogJS.error = function(message, url, lineNumber) {
        log(LogJS.ERROR, message, url, lineNumber);
    };

    LogJS.warn = function(message, url, lineNumber) {
        log(LogJS.WARN, message, url, lineNumber);
    };

    LogJS.info = function(message, url, lineNumber) {
        log(LogJS.INFO, message, url, lineNumber);
    };

    // --------------------------------------------------------------------------------------------------

    LogJS.addAppender = function(appender) {
        if (appender !== undefined) {
            appender = new appender(LogJS.config);
            if (appender.LOGJSAPPENDER) {
                appenders[appender.name] = appender;
            }
        }
    };

    LogJS.removeAppender = function(appender) {
        if (appender !== undefined) {
            delete appenders[appender.name];
        }
    };

    LogJS.getAppender = function(appenderName) {
        return appenders[appenderName];
    };

    LogJS.getRegisteredAppenders = function() {
        var registered = [];
        for (var appender in appenders) {
            if (appenders.hasOwnProperty(appender)) {
                registered.push(appender);
            }
        }
        return registered;
    };

    LogJS.addPlugin = function(clazz) {
        if (LogJS[clazz.toString()] === undefined) {
            LogJS[clazz.toString()] = clazz;
        }
    };

    Object.defineProperty(LogJS, 'config', {
        configurable: false,
        value: {},
        writable: true,
        enumerable: false
    });

    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------

    LogJS.BaseAppender = function() {
    };

    Object.defineProperty(LogJS.BaseAppender.prototype, 'LOGJSAPPENDER', {
        configurable: false,
        value: true,
        writable: false,
        enumerable: false
    });

    LogJS.BaseAppender.prototype.log = function(type, message, url, lineNumber) {
    };

    LogJS.BaseAppender.prototype.configOpt = function(key, config, optValue) {
        return (config[this.name] && config[this.name][key]) || optValue;
    };

    Object.defineProperty(LogJS.BaseAppender.prototype, 'name', {
        configurable: false,
        value: 'LogJSBaseAppender',
        writable: true,
        enumerable: false
    });

    // Exports
    // -------

    // AMD
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return LogJS;
        });
    }
    // CommonJS
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = LogJS;
    }
    // Script tag
    else {
        global.LogJS = LogJS;
    }

})(this);