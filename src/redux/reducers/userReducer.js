import {LOGIN_SUCCESS, LOGIN_REQUEST} from '../actions/userAction'

const initialState = {
  isLoading: false,
  isLogin: false,
  userId: ""
}

const userReducer = (state = initialState, action) => {
  switch(action.type){
    case LOGIN_REQUEST : 
    return {
      ...state,
      isLoading: true,
    }
    case LOGIN_SUCCESS : 
      return {
        isLoading: false,
        isLogin: true,
        userId: action.payload.userId
      }
    default : 
      return state
  }
}

export default userReducer