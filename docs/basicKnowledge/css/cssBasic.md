## CSS基础

### CSS选择及其优先级

<table>
  <tr>
    <th>选择器</th>
    <th>格式</th>
    <th>优先级权重</th>
  </tr>
  <tr>
    <td>id选择器</td>
    <td>#id</td>
    <td>100</td>
  </tr>
  <tr>
    <td>类选择器</td>
    <td>#classname</td>
    <td>10</td>
  </tr>
  <tr>
    <td>属性选择器</td>
    <td>a[ref=“eee”]</td>
    <td>10</td>
  </tr>
  <tr>
    <td>伪类选择器</td>
    <td>li:last-child</td>
    <td>10</td>
  </tr>
  <tr>
    <td>标签选择器</td>
    <td>div</td>
    <td>1</td>
  </tr>
  <tr>
    <td>伪元素选择器</td>
    <td>li:after</td>
    <td>1</td>
  </tr>
  <tr>
    <td>相邻兄弟选择器</td>
    <td>h1+p</td>
    <td>0</td>
  </tr>
  <tr>
    <td>子选择器</td>
    <td>ul>li</td>
    <td>0</td>
  </tr>
  <tr>
    <td>后代选择器</td>
    <td>li a</td>
    <td>0</td>
  </tr>
  <tr>
    <td>通配符选择器</td>
    <td>ul>*</td>
    <td>0</td>
  </tr>
</table>

**注意事项**

- !important声明的样式的优先级最高；
- 如果优先级相同，则最后的样式生效；
- 继承得到的样式的优先级最低；
- 通用选择器（*）、子选择器（>）和相邻同胞选择器(+)并不在这四个等级中，所以它们的权值都为0；
- 样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式；

### CSS中可继承与不可继承属性有哪些

**无继承性的属性**

 **1. display**：规定元素应该生成的框的类型

 **2. 文本属性**

   - vertical-align: 垂直文本对齐
   - text-decoration：规定添加到文本的装饰
   - text-shadow：文本阴影效果
   - white-space：空白符处理
   - unicode-bidi:设置文本的方向
  
 **3. 盒子模型的属性**： width、height、margin、border、padding

 **4. 背景属性**: background、background-color、background-image、background-repeat、background-position、background-attachment

 **5. 定位属性**：float、clear、position、top、right、bottom、left、min-width、min-height、max-width、max-height、overflow、clip、z-index

 **6. 生成内容属性**：content、counter-reset、counter-increment

 **7. 轮廓样式属性**：outline-style、outline-width、outline-colot、outline

 **8. 页面样式属性**：size、page-break-before、page-break-after

 **9. 声音样式属性**：pause-before、pause-after、pause、cue-before、cue-after、cue、play-during


**有继承性的属性**

**1. 字体系列属性**
  
  - font-family:字体系列
  - font-weight：字体粗细
  - font-size：字体的大小
  - font-style：字体的风格
  
**2. 文本系列属性**

  - text-indent：文本缩进
  - text-align：文本水平对齐
  - line-height：行高
  - word-spacing：单词之间的间距
  - letter-spacing：中文或者字母之间的间距
  - text-transform：控制文本大小写
  - color：文本颜色
  
**3. 元素可见性**

  - visibility：控制元素显示隐藏

**4. 列表布局属性**
 
  - list-style：列表风格，包括list-style-type、list-style-image等

**5. 光标属性**

  - cursor：光标显示为何种形态

### display的属性值及其作用

<table>
  <tr>
    <th>属性值</th>
    <th>作用</th>
  </tr>
  <tr>
    <td>none</td>
    <td>元素不显示，并且会从文档流中移除。</td>
  </tr>
   <tr>
    <td>block</td>
    <td>块类型。默认宽度为父元素宽度，可设置宽高，换行显示。</td>
  </tr>
  <tr>
    <td>inline</td>
    <td>行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。</td>
   </tr>
   <tr>
    <td>inline-block</td>
    <td>默认宽度为内容宽度，可以设置宽高，同行显示。</td>
   </tr>
   <tr>
    <td>list-item</td>
    <td>像块类型元素一样显示，并添加样式列表标记</td>
   </tr>
   <tr>
    <td>table</td>
    <td>此元素会作为块级表格来显示</td>
   </tr>
   <tr>
    <td>inherit</td>
    <td>规定应该从父元素继承display属性的值</td>
   </tr>
