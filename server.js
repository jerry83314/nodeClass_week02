const http = require('http');
const mongoose = require('mongoose');
const Posts = require('./model/postsModel');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB)
  .then(() => {
    console.log('mongoose 連線成功')
  })

const requestListener = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  };

  let body = '';
  req.on('data', (chunk) => {
    body += chunk
  });

  if (req.url == '/posts' && req.method == 'GET') {
    const posts = await Posts.find();
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": posts
    }));
    res.end();
  } else if (req.url == '/posts' && req.method == 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        await Posts.create({
          name: data.name,
          tags: data.tags,
          type: "",
          image: "",
          createAt: "",
          content: data.content,
          likes: 0,
          comments: 0
        });
        const posts = await Posts.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          "status": "success",
          data: posts
        }));
        res.end();
      } catch (error) {
        res.writeHead(400, headers);
        res.write(JSON.stringify({
          "status": "false",
          "message": "格式錯誤",
          "error": error
        }));
        res.end();
      }
    });
  } else if (req.url == '/posts' && req.method == 'DELETE') {
    await Posts.deleteMany({});
    const posts = await Posts.find();
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": posts
    }));
    res.end();
  } else if (req.url.startsWith('/posts/') && req.method == 'DELETE') {
    try {
      const id = req.url.split('/').pop();
      await Posts.findByIdAndDelete(id);
      const posts = await Posts.find();
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        "status": "success",
        "data": posts
      }));
      res.end();
    } catch (error) {
      res.writeHead(400, headers);
      res.write(JSON.stringify({
        "status": "false",
        "message": "無此 ID",
        "error": error
      }));
      res.end();
    }
  } else if (req.url.startsWith('/posts/') && req.method == 'PATCH') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        const id = req.url.split('/').pop();
        await Posts.findByIdAndUpdate(id, {
          name: data.name,
          tags: data.tags,
          type: data.type,
          image: data.image,
          createAt: "",
          content: data.content,
          likes: data.likes,
          comments: data.comments
        });
        const posts = await Posts.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          "status": "success",
          "data": posts
        }));
        res.end();
      } catch (error) {
        res.writeHead(400, headers);
        res.write(JSON.stringify({
          "status": "false",
          "message": "無此 ID",
          "error": error
        }));
        res.end();
      }
    });
  }
};

const server = http.createServer(requestListener);
server.listen(3005);