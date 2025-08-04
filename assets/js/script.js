$(document).ready(function() {
  "use strict";
  // Scroll to top
  $("a[href='#top']").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });

  // Smooth scroll
  $('a.scroll-to').on('click', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top - 50)
    }, 700);
    event.preventDefault();
  });

  $('.site-testimonial-item').on('mouseenter', function(){
    $('.site-testimonial-item').addClass('inactive');
    $(this).removeClass('inactive').addClass('active');
  });
  $('.site-testimonial-item').on('mouseleave', function(){
    $('.site-testimonial-item').removeClass('inactive');
    $('.site-testimonial-item').removeClass('active');
  });

  $('.slider-for').slick({
    slidesToShow: 1,
    arrows: false,
    speed: 300,
    autoplay: true,
    fade: true,
    // asNavFor: '.slider-nav',
    arrows: false,
    dots: true,
  appendDots: $('.vertical-dots'),
  customPaging: function (slider, i) {
    return '<button class="dot"></button>';
  }
  });
  $('.grace-for').slick({
    slidesToShow: 1,
    arrows: false,
    autoplay: true,
    fade: true,
    infinite: true,
    dots: false
  });
  $('.client-for').slick({
    slidesToShow: 1,
    arrows: false,
    autoplay: true,
    fade: true,
    infinite: true,
    dots: true,
  appendDots: $('.cvertical-dots'),
  customPaging: function (slider, i) {
    return '<button class="dot"></button>';
  }
  });
  $('.slider-nav').slick({
    slidesToShow: 8,  // Default on large screens
    // asNavFor: '.slider-for',
    // focusOnSelect: true,
    slidesToScroll: 1,
    // centerMode: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          autoplay: true,
          speed: 120,
          infinite: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          autoplay: true,
          autoplaySpeed: 600, // Time between slides (1 seconds)
          // speed: 800,          // Transition speed (0.8 seconds)
          cssEase: 'linear',   // Smooth linear transition
          infinite: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          autoplay: true,
          autoplaySpeed: 500, // Time between slides (2 seconds)
          speed: 800,          // Transition speed (0.8 seconds)
          cssEase: 'linear',   // Smooth linear transition
          infinite: true,
        }
      }
    ]
  });
});

$(window).on('scroll', function () {
  var windscroll = $(window).scrollTop();
  if (windscroll >= 100) {
    $('.site-navigation').addClass('nav-bg');
  } else {
    $('.site-navigation').removeClass('nav-bg');
  }
});
//menu collapse on click for small screen
document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".navbar-toggler");
  const nav = document.getElementById("sitenavbar");

  if (toggler && nav) {

    // Optional: close menu when a nav link is clicked
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("show");
        toggler.classList.add("collapsed");
        toggler.setAttribute("aria-expanded", "false");
      });
    });
  }
  if (window.location.hash) {
    const id = window.location.hash.slice(1); // removes the '#' to get just 'clientele'
    const el = document.getElementById(id);
    if (el) {
      // Delay to ensure the element exists after page render
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }

});

document.getElementById('current-year').textContent = new Date().getFullYear();