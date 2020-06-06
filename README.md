<div align="center">
  <a href="https://webpack.js.org/">
    <img width="200" height="200" vspace="" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon-square-big.svg">
  </a>
  <h1>rewrite-source-webpack-plugin</h1>
</div>

Webpack Plugin to rewrite the source before compilation. Files will be restored to their original state after compilation.

## Why?

You may want to alter the source code before compilation. (E.g. if you have templated variables.)

## Install

```bash
npm i -D rewrite-source-webpack-plugin
```

## Usage

In your `webpack.config.json`, you can rewrite source files either by path or a regular expression:

```js
  plugins: [
    ...
    new RewriteSourcePlugin([
      {
        test: /src\/App.js/,
        rewrite: (src) => {
          return src.replace(/{{foo}}/g, 'A template variable');
        }
      },
      {
        path: './src/index.html',
        rewrite: (src) => {
          return src.replace(/{{title}}/g, 'My page title');
        }
      },
      {
        path: './src/index.html',
        rewrite: (src) => {
          return src.replace(/{{description}}/g, 'My page description');
        }
      },
    ]),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
  ],
```
