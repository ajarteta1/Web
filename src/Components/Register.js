
import React, { Component } from "react";
import "./Register.css";
import { register, writeUserData } from "../Firebase/firebase.js"

const INITIAL_STATE = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  repassword: '',
  esProfesor: 'off',
  error: null,
};
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password, nombre, apellido, esProfesor } = this.state;
    console.log(email + "==" + nombre + "==" + apellido + "==" + esProfesor);
    if (email && password) {
      register(email, password)
        .then(user => {
          this.setState({ ...INITIAL_STATE });
          sessionStorage.setItem('user', email);
          writeUserData(email, nombre, apellido, esProfesor);
        })
        .catch(error => {
          this.setState({ error });
        });
      event.preventDefault();
    } else {
      console.log(this.state.error);
    }
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, nombre, apellido, repassword, esProfesor, error } = this.state;
    const isInvalid = password === '' || repassword === '' || password != repassword || email === '' || nombre === '' || apellido === '';
    const samePass = password === repassword;
    if (sessionStorage.length != 0) {
      window.location.href = "/";
    }
    return (
      <div class="container-fluid">
        <div class="row no-gutter">
          <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
          <div class="col-md-8 col-lg-6">
            <div class="login d-flex align-items-center py-5">
              <div class="container">
                <div class="row">
                  <div class="" style={{ padding: '10%', width: '80%' }}>
                    <h3 class="login-heading mb-4">Bienvenido a Evaluación de pares!</h3>
                    <form onSubmit={this.onSubmit}>
                      <div class="form-label-group">
                        <input name="nombre"
                          onChange={this.onChange}
                          type="text"
                          placeholder="Nombre"
                          id="inputNombre"
                          required
                          autoFocus 
                          style={{ width: '100%' }}
                          />

                        <label for="inputNombre">Nombre</label>
                      </div>

                      <div class="form-label-group">
                        <input name="apellido"

                          onChange={this.onChange}
                          type="text"
                          placeholder="Apellido"
                          id="inputApellido"
                          required
                          style={{ width: '100%' }} />
                        <label for="inputApellido">Apellido</label>
                      </div>

                      <div class="form-label-group">
                        <input name="email"
                          style={{ width: '100%' }}
                          onChange={this.onChange}
                          type="text"
                          placeholder="Email Address"
                          id="inputEmail"
                          required autofocus />
                        <label for="inputEmail">Email address</label>
                      </div>

                      <div class="form-label-group">
                        <input name="password"
                          style={{ width: '100%' }}
                          onChange={this.onChange}
                          type="password"
                          placeholder="Password"
                          id="inputPassword"
                          required />
                        <label for="inputPassword">Password</label>
                      </div>

                      <div class="form-label-group">
                        <input name="repassword"
                          style={{ width: '100%' }}
                          onChange={this.onChange}
                          type="password"
                          placeholder="Repassword"
                          id="inputRepassword"
                          required />
                        <label for="inputRepassword">Confirmar contraseña</label>
                      </div>
                      <div className="form-check">
                        <input name="esProfesor"

                          onChange={this.onChange}
                          type="checkbox" className="form-check-input" id="esProfesor" />
                        <label className="form-check-label" htmlFor="esProfesor">¿Eres Profesor?</label>

                      </div>


                      <button class="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                        disabled={isInvalid} type="submit"
                      >Sign in</button>
                      {(!samePass && repassword != '') &&
                        <div className="alert alert-danger" role="alert">Las contraseñas no son iguales</div>
                      }
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
export default Register;