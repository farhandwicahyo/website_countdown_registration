// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if(navToggle && navLinks){
  navToggle.addEventListener('click', function(){
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      navLinks.classList.remove('open');
    });
  });
}

// ===== HIGHLIGHT MENU AKTIF SESUAI HALAMAN =====
const currentPage = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach(function(link){
  const href = link.getAttribute('href');
  if(href === currentPage){
    link.classList.add('active');
  }
});