</table>

### display的block、inline和inline-block的区别

 1. **block:** 会独占一行，多个元素会另起一行，可以设置width、height、margin和padding属性；
 2. **inline:** 元素不会独占一行，设置width、height属性无效。但可以设置水平方向的margin和padding属性，不能设置垂直方向的padding和margin；
 3. **inline-block:** 将对象设置为inline对象，但对象的内容作为block对象呈现，之后的内联对象会被排列在同一行内。

对于行内元素和块级元素，其特点如下:

  **行类元素**

  - 设置宽高无效；
  - 可以设置水平方向的margin和padding属性，不能设置垂直方向的padding和margin；
  - 不会自动换行；
  
  **块级元素**

  - 可以设置宽高；
  - 设置margin和padding都有效；
  - 可以自动换行；
  - 多个块状，默认排列从上到下；
  
### 隐藏元素的方法有哪些

  - **display：none**：渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也不会影响绑定的监听事件。
  - **visibility：hidden**：元素在页面中仍占据空间，但是不会影响绑定的监听事件。
  - **opacity:0**：将元素的透明度设置为 0 ，从此来实现元素的隐藏。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。
  - **position:absolute**：通过使用绝对定位将元素移除可视区域内，以此来实现元素的隐藏。
  - **z-index：负值**：来使其他元素遮盖住该元素，以此来实现隐藏。
  - **clip/clip-path**：使用元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会影响绑定的监听事件，
  - **transform：scale(0,0)**：将元素缩放为0，来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。

### link和@import的区别

  两者都是外部引用css的方式，它的区别如下：

   - link是XHTML标签，除了加载CSS外，还可以定义RSS等其他事务; @important属于CSS范畴，只能加载CSS。
   - link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。
   - link是XHTML标签，无兼容问题；@import是CSS2.1提出的，低版本的浏览器不支持。
   - link支持使用JavaScript控制DOM去改变样式；而@import不支持。
  
### display：none与visibility：hidden的区别

  这两个属性都是让元素隐藏，不可见。两者区别如下:

  1. **在渲染树中**
   
   - <span class='fontRed'>display:none</span> 会让元素完全从渲染树中消失，渲染时不会占据任何空间；
   - <span class='fontRed'>visibility：hidden</span> 不会让元素从渲染树中消失，渲染的元素还会占据相应的空间，只是内容不可见

  2. **是否是继承属性**

   - <span class='fontRed'>display：none</span> 是非继承属性，子孙节点会随着父节点从渲染树消失，通过修改子孙节点的属性也无法显示；
   - <span class='fontRed'>visibility：hidden</span>是继承属性，子孙节点消失是由于继承了hidden，通过设置 <span class='fontRed'>visibility：visible</span>
      可以让子孙节点显示；

  3. 修改常规文档流中元素的 <span class='fontRed'>display</span> 通常会造成文档的重排，但是修改 <span class='fontRed'>visibility</span> 属性只是会造成本元素的重绘；
   
  4. 如果使用读屏器，设置为 <span class='fontRed'>display：none</span>的内容不会被读取，设置为 <span class='fontRed'>visibility：hidden</span>的内容会被读取。

### 伪元素和伪类的区别和作用？

 - 伪元素：在内容元素的前后插入额外的元素或样式，但是这些元素实际上并不在文档中生成。它们只在外部显示可见，但不会在文档的源代码中找到它们，因此，称为“伪”元素。例如：
    ```css

      p::before {content:"第一章：";}
      p::after {content:"Hot!";}
      p::first-line {background:red;}
      p::first-letter {font-size:30px;}

    ```
 - 伪类：将特殊的效果添加到特定选择器上。它是已有元素上添加类别的，不会产生新的元素。例如
    ```css

    a:hover {color: #FF00FF}
    p:first-child {color: red}

    ```
 

 总结：伪类是通过在元素选择器上加入伪类改变元素状态，而伪元素通过对元素的操作进行对元素的改变。

