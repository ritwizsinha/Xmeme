import React, { useContext } from 'react';
import Post from '../Post';
import './style.css';
import { STATE } from '../../constants';
import { PostContext } from '../../Context';
// List component listing all the posted meme
const List = () => {
    // Using the context hook to access global state
    const context = useContext(PostContext);
    const state = context.state;
    const posts = context.posts;
    const searchText = context.searchText;
    // Posts array filtered with the searched text
    const modifiedPosts = posts.filter(({ caption }) => caption.includes(searchText));
    // JSX for loading state
    const LoadingState = () => {
        return (
            <div className="list_loading">
                Loading....
            </div>
        )
    }
    // JSX for error state
    const ErrorState = () => {
        return (
            <div className="list_error">
                Error in Loading Posts....
            </div>
        )
    }
    // JSX for loaded state
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
    // JSX for empty posts state
    const NoPosts = () => {
        return (
            <div className="list_empty">
                No Posts Found...
            </div>
        )
    }
    // Rendering all states according to application state
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