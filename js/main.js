// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
 *
 * Check if element exist on page
 *
 * @param el {string} jQuery object (#popup)
 *
 * @return {bool}
 *
 */
function exist(el) {
    if ($(el).length > 0) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function ($) {

    function runStars() {
        "use strict";

        var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            w = canvas.width = window.innerWidth,
            h = canvas.height = window.innerHeight,

            hue = 217,
            stars = [],
            count = 0,
            maxStars = 1400;

        // Thanks @jackrugile for the performance tip! https://codepen.io/jackrugile/pen/BjBGoM
        // Cache gradient
        var canvas2 = document.createElement('canvas'),
            ctx2 = canvas2.getContext('2d');
        canvas2.width = 100;
        canvas2.height = 100;
        var half = canvas2.width / 2,
            gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
        gradient2.addColorStop(0.025, '#fff');
        gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
        gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
        gradient2.addColorStop(1, 'transparent');

        ctx2.fillStyle = gradient2;
        ctx2.beginPath();
        ctx2.arc(half, half, half, 0, Math.PI * 2);
        ctx2.fill();

        // End cache

        function random(min, max) {
            if (arguments.length < 2) {
                max = min;
                min = 0;
            }

            if (min > max) {
                var hold = max;
                max = min;
                min = hold;
            }

            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function maxOrbit(x, y) {
            var max = Math.max(x, y),
                diameter = Math.round(Math.sqrt(max * max + max * max));
            return diameter / 2;
        }

        var Star = function () {

            this.orbitRadius = random(maxOrbit(w, h));
            this.radius = random(60, this.orbitRadius) / 12;
            this.orbitX = w / 2;
            this.orbitY = h / 2;
            this.timePassed = random(0, maxStars);
            this.speed = random(this.orbitRadius) / 50000;
            this.alpha = random(2, 10) / 10;

            count++;
            stars[count] = this;
        }

        Star.prototype.draw = function () {
            var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
                y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
                twinkle = random(10);

            if (twinkle === 1 && this.alpha > 0) {
                this.alpha -= 0.05;
            } else if (twinkle === 2 && this.alpha < 1) {
                this.alpha += 0.05;
            }

            ctx.globalAlpha = this.alpha;
            ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
            this.timePassed += this.speed;
        }

        for (var i = 0; i < maxStars; i++) {
            new Star();
        }

        function animation() {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)';
            ctx.fillRect(0, 0, w, h)

            ctx.globalCompositeOperation = 'lighter';
            for (var i = 1, l = stars.length; i < l; i++) {
                stars[i].draw();
            };

            window.requestAnimationFrame(animation);
        }

        animation();
    }

    // start preloader animation 
    $('.overlay').addClass('ready');
    runStars();

    function preOut(){
        $('.overlay').addClass('out');
    }
    setTimeout(preOut, 4000);

    wow = new WOW({
        boxClass: 'wow', // default
        animateClass: 'animated', // default
        offset: 100, // default
        mobile: false, // default
        live: true // default
    })
    wow.init();

    $('.header').headroom();


    // roadmap
    $('.roadmap .step').hover(function () {
        $('.roadmap .step').not($(this)).removeClass('active');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
    }, function(){
        $('.roadmap .step').removeClass('active');
    });


    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function () {
        var $document = $(document),
            $element = $('.toggle-menu'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function () {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });


    /*---------------------------
                                  File input logic
    ---------------------------*/
    $('input[type=file]').each(function (index, el) {
        $(this).on('change', function (event) {
            event.preventDefault();
            var placeholder = $(this).siblings('.placeholder');

            if (this.files.length > 0) {
                if (this.files[0].size < 5000000) {
                    var filename = $(this).val().split('/').pop().split('\\').pop();
                    if (filename == '') {
                        filename = placeholder.attr('data-label');
                    }
                    placeholder.text(filename);
                } else {
                    alert('Maximum file size is 5Mb');
                }
            } else {
                placeholder.text(placeholder.attr('data-label'));
            }

        });
    });

    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.page-menu a, .anchor').click(function () {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 800);
        return false;
    });

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.js-toggle-menu').on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $(this).siblings('header').toggleClass('open');
    });




    /* slider */

    function slide_classes(slick, active) {
        var total = slick.$slides.length;

        var active_slide = active;

        var prev = active_slide - 1;

        if (prev < 0) {
            prev = total - 1;
        }

        var next = active_slide + 1;
        if (next >= total) {
            next = 0;
        }

        slick.$slides.removeClass('prev-slide next-slide');
        slick.$slides.eq(prev).addClass('prev-slide');
        slick.$slides.eq(next).addClass('next-slide');
    }

    $('.team-slider').on('init', function (event, slick) {
        slide_classes(slick, slick.currentSlide);
    });

    $('.team-slider').slick({
        arrows: true,
        dots: false,
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        focusOnSelect: true,
        infinite: false,
        initialSlide: 1,
        responsive: [{
            breakpoint: 768,
            settings: {
                centerMode: false
            }
        }]
    })

    $('.team-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        slide_classes(slick, nextSlide);
    });




    var switching = false;

    $('.js-team-switcher').on('click', function (event) {
        event.preventDefault();

        if (!$(this).hasClass('active')) {
            var target = $(this).attr('href');

            if (exist(target) && !switching) {
                switching = true;
                $(this).siblings().removeClass('active')
                $(this).addClass('active');

                $('.team-tab.active').fadeOut('400', function () {
                    $(this).removeClass('active');
                    $(target).fadeIn('400', function () {
                        $(this).addClass('active');
                        switching = false;
                    });
                    $(target).find('.team-slider').slick('setPosition');
                });
            }
        }




    });










    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({
        helpers: {
            overlay: {
                locked: false
            }
        }
    });


    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
     */
    function openPopup(popup) {
        $.fancybox.open([{
            src: popup,
            type: 'inline',
            opts: {}
        }], {
            loop: false
        });
    }



    /*---------------------------
                                  Form submit
    ---------------------------*/
    $('.ajax-form').on('submit', function (event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function (result) {
                openPopup('#modal-popup-error');
            }
        }).always(function () {
            $('form').each(function (index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });



    /*---------------------------
                                  Google map init
    ---------------------------*/
    var map;

    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);

        var styles = [];

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 16,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        var styledMapType = new google.maps.StyledMapType(styles, {
            name: 'Styled'
        });
        map.mapTypes.set('Styled', styledMapType);
        map.setMapTypeId('Styled');

        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord,
            map: map,
            title: "Site Title"
        });

        $(window).resize(function () {
            map.setCenter(mapCenterCoord);
        });
    }

    if (exist('#map_canvas')) {
        googleMap_initialize();
    }

}); // end file