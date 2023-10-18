document.getElementById('getEvents').addEventListener('click', function() {
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    loadingBar.style.display = 'none'; // Ensuring the bar is not visible initially
    loadingPercentage.style.visibility = 'hidden';

    let loadProgress = 0;

    loadingBar.style.display = 'block'; // Making the bar visible during loading
    loadingPercentage.style.visibility = 'visible';

    const fakeLoading = setInterval(function() {
        if (loadProgress < 100) {
            loadProgress++;
            loadingBar.style.width = loadProgress + '%';
            loadingPercentage.innerText = loadProgress + '%';
        } else {
            clearInterval(fakeLoading);
        }
    }, 30);

    fetch('/get-events')
        .then(response => response.json())
        .then(events => {
            const videoElement = document.getElementById('currentVideo');
            const prevVideoButton = document.getElementById('prevVideo');
            const nextVideoButton = document.getElementById('nextVideo');
            const videoCounter = document.getElementById('videoCounter');
            const triggerNameLabel = document.getElementById('triggerNameLabel');
            const deviceLabel = document.getElementById('deviceLabel');
            let currentVideoIndex = 0;

            // New function to update the video source, counter, and labels
            function updateVideoPlayer() {
                videoElement.src = events[currentVideoIndex].url;
                videoCounter.textContent = `${currentVideoIndex + 1} of ${events.length}`; // Updating the counter display
                prevVideoButton.style.display = currentVideoIndex === 0 ? 'none' : 'block';
                nextVideoButton.style.display = currentVideoIndex === events.length - 1 ? 'none' : 'block';

                // Check if the labels are currently hidden
                if (triggerNameLabel.classList.contains('hidden')) {
                    triggerNameLabel.classList.remove('hidden'); // Ensure the labels are visible
                }
                if (deviceLabel.classList.contains('hidden')) {
                    deviceLabel.classList.remove('hidden'); // Ensure the labels are visible
                }

                // Update triggerName and deviceLabel elements with corresponding values
                triggerNameLabel.textContent = `Trigger Name: ${events[currentVideoIndex].triggerName}`;
                deviceLabel.textContent = `Device Label: ${events[currentVideoIndex].deviceLabel}`;
            }

            // Initially load the first video
            updateVideoPlayer();

            videoElement.onplay = () => {
                videoCounter.classList.remove('hidden'); // Ensure the counter is visible when the video is playing
            };

            nextVideoButton.addEventListener('click', () => {
                if (currentVideoIndex < events.length - 1) {
                    currentVideoIndex++;
                    updateVideoPlayer();
                }
            });

            prevVideoButton.addEventListener('click', () => {
                if (currentVideoIndex > 0) {
                    currentVideoIndex--;
                    updateVideoPlayer();
                }
            });
        })
        .catch(console.error)
        .finally(() => {
            setTimeout(() => {
                loadingBar.style.display = 'none';  // Hiding the bar after loading is done
                loadingPercentage.style.visibility = 'hidden';
            }, 500);
        });
});
