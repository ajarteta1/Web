import React, { Component } from "react";
import { db, subirEncuestaPersonalizada } from "../Firebase/firebase"
import ModalA from './ModalA.js'

const INITIAL_STATE = {
    nombreEncuesta: '',
    nombreEncuestaSelected: '',
    nombreEncuestas: [],
    preguntas: [""],
    preguntasEncuestas: [""],
    indicacionesEncuestas: [""],
    indicaciones: [""],
    respuestasEncuestas: [[""]],
    respuestas: [[""]],
    tipoRespuestasEncuestas: ["Seleccion unica"],
    tipoRespuestas: ["Seleccion unica"],
    indexPregunta: 0,
    save: false,
    saved: false,
    next: false,
    error: null,
    isOpen: false
};



class Encuestas extends Component {


    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    componentDidMount() {
        const uid = sessionStorage.getItem("user");

        db.collection('usuarios').doc(uid).collection('encuestas').get()
            .then(querySnapshot => {
                const encuestas = querySnapshot.docs.map(doc => doc.id);
                const indicaciones = querySnapshot.docs.map(doc => doc.data().indicaciones);
                const preguntas = querySnapshot.docs.map(doc => doc.data().preguntas);
                const respuestas = querySnapshot.docs.map(doc => doc.data().respuestas);
                const tipoRespuestas = querySnapshot.docs.map(doc => doc.data().tipoRespuestas);
                this.setState({ nombreEncuestas: encuestas });
                this.setState({ indicacionesEncuestas: indicaciones });
                this.setState({ preguntasEncuestas: preguntas });
                this.setState({ respuestasEncuestas: respuestas });
                this.setState({ tipoRespuestasEncuestas: tipoRespuestas });
            });

    }
    toggleModal = (event) => {
        if (event.target.value != "") {
        }
        this.setState({
            isOpen: !this.state.isOpen, save: false
        });
    }
    onClickSiguiente = (event) => {
        const i = this.state.indexPregunta;
        var valid = true;
        for (let j = 0; j < this.state.respuestas[i].length; j++) {
            if (this.state.respuestas[i][j] == "") {
                valid = false;
            }
        }
        if (this.state.preguntas[i] != "") {
            if (((valid && this.state.respuestas[i].length != 0) || this.state.tipoRespuestas[i] == "Ingresar texto")) {
                if (this.state.indexPregunta + 1 == this.state.preguntas.length) {
                    this.state.preguntas.push("");
                    this.state.indicaciones.push("");
                    this.state.respuestas.push([""]);
                    this.state.tipoRespuestas.push("Seleccion unica");
                    const preguntas = this.state.preguntas;
                    const tipoRespuestas = this.state.tipoRespuestas;
                    const respuestas = this.state.respuestas;
                    const indicaciones = this.state.indicaciones;
                    this.setState({ respuestas: respuestas })
                    this.setState({ tipoRespuestas: tipoRespuestas })
                    this.setState({ preguntas: preguntas })
                    this.setState({ indicaciones: indicaciones })
                }
                this.setState({ indexPregunta: this.state.indexPregunta + 1 });
            } else {
                this.setState({ error: 'Falta llenar las opciones de respuesta' })
                setTimeout(() => {
                    this.setState({ error: null });
                }, 3000);
            }
        } else {
            this.setState({ error: 'Falta llenar la pregunta' })
            setTimeout(() => {
                this.setState({ error: null });
            }, 3000);
        }

    };
    onClickAnterior = (event) => {
        if (this.state.indexPregunta > 0) {
            this.setState({ indexPregunta: this.state.indexPregunta - 1 });
        }
    };
    onClickAddPregunta = (event) => {
        const i = this.state.indexPregunta;
        var valid = true;
        for (let j = 0; j < this.state.respuestas[i].length; j++) {
            if (this.state.respuestas[i][j] == "") {
                valid = false;
            }
        }
        if (this.state.preguntas[i] != "") {
            if (((valid && this.state.respuestas[i].length != 0) || this.state.tipoRespuestas[i] == "Ingresar texto")) {
                if (this.state.preguntas.length > 0) {
                    this.state.preguntas.splice(i + 1, 0, "");
                    this.state.indicaciones.splice(i + 1, 0, "");
                    this.state.respuestas.splice(i + 1, 0, [""]);
                    this.state.tipoRespuestas.splice(i + 1, 0, "Seleccion unica");
                    const preguntas = this.state.preguntas;
                    const tipoRespuestas = this.state.tipoRespuestas;
                    const respuestas = this.state.respuestas;
                    const indicaciones = this.state.indicaciones;
                    this.setState({ respuestas: respuestas })
                    this.setState({ tipoRespuestas: tipoRespuestas })
                    this.setState({ preguntas: preguntas })
                    this.setState({ indicaciones: indicaciones })
                    this.setState({ indexPregunta: this.state.indexPregunta + 1 });
                    this.setState({ error: null });
                    this.setState({ save: false });
                    this.setState({ next: false });
                }
            } else {
                this.setState({ error: 'Falta llenar las opciones de respuesta' })
                setTimeout(() => {
                    this.setState({ error: null });
                }, 3000);
            }
        } else {
            this.setState({ error: 'Falta llenar la pregunta' })
            setTimeout(() => {
                this.setState({ error: null });
            }, 3000);

        }
    };
    onClickBorrar = (event) => {
        const i = this.state.indexPregunta;
        if (this.state.preguntas.length > 1) {

            this.state.preguntas.splice(i, 1);
            this.state.indicaciones.splice(i, 1);
            this.state.respuestas.splice(i, 1);
            this.state.tipoRespuestas.splice(i, 1);
            const preguntas = this.state.preguntas;
            const tipoRespuestas = this.state.tipoRespuestas;
            const respuestas = this.state.respuestas;
            const indicaciones = this.state.indicaciones;
            this.setState({ respuestas: respuestas })
            this.setState({ tipoRespuestas: tipoRespuestas })
            this.setState({ preguntas: preguntas })
            this.setState({ indicaciones: indicaciones })
            if (i > 0) {
                this.setState({ indexPregunta: this.state.indexPregunta - 1 });
            }
        }
    };
    cargarEncuesta = (event) => {
        if (event.target.name != " ") {
            this.setState({ nombreEncuesta: this.state.nombreEncuestas[event.target.value] });
            this.setState({ nombreEncuestaSelected: this.state.nombreEncuestas[event.target.value] });
            this.setState({ indicaciones: this.state.indicacionesEncuestas[event.target.value] });
            this.setState({ preguntas: this.state.preguntasEncuestas[event.target.value] });
            var respuestas = [];

            for (let i = 0; i < this.state.respuestasEncuestas[event.target.value].length; i++) {
                respuestas.push(this.state.respuestasEncuestas[event.target.value][i].split("¬¬"))

            }
            this.setState({ respuestas: respuestas });

            this.setState({ tipoRespuestas: this.state.tipoRespuestasEncuestas[event.target.value] });
        } else {
            this.setState({ indicaciones: [""] });
            this.setState({ preguntas: [""] });
            this.setState({ respuestas: [[""]] });
            this.setState({ indexPregunta: 0 });
            this.setState({ tipoRespuestas: ["Seleccion unica"] });

            this.setState({ nombreEncuesta: '' });
            this.setState({ nombreEncuestaSelected: '' });

        }
    }
    onClickAdd = (event) => {
        const respuesta = this.state.respuestas[this.state.indexPregunta];
        const respuestas = this.state.respuestas;
        respuesta.push("");
        respuestas[this.state.indexPregunta] = respuesta;
        this.setState({ respuestas: respuestas });

    };
    onClickSubstract = (event) => {
        if (this.state.respuestas[this.state.indexPregunta].length > 1) {
            const respuesta = this.state.respuestas[this.state.indexPregunta];
            const respuestas = this.state.respuestas;
            respuesta.pop();
            respuestas.push(respuesta);
            this.setState({ respuestas: respuestas });
        }
    };
    onChangePregunta = event => {
        this.state.preguntas[this.state.indexPregunta] = event.target.value;
        this.setState({ preguntas: this.state.preguntas });
    }
    onChangeIndicaciones = event => {
        this.state.indicaciones[this.state.indexPregunta] = event.target.value;
        this.setState({ indicaciones: this.state.indicaciones });
    }
    onChangeRespuesta = event => {
        const eventoDividido = event.target.name.split("^");
        const respuestas = this.state.respuestas;
        respuestas[eventoDividido[1]][eventoDividido[0]] = event.target.value;

        this.setState({ respuestas: respuestas });
    };
    onChangeRango = event => {
        const eventoDividido = event.target.name.split("^");
        const respuestas = this.state.respuestas;
        if (eventoDividido[0] == "Min") { respuestas[eventoDividido[1]][0] = event.target.value }
        if (eventoDividido[0] == "Max") { respuestas[eventoDividido[1]][1] = event.target.value };
        if (eventoDividido[0] == "Step") { respuestas[eventoDividido[1]][2] = event.target.value };


        this.setState({ respuestas: respuestas });

    };
    onChangeTipo = event => {
        if (event.target.value == "Rango numerico") {
            const respuestas = this.state.respuestas;
            const respuesta = ["", "", ""];
            respuestas[this.state.indexPregunta] = respuesta;
            this.setState({ respuestas: respuestas });
        } else {
            const respuestas = this.state.respuestas;
            const respuesta = [""];
            respuestas[this.state.indexPregunta] = respuesta;
            this.setState({ respuestas: respuestas });

        }
        this.state.tipoRespuestas[this.state.indexPregunta] = event.target.value;
        this.setState({ tipoRespuestas: this.state.tipoRespuestas });
    }
    onSubmit = event => {

        const i = this.state.indexPregunta;
        var valid = true;
        for (let j = 0; j < this.state.respuestas[i].length; j++) {
            if (this.state.respuestas[i][j] == "") {
                valid = false;
            }
        }
        if (this.state.preguntas[i] != "") {
            if (((valid && this.state.respuestas[i].length != 0) || this.state.tipoRespuestas[i] == "Ingresar texto")) {

                if (!this.state.save) {
                    this.setState({ save: true });
                    this.setState({ error: null })
                    this.setState({
                        isOpen: !this.state.isOpen
                    });
                }
            } else {
                this.setState({ error: 'Falta llenar las opciones de respuesta' })
                setTimeout(() => {
                    this.setState({ error: null });
                }, 3000);
            }
        } else {
            this.setState({ error: 'Falta llenar la pregunta' })
            setTimeout(() => {
                this.setState({ error: null });
            }, 3000);
        }

    }
    onChangeNombreEncuesta = event => {
        this.setState({ nombreEncuesta: event.target.value })
    }
    onSave = event => {

        if (this.state.nombreEncuestas.includes(this.state.nombreEncuesta) && this.state.nombreEncuestaSelected == '') {
            this.setState({ error: 'Ya posees una encuesta con ese nombre' })
            setTimeout(() => {
                this.setState({ error: null });
            }, 3000);
        } else {
            var respuesta = [];
            for (let K = 0; K < this.state.respuestas.length; K++) {
                var element = "";
                for (let j = 0; j < this.state.respuestas[K].length - 1; j++) {
                    element += this.state.respuestas[K][j] + "¬¬";
                }

                respuesta.push(element + "" + this.state.respuestas[K][this.state.respuestas[K].length - 1]);
            }
            subirEncuestaPersonalizada(sessionStorage.getItem('user'), this.state.nombreEncuesta, this.state.preguntas, this.state.indicaciones, respuesta, this.state.tipoRespuestas)

            this.setState({ saved: true });
        }
    }
    render() {
        const { idEstudiante, preguntas, resultados, indexPregunta, error, next, save } = this.state;

        const elements = this.state.respuestas[indexPregunta];
        const items = [];
        const itemsPreviewS = [];
        const itemsPreviewR = [];
        const itemsPreviewT = [];
        if (elements != undefined) {
            if (elements.length > 0) {
                if (this.state.tipoRespuestas[indexPregunta] == "Seleccion unica") {

                    for (let index = 0; index < elements.length; index++) {
                        items.push(
                            <div>
                                <input type="text" name={index + "^" + indexPregunta} id={index + "^" + indexPregunta} onChange={this.onChangeRespuesta} value={(elements[index] == "") ? "" : elements[index]} className="w-25" />
                            </div>
                        )

                        itemsPreviewS.push(

                            <label><input type="radio" name="optradio" />{elements[index]}</label>
                        )
                    }
                } else if (this.state.tipoRespuestas[indexPregunta] == "Rango numerico") {
                    items.push(
                        <div>
                            <input name={"Min^" + indexPregunta} placeholder={(elements[0] == "") && "Valor minimo"} value={(elements[0] == "") ? "" : (elements[0])} onChange={this.onChangeRango} />
                            <input name={"Max^" + indexPregunta} placeholder={(elements[1] == "") && "Valor maximo"} value={(elements[1] == "") ? "" : (elements[1])} onChange={this.onChangeRango} />
                            <input name={"Step^" + indexPregunta} placeholder={(elements[2] == "") && "Step"} value={(elements[2] == "") ? "" : (elements[2])} onChange={this.onChangeRango} />
                        </div>
                    )
                    itemsPreviewR.push(
                        <input className="col-sm" type="number" id={indexPregunta} min={elements[0]} max={elements[1]} step={elements[2]} />
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
            <main >

                <div className="container-fluid table-responsive">
                    <ul>
                        {this.state.nombreEncuestas.map((nombre, index) =>
                            <div>
                                {(nombre != 'E360') &&

                                    < li >
                                        {nombre}
                                        < button value={index} name={nombre} onClick={this.cargarEncuesta}>Editar</button>

                                    </li>
                                }
                            </div>
                        )}
                        <li> Crear encuesta<button value={" "} name={" "} onClick={this.cargarEncuesta}>Crear</button></li>

                    </ul>
                    <div >
                        <h1>{this.state.nombreEncuesta}</h1>
                        <input name="pregunta"
                            onChange={this.onChangePregunta}
                            type="text"
                            value={(this.state.preguntas[indexPregunta] == "") ? "" : this.state.preguntas[indexPregunta]}
                            placeholder={(this.state.preguntas[indexPregunta] == "") ? "Digite la pregunta" : this.state.preguntas[indexPregunta]}
                            required
                            autoFocus
                            id="pregunta" />
                    </div>

                    <div>
                        <label for="tipoRespuesta">Seleccione el tipo de respuesta</label>

                    </div>
                    <div>
                        <div>
                            <select name="tipoRespuesta" id="tipoRespuesta" value={this.state.tipoRespuestas[indexPregunta]} onChange={this.onChangeTipo}>
                                <option>Seleccion unica</option>
                                <option>Rango numerico</option>
                                <option>Ingresar texto</option>
                            </select>
                        </div>
                        <input name="indicaciones"
                            onChange={this.onChangeIndicaciones}
                            type="text"
                            value={(this.state.indicaciones[indexPregunta] == "") ? "" : this.state.indicaciones[indexPregunta]}
                            placeholder={(this.state.indicaciones[indexPregunta] == "") ? "Indicaciones" : this.state.indicaciones[indexPregunta]}
                            required
                            id="indicaciones" />

                        <div>


                            {this.state.tipoRespuestas[indexPregunta] == "Seleccion unica" ?

                                <div class="custom-control custom-radio custom-control-inline">
                                    <button onClick={this.onClickSubstract}>menos</button>
                                    {items}

                                    <button onClick={this.onClickAdd}>add</button>
                                </div>
                                :
                                <div>
                                    {this.state.tipoRespuestas[indexPregunta] == "Rango numerico" &&
                                        <div>
                                            {items}
                                        </div>
                                    }
                                </div>
                            }

                        </div>
                        <br />
                        <span>Preview</span>
                        <br />

                        <lable>{preguntas[indexPregunta]}</lable>
                        <br />
                        <lable>{this.state.indicaciones[indexPregunta]}</lable>
                        <br />
                        {this.state.tipoRespuestas[indexPregunta] == "Seleccion unica" &&
                            <div>
                                {itemsPreviewS}
                            </div>
                        }
                        {this.state.tipoRespuestas[indexPregunta] == "Rango numerico" &&
                            <div>
                                {itemsPreviewR}
                            </div>
                        }
                        {this.state.tipoRespuestas[indexPregunta] == "Ingresar texto" &&
                            <div>
                                {itemsPreviewT}
                            </div>
                        }
                    </div>



                    <br />
                    <div>
                        <button onClick={this.onClickBorrar}>borrar</button>
                        <button onClick={this.onClickAnterior}>ant</button>
                        <button onClick={this.onClickSiguiente}>sig</button>

                        <button onClick={this.onClickAddPregunta}>Add</button>
                    </div>
                    <div>
                        <span>{this.state.indexPregunta + 1}/{this.state.preguntas.length}</span>
                    </div>
                    {
                        (this.state.indexPregunta === this.state.preguntas.length - 1) &&
                        <button onClick={this.onSubmit}>Save</button>
                    }
                    {
                        save ?
                            <div>
                                <ModalA show={this.state.isOpen}
                                    onClose={this.toggleModal} >
                                    <input name="nombre"
                                        onChange={this.onChangeNombreEncuesta}
                                        type="text"
                                        value={(this.state.nombreEncuesta == "") ? "" : this.state.nombreEncuesta}
                                        placeholder={(this.state.nombreEncuesta == "") ? "Digite el nombre de la encuesta" : this.state.nombreEncuesta}
                                        required
                                        autoFocus
                                        id="nombre" />
                                    <button onClick={this.onSave}>Save</button>
                                    {
                                        (error != null) &&
                                        <div>
                                            <br />
                                            <span className="alert alert-danger small" role="alert">{error}</span>
                                        </div>
                                    }
                                    {
                                        (this.state.saved) &&
                                        <div>
                                            <br />
                                            <span className="alert alert-success small" role="alert">Guardando los cambio, sera redireccionado en 4 segundos</span>
                                            {setTimeout(() => {
                                                window.location.href = "/"
                                            }, 3000)}
                                        </div>
                                    }
                                </ModalA>
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

                </div >
            </main >
        );
    }
}


export default Encuestas