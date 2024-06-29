import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import components
import Layout from './components/Layout';
// import pages
import Home from './pages/Home';
import Upload from './pages/Upload';
import Groups from './pages/Groups';
import XML from './pages/XML';

function App() {
    // state that saves the search type
    const [searchType, setSearchType] = useState('Text');
    // state that saves where to search in the text
    const [searchInText, setSearchInText] = useState('All');
    // state that saves the text to search
    const [textToSearch, setTextToSearch] = useState('');
    // state to save if a search was activated
    const [search, setSearch] = useState(false);
    // state to save if a search was activated
    const [updateSearch, setUpdateSearch] = useState(false);

  return (
    // define the router to control the navbar navigation
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home searchType={searchType} setSearchType={setSearchType} searchInText={searchInText} setSearchInText={setSearchInText} textToSearch={textToSearch} setTextToSearch={setTextToSearch} search={search} setSearch={setSearch} updateSearch={updateSearch}/>} />
          <Route path="/Upload" element={<Upload />} />
          <Route path="/Groups" element={<Groups setSearchType={setSearchType} setSearchInText={setSearchInText} setTextToSearch={setTextToSearch} setSearch={setSearch} setUpdateSearch={setUpdateSearch} updateSearch={updateSearch}/>} />
          <Route path="/XML" element={<XML />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
