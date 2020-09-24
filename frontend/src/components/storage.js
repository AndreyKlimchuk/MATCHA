import axios from 'axios';
import { observable, runInAction } from "mobx";

class Storage {
    user = observable({
        isAuthenticated: undefined,
        profile: {
            id: undefined,
            username: undefined,
            first_name: undefined,
            last_name: undefined,
            birthdate: undefined,
            gender: undefined,
            sexual_preference: undefined,
            bio: undefined,
            interests: undefined,
            email: undefined,
            location: undefined,
            is_complete: undefined,
            avatar: undefined,
            photo1: undefined,
            photo2: undefined,
            photo3: undefined,
            photo4: undefined
        }
    });

    chat = observable({
        id: undefined,
        msgs: []
    });

    notif = observable({
        chats: 0,
        visits: 0,
        likes: 0
    });

    constructor() {
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:8080/api/get_profile', {uid: 'me'})
            .then((response) => {
                const res = response.data;
                if (res.status === "error" && res.reason === "not_authorized") {
                    this.user.isAuthenticated = false;
                }
                else if (res.status === "ok") {
                    console.log("SERVER: ", res.data);
                    runInAction(() => {
                        this.user.isAuthenticated = true;
                        this.user.profile = res.data
                    });
                }
            })
            .catch((error) => console.log(error))
    }
}


export default Storage;

