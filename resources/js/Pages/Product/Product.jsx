import { useState, useEffect } from 'react';
import SuggestedProducts from '../UIGeneral/SuggestedProducts';
import Contact from '../Contact/Contact';
import GlobalFunctions from '../services/GlobalFunctions';
import Carousel from 'react-bootstrap/Carousel'
import { RWebShare } from 'react-web-share'
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PojoProducto from '../services/PojoProductos'
import '../../../css/general.css'
import Questions from './Questions'
import Swal from 'sweetalert2';

const Product = (params) => {

  const glob = new GlobalFunctions()
  const [producto, setProducto] = useState(params.producto)
  const [cantidad, setCantidad] = useState(1)
  const [precioAntes, setPrecioAntes] = useState(true)
  const [productoSugeridos, setProductosSugeridos] = useState([])
  const [index, setIndex] = useState(0)
  const [descripcion, setDescripcion] = useState([])
  const [agotado, setAgotado] = useState(false)

  useEffect(() => {
    validarAgotado()
    procesarDatos()
    functionSetProductosSugeridos()
  }, [])

  function validarAgotado() {
    if (params.producto.cantidad == '0') {
      setAgotado(true)
      setCantidad(0)
    }
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

  function procesarDatos() {
    if (params.producto.descripcion != null && descripcion.length == 0) {
      setDescripcion(params.producto.descripcion.split("."))
    }
    if (agotado != true) {
      functionSetPrecioAntes()
    }
  }

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    setBordeDiv(selectedIndex)
  }

  function setBordeDiv(index) {
    var div_min = document.getElementById("div_miniaturas");
    for (var x = 0; x < div_min.childNodes.length; x++) {
      let parentDiv = div_min.childNodes[x]
      for (var z = 0; z < parentDiv.childNodes.length; z++) {
        if (parentDiv.childNodes[z].nodeType == Node.ELEMENT_NODE) {
          parentDiv.childNodes[z].style.borderLeft = "";
        }
      }
    }
    document.getElementById('divMin' + index).style.borderLeft = "thick solid brown";
  }

  function functionSetProductosSugeridos() {
    if (productoSugeridos.length == 0) {
      // Creación de arrays para mostrar resumen de productos por categorias
      let array = []
      for (let x = 0; x < params.productos.length; x++) {
        if (producto.categoria == params.productos[x].categoria) {
          let pojo = new PojoProducto(params.productos[x].nombre, params.productos[x].id)
          pojo.setCantidad(params.productos[x].cantidad)
          pojo.setImagen(params.productos[x].imagen)
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
      setProductosSugeridos(array2)
    }
  }

  function functionSetPrecioAntes() {
    let num = Math.random()
    let item = document.getElementById("tv_precio_antes")
    if (num > 0.7 && precioAntes && item != null && producto.valor != '0') {
      let precio_ant = (parseInt(producto.valor) * 0.2) + parseInt(producto.valor);
      document.getElementById("tv_precio_antes").innerText = "Antes: $ " + new Intl.NumberFormat("de-DE").format(precio_ant);
      document.getElementById("tv_precio").innerText = "Hoy: $" + new Intl.NumberFormat("de-DE").format(producto.valor)
    }
    setPrecioAntes(false)
  }

  function cambiarImagen(index) {
    setIndex(index)
    setBordeDiv(index)
  }

  function set_full_screen(id) {
    var imagen = document.getElementById('imgMain' + id)
    getFullscreen(imagen);
  }

  function getFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  function menosCant() {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  function masCant() {
    if (agotado) {
      return
    } else {
      if (params.producto.cantidad == null) {
        setCant()
      } else {
        if (params.producto.cantidad == '') {
          setCant()
        } else {
          if (params.producto.cantidad >= cantidad + 1) {
            setCant()
          }
        }
      }
    }
  }

  function setCant() {
    // if (cantidad < 6) {
    setCantidad(cantidad + 1)
    // }
  }

  function checkUsuario() {
    if (params.auth) {
      //Carrito en base de datos
      guardarEnCarrito()
    } else {
      //Kart with sessions!
      guardarCarritoSession()
    }
  }

  function guardarCarritoSession() {
    if (glob.getCookie('carrito') != undefined && glob.getCookie('carrito') != '') {
      // Si hay carritosession, validar si el producto ya esta para cambiar la cantidad...
      let findProducto = null
      const carritoSession = JSON.parse(glob.getCookie('carrito'))
      carritoSession.forEach(element => {
        if (element.cod == producto.id) {
          element.cantidad = element.cantidad + cantidad
          findProducto = element
        }
      })
      if (findProducto == null) {
        agregarProductoCarritoSession()
      } else {
        glob.setCookie('carrito', JSON.stringify(carritoSession), 3600 * 24 * 365)
      }
    } else {
      agregarProductoCarritoSession()
    }
    loading()
    window.location.href = params.globalVars.thisUrl + "nosessioncart"
  }

  function agregarProductoCarritoSession() {
    let array = null
    if (glob.getCookie('carrito') != undefined && glob.getCookie('carrito') != '') {
      array = JSON.parse(glob.getCookie('carrito'))
    } else {
      array = []
    }
    const prod = producto
    prod.cliente = ""
    prod.cod = producto.id
    prod.producto = producto.nombre
    prod.fecha = glob.getFecha()
    prod.cantidad = cantidad
    prod.imagen = producto.imagen[0].nombre_imagen
    array.push(prod)
    glob.setCookie('carrito', JSON.stringify(array), 3600 * 24 * 365)
  }

  function loading() {
    document.getElementById('btnComprar').style.display = 'none'
    document.getElementById('btnLoading').style.display = 'inline'
  }

  function guardarEnCarrito() {
    loading()
    document.getElementById('formRegistro').submit()
  }

  function loadingImgMain() {
    document.getElementById('spanCargandoImagen').style.display = 'none'
  }

  function comprarByWhatsapp() {
    let href = "https://api.whatsapp.com/send?phone=57" + params.info.telefonos[0].telefono + "&text=Hola! Me interesa este producto: " + params.producto.nombre + ". " + params.globalVars.thisUrl + "product/" + params.producto.id;
    window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
  }

  return (
    <>
      <Head title={params.producto.nombre} />
      <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} categorias={params.categorias} >
      </AuthenticatedLayout>
      <div id="div_producto_todo">
        {/*div contenedor producto: miniaturas, img main y comprar*/}
        <div className="row">
          <div className="row col-lg-2 col-md-2 col-sm-12 overflow-auto" style={{ marginLeft: '0.2em', display: window.screen.width < 600 ? 'none' : 'inline' }} id="div_miniaturas">
            {producto.imagen.map((item, index) => {
              return (
                <div key={index} onClick={() => cambiarImagen(index)} className="col-sm-3 col-md-12" style={{ margin: '20px', cursor: 'pointer', marginLeft: '0.6em' }}>
                  <img id={'divMin' + index} className="img-fluid img-thumbnail" style={{ width: '50%', height: 'auto' }} src={params.globalVars.urlRoot + 'Images/Products/' + item.nombre_imagen} />
                </div>
              )
            })}
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 border" >
            <span id='spanCargandoImagen' className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <Carousel activeIndex={index} onSelect={handleSelect} variant="dark" indicators={false}>
              {
                producto.imagen.map((item, index) => {
                  return (
                    <Carousel.Item className='textAlignCenter' key={index}>
                      <img id={'imgMain' + index} onClick={() => set_full_screen(index)} onLoad={loadingImgMain} className={'cursorPointer centerImgCarousel'}
                        src={params.globalVars.urlRoot + "Images/Products/" + item.nombre_imagen}
                        alt="" style={{ width: window.screen.width > 600 ? '80%' : '100%', height: 'auto' }}
                      ></img>
                    </Carousel.Item>
                  )
                })
              }
            </Carousel>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <div style={{ padding: '0.1em' }} className="card text-center card-flyer">
              <div>
                <form id='formRegistro' action={route('shopping.store')} method="post" >
                  <input type='hidden' name='_token' value={params.token}></input>
                  <input type='hidden' name='codigo' value={producto.id}></input>
                  <input type='hidden' name='nombre' value={producto.nombre}></input>
                  <input type='hidden' name='imagen' value={producto.imagen[0].nombre_imagen}></input>
                  <input type='hidden' name='cantidad' value={cantidad}></input>
                  <input type='hidden' name='valor' value={producto.valor}></input>
                  <input type='hidden' name='fecha' value={glob.getFecha()}></input>
                  <h3 style={{ marginTop: '1em', fontSize: '1em' }}>{producto.referencia != '' ? producto.referencia : ''}</h3>
                  <br />
                  <h1 id="titulo_producto" style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{producto.nombre}</h1>
                  <br />
                  <h3 id="tv_precio_antes" style={{ color: 'red', textDecoration: 'line-through', display: agotado ? 'none' : '' }} className="fontSizePreciosSuggested"></h3>
                  <h3 id="tv_precio" style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{agotado ? '-' : '$ ' + glob.formatNumber(producto.valor)}</h3>
                  <br />
                  <div className="container">
                    <div className="row">
                      <div className="col-sm-5 col-12 align-self-center">
                        <h6 >Cantidad</h6>
                      </div>
                      <div onClick={menosCant} className="col-sm-1 col-4 cursorPointer align-self-center">
                        <i style={{ color: 'green' }} className="fas fa-minus"></i>
                      </div>
                      <div className="col-sm-4 col-4 align-self-center">
                        <span style={{ fontWeight: 'bold', fontSize: '1.3em' }}>{cantidad}</span>
                      </div>
                      <div onClick={masCant} className="col-sm-1 col-4 cursorPointer align-self-center">
                        <i style={{ color: 'green', fontSize: '1.5em' }} className="fas fa-plus"></i>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9em', display: params.producto.cantidad != null ? '' : 'none' }}>(Disponibles: {params.producto.cantidad})</p>
                  </div>
                  <br />
                  <h3 style={{ display: 'none' }} className='fontSizePreciosSuggested'>Envio gratis en el área metrópolitana de Bucaramanga!</h3>
                  <br />
                  <h3 className='fontSizePreciosSuggested'></h3>
                  <br />
                  <h3 id="tv_llega" ></h3>
                  {/*formulario producto */}
                  <button id='btnComprar' type='button' onClick={checkUsuario} style={{ width: '94%', backgroundColor: agotado ? 'gray' : 'green' }}
                    className="btn btn-success btn-lg" disabled={agotado ? true : false}>
                    {agotado ? 'Producto agotado' : 'Agregar al carrito'}
                    <i className="fa-solid fa-cart-plus fa-lg" style={{ marginLeft: '1em' }}></i>
                  </button>
                  <button id='btnLoading' style={{ display: 'none', backgroundColor: 'green', width: '94%' }} className="btn btn-primary btn-lg" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                  </button>
                  <button type='button' onClick={comprarByWhatsapp} style={{ width: '94%', marginTop: '1em', backgroundColor: '#62a74e' }}
                    className="btn btn-success btn-lg" >
                    Compra por
                    <i className="fa-brands fa-whatsapp fa-lg" style={{ marginLeft: '1em' }}></i>
                  </button>
                  <div style={{ textAlign: 'right', marginTop: '1.5em' }} className='container'>
                    <RWebShare
                      data={{
                        text: producto.nombre,
                        url: params.globalVars.thisUrl + "product/" + producto.id,
                        title: producto.nombre
                      }}
                    >
                      <button type='button' className='btn btn-outline-primary btn-sm rounded'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                          <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
                        </svg>
                      </button>
                    </RWebShare>
                  </div>
                  <br />
                </form>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="container">
          <div className="card text-center card-flyer">
            <h1 style={{ fontSize: '1.4em', textAlign: 'center', marginBottom: '0.2em', marginTop: '0.2em' }} >Descripcion</h1>
            <div style={{ textAlign: 'justify', padding: '0.5em' }}>
              {descripcion.map((item, index) => {
                return (
                  <p key={index}>{item + ". "}</p>
                )
              })}
            </div>
          </div>
          <br />
          <p><strong style={{ color: 'red' }}>*</strong>La disponibilidad, el precio y la cantidad de unidades de los productos esta sujeta a las unidades disponibles en inventario.
            Eloissa no se hace responsable por el posible agotamiento de unidades.</p>
          <br />
        </div>
      </div>
      <Questions auth={params.auth} producto={producto} info={params.info} globalVars={params.globalVars} ></Questions>
      <SuggestedProducts categoria='Otras personas quienes vieron este producto tambien compraron...' productos={productoSugeridos} globalVars={params.globalVars} />
      <Contact url={params.globalVars.urlRoot} datos={params.info}></Contact>
    </>
  )

}

export default Product