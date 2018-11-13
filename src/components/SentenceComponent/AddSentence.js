import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

const styleBtn = {
    background: "none",
    color: "inherit",
    cursor: "pointer",
    outline: "inherit",
    padding: "auto",
    border: "none",
    marginBottom:"10px",
    marginLeft: "50px"
    
};

class AddSentence extends Component {

    constructor(props){
        super(props);
    }

    addSentenceHandler = (id) => {
        this.props.onSentenceAdded("", id)
    }

    render(){
        return (
            <div>
                <button style={styleBtn} onClick={() => this.addSentenceHandler(this.props.id)}>
                    <i className="fa fa-plus-square-o fa-2x" aria-hidden="true"></i>
                </button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSentenceAdded: (sentence, sentimentId) => dispatch({ type: actionTypes.ADD_SENTENCE, sentence: sentence, sentimentId: sentimentId }),
    }
}

export default connect(null, mapDispatchToProps)(AddSentence);