const express = require('express');
const Post = require('../models/Post');
const Router = express.Router();

const getPost = async (req, res, next) => {
    let post;
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Id not found" });
    }
    try {
        post = await Post.findById({ _id: id }).select({
            "name": 1,
            "url": 1,
            "caption": 1,
        });
        if (!post) {
            return res.status(404).json({ message: 'No post found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.post = post;
    next();
}

Router.get('/memes', async (req, res) => {
    try {
        let posts = await Post.find().select({
            "name": 1,
            "url": 1,
            "caption": 1,
        }).sort({ _id: -1 }).limit(100).lean();
        console.log(posts);

        posts = posts.map(({ _id, name, url, caption }) => ({
            id: _id,
            name,
            url,
            caption
        }));
        res.send(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

Router.get('/memes/:id', getPost, (req, res) => {
    const { _id, name, url, caption } = res.post;
    res.status(200).json({
        id: _id,
        name,
        url,
        caption
    });
});

Router.patch('/memes/:id', getPost, async (req, res) => {
    const { caption, url } = req.body;
    if (caption) {
        res.post.caption = caption;
    }
    if (url) {
        res.post.url = url;
    }
    try {
        const post = await Post.findOne({ caption: res.post.caption, url: res.post.url }).lean();
        if (!post) {
            const updatedPost = await res.post.save();
            const { _id, name, url, caption } = updatedPost;
            res.json({
                id: _id,
                name,
                url,
                caption
            });
        } else {
            res.status(409).json({
                message: 'Duplicate post',
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

Router.post('/memes', async (req, res) => {
    const { name, url, caption } = req.query;
    if (!name || !url || !caption) {
        res.status(400).json({
            message: 'Required parameters not found'
        });
    }
    const post = await Post.findOne({ name, url, caption }, {}).lean();
    if (!post) {
        const post = new Post({
            name: req.query.name,
            url: req.query.url,
            caption: req.query.caption
        });
        try {
            const newPost = await post.save();
            res.status(201).json({ id: newPost._id });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(409).json({
            message: 'Duplicate post',
        })
    }

})




module.exports = Router;