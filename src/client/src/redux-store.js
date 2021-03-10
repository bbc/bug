import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import rootReducer from "./redux-reducer";
import { composeWithDevTools } from 'redux-devtools-extension'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

// not a lot more to this - that's it!

const store = createStore(rootReducer, composedEnhancer);

export default store;