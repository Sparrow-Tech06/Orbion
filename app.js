// Track ads watched in localStorage
let adsWatchedToday = 0;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadAdCount();
    updateUI();
    
    document.getElementById('rewardAdButton').addEventListener('click', function() {
        showRewardedAd();
    });
});

// Load ad count from localStorage
function loadAdCount() {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('adData');
    
    if (storedData) {
        const { date, count } = JSON.parse(storedData);
        if (date === today) {
            adsWatchedToday = count;
        }
    }
    
    document.getElementById('adCount').textContent = adsWatchedToday;
}

// Save ad count to localStorage
function saveAdCount() {
    const today = new Date().toDateString();
    localStorage.setItem('adData', JSON.stringify({
        date: today,
        count: adsWatchedToday
    }));
}

// Update UI based on ad count
function updateUI() {
    const adButton = document.getElementById('rewardAdButton');
    const alternativeLink = document.getElementById('alternativeLink');
    
    if (adsWatchedToday >= 10) {
        adButton.style.display = 'none';
        alternativeLink.style.display = 'inline';
    } else {
        adButton.style.display = 'inline';
        alternativeLink.style.display = 'none';
    }
    
    document.getElementById('adCount').textContent = adsWatchedToday;
}

// Show rewarded ad function
function showRewardedAd() {
    if (adsWatchedToday >= 10) {
        alert("You've reached the maximum of 10 ads for today. Come back tomorrow!");
        return;
    }
    
    showRewardedAdInApp(function(success) {
        if (success) {
            adsWatchedToday++;
            saveAdCount();
            updateUI();
            
            // Give reward to user
            giveReward();
        }
    });
}

// Your existing function
function showRewardedAdInApp(callback) {
    if (window.Android && typeof window.Android.showRewardedAd === 'function') {
        window.Android.showRewardedAd();
        callback(true);
    } else {
        alert('Available only in the app.');
        callback(false);
    }
}

// Function to give reward to user
function giveReward() {
    // Implement your reward logic here
    alert("Congratulations! You've earned a bonus for watching the ad.");
    
    // Example: Add bonus points or features
    // updateUserPoints(10);
}
