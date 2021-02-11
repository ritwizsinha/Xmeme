const express = require('express');
const Like = require('../models/Like');
const Router = express.Router();
const getIpFromReq = require('../utils').getIpFromReq;

const getLikeMiddleware = async (req, res, next) => {
    const ip = getIpFromReq(req);
    const postId = req.params.id;
    try {
        const like = await Like.findOne({
            ip,
            post: postId,
        }).lean();
        if (!like) {
            next();
        } else {
            await Like.remove({
                ip,
                post: postId,
            }).lean()
            return res.status(200).json({
                message: "Like removed",
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

Router.get('/like/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const likes = await Like.countDocuments({
            post: id,
        })
        return res.status(200).json({
            likes,
        })
    } catch(err) {
        console.log("Inside error");
        console.error(err);
        return res.status(500).json({
            likes: 0,
            message: err && err.message ? err.message : err
        });
    }
})

Router.get('/like/me/:id', async (req, res) => {
    const id = req.params.id;
    const ip = getIpFromReq(req);
    try {
        const me = await Like.find({
            post: id,
            ip,
        }, {}).lean();
        console.log(me);
        if (!me) {
            return res.status(200).json({
                liked: me,
                message: 'Like not found',
            })
        } else {
            return res.status(200).json({
                like: me,
                message: 'Like found',
            })
        }
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: err && err.message ? err.message : err
        })
    }
})

Router.post('/like/:id', getLikeMiddleware, async (req, res) => {
    const ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
    const postId = req.params.id;
    try {
        const like = new Like({
            ip,
            post: postId,
        })
        const newLike = await like.save();
        res.status(201).json(newLike);
    } catch (err) {
        res.status(500).json({
            message: err && err.message ? err.message : err
        })
    }

});

module.exports = Router;