import React, { useContext } from 'react';
import Post from '../Post';
import './style.css';
import { STATE } from '../../constants';
import { PostContext } from '../../Context';

const List = () => {
    const context = useContext(PostContext);
    const state = context.state;
    const posts = context.posts;
    const searchText = context.searchText;
    const modifiedPosts = posts.filter(({ caption }) => caption.includes(searchText));
    const LoadingState = () => {
        return (
            <div className="list_loading">
                Loading....
            </div>
        )
    }

    const ErrorState = () => {
        return (
            <div className="list_error">
                Error in Loading Posts....
            </div>
        )
    }

    const LoadedState = () => {
        return (
            <div className="list_loaded">
                {
                    modifiedPosts
                    .map(({ id, name, url, caption }, index) => <Post key={index} id={id} name={name} url={url} caption={caption}/>)
                }
            </div>
        )
    }

    const NoPosts = () => {
        return (
            <div className="list_empty">
                No Posts Found...
            </div>
        )
    }

    return (
        <div className="list_container">
            {(state === STATE.LOADING) && <LoadingState />}
            {(state === STATE.LOADED) && posts.length > 0 && <LoadedState />}
            {(state === STATE.LOADED) && modifiedPosts.length === 0 && <NoPosts />}
            {(state === STATE.ERROR) && <ErrorState />}
        </div>
    )
}

export default List;