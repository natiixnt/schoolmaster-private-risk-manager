console.log('Starting ts-node register...');
require('ts-node').register({
  project: __dirname + '/tsconfig.json',
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
});
console.log('Registered ts-node, loading app...');
require('reflect-metadata');
require('./src/main');
