[中文版本](https://github.com/)

<h1 align="center">
  <br>
  <a href="https://hiripple.com/" alt="logo" ><img src="https://raw.githubusercontent.com/CelestialRipple/RippleAi-Summary-Illustration-TTS/main/icon-min.svg" width="150"/></a>
  <br>
  RippleAi
  <br>
</h1>
<h4 align="center">Auto generate summary / illustration / TTS by RippleAi.</h4>


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

### 在需要的地方插入以下html即可～
```html
<div class="ripple-ai mt-4">
</div>
<link href="/path/to/ripplegpt.css" rel="stylesheet" type="text/css" />
  <script>
let RippleGPT_postSelector = '.gridContainer';
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
let RippleGPT_postSelector = '.gridContainer';
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
# 容器外部
  <script src="https://myripple.cc/cdn/RippleGPT.js"></script>
					<script>
	runRippleGPT();
</script>
/* 容器内部（single.php) */	
<link href="https://myripple.cc/cdn/RippleGPT.css" rel="stylesheet" type="text/css" />
  <script>
let RippleGPT_postSelector = '.gridContainer';
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
🤖️ 你可以把Midjourney接入[机器人](https://github.com/CelestialRipple/Midjourney-bot)！

## :scroll: 许可证

MIT
