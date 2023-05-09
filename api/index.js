const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');

const app = express();

const secret = 'hg87w4greuiwheuih8232bco17893jcj';

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
const multer = require('multer');
const upload = multer({ dest: 'uploads' });

mongoose.connect(
  'mongodb+srv://tripdiaryapp:Zgte0yc3Ab4QkE9I@trip-diary-cluster.w9uhwta.mongodb.net/trip-diary?retryWrites=true&w=majority'
);

app.post('/register', async (req, res) => {
  const { name, lastname, email, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) res.status(409).json({ email: 'Użytkownik już istnieje!' });
  else {
    const userDoc = await User.create({
      name,
      lastname,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    jwt.sign(
      {
        name: userDoc.name,
        lastname: userDoc.lastname,
        email: userDoc.email,
        id: userDoc._id,
      },
      secret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          name: userDoc.name,
          lastname: userDoc.lastname,
          email: userDoc.email,
          id: userDoc._id,
        });
      }
    );
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });
  if (!userDoc) res.status(401).json({ email: 'Nie ma takiego użytkownika' });
  else {
    const passwordCheck = bcrypt.compareSync(password, userDoc.password);
    if (passwordCheck) {
      jwt.sign(
        {
          name: userDoc.name,
          lastname: userDoc.lastname,
          email: userDoc.email,
          id: userDoc._id,
        },
        secret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token).json({
            name: userDoc.name,
            lastname: userDoc.lastname,
            email: userDoc.email,
            id: userDoc._id,
          });
        }
      );
    } else res.status(401).json({ password: 'Złe hasło' });
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;

  if (token)
    jwt.verify(token, secret, {}, (err, userInfo) => {
      if (err) throw err;
      res.json(userInfo);
    });
});

app.get('/posts', async (req, res) => {
  const posts = await Post.find({})
    .populate('user', 'name lastname')
    .sort({ createdAt: 'desc' });
  res.json(posts);
});
app.get('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const postDoc = await Post.findById(postId).populate('user', 'name lastname');
  res.json(postDoc);
});

app.post(
  '/add_post',
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  async (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, userInfo) => {
      if (err) throw err;

      const newFilePaths = req.files['images'].map((file) => {
        const { originalname, path } = file;
        const parts = originalname.split('.');
        const extension = parts[parts.length - 1];
        const newPath = path + '.' + extension;
        fs.renameSync(path, newPath);
        return newPath;
      });
      const { title, type, length, destination, text } = req.body;
      const { originalname, path } = req.files['cover'][0];
      const parts = originalname.split('.');
      const extension = parts[parts.length - 1];
      const newCoverPath = path + '.' + extension;
      fs.renameSync(path, newCoverPath);

      const postDoc = await Post.create({
        title,
        type,
        length,
        destination,
        text,
        images: newFilePaths,
        cover: newCoverPath,
        user: userInfo.id,
      });

      const userDoc = await User.findOne({ _id: userInfo.id });
      userDoc.posts.push(postDoc._id);
      await userDoc.save();
      res.json(postDoc);
    });
  }
);

app.get('/photos', async (req, res) => {
  var paths = [];

  const posts = await Post.find({}, { _id: 0, cover: 1, images: 1 });
  posts.forEach((post) => {
    paths.push(post.cover);
    post.images.forEach((image) => paths.push(image));
  });
  res.json(paths);
});

app.post(
  '/edit_post/:postId',
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  async (req, res) => {
    const { postId } = req.params;
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, userInfo) => {
      if (err) throw err;

      const postDoc = await Post.findOne({ _id: postId });

      if (userInfo.id === postDoc.user.toString()) {
        if (req.files['images']) {
          const newFilePaths = req.files['images'].map((file) => {
            const { originalname, path } = file;
            const parts = originalname.split('.');
            const extension = parts[parts.length - 1];
            const newPath = path + '.' + extension;
            fs.renameSync(path, newPath);
            return newPath;
          });
          postDoc.images = newFilePaths;
        }

        if (req.files['cover']) {
          const { originalname, path } = req.files['cover'][0];
          const parts = originalname.split('.');
          const extension = parts[parts.length - 1];
          const newPath = path + '.' + extension;
          fs.renameSync(path, newPath);
          postDoc.cover = newPath;
        }

        const { title, type, length, destination, text } = req.body;
        postDoc.title = title;
        postDoc.type = type;
        postDoc.length = length;
        postDoc.destination = destination;
        postDoc.text = text;
        postDoc.save();
        console.log(postDoc);

        res.json(postDoc);
      }
    });
  }
);

app.post('/delete_post/:postId', async (req, res) => {
  const { postId } = req.params;
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, userInfo) => {
    if (err) throw err;

    const postDoc = await Post.findOne({ _id: postId });
    if (postDoc.user.toString() === userInfo.id) {
      await User.findOneAndUpdate(
        { _id: postDoc.user },
        { $pull: { posts: postId } }
      );
      fs.unlink(postDoc.cover, (err) => {
        if (err) throw err;
      });
      postDoc.images.forEach((image) =>
        fs.unlink(image, (err) => {
          if (err) throw err;
        })
      );
      await Post.findOneAndDelete({ _id: postId });
    }
    res.json('ok');
  });
});

app.listen(3000);

//tripdiaryapp
//Zgte0yc3Ab4QkE9I
//mongodb+srv://tripdiaryapp:Zgte0yc3Ab4QkE9I@trip-diary-cluster.w9uhwta.mongodb.net/?retryWrites=true&w=majority
