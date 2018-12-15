import React, { Component } from 'react';
import { Button,Col,FormGroup,FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import * as actionTypes from '../store/actions';
import SentimentWrapper from '../components/SentimentComponent/SentimentWrapper';
import AddSentiment from '../components/SentimentComponent/AddSentiment';
import SentenceWrapper from '../components/SentenceComponent/SentenceWrapper';
import Tester from './Tester';
import TrainModal from './TrainModal';
import '../App.css';

const styleSentiment = {
    width: "100%",
    height: "100%",
    margin: "0",
    display:"flex",
}

const styleSentences = {
    width: "100%",
    height: "100%",
    margin: "0",
    display: "flex",
}

class Trainer extends Component {
     constructor(props) {
    	super(props);
	this.state = {
	modelName:"Untitled",
	}
     }

     startTraining = async() => {
	await this.child.handleShow();
	this.child.trainStart(); 
     }
	
     handleSubmit = (e) => {
        e.preventDefault();
	this.child.saveModel(this.state.modelName);
     }

     handleChange = (e) => {
        this.setState({modelName: e.target.value});
     }

     
     render(){
	var modelName = this.state.modelName;
	var saveButton = (this.props.editStatus ? <div></div>:<Button bsStyle="success" className="saveModel" type="submit">Save Model</Button>
	);
        return (
            <div>
		<form onSubmit={this.handleSubmit} className="saveModel">
                    <FormGroup>
			Editing Model  -                    
			<FormControl
                        type="text"
                        style={{width:"20%", display:"inline-block",marginLeft:"10px"}}
                        value={modelName}
                        placeholder="Model Name"
                        onChange={this.handleChange} 
			required />
			{saveButton}
                    </FormGroup>
                </form>
		<Col xs={12} md={8} className="heightfill">
		<div id="sb" className="overflow">
                <div style={styleSentiment}>
                    <SentimentWrapper style={{display:"inline-block"}}></SentimentWrapper>
                    <AddSentiment></AddSentiment>
                </div>
                <div style={styleSentences}>
                    <SentenceWrapper></SentenceWrapper>
                </div>
		</div>
		<Button bsStyle="primary" style={{float:"right",marginTop:"5px"}} bsSize="large" onClick={this.startTraining}>Train</Button> 
		</Col>
		<Tester onRef={ref => (this.child = ref)}></Tester>  
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        sentiments: state.sentiments,
	trainStatus: state.trainStatus,
	editStatus :state.editStatus
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSentenceAdded: (sentence, sentimentId) => dispatch({ type: actionTypes.ADD_SENTENCE, sentence: sentence, sentimentId: sentimentId }),
	onTrainingStart: () => dispatch({ type: actionTypes.TRAINING_START}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Trainer);

