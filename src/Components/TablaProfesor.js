import React, { Component } from "react";
import { db } from "../Firebase/firebase"

import ResultadosProfesor from "./ResultadosProfesor";
const INITIAL_STATE = {
    NRC: [],
    Actividades: [],
    Descripcion: [],
    NombreCurso: [],
    TipoEncuesta: [],
    Estado: [],
    idEstudiante: '',
    ind: 0,
    clicked: false,
    clickedPendiente: false,
    error: null,

};



class TablaProfesor extends Component {


    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    componentDidMount() {
        const uid = this.props.idEstudiante;
        const curso = this.props.curso;
        this.state.clicked = this.props.clicked;
        db.collection("usuarios").doc(uid).get().then(querySnapshot => {
            const user = querySnapshot.data();
            if (uid === user.email && user.Profesor === "off") {
                this.setState({ idEstudiante: uid });
            }
        });
        db.collection("usuarios").doc(sessionStorage.getItem('user'))
            .get()
            .then(doc => {
                const nrcTotal = [];
                const ActividadTotal = [];
                const DescripcionTotal = [];
                const TipoEncuestaTotal = [];
                const EstadoEncuestaTotal = [];
                var NombreCurso = [];
                const TipoRespuestasTotal = [];
                const NombreCursoTotal = [];

                db.collection('cursos').doc(curso).get().then(doc => {
                    NombreCurso[0] = doc.data().NombreCurso;


                    db.collection('cursos').doc(curso).collection('Actividades').get().then(act => {
                        const Actividades = act.docs.map(doc => doc.data().nombreActividad);
                        const Descripcion = act.docs.map(doc => doc.data().descripcion);
                        const TipoEncuesta = act.docs.map(doc => doc.data().tipoEncuesta);
                        for (let j = 0; j < Actividades.length; j++) {
                            nrcTotal.push(curso);
                            ActividadTotal.push(Actividades[j]);
                            DescripcionTotal.push(Descripcion[j]);
                            TipoEncuestaTotal.push(TipoEncuesta[j]);
                            NombreCursoTotal.push(NombreCurso[0]);
                            if (Actividades[j] != undefined) {
                                db.collection('cursos').doc(curso).collection('Actividades').doc(Actividades[j]).collection('Estudiantes').doc(uid).get().then(querySnapshot => {
                                    const estado = querySnapshot.data().estado;
                                    EstadoEncuestaTotal.push(estado);
                                })
                            }
                        }
                    })
                })
                this.setState({ NRC: nrcTotal })
                this.setState({ Actividades: ActividadTotal });
                this.setState({ Descripcion: DescripcionTotal });
                this.setState({ TipoEncuesta: TipoEncuestaTotal });
                this.setState({ Estado: EstadoEncuestaTotal });
                this.setState({ NombreCurso: NombreCursoTotal });

            });
    }
    onClick = (event) => {
        this.setState({ clickedPendiente: true, ind: event.target.value });
    };

    toggleModal = (event) => {

        if (event.target.value != undefined) {

            this.setState({ clicked: true, ind: event.target.value });

        }
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { NRC, Actividades, Descripcion, TipoEncuesta, Estado, ind, clicked, clickedPendiente, error } = this.state;
        if (Estado.length === 0) {
            setTimeout(() => {
                this.setState({ Estado: this.state.Estado })
                //this.setState({ Estado: this.state.Estado })
            }, 10);
        }
        return (
            <main>


                <div>

                    <div className="container-fluid table-responsive">

                        <br />
                        <h2 className="text-center">Estado de actividades:</h2>
                        <br />
                        <table className="table table-hover">
                            <thead>
                                <tr className="bg-primary" style={{ color: 'white' }}>
                                    <th>Curso</th>
                                    <th>Actividad</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.NombreCurso.map((cursos, index) =>
                                    <tr key={index} value={index}>
                                        <th>{cursos}</th>
                                        <th> {this.state.Actividades[index]}</th>
                                        <th> {Descripcion[index]}</th>
                                        {(Estado[index] === 'pendiente') ?
                                            <th>
                                                <button role="button" onClick={this.onClick} name="asd" value={index} className="btn btn-danger" style={{ color: 'white' }}>
                                                    {Estado[index]}
                                                </button>
                                            </th>
                                            :
                                            <div>
                                                {(Estado[index] === 'revisado') ?
                                                    <th><a role="button" className="btn btn-primary" style={{ color: 'white' }}>{Estado[index]}</a></th>
                                                    :
                                                    <th><button role="button" className="btn btn-secondary " value={index} onClick={this.toggleModal} style={{ color: 'white' }}>{Estado[index]}</button></th>
                                                }
                                            </div>
                                        }

                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                    {clicked &&
                        <div>

                            <ResultadosProfesor curso={this.props.curso} ind={this.state.ind} clicked={clicked} />
                        </div>
                    }
                </div>



            </main>
        );
    }
}
export default TablaProfesor;