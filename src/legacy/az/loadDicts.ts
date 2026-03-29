const files = [
    'grammemes.json',
    'gramtab-opencorpora-int.json',
    'meta.json',
    'p_t_given_w.intdawg',
    'paradigms.array',
    'prediction-suffixes-0.dawg',
    'prediction-suffixes-1.dawg',
    'prediction-suffixes-2.dawg',
    'prediction-suffixes-3.dawg',
    'suffixes.json',
    'words.dawg',
    'config.json',
];

export function loadDicts(dir, callback) {
    Promise.all(files.map((name) => (
        fetch(`${dir}/${name}`).then((res) => {
            if (!res.ok) {
                return null;
            }

            const isJson = name.split('.')[1] === 'json';

            if (isJson) {
                return res.json();
            }

            return res.arrayBuffer();
        })
    ))).then((data) => {
        callback(
            files.reduce((obj, name, index) => (
                {
                    ...obj,
                    [name]: data[index],
                }
            ), {})
        );
    });
}
