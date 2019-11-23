import React, { Component } from "react";
import { db } from "../Firebase/firebase"

import Personalizada from '../Encuestas/Personalizada'
import E360 from "./E360";
import Resultados from './Resultados.js'
import ResultadosProfesor from "./ResultadosProfesor";
const INITIAL_STATE = {
    NRC: [],
    Actividades: [],
    Descripcion: [],
    NombreCurso: [],
    TipoEncuesta: [],
    Estado: [],
    idEstudiante: '',
    idEstudiantes: [],
    idProfesor: '',
    ind: 0,
    index: 0,
    clicked: false,
    changed: false,
    clickedPendiente: false,
    error: null,

};



class Tabla extends Component {


    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    componentDidMount() {
        const uid = sessionStorage.getItem("user");

        db.collection("usuarios").doc(uid).get().then(querySnapshot => {
            const user = querySnapshot.data();
            if (uid === user.email) {

                if (user.Profesor === "off") {
                    this.setState({ idEstudiante: uid });

                    db.collection("usuarios").doc(sessionStorage.getItem('user'))
                        .get()
                        .then(doc => {
                            const nrc = doc.data().cursos;
                            const nrcTotal = [];
                            const ActividadTotal = [];
                            const DescripcionTotal = [];
                            const TipoEncuestaTotal = [];
                            const EstadoEncuestaTotal = [];
                            var NombreCurso = [];
                            const TipoRespuestasTotal = [];
                            const NombreCursoTotal = [];
                            for (let i = 0; i < nrc.length; i++) {
                                db.collection('cursos').doc(nrc[i]).get().then(doc => {
                                    NombreCurso[i] = doc.data().NombreCurso;


                                    db.collection('cursos').doc(nrc[i]).collection('Actividades').get().then(act => {
                                        const Actividades = act.docs.map(doc => doc.data().nombreActividad);
                                        const Descripcion = act.docs.map(doc => doc.data().descripcion);
                                        const TipoEncuesta = act.docs.map(doc => doc.data().tipoEncuesta);
                                        for (let j = 0; j < Actividades.length; j++) {
                                            nrcTotal.push(nrc[i]);
                                            ActividadTotal.push(Actividades[j]);
                                            DescripcionTotal.push(Descripcion[j]);
                                            TipoEncuestaTotal.push(TipoEncuesta[j]);
                                            NombreCursoTotal.push(NombreCurso[i]);
                                            if (Actividades[j] != undefined) {
                                                db.collection('cursos').doc(nrc[i]).collection('Actividades').doc(Actividades[j]).collection('Estudiantes').doc(uid).get().then(querySnapshot => {
                                                    const estado = querySnapshot.data().estado;
                                                    EstadoEncuestaTotal.push(estado);
                                                })
                                            }
                                        }
                                    })
                                })
                            }
                            this.setState({ NRC: nrcTotal })
                            this.setState({ Actividades: ActividadTotal });
                            this.setState({ Descripcion: DescripcionTotal });
                            this.setState({ TipoEncuesta: TipoEncuestaTotal });
                            this.setState({ Estado: EstadoEncuestaTotal });
                            this.setState({ NombreCurso: NombreCursoTotal });

                        });
                } else {
                    this.setState({ idProfesor: uid });

                    db.collection("usuarios").doc(sessionStorage.getItem('user'))
                        .get()
                        .then(doc => {
                            const nrc = doc.data().cursos;
                            const nrcTotal = [];
                            const ActividadTotal = [];
                            const DescripcionTotal = [];
                            const TipoEncuestaTotal = [];
                            const EstadoEncuestaTotal = [];
                            var NombreCurso = [];
                            var idEstudiantes = [];
                            const TipoRespuestasTotal = [];
                            const NombreCursoTotal = [];
                            const idEstudiantesTotal = [];
                            var EstudiantesTotal = [];
                            for (let i = 0; i < nrc.length; i++) {
                                db.collection('cursos').doc(nrc[i]).get().then(doc => {
                                    NombreCurso[i] = doc.data().NombreCurso;
                                    idEstudiantes[i] = doc.data().idEstudiantes;


                                    for (let x = 0; x < idEstudiantes[i].length; x++) {
                                        db.collection('cursos').doc(nrc[i]).collection('Actividades').get().then(act => {
                                            const Actividades = act.docs.map(doc => doc.data().nombreActividad);
                                            const Descripcion = act.docs.map(doc => doc.data().descripcion);
                                            const TipoEncuesta = act.docs.map(doc => doc.data().tipoEncuesta);
                                            for (let j = 0; j < Actividades.length; j++) {
                                                nrcTotal.push(nrc[i]);
                                                ActividadTotal.push(Actividades[j]);
                                                DescripcionTotal.push(Descripcion[j]);
                                                TipoEncuestaTotal.push(TipoEncuesta[j]);
                                                NombreCursoTotal.push(NombreCurso[i]);

                                                EstudiantesTotal.push(idEstudiantes[i][x]);
                                                if (Actividades[j] != undefined) {

                                                    db.collection('cursos').doc(nrc[i]).collection('Actividades').doc(Actividades[j]).collection('Estudiantes').doc(idEstudiantes[i][x]).get().then(querySnapshot => {
                                                        const estado = querySnapshot.data().estado;
                                                        EstadoEncuestaTotal.push(estado);
                                                    })
                                                }
                                            }
                                        })
                                    }

                                })

                            }
                            this.setState({ idEstudiantes: EstudiantesTotal })
                            this.setState({ NRC: nrcTotal })
                            this.setState({ Actividades: ActividadTotal });
                            this.setState({ Descripcion: DescripcionTotal });
                            this.setState({ TipoEncuesta: TipoEncuestaTotal });
                            this.setState({ Estado: EstadoEncuestaTotal });
                            this.setState({ NombreCurso: NombreCursoTotal });
                        });

                }
            }
        });

    }
    onClick = (event) => {
        this.setState({ clickedPendiente: true, ind: event.target.value });
    };
    cambioEstado = (event) => {
        var Estado = this.state.Estado;
        Estado[event.target.value] = 'pendiente';
        this.setState({ Estado: Estado })
    }
    toggleModal = (event) => {

        if (event.target.value != undefined) {

            this.setState({ clicked: true, index: event.target.value, changed: !this.state.changed });
            if (this.state.idEstudiante != '') {
                this.setState({ ind: event.target.value });
            }
        }
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { NRC, Actividades, Descripcion, TipoEncuesta, changed, idProfesor, idEstudiantes, Estado, ind, clicked, clickedPendiente, error } = this.state;
        if (Estado.length === 0) {
            setTimeout(() => {
                this.setState({ Estado: this.state.Estado })
                //this.setState({ Estado: this.state.Estado })
            }, 10);
        }
        //        console.log(this.state.NRC)
        return (
            <main>
                {this.state.idEstudiante != "" ?
                    <div>
                        {clickedPendiente ?

                            <div>
                                {TipoEncuesta[ind] == "E360" ?
                                    <E360 NRC={NRC[ind]} Actividades={Actividades[ind]} />
                                    :
                                    <div>
                                        {TipoEncuesta[ind] == "Estandar" ?
                                            <E360 NRC={NRC[ind]} Actividades={Actividades[ind]} />
                                            :
                                            <div>
                                                {TipoEncuesta[ind] == "Liderazgo" ?
                                                    <E360 NRC={NRC[ind]} Actividades={Actividades[ind]} />
                                                    :
                                                    <div>
                                                        {TipoEncuesta[ind] == "Trabajo en equipo" ?
                                                            <E360 NRC={NRC[ind]} Actividades={Actividades[ind]} />
                                                            :
                                                            <div>
                                                                {TipoEncuesta[ind] == "Compromiso" ?
                                                                    <E360 NRC={NRC[ind]} Actividades={Actividades[ind]} />
                                                                    :
                                                                    <Personalizada NRC={NRC[ind]} Actividades={Actividades[ind]} TipoEncuesta={TipoEncuesta[ind]} />
                                                                }
                                                            </div>
                                                        }
                                                    </div>

                                                }
                                            </div>

                                        }
                                    </div>
                                }
                            </div>
                            :
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
                                                    {(Estado[index] == 'pendiente') ?
                                                        <th>
                                                            <button role="button" onClick={this.onClick} name="asd" value={index} className="btn btn-danger" style={{ color: 'white' }}>
                                                                {Estado[index]}
                                                            </button>
                                                        </th>
                                                        :
                                                        <div>
                                                            {(Estado[index] == 'revisado') ?
                                                                <th><button role="button" className="btn btn-primary " value={index} onClick={this.toggleModal} style={{ color: 'white' }}>{Estado[index]}</button></th>
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
                                        {this.state.Estado[ind] != 'revisado' && <button role="button" value={ind} className="btn btn-danger" style={{ color: 'white' }} onClick={this.cambioEstado}> Editar</button>
                                        } <Resultados ind={this.state.ind} clicked={clicked} />
                                    </div>
                                }
                            </div>
                        }
                    </div>
                    :
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
                                            <th>{this.state.idEstudiantes[index]}</th>
                                            {(Estado[index] === 'pendiente') ?
                                                <th>
                                                    <button role="button" className="btn btn-danger" style={{ color: 'white' }}>Pendiente</button>
                                                </th>
                                                :
                                                <div>
                                                    {(Estado[index] === 'revisado') ?
                                                        <th><a role="button" className="btn btn-primary" style={{ color: 'white' }}>Revisado</a></th>
                                                        :

                                                        <div>
                                                            {(Estado[index] === 'enviado') ?
                                                                <th><button role="button" className="btn btn-secondary " value={index} onClick={this.toggleModal} style={{ color: 'white' }}>Enviado</button></th>
                                                                :
                                                                <th>
                                                                    <button role="button" className="btn btn-danger" style={{ color: 'white' }}>Pendiente </button>
                                                                </th>
                                                            }</div>
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
                                <h3>{Actividades[this.state.index]}</h3>
                                {changed ?
                                    <ResultadosProfesor idEstudiante={this.state.idEstudiantes[this.state.index]} curso={NRC[ind]} actividad={Actividades[this.state.index]} idProfesor={idProfesor} clicked={clicked} actualizaciones={3} />
                                    :
                                    <ResultadosProfesor idEstudiante={this.state.idEstudiantes[this.state.index]} curso={NRC[ind]} actividad={Actividades[this.state.index]} idProfesor={idProfesor} clicked={clicked} actualizaciones={3} />
                                }
                            </div>
                        }
                    </div>}

            </main>
        );
    }
}
export default Tabla;