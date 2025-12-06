/*
  =============================================================
  ==    ⭐️ โค้ด JavaScript ฉบับสมบูรณ์ (Final Version) ⭐️    ==
  =============================================================
*/

// [ปรับปรุง] initializePage ให้รัดกุมขึ้น โดยเรียก goHome()
function initializePage() {
    // goHome() จะจัดการซ่อนทุก Section และแสดงเฉพาะส่วน Hero/Banner
    goHome(); 
}

function toggleMenu() {
    const nav = document.getElementById('main-nav');
    nav.classList.toggle('active');
}

function toggleSubMenu(event, submenuId) {
    event.preventDefault();
    const submenu = document.getElementById(submenuId);
    document.querySelectorAll('.dropdown-content').forEach(menu => {
        if (menu.id !== submenuId) {
            menu.style.display = 'none';
        }
    });
    if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
    } else {
        submenu.style.display = 'block';
    }
}

// *แก้ไข: ให้ footer แสดงผลทุกครั้งที่กลับหน้าหลัก*
function goHome() {
    // [1] ซ่อนทุก Section
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.style.display = 'none';
        section.style.opacity = '0'; // เพิ่ม opacity สำหรับ CSS transition
    });
    
    // [2] แสดง Section หลักและ Banner
    const heroSection = document.getElementById('hero-section');
    const newBrandSection = document.getElementById('new-brand-section');
    const promoBanner = document.getElementById('promo-banner-section');
    const extraPromoBanner = document.getElementById('extra-promo-banner-section');
    
    if (heroSection) heroSection.style.display = 'flex';
    if (newBrandSection) newBrandSection.style.display = 'flex';
    if (promoBanner) promoBanner.style.display = 'block';
    if (extraPromoBanner) extraPromoBanner.style.display = 'block';

    // [3] แสดง Footer
    const _mf = document.getElementById('main-footer');
    if (_mf) {
        _mf.style.display = 'block';
    } 
    
    // [4] ปิดเมนูย่อย
    document.querySelectorAll('.dropdown-content').forEach(menu => {
        menu.style.display = 'none';
    });
    window.scrollTo(0, 0);
}

// * === [โค้ดแก้ไข] ฟังก์ชัน showSection ที่อัปเดตแล้ว (แก้ปัญหาเมนูพัง) === *
function showSection(targetId) {
    // ต้องหยุดวิดีโอทั้งหมดก่อนเปลี่ยน Section
    stopAllVideos();

    // [1] ซ่อน Banner หลักทั้งหมดก่อน (เพราะ Banner อยู่ในส่วนที่ไม่ใช่ .section)
    const heroSection = document.getElementById('hero-section');
    const newBrandSection = document.getElementById('new-brand-section');
    const promoBanner = document.getElementById('promo-banner-section');
    const extraPromoBanner = document.getElementById('extra-promo-banner-section');
    
    if (heroSection) heroSection.style.display = 'none';
    if (newBrandSection) newBrandSection.style.display = 'none';
    if (promoBanner) promoBanner.style.display = 'none';
    if (extraPromoBanner) extraPromoBanner.style.display = 'none';
    
    // [2] ซ่อนทุก Section
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.style.display = 'none';
        section.style.opacity = '0'; // เพิ่ม opacity สำหรับ CSS transition
    });

    // [3] แสดง Section เป้าหมาย
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.style.display = 'block'; // สั่งให้ CSS ทำงาน
        
        // ใช้ setTimeout เพื่อให้แอนิเมชัน opacity 0.28s ทำงาน
        setTimeout(() => {
            targetElement.style.opacity = '1';
        }, 10);
    }

    // === [เพิ่มใหม่] ถ้าเป็นการเปิดหน้า 'sheet-data' ให้เริ่มดึงข้อมูล ===
    if (targetId === 'sheet-data') {
        fetchGoogleSheetData();
    }
    // === [จบ] ===

    // [4] แสดง Footer
    const _mf = document.getElementById('main-footer');
    if (_mf) {
        _mf.style.display = 'block';
    } 

    // [5] ปิดเมนูมือถือและเมนูย่อย
    const nav = document.getElementById('main-nav');
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
    document.querySelectorAll('.dropdown-content').forEach(menu => {
        menu.style.display = 'none';
    });
    window.scrollTo(0, 0);
}

