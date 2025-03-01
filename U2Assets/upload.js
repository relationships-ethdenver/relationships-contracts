import { Web3Storage } from 'https://unpkg.com/web3.storage@4.5.4/dist/bundle.esm.min.js';
import { WEB3_STORAGE_TOKEN } from './config.js';

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadStatus = document.getElementById('uploadStatus');
const fileHash = document.getElementById('fileHash');
const ipfsUpload = document.getElementById('ipfsUpload');
let selectedFile = null;
let currentFileHash = null;
let signer = null;

// Initialize MetaMask connection
async function connectMetaMask() {
    try {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask not found. Please install MetaMask extension.');
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found. Please unlock MetaMask.');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log('Connected to MetaMask with address:', address);
        return true;
    } catch (error) {
        console.error('MetaMask connection error:', error);
        throw error;
    }
}

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Calculate file hash
async function calculateFileHash(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function() {
            try {
                const data = new Uint8Array(reader.result);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashHex = arrayBufferToHex(hashBuffer);
                resolve(hashHex);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone when dragging over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('highlight');
}

function unhighlight(e) {
    dropZone.classList.remove('highlight');
}

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);
fileInput.addEventListener('change', handleFileSelect, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

async function handleFiles(files) {
    if (files.length > 0) {
        selectedFile = files[0];
        uploadStatus.textContent = `Selected file: ${selectedFile.name}`;
        uploadStatus.style.display = 'block';
        ipfsUpload.style.display = 'block';
        
        try {
            currentFileHash = await calculateFileHash(selectedFile);
            fileHash.innerHTML = `File Hash (SHA-256):<br><code>${currentFileHash}</code>`;
            fileHash.style.display = 'block';
        } catch (error) {
            console.error('Error calculating hash:', error);
            fileHash.textContent = 'Error calculating file hash';
        }
    }
}

ipfsUpload.addEventListener('click', async () => {
    if (!selectedFile) {
        alert('Please select a file first');
        return;
    }

    try {
        uploadStatus.textContent = 'Connecting to MetaMask...';
        await connectMetaMask();

        uploadStatus.textContent = 'Signing file hash...';
        const signature = await signer.signMessage(currentFileHash);
        const ethAddress = await signer.getAddress();
        console.log('Got signature:', signature);

        uploadStatus.textContent = 'Uploading to IPFS...';
        const storage = new Web3Storage({ token: WEB3_STORAGE_TOKEN });
        
        // Create File object with metadata
        const metadata = {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            lastModified: selectedFile.lastModified,
            hash: currentFileHash,
            ethAddress: ethAddress,
            signature: signature
        };
        
        // Create a CAR file with the original file and metadata
        const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        const files = [
            new File([selectedFile], selectedFile.name),
            new File([metadataBlob], 'metadata.json')
        ];

        // Upload to IPFS
        const cid = await storage.put(files, {
            name: selectedFile.name,
            onRootCidReady: (cid) => {
                console.log('Uploading files with CID:', cid);
            },
            onStoredChunk: (bytes) => {
                const percent = ((bytes / selectedFile.size) * 100).toFixed(2);
                uploadStatus.textContent = `Uploading to IPFS: ${percent}%`;
            }
        });

        console.log('Upload complete! CID:', cid);
        uploadStatus.innerHTML = `Upload complete!<br>
            IPFS CID: <code>${cid}</code><br>
            View file: <a href="https://w3s.link/ipfs/${cid}/${selectedFile.name}" target="_blank">https://w3s.link/ipfs/${cid}/${selectedFile.name}</a><br>
            View metadata: <a href="https://w3s.link/ipfs/${cid}/metadata.json" target="_blank">https://w3s.link/ipfs/${cid}/metadata.json</a>`;

    } catch (error) {
        console.error('Upload error:', error);
        uploadStatus.textContent = `Error: ${error.message}`;
        if (error.stack) {
            console.error('Error stack:', error.stack);
        }
    }
});
