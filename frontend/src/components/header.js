import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Storage from './storage';
import Password_Recovering from "./password_recovering";
import axios from "axios";
import {observer} from "mobx-react";
import {runInAction} from "mobx";

const Header = observer(
class Header extends Component {
    constructor(props) {
        super(props);
        axios.defaults.withCredentials = true;
    }

    logout() {
        axios.post('http://localhost:8080/api/auth/logout');
        runInAction(() => {
            this.props.storage.user.isAuthenticated = false;
            this.props.storage.user.profile = {};
        });
    }


    render() {
        const {user, notif} = this.props.storage;
        console.log(user.profile.username);
        if (user.isAuthenticated === true && user.profile.is_complete) {
            return (
                <nav className= "navbar footer navbar-expand-lg">
                  <p className= "navbar-brand matcha" href="#">Matcha</p>
                  <button className= "navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className= "navbar-toggler-icon fa fa-bars op"></span>
                  </button>
                  <div className= "collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className= "navbar-nav ml-auto">
                      <li className= "nav-item active">
                        <Link className= "nav-link op" to="/my_profile">Profile</Link>
                      </li>
                      <li className= "nav-item">
                        <Link className= "nav-link op" to="/search">Search</Link>
                      </li>
                      <li className= "nav-item active">
                        <Link className= "nav-link op" to="/visited_history">
                            Visit history {notif.visits > 0 ? "(" + notif.visits + ")" : ""}</Link>
                      </li>
                      <li className= "nav-item">
                        <Link className= "nav-link op" to="/likes">
                            Likes {notif.likes > 0 ? "(" + notif.likes + ")" : ""}</Link>
                      </li>
                      <li className= "nav-item">
                        <Link className= "nav-link op" to="/chats">
                            Chats {notif.chats > 0 ? "(" + notif.chats + ")" : ""}</Link>
                      </li>
                      <li className= "nav-item">
                        <p onClick={this.logout.bind(this)} className= "nav-link op">Exit</p>
                      </li>
                        <li className="nav-item">
                            {this.props.storage.user.profile.username}
                        </li>
                        </ul>
                     </div>
                </nav>
            )
        } else if (user.isAuthenticated === true) {
            return (
                <nav className= "navbar footer navbar-expand-lg">
                    <p className= "navbar-brand matcha" href="#">Matcha</p>
                    <button className= "navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className= "navbar-toggler-icon fa fa-bars op"></span>
                    </button>
                    <div className= "collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className= "navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className= "nav-link op" to="/my_profile">My Profile</Link>
                    </li>
                <li className="nav-item">
                    <p onClick={this.logout.bind(this)} className= "nav-link op" to="/exit">Exit</p>
                </li>
                </ul>
                </div>
                </nav>

        )} else {
            return (
                    <nav className= "navbar footer navbar-expand-lg">
                    <p className= "navbar-brand matcha" href="#">Matcha</p>
                    <button className= "navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className= "navbar-toggler-icon fa fa-bars op"></span>
                    </button>
                    <div className= "collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className= "navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className= "nav-link op" to="/auth">Auth</Link>
                            </li>
                            <li className="nav-item">
                                <Link className= "nav-link op" to="/auth/registration">Registration</Link>
                            </li>
                            <li className="nav-item">
                                <Link className= "nav-link op" to="/auth/password_recovering">Password_Recovering</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            )
        }
    }
}
);


export default Header;
