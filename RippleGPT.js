/*
Name: RippleAi
Author: Ripple
Author URI: https://hiripple.com/
Version: 1.0.0
License: GNU General Public License v3.0
License URI: https://www.gnu.org/licenses/gpl-3.0.html
*/
let audioLoaded = false;
const RippleGPT = {
  getTitleAndContent: function () {
    const title = document.title;
    const container = document.querySelector(RippleGPT_postSelector);
    const paragraphs = container.querySelectorAll('p');
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5');
    let content = '';

    for (let h of headings) {
      content += h.innerText + ' ';
    }

    for (let p of paragraphs) {
      const filteredText = p.innerText.replace(/https?:\/\/[^\s]+/g, '');
      content += filteredText;
    }

    const combinedText = title + ' ' + content;
    const truncatedText = combinedText.slice(0, 3000);
    return truncatedText;
  },

  fetchRippleGPT: async function(content) {
    const apiUrl = GPT_URL + 'api/aisummary';
    const timeout = 500000;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }),
        signal: controller.signal,
      });

      if (response.ok) {
        const data = await response.json();
        const summary = data.summary.content;
        return summary;
      } else {
        throw new Error('请求失败');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('请求超时');
      } else {
        console.error('请求失败：', error);
      }
      return '获取文章摘要超时。';
    }
  },
};
async function fetchAudio(text) {
  const url = VITS_URL;
  const data = {
    text: text,
    language: "简体中文",
    speed: 0.8,
    noise_scale: 0.2,
    noise_scale_w: 0.668
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const audioData = await response.json();
      return audioData.url;
    } else {
      throw new Error("请求失败");
    }
  } catch (error) {
    console.error("请求失败：", error);
  }
}

async function fetchAudioAndPlay() {
  if (audioLoaded) {
    return;
  }
  const aiSummaryTarget = document.querySelector(".ai-summary-target");
  const cyberText = document.querySelector(".cyber-text");
  const preparingText = document.createElement("span");
  preparingText.innerText = "准备中...";
  preparingText.classList.add("blinking");
  cyberText.innerHTML = ""; // 先清空原来的文字
  cyberText.appendChild(preparingText);
  // 获取音频链接
  const audioUrl = await fetchAudio(aiSummaryTarget.innerText);

  // 使用系统默认音频播放器
  const audioElement = document.createElement("audio");
  audioElement.src = audioUrl;
  audioElement.controls = true;
  audioElement.style.height = "30px";
  audioElement.style.width = "50%";
  cyberText.removeChild(preparingText); // 移除 "准备中..." 文字
  // 将音频元素插入到 cyberText 元素
  cyberText.appendChild(audioElement);
  audioLoaded = true;
}





function runRippleGPT() {
  const rippleAiDiv = document.querySelector('.ripple-ai.mt-4');

  rippleAiDiv.innerHTML = `
    <div class="ripple-ai-header flex items-center">
      <a href="https://github.com/CelestialRipple/AI-Summary" target="_blank">
        <img src="https://myripple.cc/uploads/2023/04/1681875518-icon-RippleGPT.png" class="ai-icon">
      </a>
      <span class="Aisummary"> AI 生成的摘要</span>
      <button class="ripple-ai-btn">AI 插图</button>
    </div>
    <p class="ripple-ai-content ai-summary-target"></p>
    <div class="powered-by">powered by RippleAi</div>
  `;


const cyberContainerHtml = `
  <div class="cyber-container" onclick="fetchAudioAndPlay()" style="cursor: pointer;"><div class="cyber-banner-short bg-purple fg-white mt-4"><span class="cyber-text">让大名鼎鼎的V为您介绍！</span>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  </div> <div class="image-container" style="z-index: 1;margin-left: -60px;">
    <img src="https://myripple.cc/uploads/2023/04/1681997903-V-removebg-preview-2.png" style="max-height: 60px; max-width: 60px;">
  </div></div>
`;
  const content = RippleGPT.getTitleAndContent();
 const aiSummaryTarget = document.querySelector('.ai-summary-target');
  const aiButton = document.querySelector('.ripple-ai-btn');

  // 设置按钮为不可见
  aiButton.style.display = 'none';
  // 创建“生成中”提示的容器
  const aiExplanationDiv = document.createElement('div');
  aiExplanationDiv.className = 'RippleGPT-explanation';
  aiSummaryTarget.appendChild(aiExplanationDiv);
  const aiIcon = document.querySelector('.ai-icon');
  aiIcon.classList.add('rotating');

  // 给“生成中”提示添加 TypeIt 打字效果
  new TypeIt(aiExplanationDiv, {
    strings: ['RippleGPT生成中...'],
    speed: 70,
    loop: true,
    waitUntilVisible: true,
  }).go();
  
RippleGPT.fetchRippleGPT(content).then(summary => {
  aiSummaryTarget.removeChild(aiExplanationDiv);

  new TypeIt(aiSummaryTarget, {
    strings: [summary],
    speed: 50,
    loop: false,
    waitUntilVisible: true,
  }).go();

 setTimeout(() => {
    aiButton.style.display = 'inline-block';
    aiIcon.classList.remove('rotating');
    
    // 将新的 HTML 块插入到页面中
    const cyberContainerDiv = document.createElement('div');
    cyberContainerDiv.innerHTML = cyberContainerHtml;
    rippleAiDiv.appendChild(cyberContainerDiv);

// 添加从左侧淡入的动画
setTimeout(() => {
  const cyberContainer = cyberContainerDiv.querySelector('.cyber-container');
  cyberContainer.classList.add('fade-in-animation');
}, 500);

  }, summary.length * 60);

  aiButton.addEventListener('click', () => {
    aiButton.disabled = true;
    aiButton.innerHTML = 'Prompt生成中';
    aiButton.classList.add('blinking');
    aiButton.style.display = 'inline-block';
    aiIcon.classList.remove('rotating');
    const promptContent = aiSummaryTarget.innerText;

    fetch(GPT_URL + 'api/aiprompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: promptContent }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('请求失败');
        }
      })
      .then(data => {
        aiButton.innerHTML = 'Mj绘制中';
        return fetch(MJ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: data.summary.content }),
        });
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('请求失败');
        }
      })
      .then(data => {
        if (data.error) {
          alert('Error: ' + data.error);
          aiButton.style.display = 'inline-block';
          aiIcon.classList.remove('rotating');
          aiButton.innerHTML = 'AI 插图';
        aiButton.classList.remove('blinking');
        aiButton.disabled = false;
          return;
        }

        const imgSrc = 'https://mj.hiripple.com' + data.latest_image_url;

        const imgDiv = document.createElement('div');
        imgDiv.className = 'wp-block-image';
        const imgLink = document.createElement('a');
        imgLink.href = imgSrc;
        imgLink.setAttribute('data-fancybox', 'gallery');
        const img = document.createElement('img');
        img.src = imgSrc;
        imgLink.appendChild(img);
        imgDiv.appendChild(imgLink);
        aiSummaryTarget.parentElement.insertBefore(imgDiv, aiSummaryTarget);

        setTimeout(() => {
          aiButton.style.display = 'inline-block';
          aiButton.innerHTML = 'AI 插图';
        aiButton.classList.remove('blinking');
        aiButton.disabled = false;
      aiIcon.classList.remove('rotating');
        }, 2000);
      })
      .catch(error => {
        console.error('请求失败：', error);
      });
  });

});}
