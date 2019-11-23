import React, { Component } from 'react'
import './cover.css';
import { db } from '../Firebase/firebase.js'
const INITIAL_STATE = {
    Profesor: '',
}
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        if (sessionStorage.length != 0) {
            const uid = sessionStorage.getItem("user");

            db.collection("usuarios").doc(uid).get().then(querySnapshot => {
                const user = querySnapshot.data();
                if (uid === user.email) {
                    if (user.Profesor == "on") {
                        window.location.href = "/dashboardP";
                    } else if (user.Profesor == "off") {
                        window.location.href = "/dashboardE"
                    }
                    this.setState({ Profesor: user.Profesor });
                }
            });
        }
    }
    render() {
        var logged = false;
        if (sessionStorage.length != 0 && !logged) {
            logged = true;
        }

        return (
            <main>
                {logged ?
                    <div>
                        {this.state.Profesor != '' &&
                            <div>
                                {(this.state.Profesor == "on") &&
                                    <div className="portada" align="center">
                                        <img className="cover" alt="peer" src="https://firebasestorage.googleapis.com/v0/b/peer-evaluation-747fc.appspot.com/o/portada.jpg?alt=media&token=8bc9d7da-9983-4d5f-b198-23f6201fe264"></img>
                                        <div className="info-principal">
                                            <h1 className="titulo-principal">Evaluacion de Pares</h1>
                                            <p className="Descripcion">La coevaluación o evaluación de pares es un proceso a través del cual los estudiantes y los profesores participan en la evaluación del trabajo de los estudiantes.</p>
                                            <button type="button" className="btn btn-primary">Conoce mas</button>
                                            <a role="button" className="btn btn-secondary" href="/dashboardP">DashBoard</a>
                                        </div>
                                    </div>
                                }
                                {(this.state.Profesor == "off") &&
                                    <div className="portada" align="center">
                                        <img className="cover" alt="peer" src="https://firebasestorage.googleapis.com/v0/b/peer-evaluation-747fc.appspot.com/o/portada.jpg?alt=media&token=8bc9d7da-9983-4d5f-b198-23f6201fe264"></img>
                                        <div className="info-principal">

                                            <h1 className="titulo-principal">Evaluacion de Pares</h1>
                                            <p className="Descripcion">La coevaluación o evaluación de pares es un proceso a través del cual los estudiantes y los profesores participan en la evaluación del trabajo de los estudiantes.</p>
                                            <button type="button" className="btn btn-primary">Conoce mas</button>
                                            <a role="button" className="btn btn-secondary" href="/dashboardE">DashBoard</a>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                    :
                    <div className="portada" align="center">
                        <img className="cover" alt="peer" src="https://firebasestorage.googleapis.com/v0/b/peer-evaluation-747fc.appspot.com/o/portada.jpg?alt=media&token=8bc9d7da-9983-4d5f-b198-23f6201fe264"></img>
                        <div className="info-principal">

                            <h1 className="titulo-principal">Evaluacion de Pares</h1>
                            <p className="Descripcion">La coevaluación o evaluación de pares es un proceso a través del cual los estudiantes y los profesores participan en la evaluación del trabajo de los estudiantes.</p>
                            <button type="button" className="btn btn-primary">Conoce mas</button>
                            <a role="button" className="btn btn-secondary" href="/register">Registrarse</a>
                        </div>
                    </div>

                }
            </main>
        )
            
    }
}

export default Home;