/* ************************************************* */
/* ******** START OF NEW/UPDATED JAVASCRIPT ******** */
/* ************************************************* */
function stopAllVideos() {
    // 1. หยุดวิดีโอในส่วน #about (Embedded Iframes)
    const aboutVideos = document.querySelectorAll('#about .video-box');
    aboutVideos.forEach(videoBox => {
        if (videoBox.getAttribute('data-video-played') === 'true') {
            const iframe = videoBox.querySelector('iframe');
            if (iframe) {
                let originalSrc = iframe.getAttribute('src');
                if (originalSrc) {
                    originalSrc = originalSrc.split('?')[0];
                    iframe.setAttribute('src', originalSrc);
                }
                iframe.classList.remove('active-video');
                iframe.style.display = 'none'; 
            }
            videoBox.setAttribute('data-video-played', 'false');
            
            const img = videoBox.querySelector('.info-icon');
            const btn = videoBox.querySelector('.video-play-button');
            if(img) img.style.display = 'block';
            if(btn) btn.style.display = 'block';
        }
    });

    // 2. หยุดวิดีโอในส่วน #media และ #legendary-reviews
    const videoContainers = document.querySelectorAll('.video-card, .facebook-video-card');
    videoContainers.forEach(container => {
        const thumbnailContainer = container.querySelector('.video-thumbnail-container');
        const targetContainer = container.querySelector('[id^="youtube-media-"], [id^="facebook-video-"], [id^="legend-youtube-"]');

        if (thumbnailContainer && thumbnailContainer.style.display === 'none') {
            if (targetContainer) targetContainer.innerHTML = ''; 
            thumbnailContainer.style.display = 'block';
            thumbnailContainer.removeAttribute('data-loaded');
        }
    });
}

/* *UPDATED: ฟังก์ชันสำหรับเล่นวิดีโอตัวที่ 1 (ใช้เทคนิคสร้างใหม่)* */
function playEmbeddedVideo() {
    stopAllVideos();
    const videoBox = document.querySelector('#about .video-box:nth-of-type(1)');
    const oldIframe = document.getElementById('pvdVideo');

    if (oldIframe) {
        let src = oldIframe.getAttribute('src');
        if (!src) src = "";
        if (src.indexOf('autoplay=1') === -1) {
            src += (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1&mute=0';
        }

        const newIframe = oldIframe.cloneNode(true);
        newIframe.setAttribute('src', src);
        newIframe.style.display = 'block';
        newIframe.classList.add('active-video');
        
        oldIframe.parentNode.replaceChild(newIframe, oldIframe);
        
        const img = videoBox.querySelector('.info-icon');
        const btn = videoBox.querySelector('.video-play-button');
        if(img) img.style.display = 'none';
        if(btn) btn.style.display = 'none';
    }
    if (videoBox) videoBox.setAttribute('data-video-played', 'true');
}

/* *UPDATED: ฟังก์ชันสำหรับเล่นวิดีโอตัวที่ 2 (ใช้เทคนิคสร้างใหม่)* */
function playEmbeddedVideo2() {
    stopAllVideos();
    const videoBoxes = document.querySelectorAll('#about .video-box');
    if (videoBoxes.length < 2) return;
    
    const videoBox = videoBoxes[1]; // กล่องที่ 2
    const oldIframe = document.getElementById('pvdVideo2');

    if (oldIframe) {
        let src = oldIframe.getAttribute('src');
        if (!src) src = "";
        if (src.indexOf('autoplay=1') === -1) {
            src += (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1&mute=0';
        }

        const newIframe = oldIframe.cloneNode(true);
        newIframe.setAttribute('src', src);
        newIframe.style.display = 'block';
        newIframe.classList.add('active-video');

        oldIframe.parentNode.replaceChild(newIframe, oldIframe);
        
        const img = videoBox.querySelector('.info-icon');
        const btn = videoBox.querySelector('.video-play-button');
        if(img) img.style.display = 'none';
        if(btn) btn.style.display = 'none';
    }
    if (videoBox) videoBox.setAttribute('data-video-played', 'true');
}


/* *แก้ไข: ปรับโค้ด loadFacebookVideo (เรียก stopAllVideos)* */
function loadFacebookVideo(thumbnailElement, targetId) {
    stopAllVideos(); // [NEW] Stop all other videos
    if (thumbnailElement.hasAttribute('data-loaded')) {
        return;
    }
    const videoSrc = thumbnailElement.getAttribute('data-src');
    const targetContainer = document.getElementById(targetId);
    const iframe = document.createElement('iframe');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '300');
    iframe.setAttribute('src', videoSrc);
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('style', 'border:none;overflow:hidden; display:block; height: 300px;');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share');
    if (targetContainer) targetContainer.appendChild(iframe);
    thumbnailElement.style.display = 'none';
    thumbnailElement.setAttribute('data-loaded', 'true');
}

/* *แก้ไข: ปรับโค้ด loadYouTubeVideo (เรียก stopAllVideos และเพิ่ม autoplay=1)* */
function loadYouTubeVideo(thumbnailElement, targetId) {
    stopAllVideos(); // [NEW] Stop all other videos
    if (thumbnailElement.hasAttribute('data-loaded')) {
        return;
    }
    const videoSrc = thumbnailElement.getAttribute('data-src');
    const targetContainer = document.getElementById(targetId);
    const iframe = document.createElement('iframe');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '300');
    iframe.setAttribute('src', videoSrc + '?autoplay=1');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('title', 'YouTube video player');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('style', 'display:block; height: 300px;');
    if (targetContainer) targetContainer.appendChild(iframe);
    thumbnailElement.style.display = 'none';
    thumbnailElement.setAttribute('data-loaded', 'true');
}

