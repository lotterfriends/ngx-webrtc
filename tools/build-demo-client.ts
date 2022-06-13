import { spawn } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmdirSync, statSync } from 'fs';
import { join } from 'path';

async function execCommand(command, settings?: {showStdout: boolean}) {
  return new Promise((resolve, reject) => {
    const commandArray = command.split(' ');
    const commandExec = spawn(
      commandArray[0], commandArray.slice(1)
    );
    const stoutArray = [];

    commandExec.stdout.on('data', (data) => {
      if (settings.showStdout) {
        process.stdout.write(data.toString());
      }
      stoutArray.push(data.toString());
    });

    commandExec.stderr.on('data', (data) => {
      // console.log(data.toString());
    });

    commandExec.on('error', (err) => {
      console.log(err);
      if (err.stack) {
        console.log(err.stack);
      }
    });

    commandExec.on('exit', (code) => {
      console.log(`child process exited with ${code}`);
      if (code !== 0) {
        console.log('an error occure');
        process.exit(1);
        reject();
      }
      resolve(stoutArray.join('\n').trim());
    });
  });
}

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