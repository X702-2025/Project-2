import axios from "axios"
import { useState, useEffect } from "react"
import DefineItem from "./component/DefinItem"
import Navbar from "./component/Navbar"
import { Route, Routes, useNavigate } from "react-router-dom"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Profile from "./pages/Profile"

function App() {
  const [itemId, setItemId] = useState(null)
  const [words, setWords] = useState([])
  const Navigate = useNavigate()
  const [errorSignUp, setErrorSignUp] = useState(null)
  const [errorLogin, setErrorLogin] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getProfile()
  }, [])
  const getProfile = () => {
    axios
      .get("https://vast-chamber-06347.herokuapp.com/api/user/me", {
        headers: {
          Authorization: localStorage.UserToken,
        },
      })
      .then(response => {
        const profileData = response.data
        console.log(profileData)
        setProfile(profileData)
      })
      .catch(error => {
        console.log(error.profileData)
      })
  }

  const getWord = e => {
    e.preventDefault()
    const form = e.target
    const word = form.elements.word.value

    axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => {
        console.log(response.data)

        setWords(response.data)
      })
      .catch(error => {
        console.log(error?.response?.data)
      })
  }

  const signUp = e => {
    e.preventDefault()
    const form = e.target
    const photo = form.elements.photo.value
      ? form.elements.photo.value
      : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.fote.org.uk%2Fwp-content%2Fuploads%2F2017%2F03%2Fprofile-icon.png&f=1&nofb=1"
    const body = {
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value,
      email: form.elements.email.value,
      password: form.elements.password.value,
      // CoPassword: form.elements.password.value,
      photo:photo
    }
    axios
      .post("https://vast-chamber-06347.herokuapp.com/api/user", body, {
        headers: {
          Authorization: localStorage.UserToken,
        },
      })
      .then(response => {
        console.log(response.data)
        setErrorSignUp(null)
        Navigate("/login")
      })
      .catch(error => {
        setErrorSignUp(error.response.data)
      })
  }

  const login = e => {
    e.preventDefault()

    const form = e.target

    const userBody = {
      email: form.elements.email.value,
      password: form.elements.password.value,
    }
    axios
      .post("https://vast-chamber-06347.herokuapp.com/api/user/auth", userBody, {
        headres: {
          Authorization: localStorage.UserToken,
        },
      })
      .then(response => {
        const UserToken = response.data
        localStorage.UserToken = UserToken
        Navigate("/")
        setErrorLogin(null)
        getProfile()
      })
      .catch(error => {
        setErrorLogin(error.response.data)
      })
  }

  const logout = () => {
    localStorage.removeItem("UserToken")

    Navigate("/")
  }

  const addFavourite = word => {
    console.log("click")
    const body = {
      title: word,
      // url : `https://api.dictionaryapi.dev/api/v2/entries/en/${wordBody}`,
    }
    // console.log(wordBody)
    axios
      .post(`https://vast-chamber-06347.herokuapp.com/api/v2/dictionary-271/items`, body, {
        headers: {
          Authorization: localStorage.UserToken,
        },
      })
      .then(response => {
        console.log(response.data)
        setItemId(response.data._id)
        getProfile()
      })
      .catch(error => {
        console.log(error.response.data)
      })
  }

  const deleteFavourite = paramId => {
    const id = paramId ? paramId : itemId
    axios
      .delete(`https://vast-chamber-06347.herokuapp.com/api/v2/dictionary-271/items/${id}`, {
        headers: {
          Authorization: localStorage.UserToken,
        },
      })
      .then(response => {
        console.log(response.data)
        getProfile()
      })
      .catch(error => {
        console.log(error.response.data)
      })
  }

  const getWordFav = item => {
    setItemId(item._id)
    axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${item.title}`)
      .then(response => {
        console.log(response.data)

        setWords(response.data)
      })
      .catch(error => {
        console.log(error?.response?.data)
      })
  }

  return (
    <>
      <Navbar logout={logout} />

      <Routes>
        <Route path="/signup" element={<SignUp signUp={signUp} errorSignUp={errorSignUp} />} />
        <Route path="/login" element={<Login login={login} errorLogin={errorLogin} />} />
        <Route
          path="/"
          element={
            <Home
              deleteFavourite={deleteFavourite}
              DefineItem={DefineItem}
              getWord={getWord}
              words={words}
              addFavourite={addFavourite}
            />
          }
        />
        <Route
          path="/profile"
          element={<Profile profile={profile} deleteFavourite={deleteFavourite} getWordFav={getWordFav} />}
        />
      </Routes>
    </>
  )
}

export default App
