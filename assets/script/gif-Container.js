let offset = 0; // To keep track of the current offset for pagination
const limit = 100; // Number of GIFs to fetch per request
let isLoading = false; // Flag to indicate if data is currently being fetched
let lastTap = 0; // To keep track of the last tap time for double-tap detection

// Function to search for GIFs based on user input
async function searchGIFs() {
    const apiKey = 'Xo2urzYWAUkteQgP3DSaBETIxnuBuZlF'; // Giphy API key
    const query = document.getElementById('gifSearch').value; // User search query
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=${limit}&offset=${offset}`; // API URL with parameters

    isLoading = true; // Set loading flag to true
    const response = await fetch(url); // Fetch data from Giphy API
    const data = await response.json(); // Parse JSON response
    isLoading = false; // Set loading flag to false

    const gifContainer = document.getElementById('gifContainer'); // Get container to display GIFs
    gifContainer.innerHTML = ''; // Clear previous results

    if (data.data.length > 0) {
        // If there are GIFs in the response
        data.data.forEach(gif => {
            const img = document.createElement('img'); // Create an image element for each GIF
            img.src = gif.images.fixed_height.url; // Set the GIF source URL
            img.style.cursor = 'pointer'; // Change cursor to pointer for clickable images
            img.addEventListener('click', function () {
                displayPreview(gif.images.fixed_height.url, 'image/gif', 'GIF'); // Display preview on click
            });
            img.addEventListener('touchend', function (event) {
                handleDoubleTap(event, gif.images.fixed_height.url); // Handle double-tap on touch devices
            });
            gifContainer.appendChild(img); // Append the image to the container
        });

        // Add "Load More" button at the end
        const loadMoreBtn = document.createElement('div');
        loadMoreBtn.className = 'load-more-btn'; // CSS class for styling
        loadMoreBtn.id = 'loadMoreBtn'; // ID for the button
        loadMoreBtn.textContent = 'Load More'; // Button text
        loadMoreBtn.onclick = loadMoreGIFs; // Function to call on click
        gifContainer.appendChild(loadMoreBtn); // Append the button to the container
    }
}

// Function to load more GIFs when "Load More" button is clicked
async function loadMoreGIFs() {
    if (isLoading) return; // Prevent multiple requests if already loading

    const apiKey = 'Xo2urzYWAUkteQgP3DSaBETIxnuBuZlF'; // Giphy API key
    const query = document.getElementById('gifSearch').value; // User search query
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=${limit}&offset=${offset}`; // API URL with parameters

    isLoading = true; // Set loading flag to true
    const response = await fetch(url); // Fetch data from Giphy API
    const data = await response.json(); // Parse JSON response
    isLoading = false; // Set loading flag to false

    const gifContainer = document.getElementById('gifContainer'); // Get container to display GIFs

    if (data.data.length > 0) {
        // If there are more GIFs in the response
        data.data.forEach(gif => {
            const img = document.createElement('img'); // Create an image element for each GIF
            img.src = gif.images.fixed_height.url; // Set the GIF source URL
            img.style.cursor = 'pointer'; // Change cursor to pointer for clickable images
            img.addEventListener('click', function () {
                displayPreview(gif.images.fixed_height.url, 'image/gif', 'GIF'); // Display preview on click
            });
            img.addEventListener('touchend', function (event) {
                handleDoubleTap(event, gif.images.fixed_height.url); // Handle double-tap on touch devices
            });
            gifContainer.insertBefore(img, gifContainer.querySelector('.load-more-btn')); // Insert image before the "Load More" button
        });

        // Update offset for pagination
        offset += limit;
    } else {
        // Remove the "Load More" button if no more results
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.remove();
        }
    }
}

// Function to handle double-tap on touch devices
function handleDoubleTap(event, src) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
        // Double-tap detected
        event.preventDefault();
        displayPreview(src, 'image/gif', 'GIF'); // Display preview on double-tap
    }
    lastTap = currentTime; // Update last tap time
}

