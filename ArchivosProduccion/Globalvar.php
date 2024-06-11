<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use stdClass;

class Globalvar extends Model
{
    use HasFactory;

    public $globalVars;

    function __construct()
    {
        $nombreApp="gestionpymes";

        $this->globalVars = new stdClass();
        $this->globalVars->urlRoot = "https://gestionmitiendasubcategorias.tucasabonita.site/";
        // $this->globalVars->urlRoot = "http://192.168.20.20:8000/";

         $this->globalVars->thisUrl="https://webmitiendasubcategorias.tucasabonita.site/";
       //$this->globalVars->myUrl = "http://192.168.20.20:8000/";

       // $this->globalVars->dirImagenesCategorias = "C:/laragon\www/".$nombreApp."/public/Images/Categories/";
       $this->globalVars->dirImagenesCategorias = "/home/u629086351/domains/tucasabonita.site/public_html/gestionmitiendasubcategorias/public/Images/Categories/";

        $this->globalVars->urlImagenesCategorias =  $this->globalVars->urlRoot."Images/Categories/";
        //$this->globalVars->urlImagenesCategorias = "https://".$nombreApp.".tucasabonita.site/Images/Categories/";

       // $this->globalVars->dirImagenes = "C:\/laragon\www\/".$nombreApp."\/public\Images\/Products\/";
       $this->globalVars->dirImagenes = "//home/u629086351/domains/tucasabonita.site/public_html/gestionmitiendasubcategorias/public/Images/Products/";

        $this->globalVars->urlImagenes =  $this->globalVars->urlRoot."Images/Products/";
      // $this->globalVars->urlImagenes="https://".$nombreApp.".tucasabonita.site/Images/Products/";
      
       $this->globalVars->tablaImagenes="imagenes_productos";
    }


    public function getGlobalVars()
    {
        return $this->globalVars;
    }
}