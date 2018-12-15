import React, { Component } from 'react';
import natural from 'natural';
import * as tf from '@tensorflow/tfjs';
import { Button, FormControl, FormGroup, Grid, Row, Col,Modal,Alert } from 'react-bootstrap';
import synonyms from 'synonyms';
import isSW from 'isstopword';
import * as actionTypes from '../store/actions';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import Dygraph from 'dygraphs';
import '../App.css';
import dateformat from 'dateformat';
var g;

class Tester extends Component {
    
    state={ 
        testing: false,
        value: "",
        model: null,
        tokens: null,
        results: null,
	pause:false,
	epochs:0,
	loss:0.0,
	totalEpochs:1500,
	symArray:[],
	sentenceUsed:"",
	words: null,
	showModal:false,
	graphData:[[0,1]],
	accuracy:0.0,
	lastTrained:"",
    }
    componentDidMount() {
    	this.props.onRef(this);
    }

    enteringModal = () => {
	g = new Dygraph(this.refs.graphi,
		this.state.graphData, {
                            drawPoints: true,
                            valueRange: [0.0, 1.2],
                            labels: ['Epochs', 'Loss'],
			    ylabel: 'Loss',
			    xlabel: 'Epochs',
			    title: 'Metric Graph',
			    rightGap: 20,
			    pointSize: 2
		});

    }
    componentWillUnmount() {
    	this.props.onRef(undefined)
    }
    
    handleClose = () => {
    	this.setState({ show: false });
    }

    handleShow = () => {
    	this.setState({ show: true });
    }

    async trainStart() {	
        //Data Preprocessing - Tokenize and Stem
	this.props.onTrainingStart();
	this.setState({epochs:0,totalEpochs:1500,loss:0.0,pause:false,model:null,tokens:null,results:null,symArray:[],sentenceUsed:"",words: null,value:"",testing:false,graphData:[[0,1.0]],save:false});	
	natural.LancasterStemmer.attach();
        const sentimentList = [];
        const sentiments = [];
        let tokens = [];
	let words = [];
	var tokenizer = new natural.WordTokenizer();
        this.props.sentiments.forEach((item, i) => {
            const sentimentObj = {};
            sentimentObj.name = (item.name);
            sentiments.push(item.name);
            let sentenceList = [];
            console.log(item.sentences);
            item.sentences.forEach(sentence => {
		var tokenizedSentence = tokenizer.tokenize(sentence);
		words.push(...tokenizedSentence);		
		tokens.push(...sentence.tokenizeAndStem());		                
		sentenceList.push(sentence.tokenizeAndStem());
            });
            sentimentObj.sentences = sentenceList;
            sentimentList.push(sentimentObj);
            console.log(sentimentList);
            console.log(sentimentObj);
            console.log(tokens);
            console.log(sentenceList);
            console.log(sentiments);
            console.log('yaay');
        });

        tokens = [...new Set(tokens)];
                
        // Featurize
        sentimentList.forEach(sentiment => {
            const newSentimentSentences = [];
            sentiment.sentences.forEach(sentence => {
                const feature = [];
                tokens.forEach(token => {
                    feature.push((sentence.indexOf(token) !== -1)? 1 : 0);
                })
                newSentimentSentences.push(feature);
            });
            sentiment.sentences = newSentimentSentences;
        });

        console.log(sentimentList);
        console.log(tokens);
        const allTrainingSentences = [];
        const allTrainingOutput = [];
        sentimentList.forEach((sentiment,i) => {
            const outputArr = new Array(sentimentList.length).fill(0);
            outputArr[i] = 1;
            sentiment.sentences.forEach(sentence => {
                allTrainingSentences.push(sentence);
                allTrainingOutput.push(outputArr);
            })
        })
        //Setup Data
        console.log(allTrainingSentences);
        console.log(allTrainingOutput);
        const trainingData = tf.tensor2d(allTrainingSentences);

        const outputData = tf.tensor2d(allTrainingOutput);
        console.log(trainingData);
        console.log(outputData);
        //Build Neural Net
        const model = tf.sequential();
        model.add(tf.layers.dense({
            inputShape: allTrainingSentences[0].length,
            activation: "sigmoid",
            units: 8
        }))
        model.add(tf.layers.dense({
            activation: "sigmoid",
            units: 8
        }))
        model.add(tf.layers.dense({
            activation: "softmax",
            units: allTrainingOutput[0].length
        }))
        model.compile({
            loss: 'categoricalCrossentropy',
            optimizer: tf.train.adam(0.001),
	    metrics: ["accuracy"]
        })
	
	var d = new Date();	
	var time = dateformat(d);
	var n = d.getTime(); 
	var trainedModel;	
    	
	for(var i=1;i<=15;i++){
	    trainedModel = await model.fit(trainingData, outputData,{epochs:100,shuffle:true});
	    await this.setState({epochs:100*i,loss:trainedModel.history.loss[99],accuracy:trainedModel.history.acc[99],lastTrained:time});
	    var gD = this.state.graphData;
	    gD.push([this.state.epochs,this.state.loss]);
	    await this.setState({graphData:gD});
            g.updateOptions( { 'file': this.state.graphData } );
	    if(this.state.pause)
		{
		  this.setState({pause:false})
		  break;
		}
      	    
	}
	var d1 = new Date()
	var n2 = d1.getTime() - n;
	console.log(trainedModel.history.loss[90],n2);
        //Train Neural Net
        //const mjson = model.toJSON(null, false);
        //console.log(mjson);	
        this.setState({model:model, tokens: tokens, sentiments:sentiments,words:words});
    //console.log(this.state.model);
	this.props.onTrainingEnd();
    }

