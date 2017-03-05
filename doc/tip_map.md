# uber/react-map-gl
+ it use mapbox-gl.js, encount some webpack errors.

# ERROR in ./~/react-map-gl/dist/utils/transform.js
Module not found: Error: Cannot resolve 'file' or 'directory' /home/dev/frontend/windpress/node_modules/mapbox-gl/dist/mapbox-gl.js/js/geo/transform in /home/dev/frontend/windpress/node_modules/react-map-gl/dist/utils
 @ ./~/react-map-gl/dist/utils/transform.js 11:17-54


# webpack.config
```
  resolve: {
    root: paths.client(),
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      webworkify: 'webworkify-webpack',
      'mapbox-gl/js/geo/transform': path.resolve(__dirname, '../node_modules/mapbox-gl/js/geo/transform'),
      'mapbox-gl': path.resolve(__dirname, '../node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
  module: {},
  node: {
    fs: "empty"
  }

webpackConfig.module.loaders = [
    {
        test: /\.js$/,
        include: path.resolve(__dirname, '../node_modules/webworkify/index.js'),
        loader: 'worker'
    },
    {
        test: /mapbox-gl.+\.js$/,
        loader: 'transform/cacheable?brfs'
    },
{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    cacheDirectory: true,
    plugins: ['transform-runtime'],
    presets: ['es2015', 'react', 'stage-0']
  }
},
{
  test: /\.json$/,
  loader: 'json'
}]

```

