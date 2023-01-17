import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/styles.css'
import App from './App'
import store from './redux/store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from "@react-oauth/google"

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider 
        clientId="468368991150-lba7v4otvco41imip5qt2591eirt5vd2.apps.googleusercontent.com"
      >
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)

