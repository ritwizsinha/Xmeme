import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../constants';
import axios from 'axios';
import Post from '../Post';

const STATE = {
    LOADING: 0,
    LOADED: 1,
    ERROR: 2,
}
const List = () => {
    const [state, setState] = useState(STATE.LOADING);
    const [posts, setPosts] = useState([]);
    const loadMemes = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/memes`);
            setState(STATE.LOADED);
            setPosts(res.data);
        } catch(err) {
            setState(STATE.ERROR);  
        }
    }
    useEffect(() => {
        loadMemes();
    },[]);
    const LoadingState = () => {
        return (
            <div className="list_loading">
                Loading
            </div>
        )
    }

    const ErrorState = () => {
        return (
            <div className="list_error">
                Error in loading Posts
            </div>
        )
    }

    const LoadedState = () => {
        return (
            <div className="list_loaded">
                {
                    posts.map(({ id, name, url, caption }, index) => <Post key={index} id={id} name={name} url={url} caption={caption} rerenderList={loadMemes}/>)
                }
            </div>
        )
    }
    return (
        <div className="list_container">
            {(state === STATE.LOADING) && <LoadingState />}
            {(state === STATE.LOADED) && <LoadedState />}
            {(state === STATE.ERROR) && <ErrorState />}
        </div>
    )
}

export default List;