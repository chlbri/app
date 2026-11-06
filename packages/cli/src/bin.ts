#!/usr/bin/env node

import { run } from 'cmd-ts';
import { cli } from './cli';

// oxlint-disable-next-line typescript/no-floating-promises
run(cli, process.argv.slice(2));
