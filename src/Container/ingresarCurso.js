import React, { Component } from "react";
import '../index.css'
//import "./crearCurso.css";
import { llenarCurso, llenarCursoEstudiante } from "../Firebase/firebase"
import { db } from "../Firebase/firebase"


const INITIAL_STATE = {
    CNRC: [],
    CDescripcion: [],
    CnombreCurso: [],
    CGrupos: [],
    CidProfesor: [],
    CidGrupo: [],
    CContraseña: [],
    CidEstudiante: [],
    NRC: '',
    Contraseña: '',
    ContraseñaSelected: '',
    verificarContraseña: undefined,
    verificarUsuario: undefined,
    Curso: '',
    Grupo: '',
    Profesor: '',
    idProfesor: '',
    idGrupo: '1',
    cursoselect: [],
    error: null,
    tamgrupo: [],
    CURSOS: [],
};
class ingresarCurso extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {

        db.collection("usuarios")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                for (let i = 0; i < data.length; i++) {
                    if (sessionStorage.getItem('user') === data[i].email && data[i].Profesor === "on") {
                        this.setState({ idProfesor: data[i].email });
                    }
                }


            });

        db.collection("cursos")
            .get()
            .then(querySnapshot => {
                const nrc = querySnapshot.docs.map(doc => doc.id); //NRC DE CADA CURSO
                //const data = querySnapshot.docs.map(doc => doc.data());
                const descripcion = querySnapshot.docs.map(doc => doc.data().Descripcion); //Descripcion de cada curso
                const cursos = querySnapshot.docs.map(doc => doc.data().NombreCurso);
                const grupos = querySnapshot.docs.map(doc => doc.data().cantidadGrupos);
                const idestudiantes = querySnapshot.docs.map(doc => doc.data().idEstudiantes);
                const idgrupo = querySnapshot.docs.map(doc => doc.data().idGrupo);
                const idprofesor = querySnapshot.docs.map(doc => doc.data().idProfesor);
                const contraseña = querySnapshot.docs.map(doc => doc.data().contraseña);
                const todocursos = querySnapshot.docs.map(doc => doc.data());
                /*const cursos = []
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i].NombreCurso);
                    cursos.push(data[i].NombreCurso);
                }*/
                this.setState({ CNRC: nrc });
                this.setState({ CnombreCurso: cursos });
                this.setState({ CDescripcion: descripcion });
                this.setState({ CGrupos: grupos });
                this.setState({ CidEstudiante: idestudiantes });
                this.setState({ CidGrupo: idgrupo });
                this.setState({ CidProfesor: idprofesor });
                this.setState({ CContraseña: contraseña });
                this.setState({ CURSOS: todocursos });


            });
    }

    onSubmit = event => {



        const { NRC, CURSOS, nombreCurso, CidEstudiante, CNRC, idProfesor, idGrupo, Contraseña, idEstudiante, error } = this.state;
        const cursonrc = CNRC.indexOf(NRC);
        event.preventDefault();




        if (Contraseña === this.state.ContraseñaSelected) {
            this.setState({ verificarContraseña: true })
            if (CURSOS[cursonrc].idEstudiantes.indexOf(sessionStorage.getItem('user')) >= 0) {
                this.setState({ verificarUsuario: false })
            } else {
                this.setState({ verificarUsuario: true })
                db.collection('cursos').doc(NRC).collection("Grupos").get().then(querySnapshot => {
                    const idgrupos = querySnapshot.docs.map(doc => doc.id);
                    const grupoEstudiante = querySnapshot.docs.map(doc => doc.data());
                    const listaEstudiante = [];
                    const listaGrupoEstudiante = [];
                    for (let i = 0; i < this.state.CidEstudiante[cursonrc].length; i++) {
                        listaEstudiante.push(this.state.CidEstudiante[cursonrc][i]);
                    }
                    var x = idgrupos.indexOf(idGrupo);
                    if (x !== -1) {
                        for (let i = 0; i < grupoEstudiante[x].idEstudiantes.length; i++) {
                            listaGrupoEstudiante.push(grupoEstudiante[x].idEstudiantes[i]);
                        }
                    }
                    listaGrupoEstudiante.push(sessionStorage.getItem('user'));
                    listaEstudiante.push(sessionStorage.getItem('user'));

                    llenarCurso(NRC, idGrupo, sessionStorage.getItem('user'), idgrupos, listaGrupoEstudiante, listaEstudiante)
                });
   
                db.collection('usuarios').doc(sessionStorage.getItem('user')).get().then(querySnapshot => {
                    const user = querySnapshot.data();
                    const listaCursosEstudiante = [];
                    for (let i = 0; i < user.cursos.length; i++) {
                        listaCursosEstudiante.push(user.cursos[i]);
                    }
                    listaCursosEstudiante.push(NRC)
                    llenarCursoEstudiante(sessionStorage.getItem('user'), listaCursosEstudiante);

                    setTimeout(() => {
                        window.location.href = "/ingresarCurso";
                    }, 3000);
                });;
            }
        } else {
            this.setState({ verificarContraseña: false })
        }


    };
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeNRC = event => {
        const { NRC, Grupo, CGrupos, tamgrupo, CidProfesor, CNRC, CnombreCurso, CContraseña, Curso, Profesor } = this.state;
        const cursonrc = CNRC.indexOf(NRC);
        this.setState({ Curso: CnombreCurso[cursonrc] });
        this.setState({ Profesor: CidProfesor[cursonrc] });
        this.setState({ Grupo: CGrupos[cursonrc] });
        this.setState({ ContraseñaSelected: CContraseña[cursonrc] });

        const grup = [];
        for (let i = 0; i < CGrupos[cursonrc]; i++) {
            grup[i] = i + 1;
        }
        this.setState({ tamgrupo: grup })

    };


    render() {

        const { NRC, nombreCurso, idGrupo, cursoselect, Contraseña, tamgrupo, verificarContraseña, verificarUsuario } = this.state;

        return (
            <div>
                {
                    (this.state.idProfesor !== '') ?
                        <div>
                            <h1>NO eres estudiante</h1>
                        </div>
                        :
                        <section className="waves">
                            <br/>
                        <div className="container">
                        <div className="col-sm-5 mx-auto">
                            <div className="card">
                                <div className="card-header text-center" style={{ backgroundColor: '#0275d8', color: 'white' }}><h2>Ingresar al curso</h2></div>
                            <div className="card-body">
                                
                                <form onSubmit={this.onSubmit}>
                                    <div className="form-group">
                                        <label for="NRC">Digite NRC del curso:</label>
                                        <input type="text" className="form-control" id="NRC"
                                            name="NRC"
                                            value={NRC}
                                            onChange={this.onChange} placeholder="NRC"
                                        />
                                         <button type="button" onClick={this.onChangeNRC} class="btn btn-primary" style={{marginTop:'5px'}}>Buscar</button>
                                       
                                    </div>
                                    
                                    <div class="form-group">
                                        {(this.state.Curso === undefined) ?
                                            <span for="idCurso" className="alert alert-danger" role="alert">No existe un curso con este NRC</span>
                                            :
                                            <div className="col">
                                                <label for="idCurso" class="row row-form-label">Curso: {this.state.Curso}</label>
                                                <label for="idProfesor" class="row row-form-label">Correo Profesor: {this.state.Profesor}</label>
                                            </div>
                                        }
                                    </div>
                                    <div className="form-group">

                                        <label for="contraseña">Contraseña del curso:</label>
                                        <input type="text" className="form-control" id="Contraseña"
                                            name="Contraseña"
                                            value={Contraseña}
                                            onChange={this.onChange} placeholder="Contraseña" />

                                        {(verificarContraseña === undefined) ?
                                            <div></div>
                                            :
                                            <div>
                                                <br />
                                                {(verificarContraseña) ?
                                                    <span className="alert alert-success" role="alert">Contraseña valida</span>
                                                    :
                                                    <span className="alert alert-danger" role="alert">Contraseña incorrecta</span>
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div class="form-group">
                                        <label for="idGrupo">Seleccione grupo</label>
                                        <select className="form-control" id="idGrupo" name="idGrupo"
                                            value={idGrupo} onChange={this.onChange}>
                                            {tamgrupo.map((grupo, index) =>
                                                <option key={index}>{grupo}
                                                </option>
                                            )}
                                        </select>
                                    </div>
                                    {(verificarUsuario === undefined) ?
                                        <div></div>
                                        :
                                        <div>
                                            <br />
                                            {(verificarUsuario) ?
                                                <span className="alert alert-success" role="alert">Usuario nuevo</span>
                                                :
                                                <span className="alert alert-danger" role="alert">Ya se encuentra en un curso</span>
                                            }
                                        </div>
                                    }
                                    <button type="submit" class="btn btn-primary">Ingresar</button>
                                </form>
                                </div>
                            </div>
                                </div>
                        </div>
                        </section>

                }
            </div>
        );
    }
}
export default ingresarCurso;