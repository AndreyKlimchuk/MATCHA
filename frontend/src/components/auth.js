import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Panda } from "./registration";
import { observable, runInAction } from "mobx";

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputErrors: {
                uname: "",
                password: "",
            }
        };
        this.unameRef = React.createRef();
        this.passwordRef = React.createRef();
        axios.defaults.withCredentials = true;
    }
  

    sendCredentials(e) {
        e.preventDefault();

        let err = this.validateFields();
        this.setState({inputErrors: err});
        if (Object.values(err).some(item => item !== "") === false) {
            let data = {
                "uname": this.unameRef.current.value,
                "password": this.passwordRef.current.value
            };
            axios.post('http://localhost:8080/api/auth', data)
                .then(function (response) {
                    console.log(response);
                    if (response.data.status === "error") {
                        this.setState({inputErrors: response.data.reason});
                    }
                    else if (response.data.status === "ok") {
                        runInAction(() => {
                            this.props.storage.user.isAuthenticated = true;
                            this.props.storage.user.profile = response.data.data
                        });
                    }
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    validateFields() {
        return {
            uname: this.validateUsername(),
            password: this.validatePassword()
        };
    }

    validateUsername() {
        if (this.unameRef.current.value.length < 6)
            return "Login is too short";
        else if (this.unameRef.current.value.length > 16)
            return "Login is too long";
        else
            return "";
    }

    validatePassword() {
        if (this.passwordRef.current.value.length < 6)
            return "Password is too short";
        else if (this.passwordRef.current.value.length > 128)
            return "Password is too long";
        else
            return "";
    }

    render() {
        return (
            <div className="containerr">
                <Panda />
                <form>
                    <div className="dws">
                        <p className="inputError">{this.state.inputErrors.uname}</p>
                        <input className="st" type="text" name="username" ref={this.unameRef} placeholder="Login"/>
                    </div>
                    <div className="dws">
                        <p className="inputError">{this.state.inputErrors.password}</p>
                        <input className="st" type="password" name="password" ref={this.passwordRef} placeholder="Password"/>
                    </div>
                    <div>
                        <button onClick={this.sendCredentials.bind(this)}className="btn color-btn m-2">Sign In</button>
                        <Link to="auth/registration" className="btn color-btn m-2">Sign Up</Link>
                    </div>
                    <div>
                        <Link to="auth/password_recovering">Recover password</Link>
                    </div>
                </form>
                <div className="social">
                    <a href="http://localhost:8080/api/auth/google/login">
                        <i className="fa fa-google-plus-circle " aria-hidden="true"></i>
                    </a>
                    <a href="http://localhost:8080/api/auth/github/login">
                        <i className="fa fa-github" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        )
    }
}

export default Auth;