import { defineConfig } from 'tsup'
import pkg from './package.json'

function externalWithIncludes(packages: string[] = []) {
  const deps = pkg.dependencies || {}
  const peerDeps = pkg.peerDependencies || {}
  return Object.keys({...deps,...peerDeps}).filter(packageName => {
    return !packages.includes(packageName)
  })
}

export default defineConfig(() => {

  return {
    entryPoints: ['src/index.ts'],
    format: ['cjs'],
    target: 'node12',
    platform: 'node',
    // legacyOutput: true,
    minify: false,
    sourcemap: true,
    clean: true,
    dts: true,
    define: {
      'process.env.NODE_ENV': '"production"',
      __TEST__: 'false',
    },
    /**
     * 将文件或包标记为外部文件，以便将其从构建中排除。
     * 导入将被保留(对ilife和cjs格式使用require，对esm格式使用import)，并将在运行时进行引入。
     * 默认情况下 tsup 会将 dependencies 和 peerDependencies 标记为 external
     */
    external: externalWithIncludes([]),
    banner: {
      js: `/**\n * name: ${pkg.name}\n * version: ${pkg.version}\n */`,
    },
    esbuildOptions(opts) {
      // opts.inject = (opts.inject || []).filter(p => !p.includes('_shims'))
    },
    onSuccess: ``,
  }
})
