/**
 * @copyright Copyright (c) 2014 X.commerce, Inc. (http://www.magentocommerce.com)
 */

/* global __dirname: true */

module.exports = function (grunt) {
    'use strict';

    var connect     = require('connect'),
        logger      = require('morgan'),
        serveStatic = require('serve-static'),
        fs          = require('fs');

    /**
     * Defines if passed file path exists
     *
     * @param  {String} path
     * @return {Boolean}
     */
    function exists(path) {
        return fs.existsSync(path);
    }

    /**
     * Restricts url's which lead to '/_SpecRunner.html', '/dev/tests' or '.grunt' folders from being modified
     *
     * @param  {String} url
     * @return {Boolean}
     */
    function canModify(url) {
        return url.match(/^\/(\.grunt)|(dev\/tests)|(_SpecRunner\.html)/) === null;
    }

    grunt.registerMultiTask('specRunner', function () {
        var app = connect(),
            options,
            area,
            theme,
            share,
            middlewares;

        options = this.options({
            port: 3000,
            theme: 'blank',
            areaDir: 'adminhtml',
            shareDir: 'base',
            enableLogs: false,
            middleware: null
        });

        area        = options.areaDir;
        share       = options.shareDir;
        theme       = options.theme;

        if (options.enableLogs) {
            app.use(logger('dev'));
        }

        app.use(function (req, res, next) {
            var url     = req.url,
                match   = url.match(/^\/([A-Z][^\/]+)_(\w+)\/(.+)$/),
                app,
                module,
                path,
                getModuleUrl,
                getThemeUrl;

            /**
             * Returns path to theme root folder
             *
             * @return {String}
             */
            function themeRoot() {
                return [
                    '/app/design',
                    area,
                    app,
                    theme
                ].join('/');
            }

            /**
             * Based on 'thematic' parameter, returnes either path to theme's lib,
             *     or 'lib/web'.
             *
             * @param  {Boolean} thematic
             * @return {String}
             */
            function lib(thematic) {
                return thematic ? themeRoot() + '/web' : '/lib/web';
            }

            if (match !== null) {
                app     = match[1];
                module  = match[2];
                path    = match[3];

                /**
                 * Assembles modular path. If 'shared' flag provided and is truthy,
                 *     will use share dir instead of area one.
                 *
                 * @param  {Boolean} shared
                 * @return {String}
                 */
                getModuleUrl = function (shared) {
                    return [
                        '/app/code',
                        app,
                        module,
                        'view',
                        shared ? share : area,
                        'web',
                        path
                    ].join('/');
                };

                /**
                 * Assembles theme modular path.
                 *
                 * @return {String}
                 */
                getThemeUrl = function () {
                    return [
                        themeRoot(),
                        app + '_' + module,
                        'web',
                        path
                    ].join('/');
                };

                url = exists(url = getThemeUrl()) ? url : getModuleUrl(true);

            } else if (canModify(url)) {
                url = (exists(url = lib(true)) ? url : lib()) + req.url;
            }

            req.url = url;

            next();
        });

        if (options.middleware && typeof options.middleware === 'function') {
            middlewares = options.middleware(connect, options);

            if (Array.isArray(middlewares)) {
                middlewares.forEach(function (middleware) {
                    app.use(middleware);
                });
            }
        }

        app.use(serveStatic(__dirname));

        app.listen(options.port);
    });
};
