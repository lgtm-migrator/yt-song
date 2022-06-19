const {build} = require('esbuild');
const glob = require('glob');

const entryPoints = glob.sync('src/**/*.ts');

// distフォルダを削除
glob.sync('dist/**/*').forEach((file) => {
  if (file.endsWith('.js')) {
    require('fs').unlinkSync(file);
  }
});

build({
  define: {'prosess.env.NODE_ENV': process.env.NODE_ENV},
  entryPoints,
  outbase: './src',
  outdir: './dist',
  platform: 'node',
  format: 'cjs',
  minify: process.env.NODE_ENV === 'production',
});
