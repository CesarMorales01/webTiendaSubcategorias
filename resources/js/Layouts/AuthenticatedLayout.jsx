import MuiAutoComplete from '@/Pages/UIGeneral/MuiAutoComplete'
import React, { useState, useEffect } from 'react'
import '../../css/navBar.css'
import Dropdown from '@/Components/Dropdown';
import GlobalFunctions from '../Pages/services/GlobalFunctions'

export default function Authenticated({ user, info, globalVars, productos, categorias }) {
    const glob = new GlobalFunctions()
    const [colorBadgeCarrito, setColorBadgeCarrito] = useState('black')
    const [numCarrito, setNumCarrito] = useState(0)

    useEffect(() => {
        if (user) {
            fetchCarrito()
        } else {
            if (glob.getCookie('carrito') != undefined && glob.getCookie('carrito') != '') {
                const array = JSON.parse(glob.getCookie('carrito'))
                if (array.length > 0) {
                    activarIconoCarrito(array.length)
                }

            }
        }
    }, [])

    function activarIconoCarrito(number) {
        setNumCarrito(number)
        setColorBadgeCarrito('green')
    }

    function fetchCarrito() {
        const url = globalVars.thisUrl + 'shopping/' + user.email
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                if (json.length > 0) {
                    activarIconoCarrito(json.length)
                }
            })
    }

    function goHome() {
        window.location = globalVars.thisUrl
    }

    function validarLogin() {
        if (user) {
            window.location.href = globalVars.thisUrl + "shopping/" + user.email + "/edit"
        } else {
            window.location.href = globalVars.thisUrl + "nosessioncart"
        }
    }

    function openNav() {
        const nav = document.getElementById("myNav");
        const divSubcategoriasPadre = document.getElementById("divSubcategoriasPadre")
        const divMenuUsuarioSmallPadre = document.getElementById("divMenuUsuarioSmallPadre")
        if (nav.style.width == '59%' || divSubcategoriasPadre.style.width == "50%" || divMenuUsuarioSmallPadre.style.width == "50%") {
            cerrarSmallNav()
        } else {
            document.getElementById("myNav").style.width = "59%";
            document.getElementById("iconMenu").className = "fa-solid fa-xmark fa-2xl"
            document.getElementById("iconMenu").style.color = 'blue'
            document.getElementById("divSearch").style.display = ''
            if (document.getElementById("divCarousel") != undefined) {
                document.getElementById("divCarousel").style.opacity = '50%'
            }
        }
    }

    function cerrarSmallNav() {
        document.getElementById("myNav").style.width = "0%";
        document.getElementById("iconMenu").className = "fa fa-bars fa-xl"
        document.getElementById("divSubcategoriasPadre").style.width = "0%";
        document.getElementById("divMenuUsuarioSmallPadre").style.width = "0%";
        document.getElementById("divSearch").style.display = 'none'
        if (document.getElementById("divCarousel") != undefined) {
            document.getElementById("divCarousel").style.opacity = '100%'
        }
    }

    function checkGoCategoria(item) {
        if (item.subcategorias.length > 0) {
            if (window.screen.width <= 600) {
                document.getElementById("myNav").style.width = "0%";
                document.getElementById("divSubcategoriasPadre").style.width = "50%";
                categorias.forEach(element => {
                    if (element.id == item.id) {
                        document.getElementById("divSubCategoria" + element.id).style.display = ''
                    } else {
                        document.getElementById("divSubCategoria" + element.id).style.display = 'none'
                    }
                })
            }
        } else {
            window.location = globalVars.thisUrl + 'product/category/category/' + item.id
        }
    }

    function volverMenuCategorias() {
        document.getElementById("myNav").style.width = "59%";
        document.getElementById("divSubcategoriasPadre").style.width = "0%";
    }

    function abrirMenuUsuarioSmall() {
        document.getElementById("myNav").style.width = "0%";
        document.getElementById("divMenuUsuarioSmallPadre").style.width = "50%";

    }

    function volverMenuUsuarioSmall() {
        document.getElementById("myNav").style.width = "59%";
        document.getElementById("divMenuUsuarioSmallPadre").style.width = "0%";
    }

    window.addEventListener('scroll', (event) => {
        cerrarSmallNav()
    })

    function openSearchSmall() {
        if (document.getElementById("divSearchSmall").style.display == 'none') {
            document.getElementById("divSearchSmall").style.display = ''
            document.getElementById("iconSearch").style.color = 'blue'

        } else {
            document.getElementById("divSearchSmall").style.display = 'none'
            document.getElementById("iconSearch").style.color = 'black'
        }
    }
    console.log(info)
    return (
        <>
            <nav style={{ backgroundColor: 'black', padding: '0.5em' }}>
                <p style={{ textAlign: 'center', color: 'white' }}>
                    Envío Gratis por compras superiores a $99,900 a todo Colombia.
                </p>
            </nav>
            <div className='row' style={{ padding: '0.5em', margin: '0.01em' }}>
                <div className="col-4 align-self-center" >
                    <a style={{ display: window.screen.width >= 600 ? 'none' : '' }} className="icon" onClick={openNav}>
                        <i id='iconMenu' className="fa fa-bars fa-xl"></i>
                    </a>
                    <a id='divSearch' style={{ marginLeft: '1em', display: 'none' }} onClick={openSearchSmall}>
                        <i id='iconSearch' style={{ color: 'black' }} className="fa-solid fa-magnifying-glass fa-xl"></i>
                    </a>
                </div>
                <div style={{ cursor: 'pointer' }} onClick={goHome} id='divLogoImagen' className="col-4 align-self-center" >
                    <img style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }} alt='' src={globalVars.urlRoot + 'Images/Products/' + info.logo}></img>
                </div>
                <div id='divLogoCarrito' className="col-4 align-self-center">
                    <div style={{ display: 'flex' }}>
                        <div style={{ display: window.screen.width >= 600 ? '' : 'none', marginLeft: 'auto', marginRight: '1em' }} >
                            <div className="dropdownMenu">
                                {user ?
                                    <button style={{ backgroundColor: 'black', color: 'white' }} className="dropbtn">
                                        {user ? user.name.toUpperCase() : ''}
                                        <i style={{ marginLeft: '0.3em' }} className="fa-solid fa-chevron-down fa-xs"></i>
                                    </button>
                                    :
                                    <a href={route('gologin')}><i className="fa-solid fa-circle-user fa-lg"></i></a>
                                }
                                <div style={{ display: user ? '' : 'none' }} className="dropdownMenuContent">
                                    <a href={route('profile.edit', user ? user.email : '')} >CUENTA</a>
                                    <a href={route('shopping.create')} >MIS COMPRAS</a>
                                    <Dropdown.Link info={info} href={route('logout')} method="post" as="button">
                                        <span className='linkSalir'>SALIR<i style={{ marginLeft: '0.3em' }} className="fa-solid fa-power-off"></i></span>
                                    </Dropdown.Link>
                                </div>
                            </div>
                        </div>
                        <div className='align-self-center'>
                            <span type="button" data-toggle="modal" data-target="#searchBigModal" style={{ display: window.screen.width >= 600 ? '' : 'none', color: 'black', cursor: 'pointer', marginRight: '0.8em' }} className="inline-flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                            </span>
                        </div>
                        <div style={{ marginLeft: window.screen.width >= 600 ? '' : 'auto' }} className='align-self-center'>
                            <span onClick={validarLogin} active={route().current('shopping')} style={{ color: 'white', backgroundColor: colorBadgeCarrito, cursor: 'pointer' }} className="text-xs inline-flex items-center px-1 py-0.5 rounded">
                                <svg style={{ marginRight: '0.1em', color: 'white' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                                </svg>
                                {numCarrito}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/*Nav bar big screen*/}
            <div style={{ display: window.screen.width >= 600 ? '' : 'none' }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                <div className="flex justify-center h-12">
                    <div className="hidden md:flex ">
                        {categorias.map((item, index) => {
                            return (
                                <div key={index} className='rounded' style={{ zIndex: '9', borderRadius: '14px' }} >
                                    <button onClick={() => checkGoCategoria(item)} style={{ color: globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar }} className="bigNavLink peer inline-flex items-center">
                                        {item.nombre.toUpperCase()}
                                        {item.subcategorias.length > 0 ?
                                            <svg className="ml-2 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            : ''
                                        }
                                    </button>
                                    {item.subcategorias.length > 0 ?
                                        <div style={{ borderRadius: '8px' }} className="hidden peer-hover:flex hover:flex flex-col bg-white drop-shadow-lg">
                                            {item.subcategorias.map((item1, index) => {
                                                return (
                                                    <a className='bigNavLink' style={{ padding: '0.7em', fontSize: '1.05em' }} info={info} key={index} href={route('product.byCategory', ['subcategory', item1.id])} >{item1.nombre.toUpperCase()}</a>
                                                )
                                            })}

                                        </div>
                                        : ''
                                    }
                                </div>
                            )
                        })}
                        <a href={route('contact')} style={{ color: globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar, fontSize: '1.05em', padding: '0.4em', width: '8em', marginRight: '1em', marginTop: '0.3em' }} className="bigNavLink peer inline-flex items-center">
                            CONTÁCTANOS
                        </a>
                    </div>
                </div>
            </div>
            {/*Nav bar small screen*/}
            <div style={{ display: window.screen.width >= 600 ? 'none' : '' }} id="myNav" className="overlay rounded" >
                <div style={{ display: 'none' }} id='divSearchSmall' >
                    <MuiAutoComplete productos={productos} url={globalVars.thisUrl}></MuiAutoComplete>
                </div>
                <div className="overlay-content">
                    {categorias.map((item, index) => {
                        return (
                            <div key={index}>
                                <a onClick={() => checkGoCategoria(item)}>{item.nombre.toUpperCase()} {item.subcategorias.length > 0 ? <i className="fa-solid fa-caret-right"></i> : ''}</a>
                                <hr style={{ opacity: '10%' }} />
                            </div>
                        )
                    })}
                    <a href={route('contact')}>CONTÁCTANOS</a>
                    <hr style={{ opacity: '10%' }} />
                    <a onClick={abrirMenuUsuarioSmall}>{user ? user.name : 'INGRESAR / REGISTRARSE'} {user ? <i className="fa-solid fa-caret-right"></i> : ''}</a>
                    <hr style={{ opacity: '10%' }} />
                </div>
            </div>
            <div className='overlay' id='divSubcategoriasPadre'>
                {categorias.map((item, index) => {
                    return (
                        <div style={{ display: item.subcategorias.length > 0 ? '' : 'none' }} className='overlay-content' id={'divSubCategoria' + item.id} key={index}>
                            <div style={{ marginBottom: '0.6em' }}>
                                <a style={{ whiteSpace: 'nowrap' }} onClick={() => volverMenuCategorias(item)} ><i className="fa-solid fa-caret-left"></i> Volver</a>
                                <hr style={{ width: '200%', color: 'black' }} />
                                <a style={{ fontWeight: 'bold' }}>{item.nombre.toUpperCase()}</a>
                            </div>
                            {item.subcategorias.length > 0 ?
                                item.subcategorias.map((item1, index) => {
                                    return (
                                        <div key={index}>
                                            <hr style={{ width: '200%', color: 'black' }} />
                                            <a href={route('product.byCategory', ['subcategory', item1.id])} >{item1.nombre.toUpperCase()}</a>
                                        </div>
                                    )
                                })
                                : ''
                            }
                            <hr style={{ width: '200%', color: 'black' }} />
                            <a href={route('product.byCategory', ['category', item.id])} style={{ fontWeight: 'bold' }}>Ir a {item.nombre.toUpperCase()}</a>
                            <hr style={{ width: '200%', color: 'black' }} />
                        </div>
                    )
                })}
            </div>
            <div className='overlay' id='divMenuUsuarioSmallPadre'>
                <div className='overlay-content' >
                    <div style={{ marginBottom: '0.6em' }}>
                        <a style={{ whiteSpace: 'nowrap' }} onClick={volverMenuUsuarioSmall} ><i className="fa-solid fa-caret-left"></i> Volver</a>
                        <hr style={{ width: '200%', color: 'black' }} />
                    </div>
                    <a href={route('profile.edit', user ? user.email : '')} style={{ fontWeight: 'bold' }}>CUENTA</a>
                    <hr style={{ width: '200%', color: 'black' }} />
                    <a href={route('shopping.create')} style={{ fontWeight: 'bold' }}>MIS COMPRAS</a>
                    <hr style={{ width: '200%', color: 'black' }} />
                    <Dropdown.Link info={info} href={route('logout')} method="post" as="button">
                        <span className='linkSalir'>SALIR<i style={{ marginLeft: '0.3em' }} className="fa-solid fa-power-off"></i></span>
                    </Dropdown.Link>
                    <hr style={{ width: '200%', color: 'black' }} />
                </div>
            </div>
            {/*Dialogo buscar pantallas grandes*/}
            <div className="modal fade" id="searchBigModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <button data-dismiss="modal" style={{ marginTop: '0em' }} type="button">
                                <i className="fa-solid fa-rectangle-xmark fa-lg"></i>
                            </button>
                            <div className='d-flex justify-content-center'>
                                <MuiAutoComplete productos={productos} url={globalVars.thisUrl}></MuiAutoComplete>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    );
}

