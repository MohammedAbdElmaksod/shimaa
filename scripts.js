const eventDate = new Date('2026-10-14T00:00:00+03:00');
const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
const toArabic = value => String(value).padStart(2, '0').replace(/\d/g, digit => arabicDigits[Number(digit)]);
function updateCountdown() {
  const remaining = Math.max(0, eventDate.getTime() - Date.now());
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  ['days','hours','minutes','seconds'].forEach((unit, index) => { document.getElementById(unit).textContent = toArabic(values[index]); });
  if (remaining === 0) document.querySelector('.countdown-label').textContent = 'الليلة ليلتنا! ♡';
}
updateCountdown();
setInterval(updateCountdown, 1000);

const invitationDialog = document.getElementById('invitation-dialog');
function openInvitation() { invitationDialog.showModal(); document.body.style.overflow = 'hidden'; }
document.getElementById('open-invitation-top').addEventListener('click', openInvitation);
document.getElementById('open-invitation').addEventListener('click', openInvitation);
invitationDialog.querySelector('.dialog-close').addEventListener('click', () => invitationDialog.close());
invitationDialog.addEventListener('click', event => {
  if (event.target !== invitationDialog) return;
  const rect = invitationDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) invitationDialog.close();
});
invitationDialog.addEventListener('close', () => { document.body.style.overflow = ''; });

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}
document.getElementById('copy-address').addEventListener('click', async () => {
  const address = 'بني مزار – الشيخ عطا – منزل المأذون';
  try {
    await navigator.clipboard.writeText(address);
  } catch {
    const input = document.createElement('textarea');
    input.value = address;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.append(input);
    input.select();
    if (!document.execCommand('copy')) { input.remove(); showToast('العنوان: ' + address); return; }
    input.remove();
  }
  showToast('اتنسخ العنوان ♡');
});
function escapeICS(value) { return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;'); }
function foldICS(line) {
  const encoder = new TextEncoder();
  let result = '', length = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (length + size > 75) { result += '\r\n '; length = 1; }
    result += char; length += size;
  }
  return result;
}
document.getElementById('add-calendar').addEventListener('click', () => {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Henna Shimaa//Invitation//AR','CALSCALE:GREGORIAN',
    'BEGIN:VEVENT','UID:shimaa-henna-20261014@wedding.local','DTSTAMP:' + stamp,
    'DTSTART;VALUE=DATE:20261014','DTEND;VALUE=DATE:20261015',
    'SUMMARY:' + escapeICS('حنّة شيماء عبدالرحمن'),
    'LOCATION:' + escapeICS('بني مزار – الشيخ عطا – منزل المأذون'),
    'DESCRIPTION:' + escapeICS('أفراح أولاد الشيخ. الدعوة لا تذكر وقت بدء الليلة؛ يرجى التأكد من العائلة.'),
    'END:VEVENT','END:VCALENDAR'
  ];
  const url = URL.createObjectURL(new Blob([lines.map(foldICS).join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = 'henna-shimaa-2026.ics';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  showToast('ملف التقويم جاهز، افتحوه علشان تحفظوا الموعد ♡');
});

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const petalLayer = document.getElementById('petal-layer');
const petalColors = ['#d98599','#f0afb9','#c99b6f','#eac7bc','#bc6c82'];
function showerPetals(count, origin) {
  if (motionPreference.matches || document.hidden) return;
  for (let index = 0; index < count; index++) {
    const petal = document.createElement('i');
    petal.className = 'petal';
    const x = origin ? origin.x + (Math.random() - .5) * 60 : Math.random() * innerWidth;
    const y = origin ? origin.y : -24;
    petal.style.left = x + 'px';
    petal.style.top = y + 'px';
    petal.style.width = (8 + Math.random() * 9) + 'px';
    petal.style.height = (10 + Math.random() * 12) + 'px';
    petal.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
    petal.style.setProperty('--drift', ((Math.random() - .5) * (origin ? 520 : 180)) + 'px');
    petal.style.setProperty('--fall', (innerHeight - y + 50) + 'px');
    petal.style.setProperty('--spin', ((Math.random() - .5) * 900) + 'deg');
    petal.style.animationDuration = (origin ? 2.5 + Math.random() * 1.2 : 6 + Math.random() * 3) + 's';
    petal.style.animationDelay = (Math.random() * (origin ? .25 : 1)) + 's';
    petalLayer.append(petal);
    petal.addEventListener('animationend', () => petal.remove(), { once: true });
  }
}
setTimeout(() => showerPetals(9), 1800);
setInterval(() => showerPetals(9), 9000);
document.querySelectorAll('.button, .header-cta, .text-button, .celebrate').forEach(control => {
  control.addEventListener('click', () => {
    const box = control.getBoundingClientRect();
    showerPetals(control.id === 'celebrate' ? 70 : 28, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
  });
});
document.getElementById('celebrate').addEventListener('click', () => {
  document.getElementById('love-message').textContent = 'حبكم وصل شيماء ونوّر الليلة ♡';
});
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: .12, rootMargin: '0px 0px 35px 0px' });
  document.querySelectorAll('.story-grid, .countdown, .details-heading, .detail-card, .invitation > *, .closing .shell').forEach(item => observer.observe(item));
}
