// Getting the router to add the routes
const express = require('express');
const Router = express.Router();
// Getting the model for performing mongoose queries
const Post = require('../models/Post');

// Utility function for checking if the url returns a valid image
const isValidImageUrl = require('../utils').checkValidUrl;

// Middleware to get a post and send relevant error messages
const getPost = async (req, res, next) => {
    let post;
    const id = req.params.id;
    if (!id) {
        // Returning invalid request if id not specified
        return res.status(400).json({ message: "Id not found" });
    }

    // Returns a 404 if the id cannot be converted to mongo Object ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: 'No post found',
        })
    }
    try {
        post = await Post.findById({ _id: id }).select({
            "name": 1,
            "url": 1,
            "caption": 1,
        }).exec();
        if (!post) {
            return res.status(404).json({ message: 'No post found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.post = post;
    // Directs to the next function if the post is found successfully
    next();
}

// Route to get top 100 latest memes.
Router.get('/memes', async (req, res) => {
    try {
        // Sorting in reverse order in ID because in mongo the time is embedded inside ID
        // Lean makes the returning documents plain Javascript objects and not mongoose documents. Improves performance
        let posts = await Post.find().select({
            "name": 1,
            "url": 1,
            "caption": 1,
        }).sort({ _id: -1 }).limit(100).lean().exec();

        posts = posts.map(({ _id, name, url, caption }) => ({
            id: _id,
            name,
            url,
            caption
        }));
        res.status(200).send(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Route for getting a particular meme
Router.get('/memes/:id', getPost, (req, res) => {
    const { _id, name, url, caption } = res.post;
    res.status(200).json({
        id: _id,
        name,
        url,
        caption
    });
});


// Route for updating the url and caption of the meme
Router.patch('/memes/:id', getPost, async (req, res) => {
    // First check if the meme exists or not in the middleware
    const { caption, url } = req.body;
    // The post should have a valid url
    if (!(await isValidImageUrl(url))) {
        res.status(400).json({
            message: 'Invalid image url'
        });
    }
    if (caption) {
        res.post.caption = caption;
    }
    if (url) {
        res.post.url = url;
    }
    try {
        // if the updated meme matches another meme then a duplicate post status code 409 is issued
        const post = await Post.findOne({ caption: res.post.caption, url: res.post.url }).lean().exec();
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
            res.status(409).send();
        }
    } catch (err) {
        res.status(500).send();
    }
});
// Route to post a meme
Router.post('/memes', async (req, res) => {
    const { name, url, caption } = req.body;
    // The post should have a name, url and caption
    if (!name || !url || !caption) {
        res.status(400).json({
            message: 'Required parameters not found'
        });
    }
    // The post should have a valid url
    if (!(await isValidImageUrl(url))) {
        res.status(400).json({
            message: 'Invalid image url'
        });
    }

    const post = await Post.findOne({ name, url, caption }, {}).lean().exec();
    // The name, url and caption should not be repeated as a triplet
    if (!post) {
        const post = new Post({
            name,
            url,
            caption,
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
// Increment the number of likes by one by id
Router.post('/like/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send();
    } 
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).send();
    }
    try {
        const result = await Post.findOneAndUpdate({
            _id : id
        }, {
            $inc: {
                "likes": 1
            }
        }).exec();
        if (!result) {
            return res.status(404).send();
        } else {
            return res.status(200).send();
        }
    } catch(err) {
        return res.status(500).send();
    }
});

// Decrease the number of likes for a particular post
Router.post('/unlike/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send();
    } 
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).send();
    }
    try {
        const result = await Post.findByIdAndUpdate({
            _id : id
        }, {
            $inc: {
                "likes": -1
            }
        }).exec();
        if (!result) {
            return res.status(404).send();
        } else {
            return res.status(200).send();
        } 
    } catch(err) {
        return res.status(500).send();
    }
});

// Get all the likes for a particular post
Router.get('/like/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send();
    } 
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).send();
    }
    try {
        const likes = await Post.findById({
            _id: id,
        }).select('likes').exec();
        return res.status(200).json({
            likes: likes.likes,
        });
    } catch(err)  {
        return res.status(500).send();
    }
})

module.exports = Router;