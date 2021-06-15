// 拼接API接口根路径

// jQuery在发起ajax请求前，会默认调用ajaxPrefilter函数，我们可以在这个函数中对请求路径进行拼接根路径的操作
// 这样，在写接口时不用每次手动拼接麻烦，后续如果修改根路径，只需要在这一个文件中修改即可

// 在发起ajax请求之前，拼接根路径
$.ajaxPrefilter(function(options) {
    // options.url可以获取ajax发起的请求中的url，在此拼接上根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})