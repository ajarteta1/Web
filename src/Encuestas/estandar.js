import React, { Component } from 'react';
//import './e360.css'

const INITIAL_STATE = {
  estudiantes: ['pablo', 'federico', 'gustavo'],
  numero: '',
  puntualidad: [],
  aportes: [],
  compromiso: [],
  actitud: [],
  resultados: [],
  respuestas: [],
  targetp :[],
  targetap :[],
  targetc :[],
  targetac :[],
  rango: '',
};




class estandar extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    const { aportes, compromiso, actitud, puntualidad, estudiantes, resultados, rango, respuestas,targetp,
      targetap,
      targetc,
      targetac } = this.state;
    this.setState({ rango: event.target.value });
    if (event.target.name == 'puntualidad') {
      targetp[event.target.id] = event.target.value;
      console.log(puntualidad)
    } else {
      if (event.target.name == 'aportes') {
        targetap[event.target.id] = event.target.value;
        console.log(aportes)
      } else {
        if (event.target.name == 'compromiso') {
          targetc[event.target.id] = event.target.value;
          console.log(compromiso)
        } else {
          if (event.target.name == 'actitud') {
            targetac[event.target.id] = event.target.value;
            console.log(actitud)
          }
        }
      }
    }
    this.setState({puntualidad:targetp});
    this.setState({aportes:targetap});
    this.setState({compromiso:targetc});
    this.setState({actitud:targetac});
  };

  onSubmit = event => {
    const { aportes, compromiso, actitud, puntualidad, estudiantes, resultados, respuestas, } = this.state;
    for (let i = 0; i < 4; i++) {
      if (i == 0) {
        resultados.push(puntualidad);
      } else {
        if (i == 1) {
          resultados.push(aportes);
        } else {
          if (i == 2) {
            resultados.push(compromiso);
          } else {
            resultados.push(actitud);
          }
        }
      }
    }
    this.setState({ respuestas: resultados })
    console.log(respuestas,resultados);

  }



  render() {
    const { estudiantes, numero, puntualidad, index, valor, rango } = this.state;


    /*if (sessionStorage.length === 0) {
      window.location.href = "/login";
    }*/
    return (
      <section className="estandar" style={{ backgroundColor: 'black' }}>
        <br />
        <div className="container" style={{ borderRadius: '20px', backgroundColor: 'white', padding: '20px' }}>
          <h1 style={{ textAlign: 'center' }}>Encuesta estandar</h1>
          <hr />
          <br />
          <form>
            <h2>
              <label className="col-sm-12" style={{ textAlign: 'center' }}>Puntualidad</label>
            </h2>
            <div className="form-group row">
              <div className="container">
                <div className="row">
                  <label className="col-sm-8">Se ausentó de la sesión de trabajo, lo cual afectó el trabajo del equipo.</label>
                  <label className="col-sm">Necesita mejorar (2,9 ó menos)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">Llegó muy tarde</label>
                  <label className="col-sm">Adecuado (3,0 - 3,7)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">Llegó algo atrasado</label>
                  <label className="col-sm">Bueno (3,8 - 4,3)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">Acudió puntualmente a la sesión  de trabajo</label>
                  <label className="col-sm">Excelente (4,4 - 5,0)</label>
                </div>
              </div>
              <div className="form-grup-row">
                <div className="container">
                  {estudiantes.map((estudiante, index) =>
                    <div className="row" value={numero}>
                      <label className="col-sm" key={index} value={index}>{estudiante}</label>
                      <label className="col-sm-4" for="calificacion">Calificar</label>
                      <input className="col-sm-3" type="range" id={index} name={"puntualidad"} min="0" max="5" step="0.1"
                        onChange={this.onChange}
                      />
                      <label className="col-sm-2">{this.state.puntualidad[index]}</label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h2>
              <label className="col-sm-12" style={{ textAlign: 'center' }}>Aportes</label>
            </h2>
            <div className="form-group row">
              <div className="container">
                <div className="row">
                  <label className="col-sm-8">En todo momento estuvo como observador y no aportó al trabajo del equipo.</label>
                  <label className="col-sm">Necesita mejorar (2,9 ó menos)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">En algunas ocasiones participó dentro del equipo y en los intercambios generales.</label>
                  <label className="col-sm">Adecuado (3,0 - 3,7)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">Hizo varios aportes al equipo; sin embargo puede ser más crítico y propositivo.</label>
                  <label className="col-sm">Bueno (3,8 - 4,3)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">Sus aportes fueron muy acertados y enriquecieron en todo momento el trabajo del equipo.</label>
                  <label className="col-sm">Excelente (4,4 - 5,0)</label>
                </div>
              </div>
              <div className="form-grup-row">
                <div className="container">
                  {estudiantes.map((estudiante, index) =>
                    <div className="row" value={numero}>
                      <label className="col-sm" key={index} value={index}>{estudiante}</label>
                      <label className="col-sm-4" for="calificacion">Calificar</label>
                      <input className="col-sm-3" type="range" id={index} name={"aportes"} min="0" max="5" step="0.1"
                        onChange={this.onChange}
                      />
                      <label className="col-sm-2">{this.state.aportes[index]}</label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h2>
              <label className="col-sm-12" style={{ textAlign: 'center' }}>Compromiso</label>
            </h2>
            <div className="form-group row">
              <div className="container">
                <div className="row">
                  <label className="col-sm-8">Mostró poco compromiso con las tareas y roles asignados tanto por el profesor como por los miembros del equipo.</label>
                  <label className="col-sm">Necesita mejorar (2,9 ó menos)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">En algunos momentos observamos que su compromiso con el trabajo disminuyó, y le afectó para afrontar las tareas propuestas.</label>
                  <label className="col-sm">Adecuado (3,0 - 3,7)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">La mayor parte del tiempo asumió tareas con  responsabilidad y compromiso  pero pudo haber aportado más al trabajo del equipo.</label>
                  <label className="col-sm">Bueno (3,8 - 4,3)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">Mostró en todo momento un compromiso serio con las tareas asignadas y los roles que tuvo en el equipo. </label>
                  <label className="col-sm">Excelente (4,4 - 5,0)</label>
                </div>
              </div>
              <div className="form-grup-row">
                <div className="container">
                  {estudiantes.map((estudiante, index) =>
                    <div className="row" value={numero}>
                      <label className="col-sm" key={index} value={index}>{estudiante}</label>
                      <label className="col-sm-4" for="calificacion">Calificar</label>
                      <input className="col-sm-3" type="range" id={index} name={"compromiso"} min="0" max="5" step="0.1"
                        onChange={this.onChange}
                      />
                      <label className="col-sm-2">{this.state.compromiso[index]}</label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h2>
              <label className="col-sm-12" style={{ textAlign: 'center' }}>Actitud</label>
            </h2>
            <div className="form-group row">
              <div className="container">
                <div className="row">
                  <label className="col-sm-8">Mantuvo una actitud negativa hacia las actividades del taller y a las tareas del equipo.</label>
                  <label className="col-sm">Necesita mejorar (2,9 ó menos)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">En algunas oportunidades tuvo una actitud abierta y positiva; pero no lo suficiente para beneficiar significativamente el trabajo del equipo.   </label>
                  <label className="col-sm">Adecuado (3,0 - 3,7)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">La mayor parte del tiempo muestra apertura y  actitud positiva hacia el trabajo, pero puede ser más constante.     </label>
                  <label className="col-sm">Bueno (3,8 - 4,3)</label>
                </div>
                <div className="row">
                  <label className="col-sm-8">Su actitud es positiva y demuestra deseos de realizar el trabajo con calidad.</label>
                  <label className="col-sm">Excelente (4,4 - 5,0)</label>
                </div>
              </div>
              <div className="form-grup-row">
                <div className="container">
                  {estudiantes.map((estudiante, index) =>
                    <div className="row" value={numero}>
                      <label className="col-sm" key={index} value={index}>{estudiante}</label>
                      <label className="col-sm-4" for="calificacion">Calificar</label>
                      <input className="col-sm-3" type="range" id={index} name={"actitud"} min="0" max="5" step="0.1"
                        onChange={this.onChange}
                      />
                      <label className="col-sm-2">{this.state.actitud[index]}</label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
          <button className="btn btn-primary" onClick={this.onSubmit}>Enviar</button>
        </div>
        <br />
      </section>
    );
  }
}


export default estandar;