// Data structure for the 9 service categories (Slider)
const nineServicesData = [
    {
        img: 'service-1-chassis.jpg',
        title: 'ช่วงล่าง (Suspension & Chassis)',
        desc: 'บริการซ่อมและบำรุงรักษาระบบช่วงล่าง, โช้คอัพ, ถุงลม, และระบบควบคุมการทรงตัว เพื่อความนุ่มนวลและปลอดภัยในการขับขี่.'
    },
    {
        img: 'service-7-body.jpg',
        title: 'ตัวถัง (Body & Paint)',
        desc: 'งานซ่อมตัวถัง, ทำสีมาตรฐานโรงงาน, เคาะพ่นสี, และแก้ไขปัญหาตัวถังที่เกิดจากอุบัติเหตุหรือรอยขีดข่วนทั่วไป.'
    },
    {
        img: 'service-9-wheel.jpg',
        title: 'พวงมาลัย (Steering System)',
        desc: 'ซ่อมระบบพวงมาลัยไฟฟ้า (EPS), ระบบพวงมาลัยเพาเวอร์, และแก้ไขปัญหาการสั่น/เสียงดังของระบบบังคับเลี้ยว.'
    },
    {
        img: 'service-6-interior.jpg',
        title: 'ภายใน (Interior & Upholstery)',
        desc: 'งานซ่อมและฟื้นฟูภายในรถยนต์, เบาะหนัง, แผงประตู, ระบบไฟฟ้าภายใน, และหลังคามูนรูฟ/ซันรูฟ.'
    },
    {
        img: 'service-3-transmission.jpg',
        title: 'เกียร์ (Transmission System)',
        desc: 'เชี่ยวชาญซ่อมเกียร์อัตโนมัติ (Automatic Transmission) และเปลี่ยนถ่ายน้ำมันเกียร์ตามสเปคโรงงาน พร้อมรับประกันงานซ่อม.'
    },
    {
        img: 'service-2-engine.jpg',
        title: 'เครื่องยนต์ (Engine System)',
        desc: 'งานโอเวอร์ฮอลเครื่องยนต์, แก้ไขปัญหาเครื่องสั่น/ดับ, ตรวจเช็กระบบหัวฉีด, และซ่อมบำรุงตามระยะ เพื่อประสิทธิภาพสูงสุด.'
    },
    {
        img: 'service-8-options.jpg',
        title: 'เบรค (Brake System)',
        desc: 'ตรวจเช็กและซ่อมบำรุงระบบเบรก, เปลี่ยนผ้าเบรก, จานเบรก, ปั๊มเบรก, และระบบ ABS/ESP เพื่อความปลอดภัยสูงสุด.'
    },
    {
        img: 'service-4-electric.jpg',
        'title': 'ระบบไฟฟ้า (Electrical System)',
        desc: 'แก้ไขปัญหาระบบไฟฟ้าที่ซับซ้อน, กล่องควบคุม (ECU), สายไฟ, และแบตเตอรี่ไฮบริดด้วยเครื่องมือเฉพาะทาง.'
    },
    {
        img: 'service-5-ac.jpg',
        'title': 'ระบบแอร์ (Air Conditioning System)',
        desc: 'ซ่อมระบบปรับอากาศ, เปลี่ยนคอมเพรสเซอร์, เติมน้ำยาแอร์, และล้างตู้แอร์ เพื่อให้ได้ความเย็นที่สดชื่นและทำงานได้เต็มประสิทธิภาพ.'
    }
];

