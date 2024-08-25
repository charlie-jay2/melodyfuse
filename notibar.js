const notibarConfig = {
    backgroundColor: '#3c3c3c', // Background color of the notification bar
    textColor: '#fff', // Text color of the notification bar
    text: 'Requesting a song is temporarily unavailable. We do apologise for the inconvenience.', // The text to display
    pulse: false, // Whether the text should pulse
    pulseColor: 'grey', // Color of the pulsing text
    pulseSpeed: '2s', // Speed of the pulse animation
};

// Create and style the notification bar
const createNotibar = () => {
    const notibar = document.querySelector('.notibar');

    if (notibar) {
        notibar.style.position = 'relative';
        notibar.style.backgroundColor = notibarConfig.backgroundColor;
        notibar.style.color = notibarConfig.textColor;
        notibar.style.textAlign = 'center';
        notibar.style.padding = '10px';
        notibar.style.zIndex = '1000';
        notibar.style.fontSize = '18px';
        notibar.style.fontWeight = 'medium';
        notibar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        notibar.textContent = notibarConfig.text;

        if (notibarConfig.pulse) {
            notibar.style.animation = `pulse ${notibarConfig.pulseSpeed} infinite`;
            const style = document.createElement('style');
            style.textContent = `
          @keyframes pulse {
            0% {
              color: ${notibarConfig.textColor};
            }
            50% {
              color: ${notibarConfig.pulseColor};
            }
            100% {
              color: ${notibarConfig.textColor};
            }
          }
        `;
            document.head.appendChild(style);
        }
    }
};

// Execute the function to create the notification bar
document.addEventListener('DOMContentLoaded', createNotibar);
