import React, { useEffect, useState } from 'react';

import './style.css';
import Modal from '../Modal';
import { SERVER_URL } from '../../constants';
import axios from 'axios';
import loadingGIF from '../../public/Loading.gif';
import errorGIF from '../../public/error.gif';

const Post = ({
    id,
    name,
    url,
    caption,
    rerenderList,
}) => {
    const [liked, setLiked] = useState(false);
    const [open, setOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);

    const post = async (
        name,
        url,
        caption,
    ) => {
        try {
            await axios.patch(`${SERVER_URL}/memes/${id}`, {
                caption,
                url,
            });
            return {

            }
        } catch (err) {
            return {
                error: err && err.message ? err.message : err,
            }
        }
    }
    const triggerLike = async () => {
        try {
            await axios.post(`${SERVER_URL}/like/${id}`, {});
        } catch(err) {
            console.error(err);
        }
    }
    const getLikes = async () => {
        try {
            return await axios.get(`${SERVER_URL}/like/${id}`);
        } catch(err) {
            console.error(err);
            return {
                likes: 0,
            };
        }
    }

    const getUserLiked = async () => {
        try {
            return await axios.get(`${SERVER_URL}/like/me/${id}`);
        } catch(err) {
            return {
                liked: false,
            }
        }
    }
    useEffect(() => {
        const f = async () => {
            let res = await getUserLiked();
            if (res.data.liked) {
                setLiked(true);
            }
            res = await getLikes();
            setTotalLikes(res.data.likes);
        }
        f();
    }, []);
    return (
        <>
            <div className="post_container">
                <div className="post_caption">
                    {caption}
                </div>
                <div className="post_image">
                    {error &&
                        <div>
                            <img src={errorGIF} alt="Gif showing error message in a terminalesque way"/>
                        </div>}
                    {!loaded && (
                        <div>
                            <img src={loadingGIF} alt="Gif showing a container containing moving liquid"/>
                        </div>
                    )}
                    <img src={url} alt="post meme" onLoad={() => setLoaded(true)} onError={() => {
                        setError(true)
                        setLoaded(true)
                    }} className={loaded && !error ? '' : 'invisible'} />
                </div>
                <div className="post_username">
                    Posted By: {name}
                </div>
                <div className="post_likes">
                    {liked ? `You and ${totalLikes} others` : `${totalLikes} people` } liked this
            </div>
                <div className="post_actions">
                    <div className={liked ? "action_like_selected" : "action_like"} onClick={() => setLiked(async (liked) => {
                        await triggerLike();
                        console.log("This runs");
                        return !liked
                    })} >
                        Like
                </div>
                    <div className="action_edit" onClick={() => setOpen(true)}>
                        Edit
                    </div>
                </div>
            </div>
            <Modal isOpen={open} caption={caption} close={() => setOpen(open => !open)} name={name} url={url} key={id} post={post} edit={true}/>
        </>
    )
}

export default Post;