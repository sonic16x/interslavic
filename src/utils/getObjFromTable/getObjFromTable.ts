export function getObjFromTable(rawData: string[][], fields: string[]): any[] {
    const header = rawData.slice(0, 1)[0];
    const data = rawData.slice(1);
    const fieldNameIndexMap = {};

    fields.forEach((fieldName) => {
        fieldNameIndexMap[fieldName] = header.indexOf(fieldName);
    });

    return data.map((line) => {
        const obj = {};

        header.forEach((fieldName) => {
            obj[fieldName] = line[fieldNameIndexMap[fieldName]];
        })

        return obj;
    });
}
