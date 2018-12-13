import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import AddSentence from './AddSentence';

const cardStyles = {
    backgroundColor: "#fff",
    minHeight: "60px",
    display: "flex",
    marginTop: "40px",
    textAlign: "center",
}

const sentencesStyles = {
    backgroundColor: "#1b1b1b",
    color: "#fff",
    minWidth: "400px",
    maxWidth: "400px",
    margin: "5px",
    textAlign: "center",
    // alignItems: "center",
    // justifyContent: "center",
    display: "block",
}

const sentenceStyle = {
    margin: "5px"
}
const formStyle = {
    background: "inherit",
    color: "inherit",
    outline: "inherit",
    border: "none",
    padding:"5px",
    fontSize: "inherit",
    fontFamily: "inherit",
    textAlign: "center",
}


const right = {
    float:"right",
}
class SentenceWrapper extends Component {
    
    handleSubmit = (e) => {
        e.preventDefault();
    }

    handleChange = (e, id, sentimentId) => {
        let sentence = e.target.value;
        this.props.onSentenceUpdated(sentence, id, sentimentId);
    }
    deleteSentence = (e,id,sentimentId) => {
    	this.props.removeSentence(id,sentimentId);
    }

    render(){

        let allSentences = Object.keys(this.props.sentiments).map((item, sentimentId) => {

            let sentences = this.props.sentiments[sentimentId].sentences.map((sentence, id) => {
                return (
                    <li key={id} style={sentenceStyle}>
                        <form onSubmit={this.handleSubmit}>
                            <input
                                type="text"
                                value={sentence}
                                placeholder="Add Sentence here"
				style={formStyle}
                                onChange={(e) => this.handleChange(e, id, sentimentId)} />                       
			    <i className="fa fa-times fa-2x" style={right} onClick={(e) => this.deleteSentence(e,id,sentimentId)} aria-hidden="true"></i>			
			</form> 
                    </li>
                )
            });

            return (
                <div style={sentencesStyles} key={sentimentId}>
                    <ol>
                        {sentences}
                    </ol>
                    <AddSentence id={sentimentId}></AddSentence>
                </div>
            )
        });

        return (
            <div>
                <section style={cardStyles}>
                    {allSentences}
                </section>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        sentiments: state.sentiments
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSentenceUpdated: (sentence, sentenceId, sentimentId) => dispatch({ type: actionTypes.UPDATE_SENTENCE, sentence: sentence, id: sentenceId, sentimentId: sentimentId }),
	removeSentence: (sentenceId, sentimentId) => dispatch({ type: actionTypes.REMOVE_SENTENCE,id: sentenceId, sentimentId: sentimentId })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SentenceWrapper);
