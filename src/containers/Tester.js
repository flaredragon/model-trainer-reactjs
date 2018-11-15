import React, { Component } from 'react';
import Spinner from '../components/Spinner/Spinner';

class Tester extends Component {

    state={
        loading: true
    }


    render(){

        let trainState = (this.state.loading ? <Spinner /> : <div>Model Trained</div>);

        return (
            <div>{trainState}</div>
        )
    }
}

export default Tester;