import React, { useState, useEffect, useContext } from 'react'
import Select, { components } from 'react-select'
import makeAnimated from 'react-select/animated';
import DatePicker from "react-multi-date-picker";
import Pagination from 'pagination-for-reactjs-component'
import "bootstrap/dist/css/bootstrap.min.css";
import Swiper, { Manipulation, FreeMode } from 'swiper';
import { getEntitiesData } from '../../../../../services/dashboard/billing/admission/admission';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Appcontext } from '../../../../../appContext';
import { deleteRips, generateRipsBills, getGeneratedRipsData, getRipsData } from '../../../../../services/dashboard/billing/rips/rips';
import Swal from 'sweetalert2';
import Preloader from '../../../../shared/preloader/Preloader';
import FileSaver from 'file-saver';

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

export default function Rips() {
  const { entitiesBill, setEntitiesBill, Token } = useContext(Appcontext);
  const [ripGenerateds, setRipGenerateds] = useState([]);
  const [filteredRips, setFilteredRips] = useState([]);
  const [ripEntities, setRipEntities] = useState([]);
  const [tab, setTab] = useState('Pendientes');
  const [subList, setSubList] = useState([]);
  const [subListRips, setSubListRips] = useState([]);
  const [subListEntities, setSubListEntities] = useState([]);
  const [rips, setRips] = useState([]);
  const [allRips, setAllRips] = useState([]);
  const [charging, setCharging] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [show, setShow] = useState(5);
  const [pageIndexRips, setPageIndexRips] = useState(1);
  const [pageCountRips, setPageCountRips] = useState(1);
  const [showRips, setShowRips] = useState(5);
  const [pageIndexEntities, setPageIndexEntities] = useState(1);
  const [pageCountEntities, setPageCountEntities] = useState(1);
  const [showEntities, setShowEntities] = useState(5);
  const [selectedDates, setSelectedDates] = useState([]);
  const [generalCheck, setGeneralCheck] = useState(false);
  const [checkRip, setCheckRip] = useState(false);
  const [filterData, setFilterData] = useState({
    dates: [],
    entity: '',
    ripsCode: ''
  });
  const [firstData, setFirstData] = useState({
    dates: [],
    entity: '',
    ripsCode: ''
  });
  const [generateRip, setGenerateRip] = useState({
    code: '',
    options: {
      Ac: false,
      At: false,
      Ap: false,
      Af: false,
      Ct: false,
      Ad: false,
      Us: false,
      Am: false
    }
  });

  // configuracion del año actual
  const currentYear = new Date().getFullYear();
  const placeholder = `01/01/${currentYear} ~ 31/12/${currentYear}`;

  const [findRips, setFindRips] = useState('');
  const minDate = new Date(2021, 0, 1); // 1 de enero de 2021
  const maxDate = new Date(2023, 11, 31); // 31 de diciembre de 2023

  useEffect(() => {
    new Swiper('#wrapper-state-rips-nav-', {
      modules: [Manipulation, FreeMode],
      slidesPerView: "auto",
      spaceBetween: 10,
      grabCursor: true,
      freeMode: {
        enabled: true
      },
      breakpoints: {
        320: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
        576: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
        768: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
        992: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
        1200: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
        1400: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
        1920: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
      }
    });
  }, []);

  /*useEffect(() => {
    getEntities();
    selectServices();
  }, []);*/
  
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

  useEffect(() => {
    if (pageIndex > 0) {
      obtainSubListRips();
    }
  }, [pageIndexRips]);

  useEffect(() => {
    if (pageIndex > 0) {
      obtainSubListEntities();
    }
  }, [pageIndexEntities]);

  const obtainSubList = () => {
    let index1 = (pageIndex - 1) * show;
    let index2 = pageIndex * show;
    let array = allRips.slice(index1, index2);
    setSubList(array);
  };

  const obtainSubListRips = () => {
    let index1 = (pageIndexRips - 1) * showRips;
    let index2 = pageIndexRips * showRips;
    let array = filteredRips.slice(index1, index2);
    setSubListRips(array);
  };

  const obtainSubListEntities = () => {
    let index1 = (pageIndexEntities - 1) * showEntities;
    let index2 = pageIndexEntities * showEntities;
    let array = ripEntities.slice(index1, index2);
    setSubListEntities(array);
  };

  const selectServices = async () => {
    if (!entitiesBill) {
      await getEntities();
    } else {
      fillRips();
    } await getGeneratedRips();
  };

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
      setRips(ripsArray);
      setEntitiesBill(array);
      setCharging(false);
    }
  };

  const getGeneratedRips = async () => {
    setCharging(true);
    let response = await getGeneratedRipsData(Token).catch(() => {
      setCharging(false);
    });
    if (response) {
      let { data } = response;
      let array = [];
      data.map(list => {
        array.push({
          ... list,
          checked: false
        });
      });
      array.reverse();
      setRipGenerateds(array);
      setFilteredRips(array);
      setSubListRips(array.slice(0, showRips));
      setPageCountRips(Math.ceil(data.length / show));
      setCharging(false);
    }
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

    setRips(filt);
  };

  const changeValue = ({ target }) => {
    setGenerateRip({
      ... generateRip,
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

  const changeShow = (e) => {
    if (e) {
      let array = allRips.slice(0, e.value);
      setShow(e.value);
      setSubList(array);
      setPageCount(Math.ceil((allRips.length) / e.value));
    } else {
      let array = allRips.slice(0, 5);
      setShow(5);
      setSubList(array);
      setPageCount(Math.ceil((allRips.length) / 5));
    }
  };

  const changeShowRips = (e) => {
    if (e) {
      let array = filteredRips.slice(0, e.value);
      setShowRips(e.value);
      setSubListRips(array);
      setPageCountRips(Math.ceil((filteredRips.length) / e.value));
    } else {
      let array = filteredRips.slice(0, 5);
      setShowRips(5);
      setSubListRips(array);
      setPageCountRips(Math.ceil((filteredRips.length) / 5));
    }
  };

  const changeShowEntities = (e) => {
    if (e) {
      let array = ripEntities.slice(0, e.value);
      setShowEntities(e.value);
      setSubListEntities(array);
      setPageCountEntities(Math.ceil((ripEntities.length) / e.value));
    } else {
      let array = ripEntities.slice(0, 5);
      setShowEntities(5);
      setSubListEntities(array);
      setPageCountEntities(Math.ceil((ripEntities.length) / 5));
    }
  };

  const changeCheck = (order, { target }) => {
    let index = allRips.findIndex(proced => proced === order);
    let indexList = subList.findIndex(proced => proced === order);
    let object = order;
    object = {
      ... object,
      [target.name]: target.checked
    };
    let array = allRips.map(proced => proced);
    array[index] = {
      ... array[index],
      [target.name]: target.checked
    };
    let i = 0;
    let bool = false;
    while (i < array.length && !bool) {
      bool = array[i].checked;
      i ++;
    }
    setGeneralCheck(bool);
    let totalSubList = subList.map((order, i) => indexList === i ? object : order);
    let totalRips = allRips.map((order, i) => index === i ? object : order);
    setSubList(totalSubList);
    setAllRips(totalRips);
  };

  const changeCheckRips = (list, { target }) => {
    let index = ripGenerateds.findIndex(proced => proced === list);
    let indexFiltered = filteredRips.findIndex(proced => proced === list);
    let indexList = subListRips.findIndex(proced => proced === list);
    let array = ripGenerateds.map(rip => rip);
    let arrayFiltered = filteredRips.map(rip => rip);
    let arrayList = subListRips.map(rip => rip);
    for (let i = 0; i < array.length; i++) {
      array[i].checked = index === i ? target.checked : false;
    }
    for (let i = 0; i < arrayFiltered.length; i++) {
      arrayFiltered[i].checked = indexFiltered === i ? target.checked : false;
    }
    for (let i = 0; i < arrayList.length; i++) {
      arrayList[i].checked = indexList === i ? target.checked : false;
    }
    setSubListRips(arrayList);
    setFilteredRips(arrayFiltered);
    setRipGenerateds(array);
    changeEntitiesList(index, target.checked);
  };

  const changeEntitiesList = (index, check) => {
    if (!check) {
      setRipEntities([]);
      setSubListEntities([]);
      setCheckRip(false);
    } else {
      let array = [];
      ripGenerateds[index].invoices.map(list => {
        array.push({
          invoice: list.invoice_id,
          entity: list.entity_id
        });
      });
      setRipEntities(array);
      setSubListEntities(array);
      setCheckRip(true);
    }
  };

  const changeCheckOptions = ({ target }) => {
    setGenerateRip({
      ... generateRip,
      options: {
        ... generateRip.options,
        [target.name]: target.checked
      }
    });
  };

  const changeTab = (tabName) => {
    setTab(tabName);
    if (tabName === 'Generados') {
      setFilterData({
        dates: [],
        entity: '',
        ripsCode: ''
      });
    }
  };

  const changeFilter = ({ target }) => {
    setFindRips(target.value);
    if (target.value !== '') {
      let otherSubList = [];
      for (let index = 0; index < ripGenerateds.length; index++) {
        let keys = Object.keys(ripGenerateds[index]);
        let flagKeys = false;
        let i = 0;
        while (i < keys.length && !flagKeys) {
          if (keys[i] !== 'id' && keys[i] !== 'checked' && keys[i] !== 'document' && keys[i] !== 'invoices') {
            let word = '' + ripGenerateds[index][keys[i]];
            let words = word.split(' ');
            let j = 0;
            while (j < words.length && !flagKeys) {
              if (words[j].toUpperCase().includes(target.value.toUpperCase())) {
                flagKeys = true;
              }
              j ++;
            }
            if (target.value.toUpperCase() === word.substring(0, target.value.length).toUpperCase()) {
              flagKeys = true;
            }
          } else if (keys[i] === 'invoices') {
            let word = '' + ripGenerateds[index].invoices[0]?.entity_id;
            let words = word.split(' ');
            let j = 0;
            while (j < words.length && !flagKeys) {
              if (words[j].toUpperCase().includes(target.value.toUpperCase())) {
                flagKeys = true;
              }
              j ++;
            }
            if (target.value.toUpperCase() === word.substring(0, target.value.length).toUpperCase()) {
              flagKeys = true;
            }
          } 
          if (flagKeys) {
            otherSubList.push(ripGenerateds[index]);
          } 
          i ++;
        }
      }      
      setSubListRips(otherSubList.slice(0, showRips));
      setFilteredRips(otherSubList);
      let CantidadPaginas = otherSubList.lengt / showRips;
        if (!Number.isInteger(CantidadPaginas)) {
          setPageCountRips(Math.trunc(CantidadPaginas) + 1);
        } else {
          setPageCountRips(CantidadPaginas)
        }    
      
    } else {
      setSubListRips(ripGenerateds.slice(0, showRips));
      setFilteredRips(ripGenerateds);
      let CantidadPaginas = ripGenerateds.length / showRips;
      if (!Number.isInteger(CantidadPaginas)) {
        setPageCountRips(Math.trunc(CantidadPaginas) + 1);
      } else {
        setPageCountRips(CantidadPaginas)
      }    
    
    }

  };

  const filterChanged = () => {
    return filterData.dates[0] !== firstData.dates[0] || filterData.dates[1] !== firstData.dates[1] || filterData.entity !== firstData.entity || filterData.ripsCode !== firstData.ripsCode;
  };

  const conditions = () => {
    return filterData.dates?.length > 0 && filterData.ripsCode && filterData.entity;
  };

  const conditionsRips = () => {
    let { options } = generateRip;
    return generalCheck && generateRip.code !== '' && (options.Ac || options.Ad || options.Af || options.Am || options.Ap || options.At || options.Ct || options.Us);
  };

  const filterByData = async () => {
    if (filterChanged()) {
      setCharging(true);
      let response = await getRipsData(filterData, Token).catch((error) => {
        Swal.fire({
          icon: 'error',
          text: 'Ocurrió un error. Vuelva a intentar',
        });
        setCharging(false);
        setAllRips([]);
      });
      if (response) {
        let { data } = response;
        if (data.length === 0) {
          Swal.fire({
            icon: 'info',
            text: 'No hay datos',
          });
          setAllRips([]);
          setPageCount(1);
          setSubList([]);
        } else {
          let array = [];
          data.map(bill => {
            array.push({
              invoice: bill.invoice_id,
              entity: bill.entity_id,
              date: bill.registration_date,
              checked: false
            });
          });
          setAllRips(array);
          let CantidadPaginas = array.length / show;
          if (!Number.isInteger(CantidadPaginas)) {
            setPageCount(Math.trunc(CantidadPaginas) + 1);
          } else {
            setPageCount(CantidadPaginas)
          }    
          setSubList(array.slice(0, show));
        }
        setFirstData({
          dates: filterData.dates,
          entity: filterData.entity,
          ripsCode: filterData.location
        });
        setCharging(false);
      }
    }
  };

  const generateRips = async () => {
    setCharging(true);
    let response = await generateRipsBills(allRips, generateRip, Token).catch((e) => {
      console.log(e)
      Swal.fire({
        icon: 'error',
        text: 'Ha ocurrido un error',
      });
      setCharging(false);
    });
    if (response) {
      setCharging(false);
      await getGeneratedRips();
      setGeneralCheck(false);
      setFilterData({
        dates: [],
        entity: '',
        ripsCode: ''
      });
      setFirstData({
        dates: [],
        entity: '',
        ripsCode: ''
      });
      setGenerateRip({
        code: '',
        options: {
          Ac: false,
          At: false,
          Ap: false,
          Af: false,
          Ct: false,
          Ad: false,
          Us: false,
          Am: false
        }
      });
      setSubList([]);
      setPageCount(1);
      setAllRips([]);
      FileSaver.saveAs(response.data.document, 'Archivo', { autoBom: true });

      Swal.fire({
        icon: 'success',
        text: 'Rip generado correctamente',
      });
    }
  };

  const deleteRip = async () => {
    Swal.fire({
      text: 'Seguro que desea eliminar el RIP?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCharging(true);
        let id = ripGenerateds.filter(list => list.checked === true);
        let ids = [];
        id.map(list => {
          ids.push(list.id);
        });
        let response = await deleteRips(ids, Token).catch(() => {
          Swal.fire({
            icon: 'error',
            text: 'Ha ocurrido un error',
          });
          setCharging(false);
        });
        if (response) {
          setCheckRip(false);
          setCharging(false);
          setSubListEntities([]);
          setRipEntities([]);
          await getGeneratedRips();
          Swal.fire({
            icon: 'success',
            text: 'Rip eliminado correctamente',
          });
        }
      }
    });
  };

  const downloadFile = () => {
    let file = ripGenerateds.find(list => list.checked === true);
    let document = file.document;
    FileSaver.saveAs(document, 'Archivo');
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
      <div className='row mt-2 h-22-'>
        <div className='col-12'>
          <h2 className='m-0 p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>RIPS</h2>
        </div>
      </div>
      <div className='row mt-0 mt-sm-0 mt-md-3 mt-lg-3 mt-xl-3 mt-xxl-3'>
        <div className='col-12'>
          <div id='wrapper-state-rips-nav-' className='swiper justify-content-start align-items-center align-self-center wrapper-horizontal-slide- pt-2 pb-2'>
            <div className='swiper-wrapper ps-0'>
              <div className='swiper-slide'>
                <div className='w-auto'>
                  <input type="radio" className='btn-check' name="options-outlined" id="rips-state-1" defaultChecked onClick={() => changeTab('Pendientes')} />
                  <label className='btn rounded-pill btn-transparent- btn-radio- bs-1-' htmlFor="rips-state-1">Pendientes</label>
                </div>
              </div>
              <div className='swiper-slide'>
                <div className='w-auto'>
                  <input type="radio" className='btn-check' name="options-outlined" id="rips-state-2" onClick={() => changeTab('Generados')} />
                  <label className='btn rounded-pill btn-transparent- btn-radio- bs-1-' htmlFor="rips-state-2">Generados</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        tab === 'Pendientes'
        ?
        <>
          <div className='row mt-4 mb-4'>
            <div className='col-12'>
              <form id='internal-form' action='' className='position-relative'>
                <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
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
                      <Select id='customSelect' options={rips} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Código RIPS" styles={selectStyles} isClearable={true} value={filterData.ripsCode ? {value: filterData.ripsCode, label: filterData.ripsCode} : null} name='ripsCode' onChange={(e) => changeSelect({ e, name: 'ripsCode' }) } />
                      <i className='fa icon-select fs-xs'></i>
                    </div>
                  </div>
                </div>
                <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating inner-addon- left-addon-'>
                      <Select id='customSelect' options={entitiesBill} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Entidad" styles={selectStyles} isClearable={true} value={filterData.entity ? {value: filterData.entity, label: filterData.entity} : null} name='entity' onChange={(e) => changeSelect({ e, name: 'entity' }) } />
                      <i className='fa icon-entity fs-xs'></i>
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
          <div className='row mt-4 mb-4'>
            <div className='col-12'>
              <p className='m-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>Lista de facturas</p>
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
                          <th scope="col" className='th-width-sm-'>
                            <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                              <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>No. Factura</span>
                            </div>
                          </th>
                          <th scope="col" className='th-width-md-'>
                            <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                              <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Entidad</span>
                            </div>
                          </th>
                          <th scope="col" className='th-width-md-'>
                            <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                              <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Fecha de registro</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          subList.map(bill => (
                            <tr key={bill.invoice}>
                              <td className='align-middle'>
                                <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                                  <div className='checks-radios-'>
                                    <label>
                                      <input type="checkbox" name="checked" onClick={(e) => changeCheck(bill, e)} checked={bill.checked} />
                                      <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                                    </label>
                                  </div>
                                </div>
                              </td>
                              <td className='align-middle'>
                                <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ bill.invoice }</p>
                              </td>
                              <td className='align-middle'>
                                <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ bill.entity }</p>
                              </td>
                              <td className='align-middle'>
                                <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ bill.date }</p>
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
          <div className='row g-2 row row-cols-auto d-flex flex-wrap justify-content-center align-items-center align-self-center mt-4 mb-4'>
            <div className='col'>
              <div className='checks-radios-'>
                <label>
                  <input type="checkbox" name="Ac"  onClick={changeCheckOptions} checked={generateRip.options.Ac?true:false} />
                  <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'>Ac</span>
                </label>
              </div>
            </div>
            <div className='col'>
              <div className='checks-radios-'>
                <label>
                  <input type="checkbox" name="At" onClick={changeCheckOptions} checked={generateRip.options.At?true:false} />
                  <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'>At</span>
                </label>
              </div>
            </div>
            <div className='col'>
              <div className='checks-radios-'>
                <label>
                  <input type="checkbox" name="Ap" onClick={changeCheckOptions} checked={generateRip.options.Ap?true:false} />
                  <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'>Ap</span>
                </label>
              </div>
            </div>
            <div className='col'>
              <div className='checks-radios-'>
                <label>
                  <input type="checkbox" name="Af" onClick={changeCheckOptions} checked={generateRip.options.Af?true:false} />
                  <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'>Af</span>
                </label>
              </div>
            </div>
            <div className='col'>
              <div className='checks-radios-'>
                <label>
                  <input type="checkbox" name="Ct" onClick={changeCheckOptions} checked={generateRip.options.Ct?true:false} />
                  <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'>Ct</span>
                </label>
              </div>
            </div>
            <div className='col'>
              <div className='checks-radios-'>
                <label>
                  <input type="checkbox" name="Ad" onClick={changeCheckOptions} checked={generateRip.options.Ad?true:false} />
                  <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'>Ad</span>
                </label>
              </div>
            </div>
            <div className='col'>
              <div className='checks-radios-'>
                <label>
                  <input type="checkbox" name="Us" onClick={changeCheckOptions} checked={generateRip.options.Us?true:false} />
                  <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'>Us</span>
                </label>
              </div>
            </div>
            <div className='col'>
              <div className='checks-radios-'>
                <label>
                  <input type="checkbox" name="Am" onClick={changeCheckOptions} checked={generateRip.options.Am?true:false} />
                  <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'>Am</span>
                </label>
              </div>
            </div>
          </div>
          <div className='row mt-4 mb-4'>
            <div className='col-12'>
              <form id='internal-form' action='' className='position-relative'>
                <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating inner-addon- left-addon-'> 
                      <input type="text" className='form-control' placeholder="Código de salida" name='code' value={generateRip.code} onChange={changeValue} />
                      <label className='fs-5- ff-monse-regular-'>Código de salida</label>
                      <i className='fa icon-presentation fs-xs'></i>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-4 mb-4'>
            <div className='col-auto'>
              <button className='btn rounded-pill ps-3 pe-3 ps-sm-3 pe-sm-3 ps-md-3 pe-md-3 ps-lg-5 pe-lg-5 ps-xl-5 pe-xl-5 ps-xxl-5 pe-xxl-5 h-45- d-flex flex-row justify-content-center align-items-center align-self-center btn-dark-purple- bs-1-' type="button" disabled={!conditionsRips()} onClick={generateRips} >
                  <i className='fa icon-save fs-xs me-0 me-sm-0 me-md-2 me-lg-2 me-xl-2 me-xxl-2'></i>
                  <span className='lh-1 fs-5- ff-monse-regular- d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block'>Generar</span>
              </button>
            </div>
          </div>
        </>
        :
        null
      }
      {
        tab === 'Generados'
        ?
        <>
          <div className='row mt-4 mb-4'>
            <div className='col-12'>
              <p className='m-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>Lista de RIPS</p>
            </div>
          </div>
          <div className='row mt-4 mb-4'>
            <div className='col-12'>
              <form action="" className='position-relative wrapper-search-small- d-block d-sm-block d-md-block d-lg-block d-xl-block d-xxl-block'>
                <div className='form-search inner-addon- left-addon-'>
                  <input type="text" className='form-control search-' id="buscador-modulos" placeholder="Buscar" value={findRips} onChange={changeFilter} />
                  <i className='fa icon-search fs-xs'></i>
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
                            <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Entidad</span>
                          </div>
                        </th>
                        <th scope="col" className='th-width-sm-'>
                          <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                            <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Código de salida</span>
                          </div>
                        </th>
                        <th scope="col" className='th-width-sm-'>
                          <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                            <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Fecha de creación</span>
                          </div>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        subListRips.map(list => (
                          <tr>
                            <td className='align-middle'>
                              <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                                <div className='checks-radios-'>
                                  <label>
                                    <input type="checkbox" name="checked" onClick={(e) => changeCheckRips(list, e)} checked={list.checked} />
                                    <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                                  </label>
                                </div>
                              </div>
                            </td>
                            <td className='align-middle'>
                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.invoices[0]?.entity_id ? list.invoices[0].entity_id : '' }</p>
                            </td>
                            <td className='align-middle'>
                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.code }</p>
                            </td>
                            <td className='align-middle'>
                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.registration_date }</p>
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
                pageCount={pageCountRips}
                pageIndex={pageIndexRips}
                setPageIndex={setPageIndexRips}
              />
            </div>
          </div>
          <div className='row mt-4 mb-4'>
            <div className='col-12'>
              <p className='m-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>Lista de entidades</p>
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
                        <th scope="col" className='th-width-sm-'>
                          <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                            <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>No. Factura</span>
                          </div>
                        </th>
                        <th scope="col" className='th-width-md-'>
                          <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                            <span className='fs-6- ff-monse-regular- fw-bold tx-dark-purple-'>Entidades</span>
                          </div>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                        {
                          subListEntities.map(list => (
                            <tr>
                              <td className='align-middle'>
                                <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.invoice }</p>
                              </td>
                              <td className='align-middle'>
                                <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{ list.entity }</p>
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
                pageCount={pageCountEntities}
                pageIndex={pageIndexEntities}
                setPageIndex={setPageIndexEntities}
              />
            </div>
          </div>
          <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-4 mb-4'>
            <div className='col-auto'>
              <button className='btn rounded-pill ps-3 pe-3 ps-sm-3 pe-sm-3 ps-md-3 pe-md-3 ps-lg-5 pe-lg-5 ps-xl-5 pe-xl-5 ps-xxl-5 pe-xxl-5 h-45- d-flex flex-row justify-content-center align-items-center align-self-center btn-red- bs-1-' type="button" disabled={!checkRip} onClick={deleteRip} >
                  <i className='fa icon-delete fs-xs me-0 me-sm-0 me-md-2 me-lg-2 me-xl-2 me-xxl-2'></i>
                  <span className='lh-1 fs-5- ff-monse-regular- d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block'>Eliminar</span>
              </button>
            </div>
            <div className='col-auto'>
              <button className='btn rounded-pill ps-3 pe-3 ps-sm-3 pe-sm-3 ps-md-3 pe-md-3 ps-lg-5 pe-lg-5 ps-xl-5 pe-xl-5 ps-xxl-5 pe-xxl-5 h-45- d-flex flex-row justify-content-center align-items-center align-self-center btn-dark-purple- bs-1-' type="button" disabled={!checkRip} onClick={downloadFile} >
                  <i className='fa icon-save fs-xs me-0 me-sm-0 me-md-2 me-lg-2 me-xl-2 me-xxl-2'></i>
                  <span className='lh-1 fs-5- ff-monse-regular- d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block'>Generar</span>
              </button>
            </div>
          </div>
        </>
        :
        null
      }
    </React.Fragment>
  )
}
