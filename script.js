// ملف JavaScript الرئيسي للتطبيق مع دعم تعدد اللغات

// المتغيرات العامة
let miningAmount = 0;
let miningInterval;
let miningRate = 1;
let referralCount = 0;
let referralRewards = 0;
let socialRewards = {
    twitter: false,
    facebook: false,
    telegram: false,
    discord: false
};
let referralCode = generateReferralCode();
let currentLanguage = 'ar'; // اللغة الافتراضية هي العربية

// دالة التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحميل البيانات المخزنة محلياً
    loadStoredData();
    
    // تهيئة زر التعدين
    initMiningButton();
    
    // تهيئة نموذج بيانات المستخدم
    initUserForm();
    
    // تهيئة نظام الإحالة
    initReferralSystem();
    
    // تهيئة نظام مواقع التواصل الاجتماعي
    initSocialPlatforms();
    
    // تهيئة زر إنشاء رمز QR
    initQRGenerator();
    
    // تهيئة أزرار تبديل اللغة
    initLanguageToggle();
    
    // التحقق من وجود رمز إحالة في الرابط
    checkReferralLink();
    
    // تطبيق اللغة الحالية
    applyLanguage(currentLanguage);
});

// دالة تحميل البيانات المخزنة محلياً
function loadStoredData() {
    // تحميل اللغة المفضلة
    if (localStorage.getItem('aipCoinLanguage')) {
        currentLanguage = localStorage.getItem('aipCoinLanguage');
        document.body.className = currentLanguage;
    }
    
    // تحميل رصيد التعدين
    if (localStorage.getItem('aipCoinMiningAmount')) {
        miningAmount = parseFloat(localStorage.getItem('aipCoinMiningAmount'));
        updateMiningDisplay();
    }
    
    // تحميل بيانات المستخدم
    if (localStorage.getItem('aipCoinUserName')) {
        document.getElementById('user-name').value = localStorage.getItem('aipCoinUserName');
    }
    
    if (localStorage.getItem('aipCoinWalletAddress')) {
        document.getElementById('wallet-address').value = localStorage.getItem('aipCoinWalletAddress');
    }
    
    // تحميل بيانات الإحالة
    if (localStorage.getItem('aipCoinReferralCode')) {
        referralCode = localStorage.getItem('aipCoinReferralCode');
    } else {
        localStorage.setItem('aipCoinReferralCode', referralCode);
    }
    
    if (localStorage.getItem('aipCoinReferralCount')) {
        referralCount = parseInt(localStorage.getItem('aipCoinReferralCount'));
        document.getElementById('referral-count').textContent = referralCount;
    }
    
    if (localStorage.getItem('aipCoinReferralRewards')) {
        referralRewards = parseFloat(localStorage.getItem('aipCoinReferralRewards'));
        document.getElementById('referral-rewards').textContent = referralRewards;
    }
    
    // تحميل حالة مكافآت مواقع التواصل الاجتماعي
    if (localStorage.getItem('aipCoinSocialRewards')) {
        socialRewards = JSON.parse(localStorage.getItem('aipCoinSocialRewards'));
        updateSocialPlatformsStatus();
    }
    
    // تحديث رابط الإحالة
    updateReferralLink();
}

// دالة تهيئة زر التعدين
function initMiningButton() {
    const miningButton = document.getElementById('mining-button');
    const miningAmountElement = document.getElementById('mining-amount');
    
    // تحديث عرض رصيد التعدين
    miningAmountElement.textContent = miningAmount.toFixed(2);
    document.getElementById('coin-amount').value = miningAmount.toFixed(2) + ' AIPCOIN';
    
    // بدء التعدين التلقائي كل 11 ثانية
    startMining();
    
    // إضافة حدث النقر لزر التعدين (للتفاعل فقط)
    miningButton.addEventListener('click', function() {
        // إضافة تأثير بصري عند النقر
        this.classList.add('glow');
        setTimeout(() => {
            this.classList.remove('glow');
        }, 500);
    });
}

// دالة بدء التعدين التلقائي
function startMining() {
    // إيقاف أي تعدين سابق
    if (miningInterval) {
        clearInterval(miningInterval);
    }
    
    // بدء التعدين كل 11 ثانية
    miningInterval = setInterval(function() {
        miningAmount += miningRate;
        updateMiningDisplay();
        saveMiningData();
    }, 11000); // 11 ثانية
}

