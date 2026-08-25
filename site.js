// ===== NAVBAR TRANSPARAN -> PUTIH SAAT DI-SCROLL =====
const siteNav = document.querySelector('.site-nav');

if(siteNav){
  function updateNavScrollState(){
    siteNav.classList.toggle('scrolled', window.scrollY > 40);
  }
  updateNavScrollState();
  window.addEventListener('scroll', updateNavScrollState, { passive:true });
}

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

// ===== PROGRAM CAROUSEL (services.html) — infinite loop, arah animasi selalu konsisten =====
const pcTrack = document.getElementById('pcCards');
const pcOriginalCards = pcTrack ? Array.from(pcTrack.querySelectorAll('.pc-card')) : [];
const pcPanels = Array.from(document.querySelectorAll('.pc-image-panel'));
const pcPrev = document.getElementById('pcPrev');
const pcNext = document.getElementById('pcNext');
const pcCount = pcOriginalCards.length;
let pcCards = pcOriginalCards;
let pcIndex = 0;

if(pcCount){
  // klon set kartu di depan & belakang supaya selalu ada "kartu berikutnya" ke arah manapun
  const prevClones = pcOriginalCards.map(function(card){ return card.cloneNode(true); });
  const nextClones = pcOriginalCards.map(function(card){ return card.cloneNode(true); });
  const firstOriginal = pcTrack.firstChild;
  prevClones.forEach(function(clone){ pcTrack.insertBefore(clone, firstOriginal); });
  nextClones.forEach(function(clone){ pcTrack.appendChild(clone); });
  // urutan akhir: [clone-prev 0..N-1][asli 0..N-1][clone-next 0..N-1]

  pcCards = Array.from(pcTrack.querySelectorAll('.pc-card'));
  pcIndex = pcCount; // mulai di awal set "asli" (tengah)

  pcCards.forEach(function(card){
    card.addEventListener('click', function(){
      const clickedPos = pcCards.indexOf(card);
      pcIndex = clickedPos;
      renderProgramCarousel();
    });
  });
}

function realIndexOf(pos){
  return ((pos % pcCount) + pcCount) % pcCount;
}

function renderProgramCarousel(){
  if(!pcCards.length) return;

  const activeReal = realIndexOf(pcIndex);

  pcCards.forEach(function(card){
    const cardReal = parseInt(card.getAttribute('data-index'), 10);
    card.classList.toggle('active', cardReal === activeReal);
  });
  pcPanels.forEach(function(panel, i){
    panel.classList.toggle('active', i === activeReal);
  });

  const cardWidth = pcCards[0].offsetWidth + 16;
  const target = pcIndex * cardWidth;
  pcTrack.style.transform = 'translateX(' + (-target) + 'px)';
}

function snapIfNeeded(){
  // begitu keluar dari set "asli" (masuk zona klon), lompat diam-diam ke posisi setara di set asli
  if(pcIndex >= pcCount * 2){
    pcIndex -= pcCount;
    pcTrack.style.transition = 'none';
    renderProgramCarousel();
    void pcTrack.offsetWidth; // force reflow
    pcTrack.style.transition = '';
  }else if(pcIndex < 0){
    pcIndex += pcCount;
    pcTrack.style.transition = 'none';
    renderProgramCarousel();
    void pcTrack.offsetWidth;
    pcTrack.style.transition = '';
  }
}

if(pcCards.length){
  renderProgramCarousel();

  pcTrack.addEventListener('transitionend', function(e){
    if(e.propertyName === 'transform') snapIfNeeded();
  });

  if(pcPrev){
    pcPrev.addEventListener('click', function(){
      pcIndex -= 1;
      renderProgramCarousel();
    });
  }

  if(pcNext){
    pcNext.addEventListener('click', function(){
      pcIndex += 1;
      renderProgramCarousel();
    });
  }

  window.addEventListener('resize', renderProgramCarousel);
}

// ===== KALENDER AGENDA (events.html) =====
const calGrid = document.getElementById('calGrid');

