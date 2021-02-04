const express = require('express');
const Post = require('../models/Post');
const Router = express.Router();

const getUser = async (req, res, next) => {
    let post;
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Id not found" });
    }
    try {
        post = await Post.findById({ _id: id }).select({
            "user": 1,
            "image": 1,
            "caption": 1,
        }).lean();
        if (!post) {
            return res.status(404).json({ message: 'No post found' });
        }
    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
    res.post = post;
    next();
} 

Router.get('/memes', async (req, res) => {
    try {
        let posts = await Post.find().select({
            "user": 1,
            "image": 1,
            "caption": 1,
            "posted": 1,
        }).sort('posted').limit(100).lean();

        posts = posts.map(({_id, user, image, caption}) => ({
            id: _id,
            name: user,
            url: image,
            caption
        }));
        res.send(posts);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
})

Router.get('/memes/:id', getUser, (req, res) => {
    const { _id, user, image, caption } = res.post;
    res.status(200).json({
        id: _id,
        name: user,
        url: image,
        caption
    });
});

Router.patch('/memes/:id', getUser, async (req, res) => {
    if (req.body.caption) {
        res.post.caption = req.body.caption;
    }
    if (req.body.url) {
        res.post.image = req.body.url;
    }
    try {
        const updatedPost = await res.post.save();
        res.json(updatedPost);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

Router.post('/memes', async (req, res) => {
    const post = new Post({
        user: req.query.name,
        image: req.query.url,
        caption: req.query.caption
    });
    try {
        const newPost = await post.save();
        res.status(201).json({ id: newPost._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})




module.exports = Router;