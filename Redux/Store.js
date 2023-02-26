import { combineReducers, createStore } from "redux";
import {selectedStudentReducer} from './StudentSlice'

const rootReducer = combineReducers({
    StudentSelected: selectedStudentReducer
  });
 
  
   export const store = createStore(rootReducer);