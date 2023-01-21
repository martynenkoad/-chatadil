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
import PasswordRecovery from "./pages/PasswordRecovery"
import i18n from "./utils/i18n"
import LocaleContext from "./redux/localeContext"
import { useState } from "react"
import { useSelector } from "react-redux"
import Page404 from "./components/Page404"

function App() {
 
  const [locale, setLocale] = useState(i18n.language)

  i18n.on("languageChanged", (lang) => setLocale(i18n.language))

  const { user } = useSelector((state) => state.auth)

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
        <Router>
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            <Route path="/chat" exact element={user ? <Chat /> : <Navigate to="/login" />} />

            <Route path="/chat/:chatid" element={user ? <Chat /> : <Navigate to="/login" />} />
            
            <Route path="/add-chat" element={user ? <AddChat /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="password-recovery/:token" element={<PasswordRecovery />} />
            <Route path="/help" element={<Help />} />
            <Route path="/edit-chat/:chatid" element={user ? <EditChat /> : <Navigate to="/login" />} />
            <Route path="*" element={<Page404 />} />
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
 