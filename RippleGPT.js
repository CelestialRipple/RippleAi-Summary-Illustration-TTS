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
    const apiUrl = 'https://api.hiripple.com/api/aisummary';
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

function runRippleGPT() {
  const rippleAiDiv = document.querySelector('.ripple-ai.mt-4');

  rippleAiDiv.innerHTML = `
    <div class="ripple-ai-header flex items-center">
      <a href="https://github.com/CelestialRipple/AI-Summary" target="_blank">
        <img src="https://raw.githubusercontent.com/CelestialRipple/RippleAi-Summary-Illustration-TTS/main/icon-RippleGPT.png?token=GHSAT0AAAAAAB4VYILAG5SKQ5ZLDF5WL746ZCCCENQ" alt="AI icon" class="ai-icon">
      </a>
      <span class="Aisummary"> AI 生成的摘要</span>
      <button class="ripple-ai-btn">AI 插图</button>
    </div>
    <p class="ripple-ai-content ai-summary-target"></p>
    <div class="powered-by">powered by RippleAi</div>
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
  }, summary.length * 50);

  aiButton.addEventListener('click', () => {
    aiButton.disabled = true;
    aiButton.innerHTML = 'Prompt生成中';
    aiButton.classList.add('blinking');
    aiButton.style.display = 'inline-block';
    aiIcon.classList.remove('rotating');
    const promptContent = aiSummaryTarget.innerText;

    fetch('https://api.hiripple.com/api/aiprompt', {
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
        aiButton.innerHTML = 'Midjourney绘制中';
        return fetch('https://mj.hiripple.com/api/send_and_receive?cdn=true', {
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