    saveModel = async(name) => {
        const saveModels = await this.state.model.save(`localstorage://${name}`);
	const bagOfWordsData = {
		tokens:this.state.tokens,
		sentiments:this.props.sentiments,
		classes:this.state.sentiments				
	}
	localStorage.setItem('bowData', JSON.stringify(bagOfWordsData));
	alert("Model Saved");
    }

    handleSubmit = (e) => {
        e.preventDefault();
	this.testModel();
    }

    handleChange = (e) => {
        this.setState({value: e.target.value})
    }
    pauseModel = () => {
	let pEpochs = this.state.epochs+100;
    	this.setState({pause:true,totalEpochs:pEpochs})
    }

    addSynonymSentences = async(s) => {
	var t,symSArray=[],fsentence="",cnt=0,ccnt=0;
	var tokenizer = new natural.WordTokenizer();
	symSArray.push(s);
	symSArray.forEach((sentence) => {
			var tsentence = tokenizer.tokenize(sentence);
			tsentence.forEach((item,index1) => {
			      if(!isSW(item)){
			      var sym = synonyms(item);
			      if(sym!==undefined){
			      var types = Object.values(sym);
			      types.forEach((i) => {        
				i.some((word,index2) => {
				    if(index2<=2&&word.length>1){
			       	    t = tsentence;
				    t.splice(index1, 1, word);
				    symSArray.push(t.join(" "));
				    ccnt=0;
				    t.forEach((w) =>{
				    if(this.state.tokens.includes(w.stem()))
					ccnt++;
				    });
				    if(ccnt>cnt){
				    	fsentence = t.join(" ");
					cnt=ccnt;
                                    }
				    return false;
				  }
				    if(index2>2)
					return true;      
				})
			      })
			     }
			   }
			});
		if(cnt===0)
		fsentence = s;
		symSArray = [...new Set(symSArray)];
		this.setState({symArray:symSArray,sentenceUsed:fsentence});
	});
    }

    loadModel = async () => {
	console.log(this.state.model);
        const nmodel = await tf.loadModel('localstorage://my-model-1');
        console.log(nmodel,'yaay');
	var bowData = JSON.parse(localStorage.getItem('bowData'));
        console.log(this.state.tokens);
        await this.setState({model:nmodel,tokens:bowData.tokens,sentiments:bowData.sentiments});
    }

    testModel = async () => {

        this.setState({testing: true,value:""});
        natural.LancasterStemmer.attach();
	await this.addSynonymSentences(this.state.value);
        const sentenceTokens = this.state.sentenceUsed.tokenizeAndStem();
        const sentenceFeature = [[]];
        this.state.tokens.forEach(token => {
            sentenceFeature[0].push((sentenceTokens.indexOf(token) !== -1) ? 1 : 0);
        });
        console.log(sentenceFeature);
        const testingData = tf.tensor2d(sentenceFeature);
        const predictedModel = await this.state.model.predict(testingData);
        const predictedResult = await predictedModel.data();
        let maxId = 0;
        let maxVal = Math.max(...predictedResult);
        predictedResult.forEach((res,i) => {
            if(res === maxVal)
                maxId=i;
        });
        const results = this.state.sentiments.map((sentiment, i) => {
            return {
                name: sentiment,
                isMax: (maxId===i),
                result: predictedResult[i]*100
            }
        });
        this.setState({testing:false, results: results});
    }
	
