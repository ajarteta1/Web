import React, { Component } from 'react';
import './estudiantes.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import TablaCursos from './TablaCursos';
import ListarActividadesProfe from './ListarActividadesProfe';
import Encuestas from './Encuestas';
const INITIAL_STATE = {
  clicked: 'cursos',

};
class Profesor extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onClick = (event) => {
    this.setState({ clicked: event.target.value });
  };
  render() {
    return (
      <main>
        <div className="d-flex" id="wrapper">


          <div className="bg-light border-right" id="sidebar-wrapper">
            <div className="sidebar-heading" ><strong>Dashboard</strong><button className="btn" id="menu-toggle"></button> </div>

            <div className="list-group list-group-flush">
              <button href="/#" value={'cursos'} onClick={this.onClick} className="list-group-item list-group-item-action bg-light"><FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px' }} />Mis Cursos</button>
              <a href="/crearcurso" className="list-group-item list-group-item-action bg-light"  ><FontAwesomeIcon icon={faBookOpen} style={{ marginRight: '10px' }} />Crear curso</a>
              <button className="list-group-item list-group-item-action bg-light" value={'resultados'} onClick={this.onClick}><FontAwesomeIcon icon={faTasks} style={{ marginRight: '10px' }} />Actividades</button>
              <a href="/crearActividad" className="list-group-item list-group-item-action bg-light"><FontAwesomeIcon icon={faChartBar} style={{ marginRight: '10px' }} />Crear actividad</a>
              <button href="/#" value={'encuestas'} onClick={this.onClick} className="list-group-item list-group-item-action bg-light"><FontAwesomeIcon icon={faTasks} style={{ marginRight: '10px' }} />Mis encuestas</button>


            </div>

          </div>

          <div id="page-content-wrapper">


            <div className="container-fluid">
              {this.state.clicked == 'cursos' &&
                <TablaCursos />
              }
              {this.state.clicked == 'resultados' &&
                <ListarActividadesProfe />
              }
              {this.state.clicked == 'encuestas' &&
                <Encuestas />
              }
            </div>
          </div>


        </div>


      </main>

    );

  }



}

export default Profesor