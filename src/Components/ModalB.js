import React from 'react'
import PropTypes from 'prop-types'
import '../index.css'

class ModalB extends React.Component {
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
          
              <div className="modalb container" role="dialog" style={{modalStyle}}>
                {this.props.children}
      
                <div className="footer">

                </div>
              </div>
             
          );
        }
      }

ModalB.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};


export default ModalB;