exports.cliVersion = '>=3.X';

var path = require('path'),
    fs = require('fs');

exports.init = function (logger, config, cli, appc) {
    cli.addHook('build.pre.compile', find);

    function find() {
        crawl(path.resolve(__dirname, '..', '..', '..'), process);
    }

    function process(files) {
        var redux = require('../../../Resources/redux');
        files.forEach(function(file) {
            var parsed = redux.R.fn.parseRJSS('' + fs.readFileSync(file, 'utf8'));
            if (parsed) {
                fs.writeFileSync(file + '.compiled', parsed);
            }
        });
    }
};

function crawl(dir, done, results) {
    if (results === undefined) {
        results = [];
    }
    fs.readdir(dir, function (err, list) {
        if (err) {
            return done(err);
        }
        filterPaths(list, done, true, dir, results);
    });
}

function filterPaths(list, done, recursive, dir, results) {
    if (results === undefined) {
        results = [];
    }
    var pending = list.length;
    if (!pending) {
        return done(results);
    }

    function checkDone() {
        if (!--pending) {
            done(results);
        }
    }

    for (var i = 0, iL = list.length; i < iL; i++) {
        var name = list[i];
        if (name[0] === '.' || name === 'build') {
            checkDone();
            continue;
        }
        var path = dir ? dir + '/' + name : name,
            stat = fs.statSync(path);
        if (!stat) {
            console.error('Stat Failed: ' + path);
            checkDone();
        }
        else if (stat.isDirectory()) {
            recursive && crawl(path, checkDone, results);
        }
        else if (/\.rjss$/.test(name)) {
            results.push(path);
            checkDone();
        }
        else {
            checkDone();
        }
    }
}