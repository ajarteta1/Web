import React from 'react';
import Slider from '@material-ui/core/Slider';
import "./Actividad.css";
import { Table } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



function createData(name, puntualidad, aportes, compromiso, actitud) {
    return { name, puntualidad, aportes, compromiso, actitud };
}

const rows = [
    createData('Jorge Arteta', 5, 3, 5, 3),
    createData('Miller Bonilla', 3, 3, 5, 3),
    createData('Daniel Cuello', 1, 5, 5, 5)
];


export default function Actividad() {


   /* const [value, setValue] = React.useState(3);
    const handleSliderChange = (event, newValue) => {
        console.log(newValue);
    };*/
    return (
        <div>
            <Paper className="root">
                <Table className="table" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombres de los miembros del equipo</TableCell>
                            <TableCell align="left">puntualidad</TableCell>
                            <TableCell align="left">aportes</TableCell>
                            <TableCell align="left">compromiso</TableCell>
                            <TableCell align="left">actitud</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">
                                    <div className="bar">
                                        <Slider
                                            defaultValue={row.puntualidad}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="on"
                                            step={0.1}
                                            min={0}
                                            max={5}
                                           // onChange={handleSliderChange}
                                        />
                                        {rows.forEach(element => {
                                            if (element.name == row.name) {
                                                //element.calories = value
                                                console.log(element.calories + "" + element.name)
                                            }
                                        })}

                                    </div >
                                </TableCell>
                                <TableCell align="left">
                                    <div className="bar">
                                        <Slider
                                            defaultValue={row.aportes}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="on"
                                            step={0.1}
                                            min={0}
                                            max={5}
                                           // onChange={handleSliderChange}
                                        />
                                    </div >
                                </TableCell>
                                <TableCell align="left">
                                    <div className="bar">
                                        <Slider
                                            defaultValue={row.compromiso}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="on"
                                            step={0.1}
                                            min={0}
                                            max={5}
                                          //  onChange={handleSliderChange}
                                        />
                                    </div >
                                </TableCell>
                                <TableCell align="left">
                                    <div className="bar">
                                        <Slider
                                            defaultValue={row.actitud}
                                            aria-labelledby="discrete-slider"
                                            valueLabelDisplay="on"
                                            step={0.1}
                                            min={0}
                                            max={5}
                                           // onChange={handleSliderChange}
                                        />
                                    </div >
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>

    );
}
