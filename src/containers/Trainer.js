import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import SentimentWrapper from '../components/SentimentComponent/SentimentWrapper';
import AddSentiment from '../components/SentimentComponent/AddSentiment';
import SentenceWrapper from '../components/SentenceComponent/SentenceWrapper';


const styleSentiment = {
    width: "100%",
    height: "100%",
    margin: "0",
    display:"flex"
}

const styleSentences = {
    width: "100%",
    height: "100%",
    margin: "0",
    display: "flex"
}

const linkStyle = {
    color: "white",
    textDecoration: "none",
    margin: "5px",
    marginTop: "20px"
}

class Trainer extends Component {
    render(){
        return (
            <div>
                <div style={styleSentiment}>
                    <SentimentWrapper style={{display:"inline-block"}}></SentimentWrapper>
                    <AddSentiment></AddSentiment>
                </div>
                <div style={styleSentences}>
                    <SentenceWrapper></SentenceWrapper>
                </div>
                <div>
                    
                    <Link to='/test' style={linkStyle}>
                        <Button bsStyle="primary">Train</Button>   
                    </Link>
                    
                </div>
            </div>
        )
    }
}

export default Trainer;