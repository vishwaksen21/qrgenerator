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

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
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
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.success) {
            // Display QR code
            qrImage.src = data.image;
            result.style.display = 'block';
            
            // Scroll to result
            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
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
