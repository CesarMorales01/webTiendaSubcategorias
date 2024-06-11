import React from 'react'
import CopyRight from '../UIGeneral/CopyRight';
import '../../../css/general.css'
import WhastsappButton from '@/Components/WhatsappButton';
import DialogoPoliticasCookies from '../UIGeneral/DialogoPoliticasCookies';

const Contact = (params) => {

  function goFb() {
    window.open(params.datos.linkfb, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
  }

  function goInsta() {
    window.open(params.datos.linkinsta, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
  }

  function goWhats() {
    let href = "https://api.whatsapp.com/send?phone=57" + params.datos.telefonos[0].telefono + "&text=Hola! He visitado tu página y me gustaria preguntar algo!";
    window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
  }

  function goMaps() {
     let href = 'https://maps.app.goo.gl/Us7VvZB1Tt4fxypk9'
     window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
  }

  function goPoliticas() {
    document.getElementById('btnDialogoPoliticasCookies1').click()
  }

  return (
    <footer style={{ margin: '0.4em', backgroundColor: '#f1e1d2' }} className="page-footer font-small sombraBlanco">
      <div>
        <h1 style={{ marginTop: '1em', fontSize: '1.4em' }} className='textAlignCenter superTitulo'>¿Quiénes somos?</h1>
        <div style={{ marginTop: '2em' }} className="row justify-content-center">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <img className='centerImgCarousel rounded' style={{ width: '50%', height: 'auto' }} src={params.url + 'Images/Products/' + params.datos.imagen} alt='imgContact' />
            </div>
            <div className="col-lg-6 col-md-6 align-self-center" style={{ marginTop: window.screen.width < 600 ? '2em' : '' }} >
              <p style={{ textAlign: 'center', margin: '1em' }}>
                {params.datos.descripcion_pagina}
              </p>
            </div>

            <div style={{ marginTop: '2em' }} className="col-12 col-lg-4 col-md-4 col-sm-12">
              <h2 style={{ fontSize: '1.2em', padding: '0.5em', textTransform: 'uppercase' }} className='textAlignCenter superTitulo'>Contáctanos</h2>
              <p onClick={goMaps} style={{ marginTop: '0.5em', cursor: 'pointer' }}><i style={{ marginRight: '0.4em' }} className="fa-solid fa-location-dot fa-lg"></i>{params.datos.direccion_pagina}</p>
              {params.datos.telefonos ?
                <p style={{ marginTop: '1em' }}><i style={{ marginRight: '0.4em' }} className="fa-solid fa-phone-volume fa-lg"></i>
                  +57 {params.datos.telefonos[0].telefono}
                </p>
                :
                ''}
              <p style={{ marginTop: '1em' }}><i style={{ marginRight: '0.4em' }} className="fa-regular fa-envelope fa-lg"></i>{params.datos.correo}</p>
            </div>
            <div style={{ marginTop: '2em' }} className="col-12 col-lg-4 col-md-4 col-sm-12">
              <h2 style={{ fontSize: '1.2em', padding: '0.5em', textTransform: 'uppercase', marginBottom: '0.8em' }} className='textAlignCenter superTitulo'>Siguenos</h2>
              <p style={{ marginBottom: '0.5em' }}><a onClick={goInsta} style={{ cursor: 'pointer', color: '#c82590' }}><i style={{ marginRight: '0.4em', color: '#c82590' }} className="fa-brands fa-instagram fa-lg"></i>insta_mi_tienda</a></p>
              <p style={{ marginBottom: '0.5em' }}><a onClick={goFb} style={{ cursor: 'pointer', color: 'black' }}><i style={{ marginRight: '0.4em', color: 'blue' }} className="fa-brands fa-facebook fa-lg"></i>fb_mi_tienda</a></p>
              <p style={{ marginBottom: '0.5em' }}><a onClick={goWhats} style={{ cursor: 'pointer', color: 'green' }}><i style={{ marginRight: '0.4em', color: 'green' }} className="fa-brands fa-whatsapp fa-lg"></i>+57 {params.datos.telefonos[0].telefono}</a></p>
            </div>
            <div style={{ marginTop: '2em' }} className="col-12 col-lg-4 col-md-4 col-sm-12">
              <br />
              <h5 style={{ fontSize: '1.2em', padding: '0.5em', textTransform: 'uppercase' }} className='textAlignCenter superTitulo'>Nosotros</h5>
              <li style={{ marginTop: '0.5em' }}><a href={route('contact')} style={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '1.1em' }} className="link-underline-primary">Sobre nosotros</a></li>
              <li style={{ marginTop: '0.5em' }}><a onClick={goPoliticas} style={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '1.1em' }} className="link-underline-primary">Políticas de cookies</a></li>

            </div>
          </div>
        </div>
        <br />
      </div>
      <CopyRight url={params.url} version='' />
      <DialogoPoliticasCookies></DialogoPoliticasCookies>
      <button id='btnDialogoPoliticasCookies1' style={{ display: 'none' }} type="button" data-toggle="modal" data-target="#modalPoliticasCookies"></button>
    </footer>
  )
}

export default Contact