### 对盒模型的理解

CSS3中的盒模型有以下两种：标准盒子模型、IE盒子模型

盒模型都是由四个部分组成的，分别是margin、border、padding和content。
标准盒模型和IE盒模型的区别在于设置width和height时，所对应的范围不同：

 - 标准盒模型的width和height属性的范围只包含了content，
 - IE盒模型的width和height属性的范围包含了border、padding和content。

可以通过修改元素的box-sizing属性来改变元素的盒模型：

 - <span class='fontRed'>box-sizeing: content-box</span> 表示标准盒模型(默认值)
 - <span class='fontRed'>box-sizeing: border-box</span> 表示IE盒模型（怪异盒模型）

### 为什么有时候用translate来改变位置而不是定位

translate 是 transform 属性的一个值。改变transform或opacity不会触发浏览器重新布局(reflow) 或 重绘(repaint),只是触发复合（compositions）。 而改变绝对定位会触发重新
布局，进而触发重绘和复合。transform使浏览器为元素创建一个GPU图层，但改变绝对定位会使用到CPU。因此translate()更高效，可以缩短平滑动画的绘制时间。而translate改变位置时，
元素依然会占据其原始空间，绝对定位就不会发生这种情况。

### CSS3中有哪些新特性

 - 新增各种CSS选择器(:not(.input):所有class不是“input”的节点)
 - 圆角(border-radius：8px)
 - 多列布局 (multi- column layout)
 - 阴影和反射(Shadoweflect)
 - 文字特效(text - shadow)
 - 文字渲染(Text - decoration)
 - 线性渐变(gradient)
 - 旋转(transform)
 - 增加了旋转，缩放，定位，倾斜，动画 ，多背景

### 对CSSSprites的理解

CSSSprites(精灵图)，将一个页面涉及到的所有图片都包含到一张大图中去，然后利用CSS的background-image,background-repeat,background-position属性的组合进行背景定位。

**优点**
  - 利用 <span class='fontRed'>CSS Sprites</span>能很好地减少网页的http请求，从而大大提高了页面的性能，这是 <span class='fontRed'>CSS Sprites</span>最大的优点
  -  <span class='fontRed'>CSS Sprites</span> 能减少图片的字节。

**缺点**
  -  在图片合并时，要把多张图片有序、合理的合并并成一张图片还要留好足够的空间，防止模块内出现不必要的背景。在宽屏及高分辨率下的自适应页面，如果背景不够宽，很容易出现背景
  断裂
  - <span class='fontRed'>CSSSprites</span>在开发的时候相对来说有点麻烦，需要借助 <span class='fontRed'>photoshop</span>或其他工具来对每个背景单元测量其准确的位置。
  - 维护方面：<span class='fontRed'>CSSSprites</span>在维护的时比较麻烦，页面背景有少许改动时，就要改这张合并的图片，无需改的地方尽量不要动，这样避免改动更多 <span class='fontRed'>CSS</span>
  如果在原来的地方放不下，又只能往下加图片，这样图片的字节就增加了，还要改动 <span class='fontRed'>CSS</span>

### 什么是物理像素，逻辑像素和像素密度，为什么在移动端开发时需要用到@3x，@2x这种图片？

以iPhone XS 为例，当写CSS代码时，针对于单位 px，其宽度为 414px & 896px，也就是说当赋予一个DIV元素宽度为414px，这个DIV就会填满手机的宽度；

而如果有一把尺子来实际测量这部手机的物理像素，实际为1242*2688的物理像素；经过计算可知，1242/414 = 3 ，也就是说，在单边上，一个逻辑像素 = 3个物理像素
，就说这个屏幕的像素密度为3，也就是常说的3倍屏。

对于图片来说，为了保证其不失真，1个图片像素至少要对应一个物理像素，假如原始图片是500300像素，那么在3倍屏上就要放一个1500900像素的图片才能保证1个物理像素
至少对应一个图片像素，才能不失真。