// دالة تحديث عرض رصيد التعدين
function updateMiningDisplay() {
    document.getElementById('mining-amount').textContent = miningAmount.toFixed(2);
    document.getElementById('coin-amount').value = miningAmount.toFixed(2) + ' AIPCOIN';
}

// دالة حفظ بيانات التعدين
function saveMiningData() {
    localStorage.setItem('aipCoinMiningAmount', miningAmount.toString());
}

// دالة تهيئة نموذج بيانات المستخدم
function initUserForm() {
    const userNameInput = document.getElementById('user-name');
    const walletAddressInput = document.getElementById('wallet-address');
    
    // حفظ بيانات المستخدم عند التغيير
    userNameInput.addEventListener('change', function() {
        localStorage.setItem('aipCoinUserName', this.value);
    });
    
    walletAddressInput.addEventListener('change', function() {
        localStorage.setItem('aipCoinWalletAddress', this.value);
    });
}

// دالة إنشاء رمز إحالة عشوائي
function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// دالة تهيئة نظام الإحالة
function initReferralSystem() {
    const copyLinkButton = document.getElementById('copy-link');
    
    // تحديث رابط الإحالة
    updateReferralLink();
    
    // إضافة حدث نسخ الرابط
    copyLinkButton.addEventListener('click', function() {
        const referralLinkInput = document.getElementById('referral-link');
        referralLinkInput.select();
        document.execCommand('copy');
        
        // تغيير نص الزر مؤقتاً للإشارة إلى نجاح النسخ
        const originalText = this.textContent;
        this.textContent = getTranslation('referral.copied');
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
    });
    
    // إضافة أحداث مشاركة على مواقع التواصل الاجتماعي
    document.getElementById('share-facebook').addEventListener('click', function(e) {
        e.preventDefault();
        const referralLink = document.getElementById('referral-link').value;
        window.open(`https://www.facebook.com/profile.php?id=61566919956366=${encodeURIComponent(referralLink)}`, '_blank');
    });
    
    document.getElementById('share-twitter').addEventListener('click', function(e) {
        e.preventDefault();
        const referralLink = document.getElementById('referral-link').value;
        window.open(`https://x.com/SAppstoon60072?t=RmNCTQy9CZI4l0FwbjMXig&s=09=${getShareText()}&url=${encodeURIComponent(referralLink)}`, '_blank');
    });
    
    document.getElementById('share-telegram').addEventListener('click', function(e) {
        e.preventDefault();
        const referralLink = document.getElementById('referral-link').value;
        window.open(`https://t.me/AIPcoin6’${encodeURIComponent(referralLink)}&text=${getShareText()}`, '_blank');
    });
    
    document.getElementById('share-whatsapp').addEventListener('click', function(e) {
        e.preventDefault();
        const referralLink = document.getElementById('referral-link').value;
        window.open(`https://discord.gg/SmAEwpnc=${getShareText()} ${encodeURIComponent(referralLink)}`, '_blank');
    });
}

// دالة الحصول على نص المشاركة حسب اللغة الحالية
function getShareText() {
    switch(currentLanguage) {
        case 'en':
            return 'Join AIPCOIN and get free coins!';
        case 'fr':
            return 'Rejoignez AIPCOIN et obtenez des pièces gratuites!';
        case 'de':
            return 'Treten Sie AIPCOIN bei und erhalten Sie kostenlose Münzen!';
        default:
            return 'انضم إلى AIPCOIN واحصل على عملات مجانية!';
    }
}

// دالة تحديث رابط الإحالة
function updateReferralLink() {
    const currentUrl = window.location.href.split('?')[0]; // الحصول على الرابط الأساسي بدون معلمات
    const referralLink = `${currentUrl}?ref=${referralCode}`;
    document.getElementById('referral-link').value = referralLink;
}

// دالة التحقق من وجود رمز إحالة في الرابط
function checkReferralLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode && refCode !== referralCode) {
        // إذا كان هناك رمز إحالة وليس رمز المستخدم نفسه
        // تحقق مما إذا كان هذا الرمز قد تم استخدامه من قبل
        const usedReferrals = JSON.parse(localStorage.getItem('aipCoinUsedReferrals') || '[]');
        
        if (!usedReferrals.includes(refCode)) {
            // إضافة مكافأة للمستخدم الحالي (المُحال)
            miningAmount += 10;
            updateMiningDisplay();
            saveMiningData();
            
            // حفظ الرمز كمستخدم
            usedReferrals.push(refCode);
            localStorage.setItem('aipCoinUsedReferrals', JSON.stringify(usedReferrals));
            
            // عرض رسالة ترحيب
            alert(getTranslation('system.welcome'));
        }
    }
}

