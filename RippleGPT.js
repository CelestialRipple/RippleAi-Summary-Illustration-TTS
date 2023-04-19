var RippleGPT = {
  //读取文章中的所有文本
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
      // 移除包含'http'的链接
      const filteredText = p.innerText.replace(/https?:\/\/[^\s]+/g, '');
      content += filteredText;
    }
  
    const combinedText = title + ' ' + content;
    const truncatedText = combinedText.slice(0, 3000);
    return truncatedText;
  },
  

fetchRippleGPT: async function(content) {
  const apiUrl = 'https://api.hiripple.com/api/aisummary';
  const timeout = 500000; // 设置超时时间（毫秒）

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

}
function runRippleGPT() {
  const content = RippleGPT.getTitleAndContent();
  const aiSummaryTarget = document.querySelector('.ai-summary-target');

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

  // 在摘要标题旁边添加按钮
  const summaryButton = document.createElement('button');
  summaryButton.style.color = '#FFFFFF';
  summaryButton.style.cursor = 'pointer';
  summaryButton.style.backgroundColor = '#000000';
  summaryButton.style.border = '1px solid';
  summaryButton.style.display = 'inline-flex';
  summaryButton.style.alignItems = 'center';
  summaryButton.style.justifyContent = 'center';
  summaryButton.style.height = '2rem';
  summaryButton.style.paddingLeft = '1.25rem';
  summaryButton.style.paddingRight = '1.25rem';
  summaryButton.style.minWidth = '100px';
  summaryButton.style.borderradius = '10px';
  summaryButton.style.fontWeight = '500';
  summaryButton.style.marginLeft = '10px';
  summaryButton.style.marginbottom = '10px';
  summaryButton.style.paddingtop = '5px'; 
  summaryButton.style.display = 'none'; 

  const style = document.createElement('style');
style.innerHTML = `
  @keyframes blinking {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(style);
  // 添加文本
  const buttonText = document.createTextNode('AI插图');
  summaryButton.appendChild(buttonText);

  const aiSummaryTitle = document.querySelector('.Aisummary');
  aiSummaryTitle.parentElement.insertBefore(summaryButton, aiSummaryTitle.nextSibling);

  RippleGPT.fetchRippleGPT(content).then(summary => {
    // 移除“生成中”提示
    aiSummaryTarget.removeChild(aiExplanationDiv);


    // 使用 TypeIt 实现摘要的打字机效果
    new TypeIt(aiSummaryTarget, {
      strings: [summary],
      speed: 50,
      loop: false,
      waitUntilVisible: true,
    }).go();

    // 显示按钮
    setTimeout(() => {
      summaryButton.style.display = 'inline-block';
      aiIcon.classList.remove('rotating');

    }, summary.length * 50); // 这里的50是TypeIt的速度

    // 为按钮添加点击事件
 // ...

// 为按钮添加点击事件
summaryButton.addEventListener('click', () => {
  summaryButton.disabled = true;
  summaryButton.innerHTML = ' Prompt生成中';
  summaryButton.style.animation = 'blinking 1s infinite';
  const promptContent = aiSummaryTarget.innerText;

  // 发送请求到 https://api.hiripple.com/api/aiprompt
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
        summaryButton.style.animation = ''; // 移除闪烁动画
      }
    })
    .then(data => {
      summaryButton.innerHTML = ' Midjourney绘制中';
      // 发送请求到 https://mj.hiripple.com/api/send_and_receive
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
        summaryButton.innerHTML = 'AI插图'
        summaryButton.style.animation = ''; // 移除闪烁动画
        summaryButton.disabled = false;
        return;
      }

      const imgSrc = 'https://mj.hiripple.com' + data.latest_image_url;

      // 创建包含图片的div
      const imgDiv = document.createElement('div');
      imgDiv.className = 'wp-block-image';
    
      // 创建a元素
      const imgLink = document.createElement('a');
      imgLink.href = imgSrc;
      imgLink.setAttribute('data-fancybox', 'gallery');
    
      // 创建img元素
      const img = document.createElement('img');
      img.src = imgSrc;
    
      // 将img插入a元素
      imgLink.appendChild(img);
    
      // 将a元素插入imgDiv
      imgDiv.appendChild(imgLink);
    
      // 在摘要正文之前插入图片
      aiSummaryTarget.parentElement.insertBefore(imgDiv, aiSummaryTarget);

      // 延迟恢复按钮原状
      setTimeout(() => {
        summaryButton.innerHTML = ' AI插图';
        summaryButton.disabled = false;
        summaryButton.style.animation = ''; // 移除闪烁动画
      }, 2000);
    })
    .catch(error => {
      console.error('请求失败：', error);


            });
            });
            });
            }
            
