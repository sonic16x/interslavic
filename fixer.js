const fs = require('fs');
const path = require('path');

const componentsFolder = './src/components';

const componentsList = fs.readdirSync(componentsFolder);

componentsList.forEach((componentName) => {
    const oldTsPath = path.resolve(componentsFolder, componentName, 'index.tsx');

    if (!fs.existsSync(oldTsPath)) {
        console.log(`${componentName} skip!`);
        return;
    }

    const newTsPath = path.resolve(componentsFolder, componentName, `${componentName}.tsx`);
    const newTsPathIndex = path.resolve(componentsFolder, componentName, `index.ts`);

    const oldStylePath = path.resolve(componentsFolder, componentName, 'index.scss');
    const newStylePath = path.resolve(componentsFolder, componentName, `${componentName}.scss`);

    fs.renameSync(oldTsPath, newTsPath);

    if (fs.existsSync(oldStylePath)) {
        fs.renameSync(oldStylePath, newStylePath);

        let tsContent = fs.readFileSync(newTsPath, 'utf8');

        tsContent = tsContent.replace('index.scss', `${componentName}.scss`);

        fs.writeFileSync(newTsPath, tsContent);
    }

    const indexTsContent = `export * from './${componentName}';\n`;

    fs.writeFileSync(newTsPathIndex, indexTsContent);

    console.log(`${componentName} done!`);
});
