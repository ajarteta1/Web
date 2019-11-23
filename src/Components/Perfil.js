import React, { Component } from 'react'
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "../Firebase/firebase"
import './cover.css'

const INITIAL_STATE = {
    UID: '',
    USER: [],
};
class Perfil extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        const uid = sessionStorage.getItem("user");
        console.log(uid);
        db.collection("usuarios").doc(uid).get().then(querySnapshot => {
            const user = querySnapshot.data();
            console.log(user);
            this.setState({ USER: user });
            this.setState({ UID: uid });
        });
    }



    render() {
        const { UID, USER } = this.state;
        return (
            <main>
                <a href="#" class="btn btn-lg btn-success" data-toggle="modal" data-target="#basicModal">
                    Click to open Modal
</a>
                <div class="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="myModalLabel">Basic Modal </h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <h3>Modal Body</h3>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


        );


    }



}
export default Perfil;