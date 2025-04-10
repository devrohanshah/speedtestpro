// DOM Elements
const startTestBtn = document.getElementById('startTest');
const gaugeIndicator = document.getElementById('gaugeIndicator');
const testStatus = document.getElementById('testStatus');
const currentSpeed = document.getElementById('currentSpeed');
const downloadResult = document.getElementById('downloadResult');
const uploadResult = document.getElementById('uploadResult');
const pingResult = document.getElementById('pingResult');
const jitterResult = document.getElementById('jitterResult');
const progressFill = document.getElementById('progressFill');
const stepPing = document.getElementById('stepPing');
const stepDownload = document.getElementById('stepDownload');
const stepUpload = document.getElementById('stepUpload');
const stepComplete = document.getElementById('stepComplete');
const shareResults = document.getElementById('shareResults');
const ispInfo = document.getElementById('ispInfo');
const serverInfo = document.getElementById('serverInfo');
const ipInfo = document.getElementById('ipInfo');
const changeServer = document.getElementById('changeServer');
const serverModal = document.getElementById('serverModal');
const closeServerModal = document.getElementById('closeServerModal');
const confirmServerSelection = document.getElementById('confirmServerSelection');
const currentServer = document.getElementById('currentServer');
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

// Configuration variables
const downloadTestFile = 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Tokyo_Sky_Tree_2012.JPG'; // ~8MB file
const uploadTestSize = 2 * 1024 * 1024; // 2MB of data for upload test
const pingTestCount = 10;
const testTimeoutMs = 15000; // 15 seconds timeout for each test
const maxDownloadSpeed = 1000; // Maximum speed in Mbps for gauge display
const pingThreshold = 100; // ms threshold for "good" ping

// State variables
let selectedServer = 'Auto (Best Server)';
let testInProgress = false;
let pingValues = [];
let downloadSpeed = 0;
let uploadSpeed = 0;
let pingTime = 0;
let jitterTime = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    startTestBtn.addEventListener('click', startSpeedTest);
    changeServer.addEventListener('click', openServerModal);
    closeServerModal.addEventListener('click', closeModal);
    confirmServerSelection.addEventListener('click', confirmServer);
    navToggle.addEventListener('click', toggleNavMenu);
    
    // Server selection listeners
    const serverOptions = document.querySelectorAll('.server-option');
    serverOptions.forEach(option => {
        option.addEventListener('click', function() {
            serverOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Get initial network information
    fetchNetworkInfo();
}

// UI Helpers
function toggleNavMenu() {
    navList.classList.toggle('active');
}

function openServerModal() {
    serverModal.classList.add('active');
}

function closeModal() {
    serverModal.classList.remove('active');
}

function confirmServer() {
    const selectedOption = document.querySelector('.server-option.selected');
    if (selectedOption) {
        selectedServer = selectedOption.querySelector('.server-name').textContent;
        currentServer.textContent = `Testing Server: ${selectedServer}`;
        serverInfo.textContent = selectedServer;
    }
    closeModal();
}

function updateGauge(speedMbps) {
    // Calculate rotation angle (from -90 to 90 degrees)
    const percentage = Math.min(speedMbps / maxDownloadSpeed, 1);
    const angle = -90 + (percentage * 180);
    gaugeIndicator.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}

function updateTestStatus(status) {
    testStatus.textContent = status;
}

function updateProgress(percentage) {
    progressFill.style.width = `${percentage}%`;
}

function updateTestSteps(step) {
    // Reset all steps
    [stepPing, stepDownload, stepUpload, stepComplete].forEach(s => {
        s.classList.remove('active', 'completed');
    });
    
    switch(step) {
        case 'ping':
            stepPing.classList.add('active');
            break;
        case 'download':
            stepPing.classList.add('completed');
            stepDownload.classList.add('active');
            break;
        case 'upload':
            stepPing.classList.add('completed');
            stepDownload.classList.add('completed');
            stepUpload.classList.add('active');
            break;
        case 'complete':
            stepPing.classList.add('completed');
            stepDownload.classList.add('completed');
            stepUpload.classList.add('completed');
            stepComplete.classList.add('active');
            break;
    }
}

function displayResults() {
    // Display final results
    downloadResult.textContent = downloadSpeed.toFixed(2);
    uploadResult.textContent = uploadSpeed.toFixed(2);
    pingResult.textContent = pingTime.toFixed(0);
    jitterResult.textContent = jitterTime.toFixed(1);
    
    // Show share buttons
    shareResults.style.display = 'flex';
