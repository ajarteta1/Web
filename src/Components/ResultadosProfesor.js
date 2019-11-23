import React, { Component } from "react";
import { db } from "../Firebase/firebase"

import ModalA from "./ModalA.js";
import CanvasJSReact from './canvasjs.react';
import Estudiantes from "./Estudiante";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const INITIAL_STATE = {
    NRC: [],
    uid: '',
    Actividades: [],
    Descripcion: [],
    TipoEncuesta: [],
    Resultados: [],
    ResultadosDeOtros: [],
    Preguntas: [],
    NombreCurso: [],
    TipoRespuestas: [],
    ResultadosActividad: [],
    idEstudiante: '',
    Estudiantes: [],
    EstudiantesActividad: [],
    Estado: [],
    idEstudiante: '',
    ind: 0,
    clicked: true,
    error: null,
    clicked: false,
    error: null,
    isOpen: false,
    actualizaciones: 2
};



class ResultadosProfesor extends Component {


    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

    }

    componentDidMount() {
        var actualizaciones=this.state.actualizaciones;
        this.setState({actualizaciones:this.props.actualizaciones-1})
        const uid = this.props.idEstudiante;
        const curso = this.props.curso;
        const actividad = this.props.actividad;
        this.state.clicked = this.props.clicked;
        var idProfesor = this.props.idProfesor;
        var NombreCurso = [];


        const nrcTotal = [];
        const ActividadTotal = [];
        const DescripcionTotal = [];
        const TipoEncuestaTotal = [];
        const EstadoEncuestaTotal = [];
        const EstudiantesTotal = [];
        const ResultadosTotal = [];
        const ResultadosDeOtrosTotal = [];
        const PreguntasTotal = [];
        const TipoRespuestasTotal = [];
        const idProfesorTotal = [];
        const NombreCursoTotal = [];


        db.collection('cursos').doc(curso).collection('Actividades').get().then(act => {
            const Actividades = act.docs.map(doc => doc.data().nombreActividad);
            const Descripcion = act.docs.map(doc => doc.data().descripcion);
            const TipoEncuesta = act.docs.map(doc => doc.data().tipoEncuesta);
            const Preguntas = act.docs.map(doc => doc.data().preguntas);
            for (let j = 0; j < Actividades.length; j++) {
                if (actividad == Actividades[j]) {
                    ActividadTotal.push(Actividades[j]);
                    DescripcionTotal.push(Descripcion[j]);
                    TipoEncuestaTotal.push(TipoEncuesta[j]);
                    NombreCursoTotal.push(NombreCurso);
                    db.collection('usuarios').doc(idProfesor).collection('encuestas').doc(TipoEncuesta[j]).get().then(doc => {

                        if (doc.exists) {
                            const TipoRespuestas = doc.data().tipoRespuestas;
                            const preguntas = doc.data().preguntas;
                            TipoRespuestasTotal.push(TipoRespuestas);
                            PreguntasTotal.push(preguntas)
                        } else {
                            TipoRespuestasTotal.push([""]);
                            PreguntasTotal.push(Preguntas[j])
                        }
                    })
                    db.collection('cursos').doc(curso).collection('Actividades').doc(Actividades[j]).collection('Estudiantes').doc(uid).get().then(querySnapshot => {
                        const estado = querySnapshot.data().estado;
                        EstadoEncuestaTotal.push(estado);
                    })
                    db.collection('cursos').doc(curso).collection('Actividades').doc(Actividades[j]).collection('Estudiantes').doc(uid).collection('Resultados').get().then(querySnapshot => {
                        const Estudiantes = querySnapshot.docs.map(doc => doc.id)
                        const EstudiantesNombre = [];
                        const Resultados = querySnapshot.docs.map(doc => doc.data().resultados);
                        ResultadosTotal.push(Resultados)
                        const ResultadosDeOtrosGrupo = [];

                        for (let k = 0; k < Estudiantes.length; k++) {
                            db.collection('usuarios').doc(Estudiantes[k]).get().then(est => {
                                EstudiantesNombre.push(est.data().name + " " + est.data().apellido);
                            })

                            db.collection('cursos').doc(curso).collection('Actividades').doc(Actividades[j]).collection('Estudiantes').doc(Estudiantes[k]).collection('Resultados').doc(uid).get().then(querySnapshot => {
                                if (querySnapshot.exists) {
                                    const ResultadosDeOtros = querySnapshot.data().resultados;
                                    ResultadosDeOtrosGrupo.push(ResultadosDeOtros)
                                } else {
                                    var ResultadosVacios = [];
                                    for (let l = 0; l < Preguntas.length; l++) {
                                        ResultadosVacios.push(" ");
                                    }
                                    ResultadosDeOtrosGrupo.push(ResultadosVacios)

                                }
                            })
                        }
                        ResultadosDeOtrosTotal.push(ResultadosDeOtrosGrupo);
                        EstudiantesTotal.push(EstudiantesNombre);
                    })
                }
            }
        })


        this.setState({ NRC: curso })
        this.setState({ uid: uid })
        this.setState({ Actividades: ActividadTotal });
        this.setState({ Descripcion: DescripcionTotal });
        this.setState({ TipoEncuesta: TipoEncuestaTotal });
        this.setState({ Estado: EstadoEncuestaTotal });
        this.setState({ Estudiantes: EstudiantesTotal });
        this.setState({ Preguntas: PreguntasTotal });
        this.setState({ Resultados: ResultadosTotal });
        this.setState({ ResultadosDeOtros: ResultadosDeOtrosTotal });
        this.setState({ TipoRespuestas: TipoRespuestasTotal });
        this.setState({ NombreCurso: NombreCursoTotal });
        if (this.props.ind != this.state.ind) {
            setTimeout(() => {

                this.setState({ ind: this.props.ind, clicked: this.props.clicked })
            }, 1000);
        }
    }
    onClick = (event) => {


        this.setState({ clicked: true, ind: event.target.value });
    };


    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    toggleModal = (event) => {
        if (event.target.value != undefined) {

            this.setState({ clicked: true, ind: event.target.value });

        }
    }
    render() {
        const { NRC, NombreCurso, Actividades, Descripcion, TipoEncuesta, Estado, uid, clicked, error } = this.state;
        //  console.log(this.props.actividad , Actividades , this.props.idEstudiante , uid)
        setTimeout(() => {
            if ((this.props.actividad != Actividades || this.props.idEstudiante != uid) && this.state.actualizaciones > 0) {
                this.setState({ actualizaciones: this.state.actualizaciones - 1 })
                this.componentDidMount();

            }
        }, 20)

        var elementsResultados = this.state.Resultados[0];
        if (elementsResultados == undefined) {
            elementsResultados = this.state.Resultados;
        }
        var elementsResultadosDeOtros = this.state.ResultadosDeOtros[0];
        if (elementsResultadosDeOtros == undefined) {
            elementsResultadosDeOtros = this.state.ResultadosDeOtros;
        }

        var elementsEstudiantes = this.state.Estudiantes[0];
        if (elementsEstudiantes == undefined) {
            elementsEstudiantes = this.state.Estudiantes;
        }

        var elementsPreguntas = this.state.Preguntas[0];
        if (elementsPreguntas == undefined) {
            elementsPreguntas = this.state.Preguntas;
        }

        var elementsTipoRespuestas = this.state.TipoRespuestas[0];
        if (elementsTipoRespuestas == undefined) {
            elementsTipoRespuestas = this.state.TipoRespuestas;
        }

        var elementsTipoEncuesta = this.state.TipoEncuesta[0];
        if (elementsTipoEncuesta == undefined) {
            elementsTipoEncuesta = this.state.TipoEncuesta;
        }

        var items = [];
        var itemsResultadosDeOtros = [];
        var itemsHeaderResultadosDeOtros = [];
        var itemsHeader = [];
        var data1 = [];
        var data2 = [];
        if (elementsResultados != undefined) {
            if (elementsEstudiantes != undefined) {
                if (elementsPreguntas != undefined) {

                    if (elementsPreguntas.length > 0) {
                        if (elementsResultados.length > 0) {
                            if (elementsEstudiantes.length > 0) {
                                var dataEstudiante = [];
                                var dataEstudianteDeOtros = [];
                                var dataPregunta = [];
                                itemsHeader.push(<thead>
                                    <tr>
                                        <th>
                                            {" "}
                                        </th>
                                        <th colspan={elementsEstudiantes.length}>
                                            {"Respuestas dadas por el estudiante"}
                                        </th>
                                        {(elementsResultadosDeOtros != undefined) && (elementsResultadosDeOtros.length > 0) &&
                                            <th colspan={elementsEstudiantes.length}>
                                                {"Resultados recibidos por el estudiante"}
                                            </th>
                                        }
                                    </tr>
                                    <tr>
                                        <th>Preguntas </th>
                                        {elementsEstudiantes.map((est, index) =>
                                            <th scope="col">{est}</th>
                                        )}


                                        {elementsEstudiantes.map((est, index) =>
                                            <th scope="col">
                                                {(elementsResultadosDeOtros != undefined) && (elementsResultadosDeOtros.length > 0) &&
                                                    est
                                                }
                                            </th>
                                        )}



                                    </tr>
                                </thead>);

                                for (let i = 0; i < elementsPreguntas.length; i++) {

                                    for (let j = 0; j < elementsEstudiantes.length; j++) {
                                        dataEstudiante[j] = elementsResultados[j][i]
                                        dataEstudianteDeOtros[j] = elementsResultadosDeOtros[j][i]



                                    }

                                    dataPregunta[i] = elementsPreguntas[i];
                                    items.push(
                                        <tr>
                                            <th scope="row">{dataPregunta[i]}</th>
                                            {dataEstudiante.map((resultados, index) =>
                                                <td>
                                                    {resultados}
                                                </td>
                                            )}
                                            {dataEstudianteDeOtros.map((resultados, index) =>
                                                <td>
                                                    {(elementsResultadosDeOtros != undefined) && (elementsResultadosDeOtros.length > 0) &&

                                                        resultados
                                                    }
                                                </td>

                                            )}
                                        </tr>
                                    );

                                }


                                for (let j = 0; j < elementsEstudiantes.length; j++) {
                                    var dataPoints = [];
                                    if (elementsTipoEncuesta == 'E360' || elementsTipoEncuesta == 'Liderazgo' || elementsTipoEncuesta == 'Trabajo en equipo' || elementsTipoEncuesta == 'Compromiso' || elementsTipoEncuesta == 'Estandar') {

                                        for (let i = 0; i < Math.trunc(elementsPreguntas.length / 2); i++) {

                                            dataPoints[i] = { x: i, y: parseInt(elementsResultados[j][i]), label: elementsPreguntas[i] }

                                        }
                                        data1[j] = {
                                            showInLegend: true, name: elementsEstudiantes[j], dataPoints
                                        };

                                        var dataPoints = [];

                                        for (let i = Math.trunc(elementsPreguntas.length / 2); i < elementsPreguntas.length; i++) {

                                            dataPoints[i - (Math.trunc(elementsPreguntas.length / 2))] = { x: i, y: parseInt(elementsResultados[j][i]), label: elementsPreguntas[i] }
                                        }

                                        data2[j] = {
                                            showInLegend: true, name: elementsEstudiantes[j], dataPoints
                                        }

                                    } else {

                                        if (elementsTipoRespuestas != undefined) {
                                            if (elementsTipoRespuestas.length > 0) {

                                                for (let i = 0; i < elementsEstudiantes.length; i++) {
                                                    var valid = true;
                                                    for (let k = 0; k < elementsResultados.length; k++) {
                                                        if (!/^([0-9])*$/.test(elementsResultados[k][i])) {
                                                            valid = false;
                                                        }
                                                    }
                                                    if ((elementsTipoRespuestas[i] == 'Seleccion unica' && valid) || elementsTipoRespuestas[i] == 'Rango numerico') {
                                                        dataPoints[i] = { x: i, y: parseInt(elementsResultados[j][i]), label: elementsPreguntas[i] }
                                                    } else {

                                                    }
                                                }
                                                data1[j] = {
                                                    showInLegend: true, name: elementsEstudiantes[j], dataPoints
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    setTimeout(() => {
                        this.setState({ Preguntas: this.state.Preguntas })
                    }, 10)
                }
            } else {
                setTimeout(() => {
                    this.setState({ Estudiantes: this.state.Estudiantes })
                }, 10)
            }
        } else {
            setTimeout(() => {
                this.setState({ Resultados: this.state.Resultados })
            }, 10)
        }
        const options1 = {
            title: {
                text: this.state.TipoEncuesta[0]
            },

            legend: {
                reversed: true,
                verticalAlign: "center",
                horizontalAlign: "right"
            },
            axisX: {
                titleFontFamily: "comic sans ms",
                labelAngle: 0,
            },
            data: data1
        }
        const options2 = {
            title: {
                text: 'Preguntas desde la ' + Math.trunc(elementsPreguntas.length / 2) + ' hasta la ' + elementsPreguntas.length
            },

            legend: {
                reversed: true,
                verticalAlign: "center",
                horizontalAlign: "right"
            },
            axisX: {
                title: "X Axis Title",
                titleFontFamily: "comic sans ms",
                labelAngle: 0,
            },
            data: data2
        }
        return (
            <main>

                <div className="container-fluid table-responsive">
                    <div style={{ marginTop: "5%" }}>
                        <div class="row">

                            <table class="table table-bordered">

                                {itemsHeader}

                                <tbody>
                                    {items}
                                </tbody>
                            </table>

                            <table class="table table-bordered">

                                {itemsHeaderResultadosDeOtros}

                                <tbody>
                                    {itemsResultadosDeOtros}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </main >
        );
    }
}
export default ResultadosProfesor;
