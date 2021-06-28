// 文章类别 art_cate 专用 JS
$(function() { //入口函数

    // 调用自定义函数 初始化文章分类列表
    initArtCateList()

    // 添加类别按钮功能
    var indexAdd = null //添加按钮 弹出层索引，用于后续关闭弹出层使用
    $('#btnAddCate').on('click', function() {
        // type为弹出层基本类型，默认为0表示信息框，1表示页面层；使用area指定高度，默认自适应
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // content: '<h1>内容</h1>', //我们可以直接在content中写html标签，但这样太不方便了，可以在html中用script写好html结构，再在js中获取并渲染，类似使用模板引擎的方法
            content: $('#dialog-add').html()
        })

        // 表单提交功能
        // 由于表单是通过点击添加分类按钮动态生成的，所以不在直接绑定提交事件，因为在没点击之前是没有这个页面元素的
        // 利用事件代理 为表单添加提交事件
        // 为body绑定提交事件，代理到form-add表单元素上
        $('body').on('submit', '#form-add', function(e) {
            e.preventDefault() //阻止默认提交行为
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        layui.layer.msg('添加失败！')
                    }
                    initArtCateList() //刷新文章分类列表
                    layui.layer.msg('添加成功！')
                    layui.layer.close(indexAdd) //关闭弹出层
                }
            })
        })
    })

    // 编辑按钮功能-弹出修改窗口（layui弹出层）
    // 由于表格是动态生成的，所以不能直接绑定事件，需要通过事件代理来绑定点击事件
    var indexEdit = null //编辑按钮 弹出层索引，用于后续关闭弹出层使用
    $('tbody').on('click', '#btn-edit', function() {
        // layui弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html() //dialog-edit为html结构中的模板
        });
        var id = $(this).attr('data-id') //获取当前行数据的id号

        // console.log(id) //临时输出，调试使用
        // 发起请求获取对应id数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                layui.form.val('form-edit', res.data) //利用layui的form.val方法快速填充表单数据
            }
        })
    })

    // 编辑按钮功能-提交功能
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
            // 调用接口提交数据
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(), //快速拿到表单数据，进行提交
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新失败！')
                }
                initArtCateList() //刷新文章分类列表
                layui.layer.msg('更新成功！')
                layui.layer.close(indexEdit)
            }
        })
    })

    // 删除按钮功能
    var indexDelete = null //删除按钮 弹出层索引，用于后续关闭弹出层使用
    $('tbody').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id') //获取当前点击删除按钮所在行的id号

        // layui confirm弹出层 提示删除确认，icon表示使用的图标
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // console.log(id) //临时输出，调试使用
            // 调用接口，删除当前行数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        layui.layer.msg('删除失败！')
                    }
                    layui.layer.msg('删除成功！')
                    layui.layer.close(index); //关闭弹出层 删除提示框
                    initArtCateList() //刷新文章分类列表
                }
            })
        })
    })




    // 自定义函数 初始化文章分类列表
    function initArtCateList() {
        $.ajax({ //调用接口获取列表
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res) //临时输出，调试使用
                // 调用arttemplate模板引擎 渲染表格数据
                var htmlStr = template('tpl-table', res) //注意：模板id不需要加#
                $('tbody').html(htmlStr)
            }
        })

    }

})