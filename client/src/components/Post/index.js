import React, { useEffect, useState } from 'react';

import './style.css';
import Modal from '../Modal';
import { SERVER_URL } from '../../constants';
import axios from 'axios';
import loadingGIF from '../../public/Loading.gif';
import errorGIF from '../../public/error.gif';
import NotificationManager from 'react-notifications/lib/NotificationManager';
// Component for for handling the state and actions on a single post
const Post = ({
    id,
    name,
    url,
    caption,
    rerenderList,
}) => {
    // Denotes whether the current user liked the post or not
    const [liked, setLiked] = useState(false);
    // Modal visible or not
    const [open, setOpen] = useState(false);

    // If the image link provided loaded or not
    const [loaded, setLoaded] = useState(false);
    // If there was some error
    const [error, setError] = useState(false);

    // Total likes for this post
    const [totalLikes, setTotalLikes] = useState(0);

    // Post action to be passed to the modal for meme post editing
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

    // Function for getting the total likes to a post
    const getLikes = async () => {
        try {
            return await axios.get(`${SERVER_URL}/like/${id}`);
        } catch (err) {
            console.error(err);
            return {
                likes: 0,
            };
        }
    }
    // On component load get if the post was liked by user and get total likes for user
    useEffect(() => {
        const f = async () => {
            localStorage.getItem(id) && setLiked(true);
            const res = await getLikes();
            setTotalLikes(res.data.likes);
        }
        f();
    }, []);
    // WHenever the component gets out of focus then get if the post id is present in local storage or not. If the state of like is different 
    // in the state variable and local storage then update the local storage and database. This stops too much api requests.
    const offFocus = async () => {
        if (liked && !localStorage.getItem(id)) {
            localStorage.setItem(id, id);
            try {
                await axios.post(`${SERVER_URL}/like/${id}`);
            } catch (err) {
                NotificationManager.error('Error in liking post');
            }
        } else if (!liked && localStorage.getItem(id)) {
            localStorage.removeItem(id);
            try {
                await axios.post(`${SERVER_URL}/unlike/${id}`);
            } catch (err) {
                NotificationManager.error('Error in liking post');
            }
        }
    }
    return (
        <>
            <div className="post_container" onMouseOut={offFocus}>
                <div className="post_caption">
                    {caption}
                </div>
                <div className="post_image">
                    {error &&
                        <div>
                            <img src={errorGIF} alt="Gif showing error message in a terminalesque way" />
                        </div>}
                    {!loaded && (
                        <div>
                            <img src={loadingGIF} alt="Gif showing a container containing moving liquid" />
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
                    {liked ? `You and ${totalLikes} others` : `${totalLikes} people`} liked this
            </div>
                <div className="post_actions">
                    <div className={liked ? "action_like_selected" : "action_like"} onClick={() => {
                        setLiked(liked => !liked);
                    }} >
                        +1
                </div>
                    <div className="action_edit" onClick={() => setOpen(true)}>
                        Edeeet !!!!
                    </div>
                </div>
            </div>
            <Modal isOpen={open} caption={caption} close={() => setOpen(open => !open)} name={name} url={url} key={id} post={post} edit={true} />
        </>
    )
}

export default Post;