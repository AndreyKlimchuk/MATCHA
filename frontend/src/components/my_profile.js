import React, {Component} from 'react';
import axios from 'axios';
import { WithContext as ReactTags } from 'react-tag-input';
import {observer} from "mobx-react";
import GoogleMapReact from 'google-map-react';
import Select from 'react-select';


const KeyCodes = {
    comma: 188,
    enter: 13,
};

const SexPref = [
    { value: 'f', label: 'Girls' },
    { value: 'm', label: 'Boys' },
    { value: 'b', label: 'Any' }
];

const Gender = [
    { value: 'm', label: 'Male' },
    { value: 'f', label: 'Female' },
];

const suggestions = [
    { id: 'Books', text: 'Books' },
    { id: 'Journey', text: 'Journey' },
    { id: 'Flowers', text: 'Flowers' },
    { id: 'Animals', text: 'Animals' },
    { id: 'Music', text: 'Music' },
    { id: 'Sport', text: 'Sport' },
    { id: 'Computer game', text: 'Computer game' },
    { id: 'Cooking', text: 'Cooking' },
    { id: 'Technologies', text: 'Technologies' },
    { id: 'Painting', text: 'Painting' },
    { id: 'Singing', text: 'Singing' },
    { id: 'Dancing', text: 'Dancing' }
];

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const My_Profile = observer(
class My_Profile extends Component {

    constructor(props) {
        super(props);
        const {profile} = this.props.storage.user;
        let coords;
        if (profile.is_complete)
            coords = profile.location;
        else {
            this.setLocation();
            coords = {lat: 27.95, lng: 75.33}
        }
        this.state = {
            map: {
                marker: coords,
                center: coords,
                zoom: 11
            },
            errors: {
                gender: "",
                sexual_preference: "",
                bio: "",
                interests: "",
                avatar: "",
                photo1: "",
                photo2: "",
                photo3: "",
                photo4: "",
                first_name: "",
                last_name: "",
                username: "",
                birthdate: "",
                location: ""
            },
            avatar: {src: profile.avatar || "static/default.png", is_changed: false},
            photo1: {src: profile.photo1 || "static/default.png", is_changed: false},
            photo2: {src: profile.photo2 || "static/default.png", is_changed: false},
            photo3: {src: profile.photo3 || "static/default.png", is_changed: false},
            photo4: {src: profile.photo4 || "static/default.png", is_changed: false},
            username: profile.username,
            firstName: profile.first_name,
            lastName: profile.last_name,
            birthdate: profile.birthdate,
            bio: profile.bio || "",
            tags: profile.interests || [],
            email: profile.email,
            email_result: "",
            old_password: "",
            password: "",
            rePass: "",
            password_result: "",
            gender: Gender.find(obj => profile.gender === obj.value) || { value: 'm', label: 'Male' },
            sexPref: SexPref.find(obj => profile.sexual_preference === obj.value) || { value: 'f', label: 'Girls' }
        }
    }

    updateProfile(e) {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        if (!this.props.storage.user.profile.is_complete && !this.state.avatar.is_changed)
            this.setState({errors: {...this.state.errors, avatar: "avatar is not selected"}});
        else {
            this.setState({
                errors: {
                    gender: "",
                    sexual_preference: "",
                    bio: "",
                    interests: "",
                    avatar: "",
                    photo1: "",
                    photo2: "",
                    photo3: "",
                    photo4: "",
                    first_name: "",
                    last_name: "",
                    username: "",
                    birthdate: "",
                    location: ""
                }
            });
            const data = {
                "gender": this.state.gender.value,
                "sexual_preference": this.state.sexPref.value,
                "bio": this.state.bio,
                "interests": this.state.tags,
                "avatar": this.state.avatar.is_changed ? this.state.avatar.src : null,
                "photo1": this.state.photo1.is_changed ? this.state.photo1.src : null,
                "photo2": this.state.photo2.is_changed ? this.state.photo2.src : null,
                "photo3": this.state.photo3.is_changed ? this.state.photo3.src : null,
                "photo4": this.state.photo4.is_changed ? this.state.photo4.src : null,
                "first_name": this.state.firstName,
                "last_name": this.state.lastName,
                "username": this.state.username,
                "birthdate": this.state.birthdate,
                "location": this.state.map.marker
            };
            axios.post("http://localhost:8080/api/update_profile", data)
                .then((res) => {
                if(res.data.status === "ok")
                {
                    this.props.storage.user.profile = res.data.data;
                } else {
                    this.setState({errors: {...this.state.errors,...res.data.reason}})
                    console.log("error: ", res.data.reason);
                }
            });
        }
    }

    updateEmail(e) {
        e.preventDefault();
        axios.defaults.withCredentials = true
        const data = {email: this.state.email};
        axios.post("http://localhost:8080/api/update_email", data)
            .then((res) => {
                console.log(res.data);
                if (res.data.status === "ok") {
                    this.setState({email_result: "confirmation letter sent"});
                }
                else if (res.data.status === "error") {
                    this.setState({email_result: res.data.reason.email});
                }
            });
    }

    updatePassword(e) {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        if (this.state.password === "")
            this.setState({password_result: "empty password not allowed"});
        else if (this.state.rePass !== this.state.password)
            this.setState({password_result: "passwords don't match"});
        else {
            const data = {old_pass: this.state.old_password, new_pass: this.state.password};
            axios.post("http://localhost:8080/api/update_password", data)
                .then((res) => {
                    console.log(res.data);
                    if (res.data.status === "ok") {
                        this.setState({password_result: "password changed"});
                    }
                    else if (res.data.status === "error") {
                        this.setState({password_result: res.data.reason.old_pass || res.data.reason.new_pass});
                    }
                });
        }
    }

    setLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    let coords = {lat: pos.coords.latitude, lng: pos.coords.longitude};
                    this.setState({map: {center: coords, marker: coords, zoom: 11}})
                },
                () => this.setLocation2()
            );
        } else {
             this.setLocation2();
        }
    };

    setLocation2() {
        axios.defaults.withCredentials = false;
        axios.get("http://ip-api.com/json")
            .then((res) => {
                let coords = {lat: res.data.lat, lng: res.data.lon};
                this.setState({map: {center: coords, marker: coords, zoom: 11}})
            });
    }

    handleDelete = (i) => {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition = (tag) => {
        if (this.state.tags.length < 5) {
            this.setState(state => ({tags: [...state.tags, tag]}));
        }
    }

    handleDrag = (tag, currPos, newPos) => {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        this.setState({ tags: newTags });
    }

    handleChange = (event) => {
        let reader = new FileReader();
        let target = event.target;
        reader.addEventListener("load", () => {
            let obj = {};
            obj[target.id] = {src: reader.result, is_changed: true};
            this.setState(obj);
        }, false);
        reader.readAsDataURL(event.target.files[0]);
    };


    render(){
        console.log("STATE: ", this.state)
            return (
                <div className="center-block">
                <div className="contaiter t center-block">
                    <div className="row">
                        <div className="col-xl-5 col-md-4 col-sm-7 col-md-3">
                            <label htmlFor="avatar">
                                <input  onChange={this.handleChange} id="avatar" type="file"
                                        multiple accept="image/jpeg, image/png"/>
                                <img className="my_avatar" src={this.state.avatar.src} />
                                <p className="inputError">{this.state.errors.avatar}</p>
                            </label>
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-md-2">
                            <label htmlFor="photo1">
                                <input className="btn btn-light" onChange={this.handleChange} id="photo1" type="file"
                                       multiple accept="image/jpeg, image/png"/>
                                <img className="my_avatar" src={this.state.photo1.src} />
                                <p className="inputError">{this.state.errors.photo1}</p>
                            </label>
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-md-2">
                            <label htmlFor="photo2">
                                <input className="btn btn-light" onChange={this.handleChange} id="photo2" type="file"
                                       multiple accept="image/jpeg, image/png"/>
                                <img className="my_avatar" src={this.state.photo2.src} />
                                <p className="inputError">{this.state.errors.photo2}</p>
                            </label>
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-md-2">
                            <label htmlFor="photo3">
                                <input className="btn btn-light" onChange={this.handleChange} id="photo3" type="file"
                                       multiple accept="image/jpeg, image/png"/>
                                <img className="my_avatar" src={this.state.photo3.src} />
                                <p className="inputError">{this.state.errors.photo3}</p>
                            </label>
                        </div>
                        <div className="col-xl-2 col-md-2 col-sm-4 col-md-2">
                            <label htmlFor="photo4">
                                <input className="btn btn-light" onChange={this.handleChange} id="photo4" type="file"
                                       multipleaccept="image/jpeg, image/png"/>
                                <img className="my_avatar" src={this.state.photo4.src} />
                                <p className="inputError">{this.state.errors.photo4}</p>
                            </label>
                        </div>
                        </div>
                    </div>

                    <div className= "t">
                    <div className= "dropdown q">
                        <p>Rating: {this.props.storage.user.profile.rating}</p>
                    <form>
                        <div className= "form-group">
                        <input type="text" className="form-control col-md-6"  placeholder="First Name"
                               value={this.state.firstName} onChange={ (e) => this.setState({firstName: e.target.value}) }/>
                        <p className="inputError">{this.state.errors.first_name}</p>
                    </div>
                    <div className= "form-group">
                        <input type="text" className="form-control col-md-6" placeholder="Last Name"
                               value={this.state.lastName} onChange={ (e) => this.setState({lastName: e.target.value}) }/>
                        <p className="inputError">{this.state.errors.last_name}</p>
                    </div>
                    <div className= "form-group">
                        <input type="text" className="form-control col-md-6" placeholder="User Name"
                               value={this.state.username} onChange={ (e) => this.setState({username: e.target.value}) }/>
                        <p className="inputError">{this.state.errors.username}</p>
                    </div>
                    <textarea value={this.state.bio} onChange={(e) => this.setState({bio: e.target.value})} />
                        <p>{this.state.errors.bio}</p>
                    <div>
                        <ReactTags tags={this.state.tags}
                            maxLength={15}
                            suggestions={suggestions}
                            handleDelete={this.handleDelete}
                            handleAddition={this.handleAddition}
                            handleDrag={this.handleDrag}
                            delimiters={delimiters} />
                        <p className="inputError">{this.state.errors.tags}</p>
                    </div>

                     <p>Your sexual preferences</p>
                            <Select
                                value={this.state.sexPref}
                                onChange= {value => this.setState({sexPref: value})}
                                options={SexPref}
                            />
                            <p className="inputError">{this.state.errors.sexual_preference}</p>
                            <p>Please choose your gender</p>
                            <Select
                                value={this.state.gender}
                                onChange= {value => this.setState({gender: value})}
                                options={Gender}
                            />
                            <p className="inputError">{this.state.errors.gender}</p>
                        <p>Birthdate:</p>
                            <input type="date" value={this.state.birthdate || ""} onChange={ (e) =>
                                this.setState({birthdate: e.target.value})
                            }/>
                        <p className="inputError">{this.state.errors.birthdate}</p>
                        <br />
                        <input onClick={this.updateProfile.bind(this)} className="btn color-btn" type="submit" />
                    </form>
                    <div className="deliminer"></div></div>
                    </div>
                    <form className="t q">
                        <div className= "form-group">
                            <input type="email" className="form-control col-md-6" id="exampleFormControlInput1"
                                   value={this.state.email}
                                   onChange={ (e) => this.setState({email: e.target.value}) }
                                   placeholder="Email address" />
                        </div>
                        <input className="btn color-btn" type="submit"
                               onClick={this.updateEmail.bind(this)}/>
                        <p className="inputError">{this.state.email_result}</p>
                        <div className="deliminer"></div>
                    </form>
                        <form className="t q">
                            <div className= "form-group">
                                <input type="password" className="form-control col-md-6" placeholder="Current Password"
                                       value={this.state.old_password}
                                       onChange={ (e) => this.setState({old_password: e.target.value}) }/>
                            </div>
                            <div className= "form-group">
                                <input type="password" className="form-control col-md-6" placeholder="Password"
                                       value={this.state.password}
                                       onChange={ (e) => this.setState({password: e.target.value}) }/>
                            </div>
                            <div className= "form-group">
                                <input type="password" className="form-control col-md-6" placeholder="Repeat Password"
                                       value={this.state.rePass}
                                       onChange={ (e) => this.setState({rePass: e.target.value}) }/>
                            </div>
                            <input className="btn color-btn" type="submit" onClick={this.updatePassword.bind(this)}/>
                            <p className="inputError">{this.state.password_result}</p>
                    </form>
                    <div className="contaiter " style={{ height: '450px', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: "AIzaSyCpv0xxIkX39XiL65O9H4_vgCRuvR-fA8M" }}
                            center={this.state.map.center}
                            zoom={this.state.map.zoom}
                            onClick={(e) => {
                                this.setState({
                                    map: {
                                        marker: {
                                            lat: e.lat,
                                            lng: e.lng
                                        }
                                    }
                                });
                            }}
                        >
                        <Marker {...this.state.map.marker}/>
                        </GoogleMapReact>
                    </div>
                </div>
            )
        }
}
);


const Marker = () => <div style={{width: '20px', height: '20px', border: '5px red solid',
                                  borderRadius: '10px', backgroundColor: 'white'}} />;


export default My_Profile;

