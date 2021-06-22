// 个人中心-更换头像 专用JS
$(function() {

    // 裁剪区初始化
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比，指定裁剪框比例，1表示1/1即正方形，也可指定为4/3、16/9等
        aspectRatio: 1,
        // 指定预览区域，即用户在调整裁剪框的时候，在img-preview这个类的区域实时预览效果
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    // 获取到的页面元素$image调用一个cropper方法，传入options配置对象
    $image.cropper(options)





    // 选择文件并裁剪
    // 当点击了 上传文件 按钮，就让程序模拟点击 选择文件 按钮
    $('#btnChoseImage').on('click', function() {
        $('#file').click()
    })

    // 为文件选择框绑定 change事件，change事件用于监控文件选择框选择文件的这个变化
    $('#file').on('change', function(e) {
        // 获取用户选择的文件信息
        var filelist = e.target.files
        if (filelist.length === 0) { //如果列表不为空，表示选择了一个具体的文件
            return layui.layer.msg('请选择图片！')
        }
        // 获取文件名
        var file = e.target.files[0]

        // 获取文件URL（路径+名）
        var newImgURL = URL.createObjectURL(file)

        // 重新初始化裁剪区域
        // 先销毁裁剪区，重新设置图片路径，重新初始化裁剪区
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
    })





    // 上传裁剪后的图片
    $('#btnUpload').on('click', function() { //为确定按钮绑定点击事件
        // 获取裁剪后的图片头像
        var dataURL = $image.cropper('getCroppedCanvas', { //创建一个Canvas画布
                width: 100,
                height: 100
            }).toDataURL('image/png') //将Canvas 画布上的内容，转成base64格式的字符串图片

        // 调用接口上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败！')
                }
                layui.layer.msg('更换头像成功！')

                // 调用父页面index.html中引入的index.js中的getUserInfo的方法，重新渲染头像
                window.parent.getUserInfo()
            }
        })
    })
})