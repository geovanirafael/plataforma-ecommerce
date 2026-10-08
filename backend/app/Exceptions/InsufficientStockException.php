<?php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    public function __construct(string $productName, int $available)
    {
        parent::__construct("Stock insuficiente para \"{$productName}\". Disponível: {$available}.");
    }
}