当然，也可以针对所有屏幕，都只提供最高清图片。虽然低密度屏幕用不到那么多图片像素，而且会因为下载多余的像素造成带宽浪费和下载延迟，但从结果上说能保证图片在
所有屏幕上都不会失真。

还可以使用CSS媒体查询来判断不同的像素密度，从而选择不同的图片：

```js

my-image { background: (low.png); }
@media only screen and (min-device-pixel-ratio: 1.5) {
  #my-image { background: (high.png); }
}

```

### margin 和 padding的使用场景

- 需要在border外侧添加空白，且空白处不需要背景(色)时，使用margin;
- 需要在border内测添加空白，且空白处需要背景(色)时，使用padding；

### 对line-height的理解及赋值方式

1. line-height的概念：
   - line-height 指一行文本的高度，包含了字间距，实际上是下一行基线到上一行基线距离；
   - 如果一个标签没有定义height 属性，那么其最终表现的高度由 line-height决定；
   - 一个容器没有设置高度，那么撑开容器高度的是line-height，而不是容器内的文本内容；
   - 把line-height值设置为height一样大小的值可以实现单行文字的垂直居中；
   - line-height和height 都能撑开一个高度；

2. line-height的赋值方式：
   - 带单位：px 是固定值，而 em 会参考父元素 font-size 值计算自身的行高
   - 纯数字：会把 比例传递给后代。例如，父级行高为1.5 ， 子元素字体为 18px，则子元素行高为 1.5*18 = 27px
   - 百分比：将计算后的值传递给后代

### CSS 优化和提高性能的方法有哪些？

**加载性能**：
 
  1.css压缩：将写好的css进行打包压缩，可以减少文件体积。

  2.css单一样式：当需要下边距和左边距的时候，很多时候会选择使用 margin：top 0 bottom 0 ；但margin-bottom：margin-left：left;执行效率会更高。

  3.减少使用@import，建议使用link，因为后者在页面加载时一起加载，前者是等待页面加载完成之后在进行加载。

**选择器性能**:

  1.关键选择器。选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）。css选择符是从右到左进行匹配的。当使用后代选择器的时候，浏览器会遍历所有子元素来
  确定是否是指定的元素等等。

  2.如果规则拥有ID选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则。

  3.避免使用通配规则，如*{}计算数惊人，只对需要用到的元素进行选择。

  4.尽量少的去对标签进行选择，而是用class。

  5.尽量少的去使用后代选择器，降低选择器的权重值。后代选择器的开销是最高的，尽量将选择器的深度降到最低，最高不要超过三层，更多的使用类来关联每一个标签元素。

  6.了解哪些属性是可以通过继承而来的，然后避免对这些属性重复指定规则。

**渲染性能**：
   
  1.慎重使用高性能属性：浮动、定位。

  2.尽量减少页面重排、重绘。

  3.去除空规则：{}。空规则的产生原因一般来说是为了预留样式。去除这些空规则无疑能减少css文档体积。

  4.属性值为0时，不加单位。

  5.属性值为浮动小数0.**，可以省略小数点之前的0。

  6.标准化各种浏览器前缀：带浏览器前缀的在前。标准在后。

  7.不使用@import前缀，它会影响css的加载速度。

  8.选择器优化嵌套，尽量避免层级过深。

  9.css雪碧图，同一页面相近部分的小图标，方便使用，减少页面的请求次数，但是同时图片本身会变大，使用时，优劣考虑清楚，再使用。

  10.正确使用display的作用属性，由于display的作用，某些样式组合会无效，徒增样式体积的同时也影响解析性能。

  11.不滥用web字体。对于中文网来说webFonts可能很陌生。国外却很流行。web fonts通常体积庞大，而且一些浏览器在下载web fonts时会阻塞页面渲染损伤性能。

**可维护性、健壮性**：
  
  1.将具有相同属性的样式抽离出来，整合并通过class在页面中进行使用，提高css的可维护性。
  2.样式与内容分离：将css代码定义到外部css中。

