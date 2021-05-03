

//   let userRegex = /u/
//   let passRegex = /p/
//   if (e.target.name == "username") {
//     if (userRegex.test(e.target.value)) {
//       setErrMessage({...errMessage, username: ""})
//       setLolos(true)
//     } else {
//       setErrMessage({...errMessage, username: "ga sesuai pola, harus depannya u"})
//     }
//   } else if (e.target.name == "password") {
//     if (passRegex.test(e.target.value)) {
//       setErrMessage({...errMessage, password: ""})
//     } else {
//       setErrMessage({...errMessage, password: "ga sesuai pola, harus depannya p"})
//     }
//   }
// }

import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {login} from '../redux/actions/userAction'

function Login() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.userReducer)
  const [userLogin, setUserLogin] = useState({ username: "", password: "" })
  const [errMessage, setErrMessage] = useState({ username: "", password: "" })
  const [lolos, setLolos] = useState(null)

  const handleChange = (e) => {
    setUserLogin({
      ...userLogin,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    console.log(userLogin);
    dispatch(login(userLogin))
  }
  
  console.log(user);
  return (
    <form onSubmit={handleLogin}>
      <input type="text" name="username" id="username" value={userLogin.username} onChange={handleChange}/>
      <input type="text" name="password" id="password" value={userLogin.password} onChange={handleChange}/>
      <button>Login</button>
    </form>
  )
}

export default Login