// --- Modal for Services 2 & 3 (Original Modal) ---
var serviceModal = document.getElementById("serviceModal");

function openServiceModal(title, imgFileName, content) {
    if (document.getElementById("modalTitle")) document.getElementById("modalTitle").innerHTML = title;
    if (document.getElementById("modalImage")) document.getElementById("modalImage").src = imgFileName;

    const readMoreButtonHTML = '<div style="margin-top: 20px; text-align: right;"><a href="#" class="modal-read-more-link" onclick="tryAgainPopup(); return false;">อ่านต่อตรงนี้</a></div>';
    if (document.getElementById("modalContent")) document.getElementById("modalContent").innerHTML = content + readMoreButtonHTML;

    if (serviceModal) serviceModal.style.display = "block";
}

function closeServiceModal() {
    if (serviceModal) serviceModal.style.display = "none";
}

function tryAgainPopup() {
    alert("การนำทาง: แสดงป็อปอัพลองใหม่ (Placeholder)");
}

// --- Slider Logic for Service 1 (9 หมวดหลัก) ---
let currentSlideIndex = 1;

function renderSlider() {
    const slideshowContainer = document.querySelector('#nineServicesSliderModal .slideshow-container');
    const indicatorContainer = document.getElementById('slide-indicators');

    if (!slideshowContainer || !indicatorContainer) return; 

    slideshowContainer.innerHTML = '';
    indicatorContainer.innerHTML = '';

    nineServicesData.forEach((item, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'mySlides';
        slideDiv.innerHTML = `
                    <img src="${item.img}" alt="${item.title}" style="width:100%">
                    <div class="slide-content-box">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                `;
        slideshowContainer.appendChild(slideDiv);

        const dotSpan = document.createElement('span');
        dotSpan.className = 'dot';
        dotSpan.onclick = function() {
            currentSlide(index + 1);
        };
        indicatorContainer.appendChild(dotSpan);
    });
}

function openNineServicesSlider() {
    stopAllVideos();

    const sliderModal = document.getElementById('nineServicesSliderModal');
    if (!sliderModal) return; 
    renderSlider(); 
    sliderModal.style.display = 'block';
    currentSlideIndex = 1; 
    showSlides(currentSlideIndex);

    closeServiceModal();
}

function closeNineServicesSlider() {
    const sliderModal = document.getElementById('nineServicesSliderModal');
    if (sliderModal) sliderModal.style.display = 'none';
}

function plusSlides(n) {
    showSlides(currentSlideIndex += n);
}

function currentSlide(n) {
    showSlides(currentSlideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName('mySlides');
    const dots = document.getElementsByClassName('dot');
    const totalSlides = nineServicesData.length;

    if (slides.length === 0) return; 

    if (n > totalSlides) {
        currentSlideIndex = 1
    }
    if (n < 1) {
        currentSlideIndex = totalSlides
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' active-dot', '');
    }

    slides[currentSlideIndex - 1].style.display = 'block';
    dots[currentSlideIndex - 1].className += ' active-dot';

    const positionText = document.getElementById('slide-position-text');
    if (positionText) {
        positionText.innerHTML = `${currentSlideIndex} / ${totalSlides}`;
    }
}

window.onclick = function(event) {
    if (event.target == serviceModal) {
        closeServiceModal();
    }
    if (event.target == document.getElementById('nineServicesSliderModal')) {
        closeNineServicesSlider();
    }

    if (event.target == document.getElementById('socialModal')) {
        closeSocialModal();
    }
};


/* =================================================== */
/* === [ใหม่] โค้ดสำหรับ *อ่าน* ข้อมูล Google Sheet === */
/* =================================================== */

const googleSheetCSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvF2qFTMriibojzK5OdL83KZ9JgSiogmrjqp19iEN1CTN_9kDYnmAg7OqnkrWCkRx64zllusnk1as/pub?output=csv';
let isSheetDataLoaded = false;

