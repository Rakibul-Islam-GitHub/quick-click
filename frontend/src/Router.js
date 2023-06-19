import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from "./App";
import HomePage from "./Home";
import Login from "./login";
import Register from "./Register";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={App} />
        <Route path="/Login" element={Login} />
        <Route path="/Register" element={Register} />
        <Route path="/Home" elementt={HomePage} />
      </Routes>
    </Router>
  );
};

export default AppRouter;