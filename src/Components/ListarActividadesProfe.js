import React, { Component } from "react";
import { db, comentario } from './../Firebase/firebase.js'
import ModalB from './ModalB.js'

const INITIAL_STATE = {
    cursos: [],
    nrc: [],
    actividades: [],
    preguntas: [],
    respuestas: [],
    tipoRespuestas: [],
    indicaciones: [],
    estudiantes: [],
    idEstudiantes: [],
    estudiantesGruposResultados: [],
    resultados: [],
    tipoEncuesta: [],
    comentarios: [],
    error: null,
    mostrar: false,
    isOpen: false,
    save: false,
    comentario: '',
    selectedEstudiante: '',
    selectedIdEstudiante: '',
    i: 0,
    j: 0,
};

class ListarActividades extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    componentDidMount() {
        const uid = sessionStorage.getItem('user');
        db.collection('usuarios').doc(uid).get().then(doc => {
            const cursos = doc.data().cursos;

            const cursosTotal = [];
            const nrcTotal = doc.data().cursos;
            const actividadesTotal = [];
            const tipoEncuestaTotal = [];
            const estudiantesTotal = [];
            const idEstudiantesTotal = [];
            const comentarioEstudianteTotal = [];
            const estudiantesResultadosTotal = [];
            const estudiantesGruposResultadosTotal = [];
            const preguntasTotal = [];
            for (let i = 0; i < cursos.length; i++) {
                db.collection('cursos').doc(cursos[i]).get().then(doc => {
                    cursosTotal[i] = doc.data().NombreCurso;
                })
                db.collection('cursos').doc(cursos[i]).collection('Actividades').get().then(doc => {
                    const actividades = doc.docs.map(doc => doc.id);
                    const tipoEncuesta = doc.docs.map(doc => doc.data().tipoEncuesta);

                    db.collection('usuarios').doc(uid).collection('encuestas').get().then(doc => {
                        const encuestas = doc.docs.map(doc => doc.id);
                        const preguntas = doc.docs.map(doc => doc.data().preguntas);
                        const preguntasAct = []
                        for (let m = 0; m < tipoEncuesta.length; m++) {
                            db.collection('usuarios').doc(uid).collection('encuestas').doc(tipoEncuesta[m]).get().then(doc => {
                                preguntasAct[m] = doc.data().preguntas;
                            })

                        }
                        preguntasTotal[i] = preguntasAct;

                    })
                    const estudiantesi = [];
                    const idEstudiantesi = [];
                    const comentarioEstudiantei = [];
                    const estudiantesResultadosi = [];
                    const estudiantesGruposResultadosi = [];
                    actividadesTotal[i] = actividades;
                    tipoEncuestaTotal[i] = tipoEncuesta;
                    this.setState({ actividades: actividadesTotal })
                    for (let j = 0; j < actividades.length; j++) {
                        db.collection('cursos').doc(cursos[i]).collection('Actividades').doc(actividades[j]).collection('Estudiantes').get().then(doc => {
                            const estudiante = doc.docs.map(doc => doc.id);

                            const estudiantesResultadosij = [];
                            const estudiantesGruposResultadosij = [];
                            const idEstudiante = [];
                            const comentarioEstudiante = [];
                            const estudianteNombre = [];
                            for (let k = 0; k < estudiante.length; k++) {

                                db.collection('usuarios').doc(estudiante[k]).get().then(doc => {
                                    if (doc.data() != undefined) {
                                        estudianteNombre[k] = doc.data().name + " " + doc.data().apellido;
                                        idEstudiante[k] = doc.id;
                                    }
                                })
                                db.collection('cursos').doc(cursos[i]).collection('Actividades').doc(actividades[j]).collection('Estudiantes').doc(estudiante[k]).get().then(doc => {
                                    if (doc.data().comentario != undefined) {
                                        comentarioEstudiante[k] = doc.data().comentario;
                                    } else {
                                        comentarioEstudiante[k] = "";
                                    }
                                })
                                db.collection("cursos").doc(cursos[i]).collection('Grupos')
                                    .get()
                                    .then(doc => {
                                        const grupos = doc.docs.map(doc => doc.data());
                                        var tamGrupo = 0;
                                        for (let z = 0; z < grupos.length; z++) {
                                            if (grupos[z].idEstudiantes.includes(estudiante[k])) {
                                                const est = [];

                                                for (let index = 0; index < grupos[z].idEstudiantes.length; index++) {
                                                    db.collection('usuarios').doc(grupos[z].idEstudiantes[index]).get().then(doc => {

                                                        est.push(doc.data().name + " " + doc.data().apellido)
                                                    })
                                                }
                                                estudiantesGruposResultadosij[k] = est;

                                                db.collection('cursos').doc(cursos[i]).collection('Actividades').doc(actividades[j]).collection('Estudiantes').doc(estudiante[k]).collection('Resultados').get().then(doc => {
                                                    if (doc.empty) {
                                                        var vacio = [];
                                                        for (let index = 0; index < estudiantesGruposResultadosij[k].length; index++) {
                                                            vacio[index] = [""];

                                                        }
                                                        estudiantesResultadosij[k] = vacio;
                                                    } else {
                                                        estudiantesResultadosij[k] = doc.docs.map(doc => doc.data().resultados);
                                                    }
                                                })

                                            }

                                        }
                                    })

                            }
                            idEstudiantesi[j] = idEstudiante;
                            comentarioEstudiantei[j] = comentarioEstudiante;
                            estudiantesi[j] = estudianteNombre;
                            estudiantesGruposResultadosi[j] = estudiantesGruposResultadosij;
                            estudiantesResultadosi[j] = estudiantesResultadosij;
                        })
                    }
                    idEstudiantesTotal[i] = idEstudiantesi;
                    comentarioEstudianteTotal[i] = comentarioEstudiantei;
                    estudiantesTotal[i] = estudiantesi;
                    estudiantesGruposResultadosTotal[i] = estudiantesGruposResultadosi;
                    estudiantesResultadosTotal[i] = estudiantesResultadosi;
                })

            }

            this.setState({ estudiantes: estudiantesTotal, idEstudiante: idEstudiantesTotal, comentarios: comentarioEstudianteTotal, resultados: estudiantesResultadosTotal, estudiantesGruposResultados: estudiantesGruposResultadosTotal, actividades: actividadesTotal, tipoEncuesta: tipoEncuestaTotal, cursos: cursosTotal, nrc: nrcTotal, preguntas: preguntasTotal })
        })



    }
    onClick = (event) => {
        const i = parseInt(event.target.value);
        const j = parseInt(event.target.name);
        this.setState({ i: i, j: j })

    }
    onClose = (event) => {
        this.setState({
            isOpen: !this.state.isOpen, save: false
        });

    }
    onSave = event => {
        if (this.state.selectedEstudiante !== '') {
            if (this.state.comentario !== '') {
                if (!this.state.save) {
                    this.setState({ save: true });
                    this.setState({ error: null })
                    setTimeout(() => {
                        this.setState({ save: false });
                    }, 3000);
                    //agregar comentario en la coleccion de resultados 
                    comentario(this.state.selectedIdEstudiante, this.state.nrc[this.state.i], this.state.actividades[this.state.i][this.state.j], this.state.comentario);
                    var comentar = this.state.comentarios;
                    comentar[this.state.i][this.state.j][this.state.idEstudiante[this.state.i][this.state.j].indexOf(this.state.selectedIdEstudiante)] = this.state.comentario;

                    this.setState({ comentarios: comentar })
                    setTimeout(() => {
                        this.setState({ comentario: '' });
                    }, 3000);
                    //agregar comentario a esta vista para que el profesor los peuda ver sin tener que actualizar
                    //Mostrar los resultados en la vista de los estudiantes
                }
            } else {
                this.setState({ error: 'Ingrese un comentario' })
                setTimeout(() => {
                    this.setState({ error: null });
                }, 3000);
            }
        } else {
            this.setState({ error: 'Seleccione un estudiante' })
            setTimeout(() => {
                this.setState({ error: null });
            }, 3000);
        }

    }
    onChange = event => {
        this.setState({ comentario: event.target.value })
    }
    onChangeEstuidiante = event => {

        this.setState({ selectedEstudiante: event.target.value, selectedIdEstudiante: this.state.idEstudiante[this.state.i][this.state.j][this.state.estudiantes[this.state.i][this.state.j].indexOf(event.target.value)] });
    };
    loading() {
        const { cursos, resultados } = this.state
        if (cursos.length != resultados.length) {
            setTimeout(() => {
                this.setState({ resultados: resultados }
                )
            }, 1000)
            return false;

        }
        if (resultados == undefined) {
            if (resultados[this.state.i] == undefined) {
                if (resultados[this.state.i][this.state.j] == undefined) {
                    setTimeout(() => {
                        this.setState({ resultados: resultados }
                        )
                    }, 1000)
                    return false;
                }
                setTimeout(() => {
                    this.setState({ resultados: resultados }
                    )
                }, 1000)
                return false;
            }
            setTimeout(() => {
                this.setState({ resultados: resultados }
                )
            }, 1000)
            return false;
        }
        setTimeout(() => {
            if (!this.state.mostrar) {
                this.setState({ mostrar: true })
            }
        }, 3000)
        return true;
    }

    toggleModal = (event) => {
        if (!this.state.isOpen) {
            this.setState({
                comentario: '',
                selectedEstudiante: '',
                selectedIdEstudiante: '',
            })
        }
        this.setState({
            isOpen: !this.state.isOpen, save: false
        });
    }
    descargar = (event) => {
        var table = event.target.name;
        var name = event.target.value;
        if (table != null && name != null) {
            var uri = 'data:application/vnd.ms-excel;base64,'
                , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
                , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

            if (!table.nodeType) {
                table = document.getElementById(table)
            }
            if (table != null) {
                var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
                window.location.href = uri + base64(format(template, ctx))
            }
        }
    }
    render() {
        const { cursos, actividades, estudiantes, estudiantesGruposResultados, resultados, preguntas, comentarios, respuestas, tipoRespuestas, indicaciones, tipoEncuesta } = this.state
        var load = true;
        var resultado;
        var preg
        if (resultados[this.state.i] != undefined) {
            if (resultados[this.state.i][this.state.j] != undefined) {
                resultado = resultados[this.state.i][this.state.j];
                preg = preguntas[this.state.i][this.state.j];
            }
        }
        return (
            <main >

                {(this.loading() && this.state.mostrar) &&

                    < div >
                        <br />
                        <div className="card-header text-center" style={{ backgroundColor: '#0275d8', color: 'white' }}><h2>Resultados</h2></div>
                        <div className="card-body">
                            {resultados.map((resultados, i) =>
                                <div key={i}>
                                    <h1>{cursos[i]}</h1>
                                    {resultados.map((resultados, j) =>
                                        <div key={j} >

                                            <div className="col-lg-12">  <div className="col-sm-6" style={{ paddingLeft: '0%' }}> <label style={{ fontWeight: '600', paddingRight: '4px' }}>{"Nombre actividad: " + " "}</label>{actividades[i][j]}</div><button className="btn btn-primary" onClick={this.onClick} value={i} name={j}>Ver resultados</button></div>


                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {
                            load &&
                            <div className="container-fluid table-responsive" style={{ width: '100%' }}>
                                <button className="btn btn-primary" name='tabla' value={cursos[this.state.i] + " " + actividades[this.state.i][this.state.j]} onClick={this.descargar}>Descargar</button>
                                <button className="btn btn-primary" onClick={this.toggleModal}>Crear comentario</button>
                                <h2>Resultados</h2>
                                <span> <strong>Curso:</strong> {cursos[this.state.i]}</span>
                                <br />
                                <span><strong>Actividad:</strong> {actividades[this.state.i][this.state.j]}</span>
                                <br />
                                <table className="table table-hover table-bordered" id='tabla'>
                                    <thead>
                                        <tr>
                                            <th className="bg-default" style={{ color: 'white' }}></th>
                                            {resultado.map((resultados, k) =>
                                                <th className="bg-default" style={{ color: 'black' }} key={k+"cs"} colSpan={(estudiantesGruposResultados[this.state.i][this.state.j][k].length > 0 ? estudiantesGruposResultados[this.state.i][this.state.j][k].length : 1)}>
                                                    {estudiantes[this.state.i][this.state.j][k]}
                                                </th>
                                            )}
                                        </tr>

                                        <tr>
                                            <th className="bg-default" style={{ color: 'white' }}></th>
                                            {resultado.map((resultados, k) =>
                                                resultados.map((resultados, l) =>
                                                    <th className="bg-default" style={{ color: 'black' }} key={k + "1" + l}>{estudiantesGruposResultados[this.state.i][this.state.j][k][l]}</th>)
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody  >
                                        {preg.map((pregunta, indice) =>
                                            <tr key={indice}>
                                                <th scope="row">{pregunta}</th>
                                                {resultado.map((resultados, k) =>
                                                    resultados.map((resultados, l) =>

                                                        <th key={k + "" + l}>{resultados[indice]}</th>)
                                                )}
                                            </tr>
                                        )}

                                    </tbody>

                                    <tbody>
                                        <tr>
                                            <th style={{ fontSize: '35px' }} colSpan='6'>Comentarios</th>
                                        </tr>
                                        {resultado.map((resultados, k) =>
                                            <tr key={k + "a"}>
                                                <th key={k + "b"} >
                                                    {estudiantes[this.state.i][this.state.j][k]}
                                                </th>
                                                <th key={k + "c"} colSpan='5'>
                                                    {comentarios[this.state.i][this.state.j][k]}
                                                </th>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        }

                        <ModalB show={this.state.isOpen}
                            onClose={this.toggleModal} >
                            <h1>Comentarios</h1>
                            <select class="form-control" name="estudiante" id="estudiante" onChange={this.onChangeEstuidiante}>
                                <option value="" disabled selected>Seleccione el estudiante</option>
                                {resultado.map((resultados, k) =>
                                    <option key={k + "d"} id={k} value={estudiantes[this.state.i][this.state.j][k]}>{estudiantes[this.state.i][this.state.j][k]}
                                    </option>
                                )}
                            </select>
                            <br />
                            <textarea name="comentario"
                                onChange={this.onChange}
                                type="text"
                                value={(this.state.comentario == "") ? "" : this.state.comentario}
                                placeholder={(this.state.comentario == "") ? "Digite su comentario" : this.state.comentario}
                                required
                                autoFocus
                                id="comentario" className='form-control' />
                            <div>
                                <br />
                                <button className="btn btn-primary" onClick={this.onSave} disabled={this.state.save}>Save</button>
                                <button type="button" className="btn btn-primary" onClick={this.onClose}>
                                    Close     </button>
                                {this.state.save &&
                                    <span className="alert alert-success small" role="alert">comentario creado</span>

                                }
                                {this.state.error != null &&
                                    <span className="alert alert-danger small" role="alert">{this.state.error}</span>
                                }
                            </div>

                        </ModalB>

                    </div>

                }


            </main>
        )
    }
}
export default ListarActividades;













/*


                                        <table>
                                            <tbody>

                                                {resultados.map((resultados, k) =>
                                                    <tr>
                                                        <th colspan={estudiantesGruposResultados[i][j][k].length}>
                                                            {estudiantes[i][j][k]}
                                                        </th>
                                                        <td>
                                                            {resultados.map((resultados, l) =>
                                                                <lable>
                                                                    {estudiantesGruposResultados[i][j][k][l]}
                                                                     {resultados.map((resultados, m) =>

                                                                    <th>
                                                                        {resultados}
                                                                    </th>

                                                                        )}
                                                                    }
                                                                    </lable>

                                                                )}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>


*/