import React, { Component } from "react";
import { db, llenarResultadosEstudiante } from "../Firebase/firebase"
import { Card } from "@material-ui/core";


const INITIAL_STATE = {
  NRC: '',
  Actividades: '',
  idEstudiante: [],
  nombreEstudiante: [],
  selectedOption: [],
  preguntas: ["¿Tiene actitud postiva?",
    "¿Resulta agradable trabajar con el/ella?",
    '¿Tiene iniciativa?',
    '¿Es capaz de poner en marcha nuevas ideas aunque no sean suyas?',
    '¿Motiva a su equipo?',
    '¿Sabe trabajar bajo presión?',
    '¿Sabe trata a su equipo?',
    '¿Transmite claramente sus expectativas sobre el trabajo de su equipo?',
    '¿Define claramente las responsabilidades de los subordinados?',
    '¿Cumple plazos y objetivos?',
    '¿Se responsabiliza de los resultados de su trabajo?',
    '¿Puede manejar varias tareas al mismo tiempo?',
    '¿Tiene sentido de la prioridad?',
    '¿Utiliza su tiempo de forma eficiente?',
    '¿Confronta situaciones de conflicto de forma directa y honesta?',
    '¿Busca la forma de mejorar el servicio a los clientes?',
    '¿Busca la forma de mejorar el servicio a los clientes?',
    '¿Se comunica con los clientes internos de una forma clara y sincera?',
    '¿Busca la forma de mejorar el servicio a los clientes?',
    '¿Se centra en la prioridades de los clientes?',
    '¿Establece una buena relación con los clientes actuales y potenciales?',
    '¿Da a los clientes máxima prioridad?',
    '¿Se comunica con los clientes de forma directa y sincera?',
    '¿Escucha sin interrumpir?',
    '¿Consulta otros puntos de vista?',
    '¿Tiene sentido del humor?',
    '¿Comparte la informacion con otros?',
    '¿Escucha las ideas y sugerencias de otros?',
    '¿Se comunica de una forma clara y sincera?',
    '¿Tiene una imagen profesional?',
    '¿Acepta la critica constructiva?'],
  resultados: [],
  indexPregunta: 0,
  error: null,
  clicked: false,

};



class E360 extends Component {


  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  componentDidMount() {
    const uid = sessionStorage.getItem("user");
    this.setState({ NRC: this.props.NRC, Actividades: this.props.Actividades })



    db.collection("cursos").doc(this.props.NRC).collection('Grupos')
      .get()
      .then(doc => {
        const grupos = doc.docs.map(doc => doc.data());
        const ResultadosTotal = [];
        for (let i = 0; i < grupos.length; i++) {
          if (grupos[i].idEstudiantes.includes(uid)) {
            const est = [];

            for (let index = 0; index < grupos[i].idEstudiantes.length; index++) {
              db.collection('usuarios').doc(grupos[i].idEstudiantes[index]).get().then(doc => {

                est.push(doc.data().name + " " + doc.data().apellido)
              })
              db.collection('cursos').doc(this.props.NRC).collection('Actividades').doc(this.props.Actividades).collection('Estudiantes').doc(uid).collection('Resultados').doc(grupos[i].idEstudiantes[index]).get().then(doc => {
                if (!doc.exists) {

                  const selectedResultados = [];

                  for (let j = 0; j < this.state.preguntas.length; j++) {
                    const selected = [];
                    for (let k = 0; k < grupos[i].idEstudiantes.length; k++) {
                      selected.push(0);
                    }
                    selectedResultados.push(selected);
                  }

                  this.setState({ resultados: selectedResultados })
                } else {
                  ResultadosTotal[index] = doc.data().resultados;
                }
              })
            }

            this.setState({ nombreEstudiante: est })

            this.setState({ idEstudiante: grupos[i].idEstudiantes })


          }
        }
        console.log(ResultadosTotal)
        if (ResultadosTotal.length != 0) {
          this.setState({ resultados: ResultadosTotal })
        }
      });
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
    const { NRC, Actividades, idEstudiante, preguntas, resultados, indexPregunta, error, } = this.state;
    if (this.state.indexPregunta === this.state.preguntas.length - 1) {

      for (let i = 0; i < resultados[0].length; i++) {
        const element = [];
        for (let j = 0; j < resultados.length; j++) {
          element.push(resultados[j][i]);
        }
        llenarResultadosEstudiante(sessionStorage.getItem('user'), idEstudiante[i], NRC, Actividades, element, this.state.preguntas)
        db.collection('cursos').doc(NRC).collection('Actividades').doc(Actividades).collection('Estudiantes').doc(sessionStorage.getItem('user')).get().then(querySnapshot => {
          const estado = querySnapshot.data().estado;
          if (estado == 'enviado') {
            window.location.href = "/dashboardE"
          }
        })
      }
    }
  }
  render() {
    const { NRC, Actividades, idEstudiante, preguntas, resultados, indexPregunta, error, } = this.state;

    if (this.state.nombreEstudiante.length == 0) {
      setTimeout(() => {
        this.setState({ nombreEstudiante: this.state.nombreEstudiante })
        //this.setState({ Estado: this.state.Estado })
      }, 10);
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
                    <br />

                    {idEstudiante.map((estudiante, index) =>
                      <form>
                        <div className="form-group">

                          <div className="col-sm-6">
                            <label>{this.state.nombreEstudiante[index]}</label>
                          </div>



                          <div className="col-sm-8" onChange={this.onChange} >

                            <div className="custom-control custom-radio custom-control-inline">
                              <input name={index + "^" + indexPregunta} id={"radio" + index + "_0"} type="radio" className="custom-control-input" value="1" checked={resultados[indexPregunta][index] === '1'} />
                              <label for={"radio" + index + "_0"} className="custom-control-label">1</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input name={index + "^" + indexPregunta} id={"radio" + index + "_1"} type="radio" className="custom-control-input" value="2" checked={resultados[indexPregunta][index] === '2'} />
                              <label for={"radio" + index + "_1"} className="custom-control-label">2</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input name={index + "^" + indexPregunta} id={"radio" + index + "_2"} type="radio" className="custom-control-input" value="3" checked={resultados[indexPregunta][index] === '3'} />
                              <label for={"radio" + index + "_2"} className="custom-control-label">3</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input name={index + "^" + indexPregunta} id={"radio" + index + "_3"} type="radio" className="custom-control-input" value="4" checked={resultados[indexPregunta][index] === '4'} />
                              <label for={"radio" + index + "_3"} className="custom-control-label">4</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input name={index + "^" + indexPregunta} id={"radio" + index + "_4"} type="radio" className="custom-control-input" value="5" checked={resultados[indexPregunta][index] === '5'} />
                              <label for={"radio" + index + "_4"} className="custom-control-label">5</label>
                            </div>

                          </div>
                        </div>
                      </form>
                    )}


                  </div>
                  {(this.state.indexPregunta > 0) ?
                    <button className="btn btn-primary" role="button" onClick={this.onClickAnterior}>Anterior</button>
                    :
                    <button className="btn btn-secondary" disabled role="button" onClick={this.onClickAnterior}>Anterior</button>
                  }
                  {(this.state.indexPregunta === this.state.preguntas.length - 1) ?
                    <button className="btn btn-primary" role="button" onClick={this.onSubmit}>Save</button>
                    :
                    <button className="btn btn-primary" role="button" onClick={this.onClickSiguiente}>Siguiente</button>

                  }

                </div >

              </div>
            </div>
          </div>

        }

      </main>
    );
  }
}


