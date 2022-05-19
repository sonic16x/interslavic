import * as fse from 'fs-extra';
import { join } from 'path';
import { exec } from 'child_process';
const regConfig = require('../regconfig.json');

const regWorkDir = regConfig.core.workingDir;
const actualDir = regConfig.core.actualDir;
const currentScreenshotsDir = '__screenshots__';

fse.removeSync(regWorkDir);
fse.removeSync(actualDir);

fse.copySync(currentScreenshotsDir, join(regWorkDir, 'expected'));

exec(`storycap -o ${actualDir} http://localhost:6006`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }

    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    exec(`reg-suit compare`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        console.log(stdout);
    });
});