async function fetchGoogleSheetData() {
    if (isSheetDataLoaded) {
        return;
    }

    const container = document.getElementById('google-sheet-data-container');
    if (container) container.innerHTML = '<p>กำลังโหลดข้อมูล...</p>';

    try {
        const urlToFetch = `${googleSheetCSV_URL}&t=${new Date().getTime()}`;
        const response = await fetch(urlToFetch);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const csvText = await response.text();

        const data = parseGoogleSheetCSV(csvText);
        displayGoogleSheetData(data);
        isSheetDataLoaded = true; 

    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        if (container) container.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    }
}

function parseGoogleSheetCSV(csvText) {
    const lines = csvText.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());

        if (values.length !== headers.length) {
            continue; 
        }

        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = values[j].replace(/^"|"$/g, '');
        }
        result.push(obj);
    }

    return result;
}

function displayGoogleSheetData(data) {
    const container = document.getElementById('google-sheet-data-container');
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<p>ไม่พบข้อมูล</p>';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = Object.keys(data[0]);
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(rowData => {
        const tr = document.createElement('tr');

        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = rowData[header];
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
}
/* === [จบ] โค้ดสำหรับ *อ่าน* ข้อมูล === */



/* =================================================== */
/* === [ใหม่] โค้ดสำหรับ *ส่ง* ข้อมูลไป Google Sheet === */
/* =================================================== */

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! (แก้ไข) วาง "Web app URL" ที่คุณคัดลอกมาจาก Google Apps Script ตรงนี้ !!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvCYDJI_5fpjlfRAjX19AaBHzilCjaV7EviHFxNaX5zpbT-U0rmmbVPWPWDcOHr';


async function handleFormSubmit(event) {
    event.preventDefault(); 

    const coad = document.getElementById('coadInput').value;
    const url = document.getElementById('urlInput').value;
    const messageEl = document.getElementById('formMessage');
    const button = event.target.querySelector('button');

    if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_DEPLOYED_WEB_APP_URL_HERE') {
        if (messageEl) {
            messageEl.style.color = 'red';
            messageEl.textContent = '❌ ข้อผิดพลาด: ยังไม่ได้ตั้งค่า GOOGLE_APPS_SCRIPT_URL ใน script.js';
        }
        return;
    }

    if (!coad || !url) {
        if (messageEl) {
            messageEl.style.color = 'red';
            messageEl.textContent = 'กรุณากรอกข้อมูลให้ครบทั้ง 2 ช่อง';
        }
        return;
    }

    if (button) {
        button.disabled = true;
        button.textContent = 'กำลังส่ง...';
    }
    if (messageEl) messageEl.textContent = '';

    const data = {
        coad: coad,
        url: url
    };

    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(data),
            redirect: 'follow'
        });

        const result = await response.json();

        if (result.status === 'success') {
            if (messageEl) {
                messageEl.style.color = 'green';
                messageEl.textContent = '✅ ส่งข้อมูลสำเร็จ!';
            }

            document.getElementById('coadInput').value = '';
            document.getElementById('urlInput').value = '';

            isSheetDataLoaded = false;

        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error('Error submitting data:', error);
        if (messageEl) {
            messageEl.style.color = 'red';
            messageEl.textContent = '❌ เกิดข้อผิดพลาด: ' + error.message;
        }
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = 'เพิ่มข้อมูล';
        }
    }
}
/* === [จบ] โค้ดสำหรับ *ส่ง* ข้อมูล === */

/*
  =============================================================
  ==    👇 นี่คือฟังก์ชันที่ "ถูกต้อง" สำหรับระบบรหัสลับ 👇    ==
  =============================================================
*/
function checkStatus() {
    const ADMIN_PASSWORD = "admin"; // (รหัสเดียวกันกับใน Apps Script)
    const inputEl = document.getElementById('repairCode');
    const resultEl = document.getElementById('result');
    if (!inputEl || !resultEl) return;

    const code = inputEl.value;

    if (code === ADMIN_PASSWORD) {
        const adminMenuGroup = document.getElementById('admin-menu-group');
        if (adminMenuGroup) adminMenuGroup.style.display = 'inline-block';

        resultEl.innerHTML = '<span style="color: #00aaff;">✅ ปลดล็อกเมนู Admin สำเร็จ!</span>';

        showSection('admin-panel');

        inputEl.value = '';

    } else {
        resultEl.style.color = '#eee'; 
        resultEl.innerHTML = `กำลังค้นหาสถานะสำหรับรหัส: ${code}...`;
    }
}

function goBack() {
    window.history.back();
}

