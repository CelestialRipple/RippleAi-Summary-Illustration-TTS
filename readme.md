<h1 align="center">
  <br>
  <a href="https://hiripple.com/" alt="logo" ><img src="https://user-images.githubusercontent.com/115361435/233824633-bf256ebf-5865-449c-9000-39bb6aec4b4c.svg" width="150"/></a>
  <br>
  RippleAi
  <br>
</h1>
<h4 align="center">Auto generate summary / illustration / TTS by RippleAi.</h4>

## Demo
 ### desktop
  <br><img width="632" alt="desktop" src="https://user-images.githubusercontent.com/115361435/233821319-e6b0afa7-9ff0-4d5a-b529-8829eb40a2ad.png">
### mobile
<br><img width="348" alt="mobie" src="https://user-images.githubusercontent.com/115361435/233821304-2a2e9748-3aa6-45a1-8b2a-edf188ccbb27.png">

## :sparkles: 特性
* 🤖 自动生成，无需人工干预
* ✨ 简洁、美观的前端样式，响应式设计
* 👋 轻松上手，高可定制
* 💾 针对PJAX、Fancybox进行兼容
* 📚 使用数据库，避免API进行重复请求
* 💻 CDN功能，允许服务器缓存图片后发送（中国大陆友好）
* 🔐 可设置跨域限制，防盗用
* 🗣️ 集成GPT、Midjourney、VITS

## :hammer_and_wrench: 快速开始 

### 根据html结构找出正文对应的class

例如我的博客正文被class="entry-content"包裹，那么let RippleGPT_postSelector = '.entry-content';

### 在需要的地方插入html即可～
```html
<div class="ripple-ai mt-4">
</div>
<link href="/path/to/ripplegpt.css" rel="stylesheet" type="text/css" />
  <script>
let RippleGPT_postSelector = '文章正文';
let GPT_URL = 'https://api.example.com/';
let MJ_URL= 'https://api.example.com/send_and_receive';
let VITS_URL= 'https://api.example.com/models/${path}/speakers/${id}';
</script>
  <script src="/path/to/ripplegpt.js"></script>
  <script src="/path/to/typeit.min.js"></script>
<script>document.addEventListener('DOMContentLoaded', function() {
  runRippleGPT();
});
</script>
```

### cdn（不保证可用）

```html
<div class="ripple-ai mt-4">
</div>
<link href="https://myripple.cc/cdn/RippleGPT.css" rel="stylesheet" type="text/css" />
  <script>
let RippleGPT_postSelector = '文章正文';
let GPT_URL = 'https://api.example.com/';
let MJ_URL= 'https://api.example.com/send_and_receive';
let VITS_URL= 'https://api.example.com/models/${path}/speakers/${id}';
</script>
  <script src="https://myripple.cc/cdn/RippleGPT.js"></script>
  <script src="https://myripple.cc/cdn/typeit.min.js"></script>
<script>document.addEventListener('DOMContentLoaded', function() {
  runRippleGPT();
});
</script>
```
### PJAX兼容（Wordpress为例）

```PHP
/* 容器外部(footer.php) */	
  <script src="https://myripple.cc/cdn/RippleGPT.js"></script>
					<script>
	runRippleGPT();
</script>
/* 容器内部（single.php) */	
<link href="https://myripple.cc/cdn/RippleGPT.css" rel="stylesheet" type="text/css" />
  <script>
let RippleGPT_postSelector = '文章正文';
let GPT_URL = 'https://api.example.com/';
let MJ_URL= 'https://api.example.com/send_and_receive';
let VITS_URL= 'https://api.example.com/models/${path}/speakers/${id}';
</script>
```

## 后端搭建
- [node](https://github.com/CelestialRipple/RippleAi-Summary-Illustration-TTS/tree/main/node-server)
- [Python(midjourney）](https://github.com/CelestialRipple/RippleAi-Summary-Illustration-TTS/tree/main/python-server)
- [Python(vits）](https://github.com/CelestialRipple/RippleAi-Summary-Illustration-TTS/tree/main/python-server/VITS-server)

## :alembic: 技术栈

* [Python] + [Node]
* [PHP] + [HTML] + [CSS]

## :gear: 扩展
- 🤖️ 你可以把Midjourney接入[机器人](https://github.com/CelestialRipple/Midjourney-bot)！
- 👶🏿 本项目处于最初阶段，基于作者自己的WP主题开发，可能存在较多的BUG与兼容性问题，欢迎提出ISSUE！
- 👍🏻 联系&合作&捐赠：support@hiripple.com
- ⚡️ 未来计划：更多的VITS样式、Midjourney upscale功能

## :scroll: 许可证

- MIT
- 你可以删去右下角的powered by rippleai，当必须保留左上角的图标以及超链接
