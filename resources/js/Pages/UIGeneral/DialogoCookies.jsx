import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions'

const DialogoCookies = (params) => {
    const glob = new GlobalFunctions()

    function noCookie() {
        document.getElementById('divCookie').style.display = 'none'
    }

    function okCookie() {
        glob.setCookie('aceptCookie', true, 3600 * 60 * 24 * 365)
        document.getElementById('divCookie').style.display = 'none'
    }

    return (
        <div className={window.screen.width < 600 ? 'd-flex justify-content-center mt-5 displayDialogoCookieSm' : 'd-flex justify-content-center mt-5 displayDialogoCookieLg'} >
            <div id='divCookie' style={{ display: params.displayDialogoCookies }} className="card p-3 cookie cookiecard"><span>
                Utilizamos cookies para datos estadísticos de nuestra página web.
                <br></br></span>
                <a onClick={params.goPoliticas} style={{ color: 'black', textDecoration: 'underline' }} href="#">Saber más<i className="fa fa-angle-right ml-2"></i>
                </a>
                <div className="mt-2 text-right">
                    <button onClick={noCookie} type='button' className="btn btn-outline-dark btn-sm" >Rechazar</button>
                    <button onClick={okCookie} style={{ marginLeft: '0.2em' }} className="btn btn-outline-primary btn-sm botonCookie" type="button">Aceptar</button>
                </div>
            </div>
        </div>
    )
}

export default DialogoCookies