# bootstrap-scss 如何以全局方式编译
参考 [Use bootstrap-sass instead of css](https://github.com/davezuko/react-redux-starter-kit/issues/474)  
原理为：修改 webpack.config.js，在scssloader中加入忽略的路径exclude.

```
@tgfisher - I was interested in how @immuzov found that out too.
After a bit of digging around, I too managed to narrow it down to the same lines.
The exception is thrown by postcss-modules-local-by-default.
The postcss-modules-local-by-default plugin is called by css-loader and at this point sass-loader has already finished compiling bootstrap.scss similar to this simplified example:
@mixin button-variant() {
  .open > &.dropdown-toggle {
    color: blue;
  }
}
:global {
  .btn {
    @include mixin();
  }
}
Compiles to:
.open > :global .btn.dropdown-toggle {
  color: blue;
}
With CSS modules being local by default, we really want :global .open > .btn.dropdown-toggle.
Bootstrap doesn't currently like being wrapped in a :global {} because it uses the SASS parent selector (&) which breaks out of the :global {}, and worse because it does it after a >.
The actual error message Missing whitespace before :global is here because :global<space>selector cannot follow the immediate child selector (>). What would it mean? An immediate but not neccessarily immediate descendant of localised .open called .btn.dropdown-toggle? The postcss-modules-local-by-default plugin could understand it if there was a space (descendent selector) rather than > (immediate selector) preceding :global.
Who is at fault? Bootstrap, SASS, postcss-modules-local-by-default, or us for trying to wrap Bootstrap in :global {}?
Is there a neat way we can include bootstrap.scss globally without using :global {} and not sending it through css-loader's local-by-default plugin?
EDIT:
I ended up adding a file src/styles/global/global.scss which includes bootstrap and updating my includes/excludes in webpack.config.js. All files outside src/ except src/styles/global/ are now global by default.
import path from 'path'
...

webpackConfig.module.loaders.push({
  test: /\.scss$/,
  include: pathStr => pathStr.startsWith(paths.client()),
  exclude: pathStr => pathStr.startsWith(paths.client(path.normalize('styles/global'))),
  loaders: [
    'style',
    cssLoader,
    'postcss',
    'sass?sourceMap'
  ]
})

webpackConfig.module.loaders.push({
  test: /\.css$/,
  include: pathStr => pathStr.startsWith(paths.client()),
  exclude: pathStr => pathStr.startsWith(paths.client(path.normalize('styles/global'))),
  loaders: [
    'style',
    cssLoader,
    'postcss'
  ]
})

// All other CSS/SCSS is global by default
webpackConfig.module.loaders.push({
  test: /\.scss$/,
  exclude: pathStr => pathStr.startsWith(paths.client()) && !pathStr.startsWith(paths.client(path.normalize('styles/global'))),
  loaders: [
    'style',
    'css?sourceMap&-minimize',
    'postcss',
    'sass?sourceMap'
  ]
})

webpackConfig.module.loaders.push({
  test: /\.css$/,
  exclude: pathStr => pathStr.startsWith(paths.client()) && !pathStr.startsWith(paths.client(path.normalize('styles/global'))),
  loaders: [
    'style',
    'css?sourceMap&-minimize',
    'postcss'
  ]
})
```

# bootstrap-sass 字体文件未生成问题
主要原因是里面的font-path函数未实现。看下面详解：  
I test all the methods about "glyph icons" mentioned above but all failed. the font-file have not generated.  
Method1:  
```
global.scss:
$bootstrap-sass-asset-helper: true;
@import '~bootstrap-sass/assets/stylesheets/_bootstrap.scss';

result:
@font-face{font-family:Glyphicons Halflings;src:url(twbs-font-path("bootstrap/glyphicons-halflings-regular.eot"));src:url(twbs-font-path("bootstrap/glyphicons-halflings-regular.eot?#iefix")) format("embedded-opentype"),url(twbs-font-path("bootstrap/glyphicons-halflings-regular.woff2")) format("woff2"),url(twbs-font-path("bootstrap/glyphicons-halflings-regular.woff")) format("woff"),url(twbs-font-path("bootstrap/glyphicons-halflings-regular.ttf")) format("truetype"),url(twbs-font-path("bootstrap/glyphicons-halflings-regular.svg#glyphicons_halflingsregular")) format("svg")}
```
method2:
```
global.scss:
$icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
@import "~bootstrap-sass/assets/stylesheets/_bootstrap-sprockets.scss";
@import "~bootstrap-sass/assets/stylesheets/_bootstrap.scss";

result:
@font-face{font-family:Glyphicons Halflings;src:url(font-path("~bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.eot"));src:url(font-path("~bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.eot?#iefix")) format("embedded-opentype"),url(font-path("~bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff2")) format("woff2"),url(font-path("~bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff")) format("woff"),url(font-path("~bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.ttf")) format("truetype"),url(font-path("~bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.svg#glyphicons_halflingsregular")) format("svg")}
```
Method3:
```
global.scss:
@import "~bootstrap-sass/assets/stylesheets/_bootstrap-sprockets.scss";
@import "~bootstrap-sass/assets/stylesheets/_bootstrap.scss";

result:
@font-face{font-family:Glyphicons Halflings;src:url(font-path("bootstrap/glyphicons-halflings-regular.eot"));src:url(font-path("bootstrap/glyphicons-halflings-regular.eot?#iefix")) format("embedded-opentype"),url(font-path("bootstrap/glyphicons-halflings-regular.woff2")) format("woff2"),url(font-path("bootstrap/glyphicons-halflings-regular.woff")) format("woff"),url(font-path("bootstrap/glyphicons-halflings-regular.ttf")) format("truetype"),url(font-path("bootstrap/glyphicons-halflings-regular.svg#glyphicons_halflingsregular")) format("svg")}
```
Look at the result, they are all wrapped with a function 'font-path()' or 'twbs-font-path()'.
maybe we need implement font-path()?
then, I got the final solution:
```
global.scss:
@function font-path($path) {
   @return $path;
}
$icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
@import "~bootstrap-sass/assets/stylesheets/_bootstrap-sprockets.scss";
@import "~bootstrap-sass/assets/stylesheets/_bootstrap.scss";

result:
@font-face{font-family:Glyphicons Halflings;src:url(/node_modules/bootstrap-sass/assets/fonts/bootstrap/glyp    hicons-halflings-regular.eot);src:url(/node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.eot?#iefix) format("embedded-    opentype"),url(/node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff2) format("woff2"),url(/node_modules/bootstrap-s    ass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff) format("woff"),url(/node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-half    lings-regular.ttf) format("truetype"),url(/node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.svg#glyphicons_halflingsr    egular) format("svg")}
```
and the font files generated!