    render(){
	
	let loss = this.state.loss;
	let accuracy = this.state.accuracy;
	let lastTrained = this.state.lastTrained;
	let epochs = this.state.epochs;
	let totalEpochs = this.state.totalEpochs;        
	let cols = (this.state.results)?(this.state.results.map((res,i) => {
            return (res.name)?(
             <li 
                md={3} 
                xs={6} 
                key={i} 
                style={{ backgroundColor: (res.isMax) ?"#ccffcc":"#e3e3e3", border:"2px solid #fff", height:"50px", padding:"12px",display:"inline-block"}}>
                <span>{res.name} - {res.result.toFixed(2)}</span>
            </li>
        ):null})):null;
        
        let result = (
            <div style={{textAlign:"center", marginTop:"20px"}}>
                    <Row className="show-grid">
                        {cols}
                    </Row>
            </div>
        );
	let trainState = (this.props.trainStatus ? <div><Loader type="TailSpin" color="#000" height={80} width={80} /></div> : <div style={{fontSize:"30px"}}>Model Trained!!!<br/><br/></div>);
        let testState = (this.state.testing ? <Loader type="TailSpin" color="#000" height={80} width={80} /> : result);
        let pauseState = (this.state.pause ? <div style={{margin:"10px"}}>Stopping... at {totalEpochs} Epochs</div>:<div style={{margin:"10px"}}></div>);
	let pauseButton = (this.props.trainStatus ? <Button onClick={this.pauseModel} className="right" >Stop Training</Button>:<div></div>)
	let symList = (this.state.symArray.map((symS,i) => 
		<li key={i} style={{ backgroundColor: (symS===this.state.sentenceUsed) ?"#ccffcc":"#e3e3e3", border:"2px solid #fff", padding:"12px",display:"inline-block",width:"70%",}}>{symS}</li>
	));
	let classificationDiv = (!this.props.trainStatus&&!this.props.editStatus ?
	<div  id="sb" className="testwindow" >	
	<div style={{textAlign:"center",paddingTop:"50px"}} >
                <h1>Test the Model</h1>
		<div style={{padding:"10px"}}>Training Results - Last Trained At: {lastTrained} , Accuracy: {accuracy} , Epochs: {epochs}</div>
		<form onSubmit={this.handleSubmit} >
                    <FormGroup>
                    <FormControl
                        type="text"
                        style={{width:"50%", textAlign:"center", display:"inline-block"}}
                        value={this.state.value}
                        placeholder="Add Sentence to test"
                        onChange={this.handleChange} 
			disabled={this.props.trainStatus}
			required />
                    <br />
                    <br />
                    <Button bsStyle="success" type="submit" disabled={this.props.trainStatus}>Classify</Button>
                    </FormGroup>
                </form>
            </div>
	   <div style={{textAlign:"center"}}>
		{symList}
                {testState}
            </div>
	</div>	
	:<div style={{textAlign:"center",fontSize:"30px",paddingTop:"50px"}}><span>You have not Trained yet</span></div>)

        return (
            <div>
	      <Col xs={12} md={4}>{classificationDiv}</Col>
            <Modal show={this.state.show} onEnter={this.enteringModal} bsSize="large">
          	<Modal.Header>
              		<Modal.Title>Training Model
			<Button className="right" onClick={this.handleClose} disabled={this.props.trainStatus}>Close</Button>
			{pauseButton}
			</Modal.Title>          	
		</Modal.Header>          	
		<Modal.Body>         		
			<div style={{textAlign:"center", marginTop:"10px"}}>
                	{trainState}
           		<div>{pauseState}</div>
           		<div>Metrics - Epochs : {epochs}/{totalEpochs}  Loss : {loss}</div> 
			<div style={{width:"50%",margin:"10px auto"}} ref="graphi"></div>			
			</div>
          	</Modal.Body>
            </Modal>
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
	onTrainingEnd: () => dispatch({ type: actionTypes.TRAINING_END}),
	onTrainingStart: () => dispatch({ type: actionTypes.TRAINING_START}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tester);
