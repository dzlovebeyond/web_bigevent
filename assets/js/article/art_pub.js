// 文章发布页面专用 JS
$(function() { //入口函数

    // 调用自定义函数 获取文章类别
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 初始化裁剪区
    var $image = $('#image') //初始化图片裁剪器
    var options = { //裁剪选项
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $image.cropper(options) //初始化裁剪区域

    // 裁剪区 选择文件按钮
    $('#btnChoseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听文件选择框 更新客户选择的图片
    $('#coverFile').on('change', function(e) {
        // 获取选择的文件信息列表数组
        var files = e.target.files

        // 判断是否选择了文件，如果没选择文件就直接返回退出，选择了文件则继续执行后续代码
        if (files.lengh == 0) {
            return
        }

        // 根据选择的文件，创建对应的URL地址，以便后面更新页面中显示的图片
        var newImageURL = URL.createObjectURL(files[0])

        // 为裁剪区更换图片
        $image.cropper('destroy').attr('src', newImageURL).cropper(options)
        console.log(newImageURL)
    })




    // 文章发布功能
    var art_state = '已发布' //存储发布状态，默认值为已发布
    $('#btnSave2').on('click', function() { //当用户点击存为草稿按钮，就将发布状态改为草稿
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        // 基于表单快速创建一个FormData对象，本次上传接口要求数据必须为FormData格式
        var fd = new FormData($(this)[0]) //将当前jQuery获取的表单元素用[0]的方法转为原生DOM元素，再传给FormDate方法创建FormData对象

        //向FormData对象追加发布状态属性state
        fd.append('state', art_state)

        // fd.forEach(function(v, k) { //临时输出，调试使用，循环打印FormData的数据
        //     console.log(k, v)
        // })

        // 将裁剪区 裁剪后的图片输出为一个文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            hight: 280
        }).toBlob(function(blob) { //将Canvasg画布上的内容转换为文件对象blob
            // 将文件对象追加到FormData中
            fd.append('cover_img', blob) //cover_img是接口规定的文件对象变量名称，blob是图片文件对象

            // 调用自定义函数，发起ajax请求（即发送请求数据fd）
            publishArticle(fd)
        })



    })








    // 自定义函数 获取文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎 渲染分类下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr) //动态向select追加元素

                // 一定要记得 调用form.render函数
                layui.form.render()
            }
        })
    }

    // 自定义函数 发起ajax请求，发送FormData数据fd
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器发送的是FormData数据，必须设置下面两个配置项，否则请求失败
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res) //临时输出，调试使用
                if (res.status !== 0) {
                    layui.layer.msg('发布失败！')
                }
                layui.layer.msg('发布成功！')

                // 发布成功后，跳转到文章列表页面
                location.href = 'art_list.html'
            }
        })
    }
})