/* ===============================================
   === ⭐️ [ใหม่] โค้ดสำหรับ Social Popup (แก้ไข) ⭐️ ===
   ===============================================
*/

function openSocialModal() {
    var modal = document.getElementById("socialModal");
    if (modal) modal.style.display = "block";
}

function closeSocialModal() {
    var modal = document.getElementById("socialModal");
    if (modal) modal.style.display = "none";
}

/* ================================================= */
/* ส่วนที่เพิ่มใหม่: Logic สำหรับหน้าคู่มือเช็คระยะ */
/* ================================================= */

function showCheckUpGuide() {
    showSection('service-content'); // หรือ Section ID ที่บรรจุ Service

    const serviceList = document.getElementById('service-content-list');
    const guideContent = document.getElementById('check-up-guide-content');

    if (serviceList) serviceList.style.display = 'none';
    if (guideContent) guideContent.style.display = 'block';

    showStepContent(0);
}

function showServiceList() {
    const serviceList = document.getElementById('service-content-list');
    const guideContent = document.getElementById('check-up-guide-content');

    if (serviceList) serviceList.style.display = 'block';
    if (guideContent) guideContent.style.display = 'none';

    window.scrollTo(0, 0);
}

function showStepContent(step) {
    const tocView = document.getElementById('toc-view');
    const step1 = document.getElementById('step1-view');
    const step2 = document.getElementById('step2-view');
    const step3 = document.getElementById('step3-view');

    const views = [tocView, step1, step2, step3];
    views.forEach(view => {
        if (view) view.style.display = 'none';
    });

    let targetView;
    if (step === 1) targetView = step1;
    else if (step === 2) targetView = step2;
    else if (step === 3) targetView = step3;
    else targetView = tocView;

    if (targetView) targetView.style.display = 'block';

    window.scrollTo(0, 0);
}


/* =================================================== */
/* === [NEW] โค้ดสำหรับโหลดเนื้อหา Deep Dive Video === */
/* =================================================== */

let isDeepDiveLoaded = false;

async function loadDeepDiveContent() {
    if (isDeepDiveLoaded) {
        return;
    }

    const placeholder = document.getElementById('deep-dive-placeholder');
    
    try {
        const response = await fetch('deep_dive.html'); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const content = await response.text(); 
        
        if (placeholder) {
            placeholder.innerHTML = content; 
            isDeepDiveLoaded = true; 
        }

    } catch (error) {
        console.error('Error loading deep dive content:', error);
        if (placeholder) {
            placeholder.innerHTML = '<p style="color:red; text-align:center;">❌ ไม่สามารถโหลดส่วนวิดีโอ Deep Dive ได้</p>';
        }
    }
}

/* =================================================== */
/* === [NEW] โค้ดสำหรับโหลดเนื้อหา Reviews.html === */
/* =================================================== */

let isReviewsLoaded = false;

async function loadReviewsContent() {
    if (isReviewsLoaded) {
        return;
    }

    const placeholder = document.getElementById('reviews-placeholder');
    
    try {
        const response = await fetch('reviews.html'); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const content = await response.text(); 
        
        if (placeholder) {
            placeholder.innerHTML = content; 
            isReviewsLoaded = true; 
        }

    } catch (error) {
        console.error('Error loading reviews content:', error);
        if (placeholder) {
            placeholder.innerHTML = '<p style="color:red; text-align:center;">❌ ไม่สามารถโหลดส่วนรีวิวได้</p>';
        }
    }
}


/* =================================================== */
/* === [NEW] การรวมคำสั่งทำงานเมื่อหน้าเว็บโหลดเสร็จ === */
/* =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise Slider
    renderSlider();

    // 2. Bind Form Submission
    const form = document.getElementById('add-data-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // 3. Hide Check-up Guide (Initial State)
    const guideContent = document.getElementById('check-up-guide-content');
    if (guideContent) {
        guideContent.style.display = 'none';
    }

    // 4. Load Modular HTML Content (ในพื้นหลัง)
    loadDeepDiveContent(); 
    loadReviewsContent(); 

    // 5. [สำคัญมาก] ตรวจสอบว่าเมนูไหนควรเปิดตอนเริ่มต้น
    const initialHash = window.location.hash || '#home';
    if (initialHash === '#home') {
        initializePage(); // เรียกใช้ initializePage (ซึ่งเรียก goHome)
    } else {
        showSection(initialHash.substring(1)); // ตัด # ออก
    }
});
ๆ