const initialUserState = {
    arr:[]
}

export  const  selectedStudentReducer = (state =  initialUserState, action) => {
    switch (action.type) {
      case "ADD":
          if(state.arr.includes(action.newItem)){
              return { 
                ...state,
                arr: [...state.arr.filter(x=>x!=action.newItem)]}
            }
          else{
        return { 
            ...state,
            arr: [...state.arr, action.newItem]}
        }
        case "CLEAR":
            return{...state,arr:[]}


      default:
        return state;
    }
  };