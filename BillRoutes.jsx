import React from 'react'
import { Navigate, Route, Routes, NavLink } from "react-router-dom"
import NewBill from './newBill/NewBill';
import Rips from './rips/Rips';
import ElectronicBill from './electronicBill/ElectronicBill';
import { useNavigate } from 'react-router-dom';
import 'malihu-custom-scrollbar-plugin';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import { Appcontext } from '../../../../appContext';
import $ from "jquery"
import { getDateFormat } from '../../../../services/DatesManagement/DatesServices';
import { useState } from 'react';
require('jquery-mousewheel');

export default function BillRoutes() {

  let {Token,NotificationsFacture_1,setNotificationsFacture_1,
    NotificationsFacture_2,setNotificationsFacture_2} = React.useContext(Appcontext);
  /* navigate */
  const [filter, setFilter] = useState('');

  const navigate=useNavigate();

  /* USE EFFECT */

  React.useEffect(()=>{

    if(!Token){
      navigate('/dashboard/billing/bill/newBill');
    }

  },[Token])

  React.useEffect(()=>{
    $('.wrapper-notifications-').mCustomScrollbar({
      theme: "minimal",
      mouseWheel:{
        scrollAmount: 60,
        normalizeDelta: true
      },
      scrollInertia:100,
      mouseWheelPixels: 100
    });
  },[])

  return (
    <div className='container-fluid overflow-x-hidden p-0'>
      <div className='row g-2 mt-3'>
        <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 col-xxl-4'>
          <div id="card-appointment" className='card border-0 rounded-3 w-100 position-relative bs-2-'>
            <div className='card-header border-0 rounded-3'>
              <div className='row'>
                <div className='col-12'>
                  <ul className='nav nav-pills d-flex flex-row justify-content-start justify-content-sm-between justify-content-md-between justify-content-lg-between justify-content-xl-start justify-content-xxl-between' role="tablist">
                    <li className='nav-item' role="presentation">
                      <button className='nav-link active rounded-0 d-flex flex-row justify-content-center align-items-center align-self-center' id="product-tab" data-bs-toggle="pill" data-bs-target="#pills-bills" type="button" role="tab" aria-controls="pills-bills" aria-selected="true"> <span className='ff-monse-regular- me-2'>Factura</span></button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='card-body w-100 wrapper-list-appointment- pt-0 mt-1'>
              <div className='tab-content' id='myTabContent'>
                <div className='tab-pane fade show active' id='pills-bills' role="tabpanel" aria-labelledby="product-tab" tabIndex="0">
                  <div className='row'>
                    <div className='col-12'>
                      <div className='d-grid gap-2 pt-1'>
                        <NavLink className='nav-link rounded-pill ps-4 pe-4 h-45- d-flex flex-row justify-content-center align-items-center align-self-center bs-1-' style={({ isActive }) => ({ color: isActive ? 'var(--color-white-)' : 'var(--color-secondary-purple-)', background: isActive ? 'var(--color-secondary-purple-)' : 'var(--color-white-)', })} to='/dashboard/billing/bill/newBill'><span className='lh-1 fs-5- ff-monse-regular-'>Factura</span>
                        </NavLink>
                        <NavLink className='nav-link rounded-pill ps-4 pe-4 h-45- d-flex flex-row justify-content-center align-items-center align-self-center bs-1-' style={({ isActive }) => ({ color: isActive ? 'var(--color-white-)' : 'var(--color-secondary-purple-)', background: isActive ? 'var(--color-secondary-purple-)' : 'var(--color-white-)', })} to='/dashboard/billing/bill/rips'><span className='lh-1 fs-5- ff-monse-regular-'>RIPS</span>
                        </NavLink>
                        <NavLink className='nav-link rounded-pill ps-4 pe-4 h-45- d-flex flex-row justify-content-center align-items-center align-self-center bs-1-' style={({ isActive }) => ({ color: isActive ? 'var(--color-white-)' : 'var(--color-secondary-purple-)', background: isActive ? 'var(--color-secondary-purple-)' : 'var(--color-white-)', })} to='/dashboard/billing/bill/electronicBill'><span className='lh-1 fs-5- ff-monse-regular-'>Factura electrónica</span>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                  <div className='row mt-4'>
                    <div className='col-12'>
                      <h2 className='lh-sm fs-5- ff-monse-regular- fw-bold tx-dark-purple-'>Notificaciones</h2>
                    </div>
                    <div className='col-12 bg-white- pt-2 pb-3'>
                      <form action="" className='position-relative wrapper-search-notifications- d-block d-sm-block d-md-block d-lg-block d-xl-block d-xxl-block'>
                        <div className='form-search inner-addon- left-addon-'>
                          <input type="text" className='form-control search-' id="buscador-modulos" placeholder="Buscar" onChange={({ target }) => setFilter(target.value)} />
                          <i className='fa icon-search fs-xs'></i>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-12 wrapper-notifications-'>
                      <div className='w-100 pt-0 mt-3'>
                        <div className='tab-content' id='myTabContent'>
                          <div className='tab-pane fade show active' id='pills-orders' role="tabpanel" aria-labelledby="orders-tab" tabIndex="0">
                              <div className='row g-2'>
                                {NotificationsFacture_2.filter(noti => {
                                  if (noti !== '') {
                                    return noti.entity_id.toLowerCase().includes(filter.toLowerCase());;
                                  } else {
                                    return true;
                                  }
                                }).map((Noti,index)=>{
                                  return(
                                  <div className='col-12' key={index}>
                                  <div id="card-notifications" className='card border-0 rounded-3 w-100'>
                                    <div className='card-body w-100'>
                                      <div className='d-flex flex-row justify-content-between align-items-start align-self-center'>
                                        <div className='d-flex flex-row justify-content-start align-items-center align-self-center'>
                                          <div className='p-2 me-2 rounded-circle bg-neutral-purple-'></div>
                                          <div className='w-auto'>
                                            <p className='m-0 lh-sm text-uppercase fs-4-- ff-monse-regular- fw-bold tx-black-'>{Noti?.entity_id}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className='d-flex flex-row justify-content-start align-items-start align-self-center ps-4'>
                                        <div className='w-100'>
                                        <p className='m-0 me-2 pt-2 lh-sm fs-5- ff-monse-regular- tx-black-'> <span className='fw-bold'>Fecha inicio</span>: <span className='fs-6- tx-black-'>{getDateFormat(Noti?.start_services)}</span></p>
                                        <p className='m-0 me-2 pt-2 lh-sm fs-5- ff-monse-regular- tx-black-'> <span className='fw-bold'>Fecha fin</span>: <span className='fs-6- tx-black-'>{getDateFormat(Noti?.end_services)}</span></p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                  )
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 col-xxl-8'>
          <div id="card-view" className='card border-0 rounded-3 w-100 bs-2-'>
            <div className='card-body w-100 min-h-'>
              <div className='container-fluid'>
                <Routes>
                  <Route path="" element={ <Navigate to="newBill" /> }/>
                  <Route path="newBill" element={<NewBill/>} />
                  <Route path="rips" element={<Rips/>} />
                  <Route path="electronicBill" element={<ElectronicBill/>} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


