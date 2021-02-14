import { useState } from 'react';

import './style.css';
import Modal from '../Modal';
import { SERVER_URL } from '../../constants';
import axios from 'axios';

const CreatePost = () => {
    const [open, setOpen] = useState(false);
    const post = async (name, url, caption) => {
        try {
            await axios.post(`${SERVER_URL}/memes?`, {
                name,
                url,
                caption,
            });
            return {
                
            }
        } catch(err) {
            if (err && err.message === "Request failed with status code 409") {
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
            <div className="fab" onClick={() => setOpen(true)}>
                +
            </div>
            <Modal isOpen={open} close={close} post={post} name={''} url={''} caption={''} edit={false}/>
        </>
    )
}

export default CreatePost;