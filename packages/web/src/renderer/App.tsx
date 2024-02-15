import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import LoginForm from './views/LoginForm';
import ChatView from './views/ChatView';
import Register from './views/Register';
import AppState from './state';
import { theme } from './theme';

const App = () => {
  return (
    <AppState>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<ChatView />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AppState>
  );
};

export default App;
