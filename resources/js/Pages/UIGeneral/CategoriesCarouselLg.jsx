import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const CategoriesCarouselLg = (params) => {

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    function goCategoria(cate) {
        window.location.href = params.globalVars.thisUrl + 'product/search/' + cate
    }

    return (
        <Carousel
            swipeable={true}
            draggable={true}
            showDots={false}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlaySpeed={1800}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={2000}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            autoPlay={true} >
                
            {params.cates.map((item, index) => {
                return (
                    <div key={index} className='zoomInside' onClick={()=>goCategoria(item.nombre)}>
                        <img style={{ padding: '0.2em' }} className={'centerImgCarousel rounded cursorPointer'}
                            src={params.globalVars.urlRoot + 'Images/Categories/' + item.imagen}
                            alt={item.nombre}
                        />
                        <h3 style={{ margin: '0.5em', display: item.nombre == '' ? 'none' : '', color: params.info.color_letra_navbar ? params.info.color_letra_navbar : 'black' }} className='textAlignCenter superTitulo'>{item.nombre}</h3>
                    </div>
                )
            })}
        </Carousel>
    )
}

export default CategoriesCarouselLg