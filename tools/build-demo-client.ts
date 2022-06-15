import { copyFileSync, existsSync, mkdirSync, readdirSync, rmdirSync, statSync } from 'fs';
import { join } from 'path';
import { execCommand } from './util';

var copyRecursiveSync = function(src: string, dest: string) {
  var exists = existsSync(src);
  var stats = exists && statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!existsSync(dest)) {
      mkdirSync(dest);
    }
    readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(join(src, childItemName),join(dest, childItemName));
    });
  } else {
    copyFileSync(src, dest);
  }
};


const run = async () => {
  rmdirSync('work', { recursive: true });
  await execCommand('npx nx build --prod demo-video-chat-server', {showStdout: true});
  await execCommand('npx nx build --prod demo-video-chat-client', {showStdout: true});
  await execCommand('npx ncc build dist/apps/demo-video-chat-server/main.js -o work', {showStdout: true});
  const frontendTarget = 'work/client';
  copyRecursiveSync(`dist/apps/demo-video-chat-client/`, frontendTarget);
}

run();