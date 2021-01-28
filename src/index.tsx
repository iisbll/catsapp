import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { render } from "react-dom";

import Home from "./pages/Home";
import Cat from "./pages/Cat";
import NoMatch from "./pages/NoMatch";

import "./styles/index.scss";


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/:breed" >
          <Cat />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="*">
          <NoMatch />
          </Route>
      </Switch>
    </Router>
  )
}

render(<App />, document.getElementById("root"));