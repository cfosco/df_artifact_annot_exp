import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from './Landing';
import DeepFakeClick from './DeepFakeClick';
import "./App.css";

function App() {

  return (
    <Router basename="/dfclick">
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/interface" component={DeepFakeClick} />
      </Switch>
    </Router>
  );
}

export default App;
