import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/ReactPinCodeInput.tsx',
    output: [
      {
        name: 'ReactPinCodeInput',
        dir: 'dist',
        format: 'cjs',
      },
      {
        file: 'dist/ReactPinCodeInput.esm.js',
        format: 'esm',
      },
    ],
    plugins: [typescript({ include: ['./src/**/*.tsx'] })],
  },
  {
    input: 'src/ReactPinCodeInputWithPropTypes.tsx',
    output: [
      {
        name: 'ReactPinCodeInputWithPropTypes',
        dir: 'dist',
        format: 'cjs',
      },
      {
        file: 'dist/ReactPinCodeInputWithPropTypes.esm.js',
        format: 'esm',
      },
    ],
    plugins: [typescript({ include: ['./src/**/*.tsx'] })],
  },
];
