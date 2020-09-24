import React, {Component} from 'react';
import Header from './header';
import Footer from './footer';
import Home from './home';
import Auth from './auth';
import Password_Recovering from './password_recovering';
import Registration from './registration';
import My_Profile from './my_profile';
import User_Profile from './user_profile';
import Visited_history from './visited_history';
import Likes from './likes';
import Chats from './chats';
import Search from './search';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import { observer } from "mobx-react";
import Websocket from 'react-websocket';
import AWN from "awesome-notifications";
import 'awesome-notifications/dist/style.css';


const Matcha = withRouter(observer(
    class Matcha extends Component {

        constructor(props) {
            super(props);
            this.state = {
                notifier: new AWN({
                    position: "bottom-right",
                    duration: 3000,
                    labels: {info: ""}
                })
            }
        }

        handleNotification(data) {
            let msg = JSON.parse(data);
            console.log("MSG: ", msg);
            if (msg.chat_id && msg.chat_id === this.props.storage.chat.id)
                this.props.storage.chat.msgs.push(msg);
            else if (msg.chat_id) {
                this.state.notifier.info('<b>' + msg.sender_username + ':  ' + msg.text + '</b>');
                this.props.storage.notif[msg.type] += 1;
            }
            else {
                this.state.notifier.info('<b>' + msg.text + '</b>');
                this.props.storage.notif[msg.type] += 1;
            }
        }

        render() {



            const {storage} = this.props;
            if (storage.user.isAuthenticated === undefined)
                return (<React.Fragment>waiting ...</React.Fragment>);
            else {
                const ws = storage.user.isAuthenticated && storage.user.profile.is_complete ?
                    <Websocket url='ws://localhost:8080/ws' onMessage={this.handleNotification.bind(this)}/> : null;

                return (
                    <React.Fragment>
                        <Header storage={storage}/>
                        <Switch>
                            <Route exact path="/" render={() => (<Redirect to="/auth"/>)}/>
                            <AuthRoute exact path="/auth"
                                       component={Auth} storage={storage}/>
                            <AuthRoute path="/auth/registration"
                                       component={Registration} storage={storage}/>
                            <AuthRoute path="/auth/password_recovering"
                                       component={Password_Recovering} storage={storage}/>
                            <PrivateRoute exact path="/user_profile/:id"
                                          component={User_Profile} storage={storage}/>
                            <PrivateRoute exact path="/search"
                                          component={Search} storage={storage}/>
                            <PrivateRoute exact path="/my_profile"
                                          component={My_Profile} storage={storage}/>
                            <PrivateRoute exact path="/visited_history"
                                          component={Visited_history} storage={storage}/>
                            <PrivateRoute exact path="/likes"
                                          component={Likes} storage={storage}/>
                            <PrivateRoute exact path="/chats"
                                          component={Chats} storage={storage}/>
                            <Route path="*" render={() => (<h1>Not Found</h1>)}/>
                        </Switch>
                        <Footer/>
                        {ws}
                    </React.Fragment>
                );
            }
        }
    }
));

const AuthRoute =
    ({ component: Component, storage, ...rest }) => (
        <Route
            {...rest}
            render = {props =>
                storage.user.isAuthenticated ? (
                    <Redirect to="search"/>
                ) : (
                    <Component {...props} storage={storage}/>
                )
            }
        />
    );

const PrivateRoute =
    ({ component: Component, storage, ...rest }) => {
        return (
            <Route
                {...rest}
                render={props => storage.user.isAuthenticated ?
                    (<Component {...props} storage={storage}/>) : (<Redirect to="/auth"/>)
                }
            />
        )
    };

export default Matcha;
