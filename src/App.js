import React, { Component } from 'react';
import { Row,Col } from 'react-bootstrap';
import Trainer from "./containers/Trainer";
import './App.css';

class App extends Component {
  render() {
    return (
        <Row>
          <Trainer/>
        </Row>
    );
  }
}

export default App;
