import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import components
import Navbar from './components/navbar/Navbar';
import Layout from './components/Layout';
// import pages
import Home from './pages/Home';
import Upload from './pages/Upload';
import Groups from './pages/Groups';
import Data_Mining from './pages/Data_Mining';
import How_To_Use from './pages/How_To_Use';
import About from './pages/About';

function App() {
  return (
    // define the router to control the navbar navigation
    <Router>
      <Layout>
        <Routes>
          <Route path="/Home" exact element={<Home />} />
          <Route path="/Upload" element={<Upload />} />
          <Route path="/Groups" element={<Groups />} />
          <Route path="/Data_Mining" element={<Data_Mining />} />
          <Route path="/How_To_Use" element={<How_To_Use />} />
          <Route path="/About" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
