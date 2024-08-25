// scripts.js
document.addEventListener('DOMContentLoaded', function () {
    const openFormBtn = document.getElementById('open-form-btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const closeFormBtn = document.getElementById('close-form-btn');
    const requestForm = document.getElementById('request-form');
    const formResponse = document.getElementById('form-response');

    openFormBtn.addEventListener('click', function () {
        popupOverlay.style.display = 'flex';
    });

    closeFormBtn.addEventListener('click', function () {
        popupOverlay.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });

    requestForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        const formData = new FormData(requestForm);
        const data = {};
        formData.forEach((value, key) => (data[key] = value));

        fetch('https://script.google.com/macros/s/AKfycbzp3nvveJdFWWSijPMY2IK-fc2qlli03QlFCceinXQQ1QBfmVZHeCjwMZ5XJemO1wI/exec', { // Replace with your Google Apps Script URL
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(data),
        })
            .then(response => response.text())
            .then(result => {
                formResponse.textContent = 'Your song request has been sent!';
                requestForm.reset();
                setTimeout(() => {
                    popupOverlay.style.display = 'none';
                }, 2000);
            })
            .catch(error => {
                formResponse.textContent = 'There was an error sending your request.';
            });
    });
});
