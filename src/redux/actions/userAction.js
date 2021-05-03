import axios from 'axios'

export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_REQUEST = "LOGIN_REQUEST"

const loginRequest = () => {
  return {
    type: LOGIN_REQUEST
  }
}

const loginSuccess = (payload) => {
  return {
    type: LOGIN_SUCCESS,
    payload
  }
}

export const login = (user) => async (dispatch) => {
  dispatch(loginRequest())
  
  let result = await axios.post(process.env.REACT_APP_API + "/auth/login", user)
  console.log(result);
  if (result.data.token) {
    // localStorage.setItem("token", result.data.token)
    console.log("yes");
    dispatch(loginSuccess(result.data))
  }
}