### ::before 和 :after 的双冒号和单冒号有什么区别？

1. 冒号用于css3伪类，双冒号(::)用于css3伪元素。
2. ::before就是以一个子元素的存在，定义在元素主题内容之间的一个伪元素。并不存在于dom之中，只存在在页面中。

注意：:before 和 :after这两个伪元素，是css2.1里新出现的。起初，伪元素的前缀使用的单冒号语法，但随着web的进化，在css3的规范里，伪元素的语法被修改成使用双冒号，
成为::before、::after.

### display:inline-block 什么时候会显示间隙？

- 有空格时会有间隙，可以删除空格解决；
- margin 正值时，可以让margin使用负值解决；
- 使用font-size时，可以通过设置 font-size：0、letter-spacing、word-spacing解决
  
### 单行、多行文本溢出隐藏

- 单行文本溢出
  
  ```css
    overflow: hidden;            // 溢出隐藏
    text-overflow: ellipsis;      // 溢出用省略号显示
    white-space: nowrap;         // 规定段落中的文本不进行换行
  ```

- 多行文本溢出
  
  ```css
  overflow: hidden;            // 溢出隐藏
  text-overflow: ellipsis;     // 溢出用省略号显示
  display:-webkit-box;         // 作为弹性伸缩盒子模型显示。
  -webkit-box-orient:vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
  -webkit-line-clamp:3;        // 显示的行数
  ```
  注意：由于上面的三个属性都是css3的属性，没有浏览器可以兼容，所以要在前面加个 - webkit- 来兼容部分浏览器。

### Sass、Less 是什么？为什么要使用他们？

  他们都是CSS预处理，是CSS上的一种抽象层。他们是一种特殊的语法/语言编译成CSS。例如Less是一种动态样式语言，将CSS赋予了动态语言的特性，如变量，继承，运算，函数，LESS即
  可以在客服端上运行，也可以在服务端运行。

  为什么要使用它们？

  - 结构清晰，便于扩展。可以方便地屏蔽浏览器私有语法差异。封装对浏览器语法差异的重复处理，减少无意义的机械劳动。
  - 可以轻松实现多重继承。完全兼容CSS代码，可以方便地应用到老项目中。LESS只是在CSS语法上做了扩展，所以老的CSS代码也可以与LESS代码一同编译。

### 对媒体查询的理解？

媒体查询由一个可选的媒体类型和零个或多个使用媒体功能的限制了样式表的范围的表达式组成，例如宽度、高度的颜色。媒体查询，添加自CSS3，允许内容的呈现针对一个特定范围的输出设备
而进行裁剪，而不必改变内容本身，适合web网页应对不同型号的设备而做出对应的响应适配。

媒体查询包含一个可选的媒体类型和满足CSS3规范的条件下，包含零个或多个表达式，这些表达式描述了媒体特征，最终会被解析为true和false。如果媒体查询中指定的媒体类型匹配展示文档
所使用的设备类型，并且所有的表达式的值都是true，那么该媒体查询的结果为true。那么媒体查询内的样式将会生效。

```js

<!-- link元素中的CSS媒体查询 --> 
<link rel="stylesheet" media="(max-width: 800px)" href="example.css" /> 
<!-- 样式表中的CSS媒体查询 --> 
<style> 
@media (max-width: 600px) { 
  .facet_sidebar { 
    display: none; 
  } 
}
</style>

```

简单来说，使用@media查询，可以针对不同的媒体类型定义不同的样式。 @media 可以针对不同的屏幕尺寸设置不同的样式，特别是需要设置设计响应式的页面，@media是非常有用的，当重置浏览器
大小的过程中，页面也会根据浏览器的宽度和高度重新渲染页面。

### 对CSS工程化的理解

CSS 工程化是为了解决一下问题：

1) **宏观设计**：CSS代码如何组织、如何拆分、模块结构怎样设计？
2) **编码优化**：怎样写出更好的CSS？
3) **构建**：如何处理我的CSS，才能让它的打包结果最优？
4) **可维护性**：代码写完了，如何最小它后续的变更成本？如何确保任何一个同事都能轻松接手？

