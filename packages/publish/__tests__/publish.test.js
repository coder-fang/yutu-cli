'use strict';

const publish = require('..');
const assert = require('assert').strict;

assert.strictEqual(publish(), 'Hello from publish');
console.info("publish tests passed");
