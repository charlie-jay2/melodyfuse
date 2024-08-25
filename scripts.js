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
