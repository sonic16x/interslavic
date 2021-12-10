const fs = require('fs');
const path = require('path');

const utilsFolder = './src/utils';

const utilsList = fs.readdirSync(utilsFolder).filter((name) => !name.includes('test'));

utilsList.forEach((utilNameRaw) => {
    const utilName = utilNameRaw.replace('.ts', '');
    const oldFilePath = path.resolve(utilsFolder, `${utilName}.ts`);
    const newFilePath = path.resolve(utilsFolder, utilName, `${utilName}.ts`);

    const oldTestFilePath = path.resolve(utilsFolder, `${utilName}.test.ts`);
    const newTestFilePath = path.resolve(utilsFolder, utilName, `${utilName}.test.ts`);

    const dirName = path.resolve(utilsFolder, utilName);
    const indexName = path.resolve(dirName, 'index.ts');

    fs.mkdirSync(dirName);
    fs.renameSync(oldFilePath, newFilePath);

    if (fs.existsSync(oldTestFilePath)) {
        fs.renameSync(oldTestFilePath, newTestFilePath);
    }

    const indexContent = `export * from './${utilName}';\n`;

    fs.writeFileSync(indexName, indexContent);

    console.log(`${utilName} done!`);
});
