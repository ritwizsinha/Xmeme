import React, { useState } from 'react';

import './style.css';
import Modal from '../Modal';
import { SERVER_URL } from '../..//constants'; 
import axios from 'axios';

const Post = ({
    id = "1",
    name = "Ashok Kumar",
    url = "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg",
    caption = "This is a meme",
}) => {
    const [liked, setLiked] = useState(false);
    const [open, setOpen] = useState(false);

    const post = async ({
        name,
        caption,
        url
    }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/memes`, {
                name,
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
    return (
        <>
        <div className="post_container">

            <div className="post_caption">
                {caption}
            </div>
            <div className="post_image">
                <img src={url} alt="post meme" />
            </div>
            <div className="post_username">
                Posted By: {name}
            </div>
            <div className="post_likes">
                You and 470 others
            </div>
            <div className="post_actions">
                <div className={liked ? "action_like_selected" :  "action_like"} onClick={() => setLiked((liked) => !liked)} >
                    Like
                </div>
                <div className="action_edit">
                    Edit
                </div>
            </div>
        </div>
        <Modal isOpen={open} caption={caption} close={setOpen(open => !open)} name={name} url={url} key={id} post={() => {
            console.log("Hello");
        }}/>
        </>
    )
}

export default Post;