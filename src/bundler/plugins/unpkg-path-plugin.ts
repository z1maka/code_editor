import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = {
  name: 'unpkg-path-plugin',
  setup(build: esbuild.PluginBuild) {
    // Для загрузки руут файла
    build.onResolve({ filter: /(^index\.js$)/ }, async (args: any) => {
      return { path: args.path, namespace: 'a' };
    });

    // Для загрузки модулей в руут модуль если такие есть
    build.onResolve({ filter: /^\.+\// }, async (args: any) => {
      return {
        namespace: 'a',
        path: new URL(args.path, `https://unpkg.com/${args.resolveDir}/`).href,
      };
    });

    // Для загрузки общих файлов модуля
    build.onResolve({ filter: /.*/ }, async (args: any) => {
      return {
        namespace: 'a',
        path: `https://unpkg.com/${args.path}`,
      };
    });
  },
};
