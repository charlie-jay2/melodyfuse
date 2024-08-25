document.addEventListener('DOMContentLoaded', function () {
    const openFormBtn = document.getElementById('open-form-btn');
    const closeFormBtn = document.getElementById('close-form-btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const requestForm = document.getElementById('request-form');
    const formResponse = document.getElementById('form-response');

    // Open the popup
    openFormBtn.addEventListener('click', function () {
        popupOverlay.style.display = 'flex';
    });

    // Close the popup
    closeFormBtn.addEventListener('click', function () {
        popupOverlay.style.display = 'none';
    });

    // Handle form submission
    requestForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Show success message and hide form
        requestForm.style.display = 'none';
        formResponse.innerHTML = '<p>Form sent successfully!</p>';

        // Fade out the popup after 2 seconds
        setTimeout(function () {
            popupOverlay.style.opacity = '0';
            setTimeout(function () {
                popupOverlay.style.display = 'none';
                popupOverlay.style.opacity = '1'; // Reset opacity for future use
            }, 600); // Match this timeout with the CSS fade-out duration
        }, 2000);
    });
});
