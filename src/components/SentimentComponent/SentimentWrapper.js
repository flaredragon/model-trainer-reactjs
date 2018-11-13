import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
// import SentenceWrapper from '../SentenceComponent/SentenceWrapper';

const cardStyles = {
    backgroundColor: "#fff",
    minHeight: "60px",
    display: "flex",
    marginTop: "20px",
    textAlign: "center",
}

const cardContentStyles = {
    backgroundColor: "#aaa1a1",
    color:"#fff",
    minWidth: "400px",
    maxWidth: "400px",
    margin: "5px",
    textAlign:"center",
    alignItems: "center",
    justifyContent: "center",
    display:"flex",
}

const formStyle = {
    background: "inherit",
    color: "inherit",
    outline:"inherit",
    border: "none",
    padding: "auto",
    fontSize: "inherit",
    fontFamily: "inherit",
    textAlign: "center"
}


class SentimentWrapper extends Component {


    handleSubmit = (e) => {
        e.preventDefault();
    }

    handleChange = (e,i) => {
        let sentiment = e.target.value;
        this.props.onSentimentUpdated(sentiment, i);
    }

    render(){
        console.log(this.props.sentiments);

        let allCards = Object.keys(this.props.sentiments).map((item, i) => (
            <div style={cardContentStyles} key={i}>
                <span>
                    <form onSubmit={this.handleSubmit}>
                        <input 
                            type="text" 
                            value={this.props.sentiments[i].name} 
                            placeholder="Add Sentiment here"
                            style={formStyle} 
                            onChange={(e) => this.handleChange(e,i)} />
                    </form>
                </span>
            </div>
        ));
        return (
            <div>
                <section style={cardStyles}>
                    {allCards}
                </section>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        sentiments: state.sentiments
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSentimentUpdated: (sentimentName, sentimentId) => dispatch({ type: actionTypes.UPDATE_SENTIMENT, name: sentimentName, id: sentimentId }),
        onSentimentRemoved: (sentimentId) => dispatch({ type: actionTypes.REMOVE_SENTIMENT, id: sentimentId })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SentimentWrapper);