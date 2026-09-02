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
    { start:'2024-10-22', end:'2024-10-24', title:'iMEDIC I 2024', tag:'Simposium Internasional', desc:'Simposium dan Workshop Kedokteran Militer Internasional pertama, mempertemukan pakar kesehatan militer dari berbagai negara.' },
    { start:'2025-10-22', end:'2025-10-24', title:'iMEDIC II 2025', tag:'Simposium Internasional', desc:'Kelanjutan simposium tahunan yang membahas perkembangan terkini kedokteran militer dan kesiapsiagaan medis.' },
    { start:'2026-07-11', end:'2026-07-11', title:'Musyawarah Nasional PERDOKMIL', tag:'Munas', desc:'Musyawarah Nasional Perkumpulan Kedokteran Militer Indonesia untuk menentukan arah organisasi ke depan.' },
    { start:'2026-08-16', end:'2026-08-16', title:'Independence Day Golf Tournament', tag:'Kegiatan Sosial', desc:'Turnamen golf dalam rangka memperingati Hari Kemerdekaan sekaligus mempererat silaturahmi anggota.' },
    { start:'2026-08-25', end:'2026-08-26', title:'PERTASINDO Peduli NTT', tag:'Bakti Sosial', desc:'Aksi bakti sosial dan layanan kesehatan gratis bagi masyarakat di Nusa Tenggara Timur.' },
    { start:'2026-10-21', end:'2026-10-21', title:'SIERA III 2026', tag:'Simposium Internasional', desc:'The 3rd Symposium of Indonesian Health Resilience Association.' }
  ];

  const calMonthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const calTitle = document.getElementById('calTitle');
  const calDetail = document.getElementById('calDetail');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const calToday = document.getElementById('calToday');

  function pad2(n){ return String(n).padStart(2,'0'); }
  function toDate(s){ return new Date(s + 'T00:00:00'); }
  function sameDay(a, b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

  const realToday = new Date();
  const featuredEvent = calEvents.find(function(ev){ return ev.title === 'SIERA III 2026'; });
  const startDate = featuredEvent
    ? toDate(featuredEvent.start)
    : (calEvents.some(function(ev){ return toDate(ev.start) <= realToday && realToday <= toDate(ev.end); })
      ? realToday
      : toDate(calEvents[calEvents.length - 1].start));
  let calYear = startDate.getFullYear();
  let calMonth = startDate.getMonth();

  function eventsOn(y, m, d){
    const target = new Date(y, m, d);
    return calEvents.filter(function(ev){
      return target >= toDate(ev.start) && target <= toDate(ev.end);
    });
  }

  function formatRange(ev){
    const s = toDate(ev.start);
    const e = toDate(ev.end);
    if(sameDay(s, e)){
      return pad2(s.getDate()) + ' ' + calMonthNames[s.getMonth()] + ' ' + s.getFullYear();
    }
    if(s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()){
      return pad2(s.getDate()) + '-' + pad2(e.getDate()) + ' ' + calMonthNames[s.getMonth()] + ' ' + s.getFullYear();
    }
    return pad2(s.getDate()) + ' ' + calMonthNames[s.getMonth()] + ' ' + s.getFullYear() + ' - ' + pad2(e.getDate()) + ' ' + calMonthNames[e.getMonth()] + ' ' + e.getFullYear();
  }

  function showDetail(ev){
    const s = toDate(ev.start);
    const e = toDate(ev.end);
    const dayLabel = sameDay(s, e) ? pad2(s.getDate()) : (pad2(s.getDate()) + '-' + pad2(e.getDate()));
    calDetail.innerHTML =
      '<div class="cal-detail-card">' +
        '<div class="cal-detail-date"><strong>' + dayLabel + '</strong><span>' + calMonthNames[s.getMonth()].slice(0,3) + '</span></div>' +
        '<div class="cal-detail-body">' +
          '<span class="cal-detail-tag">' + ev.tag + '</span>' +
          '<h4>' + ev.title + '</h4>' +
          '<p>' + formatRange(ev) + '</p>' +
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
  const defaultEvent = featuredEvent || calEvents.filter(function(ev){
    return toDate(ev.start) <= realToday && realToday <= toDate(ev.end);
  })[0] || calEvents[calEvents.length - 1];
  showDetail(defaultEvent);
}

// ===== GALERI KEGIATAN (slideshow, index.html) =====
const gallerySlides = Array.from(document.querySelectorAll('.gallery-slide'));

if(gallerySlides.length){
  const galleryDotsWrap = document.getElementById('galleryDots');
  const galleryThumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
  const galPrev = document.getElementById('galPrev');
  const galNext = document.getElementById('galNext');
  let galIndex = 0;
  let galTimer = null;

  gallerySlides.forEach(function(slide, i){
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', function(){ goToSlide(i); });
    galleryDotsWrap.appendChild(dot);
  });

  const galleryDots = Array.from(galleryDotsWrap.children);

  function renderGallery(){
    gallerySlides.forEach(function(slide, i){ slide.classList.toggle('active', i === galIndex); });
    galleryDots.forEach(function(dot, i){ dot.classList.toggle('active', i === galIndex); });
    galleryThumbs.forEach(function(thumb, i){ thumb.classList.toggle('active', i === galIndex); });
  }

  function goToSlide(i){
    galIndex = (i + gallerySlides.length) % gallerySlides.length;
    renderGallery();
    resetGalleryTimer();
  }

  function resetGalleryTimer(){
    if(galTimer) clearInterval(galTimer);
    galTimer = setInterval(function(){
      galIndex = (galIndex + 1) % gallerySlides.length;
      renderGallery();
    }, 10000);
  }

  if(galPrev) galPrev.addEventListener('click', function(){ goToSlide(galIndex - 1); });
  if(galNext) galNext.addEventListener('click', function(){ goToSlide(galIndex + 1); });
  galleryThumbs.forEach(function(thumb, i){
    thumb.addEventListener('click', function(){ goToSlide(i); });
  });

  renderGallery();
  resetGalleryTimer();
}

// ===== FORM KONTAK -> WHATSAPP (contact.html) =====
const contactForm = document.getElementById('contactForm');

if(contactForm){
  const contactWaNumber = '6285710116209';

  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const subject = document.getElementById('cSubject').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    const text =
      'Halo, saya ingin menghubungi PERTASINDO.\n\n' +
      'Nama: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'Subjek: ' + subject + '\n' +
      'Pesan: ' + message;

    const url = 'https://wa.me/' + contactWaNumber + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
    contactForm.reset();
  });
}

