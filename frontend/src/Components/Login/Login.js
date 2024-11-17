import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';

function Login() {
    const [values, setValues] = useState({ userName: '', userPassword: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
    
        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true); // Start loading
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    setIsLoading(false); // Stop loading
                    if (res.data.message === "Success") {
                        // Store the userID and branchName in localStorage
                        localStorage.setItem('userID', res.data.userID);
                        localStorage.setItem('branchID', res.data.branchID);
                        localStorage.setItem('branchName', res.data.branchName);
                        localStorage.setItem('username', values.userName);
                        navigate('/dashboard');
                    } else {
                        setLoginError("No user found with the provided credentials.");
                    }
                })
                .catch(err => {
                    setIsLoading(false); // Stop loading
                    setLoginError("An error occurred during login.");
                });
        }
    };
    
    
    // In your return statement, conditionally render the button:
    <button type='submit' className='btn-submit' disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log in'}
    </button>

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-logo'>
                    <div className="logo-placeholder">Company Logo</div>
                </div>
                <div className='login-form'>
                    <h2 className='form-title'>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor="userName" className='form-label'>Username</label>
                            <div className='input-group'>
                                <input
                                    type="text"
                                    placeholder='Enter Username'
                                    name='userName'
                                    onChange={handleInput}
                                    value={values.userName}
                                    className={`form-control ${errors.userName ? 'is-invalid' : ''}`}
                                />
                                <span className="form-icons">
                                    <FaUser />
                                </span>
                            </div>
                            {errors.userName && <span className='error-text'>{errors.userName}</span>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="userPassword" className='form-label'>Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Enter Password'
                                    name='userPassword'
                                    onChange={handleInput}
                                    value={values.userPassword}
                                    className={`form-control ${errors.userPassword ? 'is-invalid' : ''}`}
                                />
                                <span className="form-icons" onClick={toggleShowPassword}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {errors.userPassword && <span className='error-text'>{errors.userPassword}</span>}
                        </div>
                        {loginError && <div className='error-alert'>{loginError}</div>}
                        <button type='submit' className='btn-submit'>
                            Log in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
