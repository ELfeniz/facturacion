import React, { useState, useEffect, useContext } from 'react';
import Select, { components } from 'react-select'
import makeAnimated from 'react-select/animated';
import DatePicker from "react-multi-date-picker";
import Pagination from 'pagination-for-reactjs-component'
import "bootstrap/dist/css/bootstrap.min.css";
import { getActivitiesData, getEntitiesData } from '../../../../../services/dashboard/billing/admission/admission';
import { getWareLocation } from '../../../../../services/dashboard/inventory/inventory';
import { Appcontext } from '../../../../../appContext';
import Preloader from '../../../../shared/preloader/Preloader';
import { getMeds, postNewBill } from '../../../../../services/dashboard/billing/newBill/newBill';
import Swal from 'sweetalert2';

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

const LocationCity = [
  { value: "1", label: "Armenia" },
  { value: "2", label: "Manizales" }
];

const RegimeType = [
  { value: 'Contributivo - beneficiario', label: 'Contributivo - beneficiario' },
  { value: 'Subsidiado', label: 'Subsidiado' }
];

const BillType = [
  { value: 'Paciente', label: 'Paciente' },
  { value: 'Bloque', label: 'Bloque' }
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

/**
  * MESES Y DIAS EN ESPAÑOL PARA EL DATEPICKER
  */

const espanol_es_lowercase = {
  name: "espanol_es_lowercase",
  months: [
    ["Ene", "Ene"],
    ["Feb", "Feb"],
    ["Mar", "Mar"],
    ["Abr", "Abr"],
    ["May", "May"],
    ["Jun", "Jun"],
    ["Jul", "Jul"],
    ["Ago", "Ago"],
    ["Sep", "Sep"],
    ["Oct", "Oct"],
    ["Nov", "Nov"],
    ["Dic", "Dic"],
  ],
  weekDays: [
    ["Domingo", "Do"],
    ["Lunes", "Lu"],
    ["Martes", "Ma"],
    ["Miércoles", "Mi"],
    ["Jueves", "Ju"],
    ["Viernes", "Vi"],
    ["Sábado", "Sa"]
  ],
  digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  meridiems: [
    ["AM", "am"],
    ["PM", "pm"],
  ],
};

const weekDays = [
  ["Domingo", "Do"],
  ["Lunes", "Lu"],
  ["Martes", "Ma"],
  ["Miércoles", "Mi"],
  ["Jueves", "Ju"],
  ["Viernes", "Vi"],
  ["Sábado", "Sa"]
]

export default function NewBill() {
  const { entitiesBill, setEntitiesBill, activitiesServices, setActivitiesServices, setFlagBill, setFlagBillNumbers, Token } = useContext(Appcontext); 
  const [typeBill, setTypeBill] = useState('');
  const [names, setNames] = useState([]);
  const [locations,setLocations] = useState([]);
  const [ids, setIds] = useState([]);
  const [patientServices, setPatientServices] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [subList, setSubList] = useState([]);
  const [flag, setFlag] = useState(false);
  const [originalPatientServices, setOriginalPatientServices] = useState([]);
  const [firstData, setFirstData] = useState({
    dates: [],
    location: '',
    entity: '',
  });


    /// configuracion del año actual
    const currentYear = new Date().getFullYear();
    const placeholder = `01/01/${currentYear} ~ 31/12/${currentYear}`;

  const [filterData, setFilterData] = useState({
    dates: [],
    location: '',
    locationName: '',
    entity: '',
    ripsCode: '',
    patientName: '',
    patientIdentification: '',
    authorization: '',
    activity: '',
    activityName: '',
    regimeType: ''
  });
  const [charging, setCharging] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [show, setShow] = useState(5);
  const minDate = new Date(2021, 0, 1); // 1 de enero de 2021
  const maxDate = new Date(2023, 11, 31); // 31 de diciembre de 2023

  useEffect(() => {
    if (Token) {
      selectServices();
    }
  }, [Token]);

  useEffect(() => {
    if (pageIndex > 0) {
      obtainSubList();
    }
  }, [pageIndex]);

  const obtainSubList = () => {
    let index1 = (pageIndex - 1) * show;
    let index2 = pageIndex * show;
    let array = patientServices.slice(index1, index2);
    setSubList(array);
  };

  const selectServices = async () => {
    if (!entitiesBill) {
      await getEntities();
    }
    if (!activitiesServices) {
      await getActivities();
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
      console.log(data);
      data.map(id => {
        array.push({
          label: id.name,
          value: id.name,
          ripsCode: id.rips_code,
          nit: id.nit
        });
      });
      setEntitiesBill(array);
    }
    setCharging(false)
  };

  const getActivities = async () => {
    setCharging(true);
    let response = await getActivitiesData(Token).catch(() => {
      setCharging(false);
    });
    if (response) {
      let { data } = response;
      let array = [];
      data.map(id => {
        array.push({
          label: id.name,
          value: id.id
        });
      });
      setActivitiesServices(array);
    }
    setCharging(false)
  };

  const changeValue = ({ target }) => {
    setFilterData({
      ... filterData,
      [target.name]: target.value
    });
  };

  const changeDate = (e) => {
    setFilterData({
      ... filterData,
      dates: e
    });
  };

  const changeSelect = (e) => {
    if (e.name === 'location') {
      setFilterData({
        ... filterData, 
        location: e?.e?.value ? e.e.value : '',
        locationName: e?.e?.label ? e.e.label : ''
      });
    }
    else if (e.name === 'entity') {
      setFilterData({
        ... filterData,
        entity: e?.e?.value ? e.e.value : '',
        ripsCode: e?.e?.ripsCode ? e.e.ripsCode : ''
      });
    } else if (e.name === 'activity') {
      setFilterData({
        ... filterData,
        activity: e?.e?.value ? e.e.value : '',
        activityName: e?.e?.label ? e.e.label : ''
      });
    } else {
      setFilterData({
        ... filterData,
        [e.name]: e?.e?.value ? e.e.value : ''
      });
    }
  };

  console.log("filterData", filterData)
  const changeShow = (e) => {
    if (e) {
      let array = patientServices.slice(0, e.value);
      setShow(e.value);
      setSubList(array);
      setPageCount(Math.ceil((patientServices.length + 1) / e.value));
    } else {
      let array = patientServices.slice(0, 5);
      setShow(5);
      setSubList(array);
      setPageCount(Math.ceil((patientServices.length + 1) / 5));
    }
  };

  const changeCheck = (list, { target }) => {
    let subListIndex = subList.findIndex(sub => sub === list);
    let patientIndex = patientServices.findIndex(sub => sub === list);
    if (subListIndex > -1) {
      let object = {
        ... patientServices[patientIndex],
        [target.name]: target.checked
      };
      const totalSubList = subList.map((patient, i) => subListIndex === i ? object : patient);
      const totalPatients = patientServices.map((patient, i) => patientIndex === i ? object : patient);
      setSubList(totalSubList);
      setPatientServices(totalPatients);
      let i = 0;
      let bool = true;
      while (i < totalPatients.length && bool) {
        bool = totalPatients[i].checked ? false : true;
        i ++;
      }
      setButtonDisabled(bool);
    }
  };

  const conditions = () => {
    return filterData.dates?.length > 0 && filterData.location && filterData.entity;
  };

  const filterByData = async () => {
    setCharging(true);
    if (filterChanged()) {
      cleanDataPatient();
      let response = await getMeds(filterData, Token).catch((error) => {
        setCharging(false);
        Swal.fire({
          icon: 'error',
          text: 'Ocurrió un error. Vuelva a intentar',
        });
        setFlag(false);
        setPatientServices([]);
        console.log(response);
      });
      if (response) {
        console.log("response", response)
        let { data } = response;
        let { sale } = data;
        if (sale.length === 0) {
          Swal.fire({
            icon: 'info',
            text: 'No hay datos',
          });
          setPatientServices([]);
          setFlag(false);
          setPageCount(1);
          setSubList([]);
        } else {
          setFlag(true);
          setCharging(false);
          console.log("response", response)
          let array = [];
          let arrayNames = [];
          let arrayIds = [];
          sale.map(patient => {
            let patientName = patient.second_name && patient.second_name !== '' ? patient.name + ' ' + patient.second_name + ' ' + patient.last_name : patient.name + ' ' + patient.last_name;
            let indexName = arrayNames.find(name => name.label === patientName && name.value === patientName);
            let indexId = arrayIds.find(name => name.label === patientName && name.value === patientName);
            if (!indexName) {
              arrayNames.push({
                label: patientName,
                value: patientName
              });
            }
            if (!indexId) {
              arrayIds.push({
                label: patient.identification,
                value: patient.identification
              });
            }
            for (let index = 0; index < patient.service.length; index++) {
              array.push({
                ... patient.service[index],
                name: typeof(patient.service[index].name) === 'string' ? patient.service[index].name : patient.service[index].name.name,
                patient_id: patient.id,
                completeName: patientName, 
                first_name: patient.name,
                regime_type: patient.regime_type,
                identification: patient.identification,
                checked: false
              });            
            }
          });
          arrayNames = [... new Set(arrayNames)];
          setNames(arrayNames);
          array.reverse();
          console.log("PatientServices", array)
          setIds(arrayIds);
          setPatientServices(array);
          setOriginalPatientServices(array);
          let newArray = array.slice(0, show);
          console.log("SubList Patients", newArray);
          setSubList(newArray);
          let CantidadPaginas = array.length / show;
          if (!Number.isInteger(CantidadPaginas)) {
            setPageCount(Math.trunc(CantidadPaginas) + 1);
          } else {
            setPageCount(CantidadPaginas)
          }    
        }
        setFirstData({
          dates: filterData.dates,
          entity: filterData.entity,
          location: filterData.location
        });
      }
    } else {
      filterForPatient();
    }
    setCharging(false);
  };

  console.log("PatientServices", patientServices)
 

  const cleanDataPatient = () => {
    setFilterData({
      ... filterData,
      patientName: '',
      patientIdentification: '',
      authorization: '',
      activity: '',
      activityName: '',
      regimeType: '',
    });
  }

  const filterForPatient = () => {
    if (filterData.patientName || filterData.patientName !== '' || filterData.patientIdentification || filterData.patientIdentification !== '' || filterData.authorization || filterData.authorization !== '' || filterData.activity || filterData.activity !== '' || filterData.regimeType || filterData.regimeType !== '') {
      let array = originalPatientServices.map(patient => patient);
      array.map(arr => {
        console.log(arr.name, arr.regime_type);
      })
      if (filterData.patientName && filterData.patientName !== '') {
        array = array.filter(patient => patient.completeName === filterData.patientName);
      }
      if (filterData.patientIdentification && filterData.patientIdentification !== '') {
        array = array.filter(patient => patient.identification === filterData.patientIdentification);
      }
      if (filterData.authorization && filterData.authorization !== '') {
        array = array.filter(patient => patient.authorization_id === filterData.authorization);
      }
      if (filterData.activity && filterData.activity !== '') {
        array = array.filter(patient => patient.name === filterData.activityName);
      }
      if (filterData.regimeType && filterData.regimeType !== '') {
        if (filterData.regimeType === 'Contributivo - beneficiario') {
          array = array.filter(patient => patient.regime_type.toUpperCase() === 'CONTRIBUTIVO' || patient.regime_type.toUpperCase() === 'BENEFICIARIO');
        } else {          
          array = array.filter(patient => patient.regime_type.toUpperCase() === filterData.regimeType.toUpperCase());
        }
      }
      setPatientServices(array);
      let newArray = array.slice(0, show);
      setSubList(newArray);
      let CantidadPaginas = array.length / show;
      if (!Number.isInteger(CantidadPaginas)) {
        setPageCount(Math.trunc(CantidadPaginas) + 1);
      } else {
        setPageCount(CantidadPaginas);
      }    
    } else {
      setPatientServices(originalPatientServices);
      setSubList(originalPatientServices.slice(0, show));
      let CantidadPaginas = originalPatientServices.length / show;
      if (!Number.isInteger(CantidadPaginas)) {
        setPageCount(Math.trunc(CantidadPaginas) + 1);
      } else {
        setPageCount(CantidadPaginas)
      }    
    }
  };

  const filterChanged = () => {
    return filterData.dates[0] !== firstData.dates[0] || filterData.dates[1] !== firstData.dates[1] || filterData.entity !== firstData.entity || filterData.location !== firstData.location;
  };

  const changeSpecificValue = ({ target }, bill) => {
    let index = patientServices.findIndex(credit => credit === bill);
    let indexList = subList.findIndex(credit => credit === bill);
    let object = bill;
    if (target.name === 'amount' || target.name === 'unit_price') {
      let value = target.name === 'amount' ? parseInt(target.value) * parseInt(object.unit_price) : parseInt(target.value) * parseInt(object.amount);
      object = {
        ... object,
        [target.name]: target.value,
        total_price: value
      };
    } else {
      object = {
        ... object,
        [target.name]: target.value
      };
    }
    let totalSubList = subList.map((order, i) => indexList === i ? object : order);
    let totalInvoices = patientServices.map((order, i) => index === i ? object : order);
    setPatientServices(totalInvoices);
    setSubList(totalSubList);
  };

  console.log("patientServices", patientServices)

  const newBillService = async () => {
    let uniquePatientIds = new Set(); // Usar un Set para manejar IDs únicos
    let arrayPatientsInvoice = [];
  
    // Filtrar los servicios por cada paciente y construir la factura
   // Filtrar los servicios por cada paciente y construir la factura
  patientServices.forEach((service) => {
    if (service.checked) {
      uniquePatientIds.add(service.patient_id);
    }
  });

  uniquePatientIds.forEach((patientId) => {
    let servicesToInvoice = patientServices
      .filter((service) => service.patient_id === patientId && service.checked)
      .map((service) => ({
        name: service.name,
        unit_price: service.unit_price,
        amount: service.amount,
        copay: service.copay,
        moderator_fee: service.moderator_fee,
        total_price: service.total_price,
        appointment_id: service.appointment_id,
        authorization_id: service.authorization_id,
        retention_value: service.retention_value,
      }));

    if (servicesToInvoice.length > 0) {
      arrayPatientsInvoice.push({
        patient_id: patientId,
        services_invoice: servicesToInvoice,
      });
    }
  });
  
    setCharging(true);
    console.log("arrayPatientsInvoice,", arrayPatientsInvoice);
    let response = await postNewBill(filterData, arrayPatientsInvoice, typeBill, Token).catch(() => {
      setCharging(false);
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error. Vuelva a intentar',
      });
    });
    
    if (response) {
      setCharging(false);
    
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: 'success',
          text: 'Factura(s) guardada(s) con éxito',
        });
        // Reinicia los estados solo si la respuesta es 200
        setFlagBill(true);
        setFlagBillNumbers(true);
        setOriginalPatientServices([]);
        setPatientServices([]);
        setSubList([]);
        setTypeBill('');
        setPageIndex(1);
        setPageCount(1); 
        cleanData();
      } else if (response.status === 400) {
        Swal.fire({
          icon: 'error',
          text: 'Ocurrió un error con la solicitud.',
        });
        // Aquí puedes manejar el caso para el estado 400 sin reiniciar los estados
      }
    }
    
  };

  const cleanData = () => {
    setFilterData({
      dates: [],
      location: '',
      locationName: '',
      entity: '',
      ripsCode: '',
      patientName: '',
      patientIdentification: '',
      authorization: '',
      activity: '',
      activityName: '',
      regimeType: ''
    });
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
  };

  const cleanDataButton = () => {
    setFilterData({
      ... filterData,
      patientName: '',
      patientIdentification: '',
      authorization: '',
      activity: '',
      activityName: '',
      regimeType: ''
    });
  };
  
  
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
          <h2 className='m-0 p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>Factura</h2>
        </div>
      </div>
      <div className='row mt-4 mb-4'>
        <div className='col-12'>
          <form id='internal-form' action='' className='position-relative'>
            <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <div className='form-control'>
                    <DatePicker
                      range
                      numberOfMonths={2}
                      inputClass="custom-style-date-picker-"
                      placeholder='dd-mm-yy ~ dd-mm-yy'
                      weekDays={weekDays}
                      locale={espanol_es_lowercase}
                      format="YYYY-MM-DD"
                      minDate={minDate}
                      maxDate={maxDate}
                      calendarPosition="bottom-left"
                      showOtherDays={true}
                      fixMainPosition={true}
                      shadow={true}
                      animation={true}
                      arrowStyle={{
                        display: "none"
                      }}
                      value={ filterData.dates }
                      onChange={changeDate}
                    />
                  </div>
                  <label className='fs-5- ff-monse-regular-'>Rango de fecha</label>
                  <i className='fa icon-date fs-xs'></i>
                </div>
              </div>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={locations} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Localidad" styles={selectStyles} isClearable={true} value={filterData.location ? {value: filterData.location, label: filterData.locationName} : null} name='location' onChange={(e) => changeSelect({ e, name: 'location' }) } />
                  <i className='fa icon-select fs-xs'></i>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='row mt-4 mb-4'>
        <div className='col-12'>
          <h2 className='m-0 p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>Entidades</h2>
        </div>
      </div>
      <div className='row mt-4 mb-4'>
        <div className='col-12'>
          <form id='internal-form' action='' className='position-relative'>
            <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={entitiesBill} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Entidad" styles={selectStyles} isClearable={true} value={filterData.entity ? {value: filterData.entity, label: filterData.entity} : null} name='entity' onChange={(e) => changeSelect({ e, name: 'entity' }) } />
                  <i className='fa icon-entity fs-xs'></i>
                </div>
              </div>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <input type="text" className='form-control' placeholder="Código RIPS" name='ripsCode' value={filterData.ripsCode} disabled />
                  <label className='fs-5- ff-monse-regular-'>Código RIPS</label>
                  <i className='fa icon-presentation fs-xs'></i>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='row mt-4 mb-4'>
        <div className='col-12'>
          <h2 className='m-0 p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>Pacientes</h2>
        </div>
      </div>
      <div className='row mt-4 mb-4'>
        <div className='col-12'>
          <form id='internal-form' action='' className='position-relative'>
            <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={names} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Nombre" styles={selectStyles} isClearable={true} value={filterData.patientName ? {value: filterData.patientName, label: filterData.patientName} : null} name='patientName' onChange={(e) => changeSelect({ e, name: 'patientName' }) } isDisabled={!flag} />
                  <i className='fa icon-select fs-xs'></i>
                </div>
              </div>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={ids} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Tipo de Identificación" styles={selectStyles} isClearable={true} value={filterData.patientIdentification ? {value: filterData.patientIdentification, label: filterData.patientIdentification} : null} name='patientIdentification' onChange={(e) => changeSelect({ e, name: 'patientIdentification' }) } isDisabled={!flag} />
                  <i className='fa icon-id-type fs-xs'></i>
                </div>
              </div>
            </div>
            <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <input type="text" className='form-control' placeholder="Autorización" name='authorization' value={filterData.authorization} onChange={changeValue} disabled={!flag} />
                  <label className='fs-5- ff-monse-regular-'>Autorización</label>
                  <i className='fa icon-data-value fs-xs'></i>
                </div>
              </div>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={activitiesServices} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Procedimiento" styles={selectStyles} isClearable={true} value={filterData.activity ? {value: filterData.activity, label: filterData.activityName} : null} name='activity' onChange={(e) => changeSelect({ e, name: 'activity' }) } isDisabled={!flag} />
                  <i className='fa icon-procedure fs-xs'></i>
                </div>
              </div>
            </div>
            <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={RegimeType} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Régimen" styles={selectStyles} isClearable={true} value={filterData.regimeType ? {value: filterData.regimeType, label: filterData.regimeType} : null} name='regimeType' onChange={(e) => changeSelect({ e, name: 'regimeType' }) } isDisabled={!flag} />
                  <i className='fa icon-select fs-xs'></i>
                </div>
              </div>
            </div>
            <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-4 mb-0'>
              <div className='col-auto'>
                <button className='btn rounded-pill ps-3 pe-3 ps-sm-3 pe-sm-3 ps-md-3 pe-md-3 ps-lg-5 pe-lg-5 ps-xl-5 pe-xl-5 ps-xxl-5 pe-xxl-5 h-45- d-flex flex-row justify-content-center align-items-center align-self-center btn-red- bs-1-' type="button" onClick={cleanDataButton} >
                  <i className='fa icon-eraser me-0 me-sm-0 me-md-2 me-lg-2 me-xl-2 me-xxl-2'></i><span className='lh-1 fs-5- ff-monse-regular- d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block'>Limpiar</span>
                </button>
              </div>
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
      <div className='row mt-4 mb-4'>
        <div className='col-12'>
          <p className='m-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>Lista de facturas</p>
        </div>
      </div>
      <div className='row mt-4 mb-4'>
        <div className='col-12'>
          <form id='internal-form' action='' className='position-relative'>
            <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                <div className='form-floating inner-addon- left-addon-'>
                  <Select id='customSelect' options={BillType} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Tipo de factura" styles={selectStyles} isClearable={true} value={typeBill ? {value: typeBill, label: typeBill}: null} name='typeBill' onChange={(e) => setTypeBill(e?.value ? e.value : '') } />
                  <i className='fa icon-select fs-xs'></i>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
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
                    <th scope="col" className='th-width-xs-'>
                      <div className='d-flex flex-row justify-content-start align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'></span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-md-'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Paciente</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-sm-'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Autorización</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-md-'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Procedimiento</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-sm-'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Cantidad</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-sm-'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Valor unitario</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-sm-'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Retención</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-sm-'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Copago</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-sm-'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Cuota moderadora</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-sm-'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Valor</span>
                      </div>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                    {
                      subList.map((patient, key) => (
                        <tr key={key}>
                          <td className='align-middle'>
                            <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                              <div className='checks-radios-'>
                                <label>
                                  <input type="checkbox" name="checked" checked={patient.checked} onClick={ (e) => changeCheck(patient, e) } />
                                  <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                                </label>
                              </div>
                            </div>
                          </td>
                          <td className='align-middle'>
                            <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ patient.completeName }</p>
                          </td>
                          <td className='align-middle'>
                            <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ patient.authorization_id }</p>
                          </td>
                          <td className='align-middle'>
                            <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ patient.name }</p>
                          </td>
                          <td className='align-middle'>
                            <div id='internal-form' className='w-100'>
                              <input type="number" className='form-control p-0 text-center input-large-' placeholder='Campo editable' name='amount' value={patient.amount} onChange={(e) => changeSpecificValue(e, patient)} disabled={!patient.checked} />
                            </div>
                          </td>
                          <td className='align-middle'>
                            <div id='internal-form' className='w-100'>
                              <input type="number" className='form-control p-0 text-center input-large-' placeholder='Campo editable' name='unit_price' value={patient.unit_price} onChange={(e) => changeSpecificValue(e, patient)} disabled={!patient.checked} />
                            </div>
                          </td>
                          <td className='align-middle'>
                            <div id='internal-form' className='w-100'>
                              <input type="number" className='form-control p-0 text-center input-large-' placeholder='Campo editable' name='retention_value' value={patient.retention_value} onChange={(e) => changeSpecificValue(e, patient)} disabled={!patient.checked} />
                            </div>
                          </td>
                          <td className='align-middle'>
                            <div id='internal-form' className='w-100'>
                              <input type="number" className='form-control p-0 text-center input-large-' placeholder='Campo editable' name='copay' value={patient.copay} onChange={(e) => changeSpecificValue(e, patient)} disabled={!patient.checked} />
                            </div>
                          </td>
                          <td className='align-middle'>
                            <div id='internal-form' className='w-100'>
                              <input type="number" className='form-control p-0 text-center input-large-' placeholder='Campo editable' name='moderator_fee' value={patient.moderator_fee} onChange={(e) => changeSpecificValue(e, patient)} disabled={!patient.checked} />
                            </div>
                          </td>
                          <td className='align-middle'>
                            <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ patient.total_price }</p>
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
            pageCount={pageCount}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
          />
        </div>
      </div>
      <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-4 mb-4'>
        <div className='col-auto'>
          <button className='btn rounded-pill ps-3 pe-3 ps-sm-3 pe-sm-3 ps-md-3 pe-md-3 ps-lg-5 pe-lg-5 ps-xl-5 pe-xl-5 ps-xxl-5 pe-xxl-5 h-45- d-flex flex-row justify-content-center align-items-center align-self-center btn-dark-purple- bs-1-' type="button" disabled={buttonDisabled || !typeBill} onClick={newBillService} >
              <i className='fa icon-save fs-xs me-0 me-sm-0 me-md-2 me-lg-2 me-xl-2 me-xxl-2'></i>
              <span className='lh-1 fs-5- ff-monse-regular- d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block'>Guardar</span>
          </button>
        </div>
      </div>
      <div className='modal animated fade fast' id="retention" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className='modal-dialog modal-dialog-centered' role="document">
          <div className='modal-content p-0 ps-4 pe-4'>
            <div className='modal-header'>
              <h5 className='modal-title lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>Retención y otros descuentos</h5>
              <button type="button" className='btn-close' data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className='modal-body position-relative'>
              <div className='row'>
                <div className='col-12'>
                  <form id='internal-form-modals' className='w-100" autocomplete="nope'>
                    <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                      <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                        <div className='form-floating inner-addon- left-addon-'>
                          <input type="number" className='form-control' placeholder="% de retención" name='retention' />
                          <label className='fs-5- ff-monse-regular-'>% de retención</label>
                          <i className='fa icon-data-value fs-xs'></i>
                        </div>
                      </div>
                    </div>
                    <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                      <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                        <div className='form-floating inner-addon- left-addon-'>
                          <Select id='customSelect' options={CustomSelect} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Otros descuentos" styles={selectStyles} 
                           isClearable={true} />
                          <i className='fa icon-select fs-xs'></i>
                        </div>
                      </div>
                    </div>
                    <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                      <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                        <div className='form-floating inner-addon- left-addon-'>
                          <input type="number" className='form-control' placeholder="Valor de descuento" name='discount' />
                          <label className='fs-5- ff-monse-regular-'>Valor de descuento</label>
                          <i className='fa icon-data-value fs-xs'></i>
                        </div>
                      </div>
                    </div>
                    <div className='row gx-2 d-flex flex-row justify-content-center align-items-start align-self-start mt-2 mb-2'>
                      <div className='col-auto'>
                        <button className='btn rounded-pill p-2 ps-3 pe-3 ps-sm-3 pe-sm-3 ps-md-3 pe-md-3 ps-lg-3 pe-lg-3 ps-xl-3 pe-xl-3 ps-xxl-4 pe-xxl-4 h-40- d-flex flex-row justify-content-center align-items-center align-self-center btn-dark-purple- bs-1-' type="button" >
                          <span className='lh-1 fs-6- ff-monse-regular-'>Guardar</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}