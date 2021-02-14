import { useState } from 'react';

import './style.css';
import Modal from '../Modal';
import { SERVER_URL } from '../../constants';
import axios from 'axios';

const CreatePost = () => {
    // State controlling the visiblity of modal
    const [open, setOpen] = useState(false);
    // Post function to be passed to the modal as an action performing a new meme post
    const post = async (name, url, caption) => {
        try {
            await axios.post(`${SERVER_URL}/memes`, {
                name,
                url,
                caption,
            });
            return {
                
            }
        } catch(err) {
            console.log(err);
            if (err && err.statusCode === 409) {
                return {
                    error: 'Duplicate post present'
                }
            }
            return {
                error: err.message
            }
        }
    }
    const close = () => setOpen(false)
    return (
        <>
        {/* The add meme post button */}
            <div className="fab" onClick={() => setOpen(true)}>
                +
            </div>
            <Modal isOpen={open} close={close} post={post} name={''} url={''} caption={''} edit={false}/>
        </>
    )
}

export default CreatePost;