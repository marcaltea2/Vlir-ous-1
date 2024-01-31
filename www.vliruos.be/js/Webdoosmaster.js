$(function () {
    console.log('hoi');

    $(".infoblok").click(function () {
        var blok = $(this).closest(".infoblok");
        blok.siblings().addClass("closed");
        blok.toggleClass("closed");
    });
    $(".jaar").click(function () {
        var blok = $(this).closest(".jaar");
        blok.siblings().addClass("closed");
        blok.toggleClass("closed");
    });

    $(".slideswiper").each(function () {
        var nextbtn = $(this).siblings('.slidenav').find('.swiper-button-next');
        var prevbtn = $(this).siblings('.slidenav').find('.swiper-button-prev');
        var masterSwiper = new Swiper(this, {
            slidesPerView: 3,
            spaceBetween: 20,
            loop: false,
            watchOverflow: true,
            slidesPerColumnFill: "row",
            navigation: {
                nextEl: nextbtn,
                prevEl: prevbtn
            },
            breakpoints: {
                1000: {
                    slidesPerView: 2
                },
                650: {
                    slidesPerView: 1
                }
            }
        });
    });


    function makeMenuSticky() {
        if ($(window).width() > 480) {
            $(".resourcesidemenuwrapper").sticky({
                topSpacing: 0, responsiveWidth: true, bottomSpacing: function () {
                    return $('footer').height() + 50;
                },
            });
        } else {
            $(".resourcesidemenuwrapper").unstick();
        }
    }

    $(window).on("resize", function () {
        makeMenuSticky()
    });

    makeMenuSticky()
    // $(window).scroll(function(e){
    //   var $el = $('.storypageintro .imgwrapper');
    //   var isPositionFixed = ($el.css('position') == 'fixed');
    //   var headerheight = $("header").height();
    //   if ($(this).scrollTop() > headerheight && !isPositionFixed){
    //     $el.css({'position': 'fixed', 'top': '0px'});
    //   }
    //   if ($(this).scrollTop() < headerheight && isPositionFixed){
    //     $el.css({'position': 'absolute', 'top': '0px'});
    //   }
    // });
    var documentparentIds = [];
    $(document).on("click", "[data-role=opensubmenuitem]", function (e) {
        e.preventDefault();
        var sidemenuitem = $(this).closest(".sidemenuitem");
        sidemenuitem.siblings().removeClass("open");
        sidemenuitem.toggleClass("open");
        $("[data-role=showdocuments]").prop("checked", false);
        if (!sidemenuitem.hasClass("open")) {

            if (sidemenuitem.parent().hasClass('sidemenusub')) {
                documentparentIds = $.map(sidemenuitem.parent().find("[data-role=showdocuments]"), function (value) {
                    return $(value).val();
                });
                showDocs();
            } else {
                sidemenuitem.find("[data-role=showdocuments]").prop("checked", sidemenuitem.hasClass("open"));
                toggleDocs();
            }
        } else {
            documentparentIds = $.map(sidemenuitem.find("[data-role=showdocuments]"), function (value) {
                return $(value).val();
            });
            showDocs();
        }
    });

    $(document).on("change", "[data-role=showdocuments]", function (e) {
        var sidemenuitem = $("#c_" + $(this).val()).closest(".sidemenuitem");
        if (sidemenuitem.find("[data-role=showdocuments]:checked").length > 0) {
            toggleDocs();
        } else {
            documentparentIds = $.map(sidemenuitem.find("[data-role=showdocuments]"), function (value) {
                return $(value).val();
            });
            showDocs();
        }
    });

    function toggleDocs() {
        documentparentIds = $.map($("[data-role=showdocuments]:checked"), function (value) {
            return $(value).val();
        });
        showDocs();
    }

    function showDocs() {
        $(".resourcemainitem").hide();
        $(documentparentIds).each(function (i, e) {
            $("[data-parent=" + e + "]").show();
        });
        makeMenuSticky();
    }

    $(document).on("click", "[data-role=acceptcookies]", function (e) {
        e.preventDefault();
        $.ajax({
            data: {"action": "acceptCookies", "accept": 1},
            type: 'POST',
            success: function (data) {
                $(".cookienotice").addClass("hidden");
                window.location.reload(false);
            }
        })
    });

    $(document).on("click", "[data-role=denycookies]", function (e) {
        e.preventDefault();
        $.ajax({
            data: {"action": "acceptCookies", "accept": 0},
            type: 'POST',
            success: function (data) {
                window.location.reload(false);
            }
        })
    });

    $(document).on("click", "[data-role=showcookienotice]", function (e) {
        e.preventDefault();
        $(".cookienotice").removeClass("hidden");
    });


    var controller = new ScrollMagic.Controller();
    controller.scrollTo(function (newpos) {
        var headerheight = ($(window).width() > 990) ? 90 : 70;
        TweenMax.to(window, 0.75, {scrollTo: {y: newpos - headerheight}});
    });


    $(".scrollup").on("click", function (e) {
        e.preventDefault();
        controller.scrollTo(0);
    });

    $(document).on("click", "[data-role=page-link]", function (e) {
        e.preventDefault();
        var id = $(this).attr("href");
        if ($(id).length > 0) {
            controller.scrollTo(id);
            if (window.history && window.history.pushState) {
                history.pushState("", document.title, id);
            }
        }
    });


    $('body').on('submit', '[data-role="add-subscriber"]', function (e) {
        e.preventDefault();
        var input = $('body').find('[data-role="newsletteremail"]');
        var langinput = $('body').find('[data-role="newsletteremaillang"]');
        $.ajax({
            data: {'email': input.val(), 'action': 'subscribeNewsletter', 'lang': langinput.val()},
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.response == 1) {
                    $('body').find('[data-role="add-subscriber-message"]').html('You are subscribed to our newsletter!');
                    $('body').find('[data-role="add-subscriber-button"]').attr('disabled', 'disabled');
                    input.attr('disabled', 'disabled');
                    langinput.attr('disabled', 'disabled');
                }
            }
        })
    });


    $(document).on('click', '[data-role="toggle-filelist"]', function (e) {
        e.preventDefault();
        $(this).parent().find(".filelist").slideToggle();
    });

    $(document).on('click', "[data-role=togglefilters]", function (e) {
        e.preventDefault();
        $('html').toggleClass('filterlocked');
    });


    $("[data-role=filter]").each(function () {
        var label = $(this).data("label");
        var name = $(this).data("name");
        var $that = $(this);
        $(this).select2({
            placeholder: label,
            theme: "default"
        }).on('select2:select', function (e) {
            var data = e.params.data;
            var filter = $("<div data-role='removefilter'></div>");
            filter.addClass("filterlabel");
            if (label == "intervention type") {
                label = "interventiontype";
            }
            filter.attr('id', label + "_" + data.id)
            var checkboxlabel = $("<label/>").html("<span>" + data.text + "</span>" + '<i><svg><use xlink:href="#closeicon"/></svg></i>');
            filter.append(checkboxlabel);
            var checkbox = $("<input type='checkbox' value='" + data.id + "' name='" + name + "'  checked />");
            filter.append(checkbox);
            if ($('#' + label + "_" + data.id).length == 0) {
                $(".filter").append(filter);
            }

        });
    });

    $('body').on('click', '[data-role="removefilter"]', function (e) {
        $(this).remove();
    });

    $('body').on('click', '[data-role="filter-reset"]', function (e) {
        $(".filterlabel").remove();
    });


    $("[data-toggle=resourcepageitem], [data-toggle=resource], [data-toggle=interventiontype], [data-toggle=libraryitem]").on("click", function (e) {
        e.preventDefault();
        var val = "." + $(this).data("toggle");
        $(this).closest(val).toggleClass("open");
        $(this).closest(val).find(".libraryitem").toggleClass("open");
    });

    //
    // $("[data-toggle=call]").on("click",function(e){
    //     e.preventDefault();
    //     $(this).closest(".callpageitem").toggleClass("open");
    // });

    $(".text iframe").each(function () {
        var wrapper = $("<div/>").addClass("videowrapper");

        $(this).clone().appendTo(wrapper);
        $(this).after(wrapper);
        $(this).remove();
    });

    $("[data-role=contactform]").on("submit", function (e) {
        e.preventDefault();
        var $form = $(this);
        $.ajax({
            data: $form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.response == 1) {
                    $form.hide();
                    $form[0].reset();
                    $form.siblings(".formalert").fadeIn();
                }
            }
        })
    });


    $(".documentslides").each(function () {
        var nextbtn = $(this).siblings('.documentslidesnav').find('.documentslides-next');
        var prevbtn = $(this).siblings('.documentslidesnav').find('.documentslides-prev');
        var storySwiper = new Swiper(this, {
            slidesPerView: 4,
            slidesPerGroup: 4,
            loop: false,
            watchOverflow: true,
            spaceBetween: 20,
            slidesPerColumnFill: "row",
            navigation: {
                nextEl: nextbtn,
                prevEl: prevbtn
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    slidesPerGroup: 2
                }
            }
        });
    });

    $(".storyslides").each(function () {
        var nextbtn = $(this).siblings('.storyslidesnav').find('.storyslides-next');
        var prevbtn = $(this).siblings('.storyslidesnav').find('.storyslides-prev');
        var storySwiper = new Swiper(this, {
            slidesPerView: 1,
            loop: true,
            navigation: {
                nextEl: nextbtn,
                prevEl: prevbtn
            },
        });
    });

    $(".homeslides").each(function () {

        var storySwiper = new Swiper(this, {
            slidesPerView: 1,
            loop: true,
            autoplay: {
                delay: 7000,
            },
            effect: 'fade',
            speed: 1250,
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
        });
    });


    var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        slidesPerGroup: 1,
        spaceBetween: -30,
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 10,
            slideShadows: false
        }
    });

    $(document).on("click", "[data-role=togglemenu]", function () {
        $(".mobilemenu").toggleClass("open");
        $("html").toggleClass("locked");
        $(".mobilemenu").scrollTop(0);
    });

    $(document).on("click", ".regionlist h2", function () {
        $(this).closest(".regionlist").toggleClass("open");
    });

    $(document).on("click", "[data-role=show-testimonials]", function () {
        $(".testimonial-item").removeClass("hidden");
        $(this).remove();
    });

    $(".swipernext").on("click", function (e) {
        e.preventDefault();
        mySwiper.slideNext();
    });

    $(".swiperprev").on("click", function (e) {
        e.preventDefault();
        mySwiper.slidePrev();
    });


    var hash = window.location.hash;

    if (hash && hash != "") {
        controller.scrollTo(hash);
        if ($(hash).hasClass("callpageitem")) {
            //$(hash).addClass("open");
            hash = hash.replace('call', 'call_');
            lity(hash);
        }
        if ($(hash).hasClass("opencallwrapper")) {
            //$(hash).addClass("open");
            lity(hash);
        }

        if ($(hash).hasClass("resourcepageitem")) {
            $(hash).addClass("open");
            $(hash).find(".libraryitem").addClass("open");

        }
    }

    $('body').on('click', '[data-role="alertbox-link"]', function (e) {
        $.ajax({
            data: {'action': 'accept-cookies'},
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                $('body').find('[data-role="alertbox"]').remove();
            }
        })
    });


    if ($("[data-role=newsspotlight]").length > 0) {

        var newsSwiper = new Swiper('[data-role=newsspotlight]', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.spotlightnav',
                type: 'bullets',
                clickable: true
            }
        });
    }

});


