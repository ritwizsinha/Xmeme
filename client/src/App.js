import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Container from './components/Container';
import { STATE } from '../src/constants';
import { PostContext } from './Context';
import axios from 'axios';
import { SERVER_URL } from './constants';

function App() {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [state, setState] = useState(STATE.LOADING);
  const loadMemes = useCallback(async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/memes`);
      setState(STATE.LOADED);
      setPosts(res.data);
    } catch (err) {
      setState(STATE.ERROR);
    }
  }, []);

  useEffect(() => {
    loadMemes();
  }, [loadMemes]);
  return (
    <PostContext.Provider value={{
      state,
      posts,
      searchText,
      loadMemes,
    }
    }>
      <Header text={searchText} setText={setSearchText} />
      <Container />
    </PostContext.Provider>

  )
}


export default App;