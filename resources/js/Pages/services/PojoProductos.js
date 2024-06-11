class PojoProducto{
    listaImagenes=[];
    nombre;
    id;
    descripcion;
    categoria;
    imagen;
    valor;
    referencia;
    cantidad;

    constructor(nombre, id) {
      this.nombre = nombre;
      this.id = id;
  }

    setRef(ref){
        this.referencia=ref;
    }


    setDescripcion(desc){
        this.descripcion=desc;
    }

    setValor(precio){
        this.valor=precio;
    }

    setCate(cat){
        this.categoria=cat;
    }

    setImagen(img){
        this.imagen=img;
    }

    setListaImagenes(lista){
        this.listaImagenes=lista
    }

    setCantidad(cant){
        this.cantidad=cant
    }

}

export default PojoProducto;