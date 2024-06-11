import React from 'react'

const CopyRight = (params) => {

    function ventana_genial_app(){
        let href="https://tupaginaweb.site/";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }
  return (
    <div style={{textAlign: 'center', cursor: 'pointer'}} onClick={ventana_genial_app} className="footer-copyright text-center py-3 ">
        <span style={{ fontStyle: 'italic' }} className="btn btn-link">Diseñado y desarrollado por GenialApp.</span> 
        <br/>
        <img alt="logoGenialApp" width="120" height="170" className="img-fluid centerImgCarousel" src="https://tucasabonita.site/Imagenes_config/logo_genial_trans.png" />
    </div>
  )
}

export default CopyRight