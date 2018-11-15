import React, { Component } from 'react';
import natural from 'natural';
import * as tf from '@tensorflow/tfjs';
import { Button, FormControl, FormGroup, Grid, Row, Col } from 'react-bootstrap';

import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';

class Tester extends Component {

    state={
        training: true,
        testing: false,
        value: "",
        model: null,
        tokens: null,
        results: null
    }

    async componentDidMount() {

        //Data Preprocessing - Tokenize and Stem
        natural.PorterStemmer.attach();
        const sentimentList = [];
        const sentiments = [];
        let tokens = [];

        this.props.sentiments.forEach((item, i) => {
            const sentimentObj = {};
            sentimentObj.name = (item.name);
            sentiments.push(item.name);
            let sentenceList = [];
            item.sentences.forEach(sentence => {
                tokens.push(...sentence.tokenizeAndStem());
                sentenceList.push(sentence.tokenizeAndStem());
            });
            sentimentObj.sentences = sentenceList;
            sentimentList.push(sentimentObj);
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
        const trainingData = tf.tensor2d(allTrainingSentences);

        const outputData = tf.tensor2d(allTrainingOutput);

        //Build Neural Net
        const model = tf.sequential();
        model.add(tf.layers.dense({
            inputShape: [tokens.length],
            activation: "sigmoid",
            units: tokens.length+1
        }))
        model.add(tf.layers.dense({
            inputShape: [tokens.length+1],
            activation: "sigmoid",
            units: sentimentList.length
        }))

        model.add(tf.layers.dense({
            activation: "sigmoid",
            units: sentimentList.length
        }))

        model.compile({
            loss: "meanSquaredError",
            optimizer: tf.train.adam(.06)
        })

        //Train Neural Net
        const trainedModel = await model.fit(trainingData, outputData,{epochs: 100})

        this.setState({training: false, model:model, tokens: tokens, sentiments:sentiments});

    }


    handleSubmit = (e) => {
        e.preventDefault();
    }

    handleChange = (e) => {
        this.setState({value: e.target.value})
    }

    testModel = async () => {
        this.setState({testing: true});

        natural.PorterStemmer.attach();
        const sentenceTokens = this.state.value.tokenizeAndStem();
        const sentenceFeature = [[]];
        this.state.tokens.forEach(token => {
            sentenceFeature[0].push((sentenceTokens.indexOf(token) !== -1) ? 1 : 0);
        });

        const testingData = tf.tensor2d(sentenceFeature);
        const predictedModel = await this.state.model.predict(testingData);
        const predictedResult = await predictedModel.data();
        let maxId = 0;
        let maxVal = Math.max(...predictedResult);
        predictedResult.forEach((res,i) => {
            if(res === maxVal)
                maxId=i;
        });

        const results = this.props.sentiments.map((sentiment, i) => {
            return {
                name:sentiment.name,
                isMax: (maxId===i),
                result: predictedResult[i]*100
            }
        });
        
        this.setState({testing:false, results: results});

    }

    render(){

        let cols = (this.state.results)?(this.state.results.map((res,i) => {
            return (res.name)?(
            <Col 
                md={3} 
                xs={6} 
                key={i} 
                style={{ backgroundColor: (res.isMax) ?"#ccffcc":"#e3e3e3", border:"2px solid #fff", height:"50px", paddingTop:"12px"}}>
                <span>{res.name} - {res.result.toFixed(2)}</span>
            </Col>
        ):null})):null;
        
        let result = (
            <div style={{textAlign:"center", marginTop:"20px"}}>
                <Grid>
                    <Row className="show-grid">
                        {cols}
                    </Row>
                </Grid>
            </div>
        );

        let trainState = (this.state.training ? <Loader type="TailSpin" color="#000" height={80} width={80} /> : <div style={{fontSize:"30px"}}>Model Trained!!!<br/><br/></div>);
        let testState = (this.state.testing ? <Loader type="TailSpin" color="#000" height={80} width={80} /> : result);
        
        return (
            <div>
            <div style={{textAlign:"center", marginTop:"30px"}}>
                {trainState}
            </div>


            <div style={{textAlign:"center"}}>
                <form onSubmit={this.handleSubmit} >
                    <FormGroup>
                    <FormControl
                        type="text"
                        style={{width:"50%", textAlign:"center", display:"inline-block"}}
                        value={this.state.value}
                        placeholder="Add Sentence to test"
                        onChange={this.handleChange} />
                    <br />
                    <br />
                    <Button bsStyle="success" disabled={this.state.training} onClick={this.testModel}>Classify</Button>
                    </FormGroup>
                </form>
            </div>
            <div style={{textAlign:"center"}}>
                {testState}
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

export default connect(mapStateToProps)(Tester);