以下三个方向都是时下比较流行的、普适性非常好的CSS 工程化实践：

- 预处理器：Less、Sass 等；
- 重要的工程化插件：PostCss；
- Webpack loader 等。

基于这三个方向，可以衍生出一些具有典型意义的子问题，这里我们逐个来看：

**(1)预处理器：为什么要用预处理器？它的出现是为了解决什么问题？**

预处理器，其实就是CSS 世界的轮子。预处理器支持我们写一种类似CSS 、但实际并不是CSS的语言，然后把它编译成CSS代码：

那么为什么写CSS代码写的好好的，偏偏要转去写“类CSS”呢？这就和本来用JS也可以实现所有功能，但最后却写React的jsx或者Vue的模板语法一样 —— 为了爽！要想知道有了预处理器有多爽，
首先要知道的是传统CSS有多不爽，随着前端业务复杂程度的提高，前端工程中对CSS提出了以下诉求

  1) 宏观设计上：我们希望能优化CSS文件的目录结构，对 现有CSS文件实现复用；
  2) 编码优化上：我们希望能写出结构清晰、简明易懂的CSS，需要它具有一目了然的嵌套层级关系，而不是无差别的一铺到底写法；我们希望它具有变量特征、计算能力、循环能力等等更强
  的编程性，这样我们可以少写一些无用的代码；
  3) 可维护性上：更强的可编程性意味着更优质的代码结构，实现复用意味着更简单的目录结构和更强的扩展能力，这两点如果能做到，自然会带来更强的可维护性。
  
这三点是传统CSS所做不到的，也正是预处理器所解决掉的问题。预处理器普遍会具备这样的特性：

 - 嵌套代码的能力，通过嵌套来反映不同css属性之间的层级关系
 - 支持定义 css 变量；
 - 提供计算函数；
 - 允许对代码片段进行 extend 和 mixin；
 - 支持循环语句的使用；
 - 支持将CSS文件模块化，实现复用。

**(2)PostCss:PostCss 是如何工作的？我们在场景下会使用 PostCss？**

它和预处理器的不同在于，预处理器的是 类CSS,而 PostCss处理的就是CSS本身。Babel可以将高版本的 JS 代码转换为低版本的 JS 代码。PostCss 做的是类似的事情：它可以编译尚未
被浏览器广泛支持的先进的CSS语法，还可以自动为一些需要额外兼容的语法增加前缀。更强的是，由于 PostCss 有着强大的插件机制，支持各种各样的扩展，极大地强化了CSS的能力。

PostCss在业务中的使用场景非常多:

 - 提高CSS代码的可读性：PostCss 其实可以做类似预处理器能做的工作；
 - 当我们的CSS代码需要适配低版本浏览器时，PostCss的 <span class='fontRed'>Autoprefixer</span>插件可以帮助我们自动增加浏览器前缀；
 - 允许我们编写面向未来的CSS:PostCss能够帮助我们编译 CSS next代码；

**(3)Webpack能处理CSS吗？如何实现？**

Webpack能处理Css吗：

- Webpack 在裸奔的状态下，是不能处理CSS的，Webpack 本身是一个面向 JavaScript 且只能处理JavaScript 代码的模块化打包工具；
- Webpack 在loader 的辅助下，是可以处理 CSS 的。
  
如何用WebPack实现对CSS 的处理

- Webpack 中操作CSS需要使用的两个关键的loader：css-loader 和style-loader
- 注意，答出“用什么” 有时候可能还不够，面试官会怀疑你是不是在背答案，所以你还需要了解每一个loader都做了什么事情：
   
   css-loader：导入CSS模块，对CSS代码进行编译处理；

   style-loader：创建style标签，把CSS内容写入标签。

在实际使用中，css-loader 的执行顺序一定要安排在 style-loader的前面。因为只有完成了编译过程，才可以对css代码进行插入；若提前插入了未编译的代码，那么webpack是无法理解这坨
东西的，它会报错。 






  