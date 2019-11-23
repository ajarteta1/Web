import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
//import process from '../.env';
const app = {
/*  storageBucket: "peer-evaluation-747fc.appspot.com",
  apiKey: process.env.APP_APIKEY,
  authDomain: process.env.APP_AUTHDOMAIN,
  databaseURL: process.env.APP_DATABASEURL,
  projectId: process.env.APP_PROJECTID,
  messagingSenderId: process.env.APP_MESSAGINGSENDERID,
  appId: process.env.APP_APPID,
  measurementId: process.env.APP_MEASUREMENTID  
*/};
console.log(process.env.APP_APIKEY)
firebase.initializeApp(app);

const auth = firebase.auth();
export const db = firebase.firestore();
let cursos = {
  NombreCurso: '',
  cantidadGrupos: 0,
  Descripcion: '',
  idProfesor: '',
  contraseña: '',
  idEstudiantes: []
};
let grupos = {
  idEstudiantes: []
};


//escritura de datos
let preguntasE360 = ["¿Tiene actitud postiva?",
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
  '¿Acepta la critica constructiva?'];
export const writeUserData = (email, name, apellido, esProfesor) => {
  db.collection("usuarios").doc(email).get().then(doc => {
    if (!doc.exists) {
      if (esProfesor === "on") {

        db.collection('usuarios').doc(email).collection('encuestas').doc('E360').set({ preguntas: preguntasE360 });
        db.collection("usuarios").doc(email).set({
          name: name,
          apellido: apellido,
          email: email,
          Profesor: esProfesor,
          cursos: [],
        });
        db.collection("usuarios").doc(email).get().then(valid => {
          if (valid.exists) {
            window.location.href = "/";
          }
        });
        return true;
      } else {
        db.collection("usuarios").doc(email).set({
          name: name,
          apellido: apellido,
          email: email,
          Profesor: esProfesor,
          cursos: [],
        });
        db.collection("usuarios").doc(email).get().then(valid => {
          if (valid.exists) {
            window.location.href = "/";
          }
        });
        return true;
      }
    } else {
      console.log('Usuario ya creado');
      return false;
    }
  })
    .catch(err => {
      console.log('Error getting document', err);
      return false;
    });
}

export const subirEncuestaPersonalizada = (idProfesor, nombreEncuesta, preguntas, indicaciones, respuestas, tipoRespuestas) => {
  db.collection('usuarios').doc(idProfesor).collection('encuestas').doc(nombreEncuesta).set({ preguntas: preguntas, indicaciones: indicaciones, respuestas: respuestas, tipoRespuestas: tipoRespuestas });
}

export const llenarResultadosEstudiante = (idEstudiante, idEstudianteEvaluado, NRC, actividad, resultados) => {
  db.collection('cursos').doc(NRC).collection('Actividades').doc(actividad).collection('Estudiantes').doc(idEstudiante).collection('Resultados').doc(idEstudianteEvaluado).set(
    { resultados: resultados });
  db.collection('cursos').doc(NRC).collection('Actividades').doc(actividad).collection('Estudiantes').doc(idEstudiante).set(
    { estado: 'enviado' })
}
export const llenarCursoEstudiante = (idEstudiante, NRCs) => {
  db.collection("usuarios").doc(idEstudiante).update({ cursos: NRCs });
}
export const llenarCurso = (NRC, idGrupo, idEstudiante, idgrupos, grupoEstudiante, listaEstudiante) => {

  db.collection("cursos").doc(NRC).get().then(doc => {
    if (doc.exists) {
      db.collection("cursos").doc(NRC).collection("Grupos").doc(idGrupo).get().then(grupo => {
        if (grupo.exists) {

          db.collection('cursos').doc(NRC).collection("Grupos").doc(idGrupo).set({ idEstudiantes: grupoEstudiante })
        } else {
          var grupoEstudianteInexistente = [];
          grupoEstudianteInexistente.push(idEstudiante);
          db.collection('cursos').doc(NRC).collection("Grupos").doc(idGrupo).set({ idEstudiantes: grupoEstudianteInexistente })
        }
      });
      db.collection('cursos').doc(NRC).update({ idEstudiantes: listaEstudiante })
      db.collection('cursos').doc(NRC).collection('Actividades').get().then(act => {
        if (act.size !== 0) {
          const Actividades = act.docs.map(doc => doc.data().nombreActividad);
          for (let j = 0; j < Actividades.length; j++) {
            db.collection('cursos').doc(NRC).collection('Actividades').doc(Actividades[j]).collection('Estudiantes').doc(idEstudiante).set(
              { estado: 'pendiente' }
            )
          }
        }
      })
    } else {
      console.log("no existe ese curso");
    }
  });

}
export const comentario = (idEstudiante, nrc, actividad, comentario) => {
  db.collection('cursos').doc(nrc).collection('Actividades').doc(actividad).collection('Estudiantes').doc(idEstudiante).update({ estado: 'revisado', comentario: comentario });

}
export const crearCursos = (NRC, NombreCurso, cantidadGrupos, Descripcion, idProfesor, cursosProfesor) => {
  cursos.NombreCurso = NombreCurso;
  cursos.cantidadGrupos = cantidadGrupos;
  cursos.Descripcion = Descripcion;
  cursos.idProfesor = idProfesor;
  //llenar info del profesor, osea agregarle a su info el NRC actual del curso
  db.collection("cursos").doc(NRC).get().then(doc => {
    if (!doc.exists) {
      //generador de contraseña
      var result = '';
      var chars = '0ABC1DEF2GHI3JKL4MNO5PQR6STU7VWX8YZ9';
      for (var i = 5; i > 0; --i) {
        result += chars[Math.round(Math.random() * (chars.length - 1))];
      }
      cursos.contraseña = result;
      db.collection("cursos").doc(NRC).set(cursos);
      let query = db.collection("usuarios").doc(idProfesor).get()
        .then(docs => {
          let cursosProfesor = docs.data().cursos;
          cursosProfesor.push(NRC)
          db.collection("usuarios").doc(idProfesor).update({ cursos: cursosProfesor })
        })
        .catch(err => {
          console.log('Error getting documents:  ', err);
        });
      db.collection("cursos").doc(NRC).get().then(valid => {
        if (valid.exists) {
          window.location.href = "/dashboardp";
        }
      });
      return true;
    }
  })
    .catch(err => {
      console.log('Error getting document', err);
      return false;
    });

}

