#!/usr/bin/env node

'use strict';

var meow = require('meow');
var structureMap = require('./');

var cli = meow({
    help: [
        'Usage',
        '  structure-map [<directory>, ...]'
    ].join('\n')
});

console.log(structureMap.map(cli.input, cli.flags));
