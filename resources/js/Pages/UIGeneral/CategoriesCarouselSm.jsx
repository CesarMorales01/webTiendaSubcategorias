import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect } from 'react';

const CategoriesCarouselSm = (params) => {

    function goCategoria(cate) {
        window.location.href = params.globalVars.thisUrl + 'product/search/' + cate
    }

    return (
        <Carousel variant="dark" indicators={false}>
            {
                params.promos.map((item, index) => {
                    return (
                        <Carousel.Item onClick={() => goCategoria(item.nombre)} className='textAlignCenter' key={index}>
                            <img style={{ width: '97%', height: 'auto' }} className={'centerImgCarousel rounded cursorPointer'}
                                src={params.globalVars.urlRoot + 'Images/Categories/' + item.imagen}
                                alt={item.nombre}
                            />
                            <h1 style={{ margin: '0.5em', display: item.nombre == '' ? 'none' : '', color: params.info.color_letra_navbar ? params.info.color_letra_navbar : 'black' }} className='textAlignCenter superTitulo'>{item.nombre}</h1>
                        </Carousel.Item>
                    )
                })
            }
        </Carousel>
    )
}

export default CategoriesCarouselSm