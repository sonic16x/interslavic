<h1>
  <img src="src/components/Header/images/logo-icon.svg" alt="Logo" height="32" width="48">
  Interslavic language dictionary
</h1>

[https://interslavic-dictionary.com](https://interslavic-dictionary.com)  

## Installation
Recommended to use and install as PWA (Progressive Web App):

| <video width="341" src="https://github.com/user-attachments/assets/41363610-9e66-4912-83d9-f6c0b537f11b" title="iOS"></video> | <video width="360" src="https://github.com/user-attachments/assets/db4a56ff-0363-47c0-82db-ff9b2e0ca000" title="Android"></video> |
|---|---|

## Development

For start local development install dependencies
```
npm ci
```

then run generate dictionary
```
npm run generate-dictionary
```

and now you can start dev server
```
npm run dev
```

## Testing

We have a [storybook](https://master--673f7516f3447911dae3b204.chromatic.com)

For some functions we have a unit tests
```
npm run test:unit
```
also we have playwright tests for main using flows, for run it install playwright
```
npx playwright install --with-deps
```
then you can start tests cli
```
npm run test:pw
```
or run it in ui mode
```
npx playwright test --ui 
```

## Acknowledgements

Using dictionary from: [http://steen.free.fr/interslavic/dynamic_dictionary.html](http://steen.free.fr/interslavic/dynamic_dictionary.html)  

