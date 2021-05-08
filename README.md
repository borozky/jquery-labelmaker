# LabelMaker

## Demo
[https://labelmaker.borozky.com](https://labelmaker.borozky.com)

## Uses
- create-react-app (React is removed)
- ES6
- jQuery
- Redux
- FileSaver.js
- JsBarcode

## Setup
```sh
yarn install
yarn start

# If setting up in production
yarn install --production=true
yarn build
```


## Dockerized setup
```sh
# Install dependencies
docker run --rm --user $(id -u):$(id -g) -v $(pwd):/app -w /app node:12-alpine3.12 yarn install

# Run the app on port 3000
docker run --rm -it --user $(id -u):$(id -g) -v $(pwd):/app -w /app -p 3000:3000 node:12-alpine3.12 yarn start
```