// index专用JS文件
$(function() { //入口函数
    // 调用自定义函数 获取用户基本信息
    getUserInfo()

    // 退出功能
    var layer = layui.layer // 导出layui中的layer
    $('#btnLogout').on('click', function() {
        // 弹出退出提示框
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            // 点击确认按钮后执行的代码
            localStorage.removeItem('token') // 删除本地存储中的token
            location.href = 'login.html' //跳转到登陆页

            layer.close(index); // 必须保留这行代码，用于关闭confirm弹出层元素
        })
    })



    // 自定义函数 获取用户基本信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // headers 请求头配置字段，用于携带认证信息token
            // headers: { 请求头代码已移至 baseAPI.js中，方便后续开发与未来统一修改
            //     // 在登陆页面我们已经将认证成功后获取的tokey存储在本地存储localStorage中了
            //     //如果本地存储中没有token，就携带空字符串提交
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                    // 如果获取失败，直接返回错误信息
                    if (res.status !== 0) {
                        return layui.layer.msg('res.message')
                    }
                    // 如果获取成功，调用函数渲染用户头像，将获取到的data中的数据做为参数传给函数
                    renderAvatar(res.data)
                } //,
                /*  此处代码已优化移至baseAPI.js中
                    // 调用函数成功会调用success回调函数，失败会调用error回调函数，无论成功或失败都会最终调用complete回调函数
                    complete: function(res) { //如果调用认证接口失败，则强制跳转至登陆页
                        // console.log('complete:', res);
                        // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
                        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                            // 此处遇到问题：
                            // 下面两行代码完全可以写到success中获取失败的位置，实现同样的功能，为什么还要写complete函数？？？
                            localStorage.removeItem('token') // 删除本地存储中的token
                            location.href = 'login.html' //跳转到登陆页
                        }
                    }
                 */
        })
    }


    // 自定义函数 渲染用户名和头像
    function renderAvatar(user) {
        // 渲染用户名
        // 获取用户名称，如果有昵称则显示，没有则显示用户名
        var name = user.nickname || user.username
            // 获取页面元素，更新元素内容
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

        // 渲染用户头像，如果有图片则渲染图片头像，没有渲染文本头像
        if (user.user_pic !== null) {
            // 渲染图片头像
            $('.layui-nav-img').attr('src', user.user_pic).show() //替换图片中src属性，并显示图片元素
            $('.text-avatar').hide() //隐藏文本头像元素
        } else {
            // 渲染文本头像
            var first = name[0].toUpperCase() //获取名字中的第一个字符，并转换成大写
            $('.text-avatar').html(first).show() //替换元素中内容，并显示元素
            $('.layui-nav-img').hide() //隐藏图片头像元素
        }


    }
})