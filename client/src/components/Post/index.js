import React, { useState } from 'react';

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

    const post = async (
        name,
        url,
        caption,
    ) => {
        console.log(name, caption, url);
        try {
            const res = await axios.patch(`${SERVER_URL}/memes/${id}`, {
                name,
                caption,
                url,
            });
            console.log(res);
            return {

            }
        } catch (err) {
            return {
                error: err && err.message ? err.message : err,
            }
        }
    }
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
                    You and 470 others
            </div>
                <div className="post_actions">
                    <div className={liked ? "action_like_selected" : "action_like"} onClick={() => setLiked((liked) => !liked)} >
                        Like
                </div>
                    <div className="action_edit" onClick={() => setOpen(true)}>
                        Edit
                    </div>
                </div>
            </div>
            <Modal isOpen={open} caption={caption} close={() => setOpen(open => !open)} name={name} url={url} key={id} post={post} rerenderList={rerenderList} />
        </>
    )
}

export default Post;