// Function to display a preview of the selected media
function displayPreview(src, type, name) {
    let previewContainer = document.getElementById('previewContainer'); // Get preview container

    // Create media element
    let mediaElement;

    if (type.startsWith('image/')) {
        mediaElement = document.createElement('img'); // Create image element for images
        mediaElement.src = src; // Set image source URL
        mediaElement.alt = name; // Set the alt text
    } else if (type.startsWith('video/')) {
        mediaElement = document.createElement('video'); // Create video element for videos
        mediaElement.src = src; // Set video source URL
        mediaElement.controls = true; // Add controls to the video
        mediaElement.width = 200; // Adjust width as needed
    } else if (type.startsWith('audio/')) {
        mediaElement = document.createElement('audio'); // Create audio element for audio files
        mediaElement.src = src; // Set audio source URL
        mediaElement.controls = true; // Add controls to the audio
    } else {
        mediaElement = document.createElement('iframe'); // Create iframe element for other types
        mediaElement.src = src; // Set iframe source URL
        mediaElement.width = '100%'; // Set width to 100%
        mediaElement.height = '200px'; // Adjust height as needed
    }

    mediaElement.className = 'preview-cont-disp'; // Add the class for styling
    mediaElement.addEventListener('click', function () {
        this.remove(); // Remove the preview on click
    });

    previewContainer.appendChild(mediaElement); // Append the media element to the preview container
    previewContainer.style.display = 'flex'; // Show the preview container
}

// Resizing and Draggable Part
document.addEventListener('DOMContentLoaded', function () {
    const giphy = document.querySelector('.giphy');
    const control = document.querySelector('.Controll');
    const searchIframe = document.querySelector('.search-iframe');
    const previewContainer = document.querySelector('.preview-container');
    const inputField = document.querySelector('.search-iframe input[type="text"]');
    const searchButton = document.querySelector('.search-iframe button');
    const closeIcon = document.querySelector('.close-icon');
    const gifMinIcon = document.querySelector('.gif-min');
    const lockIcon = document.querySelector('.lock-icon');
    const resetIcon = document.querySelector('.reset-icon');
    const resizeAreaSize = 10; // Size of the resizing area in pixels

    let isDraggable = false;
    let isResizable = false;

    function adjustSizes() {
        const giphyHeight = giphy.clientHeight;
        const giphyWidth = giphy.clientWidth;

        control.style.height = `${giphyHeight * 0.05}px`;
        searchIframe.style.height = `${giphyHeight * 0.56}px`;
        previewContainer.style.height = `${giphyHeight * 0.25}px`;

        control.style.width = `${giphyWidth * 0.94}px`;
        searchIframe.style.width = `${giphyWidth * 0.90}px`;
        previewContainer.style.width = `${giphyWidth * 0.90}px`;

        // Adjust icon and button sizes based on the giphy container size
        const iconSize = giphyHeight * 0.03; // Example ratio for icon size
        closeIcon.style.fontSize = `${iconSize}px`;
        gifMinIcon.style.fontSize = `${iconSize}px`;
        lockIcon.style.fontSize = `${iconSize}px`;
        resetIcon.style.fontSize = `${iconSize}px`;

        // Adjust input and button sizes proportionally
        inputField.style.fontSize = `${iconSize * 0.6}px`;
        searchButton.style.fontSize = `${iconSize * 0.6}px`;
        searchButton.style.padding = `${iconSize * 0.3}px ${iconSize * 0.6}px`;
    }

    function makeResizableDiv() {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer');
        resizer.style.width = `${resizeAreaSize}px`;
        resizer.style.height = `${resizeAreaSize}px`;
        resizer.style.background = '#000';
        resizer.style.position = 'absolute';
        resizer.style.right = '0';
        resizer.style.bottom = '0';
        resizer.style.cursor = 'nwse-resize';
        giphy.appendChild(resizer);

        function startResize(e) {
            if (!isResizable) return; // Disable resizing if not enabled
            e.preventDefault();
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);

            window.addEventListener('touchmove', resize);
            window.addEventListener('touchend', stopResize);
        }

        function resize(e) {
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            const giphyRect = giphy.getBoundingClientRect();
            const newWidth = clientX - giphyRect.left;
            const newHeight = clientY - giphyRect.top;

            // Ensure the width and height are positive
            if (newWidth > resizeAreaSize && newHeight > resizeAreaSize) { // minimum size check
                giphy.style.width = `${newWidth}px`;
                giphy.style.height = `${newHeight}px`;
                adjustSizes();
            }
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResize);
            window.removeEventListener('touchmove', resize);
            window.removeEventListener('touchend', stopResize);
        }

        resizer.addEventListener('mousedown', startResize);
        resizer.addEventListener('touchstart', startResize);
    }

    function makeDraggable() {
        let offsetX, offsetY;

        function startDrag(e) {
            if (!isDraggable) return; // Disable dragging if not enabled
            // Check if the mousedown or touchstart event is inside the resizer area
            if (e.target.classList.contains('resizer')) return;

            offsetX = e.clientX || e.touches[0].clientX - giphy.getBoundingClientRect().left;
            offsetY = e.clientY || e.touches[0].clientY - giphy.getBoundingClientRect().top;

            window.addEventListener('mousemove', drag);
            window.addEventListener('mouseup', stopDrag);
            window.addEventListener('touchmove', drag);
            window.addEventListener('touchend', stopDrag);
        }

        function drag(e) {
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            giphy.style.left = `${clientX - offsetX}px`;
            giphy.style.top = `${clientY - offsetY}px`;
            giphy.style.position = 'absolute';
        }

        function stopDrag() {
            window.removeEventListener('mousemove', drag);
            window.removeEventListener('mouseup', stopDrag);
            window.removeEventListener('touchmove', drag);
            window.removeEventListener('touchend', stopDrag);
        }

        giphy.addEventListener('mousedown', startDrag);
        giphy.addEventListener('touchstart', startDrag);
    }

    function toggleDragResize() {
        isDraggable = !isDraggable;
        isResizable = !isResizable;
        lockIcon.classList.toggle('fa-lock');
        lockIcon.classList.toggle('fa-unlock');
    }

    lockIcon.addEventListener('click', toggleDragResize);

    // Initialize default state
    isDraggable = false;
    isResizable = false;
    lockIcon.classList.remove('fa-lock');
    lockIcon.classList.add('fa-unlock');

    makeResizableDiv();
    makeDraggable();
    adjustSizes();

    // Adjust sizes on load and resize
    window.addEventListener('load', adjustSizes);
    window.addEventListener('resize', adjustSizes);
});

