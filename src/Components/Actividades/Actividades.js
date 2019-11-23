import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { is } from '@babel/types';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.white,
    fontSize: 20,
  },

}))(TableCell);

function createData(name, Descripcion, Estado) {
  return { name, Descripcion, Estado };
}
const rows = [
  createData('1828', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.', 'Pendiente'),
  createData('1818', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.', 'Enviado'),
  createData('1228', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in ultricies velit. Morbi tristique ultrices mi euismod eleifend. Duis mattis ultricies ante ac tempor.', 'Revisado'),

];

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: 'name', numeric: true, disablePadding: true, label: 'NRC' },
  { id: 'Descripcion', numeric: false, disablePadding: false, label: 'Descripcion' },
  { id: 'Estado', numeric: false, disablePadding: false, label: 'Estado' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <StyledTableCell
            key={headCell.id}
            align={'right'}
            bold="true"
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function Actividades() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Estado');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };



  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);


  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}

            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell align="right" component="th" scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell >{row.Descripcion}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color={row.Estado == ("Revisado") ? "primary" : (row.Estado == ("Pendiente") ? "secondary" : "default")}
                          disabled={row.Estado == ("Enviado") ? true : false}
                        >
                          <Link href="/Actividad"/*parametros enviados de la encuesta*/ style={{ textDecoration: 'none', color: "white" }}>
                            {row.Estado}
                          </Link>
                        </Button>

                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}