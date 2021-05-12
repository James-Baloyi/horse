import React from 'react';
import './App.css';
import {BrowserRouter as Router,Switch, Route, Link} from "react-router-dom";
import CurrentDelivery from "./Components/CurrentDelivery";
import Cancel from "./Components/Cancel";
import Login from "./Components/Login";
import Home from "./Components/Home";
import InnerList from "./Components/InnerList";

export default class App extends React.Component{
  render(){
  return (
    <Router>
        <Switch>

          <Route path="/login" exact component={Login}>
          </Route>


          <Route path="/" exact component={Home}>
          </Route>

          <Route path="/home" exact component={Home}>
          </Route>

          <Route path="/innerlist" exact component={InnerList}>
          </Route>

          <Route path="/current_delivery" exact component={CurrentDelivery}>
          </Route>

          <Route path="/cancel" exact component={Cancel}>
          </Route>

        </Switch>
    </Router>

  );
}
}
