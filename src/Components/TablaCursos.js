import React, { Component } from "react";
import ModalA from './ModalA.js'
import { db } from '../Firebase/firebase.js'
import ResultadosProfesor from "./ResultadosProfesor.js";
import TablaProfesor from "./TablaProfesor.js";
const INITIAL_STATE = {
    NRC: [],
    claves: [],
    nombreCurso: [],
    cursosGrupos: [],
    grupos: [],
    cursosGruposEstudiantes: [],
    cursosGruposNombresEstudiantes: [],
    gruposEstudiantes: [],
    gruposEstudiantesNombre: [],
    idEstudiante: '',
    id: '',
    ind: '',
    clicked: false,
    error: null,
    isOpen: false

};
class TablaCursos extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }



    componentDidMount() {
        const uid = sessionStorage.getItem("user");
        db.collection("usuarios").doc(uid).get().then(querySnapshot => {
            const user = querySnapshot.data();
            if (uid === user.email && user.Profesor === "off") {
                this.setState({ idEstudiante: uid });
            }
        });
        db.collection("usuarios").doc(sessionStorage.getItem('user'))
            .get()
            .then(doc => {
                const nrc = doc.data().cursos;
                const cursos = [];
                const claves = [];
                const grupos = [];
                const estudiantesGrupos = [];
                const nombresEstudiantesGrupos = [];
                for (let i = 0; i < nrc.length; i++) {
                    const gruposCurso = [];
                    const estudiantesGruposCurso = [];
                    db.collection('cursos').doc(nrc[i]).get().then(data => {
                        cursos.push(data.data().NombreCurso);
                        claves.push(data.data().contraseña);
                    })
                    db.collection('cursos').doc(nrc[i]).collection('Grupos').get().then(querySnapshot => {
                        const listaGrupos = querySnapshot.docs.map(doc => doc.id);
                        const listaEstudiantes = querySnapshot.docs.map(doc => doc.data().idEstudiantes);
                        gruposCurso.push(listaGrupos);

                        for (let j = 0; j < listaGrupos.length; j++) {
                            const arr = [];
                            for (let k = 0; k < listaEstudiantes[j].length; k++) {
                                db.collection('usuarios').doc(listaEstudiantes[j][k]).get().then(doc => {
                                    arr.push(doc.data().name + " " + doc.data().apellido)
                                })
                            }
                            estudiantesGruposCurso.push([listaEstudiantes[j], arr]);

                        }
                    })
                    grupos.push(gruposCurso);
                    estudiantesGrupos.push(estudiantesGruposCurso);
                }
                this.setState({ claves: claves })
                this.setState({ NRC: nrc })
                this.setState({ cursosGrupos: grupos })
                //                this.setState({ cursosGruposNombresEstudiantes: nombresEstudiantesGrupos })
                this.setState({ nombreCurso: cursos });


                this.setState({ cursosGruposEstudiantes: estudiantesGrupos })


            });
    }

    toggleModal = (event) => {
        if (event.target.value != "") {
            if (this.state.ind != event.target.value) {


                const grupos = this.state.cursosGrupos[event.target.value];
                const estudiantes = this.state.cursosGruposEstudiantes[event.target.value];
                const nombresEstudiantes = this.state.cursosGruposNombresEstudiantes[event.target.value];
                this.setState({ gruposEstudiantes: estudiantes })
                this.setState({ gruposEstudiantesNombre: nombresEstudiantes })
                this.setState({ grupos: grupos, ind: event.target.value })
            } else {
                this.setState({ gruposEstudiantes: [] })
                this.setState({ gruposEstudiantesNombre: [] })
                this.setState({ grupos: [], ind: "" })

            }
        }

    }



    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { NRC, nombreCurso, cursosGruposEstudiantes, grupos, gruposEstudiantes, error } = this.state;
        if (nombreCurso.length === 0) {
            setTimeout(() => {
                this.setState({ nombreCurso: this.state.nombreCurso })
                //this.setState({ Estado: this.state.Estado })
            }, 10);
        } else {
            if (grupos.length === 0) {
                setTimeout(() => {
                    this.setState({ grupos: this.state.grupos })
                    //this.setState({ Estado: this.state.Estado })
                }, 10);
            } else {
                if (gruposEstudiantes.length === 0) {
                    setTimeout(() => {
                        this.setState({ gruposEstudiantes: this.state.gruposEstudiantes })
                        //this.setState({ Estado: this.state.Estado })
                    }, 10);
                }
            }
        }
        var e = [];

        for (let i = 0; i < gruposEstudiantes.length; i++) {
            var g = [];

            for (let j = 0; j < gruposEstudiantes[i][0].length; j++) {
                g.push(
                    <tr>
                        <td>
                            {gruposEstudiantes[i][1][j]}
                        </td>
                        <td>
                            {gruposEstudiantes[i][0][j]}
                        </td>

                    </tr>
                )

            }
            e.push(
                g
            )

        }

        return (
            <main>
                <div className="container-fluid table-responsive">
                    <br />
                    <h2 className="text-center">Lista de cursos:</h2>
                    <br />
                    <table className="table table-hover " style={{ border: '1px solid #ccc' }}>
                        <thead>
                            <tr className="bg-primary" style={{ color: 'white' }}>
                                <th>NRC</th>
                                <th>Nombre del Curso</th>
                                <th>Listado de Grupos</th>
                                <th>Contraseña</th>
                            </tr>
                        </thead>
                        <tbody>
                            {NRC.map((cursos, index) =>
                                <tr key={index} value={index}>
                                    <th>{cursos}</th>
                                    <th> {nombreCurso[index]}</th>
                                    <th>
                                        <button role="button" onClick={this.toggleModal} name="asd" value={index} className="btn btn-primary" style={{ color: 'white' }}>
                                            ver
                                        </button>
                                    </th>
                                    <th>
                                        {this.state.claves[index]}
                                    </th>
                                </tr>
                            )}
                        </tbody>

                    </table>


                    <h1>{nombreCurso[this.state.ind]}</h1>
     
                    {gruposEstudiantes.map((gruposEstudiantes, inde) => (
                        <div>

                            <h4>Grupo {grupos[0][inde]}</h4>

                            <table className="table table-hover " style={{ border: '1px solid #ccc' }}>
                                <thead>
                                    <tr className="bg-primary" style={{ color: 'white' }}>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {e[inde]}
                                </tbody>
                            </table>
                        </div>
                    ))}

                </div>
            </main>







        );



    }




}


export default TablaCursos;