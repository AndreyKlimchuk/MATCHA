import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Visited_history extends Component {
	constructor(props) {
	    super(props);
	    this.state = {history: []};
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:8080/api/get_visit_history')
            .then(function (response) {
                console.log("RESP: ", response.data);
                if (response.data.status === "ok") {
                    this.setState({history : response.data.data});
                }
            }.bind(this));
        this.props.storage.notif.visits = 0;
    }

	render() {
		return this.props.storage.user.profile.is_complete ? (
	  		<div>
				<div>
					<div className="container top">
						<div className= "row  d-flex flex-wrap">
							<div className= "col-2">
							</div>
							<div className= "col-9">
                                {this.state.history.map(v => (
                                    <div key={[v.id, v.dt]} className= "row  d-flex flex-wrap">
                                        <div className= "col-1"></div>
                                        <div className= "col-8 col-lg-3 col-xl-2 col-sm-6 text-center">
                                            <Link to={"/user_profile/" + v.id}>
                                                <img className= "imgi" src={v.photo || "static/default.png"} />
                                            </Link>
                                        </div>
                                        <div className= "col-8 offset-2 col-xl-2 col-sm-2 offset-sm-0">
                                            <div className= "p-2"><p className= "name">{v.username} {v.dt}</p></div>
                                        </div>
                                    </div>
                                ))}

							</div>
						</div>
					</div>
				</div>
			</div>
		) : (<Redirect to="/my_profile" />);
	}
};


export default Visited_history;