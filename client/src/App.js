import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Container from './components/Container';
import { STATE } from '../src/constants';
import { PostContext } from './Context';
import axios from 'axios';
import { SERVER_URL } from './constants';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function App() {

  // Making global state for searchedText, posts and api state
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [state, setState] = useState(STATE.LOADING);

  // Function for loading memes by posting a get request
  const loadMemes = useCallback(async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/memes`);
      setState(STATE.LOADED);
      setPosts(res.data);
    } catch (err) {
      setState(STATE.ERROR);
    }
  }, []);

  // Loading memes when component loads
  useEffect(() => {
    loadMemes();
  }, [loadMemes]);
  return (
    // Providing context or global state to the app
    <PostContext.Provider value={{
      state,
      posts,
      searchText,
      loadMemes,
    }
    }>
      <NotificationContainer />
      <Header text={searchText} setText={setSearchText} />
      <Container />
    </PostContext.Provider>

  )
}


export default App;