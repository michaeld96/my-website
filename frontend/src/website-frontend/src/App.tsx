import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewNote from './pages/NewNote';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Editor from './pages/Editor';
import About from './pages/About';
import Contact from './pages/Contact';
import PreviewNotes from './pages/PreviewNotes';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/new-note" element={ <NewNote/> }/>
                <Route path="/admin" element={ <Login/> }/>
                <Route path="/editor" element={ <Editor/> }/>
                <Route path="/projects" element={ <Projects/> }/>
                <Route path="/about" element={ <About/> }/>
                <Route path="/contact" element={ <Contact/> } />
                <Route path="/notes" element={ <PreviewNotes /> } /> 
                <Route path="/notes/:schoolCode" element={ <PreviewNotes /> } />
                <Route path="/notes/:schoolCode/:subjectCode/:subjectSlug" element={ <PreviewNotes /> } /> {/* when this url hits render this component. */}
                <Route path="/notes/:schoolCode/:subjectCode/:subjectSlug/:noteSlug" element={ <PreviewNotes /> } />
                <Route path='*' element={ <NotFound/>} />
            </Routes>
        </Router>
    )
}

export default App;