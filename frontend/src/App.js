import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Chat from "./pages/Chat"
import AddChat from "./pages/AddChat"
import Settings from "./pages/Settings"
import EditChat from "./pages/EditChat"
import Help from "./pages/Help"
import ForgotPassword from "./pages/ForgotPassword"
import i18n from "./utils/i18n"
import LocaleContext from "./redux/localeContext"
import { useState } from "react"

function App() {
 
  const [locale, setLocale] = useState(i18n.language)

  i18n.on("languageChanged", (lang) => setLocale(i18n.language))

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" exact element={<Chat />} />

            <Route path="/chat/:chatid" element={<Chat />} />
            
            <Route path="/add-chat" element={<AddChat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/help" element={<Help />} />
            <Route path="/edit-chat/:chatid" element={<EditChat />} />
          </Routes>
        </Router>
      <ToastContainer 
        theme="dark" 
        pauseOnHover={false}
      />
    </LocaleContext.Provider>
  )
}

export default App
