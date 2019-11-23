import React, { Component } from "react";
//import "./crearCurso.css";
import { crearCursos } from "../Firebase/firebase.js"

import { db } from "../Firebase/firebase"

const INITIAL_STATE = {
    NRC: '',
    nombreCurso: '',
    cursos: [],
    cursoCreado: false,
    cantidadGrupos: '',
    descripcion: '',
    idProfesor: '',
    cursos: '',
    error: null,
};
class crearCurso extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        db.collection("usuarios")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                for (let i = 0; i < data.length; i++) {
                    if (sessionStorage.getItem('user') === data[i].email && data[i].Profesor === "on") {
                        this.setState({ idProfesor: data[i].email });
                        this.setState({ cursos: data[i].cursos });

                    }
                }


            });
    }

    onSubmit = event => {
        const { NRC, nombreCurso, cantidadGrupos, descripcion, idProfesor, error } = this.state;
        if (NRC != '') {
            if (nombreCurso != '') {
                if (cantidadGrupos != '') {
                    if (descripcion != '') {
                        if (!this.state.cursos.includes(NRC)) {
                            event.preventDefault();
                            crearCursos(NRC, nombreCurso, cantidadGrupos, descripcion, idProfesor);
                            this.setState({ cursoCreado: true })
                        } else {
                            this.setState({ error: 'NRC existente' })
                            setTimeout(() => {
                                this.setState({ error: null });
                            }, 3000);
                        }
                    } else {
                        this.setState({ error: 'Falta llenar la cantidad de grupos' })
                        setTimeout(() => {
                            this.setState({ error: null });
                        }, 3000);
                    }
                } else {
                    this.setState({ error: 'Falta llenar la descripción' })
                    setTimeout(() => {
                        this.setState({ error: null });
                    }, 3000);
                }
            } else {
                this.setState({ error: 'Falta llenar el Nombre del curso' })
                setTimeout(() => {
                    this.setState({ error: null });
                }, 3000);
            }
        } else {
            this.setState({ error: 'Falta llenar el NRC' })
            setTimeout(() => {
                this.setState({ error: null });
            }, 3000);
        }
    };
    onChange = event => {

        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { NRC, nombreCurso, cantidadGrupos, descripcion, idProfesor, error } = this.state;
        return (
            <main>
                {
                    (this.state.idProfesor === '') ?
                        <div>
                            <h1>NO eres profesor</h1>
                        </div>
                        :
                        <section className="waves">
                            <br />
                            <div className=" container " >
                                <div className="col-sm-5 mx-auto">
                                    <div className="card" >
                                        <div className="card-header text-center" style={{ backgroundColor: '#0275d8', color: 'white' }}><h2>Crear curso</h2></div>
                                        <form form onSubmit={this.onSubmit} style={{ padding: '15px' }} >
                                            <div class="form-group  row">
                                                <label for="profesorEstatico" class="col-sm-4 col-form-label">Profesor</label>
                                                <div class="col-sm-8">
                                                    <input type="text" readOnly class="form-control-plaintext" id="profesorEstatico" defaultValue={idProfesor} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label for="nombreCurso">Nombre del curso</label>
                                                <input name="nombreCurso"
                                                    value={nombreCurso}
                                                    onChange={this.onChange}
                                                    type="text"
                                                    className="form-control"
                                                    id="nombreCurso"
                                                    placeholder="Ingresa Nombre" />
                                            </div>
                                            <div class="form-group">
                                                <label for="nrcCurso">NRC</label>
                                                <input name="NRC"
                                                    value={NRC}
                                                    onChange={this.onChange}
                                                    type="text"
                                                    class="form-control"
                                                    id="nrcCurso"
                                                    placeholder="NRC" />
                                            </div>
                                            <div class="form-group">
                                                <label for="grupos">Número de grupos</label>
                                                <input name="cantidadGrupos"
                                                    value={cantidadGrupos}
                                                    onChange={this.onChange}
                                                    type="number" max="50" class="form-control" id="grupo" placeholder="No Grupo" />
                                            </div>
                                            <div class="form-group ">
                                                <label for="descripcionCurso">Descripcón</label>
                                                <textarea name="descripcion"
                                                    value={descripcion}
                                                    onChange={this.onChange}
                                                    type="text"
                                                    className="form-control"
                                                    id="descripcionCurso"
                                                    aria-describedby="nrcHelp" />
                                                <small id="nrcHelp" className="form-text text-muted">Breve descripción de la asignatura</small>
                                            </div>
                                            <button type="button" onClick={this.onSubmit} class="btn btn-primary">Crear</button>
                                            {this.state.cursoCreado ?
                                                <div>
                                                    <br />
                                                    <span className="alert alert-success small" role="alert">Curso creado exitosamente
                                                {setTimeout(() => {
                                                        window.location.href = "dashboardP";
                                                    }, 2000)}</span>
                                                </div>
                                                :
                                                <div>
                                                    {
                                                        (error !== null) &&
                                                        <div>
                                                            <br />
                                                            <span className="alert alert-danger small" role="alert">{error}</span>
                                                        </div>

                                                    }
                                                </div>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </section>
                }
            </main>
        );
    }
}
export default crearCurso;