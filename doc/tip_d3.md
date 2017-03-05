# SVG primer
1. [SVG primer](http://alignedleft.com/tutorials/d3/an-svg-primer/)
2. [SVG中文教程](http://www.cnblogs.com/duanhuajian/archive/2013/07/31/3227410.html)
3. [Mozilla path详细介绍](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
+ SVG图形： rect, circle, elipse, line, polyline, polygon, path, 其中path为重点，可以实现任何其他图形
```path中具有的指令
    M = moveto
    L = lineto
    H = horizontal lineto
    V = vertical lineto
    C = curveto
    S = smooth curveto
    Q = quadratic Belzier curve
    T = smooth quadratic Belzier curveto
    A = elliptical Arc
    Z = closepath
```
+ SVG中文本与图像：text, tspan, tref, textPath, image等
+ SVG属性：笔画与填充： fill, stroke(stroke-linecap, stroke-linejoin, stroke-dasharray), 也可使用css，只是background-color和border换成了fill和stroke
+ SVG颜色及渐变：线性渐变linearGradient，环形渐变radialGradient，纹理填充pattern
+ SVG重用与引用：组合g，模板symbol，定义defs，引用use
+ SVG元素汇总：
>    动画元素：animate, animateColor, animateMotion, animateTransform, set；
>    解释元素：desc, metadata, title；
>    图形元素：circle, ellipse, line, path, polygon, polyline, rect；
>    结构元素：defs, g, svg, symbol, use；
>    渐变元素：linearGradient, radialGradient；
>    其他元素：a,altGlyphDef,clipPath,color-profile,cursor,filter,font,font-face,foreignObject,image,marker,mask,pattern,script,style,switch,text,view等。

# d3的工作原理
1. selection， 能高效的使用原由的dom选择方法，与jquery之类的一样
比如：
```d3.selectAll("p").style("color", "white");
d3.select("body").style("background-color", "black");
```
2. dynamic properties，动态属性，可以将dom某个属性设置成函数。
比如：
```d3.selectAll("p").style("color", function() {
  return "hsl(" + Math.random() * 360 + ",100%,50%)";
});

d3.selectAll("p").style("color", function(d, i) {
  return i % 2 ? "#fff" : "#eee";
});

d3.selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
    .style("font-size", function(d) { return d + "px"; });
```
3. Enter & Exit，当data与selection绑定时，data数组中每一个元素对应一个dom元素，enter()之后，不够的会创建，多的会在exit().remove()中删除。
```// Update…
var p = d3.select("body")
  .selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
    .text(function(d) { return d; });

// Enter…
p.enter().append("p")
    .text(function(d) { return d; });

// Exit…
p.exit().remove();
```
# react d3现有架构
1. [react-faux-dom](https://github.com/Olical/react-faux-dom) ,利用ref直接更新在dom上。如果以前用d3开发过代码库，可以以这种方式迁移。
2. [recharts](http://recharts.org/#/en-US/examples/JointLineScatterChart)

