<?php
ini_set('error_reporting', E_ALL);
ini_set('display_errors', true);


function __autoload($className) {
    include_once 'application/core/'.$className .'.php';
}

Route::start();
