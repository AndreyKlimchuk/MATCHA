import React, {Component} from 'react';
import axios from 'axios';
import {Route, Switch} from "react-router-dom";
import Home from "./home";
import Auth from "./auth";


export const Panda = class Panda extends Component {

    render() {
        console.log(this.props.test);
        return (
            <div className="panda">
                <div className="panda-down"></div>
                <div className="left-hand">
                    <div className="lapa_1"></div>
                    <div className="lapa_11"></div>
                    <div className="lapa_111"></div>
                    <div className="lapa_1111"></div>
                </div>
                <div className="right-hand">
                    <div className="lapa_2"></div>
                    <div className="lapa_22"></div>
                    <div className="lapa_222"></div>
                    <div className="lapa_2222"></div>
                </div>
                <div className="left-feet"></div>
                <div className="right-feet"></div>
                <div className="panda-top">
                    <div className="left-spot"></div>
                    <div className="right-spot"></div>
                    <div className="nouse"></div>
                    <div className="ys1"></div>
                    <div className="ys2"></div>
                    <div className="right-eye">
                        <div className="sparkle"></div>
                        <div className="sparkle_big"></div>
                    </div>
                    <div className="skin"></div>
                    <div className="left-eye">
                        <div className="sparkle"></div>
                        <div className="sparkle_big"></div>
                    </div>
                    <div className="skin_2"></div>
                    <div className="skin_1"></div>
                </div>
                <div className="belly">
                    <div className="heart"></div>
                </div>
                <div className="left-hear">
                    <div className="left-hear-inside"></div>
                </div>
                <div className="right-hear">
                    <div className="left-hear-inside"></div>
                </div>
            </div>
        )
    }
}

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputErrors: {
                uname: "",
                email: "",
                fname: "",
                lname: "",
                password: "",
                rePassword: ""
            }
        };
        this.usernameRef = React.createRef();
        this.emailRef = React.createRef();
        this.fnameRef = React.createRef();
        this.lnameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.rePasswordRef = React.createRef();
    }

    sendFormData(e) {
        e.preventDefault();

        let err = this.validateFields();
        this.setState({inputErrors: err});
        if (Object.values(err).some(item => item !== "") === false) {
            let data = {
                "uname": this.usernameRef.current.value,
                "fname": this.fnameRef.current.value,
                "lname": this.lnameRef.current.value,
                "email": this.emailRef.current.value,
                "password": this.passwordRef.current.value
            };
            axios.post('http://localhost:8080/api/auth/registration', data)
                .then(function (response) {
                    console.log(response);
                    if (response.data.status === "error") {
                        this.setState({inputErrors: response.data.reason});
                    }
                    else if (response.data.status === "ok") {
                        this.props.history.push('/auth/registration/confirm_email');
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
            email: this.validateEmail(),
            fname: this.validateFname(),
            lname: this.validateLname(),
            password: this.validatePassword(),
            rePassword: this.validateRePassword()
        };
    }

    validateUsername() {
        if (this.usernameRef.current.value.length < 6)
            return "Username is too short";
        else if (this.usernameRef.current.value.length > 16)
            return "Username is too long";
        else
            return "";
    }

    validateEmail() {
        if (this.emailRef.current.value.length === 0)
            return "Invalid Email";
        else
            return "";
    }

    validateFname() {
        if (this.fnameRef.current.value.length < 1)
            return "First Name is too short";
        else if (this.fnameRef.current.value.length > 256)
            return "First Name is too long";
        else
            return "";
    }

    validateLname() {
        if (this.lnameRef.current.value.length < 1)
            return "Last Name is too short";
        else if (this.lnameRef.current.value.length > 256)
            return "Last Name is too long";
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

    validateRePassword() {
        if (this.rePasswordRef.current.value !== this.passwordRef.current.value)
            return "Passwords don't match";
        else
            return "";
    }

    render() {
        return (
            <Switch>
                <Route exact path="/auth/registration" render={() => (
                    <div>
                        <div className="containerr">
                            <Panda />
                            <form>
                                <div className="dws" id="username">
                                    <p className="inputError">{this.state.inputErrors.uname}</p>
                                    <input className="st" type="text" placeholder="Username" ref={this.usernameRef}/>
                                </div>
                                <div className="dws" id="email">
                                    <p className="inputError">{this.state.inputErrors.email}</p>
                                    <input className="st" type="text" placeholder="E-mail" ref={this.emailRef}/>
                                </div>
                                <div className="dws" id="fname">
                                    <p className="inputError">{this.state.inputErrors.fname}</p>
                                    <input className="st" type="text" placeholder="First Name" ref={this.fnameRef}/>
                                </div>
                                <div className="dws" id="lname">
                                    <p className="inputError">{this.state.inputErrors.lname}</p>
                                    <input className="st" type="text" placeholder="Last Name" ref={this.lnameRef}/>
                                </div>
                                <div className="dws" id="password">
                                    <p className="inputError">{this.state.inputErrors.password}</p>
                                    <input className="st" type="password" placeholder="Password" ref={this.passwordRef}/>
                                </div>
                                <div className="dws" id="rePassword">
                                    <p className="inputError">{this.state.inputErrors.rePassword}</p>
                                    <input className="st" type="password" placeholder="Repeat Password" ref={this.rePasswordRef}/>
                                </div>
                                <div>
                                    <button onClick={this.sendFormData.bind(this)} className="btn color-btn"
                                            type="submit">Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>)
                }/>
                <Route exact path="/auth/registration/confirm_email" render={() => (
                    <div>Confirmation link is sent to your E-mail!</div>
                )}/>
            </Switch>

        )
    }
}

export default Registration;