export default E360;



/*

      <section className="E360" style={{ backgroundColor: 'black' }}>
        <br />
        <div className="container" style={{ borderRadius: '20px', backgroundColor: 'white', padding: '20px' }}>
          <h1 style={{ textAlign: 'center' }}>Encuesta de evaluacion 360º</h1>
          <hr />
          <br />
          <form>

            <div className="form-group row">
              <label for="select1" className="col-sm-4 col-sm-form-label">Nombre de la persona a Evaluar:</label>
              <div className="col-sm-6">
                <select id="select1" name="select1" className="custom-select">
                  <option value="Friend1">Compañero1</option>
                  <option value="Friend2">Compañero2</option>
                  <option value="Friend3">Compañero3</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-4">Relación con el evaluado</label>
              <div className="col-sm-8">
                <div className="custom-control custom-radio custom-control-inline">
                  <input name="radio" id="radio_0" type="radio" className="custom-control-input" value="Friend" />
                  <label for="radio_0" className="custom-control-label">Colega/Compañero</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input name="radio" id="radio_1" type="radio" className="custom-control-input" value="Leader" />
                  <label for="radio_1" className="custom-control-label">Líder del Equipo</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input name="radio" id="radio_2" type="radio" className="custom-control-input" value="coleader" />
                  <label for="radio_2" className="custom-control-label">Colider del Equipo</label>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label for="select" className="col-sm-4 col-form-label">¿Con que frecuencia Interactua con esta persona?</label>
              <div className="col-sm-6">
                <select id="select" name="select" className="custom-select">
                  <option value="daily">A diario</option>
                  <option value="weekly">Algunas veces por semana</option>
                  <option value="Monthly">Algunas veces al mes</option>
                </select>
              </div>
            </div>


            <div className="form-group row">
              <label className="col-sm-4">¿Como evaluaría la labor de esta persona en conjunto?</label>
              <div className="col-sm-7">
                <div className="custom-control custom-radio custom-control-inline">
                  <input name="radio1" id="radio1_0" type="radio" className="custom-control-input" value="5" />
                  <label for="radio1_0" className="custom-control-label">Excelente</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input name="radio1" id="radio1_1" type="radio" className="custom-control-input" value="4" />
                  <label for="radio1_1" className="custom-control-label">Muy buena</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input name="radio1" id="radio1_2" type="radio" className="custom-control-input" value="3" />
                  <label for="radio1_2" className="custom-control-label">Buena</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input name="radio1" id="radio1_3" type="radio" className="custom-control-input" value="2" />
                  <label for="radio1_3" className="custom-control-label">Mediocre</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input name="radio1" id="radio1_4" type="radio" className="custom-control-input" value="1" />
                  <label for="radio1_4" className="custom-control-label">Insuficiente</label>
                </div>
              </div>
            </div>
*/