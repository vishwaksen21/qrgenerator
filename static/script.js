console.log('=== QR Generator Script Loading ===');

const form = document.getElementById('qrForm');
const qrDataInput = document.getElementById('qrData');
const logoFileInput = document.getElementById('logoFile');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const result = document.getElementById('result');
const qrImage = document.getElementById('qrImage');
const downloadBtn = document.getElementById('downloadBtn');
const errorDiv = document.getElementById('error');
const debugInfo = document.getElementById('debugInfo');
const debugLog = document.getElementById('debugLog');

// Show debug panel
if (debugInfo) debugInfo.style.display = 'block';

function addDebug(message) {
    console.log(message);
    if (debugLog) {
        const time = new Date().toLocaleTimeString();
        debugLog.innerHTML += `<div>[${time}] ${message}</div>`;
    }
}

addDebug('Script initialized');

console.log('Elements found:', {
    form: !!form,
    qrDataInput: !!qrDataInput,
    logoFileInput: !!logoFileInput,
    generateBtn: !!generateBtn,
    btnText: !!btnText,
    btnLoader: !!btnLoader,
    result: !!result
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    addDebug('Form submitted');

    result.style.display = 'none';
    errorDiv.style.display = 'none';

    const qrData = qrDataInput.value.trim();
    addDebug('QR Data: ' + qrData);

    if (!qrData) {
        showError('Please enter a URL or text');
        addDebug('ERROR: No QR data entered');
        return;
    }

    setLoading(true);
    addDebug('Loading started...');

    try {
        const requestData = {
            data: qrData,
            logo: null
        };

        addDebug('Preparing API request');

        if (logoFileInput.files.length > 0) {
            const logoFile = logoFileInput.files[0];
            addDebug('Processing logo: ' + logoFile.name);
            requestData.logo = await fileToBase64(logoFile);
            addDebug('Logo converted to base64');
        }

        addDebug('Sending request to /api/generate');

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        addDebug('Response status: ' + response.status);

        const responseText = await response.text();
        addDebug('Raw response length: ' + responseText.length);

        let data;

        try {
            data = JSON.parse(responseText);
            addDebug('Response parsed successfully');
        } catch (parseError) {
            addDebug('ERROR: JSON parse failed - ' + parseError.message);
            showError('Invalid response from server');
            return;
        }

        if (response.ok && data.success) {
            addDebug('SUCCESS! Displaying QR code');

            qrImage.src = data.image;
            result.style.display = 'block';

            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            addDebug('ERROR: API returned failure - ' + (data.error || 'Unknown error'));
            showError(data.error || 'Failed to generate QR code');
        }

    } catch (error) {
        console.error('Full error:', error);
        addDebug('EXCEPTION: ' + error.message);
        showError('Network error. Please try again.');
    } finally {
        setLoading(false);
    }
});

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = qrImage.src;
    link.download = 'qr_code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function setLoading(loading) {
    generateBtn.disabled = loading;
    btnText.style.display = loading ? 'none' : 'inline';
    btnLoader.style.display = loading ? 'inline-block' : 'none';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}