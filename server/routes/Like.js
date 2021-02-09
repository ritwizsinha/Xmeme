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
            return res.status(409).json({
                message: 'duplicate like',
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
        const likes = Like.find({
            post: id
        }).count();
        return res.status(200).json({
            likes,
        })
    } catch(err) {
        return res.status(500),json({
            message: err.message
        });
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
            message: err.message
        })
    }

});

module.exports = Router;