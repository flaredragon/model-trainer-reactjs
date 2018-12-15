import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button} from 'react-bootstrap';
import * as actionTypes from '../../store/actions';
import AddSentence from './AddSentence';
import natural from 'natural';
import synonyms from 'synonyms';
import isSW from 'isstopword';
import '../../App.css';

const cardStyles = {
    backgroundColor: "#fff",
    minHeight: "60px",
    display: "flex",
    marginTop: "10px",
    textAlign: "center",
}

const sentencesStyles = {
    backgroundColor: "#1b1b1b",
    color: "#fff",
    minWidth: "400px",
    maxWidth: "400px",
    margin: "5px",
    padding:"5px",
    textAlign: "center",
    // alignItems: "center",
    // justifyContent: "center",
    display: "block",
}

const sentenceStyle = {
    margin: "5px",
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

    augmentDataset = (sentimentId) => {
	var tokenizer = new natural.WordTokenizer();
     		this.props.sentiments[sentimentId].sentences.forEach((sentence) => {
		        var t;
			var tsentence = tokenizer.tokenize(sentence);
			tsentence.forEach((item,index1) => {
			      if(!isSW(item)){
			      var sym = synonyms(item);
			      if(sym!==undefined){
			      var types = Object.values(sym);
			      types.forEach((i) => {        
				i.some((word,index2) => {
				    if(index2>0&&index2<=2&&word.length>1){
			       	    t = tsentence;
				    t.splice(index1, 1, word);
				    if(!this.props.sentiments[sentimentId].sentences.includes(t.join(" ")))
				    this.props.onSentenceAdded(t.join(" "),sentimentId);
				    return false;
				    //training_data.push({"class1":data.class1,"sentence": t.join(" ")});
				  }
				    if(index2>2)
					return true;      
				})
			      })
			     }
			   }
			});		
	     });
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
		<div>                
		<div style={sentencesStyles} key={sentimentId} id="sb" className="sentenceCard">
                    <ol>
                        {sentences}
                    </ol>
                    <AddSentence id={sentimentId}></AddSentence>
                </div>
		<div key={sentimentId} >		
		<Button bsStyle="primary" style={{margin:"5px"}} onClick={(e) => this.augmentDataset(sentimentId)}>Augment Dataset</Button>
		</div>		
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
	removeSentence: (sentenceId, sentimentId) => dispatch({ type: actionTypes.REMOVE_SENTENCE,id: sentenceId, sentimentId: sentimentId }),
	onSentenceAdded: (sentence, sentimentId) => dispatch({ type: actionTypes.ADD_SENTENCE, sentence: sentence, sentimentId: sentimentId })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SentenceWrapper);
