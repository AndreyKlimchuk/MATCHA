import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Likes extends Component {

    constructor(props) {
        super(props);
        this.state = {likes: []};
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:8080/api/get_likes')
            .then(function (response) {
                console.log("RESP: ", response.data);
                if (response.data.status === "ok") {
                    this.setState({likes : response.data.data});
                }
            }.bind(this));
        this.props.storage.notif.likes = 0;
    }

    handleLike(id) {
        axios.post('http://localhost:8080/api/like', {uid: id})
            .then(function (response) {
                console.log("RESP: ", response);
                if (response.data.status === "ok")
                    this.setState({likes: this.state.likes.filter(l => l.id !== id)})
            }.bind(this))
    }

	render() {
		return this.props.storage.user.profile.is_complete ? (
	  		<div>
	  			<div className="container top">
					<div className= "row  d-flex flex-wrap">
						<div className= "col-2">
						</div>
						<div className= "col-9">
                            {this.state.likes.map(l => (
                                <div key={[l.id, (new Date()).getMilliseconds()]} className= "row  d-flex flex-wrap">
                                    <div className= "col-1"></div>
                                    <div className= "col-8 col-lg-3 col-xl-2 col-sm-6 text-center">
                                        <Link to={"/user_profile/" + l.id}>
                                            <img className= "imgi" src={l.photo || "static/default.png"} />
                                        </Link>
                                    </div>
                                    <div className= "col-8 offset-2 col-xl-2 col-sm-2 offset-sm-0">
                                        <div className= "p-2"><p className= "name">{l.username} </p></div>
                                        <button className="aq btn btn-danger" type="button"
                                                onClick={() => this.handleLike(l.id)}>
                                            Like back
                                        </button>
                                    </div>
                                </div>
                            ))}
						</div>
					</div>
				</div>
			</div>
		) : (<Redirect to="/my_profile" />);;
	}
};


export default Likes;