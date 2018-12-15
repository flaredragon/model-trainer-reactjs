import * as actionTypes from './actions';

const initialState = {
    trainStatus:false,
    editStatus:true,
    sentiments: [
        {
            name: "Happy",
            sentences: ["Very funny, would rate 10/10", "I loved the movie"]
        },
        {
            name: "Sad",
            sentences: ["Pathetic movie, bad acting", "Waste of time"]
        },
        
    ]
};

const reducer = (state = initialState, action) => {
    switch(action.type){

        case actionTypes.ADD_SENTIMENT:
            let newSentiments = [...state.sentiments];
            const newSentiment = {
                name: action.name,
                sentences: []
            };
            newSentiments.push(newSentiment);
            return {
                ...state,
		editStatus:true,
                sentiments: newSentiments
            }
        
        case actionTypes.REMOVE_SENTIMENT:
            newSentiments = [...state.sentiments];
            newSentiments.splice(action.id, 1);
            return {
                ...state,
		editStatus:true,
                sentiments: newSentiments
            }

        case actionTypes.UPDATE_SENTIMENT:
            newSentiments = [...state.sentiments];
            newSentiments[action.id].name = action.name;
            return {
                ...state,
		editStatus:true,
                sentiments: newSentiments
            }

        case actionTypes.ADD_SENTENCE:
            newSentiments = [...state.sentiments];
            newSentiments.map((sentiment, i) => (
                sentiment.sentences = [...state.sentiments[i].sentences]
            )) 
            newSentiments[action.sentimentId].sentences.push(action.sentence);
            return {
                ...state,
		editStatus:true,
                sentiments: newSentiments
            }
        
        case actionTypes.UPDATE_SENTENCE:
            newSentiments = [...state.sentiments];
            newSentiments.map((sentiment,i) => (
                sentiment.sentences = [...state.sentiments[i].sentences]
            )) 
            newSentiments[action.sentimentId].sentences[action.id] = action.sentence;
            return {
                ...state,
		editStatus:true,
                sentiments: newSentiments
            }

        case actionTypes.REMOVE_SENTENCE:
            newSentiments = [...state.sentiments];
            newSentiments.map((sentiment, i) => (
                sentiment.sentences = [...state.sentiments[i].sentences]
            )) 
            newSentiments[action.sentimentId].sentences.splice(action.id, 1);
            return {
                ...state,
		editStatus:true,
                sentiments: newSentiments
            }
        
	case actionTypes.TRAINING_START:
            return {
                ...state,
                trainStatus: true,
		editStatus:false
            }

	
	case actionTypes.TRAINING_END:
            return {
                ...state,
                trainStatus: false
            }

        default:
            return state;
    }
};

export default reducer;
