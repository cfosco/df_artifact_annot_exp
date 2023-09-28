import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from './Landing';
import DeepfakeArtifactAnnotExp from './DeepfakeArtifactAnnotExp';
import "./App.css";

function App() {

  return (
    <Router basename="/df_artifact_annot_exp">
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/interface" component={DeepfakeArtifactAnnotExp} />
      </Switch>
    </Router>
  );
}

export default App;
