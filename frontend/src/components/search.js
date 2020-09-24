import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { WithContext as ReactTags } from 'react-tag-input';
import Select from 'react-select';
import 'react-input-range/lib/css/index.css';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import { Link } from 'react-router-dom';


const KeyCodes = {
    comma: 188,
    enter: 13,
};

const optionsSort = [
    { value: 'distance', label: 'Distance' },
    { value: 'common_interests', label: 'Common interests' },
    { value: 'age', label: 'Age' },
    { value: 'rating', label: 'Rating' }
];

const optionsGender = [
    { value: 'm', label: 'Male' },
    { value: 'f', label: 'Female' },
    { value: 'b', label: 'Any' }
];

const optionsOrder = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
];


const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Search extends Component {
	constructor(props) {
		super(props);
		console.log(this.props.storage.user.profile);
		if (this.props.storage.user.profile.is_complete) {
            this.state = {
                ageValue: {min: 18, max: 30},
                distanceValue: 1000,
                tags: [],
                ratingValue: {min: 0, max: 10},
                sortBy: {value: 'distance', label: 'Distance'},
                gender: optionsGender.find(obj => this.props.storage.user.profile.sexual_preference === obj.value),
                order: {value: 'desc', label: 'Descending'},
                limit: 6,
                offset: 0,
                users: []
            };
            axios.defaults.withCredentials = true;
            this.getProfiles(0);
        }
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

    getProfiles = (offset) => {
		const data = {
            "sort_by": this.state.sortBy.value,
            "sort_type": this.state.order.value,
            "age_range": this.state.ageValue,
            "interests": this.state.tags.map(a => a.text),
            "gender": this.state.gender.value,
            "limit": this.state.limit,
            "offset": offset,
            "rating_range": this.state.ratingValue,
            "max_distance": this.state.distanceValue
		};

        axios.post('http://localhost:8080/api/get_profiles', data)
            .then(function (response) {
                console.log(response);
                if (response.data.status === "error") {
                    console.log(response.data);
                }
                else if (response.data.status === "ok") {
                    this.setState({users : this.state.users.concat(response.data.data)});
                }
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

	render() {
		return this.props.storage.user.profile.is_complete ? (
			<div>
				<div className="container t center-block">
					<div className= "row  d-flex flex-wrap">

                        <div className="col-9">
                            {this.state.users.map(u => {
                                console.log(u);
                                return (
                                    <div className="row" key={u.id}>

                                        <div className="col-8 col-md-6 col-lg-6 col-xl-7 col-sm-6 text-center">
                                            <Link to={"/user_profile/" + u.id}>
                                                <img className="imgi" src={ u.avatar }/>
                                            </Link>
                                        </div>
                                        <div className="col-8 offset-2 col-xl-3 col-sm-2 offset-sm-0">
                                            <div className="p-2"><p className="name">{u.first_name}</p></div>
                                            <div className="p-2"><p className="">{u.last_name}</p></div>
                                            <div className="p-2"><p className="">{u.age}</p></div>
                                        </div>
                                    </div>
                                )
                            })}
                            <button onClick={() => {
                                let newOffset = this.state.offset + this.state.limit;
                                this.setState({offset: newOffset});
                                this.getProfiles(newOffset)
                            }}>Show more</button>
                        </div>


                        <div className="col-3">
                            <p>Sort Order:</p>
                            <Select
                                value={this.state.order}
                                onChange= {value => this.setState({order: value})}
                                options={optionsOrder}
                            />
							<p className= "top">Sort by:</p>
							<Select
								value={this.state.sortBy}
								onChange= {value => this.setState({sortBy: value})}
								options={optionsSort}
							/>
                            <p>Gender:</p>
                            <Select
                                value={this.state.gender}
                                onChange= {value => this.setState({gender: value})}
                                options={optionsGender}
                            />
                            <div>
                                <ReactTags
                                    maxLength={15}
                                    tags={this.state.tags}
                                    handleDelete={this.handleDelete}
                                    handleAddition={this.handleAddition}
                                    handleDrag={this.handleDrag}
                                    delimiters={delimiters} />
                		    </div>
		                    <div className= "top m-left">
		                        <p>Age:</p>
                                <InputRange
                                    maxValue={100}
                                    minValue={15}
                                    value={this.state.ageValue}
                                    onChange={value => this.setState({ageValue: value})} />
						    </div>
						    <div className= "top m-left">
		                        <p>Distanse:</p>
                                <InputRange
                                    maxValue={1000}
                                    minValue={0}
                                    value={this.state.distanceValue}
                                    onChange={value => this.setState({distanceValue: value})} />
						    </div>
							<div className= "top m-left">
								<p>Rating</p>
                                <InputRange
                                    maxValue={10}
                                    minValue={0}
                                    value={this.state.ratingValue}
                                    onChange={value => this.setState({ratingValue: value})} />
							</div>
							<div className= "chat-form">
								<button onClick={() => {
								    this.setState({users: [], offset: 0});
								    this.getProfiles(0)
                                }} className="btn color-btn"type="submit">Send</button>
							</div>
                        </div>
                    </div>
                </div>
			</div>
		) : (<Redirect to="/my_profile" />);
	}
};


export default Search;