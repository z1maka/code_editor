import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage';
import axios from 'axios';

const cache = localForage.createInstance({
  name: 'cache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, async () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await cache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) return cachedResult;
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: `const style = document.createElement('style');
                     style.innerText = '${escaped}';
                     document.head.appendChild(style);`,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await cache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await cache.setItem(args.path, result);
        return result;
      });
    },
  };
};
