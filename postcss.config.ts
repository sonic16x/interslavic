import purgecss from '@fullhuman/postcss-purgecss'

module.exports = {
    plugins: [
        purgecss({
            content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
    ],
}
