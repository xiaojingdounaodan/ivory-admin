<p align="center">
<img src="https://schoolgezhi.cn/cdn/img/bluetooth.png" width=120 />
</p>

<p align="center">
<img src="https://camo.githubusercontent.com/b07168720c736b9a308a82f7ba5502f37e491779/68747470733a2f2f696d672e736869656c64732e696f2f636972636c6563692f70726f6a6563742f6769746875622f7675656a732f7675652f6465762e7376673f73616e6974697a653d74727565" alt="Build Status" data-canonical-src="https://img.shields.io/circleci/project/github/vuejs/vue/dev.svg?sanitize=true" style="max-width:100%;">
<img src="https://camo.githubusercontent.com/608dd8517bbaed6004fe246dbbf96f1cfdfd0a32/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f7675652e7376673f73616e6974697a653d74727565" alt="License" data-canonical-src="https://img.shields.io/npm/l/vue.svg?sanitize=true" style="max-width:100%;">
<img src="https://img.shields.io/badge/author-shadow%20%26%20samnyan-blue.svg" />
<img src="https://img.shields.io/badge/npm-v3.0.0-orange.svg" />
</p>

<h2 align="center">BlueTooth 蓝牙医疗-后台管理</h2>

<h2>项目简介</h2>
<p>本项目的应用场景是某牙齿矫治器定制厂家的网站，其功能目的是提供牙医与厂家的交互平台，网站涉及三个角色：游客、牙医、专家(网站管理员)。
<code>根据需求，专家和网站管理员的功能具有高度相似性,因此就放在一起了</code>

</p>
<p>
技术选型：前端基于<a href="https://github.com/vuejs/vue"> vue</a> 和 <a href="https://github.com/ElemeFE/element">element-ui</a>，后端基于php框架laravel，如果想对本项目进行扩展，你需要先学习使用这几门技术。
</p>
<p>
后端项目地址：<a href="https://github.com/samnyan/ivory-laravel">https://github.com/samnyan/ivory-laravel</a>
</p>
<p>
项目分为前台和后台两个部分，由于时间原因，前台做的十分简陋，重点放在后台的制作，系统的功能模块大致如下图所示
</p>

<p align="center">
<img src="https://schoolgezhi.cn/cdn/img/BlueToothFunction.png"/>
</p>

<h2>项目预览（可点击查看大图）</h2>
<h3>医生工作台（控制台）</h3>
<p>
  <img src="https://schoolgezhi.cn/cdn/img/dashboard-doctor.jpg"/>
</p>
<h3>查询订单</h3>
<p>
  <img src="https://schoolgezhi.cn/cdn/img/order-table.jpg"/>
</p>
<h3>患者列表</h3>
<p>
  <img src="https://schoolgezhi.cn/cdn/img/patient-doctor.jpg"/>
</p>

<h3>个人资料</h3>
<p>
  <img src="https://schoolgezhi.cn/cdn/img/user-detail.jpg"/>
</p>

<h3>病例列表</h3>
<p>
  <img src="https://schoolgezhi.cn/cdn/img/cases-doctor.jpg" />
</p>

<h3>诊所信息</h3>
<p>
  <img src="https://schoolgezhi.cn/cdn/img/clinic-detail.jpg" />
</p>

<h3>患者详情</h3>
<p>
  <img src="https://schoolgezhi.cn/cdn/img/patient-detail.jpg" />
</p>

<h2>使用准备</h2>
<p>

你需要在本地安装 node 和 git。前端技术栈基于 ES2015+、vue、vuex、vue-router 、vue-cli 、axios 和 element-ui
<pre><span class="pl-c"><span class="pl-c">#</span> 克隆项目</span>
git clone https://github.com/ZYKJShadow/ivory-admin.git

<span class="pl-c"><span class="pl-c">#</span> 进入项目目录</span>
<span class="pl-c1">cd</span> ivory-admin

<span class="pl-c"><span class="pl-c">#</span> 安装依赖</span>
npm install

<span class="pl-c"><span class="pl-c">#</span> 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题</span>
npm install --registry=https://registry.npm.taobao.org

<span class="pl-c"><span class="pl-c">#</span> 启动服务</span>
npm run dev</pre>
</p>

<h2>关键目录</h2>
<p>
  <ul>
    <li>api：所有的http请求接口</li>
    <li>components：elementui组件</li>
    <li>routers：路由<li/>
    <li>store：缓存<li/>
    <li>views：全部页面<li/>
  </ul>
</p>

<h2>权限验证</h2>
<p>由于本项目涉及到不同的角色，且有些角色具有相同的功能，因此权限验证可以帮助高效地实现功能复用！</p>
<p>你可以在routers文件下的index.js中设置权限，如下所示，你可以轻松的在role中设置角色，则表示该角色可以访问该页面。当然，角色以数组形式存放，可以添加多个</p>
<pre>
  {
    path: '/permission',
    component: Layout,
    name: '用户管理',
    meta: { role: ['professor','doctor'] }, //表示医生和专家都可访问
    children: [
    { 
      path: 'index',
      component: Permission,
      name: '权限测试页',
      meta: { role: ['professor'] }  //只有专家可访问
    }]
  },
</pre>

<h2>非PHP方案</h2>
<p>由于本项目使用的是前后端分离，所以后端只需要提供API即可，跟什么编程语言无瓜（疯狂暗示），只需要在前端修改成你所需的API接口即可正常使用</p>
<code>注：本项目有默认的一套接口方案，<a href="https://ivory.msm.moe/docs/#info">可点击此处参考</a>，默认提供的PHP后端项目：<a href="https://github.com/samnyan/ivory-laravel">https://github.com/samnyan/ivory-laravel</a></code>

<h2>打赏</h2>
<p>如果本项目对你有帮助，就请我们喝一杯奶茶呗~</p>
<p align="center">
  <img src="https://schoolgezhi.cn/cdn/img/donate.png" width=200 />
</p>

