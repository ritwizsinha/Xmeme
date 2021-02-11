import React, { useState, useRef, useContext, useEffect} from 'react'
import ReactDOM from 'react-dom';
import './style.css';
import { PostContext } from '../../Context';
function Modal({
    isOpen,
    close,
    post,
    caption: cp,
    url: u,
    name: nm,
    edit,
}) {
    const loadMemes = useContext(PostContext).loadMemes;
    const name = useRef(nm);
    const url = useRef(u);
    const caption = useRef(cp);
    const [error, setError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const Input = ({ refr, type, placeholder, title }) => {
        return (
            <div className="modal_input">
                <div className="input_title">{title}</div>
                <div className="input_box_container">
                    <input type={type} placeholder={placeholder} defaultValue={refr.current} onChange={(e) => refr.current = e.target.value} className="input_box_2" />
                </div>
            </div>
        )

    }

    const Button = ({ action, placeholder }) => {
        return (
            <div className="btn">
                <div onClick={action}>
                    {placeholder}
                </div>
            </div>
        )
    }

    const postAction = async () => {
        setShowResponse(true);
        setTimeout(() => {
            setShowResponse(false);
            setError(false);
            setSaveSuccess(false);
        }, 2000);
        if (name.current && url.current && caption.current) {
            const res = await post(name.current, url.current, caption.current);
            if (res.error) {
                setError(res.error);
            } else {
                setSaveSuccess(true);
                setTimeout(async () => {
                    await loadMemes();
                    close();
                }, 2000);
            }
        } else {
            setError("All fields are not filled");
        }
    }
    const showResponseMessage = () => {
        if (showResponse) {
            if (error) {
                return (
                    <div className="error">
                        {error}
                    </div>
                )
            } else if (saveSuccess) {
                return (
                    <div className="success">
                        Posted Successfully!
                    </div>
                )
            }
        }
        return null;
    }

    useEffect(() => {
        return () => {
            name.current = '';
            url.current = '';
            caption.current = '';
        }
    }, [])
    if (isOpen) {
        return ReactDOM.createPortal(
            <>
                <div className="overlay_modal" />
                <div className="content_modal">
                    <div className="modal_header">
                        Create a Meme Post
                    </div>
                    <div className="modal_content">
                        {!edit && <Input
                            type="text"
                            title="Add name"
                            placeholder="Add a name..."
                            refr={name}
                        />}
                        <Input
                            type="url"
                            title="Add Image Url"
                            placeholder="Add image url..."
                            refr={url}
                        />
                        <Input
                            type="text"
                            title="Add Caption"
                            placeholder="Add a caption..."
                            refr={caption}
                        />
                        {showResponseMessage()}
                        <Button action={postAction} placeholder={"Post"} />
                        <Button action={close} placeholder={"Cancel"} />
                    </div>

                </div>
            </>,
            document.getElementById('portal')
        )
    }
    return null;
}


export default Modal
