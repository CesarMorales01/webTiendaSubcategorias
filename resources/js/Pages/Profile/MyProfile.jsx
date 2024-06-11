import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectMunicipios from './SelectMunicipios';
import Swal from 'sweetalert2'
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

const MyProfile = (params) => {

    const glob = new GlobalFunctions()
    const [datosCliente, setDatosCliente] = useState({
        cedula: params.datosCliente.cedula,
        usuario: params.auth.name,
        correo: params.auth.email,
        clave: params.auth.clave,
        confirmClave: params.auth.clave,
        telefonos: []
    })
    const [telefono, setTelefono] = useState('')
    const [divDatosPersonales, setDivDatosPersonales] = useState(false)
    const [divDireccion, setDivDireccion] = useState(false)
    const [contraseñaIncorrecta, setContraseñaIncorrecta] = useState('')
    const [displayDivUsuario, setDisplayDivUsuario] = useState('none')

    useEffect(() => {
        if (params.message != '') {
            successAlert()
        }
        if (params.datosCliente != null) {
            getNombreCiudad(params.datosCliente.ciudad)
            setDatosCliente((valores) => ({
                ...valores,
                nombre: params.datosCliente.nombre,
                apellidos: params.datosCliente.apellidos,
                direccion: params.datosCliente.direccion,
                info_direccion: params.datosCliente.info_direccion,
                telefonos: params.datosCliente.telefonos
            }))
            validarActivarDivPersonales()
            validarActivarDivDireccion()
        }
    }, [])

    function successAlert() {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: params.message,
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(() => {
            if (glob.getCookie('comeBackCarrito') != '') {
                glob.setCookie('comeBackCarrito', false, -1)
                window.location.href = params.globalVars.thisUrl + "shopping/" + params.auth.email + "/edit"
            }
            if (glob.getCookie('comeBackRegister') != '') {
                glob.setCookie('comeBackRegister', false, -1)
                window.location.href = params.globalVars.thisUrl + "shopping/" + params.auth.email + "/edit"
            }
        }, 1500);
    }

    function validarActivarDivPersonales() {
        if (divDatosPersonales == false) {
            if (datosCliente.cedula != '') {
                setDivDatosPersonales(true)
            }
        }
    }

    function validarActivarDivDireccion() {
        if (params.datosCliente.ciudad != undefined) {
           setDivDireccion(true)
        }
    }

    function desactivar_mensaje_datos_importantes() {
        document.getElementById("alert_cambio").innerText = "";
    }

    function activar_mensaje_datos_importantes() {
        if (divDatosPersonales == true) {
            if (datosCliente.cedula != '' && divDireccion != true) {
                document.getElementById('btn_modificar_datos_personales').innerText = 'Escribir a asesor'
                document.getElementById('alert_cambio').innerText = "Tu nombre y número de cédula se consideran datos de especial relevancia. Si deseas modificarlos puedes comunicarte con un asesor."
            }
        } else {
            document.getElementById('btn_modificar_datos_personales').innerText = 'Modificar'
        }
    }

    function abrirDialogoContra() {
        setContraseñaIncorrecta('')
        document.getElementById('dialogo_confirmar_password').click()
        document.getElementById('check_contraseña').value = ''
    }

    function goWhats() {
        let href = "https://api.whatsapp.com/send?phone=57" + params.info.telefonos[0].telefono + "&text=Hola! Soy " + params.datosCliente.nombre + ", cedula: " + params.datosCliente.cedula + " y quisiera cambiar los datos personales de mi cuenta.";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    function validarFuncionBtnDatosPersonales() {
        if (divDatosPersonales) {
            goWhats()
        } else {
            validarInfoDivs()
        }
    }

    function loadingOn() {
        document.getElementById('btn_modificar_datos_personales').style.display = 'none'
        document.getElementById('btnLoading').style.display = 'inline'
        document.getElementById('btnModificarUsuario').style.display = 'none'
        document.getElementById('btnLoadingUsuario').style.display = 'inline'
    }

    function loadingOff() {
        document.getElementById('btn_modificar_datos_personales').style.display = ''
        document.getElementById('btnLoading').style.display = 'none'
        document.getElementById('btnModificarUsuario').style.display = ''
        document.getElementById('btnLoadingUsuario').style.display = 'none'
    }

    function sweetAlert(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        })
    }

    function validarContraseña() {
        const contra = document.getElementById('check_contraseña').value
        if (contra != '') {
            loadingOnDialogoContraseña()
            setContraseñaIncorrecta('')
            const url = params.globalVars.thisUrl + 'profile/check/' + datosCliente.correo + '/' + contra
            fetch(url)
                .then((response) => {
                    return response.json()
                }).then((json) => {
                    loadingOffDialogoContraseña()
                    if (json == true) {
                        document.getElementById('dialogo_confirmar_password').click()
                        setDivDireccion(false)
                    } else {
                        setContraseñaIncorrecta('Contraseña incorrecta!')
                    }
                })
        } else {
            setContraseñaIncorrecta('Ingresa un valor!')
        }
    }

    function loadingOnDialogoContraseña() {
        document.getElementById('btnDialogoContra').style.display = 'none'
        document.getElementById('btnLoadingDialogoContra').style.display = ''
    }

    function loadingOffDialogoContraseña() {
        document.getElementById('btnDialogoContra').style.display = ''
        document.getElementById('btnLoadingDialogoContra').style.display = 'none'
    }

    function cambioNombre(e) {
        setDatosCliente((valores) => ({
            ...valores,
            nombre: e.target.value,
        }))
    }

    function cambioApellidos(e) {
        setDatosCliente((valores) => ({
            ...valores,
            apellidos: e.target.value,
        }))
    }

    function cambioCedula(e) {
        setDatosCliente((valores) => ({
            ...valores,
            cedula: e.target.value,
        }))
    }

    function cambioDireccion(e) {
        setDatosCliente((valores) => ({
            ...valores,
            direccion: e.target.value,
        }))
    }

    function cambioInfoDireccion(e) {
        setDatosCliente((valores) => ({
            ...valores,
            info_direccion: e.target.value,
        }))
    }

    function cambioCiudad(e) {
        getNombreCiudad(e.target.value)
    }

    function getNombreCiudad(codigoCiudad) {
        let codCiudad = 0
        let nombreCiudad = ''
        let codDepto = 0
        let nombreDepto = ''
        for (let i = 0; i < params.municipios.length; i++) {
            if (params.municipios[i].id == codigoCiudad) {
                codCiudad = params.municipios[i].id;
                nombreCiudad = params.municipios[i].nombre
                codDepto = params.municipios[i].departamento_id
            }
        }
        for (let i = 0; i < params.deptos.length; i++) {
            if (params.deptos[i].id == codDepto) {
                nombreDepto = params.deptos[i].nombre
            }
        }
        document.getElementById('codCiudad').value = codCiudad
        document.getElementById('codDepto').value = codDepto
        setDatosCliente((valores) => ({
            ...valores,
            ciudad: nombreCiudad,
            departamento: nombreDepto
        }))
    }

    function validarInfoDivs() {
        if (divDireccion) {
            abrirDialogoContra()
        } else {
            if (validarDatosVaciosDir() == 3) {
                if (datosCliente.clave == datosCliente.confirmClave) {
                    loadingOn()
                    if (params.datosCliente.cedula == '') {
                        validarCedula()
                    } else {
                        document.getElementById('formRegistro').submit()
                    }
                } else {
                    sweetAlert('Las contraseñas no coinciden!')
                }
            }
        }
    }

    function validarCedula() {
        const url = params.globalVars.urlRoot + 'api/customer/getclient/' + datosCliente.cedula + "/" + datosCliente.correo
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                loadingOff()
                if (json.cliente == null) {
                    document.getElementById('formRegistro').submit()
                } else {
                    loadingOff()
                    sweetAlert('Ya existe un usuario con el número de identificación ingresado!')
                }
            })
    }

    function validarDatosVaciosDir() {
        let vacios = 0
        if (datosCliente.nuevoUsuario == '' || datosCliente.clave == '') {
            sweetAlert('Falta información importante en la sección datos de cuenta!')
        } else {
            vacios++
        }
        if (datosCliente.direccion == '' || datosCliente.ciudad == '' || datosCliente.telefonos.length == 0) {
            sweetAlert('Falta información importante en la sección de dirección de envío!')
        } else {
            vacios++
        }
        if (datosCliente.nombre == '' || datosCliente.cedula == '') {
            sweetAlert('Falta información importante en la sección de datos personales!')
        } else {
            vacios++
        }
        return vacios
    }

    function cambioUsuario(e) {
        setDatosCliente((valores) => ({
            ...valores,
            nuevoUsuario: e.target.value,
        }))
    }

    function cambioCorreo(e) {
        setDatosCliente((valores) => ({
            ...valores,
            correo: e.target.value,
        }))
    }

    function cambioClave(e) {
        setDatosCliente((valores) => ({
            ...valores,
            clave: e.target.value,
        }))
    }

    function cambioConfirmClave(e) {
        setDatosCliente((valores) => ({
            ...valores,
            confirmClave: e.target.value,
        }))
    }

    function borrarTelefono(tel) {
        const temp = datosCliente.telefonos.filter((art) => art !== tel);
        setDatosCliente((valores) => ({
            ...valores,
            telefonos: temp
        }))
    }

    function cambiarTelefono(e) {
        setTelefono(e.target.value)
    }

    function agregarTelefono() {
        if (telefono == '') {
            return
        }
        let tels = datosCliente.telefonos
        let array = []
        setDatosCliente((valores) => ({
            ...valores,
            telefonos: array
        }))
        tels.push(telefono)
        setTimeout(() => {
            setDatosCliente((valores) => ({
                ...valores,
                telefonos: tels
            }))
            setTelefono('')
        }, 100);
    }

    function cambioMostrarDivUsuario() {
        if (displayDivUsuario == 'none') {
            setDisplayDivUsuario('')
        } else {
            setDisplayDivUsuario('none')
        }
    }

    function validarMostrarBotonModificarCedula(){
        let display='none'
        if( params.datosCliente.cedula!='' && divDireccion!=true){
            display=''
        }
        return display
    }

    return (
        <>
            <Head title='My profile' />
            <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} categorias={params.categorias}>
            </AuthenticatedLayout>
            <div className="container">
                <form id='formRegistro' action={route('profile.update')} method="post" >
                    <input type='hidden' name='_token' value={params.token}></input>
                    <br />
                    <hr />
                    {/* datos personales*/}
                    <div id="div_datos_personales" onMouseOver={activar_mensaje_datos_importantes} onMouseOut={desactivar_mensaje_datos_importantes} style={{ backgroundColor: '#f4f4f4', padding: '0.4em' }}>
                        <div className="row justify-content-center" >
                            <p id="alert_cambio" style={{ textAlign: 'justify', color: 'brown' }}></p>
                            <div className="col-lg-4 col-sm-12" >
                                <strong style={{ fontSize: '1em' }} >Datos personales</strong>
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Nombres</p>
                                <input name='nombre' type="text" id='inputNombre' onClick={cambioNombre} onChange={cambioNombre} readOnly={divDatosPersonales} className="form-control rounded" defaultValue={datosCliente.nombre ? datosCliente.nombre : ''} />
                                <br />
                            </div>
                            <div className="col-lg-4 col-sm-12" >
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Apellidos</p>
                                <input name='apellidos' type="text" id='inputApellidos' onClick={cambioApellidos} onChange={cambioApellidos} readOnly={divDatosPersonales} className="form-control rounded" defaultValue={datosCliente.apellidos ? datosCliente.apellidos : ''} />
                                <br />
                            </div>
                        </div>
                        <div className="row justify-content-center" >
                            <div className="col-lg-4 col-sm-12" >
                                <p style={{ textAlign: 'justify', color: 'black' }}>Número de cédula</p>
                                <input name='cedula' type="text" id='inputCedula' onClick={cambioCedula} onChange={cambioCedula} readOnly={divDatosPersonales} placeholder="Número de cédula" className="form-control rounded" defaultValue={datosCliente.cedula ? datosCliente.cedula : ''} />
                            </div>
                            <div className="col-lg-4 col-sm-12" >

                            </div>
                        </div>
                        <br />
                        <div style={{ textAlign: 'center' }} className="row justify-content-center">
                            <div className="col-lg-6 col-sm-6" >
                                <button onClick={validarFuncionBtnDatosPersonales} style={{ display: validarMostrarBotonModificarCedula(), backgroundColor: '#f0e094' }} id="btn_modificar_datos_personales" className="btn btn-outline-success btn-md btn-block" type="button" >Modificar<i style={{ marginLeft: '1em' }} className="fas fa-edit"></i></button>
                                <button id='btnLoading' style={{ display: 'none', backgroundColor: 'green' }} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
                                <br />
                            </div>
                        </div>
                    </div>
                    {/* Direccion de envio*/}
                    <div style={{ backgroundColor: '#f4f4f4', padding: '0.5em', marginTop: '0.8em' }}>
                        <div className="row justify-content-center" >
                            <div className="col-lg-8 col-sm-12">
                                <strong style={{ fontSize: '1em' }} >Dirección de envio</strong>
                                <textarea name='direccion' id='inputDireccion' onChange={cambioDireccion} onClick={cambioDireccion} defaultValue={datosCliente.direccion ? datosCliente.direccion : ''} readOnly={divDireccion} rows="2" className="form-control rounded"></textarea>
                                <br />
                            </div>
                            <div className="col-lg-8 col-sm-12">
                                <textarea name='info_direccion' readOnly={divDireccion} id="inputInfoDireccion" onChange={cambioInfoDireccion} onClick={cambioInfoDireccion} rows="2" placeholder="Información adicional: apartamento, local, torre, etc. (Opcional)" className="form-control rounded" defaultValue={datosCliente.info_direccion ? datosCliente.info_direccion : ''}></textarea>
                                <br />
                            </div>
                        </div>
                        <div className="row justify-content-center" >
                            <div style={{ width: '67%', display: divDireccion ? 'none' : 'inline' }} className='container'>
                                <SelectMunicipios ciudades={params.municipios} className="form-control rounded" getMunicipio={cambioCiudad} />
                            </div>
                            <div style={{ textAlign: 'center' }} className="row justify-content-center" >
                                <div className="col-lg-4 col-sm-12" >
                                    <strong style={{ fontSize: '1em' }} >Ciudad</strong>
                                    <input id='codCiudad' name='codCiudad' type='hidden'></input>
                                    <input id='ciudad' type="text" placeholder="Ciudad" className="form-control rounded" readOnly defaultValue={datosCliente.ciudad ? datosCliente.ciudad : ''} />
                                </div>
                                <br /><br />
                                <div className="col-lg-4 col-sm-12">
                                    <strong style={{ fontSize: '1em' }} >Departamento</strong>
                                    <input id='codDepto' name='codDepto' type='hidden'></input>
                                    <input id='departamento' type="text" placeholder="Departamento" className="form-control rounded" readOnly defaultValue={datosCliente.departamento ? datosCliente.departamento : ''} />
                                    <br />
                                </div>
                            </div>
                        </div>
                        {/* div telefonos */}
                        <div style={{ textAlign: 'center', marginTop: '1em' }} className="container">
                            <div className="row justify-content-center" >
                                <strong style={{ fontSize: '1em' }} >Teléfonos:</strong>
                                <input name='telefonos[]' value={datosCliente.telefonos} type='hidden' />
                                {datosCliente.telefonos.map((item, index) => {
                                    return (
                                        <div key={index} style={{ padding: '0.2em' }} className="col-lg-6 col-md-6 col-sm-4 col-4">
                                            <li>{item}</li>
                                            <button className='rounded-circle' type="button" onClick={() => borrarTelefono(item)} style={{ backgroundColor: 'orange', display: divDireccion ? 'none' : '' }}>
                                                <svg style={{ padding: '0.2em' }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            <br></br>
                            <div style={{ display: divDireccion ? 'none' : '' }} className="row justify-content-center">
                                <div className="col-lg-4 col-sm-12">
                                    <input value={telefono} onChange={cambiarTelefono} type="number" className="form-control rounded" placeholder="Escribe el número de télefono" />
                                </div>
                                <div className="col-lg-4 col-sm-12">
                                    <button id='btnAgregarTel' onClick={agregarTelefono} style={{ backgroundColor: '#0061a9', marginTop: window.screen.width > 600 ? '' : '0.5em' }} type="button" className="btn btn-primary align-middle">Agregar télefono</button>
                                </div>
                            </div>
                        </div>
                        {/* fin div telefonos */}
                    </div>
                    {/* Datos usuario */}
                    <div style={{ backgroundColor: '#f4f4f4', padding: '0.3em', marginTop: '0.8em' }}>
                        <div className="row justify-content-center" >
                            <div className="col-lg-8 col-sm-12" >
                                <a onClick={cambioMostrarDivUsuario} className={displayDivUsuario == '' ? 'btn btn-outline-dark' : 'btn btn-outline-info'} style={{ fontSize: '1em', marginBottom: '0.5em' }} >
                                    <i style={{ marginRight: '0.3em' }} className="fa-solid fa-id-card"></i>
                                    <strong style={{ fontSize: '1em' }} >
                                        Datos de cuenta
                                    </strong>
                                    {displayDivUsuario == '' ?
                                        <i style={{ marginLeft: '1em' }} className="fa-solid fa-chevron-up"></i>
                                        :
                                        <i style={{ marginLeft: '1em' }} className="fa-solid fa-chevron-down"></i>
                                    }
                                </a>
                            </div>
                        </div>
                        <div style={{ display: displayDivUsuario }} className="row justify-content-center">
                            <div className="col-lg-8 col-sm-12" >
                                <div style={{ backgroundColor: '#f4f4f4', padding: '0.3em' }}>
                                    <p style={{ textAlign: 'justify', color: 'black' }}>Nombre de usuario</p>
                                    <input name='usuario' type="text" onClick={cambioUsuario} onChange={cambioUsuario} readOnly={divDireccion} className="form-control rounded" defaultValue={datosCliente.usuario ? datosCliente.usuario : ''} id="inputUsuario" />
                                    <br />
                                    <p style={{ textAlign: 'justify', color: 'black' }}>E-mail</p>
                                    <input name='correo' type="text" onClick={cambioCorreo} readOnly defaultValue={datosCliente.correo ? datosCliente.correo : ''} className="form-control rounded" id="inputCorreo" />
                                    <br />
                                </div>
                                <strong style={{ fontSize: '1em' }} >Contraseña</strong>
                                <div style={{ backgroundColor: '#f4f4f4', padding: '0.5em' }}>
                                    <input name='clave' type="password" defaultValue={datosCliente.clave ? datosCliente.clave : ''} readOnly={divDireccion} onChange={cambioClave} id="inputClave" className="form-control rounded" />
                                    <br />
                                </div>
                                <strong style={{ fontSize: '1em' }} >Repite contraseña</strong>
                                <div style={{ backgroundColor: '#f4f4f4', padding: '0.5em' }}>
                                    <input type="password" defaultValue={datosCliente.confirmClave ? datosCliente.confirmClave : ''} readOnly={divDireccion} onChange={cambioConfirmClave} id="inputClave" className="form-control rounded" />
                                    <br />
                                </div>
                            </div>
                            <br />
                        </div>
                        <div style={{ textAlign: 'center' }} className="row justify-content-center">
                            <div className="col-lg-6 col-sm-6" >
                                <button style={{ backgroundColor: '#0c6834' }} id="btnModificarUsuario" onMouseOver={agregarTelefono} onClick={validarInfoDivs} className="btn btn-success btn-md" type="button" >{divDireccion ? 'Desbloquear formulario' : 'Guardar datos'}<i style={{ marginLeft: '1em' }} className="fas fa-edit"></i></button>
                                <button id='btnLoadingUsuario' style={{ display: 'none', backgroundColor: 'green' }} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                {/* Dialogo confirmar contraseña */}
                <a className="nav-link" data-toggle="modal" id="dialogo_confirmar_password" data-target="#dialogo1"></a>
                <div className="modal fade" id="dialogo1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <br />
                                <h1 style={{ color: 'black' }} >Para modificar tus datos debes ingresar tu contraseña.</h1>
                                <br />
                                <p id="inputContraseñaIncorrecta" style={{ textAlign: 'justify', color: 'red', fontSize: '0.9em', margin: '0.4em' }}>{contraseñaIncorrecta}</p>
                                <input type="password" id="check_contraseña" className="form-control rounded" />
                            </div>
                            <div className="row justify-content-around">
                                <div className="col-3">
                                    <SecondaryButton type="button" data-dismiss="modal">Cancelar</SecondaryButton>
                                </div>
                                <div className="col-5">
                                    <PrimaryButton onClick={validarContraseña} id='btnDialogoContra' className="btn btn-outline-success btn-sm btn-block" type="button" >Continuar
                                    </PrimaryButton>
                                    <button id='btnLoadingDialogoContra' style={{ display: 'none' }} disabled type="button" className="inline-flex items-center px-3 py-2 bg-gray-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-400 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-1 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                        </svg>
                                        Loading...
                                    </button>
                                </div>
                            </div>
                            <br />	<br />
                        </div>
                    </div>
                </div>

            </div>

        </>
    )

}

export default MyProfile