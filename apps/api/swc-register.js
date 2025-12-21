require('@swc/register')({
  extensions: ['.ts', '.tsx'],
  swcrc: false,
  jsc: {
    parser: {
      syntax: 'typescript',
      decorators: true,
      dynamicImport: true,
    },
    transform: {
      decoratorMetadata: true,
    },
  },
  module: {
    type: 'commonjs',
  },
});
