import React, { useContext, useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import makeAnimated from 'react-select/animated';
import Pagination from 'pagination-for-reactjs-component'
import "bootstrap/dist/css/bootstrap.min.css";
import { Appcontext } from '../../../../../appContext';
import { getEntitiesData } from '../../../../../services/dashboard/billing/admission/admission';
import Preloader from '../../../../shared/preloader/Preloader';
import { getWareLocation } from '../../../../../services/dashboard/inventory/inventory';
import Swal from 'sweetalert2';
import { getBills } from '../../../../../services/dashboard/billing/electronicBill/electronicBill';

/**
 * MENSAJES PERSONALIZADOS AL BUSCAR O CARGAR OPCIONES EN REACT SELECT
 */

const { NoOptionsMessage } = components;

const customNoOptionsMessage = props => (
  <NoOptionsMessage {...props} className="custom-no-options-message-internal-form-">No registrado</NoOptionsMessage>
);

const { LoadingMessage } = components;

const customLoadingMessage = props => (
  <LoadingMessage {...props} className="custom-loading-message-internal-form-">Cargando</LoadingMessage>
);

/**
 * ANIMATE DELETE MULTISELECT
 */

const animatedComponents = makeAnimated();

/**
* Data que llena los select
*/

const CustomSelect = [
  { value: "opcion-uno", label: "Opcion uno" },
  { value: "opcion-dos", label: "Opcion dos" },
  { value: "opcion-tres", label: "Opcion tres" }
];

const Location = [
  { value: '1', label: 'Armenia' },
  { value: '2', label: 'Manizales' }
];

const CustomSelectRegisters = [
  { value: 1, label: "5" },
  { value: 2, label: "15" },
  { value: 3, label: "25" },
  { value: 4, label: "50" },
];

/**
* Se genera componente nuevo para soportar el placeholder animado del input 
*/

const { ValueContainer, Placeholder } = components;

const CustomValueContainer = ({ children, ...props }) => {
  const { inputId, placeholder } = props.selectProps;
  return (
    <ValueContainer {...props}>
      <Placeholder htmlFor={inputId} {...props}>
        {placeholder}
      </Placeholder>
      {React.Children.map(children, child =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

/**
* Constante que soporta todo el cambio de los estilo del select
*/

const selectStyles = {
  /**
  * Estilos del icono del dropdown del select
  * Estilos del separador del select
  * Estilos del icono de cerrar del select
  */
  dropdownIndicator: (styles) => ({ ...styles, 
    color: "#414D55", 
    padding: 0, paddingTop: '0.34rem !important', 
    paddingRight: '0.5rem !important',
    width: '25px',
    height: '25px',
    "&:hover": {
      color: "#414D55",
    } 
  }),
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  clearIndicator: (styles) => ({ ...styles, 
    color: "#414D55", 
    padding: 0, 
    paddingTop: '0.05rem !important',
    width: '15px',
    height: '15px',
    "&:hover": {
      color: "#414D55",
    } 
  }),
  /**
  * ESTILOS DEL INPUT GLOBAL
  */
  control: () => ({
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  alignSelf: "start",
  justifyContent: "start",
  height: 'auto',
  minHeight: 50,
  maxHeight: 150,
  paddingLeft: '2.1rem',
  paddingTop: '0.3rem',
  width: "100%",
  backgroundColor: 'transparent',
  borderRadius: 0,
  borderBottom: "1px solid #414D55",
  }),
  /**
  * ESTILOS DEL INPUT
  */
  input: (provided) => ({
  ...provided,
  color: '#728998',
  fontSize: 13,
  textTransform: "uppercase",
  fontFamily: 'Monserat-regular',
  gridArea: '1/1/2/2',
    overflow: 'hidden',
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  /**
  * ESTILOS DEL MENU DESPLEGABLE DEL SELECT
  */
  menu: (styles) => ({
  ...styles,
  border: 'none',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 6px 0px',
  borderRadius: '1rem',
  padding: 0,
  marginTop: 8,
  marginBottom: 0,
  height: 'auto',
  minHeight: 'auto',
  maxHeight: 300,
  overflow: "hidden",
  color: '#728998',
  fontSize: 12,
  textTransform: "uppercase",
  fontFamily: 'Monserat-regular',
  }),
  menuList: () => ({
    paddingTop: 0,
    paddingBottom: 0,
    height: 'auto',
    minHeight: 'auto',
    maxHeight: 300,
    overflow: "auto",
    "::-webkit-scrollbar": {
      width: "0px !important",
      height: "0px !important",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent !important"
    },
    "::-webkit-scrollbar-thumb": {
      background: "transparent !important"
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "transparent !important"
    }
  }),
  /**
  * ESTILOS DE LAS OPCIONES DESPLEGABLES
  */
  option: (provided, state) => ({
  ...provided,
  fontSize: 11,
  textTransform: "uppercase",
  backgroundColor: state.isSelected ? "#7867EA" : "rgba(255, 255, 255, 1)",
  fontFamily: 'Monserat-regular',
  padding: '0.5rem 0.8rem 0.5rem 0.8rem',
  borderRadius: '1rem',
  ":hover": {
  background: "#7867EA",
  color: '#FFFFFF',
  }
  }),
  /**
  * ESTILOS DEL CONTENEDOR
  */
  container: (provided, state) => ({
  ...provided,
  marginTop: 0,
  width: '100%',
  position: 'relative',
  flex: '1 1 auto'
  }),
  valueContainer: (provided, state) => ({
  ...provided,
  overflow: "visible",
  position: "relative",
  top: "4px"
  }),
  /**
  * ESTILOS PLACEHOLDER DEL INPUT
  */
  placeholder: (provided, state) => ({
  ...provided,
  width: '100%',
  position: "absolute",
  top: state.hasValue || state.selectProps.inputValue ? -20 : "22%",
  left: state.hasValue || state.selectProps.inputValue ? -32 : "0%",
  transition: "top 0.1s, font-size 0.1s",
  color: '#728998',
  fontSize: state.hasValue || state.selectProps.inputValue ? 13 : "14px",
  lineHeight: 1.25,
  fontFamily: 'Monserat-regular',
  overflow: 'hidden',
  textAlign: 'start',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
  }),
  /**
  * ESTILOS TEXTO EN EL INPUT
  */
  singleValue: (styles) => ({ 
  ...styles, 
  fontSize: 13,
  textTransform: "uppercase",
  color: "#728998", 
  fontFamily: 'Monserat-regular', 
  padding: '3px',
  margin: '0px',
  marginTop: '2px',
  marginLeft: 0,
  marginRight: 0,
  gridArea: '1/1/2/2',
    overflow: 'hidden',
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  multiValue: (styles) => ({ 
    ...styles, 
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 6px 0px',
    borderRadius: '0.5rem',
    alignItems: 'center',
    alignSelf: 'center',
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    fontFamily: 'Monserat-regular',
    fontSize: 14,
    color: '#728998',
    paddingLeft: '0.5rem',
    paddingRight: '0.6rem',
    paddingBottom: '0.3rem'
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    borderRadius: '6rem',
    paddingLeft: '6px',
    width: '26px',
    height: '26px',
    color: '#414D55',
    backgroundColor: '#F8F8F8',
    ':hover': {
      color: '#FFFFFF',
      backgroundColor: '#6149CD',
    }
  })
};

/**
 * Constante que soporta todo el cambio de los estilo del select para el número de registros en las tablas
 */

const selectRegistersStyles = {
  /**
   * Estilos del icono del dropdown del select
   * Estilos del separador del select
   * Estilos del icono de cerrar del select
   */
  dropdownIndicator: (styles) => ({ ...styles, 
    color: "var(--color-black-)", 
    padding: 0, paddingTop: '0.34rem !important', 
    paddingRight: '0.5rem !important',
    width: '25px',
    height: '25px',
    "&:hover": {
      color: "var(--color-black-)",
    } 
  }),
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  clearIndicator: (styles) => ({ ...styles, 
    color: "var(--color-black-)", 
    padding: 0, 
    paddingTop: '0.05rem !important',
    width: '15px',
    height: '15px',
    "&:hover": {
      color: "var(--color-black-)",
    } 
  }),
  /**
   * ESTILOS DEL INPUT GLOBAL
   */
  control: () => ({
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    alignSelf: "start",
    justifyContent: "start",
    minWidth: 90,
    maxWidth: 100,
    height: 35,
    paddingLeft: '0rem',
    paddingTop: '0rem',
    paddingBottom: '0.2rem',
    width: "100%",
    backgroundColor: 'var(--color-secondary-white-rgba-)',
    boxShadow: 'var(--box-shadow-2-)',
    borderRadius: "50rem",
    border: "0px solid transparent"
  }),
  /**
  * ESTILOS DEL INPUT
  */
  input: (provided) => ({
  ...provided,
  color: 'var(--color-quaternary-gray-)',
  fontSize: 12,
  textTransform: 'uppercase',
  fontFamily: 'var(--font-family-regular-)',
  gridArea: '1/1/2/2',
    overflow: 'hidden',
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  /**
   * ESTILOS DEL MENU DESPLEGABLE DEL SELECT
   */
  menu: (styles) => ({
  ...styles,
  border: 'none',
  backgroundColor: 'var(--color-secondary-white-rgba-)',
  boxShadow: 'var(--box-shadow-2-)',
  borderRadius: '1rem',
  padding: 0,
  marginTop: 8,
  marginBottom: 0,
  height: 'auto',
  minHeight: 'auto',
  maxHeight: 300,
  overflow: "hidden",
  color: 'var(--color-quaternary-gray-)',
  fontSize: 12,
  textTransform: 'uppercase',
  fontFamily: 'var(--font-family-regular-)',
  }),
  menuList: () => ({
    paddingTop: 0,
    paddingBottom: 0,
    height: 'auto',
    minHeight: 'auto',
    maxHeight: 300,
    overflow: "auto",
    "::-webkit-scrollbar": {
      width: "0px !important",
      height: "0px !important",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent !important"
    },
    "::-webkit-scrollbar-thumb": {
      background: "transparent !important"
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "transparent !important"
    }
  }),
  /**
 * ESTILOS DE LAS OPCIONES DESPLEGABLES
 */
  option: (provided, state) => ({
  ...provided,
  fontSize: 11,
  textTransform: 'uppercase',
  backgroundColor: state.isSelected ? "var(--color-purple-)" : "var(--color-secondary-white-rgba-)",
  fontFamily: 'var(--font-family-regular-)',
  padding: '0.5rem 0.8rem 0.5rem 0.8rem',
  borderRadius: '1rem',
  ":hover": {
  background: "var(--color-purple-)",
  color: 'var(--color-white-)',
  }
  }),
  /**
 * ESTILOS DEL CONTENEDOR
 */
  container: (provided, state) => ({
  ...provided,
  marginTop: 0,
  width: '100%',
  position: 'relative',
  flex: '1 1 auto'
  }),
  valueContainer: (provided, state) => ({
  ...provided,
  overflow: "visible"
  }),
  /**
  * ESTILOS PLACEHOLDER DEL INPUT
  */
  placeholder: (provided, state) => ({
  ...provided,
  width: '100%',
  position: "absolute",
  top: state.hasValue || state.selectProps.inputValue ? -15 : "28%",
  left: state.hasValue || state.selectProps.inputValue ? -32 : "0%",
  transition: "top 0.1s, font-size 0.1s",
  color: 'var(--color-quaternary-gray-)',
  fontSize: state.hasValue || state.selectProps.inputValue ? 13 : "14px",
  lineHeight: 1.25,
  fontFamily: 'var(--font-family-regular-)',
  overflow: 'hidden',
  textAlign: 'start',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
  }),
  /**
  * ESTILOS TEXTO EN EL INPUT
  */
  singleValue: (styles) => ({ 
  ...styles, 
  fontSize: 12,
  textTransform: 'uppercase',
  color: "var(--color-quaternary-gray-)", 
  fontFamily: 'var(--font-family-regular-)', 
  padding: '3px',
  margin: '0px',
  marginTop: '6px',
  marginLeft: 0,
  marginRight: 0,
  gridArea: '1/1/2/2',
    overflow: 'hidden',
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  multiValue: (styles) => ({ 
    ...styles, 
    backgroundColor: 'var(--color-secondary-white-rgba-)',
    boxShadow: 'var(--box-shadow-2-)',
    borderRadius: '1rem',
    margin: '2px',
    alignItems: 'center',
    alignSelf: 'center',
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    fontFamily: 'var(--font-family-regular-)',
    fontSize: 12,
    textTransform: 'uppercase',
    color: 'var(--color-quaternary-gray-)',
    borderRadius: '1rem',
    padding: '5px',
    paddingLeft: '0.5rem',
    paddingRight: '0.6rem',
    paddingBottom: '0.3rem'
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    borderRadius: '6rem',
    paddingLeft: '6px',
    width: '26px',
    height: '26px',
    color: 'var(--color-black-)',
    backgroundColor: 'var(--color-secondary-gray-)',
    ':hover': {
      color: 'var(--color-white-)',
      backgroundColor: 'var(--color-secondary-purple-)',
    }
  })
}

export default function ElectronicBill() {
  const { entitiesBill, setEntitiesBill, Token } = useContext(Appcontext);
  const [ripsCodes, setRipsCodes] = useState([]);
  const [acceptedBills, setAcceptedBills] = useState([]);
  const [locations,setLocations] = useState([]);
  const [returnedBills, setReturnedBills] = useState([]);
  const [revisedBills, setRevisedBills] = useState([]);
  const [subListAccepted, setSubListAccepted] = useState([]);
  const [subListReturned, setSubListReturned] = useState([]);
  //const [subListRevised, setSubListRevised] = useState([]);
  const [charging, setCharging] = useState(false);
  const [filterData, setFilterData] = useState({
    ripsCode: '',
    entity: '',
    location: '',
    locationName: ''
  });
  const [firstData, setFirstData] = useState({
    ripsCode: '',
    entity: '',
    location: ''
  });
  const [pageIndexAccepted, setPageIndexAccepted] = useState(1);
  const [pageCountAccepted, setPageCountAccepted] = useState(1);
  const [showAccepted, setShowAccepted] = useState(5);

  const [pageIndexReturned, setPageIndexReturned] = useState(1);
  const [pageCountReturned, setPageCountReturned] = useState(1);
  const [showReturned, setShowReturned] = useState(5);

  const [pageIndexRevised, setPageIndexRevised] = useState(1);
  const [pageCountRevised, setPageCountRevised] = useState(1);
  const [showRevised, setShowRevised] = useState(5);

  useEffect(() => {
    if (Token) {
      selectServices();
    }
  }, [Token]);

  useEffect(() => {
    if (pageIndexAccepted > 0) {
      obtainSubListAccepted();
    }
  }, [pageIndexAccepted]);

  // useEffect(() => {
  //   if (pageIndexRevised > 0) {
  //     obtainSubListRevised();
  //   }
  // }, [pageIndexRevised]);

  useEffect(() => {
    if (pageIndexReturned > 0) {
      obtainSubListReturned();
    }
  }, [pageIndexReturned]);

  const obtainSubListAccepted = () => {
    let index1 = (pageIndexAccepted - 1) * showAccepted;
    let index2 = pageIndexAccepted * showAccepted;
    let array = acceptedBills.slice(index1, index2);
    setSubListAccepted(array);
  };

  // const obtainSubListRevised = () => {
  //   let index1 = (pageIndexRevised - 1) * showRevised;
  //   let index2 = pageIndexRevised * showRevised;
  //   let array = revisedBills.slice(index1, index2);
  //   setSubListRevised(array);
  // };

  const obtainSubListReturned = () => {
    let index1 = (pageIndexReturned - 1) * showReturned;
    let index2 = pageIndexReturned * showReturned;
    let array = returnedBills.slice(index1, index2);
    setSubListReturned(array);
  };

  const selectServices = async () => {
    if (!entitiesBill) {
      await getEntities();
    } else {
      fillRips();
    }
  };

  useEffect(() => {
    getEntities();
    selectServices();
  }, []);

  const getEntities = async () => {
    setCharging(true);
    let response = await getEntitiesData(Token).catch(() => {
      setCharging(false);
    });
    if (response) {
      let { data } = response;
      let array = [];
      let ripsArray = [];
      data.map(id => {
        
        array.push({
          label: id.name,
          value: id.name,
          ripsCode: id.rips_code,
          nit: id.nit
        });
        ripsArray.push({
          label: id.rips_code,
          value: id.rips_code
        });
      });
      const filt = ripsArray.filter(id=>id.label!=="N/A")
      setRipsCodes(filt);
      setEntitiesBill(array);
    } 
    setCharging(false);
  };

  const fillRips = () => {
    let ripsArray = [];
    entitiesBill.map(id => {
      ripsArray.push({
        label: id.ripsCode,
        value: id.ripsCode
      });
    });
    const filt = ripsArray.filter(id=>id.label!=="N/A")
    console.log(filt)

    setRipsCodes(filt);
  };

  const changeSelect = (e) => {
    if (e.name === 'ripsCode') {
      if (e?.e?.value) {
        let data = entitiesBill.find(info => info.ripsCode === e.e.value);
        setFilterData({
          ... filterData,
          ripsCode: e.e.value,
          entity: data.value
        });
      } else {
        setFilterData({
          ... filterData,
          ripsCode: '',
          entity: ''
        });
      }
    } else {
      setFilterData({
        ... filterData,
        ripsCode: e?.e?.ripsCode ? e.e.ripsCode : '',
        entity: e?.e?.value ? e.e.value : ''
      });
    }
  };

  const changeShowAccepted = (e) => {
    if (e) {
      let array = acceptedBills.slice(0, e.value);
      setShowAccepted(e.value);
      setSubListAccepted(array);
      let CantidadPaginas = acceptedBills.length / e.value;
      if (!Number.isInteger(CantidadPaginas)) {
        setPageCountAccepted(Math.trunc(CantidadPaginas) + 1);
      } else {
        setPageCountAccepted(CantidadPaginas)
      }    
    } else {
      let array = acceptedBills.slice(0, 5);
      setShowAccepted(5);
      setSubListAccepted(array);
      let CantidadPaginas = acceptedBills.length / 5;
      if (!Number.isInteger(CantidadPaginas)) {
        setPageCountAccepted(Math.trunc(CantidadPaginas) + 1);
      } else {
        setPageCountAccepted(CantidadPaginas)
      } 
    }
  };

  // const changeShowRevised = (e) => {
  //   if (e) {
  //     let array = revisedBills.slice(0, e.value);
  //     setShowRevised(e.value);
  //     setSubListRevised(array);
  //     setPageCountRevised(Math.ceil((revisedBills.length) / e.value));
  //   } else {
  //     let array = revisedBills.slice(0, 5);
  //     setShowRevised(5);
  //     setSubListRevised(array);
  //     setPageCountRevised(Math.ceil((revisedBills.length) / 5));
  //   }
  // };

  const changeShowReturned = (e) => {
    if (e) {
      let array = returnedBills.slice(0, e.value);
      setShowReturned(e.value);
      setSubListReturned(array);
      setPageCountReturned(Math.ceil((returnedBills.length) / e.value));
    } else {
      let array = returnedBills.slice(0, 5);
      setShowReturned(5);
      setSubListReturned(array);
      setPageCountReturned(Math.ceil((returnedBills.length) / 5));
    }
  };

  const filterChanged = () => {
    return filterData.entity !== firstData.entity || filterData.ripsCode !== firstData.ripsCode || filterData.location !== firstData.location;
  };

  const conditions = () => {
    return filterData.ripsCode !== '' && filterData.entity !== '' && filterData.location !== '';
  };
const [datos1, setDatos1] = useState([])
const [datos11, setDatos11] = useState([])
  const filterByData = async () => {
    if (filterChanged()) {
      setCharging(true);
      let response = await getBills(filterData, Token).catch((error) => {
        if (error?.response?.data?.message) {
          Swal.fire({
            icon: 'error',
            text: error.response.data.message,
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Ocurrió un error. Vuelva a intentar',
          });
        }
        setCharging(false);
        setAcceptedBills([]);
        setSubListAccepted([]);
        setPageCountAccepted(0);

        setReturnedBills([]);
        setSubListReturned([]);
        setPageCountReturned(0);

        // setRevisedBills([]);
        // //setSubListRevised([]);
        // setPageCountRevised(0);
      });
      if (response) {
        let { data } = response;
        console.log("response", response.data)
        if (data.length > 0) {
          let acceptedArray = data.filter(bill => bill.status === 'CANCELADA' || bill.status === 'SALDO PENDIENTE' || bill.status === 'VACIA' || bill.status === 'VENCIDA');
          let returnedArray = data.filter(bill => bill.status === 'GLOSADA' || bill.status === 'NC TOTAL');
          let revisedArray = data.filter(bill => bill.status === 'REVISADA');
          acceptedArray.reverse();
          returnedArray.reverse();
          setDatos1(acceptedArray);
          setDatos11(returnedArray);
          setAcceptedBills(acceptedArray);
          setSubListAccepted(acceptedArray.slice(0, showAccepted));
          let CantidadPaginas = acceptedArray.length / showAccepted;
          if (!Number.isInteger(CantidadPaginas)) {
            setPageCountAccepted(Math.trunc(CantidadPaginas) + 1);
          } else {
            setPageCountAccepted(CantidadPaginas)
          } 

          setReturnedBills(returnedArray);
          setSubListReturned(returnedArray.slice(0, showReturned));
          let CantidadPaginas2 = returnedArray.length / showReturned;
          if (!Number.isInteger(CantidadPaginas2)) {
            setPageCountReturned(Math.trunc(CantidadPaginas2) + 1);
          } else {
            setPageCountReturned(CantidadPaginas2)
          }          

          // setRevisedBills(revisedArray);
          // setSubListRevised(revisedArray.slice(0, showRevised));
          // setPageCountRevised(Math.ceil(revisedArray.length / showRevised));

          setCharging(false);
        } else {
          setCharging(false);

          setAcceptedBills([]);
          setSubListAccepted([]);
          setPageCountAccepted(0);

          setReturnedBills([]);
          setSubListReturned([]);
          setPageCountReturned(0);

          // setRevisedBills([]);
          // setSubListRevised([]);
          // setPageCountRevised(0);

          Swal.fire({
            icon: 'info',
            text: 'No hay datos',
          });
        }
      }
    }
  };

  
  useEffect(()=>{

    if(Token){
      getLocations();
    }

  },[Token])

  const getLocations=async()=>{
    let Result=undefined;
    setCharging(true);
    Result=await getWareLocation(Token).catch((error)=>{
      console.log(error);
      setCharging(false);
      Swal.fire({
        icon: 'error',
        title: 'No fue posible cargar información de localidades',
     })
    })
    if (Result!==undefined){
        setCharging(false);
        setLocations(Result.data.map((obj) => ({...obj,
          'value':obj.id,
          'label': obj.location_name
        })))
    } 
  }
  const [pageIndex11, setPageIndex11] = useState(1);
  const [pageIndex1, setPageIndex1] = useState(1);

  const [itemsPerPage1, setItemsPerPage1] = useState(5);
  const totalItems1 = datos1.length;
  const pageCount1 = Math.ceil(totalItems1 / itemsPerPage1);
  const slicedDatos1 = datos1.slice(
    (pageIndex1 - 1) * itemsPerPage1,
    pageIndex1 * itemsPerPage1
  );
  const cambiarItems = (event) => {
    console.log(event)
    setItemsPerPage1(parseInt(event.label))
  }
  const [itemsPerPage11, setItemsPerPage11] = useState(5);
  const totalItems11 = datos11.length;
  const pageCount11 = Math.ceil(totalItems11 / itemsPerPage11);
  const slicedDatos11 = datos11.slice(
    (pageIndex11 - 1) * itemsPerPage11,
    pageIndex11 * itemsPerPage11
  );
  const cambiarItems11 = (event) => {
    console.log(event)
    setItemsPerPage11(parseInt(event.label))
  }
  return (
    <React.Fragment>
      {
        charging 
        ?
        (
          <Preloader />
        )
        :
        (
          null
        )
      }
      <div className='row mt-0 mt-sm-0 mt-md-1 mt-lg-1 mt-xl-1 mt-xxl-1'>
        <div className='col-12'>
          <h2 className='m-0 p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>Factura electrónica</h2>
        </div>
      </div>
      <div className='row mt-4 mb-4'>
        <div className='col-12'>
          <form id='internal-form' action='' className='position-relative'>
            <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={ripsCodes} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Código RIPS" styles={selectStyles} isClearable={true} value={filterData.ripsCode ? {value: filterData.ripsCode, label: filterData.ripsCode} : null} onChange={(e) => changeSelect({ e, name: 'ripsCode' }) } />
                  <i className='fa icon-select fs-xs'></i>
                </div>
              </div>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={entitiesBill} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Entidad" styles={selectStyles} isClearable={true} value={filterData.entity ? {value: filterData.entity, label: filterData.entity} : null} onChange={(e) => changeSelect({ e, name: 'entity' }) } />
                  <i className='fa icon-entity fs-xs'></i>
                </div>
              </div>
            </div>
            <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={locations} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Localidad" styles={selectStyles} isClearable={true} value={filterData.location ? {value: filterData.location, label: filterData.locationName} : null} onChange={(e) => setFilterData({ ... filterData, location: e?.value ? e.value : '', locationName: e?.label ? e.label : ''})} />
                  <i className='fa icon-select fs-xs'></i>
                </div>
              </div>
            </div>
            <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-4 mb-0'>
              <div className='col-auto'>
                <button className='btn rounded-pill ps-3 pe-3 ps-sm-3 pe-sm-3 ps-md-3 pe-md-3 ps-lg-5 pe-lg-5 ps-xl-5 pe-xl-5 ps-xxl-5 pe-xxl-5 h-45- d-flex flex-row justify-content-center align-items-center align-self-center btn-dark-purple- bs-1-' type="button" onClick={filterByData} disabled={ !conditions() } >
                    <i className='fa icon-search fs-xs me-0 me-sm-0 me-md-2 me-lg-2 me-xl-2 me-xxl-2'></i>
                    <span className='lh-1 fs-5- ff-monse-regular- d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block'>Filtrar</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='accordion row gy-4 gx-0 mt-4 mb-4' id="accordionPanelsStayOpenExample">
        {/* <div className='accordion-item bs-2-'>
          <div className='d-flex flex-row justify-content-between align-items-end align-self-end justify-content-sm-between align-items-sm-end align-self-sm-end justify-content-md-between align-items-md-end align-self-md-end justify-content-lg-between align-items-lg-center align-self-lg-center justify-content-xl-between align-items-xl-center align-self-xl-center justify-content-xxl-between align-items-xxl-center align-self-xxl-center w-100'>
            <div className='d-flex flex-column flex-sm-column flex-md-column flex-lg-row flex-xl-row flex-xxl-row justify-content-center align-items-start align-self-center justify-content-sm-center align-items-sm-start align-self-sm-center justify-content-md-center align-items-md-start align-self-md-center justify-content-lg-between align-items-lg-center align-self-lg-center justify-content-xl-between align-items-xl-center align-self-xl-center justify-content-xxl-between align-items-xxl-center align-self-xxl-center w-100'>
              <h5 className='m-0 ms-4 lh-sm fs-5- ff-monse-regular- fw-bold tx-dark-purple-'>Revisadas y autorizadas</h5>
            </div>
            <h2 className='accordion-header d-flex flex-column justify-content-xxl-center align-items-xxl-center align-self-xxl-center ms-4 me-4' id="panelsStayOpen-headingThree">
              <button className='accordion-button ps-0 pe-0 pt-2 pb-2 collapsed' type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false"
                aria-controls="panelsStayOpen-collapseTwo">
              </button>
            </h2>
          </div>
          <div id="panelsStayOpen-collapseTwo" className='accordion-collapse collapse' aria-labelledby="panelsStayOpen-headingTwo">
            <div className='accordion-body'>
              <div className='row mt-4 mb-4'>
                <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
                  <div className='card border-0 rounded-0 w-100 bg-transparent'>
                    <div className='card-body p-0 w-100'>
                      <div className='table-responsive table-general-'>
                        <table className='table table-sm table-striped table-no-border- align-middle'>
                          <thead>
                            <tr>
                              <th scope="col" className='th-width-sm-'>
                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                  <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>No. factura</span>
                                </div>
                              </th>
                              <th scope="col" className='th-width-md-'>
                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                  <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Entidad</span>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              subListRevised.map(list => (
                                <tr>
                                  <td className='align-middle'>
                                    <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.invoice_id }</p>
                                  </td>
                                  <td className='align-middle'>
                                    <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.entity_id }</p>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-4 mb-4'>
                <div className='col-12 d-flex flex-row justify-content-center align-items-center align-self-center'>
                  <Pagination
                    pageCount={pageCountRevised}
                    pageIndex={pageIndexRevised}
                    setPageIndex={setPageIndexRevised}
                  />
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className='accordion-item bs-2-'>
          <div className='d-flex flex-row justify-content-between align-items-end align-self-end justify-content-sm-between align-items-sm-end align-self-sm-end justify-content-md-between align-items-md-end align-self-md-end justify-content-lg-between align-items-lg-center align-self-lg-center justify-content-xl-between align-items-xl-center align-self-xl-center justify-content-xxl-between align-items-xxl-center align-self-xxl-center w-100'>
            <div className='d-flex flex-column flex-sm-column flex-md-column flex-lg-row flex-xl-row flex-xxl-row justify-content-center align-items-start align-self-center justify-content-sm-center align-items-sm-start align-self-sm-center justify-content-md-center align-items-md-start align-self-md-center justify-content-lg-between align-items-lg-center align-self-lg-center justify-content-xl-between align-items-xl-center align-self-xl-center justify-content-xxl-between align-items-xxl-center align-self-xxl-center w-100'>
              <h5 className='m-0 ms-4 lh-sm fs-5- ff-monse-regular- fw-bold tx-dark-purple-'>Aceptadas</h5>
            </div>
            <h2 className='accordion-header d-flex flex-column justify-content-xxl-center align-items-xxl-center align-self-xxl-center ms-4 me-4' id="panelsStayOpen-headingThree">
              <button className='accordion-button ps-0 pe-0 pt-2 pb-2 collapsed' type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false"
                aria-controls="panelsStayOpen-collapseThree">
              </button>
            </h2>
          </div>
          <div id="panelsStayOpen-collapseThree" className='accordion-collapse collapse' aria-labelledby="panelsStayOpen-headingThree">
            <div className='accordion-body'>
              <div className='row mt-4 mb-4'>
                <div className='col-12 d-flex flex-row justify-content-end align-items-center align-self-center'>
                  <form id='internal-form' action='' className='position-relative'>
                    <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                      <div className='col-auto d-flex flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-center align-items-center align-self-center me-auto'>
                        <label htmlFor="staticEmail" className='col-auto align-self-center align-self-sm-center align-self-md-center align-self-lg-center align-self-xl-center align-self-xxl-center mb-0 mb-sm-0 mb-md-0 mb-lg-0 mb-xl-0 mb-xxl-0 fs-5- ff-monse-regular- tx-light-black-'>Registros</label>
                        <div className='col-auto d-flex flex-row justify-content-start align-items-center align-self-center ms-2 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-2 ms-xxl-2 me-auto'>
                          <Select
                              id='customSelect'
                              options={CustomSelectRegisters}
                              components={{ animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }}
                              placeholder="#"
                              styles={selectRegistersStyles}
                              isClearable={true}
                              onChange={(event)=>cambiarItems(event)}
                 
                            />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className='row mt-4 mb-4'>
                <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
                  <div className='card border-0 rounded-0 w-100 bg-transparent'>
                    <div className='card-body p-0 w-100'>
                      <div className='table-responsive table-general-'>
                        <table className='table table-sm table-striped table-no-border- align-middle'>
                          <thead>
                            <tr>
                              <th scope="col" className='th-width-sm-'>
                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                  <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>No. factura</span>
                                </div>
                              </th>
                              <th scope="col" className='th-width-md-'>
                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                  <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Entidad</span>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              slicedDatos1.map(list => (
                                <tr>
                                  <td className='align-middle'>
                                    <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.invoice_id }</p>
                                  </td>
                                  <td className='align-middle'>
                                    <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.entity_id }</p>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-4 mb-4'>
                <div className='col-12 d-flex flex-row justify-content-center align-items-center align-self-center'>
                  <Pagination
                    pageCount={pageCount1}
                    pageIndex={pageIndex1}
                    setPageIndex={setPageIndex1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='accordion-item bs-2-'>
          <div className='d-flex flex-row justify-content-between align-items-end align-self-end justify-content-sm-between align-items-sm-end align-self-sm-end justify-content-md-between align-items-md-end align-self-md-end justify-content-lg-between align-items-lg-center align-self-lg-center justify-content-xl-between align-items-xl-center align-self-xl-center justify-content-xxl-between align-items-xxl-center align-self-xxl-center w-100'>
            <div className='d-flex flex-column flex-sm-column flex-md-column flex-lg-row flex-xl-row flex-xxl-row justify-content-center align-items-start align-self-center justify-content-sm-center align-items-sm-start align-self-sm-center justify-content-md-center align-items-md-start align-self-md-center justify-content-lg-between align-items-lg-center align-self-lg-center justify-content-xl-between align-items-xl-center align-self-xl-center justify-content-xxl-between align-items-xxl-center align-self-xxl-center w-100'>
              <h5 className='m-0 ms-4 lh-sm fs-5- ff-monse-regular- fw-bold tx-dark-purple-'>Devoluciones</h5>
            </div>
            <h2 className='accordion-header d-flex flex-column justify-content-xxl-center align-items-xxl-center align-self-xxl-center ms-4 me-4' id="panelsStayOpen-headingThree">
              <button className='accordion-button ps-0 pe-0 pt-2 pb-2 collapsed' type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false"
                aria-controls="panelsStayOpen-collapseFour">
              </button>
            </h2>
          </div>
          <div id="panelsStayOpen-collapseFour" className='accordion-collapse collapse' aria-labelledby="panelsStayOpen-headingFour">
            <div className='accordion-body'>
              <div className='row mt-4 mb-4'>
                <div className='col-12 d-flex flex-row justify-content-end align-items-center align-self-center'>
                  <form id='internal-form' action='' className='position-relative'>
                    <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                      <div className='col-auto d-flex flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-center align-items-center align-self-center me-auto'>
                        <label htmlFor="staticEmail" className='col-auto align-self-center align-self-sm-center align-self-md-center align-self-lg-center align-self-xl-center align-self-xxl-center mb-0 mb-sm-0 mb-md-0 mb-lg-0 mb-xl-0 mb-xxl-0 fs-5- ff-monse-regular- tx-light-black-'>Registros</label>
                        <div className='col-auto d-flex flex-row justify-content-start align-items-center align-self-center ms-2 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-2 ms-xxl-2 me-auto'>
                          <Select
                              id='customSelect'
                              options={CustomSelectRegisters}
                              components={{ animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }}
                              placeholder="#"
                              styles={selectRegistersStyles}
                              isClearable={true}
                              onChange={(event)=>cambiarItems11(event)}
                 
                            />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className='row mt-4 mb-4'>
                <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
                  <div className='card border-0 rounded-0 w-100 bg-transparent'>
                    <div className='card-body p-0 w-100'>
                      <div className='table-responsive table-general-'>
                        <table className='table table-sm table-striped table-no-border- align-middle'>
                          <thead>
                            <tr>
                              <th scope="col" className='th-width-sm-'>
                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                  <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>No. factura</span>
                                </div>
                              </th>
                              <th scope="col" className='th-width-md-'>
                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                  <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Entidad</span>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              slicedDatos11.map(list => (
                                <tr>
                                  <td className='align-middle'>
                                    <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.invoice_id }</p>
                                  </td>
                                  <td className='align-middle'>
                                    <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.entity_id }</p>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-4 mb-4'>
                <div className='col-12 d-flex flex-row justify-content-center align-items-center align-self-center'>
                  <Pagination
                    pageCount={pageCount11}
                    pageIndex={pageIndex11}
                    setPageIndex={setPageIndex11}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
    
  )
}
