import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar.jsx';
import { useAuth } from './hooks/auth.hook';
import { getRoutes } from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  const { token, login, logout, userId, ready } = useAuth();

  const isAuthentificated = !!token;

  return (
    <React.Fragment>
      <AuthContext.Provider
        value={{
          token,
          login,
          logout,
          userId,
          isAuthentificated,
        }}
      >
        <div>
          <Router>
            <Navbar isAuthentificated={isAuthentificated} />
            {getRoutes(isAuthentificated)}
          </Router>
        </div>
      </AuthContext.Provider>
    </React.Fragment>
  );
}

export default App;
