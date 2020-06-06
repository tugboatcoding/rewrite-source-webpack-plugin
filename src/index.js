const fs = require('fs');

class RewriteSourceWebpackPlugin {
  constructor(rewrites = []) {
    this.rewrites = rewrites;
    this.apply = this.apply.bind(this);
    this.read = this.read.bind(this);
    this.write = this.write.bind(this);
  }

  read(path) {
    return fs.readFileSync(path, 'utf8');
  }

  write(path, src) {
    fs.writeFileSync(path, src);
  }

  apply(compiler) {
    let originalSources = [];
    const reTestMods = this.rewrites.filter((m) => m.test instanceof RegExp);
    const stringTestMods = this.rewrites.filter((m) => typeof m.test === 'string');

    compiler.hooks.make.tap('rewrite-source-webpack-plugin', (compilation) => {
      compilation.hooks.buildModule.tap('rewrite-source-webpack-plugin', (module) => {
        reTestMods.forEach((modification) => {
          const { test, rewrite } = modification;
          if (test.test(module.userRequest)) {
            const path = module.userRequest;

            const src = this.read(path);
            this.write(path, rewrite(src));

            const originalSource = { path, src };
            originalSources.push(originalSource);

            console.log(`Modified ${path}...`)
          }
        });
      });

      stringTestMods.forEach((modification) => {
        const { test, rewrite } = modification;
        const path = test;

        try {
          const src = this.read(path);
          this.write(path, rewrite(src));

          const originalSource = { path, src };
          originalSources.push(originalSource);

          console.log(`Modified ${path}...`)
        }
        catch (err) {
          console.error(`Couldn\'t rewrite ${path}...`)
        }
      });
    });

    // Restore.
    compiler.hooks.done.tap('rewrite-source-webpack-plugin', () => {
      if (originalSources.length > 0) {
        originalSources.reverse().forEach((originalSource) => {
          const { path, src } = originalSource;
          fs.writeFileSync(path, src);
        });
      }
    });
  }
}

module.exports = RewriteSourceWebpackPlugin;
