// 个人中心-重置密码 专用JS
$(function() { //入口函数

    // 自定义表单验证
    var form = layui.form //导入layui中的form
    form.verify({
        pwd: function(value) {
            if (!/^[\S]{6,12}/.test(value)) {
                return '密码必须为 6 ~ 12 位非空格字符'
            }
        },
        samePwd: function(value) { //用于验证新密码和旧密码不能相同，value就是当前验证的输入框中 输入的值
            var oldPwd = $('.layui-form [name=oldPwd]').val() //获取输入的原密码
            if (oldPwd === value) {
                return '新密码不能与原密码相同！'
            }
        },
        rePwd: function(value) {
            var newPwd = $('[name=newPwd]').val() //获取输入的新密码
            if (newPwd !== value) {
                return '两次新密码不一致'
            }
        }
    })



    // 调用api接口修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault() //阻止默认提交行为

        // 使用ajax调用接口修改密码
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败')
                }
                layui.layer.msg('密码修改成功！')
            }
        })
    })


})