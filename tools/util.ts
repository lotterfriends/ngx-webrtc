import { spawn } from 'child_process';

export async function execCommand(command, settings?: {showStdout: boolean}) {
  return new Promise((resolve, reject) => {
    const commandArray = command.split(' ');
    const commandExec = spawn(
      commandArray[0], commandArray.slice(1)
    );
    const stoutArray: string[] = [];

    commandExec.stdout.on('data', (data) => {
      if (settings?.showStdout) {
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