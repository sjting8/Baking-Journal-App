import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JournalList } from './components/JournalList';
import { HomeView } from './components/HomeView';
import { CssBaseline } from '@mui/material';
import './App.css';

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/journal/new" element={<JournalList />} />
          <Route path="/journal/:id" element={<JournalList />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;