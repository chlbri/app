#!/usr/bin/env node

import { run } from 'cmd-ts';
import { cli } from './cli';

run(cli, process.argv.slice(2));
