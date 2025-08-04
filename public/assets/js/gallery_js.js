// gallery.js
class GalleryLightbox {
    constructor() {
        this.currentIndex = 0;
        this.galleryItems = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.setupGalleryItems();
    }

    cacheDOMElements() {
        // Lightbox elements
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxTitle = document.getElementById('lightboxTitle');
        this.lightboxDescription = document.getElementById('lightboxDescription');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');
        this.currentImageSpan = document.getElementById('currentImage');
        this.totalImagesSpan = document.getElementById('totalImages');

        // Gallery elements
        this.galleryGrid = document.getElementById('galleryGrid');
    }

    setupGalleryItems() {
        const items = this.galleryGrid.querySelectorAll('.gallery-item');
        this.galleryItems = Array.from(items).map((item, index) => {
            const img = item.querySelector('img');
            const brandName = item.dataset.brand || '';
            const description = item.dataset.description || '';
            const overlay = item.querySelector('.gallery-overlay');
            const overlayTitle = overlay ? overlay.querySelector('h3')?.textContent || brandName : brandName;
            const overlayDesc = overlay ? overlay.querySelector('p')?.textContent || description : description;

            return {
                element: item,
                src: img.src,
                alt: img.alt,
                title: overlayTitle,
                description: overlayDesc,
                index: index
            };
        });

        // Update total images counter
        if (this.totalImagesSpan) {
            this.totalImagesSpan.textContent = this.galleryItems.length;
        }
    }

    bindEvents() {
        // Gallery item clicks
        if (this.galleryGrid) {
            this.galleryGrid.addEventListener('click', (e) => {
                const galleryItem = e.target.closest('.gallery-item');
                if (galleryItem) {
                    const index = Array.from(this.galleryGrid.querySelectorAll('.gallery-item')).indexOf(galleryItem);
                    this.openLightbox(index);
                }
            });
        }

        // Lightbox controls
        if (this.lightboxClose) {
            this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        }

        if (this.lightboxPrev) {
            this.lightboxPrev.addEventListener('click', () => this.prevImage());
        }

        if (this.lightboxNext) {
            this.lightboxNext.addEventListener('click', () => this.nextImage());
        }

        // Lightbox background click to close
        if (this.lightbox) {
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextImage();
                    break;
            }
        });

        // Touch/swipe support for mobile
        this.addTouchSupport();

        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.isOpen) {
                this.updateLightboxImage();
            }
        });
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        if (this.lightbox) {
            this.lightbox.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });

            this.lightbox.addEventListener('touchmove', (e) => {
                if (e.touches.length > 1) return; // Ignore multi-touch
                e.preventDefault(); // Prevent scrolling
            }, { passive: false });

            this.lightbox.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;

                const deltaX = endX - startX;
                const deltaY = endY - startY;
                const minSwipeDistance = 50;

                // Horizontal swipe detection
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        this.prevImage(); // Swipe right = previous
                    } else {
                        this.nextImage(); // Swipe left = next
                    }
                }
            }, { passive: true });
        }
    }

    openLightbox(index) {
        if (index < 0 || index >= this.galleryItems.length) return;

        this.currentIndex = index;
        this.isOpen = true;

        if (this.lightbox) {
            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        this.updateLightboxImage();
        this.updateNavigationButtons();
        this.updateCounter();

        // Focus management for accessibility
        if (this.lightboxClose) {
            this.lightboxClose.focus();
        }
    }

    closeLightbox() {
        this.isOpen = false;

        if (this.lightbox) {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Return focus to the gallery item that was clicked
        const currentItem = this.galleryItems[this.currentIndex];
        if (currentItem && currentItem.element) {
            currentItem.element.focus();
        }
    }

    prevImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateLightboxImage();
            this.updateNavigationButtons();
            this.updateCounter();
        }
    }

    nextImage() {
        if (this.currentIndex < this.galleryItems.length - 1) {
            this.currentIndex++;
            this.updateLightboxImage();
            this.updateNavigationButtons();
            this.updateCounter();
        }
    }

    updateLightboxImage() {
        const currentItem = this.galleryItems[this.currentIndex];
        if (!currentItem) return;

        if (this.lightboxImage) {
            // Add loading state
            this.lightboxImage.style.opacity = '0.5';
            
            // Create a new image to preload
            const img = new Image();
            img.onload = () => {
                this.lightboxImage.src = currentItem.src;
                this.lightboxImage.alt = currentItem.alt;
                this.lightboxImage.style.opacity = '1';
            };
            img.onerror = () => {
                // Handle image load error
                this.lightboxImage.style.opacity = '1';
                console.error('Failed to load image:', currentItem.src);
            };
            img.src = currentItem.src;
        }

        if (this.lightboxTitle) {
            this.lightboxTitle.textContent = currentItem.title;
        }

        if (this.lightboxDescription) {
            this.lightboxDescription.textContent = currentItem.description;
        }
    }

    updateNavigationButtons() {
        if (this.lightboxPrev) {
            this.lightboxPrev.disabled = this.currentIndex === 0;
        }

        if (this.lightboxNext) {
            this.lightboxNext.disabled = this.currentIndex === this.galleryItems.length - 1;
        }
    }

    updateCounter() {
        if (this.currentImageSpan) {
            this.currentImageSpan.textContent = this.currentIndex + 1;
        }
    }

    // Method to refresh gallery items (useful if content is dynamically loaded)
    refresh() {
        this.setupGalleryItems();
    }

    // Method to preload images for better performance
    preloadImages() {
        this.galleryItems.forEach((item, index) => {
            // Preload next few images
            if (index <= this.currentIndex + 2) {
                const img = new Image();
                img.src = item.src;
            }
        });
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new GalleryLightbox();
    
    // Make gallery instance globally available if needed
    window.galleryInstance = gallery;
});

// Handle image loading errors gracefully
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.background = '#f0f0f0';
        e.target.style.display = 'flex';
        e.target.style.alignItems = 'center';
        e.target.style.justifyContent = 'center';
        e.target.alt = 'Image failed to load';
    }
}, true);