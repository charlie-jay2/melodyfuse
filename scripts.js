document.addEventListener('DOMContentLoaded', function () {
    const openFormBtn = document.getElementById('open-form-btn');
    const closeFormBtn = document.getElementById('close-form-btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const requestForm = document.getElementById('request-form');
    const formResponse = document.getElementById('form-response');
    const listenLiveBtn = document.getElementById('listen-live-btn');
    const audioPlayer = document.querySelector('.audio-player-container audio');

    // Open the popup
    openFormBtn.addEventListener('click', function () {
        popupOverlay.style.display = 'flex';
        requestForm.style.display = 'block'; // Ensure the form is visible
        formResponse.innerHTML = ''; // Clear any previous response message
    });

    // Close the popup
    closeFormBtn.addEventListener('click', function () {
        // Reset the form and response message
        requestForm.reset();
        formResponse.innerHTML = '';

        // Fade out the popup
        popupOverlay.style.opacity = '0';
        setTimeout(function () {
            popupOverlay.style.display = 'none';
            popupOverlay.style.opacity = '1'; // Reset opacity for future use
        }, 600); // Match this timeout with the CSS fade-out duration
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
                requestForm.style.display = 'block'; // Reset form visibility for next time
            }, 600); // Match this timeout with the CSS fade-out duration
        }, 2000);
    });

    // Handle Listen Live button click
    listenLiveBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default anchor behavior

        // Play the audio
        if (audioPlayer.paused) {
            audioPlayer.play();
            listenLiveBtn.textContent = 'Pause Live'; // Change button text to indicate playback
        } else {
            audioPlayer.pause();
            listenLiveBtn.textContent = 'Listen Live'; // Change button text to indicate paused state
        }
    });
});
