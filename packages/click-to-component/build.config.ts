import { defineBuildConfig } from 'unbuild'
const buildConfig = defineBuildConfig({
  entries: [
    {
      input: './src/index',
      // format: 'esm',
      builder: 'rollup',
      outDir: './dist',
    },
  ],
  declaration: true,
})
export default buildConfig