export const crearActividades = (NRC, nombreActividad, nombreCurso, tipoEncuesta, Descripcion, idEstudiantes) => {
  //lenar info del estudiante
  db.collection("cursos").doc(NRC).get().then(doc => {
    if (doc.exists) {
      db.collection("cursos").doc(NRC).collection("Actividades").doc(nombreActividad).get().then(actividad => {

        if (!actividad.exists) {
          db.collection("cursos").doc(NRC).collection("Actividades").doc(nombreActividad).set({ nombreActividad: nombreActividad, tipoEncuesta: tipoEncuesta, descripcion: Descripcion, preguntas: [] });
          console.log(idEstudiantes);
          if (idEstudiantes != '') {
            for (let i = 0; i < idEstudiantes.length; i++) {
              db.collection("cursos").doc(NRC).collection("Actividades").doc(nombreActividad).collection("Estudiantes").doc(idEstudiantes[i]).set({ resultados: [], estado: 'pendiente' });
            }
          } else {
            db.collection("cursos").doc(NRC).collection("Actividades").doc(nombreActividad);
          }
        } else {
          console.log("error, ya existe esta actividad")
        }
      });
    } else {
      console.log("no existe ese curso");
    }
  });

}
var data = [];
//Lectura de datos

export const CargarPersonalizada = (props) => {
  const STATE = {
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

  const promise = new Promise((resolve, reject) => {
    const uid = sessionStorage.getItem("user");
    STATE.NRC = props.NRC
    STATE.Actividades = props.Actividades
    STATE.TipoEncuesta = props.TipoEncuesta
    const ResultadosTotal = [];
    db.collection("cursos").doc(props.NRC).get().then(doc => {

      const idProfesor = doc.data().idProfesor;
      db.collection('usuarios').doc(idProfesor).collection('encuestas').doc(props.TipoEncuesta).get().then(querySnapshot => {
        const indicaciones = querySnapshot.data();
        const preguntas = querySnapshot.data().preguntas;
        const tipoRespuestas = querySnapshot.data().tipoRespuestas;
        const respuestas = querySnapshot.data().respuestas;
        const respuesta = [];
        for (let index = 0; index < respuestas.length; index++) {
          respuesta.push(respuestas[index].split("¬¬"))
        }
        STATE.indicaciones = indicaciones
        STATE.preguntas = preguntas
        STATE.tipoRespuestas = tipoRespuestas
        STATE.respuestas = respuesta
        db.collection("cursos").doc(props.NRC).collection('Grupos')
          .get()
          .then(doc => {
            const grupos = doc.docs.map(doc => doc.data());
            for (let i = 0; i < grupos.length; i++) {
              if (grupos[i].idEstudiantes.includes(uid)) {
                const est = [];

                for (let index = 0; index < grupos[i].idEstudiantes.length; index++) {
                  db.collection('usuarios').doc(grupos[i].idEstudiantes[index]).get().then(doc => {

                    est.push(doc.data().name + " " + doc.data().apellido)
                  })
                  db.collection('cursos').doc(props.NRC).collection('Actividades').doc(props.Actividades).collection('Estudiantes').doc(uid).collection('Resultados').doc(grupos[i].idEstudiantes[index]).get().then(doc => {
                    if (!doc.exists) {
                      const selectedResultados = [];

                      for (let j = 0; j < STATE.preguntas.length; j++) {
                        const selected = [];
                        for (let k = 0; k < grupos[i].idEstudiantes.length; k++) {
                          selected.push(0);
                        }
                        selectedResultados.push(selected);
                      }

                      STATE.resultados = selectedResultados

                    } else {
                      STATE.editando = true

                      ResultadosTotal[index] = doc.data().resultados;
                    }

                  })
                }

                STATE.nombreEstudiante = est

                if (ResultadosTotal != undefined) {
                  for (let x = 0; x < ResultadosTotal.length; x++) {

                  }
                  STATE.resultados = ResultadosTotal

                }
                STATE.idEstudiante = grupos[i].idEstudiantes

              }
            }

          });
      });



    })
    setTimeout(() => {
      resolve(STATE)
    }, 2000)

  });

  return promise;

}












export const login = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
}
export const register = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
}
export const passwordRecovery = (email) => {
  return auth.sendPasswordResetEmail(email);
}
export const signout = () => {
  return auth.signOut();
}

