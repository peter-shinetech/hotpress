# 说明

本项目为简化wordpress网站开发而制作

## 功能
* css热加载不用刷新
* js更新自动刷新
* 开发中wordpress 指定目录下文件 修代码会自动重载

## 待解决问题
* //TODO 测试资源文件的配置于加载


## 安装依赖
```
pnpm i
```

## 开发使用:
在.env中配置项目名称和目录 

配置 `VITE_PROJECT_NAME` 项目的名称

配置 `VITE_WORDPRESS_ROOT` wordpress 目录

配置 `VITE_WORDPRESS_ADD_WATCH_DIR` wordpress 的相对工作目录

或者在 .env.production .env.development 中根据不同环境配置项目名称和目录


## 在wordpress 的插件或者主题(相对工作目录) 中进行配置
```php
//必须启动插件
hp_enable_plugin();

//根据页面的不同启用的模块
hp_enqueue_module('<这列写热加载或者部署的名称>'); //其中的名称使 src/modules 下的目录名称 例如: main,这种 main/hello 注意: 目录下必须有一个index.ts文件 没有不会进行加载
//hp_enqueue_module('main', 'main/hello');
```
## wordpress 的 `wp-config.php` 中的配置
通过配置常量表明 wordpress 会加载打包好的模块(pnpm build) 

否则 默认是 development的模式 会进入热加载模式
```php
define('MY_PLUGIN_CODE_MODE', 'production');
```

## 启动
```
pnpm dev
```

## 打包
```
pnpm build
```