//toggle giphy Container
document.addEventListener('DOMContentLoaded', function () {
    // Get references to the media button and containers
    const mediaButton = document.querySelector('.media-img');
    const fileContainer = document.getElementById('fileContainer');
    const giphyContainer = document.querySelector('.giphy');
    const control = document.querySelector('.Controll');
    const searchIframe = document.querySelector('.search-iframe');
    const previewContainer = document.querySelector('.preview-container');
    
    // Get references to the icons
    const closeIcon = document.querySelector('.close-icon');
    const gifMinIcon = document.querySelector('.gif-min');
    const lockIcon = document.querySelector('.lock-icon');
    const resetIcon = document.querySelector('.reset-icon');

    // Function to adjust sizes based on the .giphy container
    function adjustSizes() {
        const giphyHeight = giphyContainer.clientHeight;
        const giphyWidth = giphyContainer.clientWidth;

        // Adjust sizes for the .Controll, .search-iframe, and .preview-container
        control.style.height = `${giphyHeight * 0.05}px`;
        control.style.width = `${giphyWidth * 0.94}px`;

        searchIframe.style.height = `${giphyHeight * 0.56}px`;
        searchIframe.style.width = `${giphyWidth * 0.90}px`;

        previewContainer.style.height = `${giphyHeight * 0.25}px`;
        previewContainer.style.width = `${giphyWidth * 0.90}px`;

        // Adjust icon sizes based on the .giphy container size
        const iconSize = giphyHeight * 0.03; // Example ratio for icon size
        closeIcon.style.fontSize = `${iconSize}px`;
        gifMinIcon.style.fontSize = `${iconSize}px`;
        lockIcon.style.fontSize = `${iconSize}px`;
        resetIcon.style.fontSize = `${iconSize}px`;

        // Adjust input and button sizes proportionally
        const inputField = document.querySelector('.search-iframe input[type="text"]');
        const searchButton = document.querySelector('.search-iframe button');

        inputField.style.fontSize = `${iconSize * 0.6}px`;
        searchButton.style.fontSize = `${iconSize * 0.6}px`;
        searchButton.style.padding = `${iconSize * 0.3}px ${iconSize * 0.6}px`;
    }

    // Function to toggle visibility of containers and apply CSS styles
    function toggleContainers() {
        fileContainer.style.display = 'none'; // Hide the file container
        giphyContainer.style.display = 'block'; // Show the giphy container

        // Apply CSS styles for the giphy container's children
        adjustSizes(); // Call adjustSizes to apply ratio-based sizes
    }

    // Add click event listener to the media button
    mediaButton.addEventListener('click', toggleContainers);
});


