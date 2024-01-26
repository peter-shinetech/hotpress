<?php

if (!defined('ABSPATH')) exit;


if (!defined('MY_PLUGIN_PROJECT_NAME')) {
    define("MY_PLUGIN_PROJECT_NAME", '{{PROJECT_NAME}}');
}

if (!defined("MY_PLUGIN_CODE_MODE")) {
    define("MY_PLUGIN_CODE_MODE", 'development');
}

//Dev HOST
if (!defined("MY_PLUGIN_DEV_SERVER_HOST")) {
    define("MY_PLUGIN_DEV_SERVER_HOST", '{{SERVER_HOST}}');
}
//部署的目录
if (!defined("MY_PLUGIN_DEPLOY_RELOATED_DIR")) {
    define("MY_PLUGIN_DEPLOY_RELOATED_DIR", '{{DEPLOY_RELATED_DIR}}');
}

if (!function_exists('hp_enable_plugin'))
{
    function hp_enable_plugin() {
        add_filter(MY_PLUGIN_PROJECT_NAME. '_is_active', '__return_true');
    }
}


if (!function_exists('hp_enqueue_module')) {
    function hp_enqueue_module(...$modules)
    {

        if (!apply_filters(MY_PLUGIN_PROJECT_NAME . '_is_active', null)) return;


        if (MY_PLUGIN_CODE_MODE === 'development') {
            add_action('wp_footer', function ()  use ($modules): void {
                foreach ($modules as $module) {
                    echo '<script type="module" src="' . MY_PLUGIN_DEV_SERVER_HOST . '/src/modules/' . $module . '/index.ts"></script>';
                }
            });
        } else {
            //获取所有module加入队列
            $replace = 'src/modules/{{MODULE}}/index.ts';
            foreach ($modules as $module) {
                $moduleName = str_replace('{{MODULE}}', $module, $replace);
                $rootDir = ABSPATH . MY_PLUGIN_DEPLOY_RELOATED_DIR;
                $directoryUrl = site_url(MY_PLUGIN_DEPLOY_RELOATED_DIR);
                $manifest = json_decode(file_get_contents($rootDir . '/' . 'dist/.vite/manifest.json'), true);
                if (array_key_exists($moduleName, $manifest)) {
                    $key = MY_PLUGIN_PROJECT_NAME . '_' . $module;
                    $jsUrl = $directoryUrl . '/dist/' . $manifest[$moduleName]['file'];
                    wp_enqueue_script($key, $jsUrl, null, true);
                    foreach ($manifest[$moduleName]['css'] ?? [] as $i => $css) {
                        $key = MY_PLUGIN_PROJECT_NAME . '_' . $module . '_' . $i;
                        $cssUrl = $directoryUrl . '/dist/' . $css;
                        wp_enqueue_style($key, $cssUrl, []);
                    }
                }
            }
        }
    }
}

add_action('init', static function () {

    //如果有激活
    apply_filters(MY_PLUGIN_PROJECT_NAME . '_is_active', null) &&
        //如果开发模式, 开发模式加入Dev Watching
        MY_PLUGIN_CODE_MODE === 'development' && add_action('wp_head', static function () {
            echo '<script type="module" src="' . MY_PLUGIN_DEV_SERVER_HOST . '/@vite/client"></script>';
        });
});
