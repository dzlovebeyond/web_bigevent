// login专用JS

$(function() { //入口函数
    // 登录与注册页面的切换
    $('#link_reg').on('click', function() { //点击 去注册，就隐藏登录的div 显示注册的div
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() { //点击 去登录，就隐藏注册的div 显示登录的div
        $('.reg-box').hide()
        $('.login-box').show()
    })



    // 自定义Layui表单验证规则
    // 从Layui中获取 form 对象，在form中添加自定义验证规则
    var form = layui.form
    form.verify({ //通过form.veryfy()函数自定义校验规则
        // 自定义了一个pwd校验规则，用于校验密码位数必须在6-12位，且不同出现空格
        pwd: [/^[\S]{6,12}$/, '密码位数必须在6-12位，且不同出现空格'],
        // 自定义一个repwd校验规则，用于校验两次密码是否一至
        repwd: function(value) {
            // 获取密码框输入的密码
            var passwd = $('.reg-box [name=password]').val() //利用[]属性选择器，选择密码输入框
            if (passwd !== value) { //value为当前规则验证的输入框内容，即repassword输入框的内容
                return '两次密码不一致！'
            }
        }
    })



    // 注册功能
    var layer = layui.layer //导出layui中的layer，后续用于显示弹出层提示信息
    $('#form_reg').on('submit', function(e) {
        e.preventDefault() //阻止默认提交行为

        // 获取表单元素中输入的内容，即输入的用户名密码
        var uname = $('#form_reg [name=username]').val()
        var upwd = $('#form_reg [name=password]').val()

        // 发起Ajax的POST请求，调用注册接口，提交注册信息
        $.post('/api/reguser', {
                username: uname,
                password: upwd
            },
            function(res) {
                //根据接口文档说明，0为注册成功，1为注册失败，message为返回消息
                if (res.status !== 0) { //如果注册失败，显示返回的消息，否则显示注册成功信息，并自动跳转到登录页面
                    // return console.log(res.message)
                    return layer.msg(res.message) //使用layui中的layer弹出层显示返回的消息
                }
                // console.log('注册成功！')
                layer.msg('注册成功，请登录！')
                    // 注册成功后，自动跳转到登录页面
                $('#link_login').click() //模拟点击 去登录 链接
            })
    })



    // 登录功能
    // 绑定表单的提交事件，有两种方法，注册使用的是on方法，登录尝试直接使用submit方法
    $('#form_login').submit(function(e) {
        e.preventDefault() //阻止默认提交行为

        // 获取表单元素中输入的内容，即输入的用户名密码
        var uname = $('#form_login [name=username]').val()
        var upwd = $('#form_login [name=password]').val()

        // 发起Ajax的POST请求，调用登录接口，提交登录信息
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(), //利用jQuery的serialize快速获取表单数据，this表示当前触发事件的表单
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功！')

                // 登录成功后，存储token认证信息到本地存储，以便后续页面使用
                localStorage.setItem('token', res.token)

                // 登录成功后，跳转到主页
                location.href = 'index.html'
            }
        })

        /*  //作用与上面代码相同，上面为另一种实现方式
            $.post('/api/login', {
                username: uname,
                password: upwd
            }, function(res) {
                // console.log(res) //临时输出，调试使用
                if (res.status !== 0) { //如果登录失败，使用layui的msg弹出层显示错误信息，成功能显示成功信息
                    return layer.msg(res.message)
                }
                layer.msg('登录成功！')
                // 登录成功后跳转到主页
                location.href = 'index.html'
            })
         */
    })

})