if(calGrid){
  const calEvents = [
    { date:'2026-08-31', title:'Konferensi Tahunan Dokter 2026', tag:'Pendaftaran Dibuka', desc:'Acara puncak tahunan dengan pembicara dari berbagai bidang spesialisasi. Pendaftaran ditutup di tanggal ini.' },
    { date:'2026-09-14', title:'Workshop Pelatihan Klinis Lanjutan', tag:'Segera Hadir', desc:'Sesi praktik langsung bersama mentor berpengalaman untuk meningkatkan keterampilan klinis.' },
    { date:'2026-10-02', title:'Seminar Riset & Publikasi Ilmiah', tag:'Segera Hadir', desc:'Diskusi dan berbagi hasil riset terbaru dari para anggota di berbagai bidang kedokteran.' },
    { date:'2026-10-20', title:'Bakti Sosial & Layanan Kesehatan Gratis', tag:'Segera Hadir', desc:'Kegiatan pengabdian masyarakat bersama anggota di wilayah yang membutuhkan.' },
    { date:'2026-11-08', title:'Sertifikasi Kompetensi Batch Baru', tag:'Segera Hadir', desc:'Ujian dan penerbitan sertifikat kompetensi profesi untuk anggota terdaftar.' }
  ];

  const calMonthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const calTitle = document.getElementById('calTitle');
  const calDetail = document.getElementById('calDetail');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const calToday = document.getElementById('calToday');

  const firstEvent = calEvents.slice().sort(function(a,b){ return a.date < b.date ? -1 : 1; })[0];
  const startDate = firstEvent ? new Date(firstEvent.date + 'T00:00:00') : new Date();
  let calYear = startDate.getFullYear();
  let calMonth = startDate.getMonth();

  function pad2(n){ return String(n).padStart(2,'0'); }

  function eventsOn(y, m, d){
    const key = y + '-' + pad2(m+1) + '-' + pad2(d);
    return calEvents.filter(function(ev){ return ev.date === key; });
  }

  function showDetail(ev){
    const d = new Date(ev.date + 'T00:00:00');
    calDetail.innerHTML =
      '<div class="cal-detail-card">' +
        '<div class="cal-detail-date"><strong>' + pad2(d.getDate()) + '</strong><span>' + calMonthNames[d.getMonth()].slice(0,3) + '</span></div>' +
        '<div class="cal-detail-body">' +
          '<span class="cal-detail-tag">' + ev.tag + '</span>' +
          '<h4>' + ev.title + '</h4>' +
          '<p>' + ev.desc + '</p>' +
        '</div>' +
      '</div>';
    calDetail.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }

  function renderCalendar(){
    calTitle.textContent = calMonthNames[calMonth] + ' ' + calYear;
    calGrid.innerHTML = '';

    const firstOfMonth = new Date(calYear, calMonth, 1);
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();
    let leadingEmpty = firstOfMonth.getDay() - 1; // Senin = 0
    if(leadingEmpty < 0) leadingEmpty = 6;

    const totalCells = Math.ceil((leadingEmpty + daysInMonth) / 7) * 7;

    for(let i = 0; i < totalCells; i++){
      const cell = document.createElement('div');
      cell.className = 'cal-cell';

      let dayNum, cellYear = calYear, cellMonth = calMonth, isOutside = false;
      if(i < leadingEmpty){
        dayNum = daysInPrevMonth - leadingEmpty + i + 1;
        cellMonth = calMonth - 1;
        isOutside = true;
      }else if(i >= leadingEmpty + daysInMonth){
        dayNum = i - leadingEmpty - daysInMonth + 1;
        cellMonth = calMonth + 1;
        isOutside = true;
      }else{
        dayNum = i - leadingEmpty + 1;
      }
      if(cellMonth < 0){ cellMonth = 11; cellYear -= 1; }
      if(cellMonth > 11){ cellMonth = 0; cellYear += 1; }

      if(isOutside) cell.classList.add('is-outside');

      const dateEl = document.createElement('div');
      dateEl.className = 'cal-date';
      dateEl.textContent = pad2(dayNum);
      cell.appendChild(dateEl);

      const dayEvents = eventsOn(cellYear, cellMonth, dayNum);
      if(dayEvents.length && !isOutside) cell.classList.add('has-event');

      dayEvents.forEach(function(ev){
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-event';
        btn.textContent = ev.title;
        btn.addEventListener('click', function(){ showDetail(ev); });
        cell.appendChild(btn);
      });

      calGrid.appendChild(cell);
    }
  }

  if(calPrev){
    calPrev.addEventListener('click', function(){
      calMonth -= 1;
      if(calMonth < 0){ calMonth = 11; calYear -= 1; }
      renderCalendar();
    });
  }

  if(calNext){
    calNext.addEventListener('click', function(){
      calMonth += 1;
      if(calMonth > 11){ calMonth = 0; calYear += 1; }
      renderCalendar();
    });
  }

  if(calToday){
    calToday.addEventListener('click', function(){
      calYear = startDate.getFullYear();
      calMonth = startDate.getMonth();
      renderCalendar();
    });
  }

  renderCalendar();
  if(firstEvent) showDetail(firstEvent);
}

// ===== HIGHLIGHT MENU AKTIF SESUAI HALAMAN =====
const currentPage = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach(function(link){
  const href = link.getAttribute('href');
  if(href === currentPage){
    link.classList.add('active');
  }
});
