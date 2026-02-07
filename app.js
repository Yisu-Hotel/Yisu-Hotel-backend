require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/status', (req, res) => {
  res.json({ code: 200, msg: 'Express后端服务启动成功！', data: null });
});

app.get('/api/test', (req, res) => {
  res.json({code: 200, msg: '前后端连通性测试成功', data: {timestamp: new Date().toISOString(), method: req.method, path: req.path}});
});

const PORT = process.env.PORT;

const authRoutes = require('./src/routes/pc/auth');
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Express服务运行在：http://localhost:${PORT}`);
});