import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MyCarousel from './UIGeneral/MyCarousel';
import React, { useState, useEffect } from 'react'
import GlobalFunctions from './services/GlobalFunctions';
import PojoProducto from './services/PojoProductos';
import SuggestedProducts from './UIGeneral/SuggestedProducts';
import Contact from './Contact/Contact';
import CategoriesCarouselLg from './UIGeneral/CategoriesCarouselLg';
import CategoriesCarouselSm from './UIGeneral/CategoriesCarouselSm';
import DialogoCookies from './UIGeneral/DialogoCookies';
import DialogoPoliticasCookies from './UIGeneral/DialogoPoliticasCookies';

export default function Welcome(params) {

    const glob = new GlobalFunctions()
    const [closeBtn, setCloseBtn] = useState(glob.getCookie('closeBtn'))
    const [displayDialogoCookies, setDisplayDialogoCookies] = useState('none')

    useEffect(() => {
        checkCloseBtn()
        validarRedireccion()
        validarAcceptCookie()
    }, [])

    function goPoliticas() {
        document.getElementById('btnDialogoPoliticasCookies').click()
    }

    function validarAcceptCookie() {
        if (glob.getCookie('aceptCookie') != 'true') {
            setDisplayDialogoCookies('')
        }
    }

    function validarRedireccion() {
        //Redireccionar a producto
        if (params.auth) {
            if (isNaN(parseInt(glob.getCookie('productForCar')))) { } else {
                window.location.href = params.globalVars.thisUrl + 'product/' + glob.getCookie('productForCar')
                glob.setCookie('productForCar', '', -1)
            }
            //Redireccionar a profile
            if (glob.getCookie('comeBackRegister') != '') {
                window.location.href = params.globalVars.thisUrl + "profile/" + params.auth.email
            }
            //Redireccionar a carrito
            if (glob.getCookie('comeBackCarrito') != '') {
                glob.setCookie('comeBackCarrito', false, -1)
                window.location.href = params.globalVars.thisUrl + "shopping/" + params.auth.email + '/edit'
            }
        }
    }

    function checkCloseBtn() {
        if (closeBtn == null || closeBtn == '') {
            setCloseBtn(0)
        }
        if (closeBtn >= 4) {
            setTimeout(() => {
                if (document.getElementById("divWhats") != null) {
                    closeWhats()
                }
            }, 4000);
        }
    }

    function activarHover(e) {
        document.getElementById(e + "divCategorias").style.boxShadow = '0px 15px 26px rgba(0, 0, 0, 0.50)'
        document.getElementById(e + "divCategorias").style['-webkit-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-moz-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-o-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style.transition = 'all 0.1s ease-in'
        document.getElementById(e + "divCategorias").style.marginTop = '10px'
    }

    function desactivarHover(e) {
        document.getElementById(e + "divCategorias").style.boxShadow = '0px 0px 0px rgba(0, 0, 0, 0.50)'
        document.getElementById(e + "divCategorias").style['-webkit-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-moz-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-o-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style.transition = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style.marginTop = '0px'
    }

    function closeWhats() {
        document.getElementById("divWhats").style.display = "none"
        document.getElementById("divFb").style.display = "none"
        let sumar = parseInt(closeBtn) + 1
        glob.setCookie('closeBtn', sumar, 3600 * 60 * 24)
    }

    function goFb() {
        window.open(params.info.linkfb, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    function goWhats() {
        let href = "https://api.whatsapp.com/send?phone=57" + params.info.telefonos[0].telefono + "&text=Hola! He visitado tu página y me gustaria preguntar algo!";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    // Creación de arrays para mostrar resumen de productos por categorias
    let matrix = []
    let countCates = params.categorias.length
    for (let i = 0; i < countCates; i++) {
        let array = []
        for (let x = 0; x < params.productos.length; x++) {
            if (params.categorias[i].id == params.productos[x].category_id) {
                let pojo = new PojoProducto(params.productos[x].nombre, params.productos[x].id)
                pojo.setCantidad(params.productos[x].cantidad)
                pojo.setDescripcion(params.productos[x].descripcion)
                let image = ''
                if (params.productos[x].imagen.nombre_imagen != undefined) {
                    image = params.productos[x].imagen.nombre_imagen
                }

                pojo.setImagen(image)
                pojo.setValor(params.productos[x].valor)
                pojo.setRef(params.productos[x].referencia)
                array.push(pojo)
            }
        }
        let array1 = array.sort(() => Math.random() - 0.5)
        let array2 = []
        let nums = 0
        if (array1.length <= 12) {
            nums = array1.length
        } else {
            nums = 12
        }
        for (let r = 0; r < nums; r++) {
            array2.push(array1[r])
        }
        matrix[i] = array2
    }

    function goCategoria(cate) {
        window.location = params.globalVars.thisUrl + 'product/category/category/' + cate.id
    }

    return (
        <div >
            <Head title="Welcome" />
            <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} categorias={params.categorias} >
            </AuthenticatedLayout>
            <MyCarousel promos={params.promos} globalVars={params.globalVars}></MyCarousel>
            {/*Cards categorias*/}
            <div style={{ marginTop: '0.4em' }}>
                <br></br>
                <div className="container">
                    <h1 style={{ fontSize: '1.4em', padding: '0.5em' }} className='tituloCategorias rounded'>Categorias</h1>
                </div>
                <div style={{ marginTop: '0.2em' }} className="container">
                    <div className="row">
                        {params.categorias.map((item, index) => {
                            return (
                                <div style={{ marginTop: '1em', cursor: 'pointer' }} key={index} className='col-lg-4 col-md-6 col-sm-12 col-12 rounded'>
                                    <div onClick={() => goCategoria(item)} id={index + "divCategorias"} onTouchEnd={() => desactivarHover(index)} onTouchStart={() => activarHover(index)} className="card border border card-flyer pointer">
                                        <img style={{ padding: '0.5em', maxWidth: '96%', height: 'auto' }} className="centerImgCarousel card-img-top img-fluid rounded" src={params.globalVars.urlRoot + 'Images/Categories/' + item.imagen} alt="productos genial app" />
                                        <h4 style={{ marginTop: '0.2em', fontSize: '1.4em', textAlign: 'center', color: 'black' }} className="card-title superTitulo">
                                            {item.nombre}
                                        </h4>
                                    </div>
                                </div>
                            )
                        })}
                        <br />
                    </div>
                </div>
                {/*Botones flotantes*/}
                <div id='divFb' style={{ display: 'scroll', position: "fixed", bottom: '2%', left: '10%', zIndex: 1, cursor: 'pointer' }}>
                    <a onClick={closeWhats}><i className="fas fa-window-close"></i></a>
                    <h5 onClick={goFb}>Síguenos!</h5>
                    <img alt="fbImage" onClick={goFb} width="48" height="48" src={params.globalVars.urlRoot + 'Images/Config/btn_facebook.jpg'}></img>
                </div>
                <div id='divWhats' style={{ display: 'scroll', position: "fixed", bottom: '2%', right: '10%', zIndex: 1, cursor: 'pointer' }} >
                    <a onClick={closeWhats} ><i className="fas fa-window-close"></i></a>
                    <h5 onClick={goWhats} >Escribénos!</h5>
                    <img alt='WhatsappImage' onClick={goWhats} src={params.globalVars.urlRoot + 'Images/Config/whatsApp_btn.png'}></img>
                </div>
            </div>
            <Contact url={params.globalVars.urlRoot} datos={params.info}></Contact>
            <DialogoCookies goPoliticas={goPoliticas} displayDialogoCookies={displayDialogoCookies}></DialogoCookies>
            <DialogoPoliticasCookies></DialogoPoliticasCookies>
            <button id='btnDialogoPoliticasCookies' style={{ display: 'none' }} type="button" data-toggle="modal" data-target="#modalPoliticasCookies"></button>
        </div>
    );
}
