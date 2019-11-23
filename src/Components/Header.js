import React, { Component } from 'react';
import { db } from './../Firebase/firebase.js';
const INITIAL_STATE = {
  Profesor: '',
}
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    if (sessionStorage.length != 0) {
      const uid = sessionStorage.getItem("user");

      db.collection("usuarios").doc(uid).get().then(querySnapshot => {
        const user = querySnapshot.data();
        if (uid === user.email) {
          this.setState({ Profesor: user.Profesor });
        }
      });
    }
  }
  render() {
    const singout = () => {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    const singin = () => {
      window.location.href = "/login";
    }
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary" >
        <a className="navbar-brand" href="/"><img width="30" src="https://firebasestorage.googleapis.com/v0/b/peer-evaluation-747fc.appspot.com/o/teamwork.svg?alt=media&token=7ff133f7-d7fb-4994-9e2c-a89aadf9c010" /> Compeer </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/" style={{ color: 'white' }}>Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" style={{ color: 'white' }}>Conocer mas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" style={{ color: 'white' }}>Acerca de nosotros</a>
            </li>
          </ul>
        </div>
        {(this.state.Profesor != '') ?
          <button className="btn btn-outline-light"
            variant="contained"
            onClick={singout}
          >
            Log Out
            </button>
          :
          <button className="btn btn-outline-light"
            variant="contained"
            onClick={singin}
          >
            Log in
            </button>

        }
      </nav>

    );
  }
}

export default Header;