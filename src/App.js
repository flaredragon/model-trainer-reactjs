import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Tester from "./containers/Tester";
import Trainer from "./containers/Trainer";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/test" component={Tester} />
          <Route path="/" exact component={Trainer} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
