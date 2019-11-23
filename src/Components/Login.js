import React, { Component } from "react";
import "./Login.css";
import Upload from '../Container/NewUpload.js';
import { login } from '../Firebase/firebase.js'
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
    if (email && password) {
      login(email, password)
        .then(user => {
          this.setState({ ...INITIAL_STATE });
          sessionStorage.setItem('user', email);
          window.location.href = "/";
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

    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
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
                  <div style={{ padding:'10%',width: '80%' }}>
                    <h3 className="login-heading mb-4">Welcome back!</h3>
                    <form onSubmit={this.onSubmit}>
                      <div className="form-label-group">
                        <input name="email"
                          value={email}
                          onChange={this.onChange}
                          type="text"
                          placeholder="Email Address"
                          required
                          autoFocus
                          id="inputEmail"style={{ width: '100%' }} />
                        <label htmlFor="inputEmail">Email address</label>
                      </div>

                      <div className="form-label-group">
                        <input name="password"
                          value={password}
                          onChange={this.onChange}
                          type="password"
                          placeholder="Password"
                          required
                          id="inputPassword"
                          style={{ width: '100%' }} />
                        <label htmlFor="inputPassword">Password</label>
                      </div>

                      <button className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2"
                        disabled={isInvalid} type="submit"
                      >Sign in</button>
                      <div className="text-center">
                        <a className="small col" href="/forgotPassword">Forgot password?</a>
                        <a className="small col" href="/register">Sign in</a>
                      </div>
                      <br />
                      {error && <div className="alert alert-danger" role="alert">{error.message}</div>}

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

export default Login;