// ===== NEWS MODAL / LIGHTBOX (news.html) =====
const newsModalOverlays = Array.from(document.querySelectorAll('.news-modal-overlay'));

if(newsModalOverlays.length){
  function openNewsModal(overlay){
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNewsModal(overlay){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  newsModalOverlays.forEach(function(overlay){
    const closeBtn = overlay.querySelector('.news-modal-close');
    if(closeBtn) closeBtn.addEventListener('click', function(){ closeNewsModal(overlay); });

    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closeNewsModal(overlay);
    });
  });

  document.querySelectorAll('[data-news-modal]').forEach(function(trigger){
    const overlay = document.getElementById(trigger.getAttribute('data-news-modal') + 'ModalOverlay');
    if(!overlay) return;
    trigger.addEventListener('click', function(e){
      e.preventDefault();
      openNewsModal(overlay);
    });
  });

  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    const openOverlay = newsModalOverlays.find(function(overlay){ return overlay.classList.contains('open'); });
    if(openOverlay) closeNewsModal(openOverlay);
  });
}

// ===== NTT NEWS MODAL GALLERY (news.html) =====
const nttModalOverlay = document.getElementById('nttModalOverlay');

if(nttModalOverlay){
  const nttModalPrev = document.getElementById('nttModalPrev');
  const nttModalNext = document.getElementById('nttModalNext');
  const nttModalCount = document.getElementById('nttModalCount');
  const nttSlides = Array.from(document.querySelectorAll('#nttModalSlides .news-modal-slide'));
  const nttThumbs = Array.from(document.querySelectorAll('#nttModalThumbs button'));
  let nttIndex = 0;

  function renderNttModal(){
    nttSlides.forEach(function(slide, i){ slide.classList.toggle('active', i === nttIndex); });
    nttThumbs.forEach(function(thumb, i){ thumb.classList.toggle('active', i === nttIndex); });
    if(nttModalCount){
      nttModalCount.textContent = String(nttIndex + 1).padStart(2, '0') + ' / ' + String(nttSlides.length).padStart(2, '0');
    }
  }

  function goToNttSlide(i){
    nttIndex = (i + nttSlides.length) % nttSlides.length;
    renderNttModal();
  }

  if(nttModalPrev) nttModalPrev.addEventListener('click', function(){ goToNttSlide(nttIndex - 1); });
  if(nttModalNext) nttModalNext.addEventListener('click', function(){ goToNttSlide(nttIndex + 1); });

  nttThumbs.forEach(function(thumb, i){
    thumb.addEventListener('click', function(){ goToNttSlide(i); });
  });

  document.addEventListener('keydown', function(e){
    if(!nttModalOverlay.classList.contains('open')) return;
    if(e.key === 'ArrowLeft') goToNttSlide(nttIndex - 1);
    if(e.key === 'ArrowRight') goToNttSlide(nttIndex + 1);
  });

  renderNttModal();
}

// ===== HIGHLIGHT MENU AKTIF SESUAI HALAMAN =====
const currentPage = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach(function(link){
  const href = link.getAttribute('href');
  if(href === currentPage){
    link.classList.add('active');
  }
});
