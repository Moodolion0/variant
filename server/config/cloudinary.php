<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary API Credentials
    |--------------------------------------------------------------------------
    |
    | Here you may specify your Cloudinary API credentials for image uploads.
    | You can get these from your Cloudinary dashboard.
    |
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME', 'demo'),
    'api_key' => env('CLOUDINARY_API_KEY', ''),
    'api_secret' => env('CLOUDINARY_API_SECRET', ''),

    /*
    |--------------------------------------------------------------------------
    | Upload Preset (Optional)
    |--------------------------------------------------------------------------
    |
    | If you're using Cloudinary's unsigned uploads, specify the preset here.
    |
    */
    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', ''),
];
