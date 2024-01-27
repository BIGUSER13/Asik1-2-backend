function bookTrip() {
    const destination = document.getElementById('destinationInput').value;
    const date = document.getElementById('dateInput').value;

    if (!destination || !date) {
        alert('Please fill in all required fields.');
        return;
    }

    fetch('/booktrip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `destination=${destination}&date=${date}`,
    })
        .then(response => response.text())
        .then(result => {
            console.log('Server response:', result);

            // Parse the cost from the response (assuming the response format is consistent)
            const costMatch = result.match(/Cost: \$([\d,]+)/);
            const cost = costMatch ? costMatch[1] : 'unknown';

            // Show notification for successful booking with destination, date, and cost
            alert(`Booking successful! Destination: ${destination}, Date: ${date}, Cost: $${cost}`);

            document.getElementById('bookingResult').innerHTML = result;

            fetch('/travelhistory')
                .then(response => response.text())
                .then(history => {
                    document.getElementById('travelHistory').innerHTML = history;
                })
                .catch(error => {
                    console.error('Error fetching travel history:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function openBookingDialog() {
    const dialogBox = document.createElement('div');
    dialogBox.className = 'booking-dialog';

    const destinationInput = document.createElement('input');
    destinationInput.type = 'text';
    destinationInput.placeholder = 'Enter destination';
    destinationInput.id = 'bookingDestination';

    const submitButton = document.createElement('button');
    submitButton.innerText = 'Book Now';
    submitButton.onclick = submitBooking;

    dialogBox.appendChild(destinationInput);
    dialogBox.appendChild(submitButton);

    document.body.appendChild(dialogBox);
}

function submitBooking() {
    const destination = document.getElementById('bookingDestination').value;

    if (!destination) {
        alert('Please enter a destination.');
        return;
    }

    console.log('Booking initiated for destination:', destination);
    closeBookingDialog();
}

function closeBookingDialog() {
    const dialogBox = document.querySelector('.booking-dialog');
    if (dialogBox) {
        dialogBox.remove();
    }
}


function redirectToPaymentForm() {
    // Redirect to Payment_form.html
    window.location.href = 'payment.html';
}

function redirectToLogin() {
    // Redirect to signup.html (since login.html doesn't exist)
    window.location.href = 'login.html';
}

function redirectToTravelHistory() {
    // Redirect to signup.html (since login.html doesn't exist)
    window.location.href = 'travelhistory.html';
}


function redirectToServices() {
    if (window.location.pathname.includes('travelhistory.html')) {
        // Redirect to index.html and scroll down to the service section
        window.location.href = 'index.html#service-section';
    } else {
        // Scroll down to the service section on the current page
        const serviceSection = document.getElementById('service-section');
        if (serviceSection) {
            serviceSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}


//LOGIN AS ADMIN
document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userDisplay = document.getElementById('userDisplay');

    if (loggedInUser) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userDisplay) {
            userDisplay.textContent = `Welcome, ${loggedInUser}`;
            userDisplay.style.display = 'inline-block';
        }
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block';
        if (userDisplay) userDisplay.style.display = 'none';
    }
});
function login(event) {
    event.preventDefault(); // Prevent the form from submitting and page refreshing

    const username = document.getElementById('signInUsername').value;
    const password = document.getElementById('signInPassword').value;

    if (username === 'admin' && password === 'admin') {
        // Set session variable for the logged-in user
        sessionStorage.setItem('loggedInUser', username);

        alert('You were logged in as admin');
        
        // Redirect admin to admin.html
        window.location.href = 'admin.html';
    } else {
        alert('Invalid username or password');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (loggedInUser) {
        // Update UI to show the logged-in username
        const userElement = document.getElementById('loggedInUser');
        if (userElement) {
            userElement.textContent = loggedInUser;
        }
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loggedInUser) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userDisplay) {
            userDisplay.textContent = `Welcome, ${loggedInUser}`;
            userDisplay.style.display = 'inline-block';
        }
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block';
        if (userDisplay) userDisplay.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
});

function logout() {
    // Remove the session variable for the logged-in user
    sessionStorage.removeItem('loggedInUser');
    
    // Redirect to the default page
    window.location.href = 'index.html'; // Change 'default.html' to the actual page you want to redirect to
}


//redirect to signup form
function redirectToLogin(event) {
    event.preventDefault(); // Prevent the form from submitting and page refreshing
    // Redirect to login.html
    window.location.href = 'login.html';
}

function redirectToSignup(event) {
    event.preventDefault();
    window.location.href = 'signup.html';
}


async function getWeather() {
    const cityInput = document.getElementById('cityInput').value;

    try {
        const response = await fetch(`/getWeather?city=${encodeURIComponent(cityInput)}`);
        const data = await response.json();

        // Display weather details in the weatherResult div or use a notification/alert
        document.getElementById('weatherResult').innerHTML = `
            <h3>Weather Details for ${data.location}</h3>
            <p>Temperature: ${data.temperature}°C</p>
            <p>Condition: ${data.condition}</p>
        `;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);

        // Display error message in the weatherResult div or use a notification/alert
        document.getElementById('weatherResult').innerHTML = '<p>Error fetching weather data</p>';
    }
}