// دالة تهيئة نظام مواقع التواصل الاجتماعي
function initSocialPlatforms() {
    const socialPlatforms = document.querySelectorAll('.social-platform');
    
    // تحديث حالة المنصات
    updateSocialPlatformsStatus();
    
    // إضافة أحداث النقر على منصات التواصل الاجتماعي
    socialPlatforms.forEach(platform => {
        platform.addEventListener('click', function() {
            const platformName = this.getAttribute('data-platform');
            
            // التحقق مما إذا كانت المكافأة قد تم استلامها بالفعل
            if (!socialRewards[platformName]) {
                // إضافة المكافأة
                miningAmount += 50;
                updateMiningDisplay();
                saveMiningData();
                
                // تحديث حالة المكافأة
                socialRewards[platformName] = true;
                localStorage.setItem('aipCoinSocialRewards', JSON.stringify(socialRewards));
                
                // تحديث حالة العرض
                document.getElementById(`${platformName}-status`).textContent = getTranslation('social.status.complete');
                this.classList.add('completed');
                
                // عرض رسالة نجاح
                const platformDisplayName = getTranslation(`social.platforms.${platformName}`);
                const message = getTranslation('system.socialReward').replace('{platform}', platformDisplayName);
                alert(message);
            }
        });
    });
}

// دالة تحديث حالة منصات التواصل الاجتماعي
function updateSocialPlatformsStatus() {
    for (const platform in socialRewards) {
        if (socialRewards[platform]) {
            document.getElementById(`${platform}-status`).textContent = getTranslation('social.status.complete');
            document.querySelector(`.social-platform[data-platform="${platform}"]`).classList.add('completed');
        } else {
            document.getElementById(`${platform}-status`).textContent = getTranslation('social.status.incomplete');
        }
    }
}

// دالة تهيئة مولد رمز QR
function initQRGenerator() {
    const generateQRButton = document.getElementById('generate-qr');
    
    generateQRButton.addEventListener('click', function() {
        const userName = document.getElementById('user-name').value;
        const walletAddress = document.getElementById('wallet-address').value;
        
        if (!userName || !walletAddress) {
            alert(getTranslation('system.qrError'));
            return;
        }
        
        // إنشاء بيانات QR
        const qrData = {
            name: userName,
            wallet: walletAddress,
            amount: miningAmount,
            referralCode: referralCode
        };
        
        // تحويل البيانات إلى سلسلة JSON
        const qrContent = JSON.stringify(qrData);
        
        // إنشاء رمز QR
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = ''; // مسح المحتوى السابق
        
        // إنشاء رمز QR باستخدام مكتبة qrcode.js
        const qr = new QRCode(qrContainer, {
            text: qrContent,
            width: 200,
            height: 200,
            colorDark: "#0066cc",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // إضافة شعار AIPCOIN فوق رمز QR
        setTimeout(() => {
            addLogoToQRCode();
        }, 100);
    });
}

// دالة إضافة شعار AIPCOIN إلى رمز QR
function addLogoToQRCode() {
    const qrImage = document.querySelector('#qrcode img');
    const qrCanvas = document.querySelector('#qrcode canvas');
    
    if (qrCanvas) {
        const canvas = qrCanvas;
        const ctx = canvas.getContext('2d');
        
        // إنشاء صورة الشعار
        const logo = new Image();
        logo.src = 'images/logo.png';
        
        logo.onload = function() {
            // حساب موقع وحجم الشعار
            const logoSize = canvas.width * 0.2; // 20% من حجم رمز QR
            const logoX = (canvas.width - logoSize) / 2;
            const logoY = (canvas.height - logoSize) / 2;
            
            // رسم خلفية بيضاء للشعار
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);
            
            // رسم الشعار
            ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        };
    }
}

// دالة تهيئة أزرار تبديل اللغة
function initLanguageToggle() {
    // إضافة أزرار اللغات في القائمة
    const navMenu = document.querySelector('nav ul');
    
    // إنشاء قائمة منسدلة للغات
    const langDropdown = document.createElement('li');
    langDropdown.className = 'lang-dropdown';
    
    const currentLangButton = document.createElement('a');
    currentLangButton.href = '#';
    currentLangButton.id = 'current-lang';
    currentLangButton.textContent = getLanguageName(currentLanguage);
    
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';
    
    // إضافة خيارات اللغات
    const languages = [
        { code: 'ar', name: 'العربية' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' }
    ];
    
    languages.forEach(lang => {
        if (lang.code !== currentLanguage) {
            const langOption = document.createElement('a');
            langOption.href = '#';
            langOption.dataset.lang = lang.code;
            langOption.textContent = lang.name;
            
            langOption.addEventListener('click', function(e) {
                e.preventDefault();
                changeLanguage(lang.code);
            });
            
            dropdownContent.appendChild(langOption);
        }
    });
    
    langDropdown.appendChild(currentLangButton);
    langDropdown.appendChild(dropdownContent);
    navMenu.appendChild(langDropdown);
    
    // إضافة حدث فتح/إغلاق القائمة المنسدلة
    currentLangButton.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownContent.classList.toggle('show');
    });
    
    // إغلاق القائمة المنسدلة عند النقر خارجها
    window.addEventListener('click', function(e) {
        if (!e.target.matches('#current-lang')) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });
}

