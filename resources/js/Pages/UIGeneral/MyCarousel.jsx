import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import '../../../css/general.css'
import { useState, useEffect } from 'react';

const MyCarousel = (params) => {
    const [thisWidth, setthisWidth] = useState('')

    useEffect(() => {
        setthisWidth(setDimensionPantalla())
    }, [])

    function setDimensionPantalla() {
        let widthDiv
        if (window.screen.width < 600) {
            widthDiv = 'imgCarouselSm'
        } else {
            widthDiv = 'imgCarouselBig'
        }
        return widthDiv
    }

    function loadingImgCarousel() {
        document.getElementById('spanCargandoCarousel').style.display = 'none'
    }

    function goProduct(item){
        if(item.infoProducto){
            window.location= params.globalVars.thisUrl+"product/"+item.infoProducto.id
        }else{
            window.location= params.globalVars.thisUrl+"product/category/category/"+item.infoCategoria.id
        }
    }

    return (
        
            <div id='divCarousel' style={{ marginTop: 3 }} >
                <span id='spanCargandoCarousel' className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <Carousel variant="dark" indicators={false}>
                    {
                        params.promos.map((item, index) => {
                            return (
                                <Carousel.Item onClick={()=>goProduct(item)} className='textAlignCenter' key={index}>
                                    <img style={{ width: window.screen.width < 600 ? '390px' : '1400px', height: 'auto' }} onLoad={loadingImgCarousel} id={item.referencia} className={'centerImgCarousel rounded cursorPointer'}
                                        src={params.globalVars.urlRoot + 'Images/Products/'+ item.imagen}
                                        alt={item.imagen}
                                    />
                                    <h1 style={{ marginTop: '0.6em', display: item.descripcion!='' ? '' : 'none' }} className='textAlignCenter superTitulo'>{item.descripcion}</h1>
                                </Carousel.Item>
                            )
                        })
                    }
                </Carousel>
            </div>
        
    )
}

export default MyCarousel