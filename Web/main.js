/*---------------------------------------------------------------------------------------------
 *  Copyright (c) HongYangSoft Corporation. All rights reserved.
 *  author: 林志斌     date: 2019-08-06
 *--------------------------------------------------------------------------------------------*/
function initIndexPage(t) {
    var MENU_FILTER = "mainTab";
    var SIDE_SHRINK = "main-side-shrink";
    var NAV = ".main-nav";
    var NAV_BAR = "main-nav-bar";
    var NAV_TRI = "main-nav-tri";
    var NAV_ITEM = "main-nav-item";
    var NAV_TREE = "main-nav-tree";
    var NAV_MORE = "main-nav-more";
    var NAV_CHILD = "main-nav-child";

    var MENU = ".main-menu";
    var MENU_ITEM = "main-menu-item";
    var MENU_TREE = "main-menu-tree";
    var MENU_CHILD = "main-menu-child";

    var TAB_BAR = "main-tab-bar";
    var TAB_MORE = "main-tab-more";
    var MAIN_THIS = "main-this";
    var MAIN_SHOW = "main-show";
    var ANIM_UPBIT = "main-anim main-anim-upbit";
    var ELEMENT = "element";

    var ele = function () {
        this.config = {}
    };

    // 元素事件
    var elEvent = {
        /**
         * 窗口变化 
         */
        resize: function () {
            var p = fHelper.pageSize();
            $('.main-side').height(p[1]); // 通过js支持满屏高度
            $(".main-tab-item").height(p[1] - 150);
            var l = "fa-angle-double-left";
            var r = "fa-angle-double-right";
            if (p[0] < 767) {
                $('#mainApp').addClass(SIDE_SHRINK); //小屏
                $('.' + NAV_TREE).find('.' + NAV_CHILD).width(p[0] - 60);
            } else {
                $('#mainApp').removeClass(SIDE_SHRINK); //大屏
                var i = $('.' + r);
                i.removeClass(r);
                i.addClass(l);
            }
        },
        /**
         * 新增Tab
         */
        tabShow: function (t, o) {
            if (!o) {
                console.info('tabObject can not be null');
                return;
            }
            // id为空将随机使用三位数
            o.id = (o.id && o.id !== '') ? o.id : (Math.random() * 1000 | 0);
            var l = $(".main-tab[lay-filter=" + t + "]"); // div
            var n = l.children(".main-tab-title"); // ul
            var s = n.find('>li[lay-id=' + (o.id || "") + ']');
            if (!s || s.length <= 0) {
                var c = l.children(".main-tab-content");
                var s = n.children(".main-tab-bar");
                var f = "iframe" + o.id;
                var r = '<li lay-id="' + o.id + '"' + (o.attr ? ' lay-attr="' + o.attr + '"' : "") + ">" + (o.title || "unnaming") + "</li>";
                var j = '<iframe id="' + f + '" name="' + f + '" class="main-iframe" src="' + fHelper.srcHandler(o.href) + '"></iframe>';
                s[0] ? s.before(r) : n.append(r);
                c.append('<div class="main-tab-item">' + (o.content || j) + "</div>");
                elEvent.hideTabMore(!0);
                elEvent.tabAuto();
                s = n.find('>li[lay-id=' + o.id + ']');
                $(".main-tab-item").height(fHelper.pageSize()[1] - 150);
                fHelper.listeningKey(document.getElementById(f).contentWindow); // 为新添加的iframe的document绑定按键监听
            }
            elEvent.tabClick.call(s[0], null, null, s);
        },
        /**
         * 点击Tab
         */
        tabClick: function (t, i, s, o) {
            o = o || {};
            var r = s || $(this);
            var i = i || r.parent().children("li").index(r);
            var c = o.headerElem ? r.parent() : r.parents(".main-tab").eq(0);
            var u = o.bodyElem ? $(o.bodyElem) : c.children(".main-tab-content").children(".main-tab-item");
            var d = r.find("a");
            var y = c.attr("lay-filter");
            if (d.attr("href") !== "javascript:;") {
                r.addClass(MAIN_THIS).siblings().removeClass(MAIN_THIS);
                u.eq(i).addClass(MAIN_SHOW).siblings().removeClass(MAIN_SHOW);
            }
            fHelper.event.call(this, ELEMENT, "tab(" + y + ")", {
                elem: c,
                index: i
            });
        },
        /**
         * 删除Tab
         */
        tabDelete: function (t, i) {
            var n = $(this).parent();
            if (t && typeof t === "string") {
                var l = $(".main-tab[lay-filter=" + t + "]");
                var h = l.children(".main-tab-title");
                n = h.find('>li[lay-id="' + i + '"]') || n;
            }
            var s = n.index();
            var o = n.parents(".main-tab").eq(0);
            var r = o.children(".main-tab-content").children(".main-tab-item");
            var c = o.attr("lay-filter");
            if (n.hasClass(MAIN_THIS)) {
                var next = n.next()[0];
                if (next && !n.next().hasClass('main-tab-bar')) {
                    elEvent.tabClick.call(n.next()[0], null, s + 1);
                } else {
                    n.prev()[0] && elEvent.tabClick.call(n.prev()[0], null, s - 1);
                }
            }
            n.remove();
            r.eq(s).remove();
            setTimeout(function () {
                elEvent.tabAuto();
            }, 50);
        },
        /**
         * 更新Tab
         */
        tabUpdate: function (t, o) {
            var l = $(".main-tab[lay-filter=" + t + "]"); // div
            var n = l.children(".main-tab-title"); // ul
            var c = l.children(".main-tab-content"); // content
            var i = n.find('>li[lay-id=' + o.id + ']'); //li
            if (i && c) {
                i.attr('lay-attr', o.attr);
                i.html(o.title || "unnaming");
                c.find("#iframehome" + o.id).attr("src", fHelper.srcHandler(o.href));
                return true;
            }
            return false;
        },
        /**
         * 调整Tab
         */
        tabAuto: function () {
            $(".main-tab").each(function () {
                var self = $(this);
                var o = self.children(".main-tab-title");
                var c = $('<span class="main-unselect main-tab-bar" lay-stope="tabmore">\
                    <i class="main-icon fa fa-angle-down" lay-stope="tabmore"></i></span>');
                if (self.attr("lay-allowClose")) {
                    o.find("li").each(function () {
                        var t = $(this);
                        if (t.attr('lay-id') === 'home') return true;
                        if (!t.find(".main-tab-close")[0]) {
                            var i = $('<span class="main-unselect main-tab-close">×</span>');
                            i.on("click", elEvent.tabDelete);
                            t.append(i);
                        }
                    });
                    if (typeof self.attr("lay-unauto") !== "string") {
                        var outerWidth = fHelper.isStandardBro() ?
                            o.outerWidth() : fHelper.pageSize()[0] - $(".main-side").eq(0).width();
                        if (o.prop("scrollWidth") > outerWidth + 1) {
                            if (o.find("." + TAB_BAR)[0]) return;
                            o.append(c); // ul
                            self.attr("overflow", "");
                            c.on("click", function (a) {
                                var more = o.hasClass(TAB_MORE);
                                o[more ? "removeClass" : "addClass"](TAB_MORE);
                                if (!fHelper.isStandardBro()) {
                                    var m = $('.main-icon[lay-stope=tabmore]').eq(0);
                                    m[more ? 'removeClass' : "addClass"]('fa-angle-up');
                                    m[more ? 'addClass' : "removeClass"]('fa-angle-down');
                                }
                            });
                        } else {
                            o.find("." + TAB_BAR).remove();
                            self.removeAttr("overflow");
                        }
                    }
                }
            });
        },
        /**
         * 隐藏Tab展示更多
         */
        hideTabMore: function (t) {
            var i = $(".main-tab-title");
            if ("tabmore" === $(t.target).attr("lay-stope")) {
                // 展示所有选项Tab

            } else {
                i.removeClass(TAB_MORE);
                i.find(".main-tab-bar").attr("title", "");
                i.find(".main-icon[lay-stope=tabmore]")
                    .removeClass('fa-angle-up')
                    .addClass('fa-angle-down');
            }
        },
        /**
         * 左侧菜单节点击事件
         */
        clickThis: function () {
            var self = $(this); // a
            var s = self.parent(); // li
            var i = self.parents(MENU); // ul
            var p = self.parents(".main-tab"); // box
            var c = self.siblings("." + MENU_CHILD);
            var d = self.attr('data-id');
            var j = self.attr('data-href');
            if (self.attr("href") === "javascript:;" && j && d) {
                // 打开模块
                i.find("." + MAIN_THIS).removeClass(MAIN_THIS);
                s.addClass(MAIN_THIS);
                elEvent.tabShow(MENU_FILTER, {
                    id: d,
                    href: j,
                    title: self.attr('data-tab')
                });

                // 关闭子菜单
                var m = self.parents('.main-nav-itemed').eq(0);
                m.removeClass('main-nav-itemed');
                var shrink = $('.main-side-shrink');
                if (shrink && shrink.length > 0) return;
                elEvent.shrinkMenu($('.main-nav-tri[main-event=shrinkMenu]')); // 菜单展开的话进行关闭
            } else if (i.hasClass(MENU_TREE)) {
                if (c[0]) {
                    // 添加/移除选中itemed
                    s[c.css("display") === "none" ? "addClass" : "removeClass"](MENU_ITEM + "ed");
                    // 子菜单只允许有一个展开
                    if (i.attr("lay-shrink") === "onlyone") {
                        s.siblings().removeClass(MENU_ITEM + "ed"); // 关闭其他子节点
                    }
                }
            }
        },
        /**
         * 展开/隐藏左侧菜单
         */
        shrinkMenu: function (t) {
            var app = $("#mainApp");
            var l = "fa-angle-double-left";
            var r = "fa-angle-double-right";
            var x = "visible-sm";
            var w = fHelper.pageSize()[0];
            if (app && app.hasClass(SIDE_SHRINK)) {
                // 展开
                app.removeClass(SIDE_SHRINK);
                t.find('.' + r).removeClass(r).addClass(l);
                if (w < 420) $('.flexible-hide-xs').addClass(x), $('.' + NAV_TREE).find('.' + NAV_CHILD).width(w - 165);
            } else {
                // 收缩
                app.addClass(SIDE_SHRINK);
                t.find('.' + l).removeClass(l).addClass(r);
                if (w < 420) $('.flexible-hide-xs').removeClass(x), $('.' + NAV_TREE).find('.' + NAV_CHILD).width(w - 60);
            }
        },
        /**
         * 刷新页面
         */
        refresh: function () {
            window.location.href = window.location.href;
        },
        /**
         * 全屏显示
         */
        fullScreen: function (e) {
            // 判断是否全屏（以下判断无法判断出手动按F11全屏，可根据屏幕分辨率和可见区域大小来判断是否全屏）
            var tip = "当前浏览器不支持脚本设置全屏，请按【F11】手动设置";
            if (document.fullscreenElement) {
                // 退出全屏
                if (!fHelper.exitFullScreen()) {
                    alert(tip);
                }
            } else {
                // 全屏
                if (!fHelper.fullScreen()) {
                    alert(tip);
                }
            }
        },
        /**
         * 切换科室
         */
        changeDept: function () {
            window.location.href = (deptSelectUrl || window.location.href);
        },
        /**
         * 帮助文档
         */
        helper: function () {
            var t = $(".main-tab>.main-tab-title>.main-this");
            alert("showModel目录【" + t.attr('lay-id') + "】的帮助文档");
        },
        /**
         * 消息中心
         */
        message: function () {
            console.log('消息中心')
        },
        /**
         * 用户信息
         */
        userInfo: function () {
            console.log('用户信息')
        },
        /**
         * 修改密码
         */
        changePwd: function () {
            console.log('修改密码')
        },
        /**
         * 登出系统
         */
        logout: function () {
            $.post((HandlerUrl || ""), { getmethod: "Logout" }, function (d) {
                window.location.href = (logginUrl || window.location.href);
            });
        }
    };

    // 工具函数
    var fHelper = {
        each: function (e, t) {
            var o, n = this;
            if ("function" != typeof t)
                return n;
            if (e = e || [], e.constructor === Object) {
                for (o in e) {
                    if (t.call(e[o], o, e[o])) break;
                }
            } else {
                for (o = 0; o < e.length && !t.call(e[o], o, e[o]); o++);
                return n;
            }
        },
        event: function (e, t, n, r) {
            var a = null;
            var u = t.match(/\((.*)\)$/) || [];
            var l = (e + "." + t).replace(u[0], "");
            var s = u[1] || "";
            var c = function (e, t) {
                var o = t && t.call(i, n); o === !1 && null === a && (a = !1);
            };
            var o = {
                modules: {},
                status: {},
                timeout: 10,
                event: {}
            };
            return r ?
                (o.event[l] = o.event[l] || {}, o.event[l][s] = [r], this) :
                (fHelper.each(o.event[l], function (e, t) {
                    return "{*}" === s ? void this.each(t, c) : ("" === e && this.each(t, c), void (s && e === s && this.each(t, c)))
                }), a);
        },
        pageSize: function () {
            // 返回页面文档高度
            return [document.documentElement.clientWidth, document.documentElement.clientHeight];
        },
        browserJudge: function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                return "Opera";
            }; //判断是否Opera浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            } //判断是否Firefox浏览器
            if (userAgent.indexOf("Chrome") > -1) {
                return "Chrome";
            }
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            } //判断是否Safari浏览器
            if ((userAgent.indexOf("compatible") > -1 || userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) && !isOpera) {
                var IE5 = IE55 = IE6 = IE7 = IE8 = false;
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var v = parseFloat(RegExp["$1"]);
                if (v === 5.5) {
                    return "IE55";
                }
                if (v === 6.0) {
                    return "IE6";
                }
                if (v === 7.0) {
                    return "IE7";
                }
                if (v === 8.0) {
                    return "IE8";
                }
                return "IE9+";
            }; //判断是否IE浏览器
            return "";
        },
        isPhone: function () {
            var u = navigator.userAgent.toLowerCase();
            var isIpad = u.match(/ipad/i) == "ipad";
            var isIphoneOs = u.match(/iphone os/i) == "iphone os";
            var isMidp = u.match(/midp/i) == "midp";
            var isUc7 = u.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var isUc = u.match(/ucweb/i) == "ucweb";
            var isAndroid = u.match(/android/i) == "android";
            var isCE = u.match(/windows ce/i) == "windows ce";
            var isWM = u.match(/windows mobile/i) == "windows mobile";
            if (isIpad || isIphoneOs || isMidp || isUc7 || isUc || isAndroid || isCE || isWM) {
                return true;
            }
            return false;
        },
        isPc: function () {
            return !this.isPhone();
        },
        isStandardBro: function () {
            var v = this.browserJudge();
            return v !== '' && (v === "IE9+" || v.indexOf("IE") === -1);
        },
        redrawPseudoEl: function (el) {
            el.addClass('content-empty');
            setTimeout(function () {
                el.removeClass('content-empty');
            }, 0);
        },
        srcHandler: function (u) {
            //虚拟路径处理
            u = u.replace("~/", "");
            return "../" + u;
        },
        listeningKey: function (d) {
            if (fHelper.isStandardBro()) {
                try {
                    d.addEventListener('keydown', function (event) {
                        var e = event || window.event || arguments.callee.caller.arguments[0];
                        if (e.ctrlKey && e.keyCode == 123) {
                            elEvent.helper(); // Ctrl + F12  打开帮助文档
                        }
                    });

                } catch (e) { }
            }
        },
        fullScreen: function () {
            // 全屏
            try {
                var e = document.documentElement;
                if (e.requestFullscreen) {
                    //W3C   
                    e.requestFullscreen();
                    return true;
                } else if (e.mozRequestFullScreen) {
                    //FireFox   
                    e.mozRequestFullScreen();
                    return true;
                } else if (e.webkitRequestFullScreen) {
                    //Chrome等   
                    e.webkitRequestFullScreen();
                    return true;
                } else if (elem.msRequestFullscreen) {
                    //IE11   
                    elem.msRequestFullscreen();
                    return true;
                }
            } catch (e) { }
            return false;
        },
        exitFullScreen: function () {
            // 退出全屏
            try {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                    return true;
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                    return true;
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                    return true;
                }
            } catch (e) { }
            return false;
        }
    }

    /**
     * 判断Tab是否存在
     * @param 属性lay-filter值
     * @param 项lay-id值
     */
    ele.prototype.hasTab = function (t, i) {
        var l = $(".main-tab[lay-filter=" + t + "]"); // div
        var n = l.children(".main-tab-title"); // ul
        var i = n.find('>li[lay-id=' + (i || "") + ']');
        return i && i.length > 0;
    };

    /**
     * 切换Tab
     * @param 项lay-id值
     * @param 属性lay-filter值
     */
    ele.prototype.tabChange = function (i, t) {
        t = (t || MENU_FILTER);
        var l = $(".main-tab[lay-filter=" + t + "]");
        var n = l.children(".main-tab-title");
        var s = n.find('>li[lay-id="' + i + '"]');
        elEvent.tabClick.call(s[0], null, null, s);
        return this;
    };

    /**
     * 添加Tab
     * @param 项对象eg: {id: 't01', attr: 't01', title: '新建项01', content: '内容01'}
     * @param 属性lay-filter值
     */
    ele.prototype.tabShow = function (o, t) {
        t = (t || MENU_FILTER);
        elEvent.tabShow(t, o);
    };

    /**
     * 删除Tab
     * @param 项lay-id值
     * @param 属性lay-filter值
     */
    ele.prototype.tabDelete = function (i, t) {
        t = (t || MENU_FILTER);
        elEvent.tabDelete(t, i);
    };

    /**
     * 修改Tab
     * @param 项对象eg: {id: 't01', attr: 't01', title: '新建项01', content: '内容01'}
     * @param 属性lay-filter值
     */
    ele.prototype.tabUpdate = function (o, t) {
        t = (t || MENU_FILTER);
        return (this.hasTab(t, o.id) && elEvent.tabUpdate(t, o));
    };

    /**
     * 初始化函数
     * @param 内部初始化函数名称(不指定则默认初始化所有)
     * @param 指定lay-filter属性对象
     */
    ele.prototype.init = function (action, e) {
        var filter = function () {
            return e ? '[lay-filter="' + e + '"]' : ""
        }();
        var actions = {
            //选项卡初始化
            tab: function () {
                elEvent.tabAuto.call({});
            },
            //导航栏初始化
            nav: function () {
                var e = {};
                var s = {};
                var p = {};
                var m = {};
                var nout = {};
                var t = 300; // 导航子菜单隐藏触发时间
                var t_menu = 600; // 菜单子菜单移除隐藏触发时间
                var isStandB = fHelper.isStandardBro();
                var isPc = fHelper.isPc();
                var mout = isPc ? "mouseleave" : "mouseout";
                var mover = isPc ? "mouseenter" : "mouseover";
                var movar_event = function (obj, o, i, tar) {
                    var self = $(this).parent();
                    if (o.hasClass(NAV_TREE)) {
                        //移除已有的itemed
                        var ed = $("." + NAV_TREE).find(".main-nav-itemed");
                        ed.removeClass("main-nav-itemed");
                        if (!isStandB) {
                            // IE8伪元素无法重新渲染问题处理
                            fHelper.redrawPseudoEl(ed.find(".fa"));
                        }
                        // 菜单栏
                        clearTimeout(nout[i]);
                        obj.css({
                            top: self.position().top,
                            height: self.children("a").outerHeight(),
                            opacity: 1
                        });
                        self.addClass(NAV_ITEM + 'ed');
                        var n = self.find("." + NAV_CHILD);
                        var h = self.offset().top;
                        var pageHeight = fHelper.pageSize()[1];
                        var top = pageHeight - n.height() - 40;
                        if (n.height() > pageHeight) {
                            n.css('top', 0);
                            n.height(pageHeight - 10);
                        } else {
                            n.css('top', (h + n.height() > pageHeight) ? (top < 0 ? 0 : top) : h);
                        }
                    } else {
                        // 导航栏
                        var f = self.find("." + NAV_CHILD);
                        clearTimeout(p[i]);
                        if ($(tar.target).hasClass(NAV_TRI) || $(tar.target).parent().hasClass(NAV_TRI)) {
                            if (f.hasClass(MAIN_SHOW)) {
                                clearTimeout(s[i]);
                                return;
                            }
                            obj.css({
                                left: self.position().left + parseFloat(self.css("marginLeft")),
                                top: self.position().top + self.height() - obj.height()
                            });
                            e[i] = setTimeout(function () {
                                obj.css({
                                    width: self.width(),
                                    opacity: 1
                                })
                            }, isStandB ? t : 0);
                            isStandB ? f.addClass(ANIM_UPBIT) : f.addClass(MAIN_SHOW);
                            if ("block" === obj.css("display") || "inline" === obj.css("display")) {
                                s[i] = setTimeout(function () {
                                    f.addClass(MAIN_SHOW);
                                    self.find("." + NAV_MORE).addClass(NAV_MORE + "d");
                                }, isStandB ? 300 : 0);
                            }
                        } else {
                            clearTimeout(s[i]);
                        }
                    }
                };

                var mout_event = function (obj, o, i, tar) {
                    if (!tar.toElement) return;
                    if (o.hasClass(NAV_TREE)) {
                        // 菜单栏
                        clearTimeout(nout[i]);
                        nout[i] = setTimeout(function () {
                            var ed = o.find('.main-nav-itemed');
                            ed.removeClass(NAV_ITEM + 'ed');
                            if (!isStandB) {
                                fHelper.redrawPseudoEl(ed.find(".fa")); // IE8伪元素无法重新渲染问题处理
                            }
                        }, t_menu);
                    } else {
                        // 导航栏
                        clearTimeout(s[i]);
                        s[i] = setTimeout(function () {
                            var t = $(tar.target).parents('.' + NAV_ITEM);
                            t.find("." + NAV_CHILD).removeClass(MAIN_SHOW);
                            t.find("." + NAV_MORE).removeClass(NAV_MORE + "d");
                        }, t);
                    }
                }

                $(NAV + filter).each(function (i) {
                    var self = $(this);  // ul
                    var o = $('<span class="' + NAV_BAR + '"></span>');
                    var h = self.find("." + NAV_ITEM); // li
                    var a = self.find("." + NAV_TRI);  // 触发动作的a元素
                    var c = h.find("." + NAV_CHILD);   // 触发后显示的内容
                    if (!self.find("." + NAV_BAR)[0]) {
                        self.append(o);
                        a.on(mover, function (tar) {
                            movar_event.call(this, o, self, i, tar);
                        }).on(mout, function (tar) {
                            mout_event.call(this, o, self, i, tar);
                        });
                        c.on(mover, function (tar) {
                            movar_event.call(this, o, self, i, tar);
                        }).on(mout, function (tar) {
                            mout_event.call(this, o, self, i, tar);
                        });

                        // 绑定移除ul时移除小游标（内缩动画）
                        self.on(mout,
                            function (tar) {
                                if (!tar.toElement) return;
                                clearTimeout(e[i]);
                                p[i] = setTimeout(function () {
                                    self.hasClass(NAV_TREE) ? o.css({
                                        height: 0,
                                        top: o.position().top + o.height() / 2,
                                        opacity: 0
                                    }) : o.css({
                                        width: 0,
                                        left: o.position().left + o.width() / 2,
                                        opacity: 0
                                    })
                                }, isStandB ? t : 0);
                            });
                    }
                })
            },
            //导航栏初始化
            menu: function () {
                $(MENU + filter).each(function (i) {
                    var self = $(this);  // ul
                    var h = self.find("." + MENU_ITEM); // li
                    if (h && h.length > 0) {
                        h.find("a").each(function () {
                            var l = $(this);
                            var c = l.siblings("." + MENU_CHILD);
                            if (c && c.length > 0) {
                                l.append('<span class="' + NAV_MORE + '"></span>');
                            }
                            // 点击展开子菜单
                            l.off("click", elEvent.clickThis).on("click", elEvent.clickThis);
                        });
                    }
                })
            },
            //函数最后初始化，放在所有初始化函数之后，做一些控件事件的绑定等等
            comm: function () {
                // 高度适应
                elEvent.resize();
                $(window).resize(function () {
                    elEvent.resize();
                    elEvent.tabAuto();
                });
                // 事件绑定
                $(document).on("click", ".main-tab-title li", elEvent.tabClick);
                $(document).on("click", elEvent.hideTabMore);
                $('a[main-event]').on('click', function () {
                    var othis = $(this);
                    var event = othis.attr('main-event');
                    elEvent[event] ? elEvent[event].call(this, othis) : '';
                });
                // 监听按键
                fHelper.listeningKey(document);
            }
        };
        return actions[action] ? actions[action]() : fHelper.each(actions,
            function (action, fun) {
                fun();
            });
    };
    var eleObj = new ele;
    eleObj.init();
    return eleObj;
}

