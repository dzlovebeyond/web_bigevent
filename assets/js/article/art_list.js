// 文章列表页面专用 JS
$(function() { //入口函数，用于避免主页页调用的各类js文章中变量名冲突

    // 定义一个模板引擎的过虑器，用于美化时间
    template.defaults.imports.dataFormat = function(date) {
            // 重新获取时间对象中的年月日时分秒，并且进行补0处理后返回
            const dt = new Date(date) //使用const定义一个常量，用于存储时间
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1) //系统时间里的月份从0开始，所以需要+1
            var d = padZero(dt.getDay()) //padZero为1位数的时间前面补0，美化格式
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 自定义函数，为时间补0
    function padZero(n) {
        // 如果n大于0说明是两位数，直接返回n，否则说明是一位数，则在前面补个0
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询参数的对象，用于请求数据时方便提交
    var q = {
        pagenum: 1, //页码，默认向服务器请求第1页
        pagesize: 2, //每页条目数，这里设置每页2条数据
        cate_id: '', //文章分类id，默认为空字符串，即所有分类
        state: '' //文章发布状态，默认为空字符串，即全部分类
    }


    // 调用自定义函数 初始化 文章分类 和 文章列表
    initCate()
    initTable()


    // 筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 获取表单中选择的value值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // console.log(cate_id, state); //临时输出，调试使用

        // 重新为上面的 查询参数的对象 赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的筛选条件 重新渲染文章列表数据
        initTable()
    })

    // 删除功能
    $('tbody').on('click', '.btn-delete', function() { //因为是动态渲染出来的表格，所以需要使用事件代理绑定事件
        // 此处遇到问题：之前$(this)这行放到layui.layer.confirm有问题，因为在layui.layer.confirm内部$(this)指向的不是事件的调用者，所以获取attr属性data-id失败
        // 解决方法：将下面这行代码移到layui.layer.confirm外部，获取文章id正常了
        var id = $(this).attr('data-id') //获取文章id

        // 获取当前页面删除按钮的个数，用于后续判断面码值使用
        var len = $('.btn-delete').length

        // 使用layui的弹出层的confirm方法 弹出提示信息
        layui.layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            // 如果点击了确认，则调用接口删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    // console.log(res) //临时输出，调试使用
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章失败！')
                    }
                    layui.layer.msg('删除文章成功！')

                    // 判断删除后应该显示的页码值，再刷新文章列表
                    if (len === 1) {
                        // 如果当前页面上只有1个删除按钮，说明删除1条数据之后，当前页就没有数据了，所以当前页码值应该减1，加载上一页数据
                        // 如果当前页码值已经是1了，就不能再减了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable() //刷新文章列表
                }
            })
            layui.layer.close(index) //关闭弹出层
        })
    })









    // 自定义函数 获取与初始化文章分类数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类失败！')
                }
                // 调用模板引擎渲染分类下列菜单
                var htmlStr = template('tpl-cate', res)

                // console.log(htmlStr) //临时输出，调试使用
                $('[name=cate_id]').html(htmlStr) // 利用属性选择器[] 选择select

                // 默认情况下，获取数据成功后，由于layui的渲染机制导致，页面下拉菜单并没有被渲染好
                // 使用调用layui的render方法，通知layui重新渲染表单区域的UI结构
                layui.form.render()
            }
        })
    }

    // 自定义函数 获取与初始化文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res) //临时输出，调试使用
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败！')
                }
                // layui.layer.msg('获取文章列表成功！')

                // 使用art-template模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用自定义函数 渲染分页内容
                renderPage(res.total)
            }
        })
    }

    // 自定义函数 渲染分页
    function renderPage(total) {
        // 调用layui分页方法laypage.render方法来渲染分页结构
        layui.laypage.render({
            elem: 'pageBox', //指定用于渲染分页的DOM元素id，注意id前不用加 #，即页面结构中放置分页用盒子
            count: total, //总数据条数
            limit: q.pagesize, //每页显示的条目数
            curr: q.pagenum, //当前显示页面
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //选择分页的功能模块
            limits: [2, 5, 10], //自定义每页显示多少条目的菜单项，默认为10，20，30...
            // 当分页发生点击切换时，触发jump回调函数，如切换页码、切换每页显示数量
            jump: function(obj, first) {
                // console.log(obj.curr, obj.limit) //临时输出，调试使用

                // 把最新的页码值和每页显示数量 赋值给q
                q.pagenum = obj.curr

                // 把最新的每页条目数 赋值给q
                q.pagesize = obj.limit

                // 调用函数 重新初始化文章列表
                // initTable() //直接这样调用会出现死循环

                // 分析原因：
                // jump的触发条件有2个：
                // 1.当点击页码时触发
                // 2.只要调用了laypage.render就会触发
                // 死循环就发生在页面初始化时initTable()中调用了laypage.render，在laypage.render中又调用了initTable()，无限循环
                // 解决方法：
                // 在上面我们分析了，导致死循环的原因是jump的第2个触发条件，即调用laypage.render触发
                // 那么我们只要能控制，如果是通过这种方式触发的jump，就不执行initTable()，就可以阻止死循环了
                // 通过判断jump的第二个参数first值，来判断通过哪个方式触发的laypage.render
                // 1.当点击页码时触发（first值：undefiend）
                // 2.只要调用了laypage.render就会触发（first值：true）
                // console.log(first) //临时输出，调试使用

                // 改造后的代码
                // 如果是通过点击页码触发的jump回调，就调用函数 重新初始化文章列表
                // 如果是通过laypage.render触发的jump回调，就什么都不做
                if (!first) {
                    initTable()
                }

            }


        })
    }



})