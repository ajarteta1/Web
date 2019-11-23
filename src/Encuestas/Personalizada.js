import React, { Component } from "react";
import { db, CargarPersonalizada, llenarResultadosEstudiante } from "../Firebase/firebase"


const INITIAL_STATE = {
    NRC: '',
    Actividades: '',
    idEstudiante: [],
    nombreEstudiante: [],
    selectedOption: [],
    preguntas: [""],
    indicaciones: [],
    respuestas: [],
    tipoRespuestas: [],
    resultados: [],
    indexPregunta: 0,
    error: null,
    clicked: false,
    cargado: false,
    editando: false,
};



class Personalizada extends Component {


    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    componentDidMount() {

        async function Cargar(that) {
            let message = '';
            try {
                message = await CargarPersonalizada(that.props)
                console.log(message)
                that.setState(message)

            }
            catch (error) {

            }

        }

        Cargar(this);

    }

    onClickSiguiente = (event) => {
        const validar = this.state.resultados[this.state.indexPregunta];
        if (!validar.includes(0)) {
            if (this.state.indexPregunta < this.state.preguntas.length - 1) {
                this.setState({ indexPregunta: this.state.indexPregunta + 1, clicked: false });

            }
        } else {
            this.setState({ clicked: true });

        }
    };
    onClickAnterior = (event) => {

        if (this.state.indexPregunta > 0) {
            this.setState({ indexPregunta: this.state.indexPregunta - 1 });
        }
    };
    onChange = event => {

        const eventoDividido = event.target.name.split("^");
        const resultado = this.state.resultados;

        const indexEstudiante = parseInt(eventoDividido[0]);
        const indexPreguntas = parseInt(eventoDividido[1]);

        resultado[indexPreguntas][indexEstudiante] = event.target.value;

        this.setState({ resultados: resultado })
    };
    onSubmit = event => {
        const { NRC, Actividades, idEstudiante, preguntas, resultados, tipoRespuestas, error, } = this.state;
        if (this.state.indexPregunta === this.state.preguntas.length - 1) {

            for (let i = 0; i < resultados[0].length; i++) {
                const element = [];
                for (let j = 0; j < resultados.length; j++) {
                    element.push(resultados[j][i]);
                }
                llenarResultadosEstudiante(sessionStorage.getItem('user'), idEstudiante[i], NRC, Actividades, element)

                db.collection("cursos").doc(this.props.NRC).collection('Actividades').doc(this.props.Actividades).collection('Estudiantes').doc(sessionStorage.getItem('user'))
                    .get().then(doc => {
                        if (doc.data().estado == "enviado") {
                            window.location.href = '/dashboardE'
                        }
                    })

            }
        }
    }
    render() {
        const { NRC, Actividades, idEstudiante, preguntas, resultados, indexPregunta, error, } = this.state;
    //    console.log(this.state)
        if (!this.state.cargado) {
            if (resultados.length === 0) {
                setTimeout(() => {
                    this.setState({ resultados: this.state.resultados })
                    //this.setState({ Estado: this.state.Estado })
                }, 10);
            } else {
                setTimeout(() => {
                    if (this.state.resultados[0] != undefined) {
                        if (this.state.resultados[0][0] != undefined) {

                            if (this.state.editando) {
                                this.setState({ editando: false })
                                var resultados = [];


                                for (let y = 0; y < this.state.resultados[0].length; y++) {
                                    var resultadosy = [];
                                    for (let x = 0; x < this.state.resultados.length; x++) {
                                        resultadosy[x] = this.state.resultados[x][y]
                                    }

                                    resultados.push(resultadosy);
                                }
                                this.setState({ resultados: resultados, cargado: true });
                            }
                        }
                    }
                }, 20)
            }
        }

        const elements = this.state.respuestas[indexPregunta];
        const items = [];
        const itemsPreviewS = [];
        const itemsPreviewR = [];
        const itemsPreviewT = [];
        if (elements != undefined) {
            if (elements.length > 0) {
                if (this.state.tipoRespuestas[indexPregunta] == "Seleccion unica") {

                } else if (this.state.tipoRespuestas[indexPregunta] == "Rango numerico") {
                    itemsPreviewR.push(
                        <input className="col-sm" type="number" id={indexPregunta} name={0 + "^" + indexPregunta} min={elements[0]} max={elements[1]} step={elements[2]} />
                    )
                } else {
                    itemsPreviewT.push(
                        <input
                            type="text"
                            placeholder="Espacio para respuesta escrita"
                            required
                            autoFocus />
                    )
                }
            }
        }

        return (
            <main>
                {(resultados.length != 0) &&
                    <div className="container">
                        <br />
                        <div className="col-md-12 mx-auto">
                            <div className="card">
                                <div className="card-header text-center" style={{ backgroundColor: '#0275d8', color: 'white' }}><h2>Encuesta</h2></div>
                                <div className="card-body">

                                    <div className="form-group">
                                        <label className="col-sm-13"><h3>{preguntas[indexPregunta]}</h3></label>
                                        {this.state.resultados[this.state.indexPregunta].includes(0) && this.state.clicked &&
                                            <div>

                                                <span className="alert alert-danger small" role="alert">
                                                    Por favor califique a todos sus compañeros </span>


                                            </div>
                                        }
                                        <div>

                                            <div className="col-sm-8">
                                                < div className="form-group row">
                                                    {idEstudiante.map((estudiante, index) =>
                                                        <form >


                                                            <div className="col-sm-8" onChange={this.onChange} >
                                                                {(elements != undefined) &&
                                                                    <div >
                                                                        {(elements.length > 0) && (this.state.tipoRespuestas[indexPregunta] == "Seleccion unica") &&
                                                                            <div >
                                                                                {this.state.nombreEstudiante[index]}

                                                                                {elements.map((elemento, i) =>

                                                                                    <div className="custom-control custom-radio custom-control-inline">
                                                                                        <input name={index + "^" + indexPregunta} id={index + "^" + i + "^" + indexPregunta} type="radio" className="custom-control-input" value={elements[i]} checked={resultados[indexPregunta][index] === elements[i]} />
                                                                                        <label for={index + "^" + i + "^" + indexPregunta} className="custom-control-label">{elements[i]}</label>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        }
                                                                        {(this.state.tipoRespuestas[indexPregunta] == "Rango numerico") &&
                                                                            <div>
                                                                                {estudiante}
                                                                                <input className="custom-control-inline col-sm-6 " type="number" id={index + "^" + indexPregunta} name={index + "^" + indexPregunta} value={resultados[indexPregunta][index]} min={elements[0]} max={elements[1]} step={elements[2]} />
                                                                            </div>
                                                                        }
                                                                        {(this.state.tipoRespuestas[indexPregunta] == "Ingresar texto") &&
                                                                            <div>
                                                                                {estudiante}
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Espacio para respuesta escrita"
                                                                                    required
                                                                                    autoFocus
                                                                                    id={index + "^" + indexPregunta} name={index + "^" + indexPregunta} value={resultados[indexPregunta][index]}
                                                                                />
                                                                            </div>
                                                                        }
                                                                    </div>}

                                                            </div>
                                                        </form>
                                                    )}
                                                </div>
                                            </div>


                                        </div >

                                        <button className="btn btn-primary" onClick={this.onClickAnterior}>Anterior</button>
                                        <button className="btn btn-primary" onClick={this.onClickSiguiente}>Siguiente</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    (this.state.indexPregunta === this.state.preguntas.length - 1) ?
                        <button onClick={this.onSubmit}>Save</button>
                        :
                        <div></div>
                }

            </main >
        );
    }
}


export default Personalizada;