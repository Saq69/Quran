document.addEventListener('DOMContentLoaded', function() {
    const verseArabic = document.getElementById('verse-arabic');
    const verseReference = document.getElementById('verse-reference');
    const newVerseBtn = document.getElementById('new-verse');
    const copyVerseBtn = document.getElementById('copy-verse');
    
    // Check if this is an API call
    const urlParams = new URLSearchParams(window.location.search);
    const isApiCall = urlParams.has('api');
    
    // API endpoint - using AlQuran Cloud API
    const API_URL = 'https://api.alquran.cloud/v1/ayah/random/ar.alafasy';
    
    async function fetchRandomVerse() {
        try {
            if (isApiCall) {
                // For API calls, we'll handle differently
                return;
            }
            
            // Show loading state
            newVerseBtn.innerHTML = '<span class="loading"></span> جاري التحميل';
            newVerseBtn.disabled = true;
            
            const response = await fetch(API_URL);
            const data = await response.json();
            
            if (data.code === 200 && data.status === 'OK') {
                return {
                    arabic: data.data.text,
                    reference: `سورة ${data.data.surah.englishName} (${data.data.surah.number}:${data.data.numberInSurah})`
                };
            }
            throw new Error('Failed to fetch verse');
        } catch (error) {
            console.error('Error fetching verse:', error);
            return {
                arabic: 'حدث خطأ أثناء جلب الآية. الرجاء المحاولة مرة أخرى.',
                reference: ''
            };
        } finally {
            if (!isApiCall) {
                newVerseBtn.innerHTML = '<i class="fas fa-sync-alt"></i> آية جديدة';
                newVerseBtn.disabled = false;
            }
        }
    }
    
    async function displayVerse() {
        if (isApiCall) {
            // For API calls, fetch and return only the Arabic text
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                if (data.code === 200 && data.status === 'OK') {
                    document.body.textContent = data.data.text;
                } else {
                    document.body.textContent = 'حدث خطأ أثناء جلب الآية';
                }
            } catch (error) {
                document.body.textContent = 'حدث خطأ أثناء جلب الآية';
            }
            return;
        }
        
        const verse = await fetchRandomVerse();
        verseArabic.textContent = verse.arabic;
        verseReference.textContent = verse.reference;
    }
    
    // Copy verse to clipboard
    copyVerseBtn.addEventListener('click', function() {
        const verseToCopy = verseArabic.textContent + '\n\n' + verseReference.textContent;
        navigator.clipboard.writeText(verseToCopy).then(() => {
            // Show copied feedback
            const originalText = copyVerseBtn.innerHTML;
            copyVerseBtn.innerHTML = '<i class="fas fa-check"></i> تم النسخ!';
            setTimeout(() => {
                copyVerseBtn.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Initial load
    displayVerse();
    
    // New verse button
    newVerseBtn.addEventListener('click', displayVerse);
});