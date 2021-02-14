import React, { useContext, useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom';
import './style.css';
import { PostContext } from '../../Context';
// Notification manager helps in issuing out notifications
import { NotificationManager } from 'react-notifications';
import axios from 'axios';
// Modal component for posting and editing memes
function Modal({
    isOpen,
    close,
    post,
    caption: cp,
    url: u,
    name: nm,
    edit,
}) {
    // Using context api hook to access global state
    const loadMemes = useContext(PostContext).loadMemes;
    // Setting the url, name and caption to state variables
    const [url, setUrl]= useState(u);
    const [name, setName] = useState(nm);
    const [caption, setCaption] = useState(cp);

    const [memeUrls, setMemeUrls] = useState([]);
    const Input = useCallback(({ val, setValue, type, placeholder, title }) => {
        return (
            <div className="modal_input">
                <div className="input_title">{title}</div>
                <div className="input_box_container">
                    <input type={type} placeholder={placeholder} value={val} onChange={(e) => setValue(e.target.value)} className="input_box_2" />
                </div>
            </div>
        )

    }, [])

    const Button = ({ action, placeholder }) => {   
        return (
            <div className="btn">
                <div onClick={action}>
                    {placeholder}
                </div>
            </div>
        )
    }
    // Action when post button is clicked
    const postAction = async () => {
        if (name && url && caption) {
            const res = await post(name, url, caption);
            if (res.error) {
                NotificationManager.error(res.error);
            } else {
                NotificationManager.success('Saved successfully');
                await loadMemes();
                close();
            }
        } else {
            NotificationManager.error("All fields are not filled");
        }
    }

    // Pinging the imgflip meme  url api for getting 100 image urls, and randomize among them when 'load random url' is clicked
    useEffect(() => {
        const f = async () => {
            const { data }  = await axios.get('https://api.imgflip.com/get_memes');
            if (data && data.success) {
                setMemeUrls(data.data.memes.map(({ url }) => url));
            } else {
                NotificationManager.error('Error in loading meme urls');
            }
        }
        f();
    }, [])
    if (isOpen) {
        return ReactDOM.createPortal(
            <>
                <div className="overlay_modal" onClick={close} />
                <div className="content_modal">
                    <div className="modal_content_input">
                        <div className="modal_header">
                            {edit ? 'Edit the' : 'Create a'} Meme Post
                    </div>
                        <div className="modal_content">
                            {!edit && <Input
                                type="text"
                                title="Add name"
                                placeholder="Add a name..."
                                val={name}
                                setValue={setName}
                            />}
                            <Input
                                type="url"
                                title="Add Image Url"
                                placeholder="Add image url..."
                                val={url}
                                setValue={setUrl}
                            />
                            <Input
                                type="text"
                                title="Add Caption"
                                placeholder="Add a caption..."
                                val={caption}
                                setValue={setCaption}
                            />
                            <Button action={postAction} placeholder={"Post"} />
                            <Button action={close} placeholder={"Cancel"} />
                            <Button action={() => {
                                setUrl(memeUrls[Math.floor((Math.random()*memeUrls.length-1))] || u)
                            }} placeholder={"Load random url"}/>
                        </div>
                    </div>
                    <div className="modal_image_preview">
                            <div className="image_container">
                            { (url || u) && <img src={url || u} alt="Options to choose from"/> }
                            </div>
                    </div>

                </div>
            </>,
            document.getElementById('portal')
        )
    }
    return null;
}


export default Modal
