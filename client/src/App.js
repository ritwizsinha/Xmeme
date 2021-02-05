import { useState } from 'react';
import Header from './components/Header';
import Container from './components/Container';
function App() {
  const [searchText, setSearchText] = useState('');
  return (
    <div>
      <Header text={searchText} setText={setSearchText} />
      <Container />
    </div>

  )
}


export default App;