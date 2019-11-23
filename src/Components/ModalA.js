import React from 'react'
import PropTypes from 'prop-types'
import '../index.css'

class ModalA extends React.Component {
    render() {
        if (!this.props.show) {
            return null;
        }
       
      
          // The modal "window"
          const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 500,
            minHeight: 300,
            margin: '0 auto',
            padding: 30,
            overflow:'auto'
          };
      
          return (
          
              <div className="modala container" role="dialog" style={{modalStyle}}>
                {this.props.children}
      
                <div className="footer">
                  <button type="button" className="btn btn-primary" onClick={this.props.onClose}>
                    Close
                  </button>
                </div>
              </div>
             
          );
        }
      }

ModalA.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};


export default ModalA;