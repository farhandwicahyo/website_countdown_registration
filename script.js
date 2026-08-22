// ===== SET TARGET WAKTU COUNTDOWN =====
// Tanggal target tetap (fixed), tidak berubah saat halaman di-refresh.
// Ubah sesuai kebutuhan (format: 'YYYY-MM-DDTHH:mm:ss')
const targetDate = new Date('2026-08-31T23:59:00');

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

// ===== SCROLL OTOMATIS SAAT TOMBOL DIKLIK =====
document.getElementById('registerBtn').addEventListener('click', function(){
  document.getElementById('formSection').scrollIntoView({ behavior:'smooth' });
});

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
