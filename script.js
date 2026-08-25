// ===== SET TARGET WAKTU COUNTDOWN =====
// Tanggal target tetap (fixed), tidak berubah saat halaman di-refresh.
// Ubah sesuai kebutuhan (format: 'YYYY-MM-DDTHH:mm:ss')
const targetDate = new Date('2026-10-21T23:59:00');

function updateCountdown(){
  const now = new Date();
  let diff = targetDate - now;

  if(diff < 0) diff = 0;

  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const minutes = Math.floor((diff / (1000*60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2,'0');
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== CAROUSEL "ALASAN MENGIKUTI" (COVERFLOW) =====
const cfTrack = document.getElementById('cfTrack');
const cfCards = cfTrack ? Array.from(cfTrack.querySelectorAll('.cf-card')) : [];
const cfPrevBtn = document.getElementById('cfPrev');
const cfNextBtn = document.getElementById('cfNext');
let cfIndex = 0;

function renderCoverflow(){
  const total = cfCards.length;
  cfCards.forEach(function(card, i){
    const diff = (i - cfIndex + total) % total;
    let pos = 'hidden';
    if(diff === 0) pos = 'active';
    else if(diff === 1) pos = 'next1';
    else if(diff === 2) pos = 'next2';
    else if(diff === total - 1) pos = 'prev1';
    else if(diff === total - 2) pos = 'prev2';
    card.setAttribute('data-pos', pos);
  });
}

if(cfCards.length){
  renderCoverflow();

  if(cfPrevBtn){
    cfPrevBtn.addEventListener('click', function(){
      cfIndex = (cfIndex - 1 + cfCards.length) % cfCards.length;
      renderCoverflow();
    });
  }

  if(cfNextBtn){
    cfNextBtn.addEventListener('click', function(){
      cfIndex = (cfIndex + 1) % cfCards.length;
      renderCoverflow();
    });
  }

  cfCards.forEach(function(card, i){
    card.addEventListener('click', function(){
      cfIndex = i;
      renderCoverflow();
    });
  });
}

// ===== POPUP KONFIRMASI NAMA SEBELUM KE WHATSAPP =====
const waPhoneNumber = '6285710116209';
const overlay = document.getElementById('nameModalOverlay');
const nameInput = document.getElementById('nameInput');
const nameError = document.getElementById('nameError');

function openNameModal(){
  overlay.classList.add('active');
  nameError.classList.remove('active');
  nameInput.value = '';
  setTimeout(() => nameInput.focus(), 50);
}

function closeNameModal(){
  overlay.classList.remove('active');
}

document.getElementById('waBtn').addEventListener('click', openNameModal);
document.getElementById('modalCancelBtn').addEventListener('click', closeNameModal);

overlay.addEventListener('click', function(e){
  if(e.target === overlay) closeNameModal();
});

function confirmAndGoToWhatsapp(){
  const name = nameInput.value.trim();
  if(!name){
    nameError.classList.add('active');
    nameInput.focus();
    return;
  }
  const message = `Halo,\nNama saya ${name}\n\nKonfirmasi sudah melakukan pendaftaran`;
  const url = `https://wa.me/${waPhoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  closeNameModal();
}

document.getElementById('modalConfirmBtn').addEventListener('click', confirmAndGoToWhatsapp);
nameInput.addEventListener('keydown', function(e){
  if(e.key === 'Enter') confirmAndGoToWhatsapp();
});
