<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME', ''),
    'api_key' => env('CLOUDINARY_API_KEY', ''),
    'api_secret' => env('CLOUDINARY_API_SECRET', ''),
    'url' => env('CLOUDINARY_URL', ''),

    /*
    |--------------------------------------------------------------------------
    | Dossiers de stockage par type
    |--------------------------------------------------------------------------
    */
    'folders' => [
        'products' => 'products',
        'livreurs' => 'livreurs',
        'temp' => 'temp',
    ],

    /*
    |--------------------------------------------------------------------------
    | Options de transformation par défaut
    |--------------------------------------------------------------------------
    */
    'transformations' => [
        'product_thumb' => [
            'width' => 200,
            'height' => 200,
            'crop' => 'fill',
            'quality' => 'auto',
        ],
        'product_detail' => [
            'width' => 800,
            'height' => 800,
            'crop' => 'fill',
            'quality' => 'auto',
        ],
    ],
];
