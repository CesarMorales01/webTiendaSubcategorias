<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Response;
use App\Models\Globalvar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProductController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function index()
    {
        $auth = Auth()->user();
        $promos = DB::table('promociones')->orderBy('id', 'desc')->get();
        foreach ($promos as $promo) {
            if ($promo->ref_producto != '') {
                $promo->infoProducto = DB::table('productos')->where('id', '=', $promo->ref_producto)->first();
            } else {
                $promo->infoCategoria = DB::table('categorias')->where('id', '=', $promo->categoria)->first();
            }
        }
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = $this->getProductosDisponibles();
        $categorias = $this->getCategoriasConProductosPublicados();
        //Buscar recien llegads!!!
        return Inertia::render('Welcome', compact('auth', 'promos', 'info', 'globalVars', 'productos', 'categorias'));
    }

    public function getCategoriasConProductosPublicados()
    {
        //Filtrar categorias que solo tengan productos a publicar en la web
        $categorias = DB::table('categorias')->get();
        $array = [];
        foreach ($categorias as $cat) {
            $validar = DB::table('productos')->where('category_id', '=', $cat->id)->where('publicacionweb', '=', 'true')->first();
            if ($validar) {
                $array[] = $cat;
            }
            $cat->subcategorias = DB::table('subcategorias')->where('category_id', '=', $cat->id)->get();
        }
        return $array;
    }

    function getProductosDisponibles()
    {
        $productos = DB::table('productos')->select('id', 'referencia', 'category_id', 'nombre', 'descripcion', 'valor', 'cantidad')->where('publicacionweb', '=', 'true')->orderBy('id', 'desc')->get();
        foreach ($productos as $producto) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $producto->id)->first();
            $producto->imagen = $imagen->nombre_imagen;
        }
        return $productos;
    }

    public function getProductNoCost($id)
    {
        return DB::table('productos')->select('id', 'referencia', 'category_id', 'nombre', 'cantidad', 'descripcion', 'valor')->where('publicacionweb', '=', 'true')->where('id', $id)->first();
    }

    public function product(string $id)
    {
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $producto = $this->getProductNoCost($id);
        if ($producto) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $id)->get();
            $producto->imagen = $imagen;
            $productos = $this->getProductosDisponibles();
            $categorias = $this->getCategoriasConProductosPublicados();
            $token = csrf_token();
            return Inertia::render('Product/Product', compact('auth', 'info', 'globalVars', 'producto', 'categorias', 'productos', 'token'));
        } else {
            return Redirect::route('index');
        }
    }

    public function searchProduct(string $producto)
    {
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->select('id', 'referencia', 'category_id', 'subcategory_id', 'nombre', 'cantidad', 'descripcion', 'valor')->Where('nombre', 'like', '%' . $producto . '%')->orWhere('descripcion', 'like', '%' . $producto . '%')->where('publicacionweb', '=', 'true')->get();
        foreach ($productos as $item) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $item->id)->first();
            $item->imagen = $imagen->nombre_imagen;
            $item->codigo = $item->id;
        }
        $allproducts = $this->getProductosDisponibles();
        $categorias = $this->getCategoriasConProductosPublicados();
        return Inertia::render('Product/Search', compact('auth', 'info', 'globalVars', 'productos', 'allproducts', 'categorias', 'producto'));
    }

    public function showByCategory($categoryOrSubcategory, $id)
    {
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $allproducts = $this->getProductosDisponibles();
        $categorias = $this->getCategoriasConProductosPublicados();
        $cate = null;
        //$categoryOrSubcategory para identificar si es categoria o subcategoria
        if ($categoryOrSubcategory == 'category') {
            //Llega el id de la categoria
            $cate = DB::table('categorias')->where('id', '=', $id)->first();
            $productos = DB::table('productos')->select('id', 'referencia', 'category_id', 'subcategory_id', 'nombre', 'cantidad', 'descripcion', 'valor')->where('category_id', '=', $id)->where('publicacionweb', '=', 'true')->get();
            foreach ($productos as $producto) {
                $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $producto->id)->first();
                $producto->imagen = $imagen->nombre_imagen;
            }
        } else {
            //Llega el id de la subcategoria
            $cate = DB::table('subcategorias')->where('id', '=', $id)->first();
            $productos = DB::table('productos')->select('id', 'referencia', 'category_id', 'subcategory_id', 'nombre', 'cantidad', 'descripcion', 'valor')->where('subcategory_id', '=', $id)->where('publicacionweb', '=', 'true')->get();
            foreach ($productos as $producto) {
                $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $producto->id)->first();
                $producto->imagen = $imagen->nombre_imagen;
            }
        }
        return Inertia::render('Product/ShowByCategory', compact('auth', 'info', 'globalVars', 'allproducts', 'productos',  'categorias', 'cate'));
    }
}