// دالة تغيير اللغة
function changeLanguage(langCode) {
    currentLanguage = langCode;
    localStorage.setItem('aipCoinLanguage', langCode);
    
    // تطبيق اللغة الجديدة
    applyLanguage(langCode);
    
    // تحديث زر اللغة الحالية
    document.getElementById('current-lang').textContent = getLanguageName(langCode);
    
    // تحديث اتجاه الصفحة حسب اللغة
    document.body.className = langCode;
    
    // تحديث حالة منصات التواصل الاجتماعي
    updateSocialPlatformsStatus();
}

// دالة الحصول على اسم اللغة
function getLanguageName(langCode) {
    switch(langCode) {
        case 'ar': return 'العربية';
        case 'en': return 'English';
        case 'fr': return 'Français';
        case 'de': return 'Deutsch';
        default: return 'العربية';
    }
}

// دالة تطبيق اللغة على جميع عناصر الصفحة
function applyLanguage(langCode) {
    // تحديث عناصر القائمة
    document.querySelector('nav ul li:nth-child(1) a').textContent = getTranslation('nav.mining');
    document.querySelector('nav ul li:nth-child(2) a').textContent = getTranslation('nav.userInfo');
    document.querySelector('nav ul li:nth-child(3) a').textContent = getTranslation('nav.referral');
    document.querySelector('nav ul li:nth-child(4) a').textContent = getTranslation('nav.social');
    document.querySelector('nav ul li:nth-child(5) a').textContent = getTranslation('nav.aiAnalysis');
    
    // تحديث القسم الرئيسي
    document.querySelector('.hero h2').textContent = getTranslation('hero.title');
    document.querySelector('.hero p').textContent = getTranslation('hero.description');
    
    // تحديث قسم التعدين
    document.querySelector('#mining .section-title').innerHTML = `<i class="fas fa-microchip"></i> ${getTranslation('mining.title')}`;
    document.querySelector('.mining-stats p:nth-child(1)').innerHTML = `${getTranslation('mining.balance')} <span class="amount" id="mining-amount">${miningAmount.toFixed(2)}</span> AIPCOIN`;
    document.querySelector('.mining-stats p:nth-child(2)').innerHTML = `${getTranslation('mining.rate')} <span id="mining-rate">${getTranslation('mining.rateValue')}</span>`;
    
    // تحديث قسم معلومات المستخدم
    document.querySelector('#user-info .section-title').innerHTML = `<i class="fas fa-user"></i> ${getTranslation('userInfo.title')}`;
    document.querySelector('label[for="user-name"]').textContent = getTranslation('userInfo.name');
    document.getElementById('user-name').placeholder = getTranslation('userInfo.namePlaceholder');
    document.querySelector('label[for="wallet-address"]').textContent = getTranslation('userInfo.wallet');
    document.getElementById('wallet-address').placeholder = getTranslation('userInfo.walletPlaceholder');
    document.querySelector('label[for="coin-amount"]').textContent = getTranslation('userInfo.amount');
    document.getElementById('generate-qr').textContent = getTranslation('userInfo.generateQR');
    
    // تحديث قسم رمز QR
    document.querySelector('.qr-section .section-title').innerHTML = `<i class="fas fa-qrcode"></i> ${getTranslation('qrCode.title')}`;
    document.querySelector('.qr-section p').textContent = getTranslation('qrCode.description');
    
    // تحديث قسم الإحالة
    document.querySelector('#referral .section-title').innerHTML = `<i class="fas fa-link"></i> ${getTranslation('referral.title')}`;
    document.querySelector('#referral > p:nth-child(2)').textContent = getTranslation('referral.description');
    document.querySelector('#referral > p:nth-child(4)').innerHTML = `${getTranslation('referral.count')} <span id="referral-count">${referralCount}</span>`;
    document.querySelector('#referral > p:nth-child(5)').innerHTML = `${getTranslation('referral.rewards')} <span id="referral-rewards">${referralRewards}</span> AIPCOIN`;
    document.getElementById('copy-link').textContent = getTranslation('referral.copy');
    
    // تحديث قسم مواقع التواصل الاجتماعي
    document.querySelector('#social .section-title').innerHTML = `<i class="fas fa-share-alt"></i> ${getTranslation('social.title')}`;
    document.querySelector('#social > p').textContent = getTranslation('social.description');
    
    document.querySelector('.social-platform[data-platform="twitter"] h4').textContent = getTranslation('social.platforms.twitter');
    document.querySelector('.social-platform[data-platform="facebook"] h4').textContent = getTranslation('social.platforms.facebook');
    document.querySelector('.social-platform[data-platform="telegram"] h4').textContent = getTranslation('social.platforms.telegram');
    document.querySelector('.social-platform[data-platform="discord"] h4').textContent = getTranslation('social.platforms.discord');
    
    document.querySelectorAll('.social-platform .reward').forEach(el => {
        el.textContent = getTranslation('social.reward');
    });
    
    // تحديث حالة منصات التواصل الاجتماعي
    updateSocialPlatformsStatus();
    
    // تحديث قسم تحليل الذكاء الاصطناعي
    document.querySelector('#ai-analysis .section-title').innerHTML = `<i class="fas fa-robot"></i> ${getTranslation('aiAnalysis.title')}`;
    document.querySelector('#ai-analysis > p').textContent = getTranslation('aiAnalysis.description');
    
    const statCards = document.querySelectorAll('.stat-card');
    statCards[0].querySelector('h4').textContent = getTranslation('aiAnalysis.totalSupply.title');
    statCards[0].querySelector('.value').textContent = getTranslation('aiAnalysis.totalSupply.value');
    statCards[0].querySelector('p:not(.value)').textContent = getTranslation('aiAnalysis.totalSupply.unit');
    
    statCards[1].querySelector('h4').textContent = getTranslation('aiAnalysis.accuracy.title');
    statCards[1].querySelector('.value').textContent = getTranslation('aiAnalysis.accuracy.value');
    statCards[1].querySelector('p:not(.value)').textContent = getTranslation('aiAnalysis.accuracy.description');
    
    statCards[2].querySelector('h4').textContent = getTranslation('aiAnalysis.transactions.title');
    statCards[2].querySelector('.value').textContent = getTranslation('aiAnalysis.transactions.value');
    statCards[2].querySelector('p:not(.value)').textContent = getTranslation('aiAnalysis.transactions.description');
    
    // تحديث التذييل
    document.querySelector('footer p').textContent = getTranslation('footer.copyright');
}

// دالة الحصول على ترجمة نص معين
function getTranslation(key) {
    const keys = key.split('.');
    let translation = window.translations[currentLanguage];
    
    for (const k of keys) {
        if (translation && translation[k] !== undefined) {
            translation = translation[k];
        } else {
            // إذا لم يتم العثور على الترجمة، استخدم النص العربي الافتراضي
            translation = getDefaultTranslation(key);
            break;
        }
    }
    
    return translation;
}

// دالة الحصول على الترجمة الافتراضية (العربية)
function getDefaultTranslation(key) {
    const keys = key.split('.');
    let translation = window.translations.ar;
    
    for (const k of keys) {
        if (translation && translation[k] !== undefined) {
            translation = translation[k];
        } else {
            return key; // إرجاع المفتاح نفسه إذا لم يتم العثور على ترجمة
        }
    }
    
    return translation;
}
