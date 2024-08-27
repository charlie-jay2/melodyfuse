document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#request-form");
    const popupOverlay = document.querySelector("#popup-overlay");
    const formResponse = document.querySelector("#form-response");

    // Function to get the user's IP address
    const getIpAddress = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const ipAddress = await getIpAddress();

        const name = formData.get('name');
        const song = formData.get('song');
        const anonymous = formData.get('anonymous');

        // Determine the color based on anonymity
        const color = anonymous === 'Yes' ? 0xFF0000 : 0x00FF00; // Red if anonymous, Green if not

        const payload = {
            content: "Please react with ✅ once played.",
            embeds: [
                {
                    title: name, // The title will be the user's name
                    color: color, // Embed color
                    fields: [
                        {
                            name: 'Requested Song:',
                            value: song
                        },
                        {
                            name: 'Anonymous',
                            value: anonymous
                        },
                        {
                            name: 'IP Address',
                            value: ipAddress || 'Unable to fetch IP address' // Add IP address to embed
                        }
                    ]
                }
            ]
        };

        // Use the provided webhook URL
        const webhookURL = 'https://discord.com/api/webhooks/1277386153166901268/f-75_e2DyLHAoCEgHacEmDelqclxVWINKBCRMCyt95EUs1XKbPBLugmBeYnXKKkBNt45';

        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                formResponse.textContent = 'Your request has been sent!';
                form.reset();
            } else {
                formResponse.textContent = 'There was an error sending your request. Please try again later.';
            }
        } catch (error) {
            formResponse.textContent = 'There was an error sending your request. Please try again later.';
        }

        // Handle popup overlay
        popupOverlay.style.opacity = 0;
        setTimeout(() => {
            popupOverlay.style.display = "none";
            formResponse.textContent = "";
            popupOverlay.style.opacity = 1;
        }, 500); // Match this duration with the fade-out duration
    };

    form.addEventListener("submit", handleSubmit);

    document.querySelector("#open-form-btn").addEventListener("click", () => {
        popupOverlay.style.display = "flex";
    });

    document.querySelector("#close-form-btn").addEventListener("click", () => {
        popupOverlay.style.opacity = 0;
        setTimeout(() => {
            popupOverlay.style.display = "none";
            form.reset();
            formResponse.textContent = "";
            popupOverlay.style.opacity = 1;
        }, 500); // Match this duration with the fade-out duration
    });

    document.getElementById('listen-live-btn').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent any default action (scrolling)
        const audioPlayer = document.querySelector('#audio-player audio');
        if (audioPlayer) {
            audioPlayer.play();
        }
    });
});
