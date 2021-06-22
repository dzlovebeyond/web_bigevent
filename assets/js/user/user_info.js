// 个人中心-基本资料 专用JS
$(function() { //入口函数

    // 创建自定义的验证规则
    var form = layui.form // 导出layui的form
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })


    // 调用自定义函数 初始化表单用户信息
    initUserInfo()


    // 重置按钮功能
    $('#btnReset').on('click', function(e) {
        // 在这里，默认情况下，重置会清空表单所有数据
        e.preventDefault() //阻止表单默认行为
        initUserInfo() //重新初始化表单数据
    })


    // 提交表单功能
    $('.layui-form').on('submit', function(e) {
        e.preventDefault() //阻止表单默认行为
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')

                // 更新基本信息后，更新头像处 用户名显示信息
                // 在iframe中调用父页面中的 渲染用户头像和用户信息的 方法
                // window表示当前iframe，parent表示父页面，在父页面中引入的index.js，有一个getUserInfo的方法，用于渲染用户信息
                window.parent.getUserInfo()

                // 此处遇到window.parent.getUserInfo未定义错误
                // 原因是getUserInfo函数在index.js中不是全局函数，而是写在入口函数内部，所以无法直接调用
                // 将getUserInfo调整到index.js全局位置后，问题解决
            }
        })
    })







    // 自定义函数 调用接口获取用户信息 对表单进行初始化
    function initUserInfo() {
        var layer = layui.layer //导入layui的layer
        $.ajax({
            method: 'GET',
            url: '/my/userinfo', //接口根路径由baseAPI.js自动进行拼接
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 调用layui的 form.val() 快速为表单赋值
                // 使用res.data对象中的数据，为表单lay-filter属性为formUserInfo对应的表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
})