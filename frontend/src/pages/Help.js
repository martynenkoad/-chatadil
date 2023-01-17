import React, { useState, useEffect } from "react"
import { reset, sendQuestion } from "../redux/auth/authSlice"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"

export default function Help() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [question, setQuestion] = useState("")

    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(name && email && question) {
            dispatch(sendQuestion({ email, name, question }))
        }
    }

    useEffect(() => {
        if(isError) {
            toast.error(message)
        } 
        if (isSuccess) {
            toast.success(message)
        }
        dispatch(reset())
    }, [isError, isSuccess, isLoading])

    return (
        <form 
          className="support"
          onSubmit={handleSubmit}
        >
            <div className="form-container">
              <h2>Support Page</h2>
                  <p>Have any question? Fill the form to get an answer!</p>
                  <div className="input-section">
                      <label htmlFor="name">Your Name:</label>
                      <input 
                        type="text"
                        id="name"
                        placeholder="eq.: Maria"
                        value={name}
                        maxLength={25}
                        onChange={(e) => setName(e.target.value)}
                      />
                  </div>
                  <div className="input-section">
                      <label htmlFor="email">Your Email:</label>
                      <input 
                        type="email"
                        id="email"
                        placeholder="eq.: mariashevchenko@gmail.com"
                        value={email}
                        maxLength={60}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  <div className="input-section">
                      <label htmlFor="question">Ask the question:</label>
                      <textarea 
                          id="question"
                          placeholder="eq.: 'Why does Chatadil is so cool?'"
                          maxLength={500}
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                      />
                      <small>{question.length}/500</small>
                  </div>

                  <button className="follow-btn">
                    Send question 
                    <span className="material-symbols-outlined">
                        mail
                    </span>
                  </button>
                  <Link to="/">
                    Return To The Home Page &rarr;
                  </Link>
                </div>
        </form>
    )
}