import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';

const SuggestedProducts = (params) => {
    const glob = new GlobalFunctions()

    function removeLoad(e) {
        document.getElementById('load' + e).style.display = 'none'
    }

    function goProduct(e) {
        window.location.href = params.globalVars.thisUrl + 'product/' + e
    }

    function validarAgotado(cantidad) {
        let agotado = false
        if (cantidad == '0') {
            agotado = true
        }
        return agotado
    }

    return (
        <div >
            <div style={{ margin: '0.2em' }} className="rounded">
                <h5 style={{ fontSize: '1.4em', padding: '0.5em' }} className='textAlignCenter superTitulo'>{params.categoria}</h5>
            </div>
            <div style={{ marginTop: '0.5em' }} >
                <div className="row align-items-center">
                    {params.productos.map((item, index) => {
                        return (
                            <div key={index} id={item.id} onClick={() => goProduct(item.id)} className="col-lg-3 col-md-3 col-sm-6 col-6 card-flyer cursorPointer rounded">
                                <span style={{ marginLeft: '1em' }} id={'load' + item.id} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <img style={{ padding: '0.5em', width: '100%', height: 'auto' }} onLoad={() => removeLoad(item.id)} src={params.globalVars.urlRoot + 'Images/Products/' + item.imagen} className="card-img-top rounded centerImgCarousel" />
                                <h5 style={{ margin: '0.5em', fontSize: '0.8em' }} className='textAlignCenter'>{item.referencia != '' ? item.referencia : ''}</h5>
                                <h5 style={{ margin: '0.5em', fontSize: '1em' }} className='textAlignCenter superTitulo' >{item.nombre}</h5>
                                <p style={{ textAlign: 'center', margin: '0.5em', color: validarAgotado(item.cantidad) ? 'gray' : '' }} >
                                    {validarAgotado(item.cantidad) ? 'Agotado' : '$' + glob.formatNumber(item.valor)}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SuggestedProducts