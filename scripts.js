document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#request-form");
    const popupOverlay = document.querySelector("#popup-overlay");
    const formResponse = document.querySelector("#form-response");

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
            .then(() => {
                formResponse.textContent = "Form sent successfully";
                setTimeout(() => {
                    popupOverlay.style.opacity = 0;
                    setTimeout(() => {
                        popupOverlay.style.display = "none";
                        form.reset();
                        formResponse.textContent = "";
                        popupOverlay.style.opacity = 1;
                    }, 500); // Match this duration with the fade-out duration
                }, 2000);
            })
            .catch((error) => {
                formResponse.textContent = "There was an error sending the form.";
                console.error("Form submission error:", error);
            });
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
});

document.getElementById('listen-live-btn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent any default action (scrolling)
    const audioPlayer = document.querySelector('#audio-player audio');
    if (audioPlayer) {
        audioPlayer.play();
    }
});

document.getElementById('request-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Use the provided webhook URL
    const webhookURL = 'https://discord.com/api/webhooks/1277386153166901268/f-75_e2DyLHAoCEgHacEmDelqclxVWINKBCRMCyt95EUs1XKbPBLugmBeYnXKKkBNt45';

    const name = document.getElementById('name').value;
    const song = document.getElementById('song').value;
    const anonymous = document.getElementById('anonymous').value;

    // Determine the color based on anonymity
    const color = anonymous === 'Yes' ? 0xFF0000 : 0x00FF00; // Red if anonymous, Green if not

    const payload = {
        embeds: [
            {
                title: name, // The title will be the user's name
                color: color, // Embed color
                fields: [
                    {
                        name: 'Requested Song:',
                        value: song
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            document.getElementById('form-response').textContent = 'Your request has been sent!';
            document.getElementById('request-form').reset();
        } else {
            document.getElementById('form-response').textContent = 'There was an error sending your request. Please try again later.';
        }
    } catch (error) {
        document.getElementById('form-response').textContent = 'There was an error sending your request. Please try again later.';
    }
});
