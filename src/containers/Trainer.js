import React, { Component } from 'react';
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
                    <button>Train</button>
                </div>
            </div>
        )
    }
}

export default Trainer;