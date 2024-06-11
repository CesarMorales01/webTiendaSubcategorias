<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\Globalvar;
use Inertia\Inertia;

class SessionController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function login(){
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $globalVars = $this->global->getGlobalVars();  
        $productos=app(ProductController::class)->getProductosDisponibles();
        $categorias=app(ProductController::class)->getCategoriasConProductosPublicados();
        return Inertia::render('Auth/Login', compact('info', 'globalVars', 'productos', 'auth', 'categorias'));
    }

    public function contact(){
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();  
        $productos=app(ProductController::class)->getProductosDisponibles();
        $categorias=app(ProductController::class)->getCategoriasConProductosPublicados();
        return Inertia::render('Contact/ContactLayout', compact('info', 'globalVars', 'productos', 'auth', 'categorias'));
    }
}
