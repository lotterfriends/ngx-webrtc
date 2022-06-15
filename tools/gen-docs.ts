import { exec } from 'child_process';
import { promisify } from 'util';
import { execCommand } from './util';
const pexec = promisify(exec);

const run = async () => {
  await pexec('npm run gen:typedoc');
  await pexec('tail -n +6 libs/ngx-webrtc/docs/modules.md > libs/ngx-webrtc/readme/06_02_api_toc.md');
  await pexec('ls libs/ngx-webrtc/readme | while read line; do cat libs/ngx-webrtc/readme/$line; done > libs/ngx-webrtc/README.md');
  await pexec('npm run gen:typedoc'); // to refresh readme in docs folder with TOC
}

run();