if ($(".mapslideshow").length) {
var mapSwiper = new Swiper(".mapslideshow", {
    slidesPerView: 1,
    loop: false,
    simulateTouch:false,
    effect: 'fade',
    speed: 1250,
    fadeEffect: {
        crossFade: true
    }
});

$(document).on("change", "[data-role=togglemap]", function (e) {
    $("[data-role=togglemap]").not($(this)).prop("checked", false);
    if($(this).prop("checked")){
        mapSwiper.slideTo(($(this).val()-1));
        $(".mapslideshow").removeClass('hide');
    }else{
        $(".mapslideshow").addClass('hide');
    }
});
}

if ($("#map").length) {
    var map = AmCharts.makeChart("map", {
        type: "map",
        zoomDuration: 0.3,
        mouseEnabled: false,
        dataProvider: {
            map: "worldLow",
            getAreasFromMap: false,
            mouseEnabled: true,

        },

        areasSettings: {
            autoZoom: false,
            selectedColor: "#667572",
            color: '#F7F8F5',
            unlistedAreasColor: '#F7F8F5',
            rollOverColor: "#E9EEEB",
            rollOverOutlineColor: '#FFFFFF',
            selectable: false,
            mouseEnabled: false,
        },

        smallMap: {enabled: false},
        "listeners": [{
            "event": "init",
            "method": function (e) {
                colorInMap();
            }
        }
        ]
    });


    $(document).on("change", "[data-role=togglemap]", function (e) {
        $("[data-role=togglemap]").not($(this)).prop("checked", false);
        colorInMap();

    });


    function colorInMap() {
        var numberOfTypes = $("[data-role=filtercolor]").length + 1;

        var list = $("[data-role=country]").map(function () {
            var type = $(this).data("type").toString();
            var color = 'F7F8F5';

            if (type != "") {
                color = "#83A098";
            }

            for (i = 1; i < numberOfTypes; i++) {
                var idType = '#type' + i;
                if ($(idType).prop("checked")) {

                    if (type[i - 1] == 1) {
                        color = $(idType).data("color").toString();
                    } else {
                        color = '#F7F8F5';
                    }
                }
            }

            var obj = {};
            obj.id = $(this).data("id");
            obj.color = color;
            obj.autoZoom = false;
            obj.url = $(this).data("url");

            return obj;

        }).get();

        map.dataProvider.areas = list;
        map.validateData();
        //zoomlevel,zoomX,zoomY,instantly
        //map.getDevInfo()
        map.zoomTo(2.34148, -0.3133, -0.3343, true);

    }
}


