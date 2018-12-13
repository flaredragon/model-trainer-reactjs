import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import natural from 'natural';
import synonyms from 'synonyms';
import isSW from 'isstopword';
import * as actionTypes from '../store/actions';
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
     
     augmentDataset = () => {
	var tokenizer = new natural.WordTokenizer();
     	this.props.sentiments.forEach((sentiment,index) => {
		sentiment.sentences.forEach((sentence) => {
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
				    if(!this.props.sentiments[index].sentences.includes(t.join(" ")))
				    this.props.onSentenceAdded(t.join(" "),index);
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
	});
     }
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
                    	<Button bsStyle="primary" onClick={this.augmentDataset}>Augment Dataset</Button>
                </div>
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
        onSentenceAdded: (sentence, sentimentId) => dispatch({ type: actionTypes.ADD_SENTENCE, sentence: sentence, sentimentId: sentimentId }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Trainer);

