import React, {Component} from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { Panda } from "./registration";

class Password_Recovering extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputErrors: {
                email: "",
                new_password: "",
                re_password: ""
            }
        };
        this.emailRef = React.createRef();
        this.new_passwordRef = React.createRef();
        this.re_passwordRef = React.createRef();
        axios.defaults.withCredentials = true;
    }

    sendEmail(e) {
        e.preventDefault();

        let err = { email: this.validateEmail()};
        this.setState({inputErrors: err});
        if (Object.values(err).some(item => item !== "") === false) {
            let data = {
                "email": this.emailRef.current.value
            };
            axios.post('http://localhost:8080/api/auth/password_recovering', data)
                .then(function (response) {
                    console.log(response);
                    if (response.data.status === "error") {
                        this.setState({inputErrors: response.data.reason});
                    }
                    else if (response.data.status === "ok") {
                        this.props.history.push('/auth/password_recovering/confirm_email');
                    }
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    sendNewPass(e) {
        e.preventDefault();

        let err = { new_password: this.validateNewPass(),
                    re_password: this.validatePassword()};
        this.setState({inputErrors: err});
        if (Object.values(err).some(item => item !== "") === false) {
            let data = {
                "new_password": this.new_passwordRef.current.value,
                "re_password": this.re_passwordRef.current.value
            };
            axios.post('http://localhost:8080/api/auth/password_recovering/set_new_password', data)
                .then(function (response) {
                    console.log(response);
                    if (response.data.status === "error") {
                        this.setState({inputErrors: response.data.reason});
                    }
                    else if (response.data.status === "ok") {
                        this.props.history.push('/auth');
                    }
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    validateEmail() {
        if (this.emailRef.current.value.length === 0)
            return "Invalid Email";
        else
            return "";
    }

    validateNewPass() {
        if (this.new_passwordRef.current.value.length < 6)
            return "Password is too short";
        else if (this.new_passwordRef.current.value.length > 128)
            return "Password is too long";
        else
            return "";
    }

    validatePassword() {
        if (this.re_passwordRef.current.value !== this.new_passwordRef.current.value)
            return "Passwords don't match";
        else
            return "";
    }
    render() {
        return (
            <Switch>
            <Route exact path="/auth/password_recovering" render={() => (
                <div className="containerr">
                    <Panda />
                    <form>
                        <div className="dws">
                            <p className="inputError ">{this.state.inputErrors.email}</p>
                            <input className="st" type="text" name="username" placeholder="Your E-mail" ref={this.emailRef}/>
                        </div>
                        <div>
                            <button onClick={this.sendEmail.bind(this)}className="btn color-btn m-2" type="submit">Submit</button>
                        </div>
                    </form>
                </div>)
            }/>
         <Route exact path="/auth/password_recovering/set_new_password" render={() => (
            <div className="container">
                <Panda />
                <form>
                    <div className="dws">
                        <p className="inputError">{this.state.inputErrors.new_password}</p>
                        <input className="st" type="password" placeholder="New Password" ref={this.new_passwordRef}/>
                    </div>
                    <div className="dws">
                        <p className="inputError">{this.state.inputErrors. re_password}</p>
                        <input className="st" type="password"  placeholder="Repeat Password" ref={this.re_passwordRef}/>
                    </div>
                    <div>
                        <button onClick={this.sendNewPass.bind(this)}className="btn btn-warning m-2" type="submit">Submit</button>
                    </div>
                </form>
            </div>
            )}/>
        </Switch>
        )
    }
}

export default Password_Recovering;