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

console.log('Elements found:', {
    form: !!form,
    qrDataInput: !!qrDataInput,
    logoFileInput: !!logoFileInput,
    generateBtn: !!generateBtn,
    btnText: !!btnText,
    btnLoader: !!btnLoader,
    result: !!result,
    qrImage: !!qrImage,
    downloadBtn: !!downloadBtn,
    errorDiv: !!errorDiv
});

// Test if button is clickable
if (generateBtn) {
    generateBtn.addEventListener('click', (e) => {
        console.log('BUTTON CLICKED (direct)');
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('FORM SUBMITTED');
    
    // Reset previous results/errors
    result.style.display = 'none';
    errorDiv.style.display = 'none';
    
    // Get form data
    const qrData = qrDataInput.value.trim();
    
    if (!qrData) {
        showError('Please enter a URL or text');
        return;
    }
    
    // Show loading state
    setLoading(true);
    
    try {
        // Prepare request data
        const requestData = {
            data: qrData,
            logo: null
        };
        
        console.log('Preparing request for:', qrData);
        
        // Handle logo file if provided
        if (logoFileInput.files.length > 0) {
            const logoFile = logoFileInput.files[0];
            console.log('Processing logo:', logoFile.name);
            requestData.logo = await fileToBase64(logoFile);
        }
        
        console.log('Sending request to /api/generate');
        
        // Send request to API
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        // Try to get response text first
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('Parsed response data:', data);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            showError('Invalid response from server: ' + responseText.substring(0, 100));
            return;
        }
        
        if (response.ok && data.success) {
            console.log('Success! Setting image...');
            // Display QR code
            qrImage.src = data.image;
            console.log('Image src set to:', data.image.substring(0, 50) + '...');
            result.style.display = 'block';
            console.log('Result div displayed');
            
            // Scroll to result
            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            console.error('Request failed:', data);
            showError(data.error || 'Failed to generate QR code');
        }
    } catch (error) {
        console.error('Full error:', error);
        showError('Network error. Please try again. Check console for details.');
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
