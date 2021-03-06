# touch-box

轻量级、无依赖的Touch事件基础库。

如果你想快速开发定制的Touch UI组件，又或者你已经厌倦了为每一个Touch功能引入完全独立的Touch模块（如你需要一个幻灯片那你可能会选swiper，需要滚动列表可能是better-scroll，更多..），创建touch-box的目的源于此。

我们从重复的Touch操作中提取了一些与Touch操作本身密切相关的基础数据和事件，目的是为了尽可能的简化Touch操作。采用核心扩展模式，核心不包含业务逻辑，至少在大多数滑动场景中表现出共性，如手势识别、滚动方向、缓动、回弹、惯性减速等。

### 与常见Touch库区的别

swiper专注于卡片切换，不适用于swiper以外的场景。

better-scroll参照iscroll，设计理念与touch-box相似，都是作为touch的抽象层。better-scroll封装一些不可分离的业务逻辑，导致体积偏大，在实际应用中可能会有很多东西用不到。

相对而言touch-box是一个抽象级更高的库（更加初级），对于开发者而言意味着需要做的事情更多，但同时也赋予了开发者更多的灵活性。

### 事件代理

touch-box对touchstart、touchmove、touchend事件使用了代理模式。touchstart使用透明代理，touchmove、touchend只有在手势匹配成功后才会触发。

当同一个elment订阅多个同名touch事件时，因为使用共享代理机制，实际事件只会被订阅一次。

touch事件在非触控环境下会被映射到mousedown、mousemove、mouseup、mouseout，降级为鼠标操作。

### 可用参数

*  el 选择器匹配到的elment元素
*  container Touch容器Dom对象
*  startX = 0 起始X坐标
*  startY = 0 起始Y坐标
*  pageX = 0 滑动X坐标
*  pageY = 0 滑动Y坐标
*  moveX = 0 横向滑动距离，滑动X坐标与起始X坐标之间的差值
*  moveY = 0 纵向滑动距离，滑动Y坐标与起始Y坐标之间的差值
*  lastX = [0, 0, 0] 前三个moveX坐标
*  lastY = [0, 0, 0] 前三个moveY坐标
*  touchstart = [] touchstart事件队列
*  touchmove = [] touchmove事件队列
*  touchend = [] touchend事件队列
*  slideGap = 5 初始自由滑动间隙阈值，单位px
*  direction = 'level' touch手势类型，level（水平滑动）、'vertical'（垂直滑动）
*  dir = 'X' 简写的direction值，用于动态切换变量名
*  distance = 5 位移差阈值，用于判断touchend时触点释放的速度，单位px
*  shift = 0 触点释放时的位移量，可用于判断位移方向和速度，单位px
*  lock = true touch状态锁，当为true时会限制所有touchmove、touchend行为，只能通过touchstart解锁
*  translateStartX = 0 container横向位移起点
*  translateStartY = 0 container纵向位移起点
*  translateX = 0 container横向位移
*  translateY = 0  container纵向位移
*  translateEndX = 0 container横向位移终点
*  translateEndY = 0 container纵向位移终点
*  damping = 6 滑动阻尼系数，用于末端缓速

### 内置应用场景

#### 滚动

> 常用于列表滚动

#### 限位减速

在滑动到限位区时需进行用户反馈，使用阻尼减速的方式告诉用户后面已经没有东西了。

#### 上拉

常见应用场景是列表上拉加载

#### 下拉

常见应用场景是列表下拉刷新、打开隐藏抽屉或新页面等

#### 卡片切换（幻灯片）

将主容器按照子集数量拆分成多个相同尺寸的子容器。适用于轮播、Tab选项卡等。

### 扩展组件

使用touchBox.use()方法扩展自定义事件

### 说明

目前只支持单点触控