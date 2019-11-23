import React, { Component } from 'react'
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './cover.css'
import { db } from "../Firebase/firebase"

const INITIAL_STATE = {
    UID: '',
    USER: [],
    CURSOS: [],
    NRC: [],
    index: '0',
    indexselected: '',
    NRCSelected: '',
    COMPAÑEROS: [],
    compañeros: [],
    nombrecursos: [],
    lista: [],
    NOMBRES: [],
    APELLIDOS: [],
    EMAILS: [],
    loading: '',
};
class Grupo extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        const uid = sessionStorage.getItem("user");
        db.collection("usuarios").doc(uid).get().then(querySnapshot => {
            const user = querySnapshot.data();
            const cursos = user.cursos;
            this.setState({ USER: user });
            this.setState({ UID: uid });
            this.setState({ NRC: cursos });
            const compañeros = [];
            const nombrecursos = [];
            for (let i = 0; i < this.state.NRC.length; i++) {
                db.collection("cursos").doc(cursos[i]).get().then(querySnapshot => {
                    compañeros[i] = querySnapshot.data().idEstudiantes;
                    nombrecursos[i] = querySnapshot.data().NombreCurso;

                });
            }
            this.setState({
                COMPAÑEROS: compañeros,
                CURSOS: nombrecursos
            });
        });


    }


    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeCurso = event => {
        const { EMAILS, NOMBRES, APELLIDOS, indexselected, NRC, NRCSelected, index, COMPAÑEROS, lista, loading } = this.state
        this.setState({ loading: true }, () => {
            this.setState({ lista: COMPAÑEROS[index] });
            this.setState({ EMAILS: lista });
            const nombres = [];
            const apellidos = [];
            for (let i = 0; i < lista.length; i++) {
                db.collection("usuarios").doc(lista[i]).get().then(querySnapshot => {
                    nombres.push(querySnapshot.data().name);
                    apellidos.push(querySnapshot.data().apellido);
                });
            }
            this.setState({ NOMBRES: nombres });
            this.setState({ APELLIDOS: apellidos });
            this.setState({ loading: false });
        });

    };


    render() {

        const { CURSOS, NOMBRES, EMAILS, APELLIDOS, index, NRC, lista, vals } = this.state;

        setTimeout(() => {
            if (lista === undefined) {

                this.setState({ lista: this.state.lista })

            } else {

                if (lista[0] === undefined) {
                 
                    this.setState({ lista: this.state.lista })

                }
            }
        }, 500)

        return (
            <main>
                {CURSOS != undefined &&
                    <div>
                        <div className="container">
                            <br />
                            <h1 className="text-center">Mi grupo:</h1>
                            <div className="row">
                                <div className="col-sm-10">
                                    <select className="form-control" id="index" name="index" onChange={this.onChange}>
                                        {NRC.map((cursos, index) =>
                                            <option key={index} value={index} >{cursos + " " + CURSOS[index]}
                                            </option>
                                        )}
                                    </select>
                                </div>
                                <div className="col">
                                    <button type="button" onClick={this.onChangeCurso} class="btn btn-primary">Buscar</button>
                                </div>
                            </div>
                            <br />
                        </div>
                        <div class="h-100" id="demopurpose">
                            <div class="container h-100">
                                <div class="row  align-items-center h-100">
                                    {lista.map((nombres, indexl) =>
                                        <div key={indexl} value={indexl} class="col-12 col-sm-8 col-md-6 col-lg-4">
                                            <div class="profile-card py-3 card text-center">
                                                <a class="btn-edit" href="">
                                                    <i class="fa fa-edit"></i>
                                                </a>
                                                <div class="card-body py-4">
                                                    <img class="profile-picture rounded-circle" src="https://dummyimage.com/200x200/000/fff" />

                                                    <h2 class="text-dark h5 font-weight-bold mt-4 mb-1">
                                                        {NOMBRES[indexl]}
                                                    </h2>
                                                    <p class="text-muted font-weight-bold small">
                                                        <i class="fa fa-map-marker"></i>
                                                        {APELLIDOS[indexl]}
                                                    </p>
                                                    <p class="px-1 mt-4 mb-4 text-muted quote-text">
                                                        {EMAILS[indexl]}
                                                    </p>
                                                    <div class="d-flex px-1 w-100 align-items-center text-left">


                                                    </div>

                                                </div>
                                            </div>



                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </main>


        );


    }



}
export default Grupo;