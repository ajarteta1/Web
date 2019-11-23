import React, { Component } from 'react';
import './estudiantes.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import Tabla from './Table.js'


class Estudiantes extends Component {



  render() {
    return (
      <main>
        <div class="d-flex" id="wrapper">


          <div class="bg-light border-right" id="sidebar-wrapper">
            <div class="sidebar-heading" ><strong>Dashboard</strong><button class="btn" id="menu-toggle"></button> </div>

            <div class="list-group list-group-flush">
              <a href="/grupo" class="list-group-item list-group-item-action bg-light"><FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px' }} />Mi grupo</a>
              <a href="/ingresarcurso" class="list-group-item list-group-item-action bg-light"><FontAwesomeIcon icon={faBookOpen} style={{ marginRight: '10px' }} />Ingresar a curso</a>
              <a href="#" class="list-group-item list-group-item-action bg-light"><FontAwesomeIcon icon={faTasks} style={{ marginRight: '10px' }} />Actividades</a>

            </div>

          </div>

          <div id="page-content-wrapper">


            <div class="container-fluid">
              <Tabla />
              
            </div>
          </div>


        </div>


      </main>






    );

  }



}

export default Estudiantes