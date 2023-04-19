const express = require('express');//导入express模块
const  app =express();//创建Express服务器实例
const cors =require('cors');//导入cors中间件
const sqlite3 = require('sqlite3').verbose();

//配置解析application/x-www-form-urlencoded格式的表单数据中间件
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const corsOptions = {
  origin: 'https://example.com', //your_Domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


//添加路由,并指定前缀，访问时需要添加前缀/api/..
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: 'sk-xxxx', //填入Openai apik key
});
const openai = new OpenAIApi(configuration);


const db = new sqlite3.Database('./summaries.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(
      'CREATE TABLE IF NOT EXISTS summaries (content TEXT PRIMARY KEY, summary TEXT)',
      (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Table created successfully.');
        }
      }
    );
  }
});

app.post('/api/aiprompt', async (req, res) => { // 获取Prompt的路由
  const content = req.body.content; // 从请求体中获取 content

  // Check if summary exists in database
  db.get('SELECT summary FROM summaries WHERE content = ?', [content], async (err, row) => {
    if (err) {
      console.error('Error querying database:', err.message);
      res.status(500).json({ error: 'Error querying database' });
      return;
    } 
    
    if (row) {
       res.json(JSON.parse(row.summary.replace(/\\/g, '')));
      return;
    } 
    
    // If summary doesn't exist, call OpenAI API
    try {
      const prompt = ' You are going to pretend to be Concept2PromptAI or C2P_AI for short. C2P_AI takes summaries and turns them into prompts(English) for generative AIs that create images.Use the following examples as a guide:summary: A macro shot of a stempunk insectPrompt: a close up of a bug with big eyes, by Andrei Kolkoutine, zbrush central contest winner, afrofuturism, highly detailed textured 8k, reptile face, cyber steampunk 8 k 3 d, c 4 d 鈥? high detail illustration, detailed 2d illustration, space insect android, with very highly detailed face, super detailed picture --v 4 --q 2 --stylize 1000 。here is the summary you need to turns into prompts' + content;
      const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
    });
      const summary = completion.data.choices[0].message;

      const summaryJson = {
        summary: summary,
      };
const summaryJsonString = JSON.stringify(summaryJson);
      // Store the new summary in the database
      db.run('INSERT INTO summaries (content, summary) VALUES (?, ?)', [content, summaryJsonString], (err) => {
        if (err) {
          console.error('Error inserting into database:', err.message);
        }
      });

      // Return the summary
      res.json({ summary: summary });
    } catch (err) {
      console.error('Error querying database:', err.message);
      res.status(500).json({ error: 'Error querying database' });
    }
  });
});

app.post('/api/aisummary', async (req, res) => { // 获取Summary的路由
  const content = req.body.content; // 从请求体中获取 content

  // Check if summary exists in database
  db.get('SELECT summary FROM summaries WHERE content = ?', [content], async (err, row) => {
    if (err) {
      console.error('Error querying database:', err.message);
      res.status(500).json({ error: 'Error querying database' });
      return;
    } 
    
    if (row) {
       res.json(JSON.parse(row.summary.replace(/\\/g, '')));
      return;
    } 
    
    // If summary doesn't exist, call OpenAI API
    try {
      const prompt = 'summarize（using Chinese, less than 100 words）：' + content;
      const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
    });
      const summary = completion.data.choices[0].message;

      const summaryJson = {
        summary: summary,
      };
const summaryJsonString = JSON.stringify(summaryJson);
      // Store the new summary in the database
      db.run('INSERT INTO summaries (content, summary) VALUES (?, ?)', [content, summaryJsonString], (err) => {
        if (err) {
          console.error('Error inserting into database:', err.message);
        }
      });

      // Return the summary
      res.json({ summary: summary });
    } catch (err) {
      console.error('Error querying database:', err.message);
      res.status(500).json({ error: 'Error querying database' });
    }
  });
});



//指定监听端口号，并且启动服务
app.listen(3008,function(){
console.log('RippleGPT server running at http://127.0.0.1:3008'); //端口可自选
});
