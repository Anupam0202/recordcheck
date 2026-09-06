import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';import path from 'node:path';
const require=createRequire(import.meta.url);let tsc;
try{tsc=path.join(path.dirname(require.resolve('typescript/package.json')),'bin/tsc');}catch{console.error('Optional development compiler missing. Install TypeScript 7.0.2 in an authorized networked environment, then rerun. Build/test/demo need no package installation.');process.exit(1);}
const p=spawnSync(process.execPath,[tsc,'-p','tsconfig.json'],{stdio:'inherit'});process.exit(p.status??1);