//toggle of giphy
//#Close
document.addEventListener('DOMContentLoaded', function () {
    // Get references to the elements
    const closeIcon = document.querySelector('.close-icon');
    const giphyContainer = document.querySelector('.giphy');
    const gifContainer = document.getElementById('gifContainer');
    const previewContainer = document.getElementById('previewContainer');
    const gifSearchInput = document.getElementById('gifSearch');
    
    // Function to handle close icon click
    function handleCloseIconClick() {
        giphyContainer.style.display = 'none'; // Hide the Giphy container
        gifContainer.innerHTML = ''; // Clear the loaded GIFs from the search iframe
        previewContainer.innerHTML = ''; // Clear the preview container
        gifSearchInput.value = ''; // Clear the input field text
    }
    
    // Add click event listener to the close icon
    closeIcon.addEventListener('click', handleCloseIconClick);
});
//#Minimize
document.addEventListener('DOMContentLoaded', function () {
    // Get reference to the minus icon
    const minusIcon = document.querySelector('.gif-min');
    const giphyContainer = document.querySelector('.giphy');
    
    // Function to handle minus icon click
    function handleMinusIconClick() {
        giphyContainer.style.display = 'none'; // Hide the Giphy container
    }
    
    // Add click event listener to the minus icon
    minusIcon.addEventListener('click', handleMinusIconClick);
});

//Reset of giphy
document.addEventListener('DOMContentLoaded', function () {
    const resetIcon = document.querySelector('.reset-icon');
    const giphyContainer = document.querySelector('.giphy');
    const lockIcon = document.querySelector('.lock-icon');

    function resetGiphyContainer() {
        // Reset the Giphy container's styles
        giphyContainer.style.top = '10px';
        giphyContainer.style.width = '37%';
        giphyContainer.style.height = '96%';

        // Reset the styles for the inner elements
        const searchIframe = document.querySelector('.search-iframe');
        const previewContainer = document.querySelector('.preview-container');
        const inputField = searchIframe.querySelector('input[type="text"]');
        const searchButton = searchIframe.querySelector('button');
        const controllDiv = document.querySelector('.Controll');

        // Reset styles for search iframe
        searchIframe.style.top = '1%';
        searchIframe.style.left = '3%';
        searchIframe.style.width = '90%';
        searchIframe.style.height = '56%';

        // Reset styles for preview container
        previewContainer.style.top = '3%';
        previewContainer.style.left = '3%';
        previewContainer.style.width = '90%';
        previewContainer.style.height = '25%';

        // Reset styles for input field
        inputField.style.width = '70%';
        inputField.style.top = '10px';
        inputField.style.left = '10px';

        // Reset styles for search button
        searchButton.style.top = '10px';
        searchButton.style.right = '10px';
        searchButton.style.marginLeft = '7%';

        // Reset styles for Controll div
        controllDiv.style.marginTop = '2%';
        controllDiv.style.marginLeft = '3%';
        controllDiv.style.width = '93%';
        controllDiv.style.height = '5%';

        // Reset font-awesome icons and other elements if needed
        const icons = document.querySelectorAll('.close-icon, .gif-min, .lock-icon');
        icons.forEach(icon => {
            icon.style.fontSize = '20px';
        });

        // Lock the Giphy container (disable resizing and dragging)
        giphyContainer.classList.remove('resizable');
        giphyContainer.classList.remove('draggable');
        
        // Reset the icon to fa-unlock
        lockIcon.classList.remove('fa-lock');
        lockIcon.classList.add('fa-unlock');

        // Mobile view reset
        if (window.innerWidth <= 768) {
            giphyContainer.style.width = '90%';
            giphyContainer.style.height = '600px';
            giphyContainer.style.top = '5px';

            searchIframe.style.width = '90%';
            searchIframe.style.height = '52%';
            searchIframe.style.top = '1%';
            searchIframe.style.left = '2%';

            inputField.style.width = '65%';
            inputField.style.left = '5%';

            searchButton.style.right = '5%';
            searchButton.style.marginLeft = '8%';

            previewContainer.style.width = '90%';
            previewContainer.style.height = '28%';
            previewContainer.style.top = '3%';
            previewContainer.style.left = '2%';

            inputField.style.width = '65%';
            searchButton.style.right = '5%';

            const previewItems = document.querySelectorAll('.preview-cont-disp');
            previewItems.forEach(item => {
                item.style.minHeight = '100px';
            });

            controllDiv.style.width = '94%';

            const closeIcon = document.querySelector('.close-icon');
            closeIcon.style.fontSize = '15px';
            closeIcon.style.top = '2.5%';
            closeIcon.style.right = '5%';

            const gifMin = document.querySelector('.gif-min');
            gifMin.style.fontSize = '15px';
            gifMin.style.top = '2.5%';
            gifMin.style.right = '10%';
        }
    }

    // Add click event listener to the reset icon
    resetIcon.addEventListener('click', resetGiphyContainer);
});
