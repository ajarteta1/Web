import React, { Component } from "react";
import { passwordRecovery } from '../Firebase/firebase.js'
const INITIAL_STATE = {
  email: '',
  verificado:false,
  error: null,
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email} = this.state;
    if (email) {
        passwordRecovery(email)
        .then(user => {
          this.setState({ email:'',verificado:true,error:null });
          
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

    const { email, verificado, error } = this.state;
    const isInvalid =  email === '';
    if (sessionStorage.length != 0) {
      window.location.href = "/";
    }
    return (
      <div className="container-fluid">
        <div className="row no-gutter">
          <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
          <div className="col-md-8 col-lg-6">
            <div className="login d-flex align-items-center py-5">
              <div className="container">
                <div className="row">
                  <div className="col-md-9 col-lg-8 mx-auto">
                    <h3 className="login-heading mb-4">Restablecer contraseña</h3>
                    <form onSubmit={this.onSubmit}>
                      <div className="form-label-group">
                        <input name="email"
                          value={email}
                          onChange={this.onChange}
                          type="text"
                          placeholder="Email Address"
                          required
                          autoFocus
                          id="inputEmail" />
                        <label htmlFor="inputEmail">Email address</label>
                      </div>

                      <button className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                        disabled={isInvalid} type="submit"
                      >Enviar</button>
                      <div className="text-center">
                        <a className="small col" href="/login">Log in</a>
                        <a className="small col" href="/register">Sign in</a>
                      </div>
                      <div>
                        {verificado?
                            <span>Revise su correo y siga las instrucciones para restablecer su contraseña</span>
                            :
                            <span></span>   
                        }
                      </div>
                      {error && <p>{error.message}</p>}
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

export default ForgotPassword;