import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import StarRatings from 'react-star-ratings';




class User_Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            not_found: false,
            is_segfault: false,
            profile: {
                first_name: "",
                last_name: "",
                birthdate: "",
                gender: "",
                sexual_preference: "",
                bio: "",
                rating: 0,
                total_rating: 0,
                interests: [],
                avatar: "",
                photo1: "",
                photo2: "",
                photo3: "",
                photo4: "",
                is_liked: false,
                is_blocked: false,
                last_seen_at: "",
                status: undefined
            }
        };
        axios.post('http://localhost:8080/api/get_profile', {uid: this.props.match.params.id})
            .then(function (response) {
                console.log("USER: ", response);
                if (response.data.status === "error" && response.data.reason === "not_found") {
                    this.setState({not_found: true})
                }
                else if (response.data.status === "ok") {
                    console.log("RESP: ", response.data.data);
                    this.setState({profile : response.data.data});
                }
            }.bind(this))
    }

    convertGender(gender) {
        if (gender=== 'm')
            return 'Male';
        else if (gender === 'f')
            return 'Femail';
        else if (gender === 'b')
            return 'Any';
    }

    handleBlock() {
        let action = this.state.profile.is_blocked ?  "unblock" : "block";
        axios.post('http://localhost:8080/api/' + action, {uid: this.props.match.params.id})
            .then(function (response) {
                console.log("RESP: ", response);
                if (response.data.status === "ok")
                    this.setState({
                        profile: {
                            ...this.state.profile,
                            is_blocked: !this.state.profile.is_blocked
                        }
                    })
            }.bind(this))
    }


    handleLike() {
        let action = this.state.profile.is_liked ?  "unlike" : "like";
        axios.post('http://localhost:8080/api/' + action, {uid: this.props.match.params.id})
            .then(function (response) {
                console.log("RESP: ", response);
                if (response.data.status === "ok")
                    this.setState({
                        profile: {
                            ...this.state.profile,
                            is_liked: !this.state.profile.is_liked
                        }
                    })
            }.bind(this))
    }

    handleReport() {
        axios.post('http://localhost:8080/api/report', {uid: this.props.match.params.id})
            .then(function (response) {
                console.log("RESP: ", response);
                if (response.data.status === "ok")
                    this.setState({is_segfault: true})
            }.bind(this))

    }

    handleRating(rating) {
        axios.post('http://localhost:8080/api/rate', {uid: this.props.match.params.id, rating: rating})
            .then(function (response) {
                console.log("RESP: ", response);
                if (response.data.status === "ok")
                    this.setState({
                        profile: {
                            ...this.state.profile,
                            rating: rating,
                            total_rating: response.data.data.total_rating
                        }
                    })
            }.bind(this))
    }


    render(){

        console.log(this.state.profile);
        if (!this.props.storage.user.profile.is_complete)
            return (<Redirect to="/my_profile" />);
        else if (this.state.is_segfault)
            return (<h1>SEGMENTATION FAULT</h1>);
        else if (this.state.not_found)
            return (<h1>NOT FOUND</h1>);
        else {

            return (
                <div>
                    <div className="contaiter o">
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <p>{this.state.profile.username}, {this.state.profile.total_rating}</p>
                                <img className="user_avatar" src={this.state.profile.avatar}/>
                                <StarRatings
                                    rating={this.state.profile.rating}
                                    starRatedColor="blue"
                                    changeRating={(newRating) => this.handleRating(newRating)}
                                    numberOfStars={10}
                                    starDimension="15px"
                                    starSpacing="5px"
                                    name='rating'
                                />
                                <p>{this.state.profile.status ?
                                    "Online" : "last seen at: " + this.state.profile.last_seen_at}</p>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 pt-5">
                                <p>{this.state.profile.first_name}</p>
                                <p>{this.state.profile.last_name}</p>
                                <p>{this.state.profile.birthdate}</p>
                                <p>Gender: {this.convertGender(this.state.profile.gender)}</p>
                                <p>Sexual preference: {this.convertGender(this.state.profile.sexual_preference)}</p>
                                <p>Interests: {this.state.profile.interests.map(i => (<span key={i}>{i} </span>))}</p>
                                <p>Bio: {this.state.profile.bio}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                <div className="row">
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 p-1">
                                        <img src={this.state.profile.photo1}/>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 p-1">
                                        <img src={this.state.profile.photo2}/>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 p-1">
                                        <img src={this.state.profile.photo3}/>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 p-1">
                                        <img src={this.state.profile.photo4}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
                                <div className="aq">
                                    <button className="aq btn btn-danger" type="button"
                                            onClick={() => this.handleLike()}>
                                        {this.state.profile.is_liked ? "Unlike" : "Like"}
                                    </button>
                                </div>
                                <div className="aq">
                                    <button type="button" className="btn btn-info"
                                            onClick={() => this.handleBlock()}>
                                        {this.state.profile.is_blocked ? "Unblock" : "Block"}
                                    </button>
                                </div>
                                <div className="aq">
                                    <button type="button" className="btn btn-dark" onClick={() => this.handleReport()}>
                                        Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default User_Profile;