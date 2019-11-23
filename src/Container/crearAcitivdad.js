import React, { Component } from 'react';
import '../index.css'
import { db, crearActividades } from "../Firebase/firebase"

const INITIAL_STATE = {
    idProfesor: '',
    Profesor: [],
    NRC: [],
    NRCSelected: '',
    cursoSelected: '',
    nombreCurso: [],
    idEstudiantes: [],
    idEstudiantesSelected: '',
    nombreActividad: '',
    Descripcion: '',
    tipoEncuesta: 'E360',
    tiposEncuesta: [],
    index: '0',
    actividadCreada: false,
    error: null,
};


class crearActividad extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        const uid = sessionStorage.getItem("user");
        db.collection("usuarios").doc(uid).get().then(querySnapshot => {
            const user = querySnapshot.data();
            if (uid === user.email && user.Profesor === "on") {
                this.setState({ Profesor: user });
                this.setState({ idProfesor: uid });
                db.collection("usuarios").doc(uid).collection('encuestas').get().then(encuestas => {
                    const encuesta = encuestas.docs.map(doc => doc.id);
                    this.setState({ tiposEncuesta: encuesta })
                })
            }

        });
        db.collection("cursos").where('idProfesor', '==', sessionStorage.getItem('user'))
            .get()
            .then(querySnapshot => {
                const nrc = querySnapshot.docs.map(doc => doc.id); //NRC DE CADA CURSO
                const cursos = querySnapshot.docs.map(doc => doc.data().NombreCurso);
                const idestudiantes = querySnapshot.docs.map(doc => doc.data().idEstudiantes);
                this.setState({ NRC: nrc });
                this.setState({ nombreCurso: cursos });
                this.setState({ idEstudiantes: idestudiantes });
                this.setState({ NRCSelected: this.state.NRC[this.state.index] });
                this.setState({ cursoSelected: this.state.nombreCurso[this.state.index] });
                this.setState({ idEstudiantesSelected: this.state.idEstudiantes[this.state.index] });
            });

    }

    onSubmit = event => {
        const { idProfesor, NRCSelected, index, cursoSelected, idEstudiantesSelected, nombreActividad, Descripcion, tipoEncuesta, actividadCreada, error } = this.state;
        event.preventDefault();
        if (nombreActividad !== '') {
            if (Descripcion !== '') {
                if (!actividadCreada) {
                    this.setState({ actividadCreada: true });
                    this.setState({ error: null })
                    setTimeout(() => {
                        this.setState({ actividadCreada: false });
                    }, 3000);

                }
                crearActividades(NRCSelected, nombreActividad, cursoSelected, tipoEncuesta, Descripcion, idEstudiantesSelected);
            } else {
                this.setState({ error: 'Falta llenar la Descripcion' })
                setTimeout(() => {
                    this.setState({ error: null });
                }, 3000);
            }
        } else {
            this.setState({ error: 'Falta llenar el Nombre de la actividad' })
            setTimeout(() => {
                this.setState({ error: null });
            }, 3000);
        }
    };
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeCurso = event => {
        this.setState({ NRCSelected: this.state.NRC[event.target.value] });
        this.setState({ cursoSelected: this.state.nombreCurso[event.target.value] });
        this.setState({ idEstudiantesSelected: this.state.idEstudiantes[event.target.value] });

    };
    render() {
        const { idProfesor, NRC, nombreCurso, index, idEstudiantes, nombreActividad, Descripcion, tiposEncuesta, tipoEncuesta, actividadCreada, error, cursoSelected, Profesor } = this.state;
        return (

            <main >
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
                                        <div className="card-header text-center" style={{ backgroundColor: '#0275d8', color: 'white' }}><h2>Crear actividad</h2></div>
                                       <div className="card-body">
                                        <div class="form-group row">
                                            <label for="idProfesor" class="col-sm-4 col-form-label">Nombre Profesor</label>
                                            <div class="col-sm-8">
                                                <input type="text" readonly class="form-control-plaintext" value={Profesor.name + " " + Profesor.apellido} />
                                                <input type="text" readonly class="form-control-plaintext" id="idProfesor" value={Profesor.email} />
                                            </div>
                                        </div>
                                        <div class="form-group" >
                                            <label for="nombreCurso">Seleccione curso</label>
                                            <select className="form-control" id="index" name="index"
                                                onChange={this.onChangeCurso}>
                                                {NRC.map((cursos, index) =>
                                                    <option key={index} value={index}>{cursos + " " + nombreCurso[index]}
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                        <div class="form-group ">
                                            <label for="nombreActividad">Nombre de la actividad</label>
                                            <input name="nombreActividad"
                                                defaultValue=""
                                                onChange={this.onChange}
                                                type="text"
                                                className="form-control"
                                                id="nombreActividad"
                                                aria-describedby="nrcHelp" />
                                            <small id="nrcHelp" className="form-text text-muted">Nombre de la actividad</small>
                                        </div>
                                        <div class="form-group ">
                                            <label for="Descripcion">Descripcón</label>
                                            <textarea name="Descripcion"
                                                defaultValue=""
                                                onChange={this.onChange}
                                                type="text"
                                                className="form-control"
                                                id="Descripcion"
                                                aria-describedby="nrcHelp" />
                                            <small id="nrcHelp" className="form-text text-muted">Breve descripción de la actividad</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="tipoEncuesta">Seleccione el tipo de encuesta</label>
                                            <select class="form-control" name="tipoEncuesta" id="tipoEncuesta" value={tipoEncuesta} onChange={this.onChange}>
                                                <option >Estandar</option>
                                                <option>Liderazgo</option>
                                                <option>Trabajo en equipo</option>
                                                <option>Compromiso</option>
                                                {this.state.tiposEncuesta.map((tipoEncuesta, index) =>
                                                    <option>{tipoEncuesta}</option>
                                                )}

                                            </select>
                                        </div>
                                        <button type="submit" onClick={this.onSubmit} class="btn btn-primary">Crear</button>
                                        {actividadCreada ?
                                            <div>
                                                <br />
                                                <span className="alert alert-success small" role="alert">La actividad "{nombreActividad}" fue creada exitosamente
                                                {setTimeout(() => {
                                                    window.location.href = "dashboardP";
                                                }, 2000)}</span>
                                            </div>
                                            :
                                            <div>
                                                {
                                                    (error !== null) ?
                                                        <div>
                                                            <br />
                                                            <span className="alert alert-danger small" role="alert">{error}</span>
                                                        </div>
                                                        :
                                                        <div></div>
                                                }
                                            </div>
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                }
            </main>
        );
    }
}

export default crearActividad;
