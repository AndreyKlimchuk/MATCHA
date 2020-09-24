import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {observer} from "mobx-react";
import { runInAction } from "mobx";



const Chats = observer(
class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            curr_msg: ""
        };
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:8080/api/get_chats')
            .then(function (response) {
                console.log("RESP: ", response.data);
                if (response.data.status === "ok") {
                    this.setState({chats : response.data.data});
                }
            }.bind(this));
        this.props.storage.notif.chats = 0;
    }

    selectChat(id) {
        this.props.storage.chat.id = id;
        axios.post('http://localhost:8080/api/get_chat_history', {chat_id: id})
            .then(function (response) {
                console.log("RESP: ", response.data);
                if (response.data.status === "ok") {
                        this.props.storage.chat.msgs = response.data.data;
                }
            }.bind(this))
    }

    sendMsg() {
        if (this.state.curr_msg) {
            const body = {chat_id: this.props.storage.chat.id, message: this.state.curr_msg};
            axios.post('http://localhost:8080/api/send', body)
                .then(function (response) {
                    console.log("RESP: ", response.data);
                    if (response.data.status === 'ok')
                        this.props.storage.chat.msgs.push(response.data.data)
                }.bind(this));
            this.state.curr_msg = "";
        }
    }

    componentWillUnmount() {
        runInAction(() => {
            this.props.storage.chat.msgs = [];
            this.props.storage.chat.id = undefined;
        });
    }

	render() {

        const {profile} = this.props.storage.user;
        let chat;
        if (this.props.storage.chat.id) {
            chat = (
                <div>

                        <div className="chatbox col-xl-10 col-lg-10 col-md-10 row-sm-10 col-10">
                            <div className="chatlogs">
                                {this.props.storage.chat.msgs.map(m => (
                                    <div key={m.id} className={m.sender_id === profile.id ? "chat self" : "chat friend"}>
                                        <p className="chat-message col-xl-10 col-lg-10 col-md-10 row-sm-10 col-8">
                                            {m.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    <div className= "chat-form">
                        <textarea value={this.state.curr_msg} onChange={e => {
                            this.setState({curr_msg: e.target.value})
                        }}/>
                        <button className="btn color-btn" type="submit" onClick={() => this.sendMsg()}>Send</button>
                    </div>
                </div>
            )
        } else {
            chat = (<h1> Nothing to show </h1>);
        }

		return this.props.storage.user.profile.is_complete ? (
			<div>
	  			<div className= "container">
                    <div className="row">
                        <div className="col-xl-2 col-lg-2 col-md-3 row-sm-5 col-12">
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-3 row-sm-5 col-3">
                            {this.state.chats.map(c => (
                                <div key="c.chat_id" className="center" onClick={() => this.selectChat(c.chat_id)}>
                                    <img className="chat_us" src={c.photo || "static/default.png"} />
                                    <span className="aaa">{c.username}</span>
                                </div>
                            ))}
                        </div>
                        {chat}
                    </div>
                </div>
            </div>
		) : (<Redirect to="/my_profile" />);
	}
}
)


export default Chats;