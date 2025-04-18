// Quiz data
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
    },
    {
        question: "What is the largest mammal?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correctAnswer: "Blue Whale"
    }
];

// Game state
let currentQuestionIndex = 0;
let score = 0;
let adsWatchedToday = 0;

// DOM elements
const startBtn = document.getElementById('startBtn');
const quizContainer = document.getElementById('quizContainer');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const resultElement = document.getElementById('result');
const nextBtn = document.getElementById('nextBtn');
const adCountElement = document.getElementById('adCount');
const alternativeLink = document.getElementById('alternativeLink');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadAdCount();
    updateAdCounterUI();
    
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', showNextQuestion);
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
}

// Save ad count to localStorage
function saveAdCount() {
    const today = new Date().toDateString();
    localStorage.setItem('adData', JSON.stringify({
        date: today,
        count: adsWatchedToday
    }));
}

// Update ad counter UI
function updateAdCounterUI() {
    adCountElement.textContent = adsWatchedToday;
    
    if (adsWatchedToday >= 10) {
        alternativeLink.style.display = 'block';
    } else {
        alternativeLink.style.display = 'none';
    }
}

// Start quiz
function startQuiz() {
    startBtn.style.display = 'none';
    quizContainer.style.display = 'block';
    showQuestion();
}

// Show current question
function showQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    
    optionsElement.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(option));
        optionsElement.appendChild(button);
    });
    
    resultElement.textContent = '';
    nextBtn.style.display = 'none';
}

// Handle answer selection
function selectAnswer(selectedOption) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const options = optionsElement.querySelectorAll('.option-btn');
    
    options.forEach(option => {
        option.disabled = true;
        if (option.textContent === currentQuestion.correctAnswer) {
            option.style.backgroundColor = '#4CAF50';
        } else if (option.textContent === selectedOption && selectedOption !== currentQuestion.correctAnswer) {
            option.style.backgroundColor = '#F44336';
        }
    });
    
    if (selectedOption === currentQuestion.correctAnswer) {
        score++;
        resultElement.textContent = 'Correct!';
        resultElement.style.color = '#4CAF50';
    } else {
        resultElement.textContent = `Wrong! Correct answer is ${currentQuestion.correctAnswer}`;
        resultElement.style.color = '#F44336';
    }
    
    nextBtn.style.display = 'block';
}

// Show next question or end quiz
function showNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

// End quiz and show ad
function endQuiz() {
    questionElement.textContent = `Quiz Completed! Your score: ${score}/${quizQuestions.length}`;
    optionsElement.innerHTML = '';
    resultElement.textContent = '';
    nextBtn.style.display = 'none';
    
    // Show interstitial ad after quiz completion
    showInterstitialAd();
}

// Show interstitial ad function
function showInterstitialAd() {
    if (adsWatchedToday >= 10) {
        alert("You've reached the maximum of 10 ads for today. Come back tomorrow!");
        return;
    }
    
    showInterstitialAdInApp(function(success) {
        if (success) {
            adsWatchedToday++;
            saveAdCount();
            updateAdCounterUI();
            
            // Optional: Give reward for watching ad
            alert("Thanks for completing the quiz and watching the ad!");
        }
    });
}

// Interstitial ad function (to be implemented with AdMob)
function showInterstitialAdInApp(callback) {
    if (window.Android && typeof window.Android.showInterstitialAd === 'function') {
        window.Android.showInterstitialAd();
        callback(true);
    } else {
        // For testing in browser
        console.log("Interstitial ad would show here in the app");
        setTimeout(() => {
            const userWatchedAd = confirm("This would be an interstitial ad. Did you watch it?");
            callback(userWatchedAd);
        }, 500);
    }
}
