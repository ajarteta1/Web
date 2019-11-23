import React, { useEffect } from 'react';
import './App.css';
import Header from './Components/Header.js';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Components/Home.js';
import Login from './Components/Login.js';
import ForgotPassword from './Components/ForgotPassword.js';
import Upload from './Container/NewUpload.js';
import Actividades from './Components/Actividades/Actividades.js';
import Actividad from './Components/Actividades/Actividad.js';

//import E360 from './Components/E360';
import Register from './Components/Register.js';
import Estudiante from './Components/Estudiante.js';
import crearCurso from './Container/crearCurso.js';
import crearActividades from './Container/crearAcitivdad.js';
import ingresarCurso from './Container/ingresarCurso.js';
import Perfil from './Components/Perfil.js'
import Grupo from './Components/Grupo.js'
import Profesores from './Components/Profesor.js'
import E360 from './Components/E360.js'
import EncuestaPersonalizada from './Components/EncuestaPersonalizada.js'
import Personalizada from './Encuestas/Personalizada.js';
import ListarActividadesProfe from './Components/ListarActividadesProfe';

import { signout } from './Firebase/firebase.js'
import Profesor from './Components/Profesor.js';
import Resultados from './Components/Resultados';

function App() {
  const [isAuth, setIsAuth] = React.useState(false);
  useEffect(() => {
    const uid = sessionStorage.getItem("user");
    uid !== null && setIsAuth(true);
  }, [isAuth]);

  const setAuthentication = val => {
    if (!val) {
      //window.location.href = "/";
      signout();
      sessionStorage.clear();

    }
    //window.location.href = "/";
    setIsAuth(val);
  }

  return (
    <main>
      <BrowserRouter>
        <div>
          <Header />
          <div >
            <Route exact path="/" component={Home} />
  
            {isAuth ?


              <div>
 
                <Route exact path="/actividades" component={Actividades} />
                <Route exact path="/actividad" component={Actividad} />

                <Route exact path="/e360" component={E360} />
                <Route exact path="/dashboardE" component={Estudiante} />
                <Route exact path="/encuestaPersonalizada" component={EncuestaPersonalizada} />
                <Route exact path="/Personalizada" component={Personalizada}></Route>


                <Route exact path="/crearcurso" component={crearCurso} />
                <Route exact path="/crearActividad" component={crearActividades} />
                <Route exact path="/upload" component={Upload} />
                <Route exact path="/ingresarcurso" component={ingresarCurso} />
                <Route exact path="/perfil" component={Perfil} />
                <Route exact path="/dashboardp" component={Profesores} />
                <Route exact path="/Resultados" component={Resultados} />
                <Route exact path="/grupo" component={Grupo} />

              </div>
              :
              <div>
                <Route exact path="/login" component={Login} />
                <Route exact path="/forgotPassword" component={ForgotPassword} />
                <Route exact path="/register" component={Register} />
              </div>
            }
          </ div>

        </div>
      </BrowserRouter>



    </main>
  );
}

export default App;
