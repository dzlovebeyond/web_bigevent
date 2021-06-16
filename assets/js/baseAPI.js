// 拼接API接口根路径

// jQuery在发起ajax请求前，会默认调用ajaxPrefilter函数，我们可以在这个函数中对请求路径进行拼接根路径的操作
// 这样，在写接口时不用每次手动拼接麻烦，后续如果修改根路径，只需要在这一个文件中修改即可

// 在发起ajax请求之前，拼接根路径
$.ajaxPrefilter(function(options) {
    // options.url可以获取ajax发起的请求中的url，在此拼接上根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    // 统计为有权限的接口设置headers请求头
    // 根据接口文档说明，接口路径中包含/my/的为需要认证的接口
    if (options.url.indexOf('/my/') !== -1) { //判断如果url中包括/my/，就携带请求头
        options.headers = {
            // 在登陆页面我们已经将认证成功后获取的tokey存储在本地存储localStorage中了
            //如果本地存储中没有token，就携带空字符串提交
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 此处遇到问题：
            // 下面两行代码完全可以写到success中获取失败的位置，实现同样的功能，为什么还要写complete函数？？？
            localStorage.removeItem('token') // 删除本地存储中的token
            location.href = 'login.html' //跳转到登陆页
        }
    }
})