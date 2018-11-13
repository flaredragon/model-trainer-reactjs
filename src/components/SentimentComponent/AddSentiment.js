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
    marginLeft: "8px",
    marginTop:"20px"
};

class AddSentiment extends Component {

    addSentimentHandler = () => {
        this.props.onSentimentAdded("");
    }

    render(){
        return (
            
            <button style={styleBtn} onClick={this.addSentimentHandler}>
                <i className="fa fa-plus-square-o fa-2x" aria-hidden="true"></i>
            </button>
            
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSentimentAdded: (sentimentName) => dispatch({ type: actionTypes.ADD_SENTIMENT, name: sentimentName }),
    }
}

export default connect(null, mapDispatchToProps)(AddSentiment);