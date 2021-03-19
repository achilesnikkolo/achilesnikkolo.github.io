let toggleNav = false;
let ham = document.querySelector('.hamburger');
let hamburger = document.querySelector('.fa-bars');
let nav = document.querySelector('nav');
let nav_ul = document.querySelector('nav ul');
//toggle
let toggle = function () {
  if (toggleNav === false) {
    nav_ul.style.opacity = '1';
    nav.style.transition = 'all 0.3s ease-in-out';
    nav_ul.style.display = 'flex';
    nav.style.height = '150px';

    toggleNav = true;
  } else if (toggleNav === true) {
    nav.style.height = '0';
    nav_ul.style.opacity = '0';
    nav_ul.style.display = 'none';

    toggleNav = false;
  }
};
hamburger.addEventListener('click', toggle);

//sticky
window.onscroll = function () {
  myFunction();
};

var header = document.querySelector('.nav-bar');
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
}
// $(window).on('load', function () {
//   $('.load').fadeOut('slow');
// });

$('.dark').click(changeColorDark);
$('.light').click(changeColorLight);
$('.medium').click(changeColorMedium);

function changeColorDark() {
  $('.bg-color').css({
    'background-color': '#00072B',
  });
}
function changeColorLight() {
  $('.bg-color').css({
    'background-color': '#233755',
  });
}
function changeColorMedium() {
  $('.bg-color').css({
    'background-color': '#1a2528',
  });
}
