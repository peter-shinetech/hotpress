<?php

if (!defined('ABSPATH')) exit;


add_action('init', static function() {


    // add_action( 'wp_enqueue_scripts', static function (){
        // wp_enqueue_script( 'my-wordpress-plugin', '{{SERVER_HOST}}/@vite/client', [], '0.0.1', true );
    // });

    /**
     * Prints scripts or data in the head tag on the front end.
     *
     */
    add_action( 'wp_head', static function() {
        ?>
        <script type="module" src="{{SERVER_HOST}}/@vite/client"></script>
        <?php
    } );

    /**
     * Prints scripts or data before the closing body tag on the front end.
     *
     */
    add_action( 'wp_footer', static function() : void {
        ?>
        {{MODULES}}
    <?php
    } );
    

});

