<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ProductController;
use App\Models\Key;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Globalvar;

class RegisteredUserController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function create()
    {
        $info = DB::table('info_pagina')->first();
        $globalVars = $this->global->getGlobalVars();
        $auth = Auth()->user();
        $token = csrf_token();
        $resp = '';
        $productos = app(ProductController::class)->getProductosDisponibles();
        $categorias = app(ProductController::class)->getCategoriasConProductosPublicados();
        return Inertia::render('Auth/Register', compact('auth', 'info', 'globalVars', 'productos', 'token', 'resp', 'categorias'));
    }

    public function store(Request $request)
    {
        $ifExisted = DB::table('keys')->where('email', '=', $request->email)->get();
        if (count($ifExisted) == 0) {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255',
                'password' => ['required']
            ]);
            DB::table('clientes')->insert([
                'nombre' => $request->name
            ]);
            $id = DB::getPdo()->lastInsertId();
            $user = Key::create([
                'name' => $request->name,
                'cedula' => $id,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            event(new Registered($user));
            Auth::login($user);
            return redirect(RouteServiceProvider::HOME);
        } else {
            $resp = 'Ya existe una cuenta asociada al correo ingresado!';
            $info = DB::table('info_pagina')->first();
            $globalVars = $this->global->getGlobalVars();
            $auth = Auth()->user();
            $token = csrf_token();
            $productos = app(ProductController::class)->getProductosDisponibles();
            $categorias = app(ProductController::class)->getCategoriasConProductosPublicados();
            return Inertia::render('Auth/Register', compact('auth', 'info', 'globalVars', 'productos', 'token', 'resp', 'categorias'));
        }
    }
}
