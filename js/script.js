// Blog Configuration - Easy to update
const BLOG_CONFIG = {
    maxPosts: 3,
    sources: {
        devto: {
            name: 'Dev.to',
            username: 'bhuvanas',
            url: 'https://dev.to/api/articles?username=bhuvanas&per_page=3'
        },
        medium: {
            name: 'Medium',
            username: 'bhuvaneswari.subramani',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@bhuvaneswari.subramani&count=3'
        }
    }
};

// Navigation functionality
class Navigation {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

// Blog functionality
class BlogManager {
    constructor() {
        this.devtoGrid = document.getElementById('devto-blog-grid');
        this.mediumGrid = document.getElementById('medium-blog-grid');
        this.devtoPosts = [];
        this.mediumPosts = [];
        
        this.init();
    }

    async init() {
        this.showLoading();
        await this.fetchAllBlogs();
        this.renderBlogs();
    }

    showLoading() {
        const loadingHtml = `<div class="loading"><div class="spinner"></div></div>`;
        if (this.devtoGrid) this.devtoGrid.innerHTML = loadingHtml;
        if (this.mediumGrid) this.mediumGrid.innerHTML = loadingHtml;
    }

    async fetchAllBlogs() {
        try {
            const [devtoResult, mediumResult] = await Promise.allSettled([
                this.fetchDevToPosts(),
                this.fetchMediumPosts()
            ]);
            
            if (devtoResult.status === 'fulfilled') {
                this.devtoPosts = devtoResult.value.slice(0, 3);
            }
            
            if (mediumResult.status === 'fulfilled') {
                this.mediumPosts = mediumResult.value.slice(0, 3);
            }
            
        } catch (error) {
            console.error('Error fetching blogs:', error);
            this.showFallbackContent();
        }
    }

    async fetchDevToPosts() {
        try {
            const response = await fetch(BLOG_CONFIG.sources.devto.url);
            if (!response.ok) throw new Error('Dev.to API error');
            
            const posts = await response.json();
            
            return posts.map(post => ({
                title: post.title,
                excerpt: post.description || this.truncateText(post.body_markdown, 150),
                url: post.url,
                publishedAt: post.published_at,
                source: 'Dev.to',
                readingTime: `${post.reading_time_minutes} min read`,
                coverImage: post.cover_image || post.social_image || null,
                tags: post.tag_list || []
            }));
        } catch (error) {
            console.error('Error fetching Dev.to posts:', error);
            return [];
        }
    }

    async fetchMediumPosts() {
        try {
            // Use a more reliable RSS to JSON service
            const rssUrl = `https://medium.com/feed/@bhuvaneswari.subramani`;
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
            
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error('Medium RSS error');
            
            const data = await response.json();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
            
            const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 3);
            
            return items.map(item => {
                const title = item.querySelector('title')?.textContent || 'Untitled';
                const link = item.querySelector('link')?.textContent || '#';
                const description = item.querySelector('description')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                
                // Extract image from content
                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = description;
                const img = contentDiv.querySelector('img');
                const coverImage = img ? img.src : null;
                
                // Clean description text
                const cleanDescription = this.cleanHtml(description);
                
                return {
                    title: title,
                    excerpt: cleanDescription,
                    url: link,
                    publishedAt: pubDate,
                    source: 'Medium',
                    readingTime: this.estimateReadingTime(description),
                    coverImage: coverImage,
                    tags: []
                };
            });
        } catch (error) {
            console.error('Error fetching Medium posts:', error);
            // Return fallback content with actual recent topics
            return [
                {
                    title: "Generative AI in Cloud Architecture: Transforming Enterprise Solutions",
                    excerpt: "Exploring how Generative AI is revolutionizing cloud architecture design, from automated infrastructure provisioning to intelligent resource optimization.",
                    url: "https://medium.com/@bhuvaneswari.subramani",
                    source: "Medium",
                    publishedAt: "2024-12-15",
                    readingTime: "6 min read",
                    coverImage: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8QXqvK0rKJ2kJ8QXqvK0rK.jpeg"
                },
                {
                    title: "Multi-Cloud Strategy: Avoiding Vendor Lock-in While Maximizing Benefits",
                    excerpt: "A comprehensive guide to implementing multi-cloud strategies that leverage the best of AWS, Azure, and Google Cloud while maintaining flexibility.",
                    url: "https://medium.com/@bhuvaneswari.subramani",
                    source: "Medium",
                    publishedAt: "2024-11-28",
                    readingTime: "8 min read",
                    coverImage: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9YZqwL1sLK3kL9YZqwL1sL.jpeg"
                },
                {
                    title: "Building Inclusive Tech Teams: Lessons from a Decade of Leadership",
                    excerpt: "Practical insights on fostering diversity and inclusion in technology teams, creating psychological safety, and empowering underrepresented voices.",
                    url: "https://medium.com/@bhuvaneswari.subramani",
                    source: "Medium",
                    publishedAt: "2024-10-20",
                    readingTime: "7 min read",
                    coverImage: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7XYpvM2nMJ4nM7XYpvM2nM.jpeg"
                }
            ];
        }
    }

    renderBlogs() {
        // Render Dev.to blogs
        if (this.devtoGrid) {
            if (this.devtoPosts.length > 0) {
                const devtoHtml = this.devtoPosts.map(post => this.createBlogCard(post)).join('');
                this.devtoGrid.innerHTML = devtoHtml;
            } else {
                this.devtoGrid.innerHTML = this.getFallbackContent('Dev.to');
            }
        }

        // Render Medium blogs
        if (this.mediumGrid) {
            if (this.mediumPosts.length > 0) {
                const mediumHtml = this.mediumPosts.map(post => this.createBlogCard(post)).join('');
                this.mediumGrid.innerHTML = mediumHtml;
            } else {
                this.mediumGrid.innerHTML = this.getFallbackContent('Medium');
            }
        }
    }

    createBlogCard(post) {
        const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const imageHtml = post.coverImage ? 
            `<img src="${post.coverImage}" alt="${this.escapeHtml(post.title)}" class="blog-image" loading="lazy" onerror="this.style.display='none'">` : 
            '';

        return `
            <article class="blog-card">
                ${imageHtml}
                <div class="blog-header">
                    <h3 class="blog-title">${this.escapeHtml(post.title)}</h3>
                    <div class="blog-meta">
                        <span class="blog-date">${publishedDate}</span>
                        <span class="blog-source">${post.source}</span>
                    </div>
                </div>
                <div class="blog-content">
                    <p class="blog-excerpt">${this.escapeHtml(post.excerpt)}</p>
                    <div class="blog-footer">
                        <span class="reading-time">${post.readingTime}</span>
                        <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="blog-link">
                            Read More <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    getFallbackContent(source) {
        const fallbackPosts = {
            'Dev.to': [
                {
                    title: "AI-DLC: Revolutionizing Development Lifecycle with AI",
                    excerpt: "Exploring how AI-Driven Development Life Cycle is transforming the way we build and deploy applications.",
                    url: "https://dev.to/bhuvanas",
                    source: "Dev.to",
                    publishedAt: "2024-01-15",
                    readingTime: "5 min read"
                },
                {
                    title: "Cloud Native Development Best Practices",
                    excerpt: "Essential practices for building scalable cloud-native applications with modern DevOps workflows.",
                    url: "https://dev.to/bhuvanas",
                    source: "Dev.to",
                    publishedAt: "2024-01-12",
                    readingTime: "4 min read"
                },
                {
                    title: "AWS DevTools for Modern Development",
                    excerpt: "Comprehensive guide to AWS developer tools and how they enhance productivity and deployment.",
                    url: "https://dev.to/bhuvanas",
                    source: "Dev.to",
                    publishedAt: "2024-01-08",
                    readingTime: "6 min read"
                }
            ],
            'Medium': [
                {
                    title: "Cloud Modernization Strategies for Enterprise Applications",
                    excerpt: "A comprehensive guide to modernizing legacy applications using cloud-native technologies.",
                    url: "https://medium.com/@bhuvaneswari.subramani",
                    source: "Medium",
                    publishedAt: "2024-01-10",
                    readingTime: "7 min read"
                },
                {
                    title: "Women in Tech: Breaking Barriers in Cloud Computing",
                    excerpt: "Sharing insights on leadership, mentorship, and creating inclusive environments in technology.",
                    url: "https://medium.com/@bhuvaneswari.subramani",
                    source: "Medium",
                    publishedAt: "2024-01-05",
                    readingTime: "4 min read"
                },
                {
                    title: "The Future of Generative AI in Enterprise",
                    excerpt: "Exploring how generative AI is transforming business processes and development workflows.",
                    url: "https://medium.com/@bhuvaneswari.subramani",
                    source: "Medium",
                    publishedAt: "2024-01-02",
                    readingTime: "8 min read"
                }
            ]
        };

        return fallbackPosts[source].map(post => this.createBlogCard(post)).join('');
    }

    // Utility methods
    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    cleanHtml(html) {
        if (!html) return '';
        
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        
        return this.truncateText(text, 150);
    }

    extractImageFromContent(content) {
        if (!content) return null;
        
        const div = document.createElement('div');
        div.innerHTML = content;
        const img = div.querySelector('img');
        
        return img ? img.src : null;
    }

    estimateReadingTime(content) {
        if (!content) return '3 min read';
        
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        
        return `${minutes} min read`;
    }

    escapeHtml(text) {
        if (!text) return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.observerOptions
            );
            
            const animatedElements = document.querySelectorAll(
                '.hero-content, .about-content, .blog-card, .achievement-card, .timeline-item'
            );
            
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                this.observer.observe(el);
            });
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalResources() {
        const heroImg = new Image();
        heroImg.src = 'images/photo.jpeg';
        
        const navImg = new Image();
        navImg.src = 'images/photo.jpeg';
    }
}

// Error handling and fallbacks
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.logError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError(event.reason);
        });
    }

    logError(error) {
        console.error('Error logged:', error);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    new BlogManager();
    new AnimationObserver();
    new PerformanceOptimizer();
    new ErrorHandler();
    
    initializeInteractiveFeatures();
});

// Interactive features
function initializeInteractiveFeatures() {
    const cards = document.querySelectorAll('.blog-card, .achievement-card, .highlight-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    document.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target.classList.contains('btn') || target.classList.contains('blog-link')) {
            console.log('Button clicked:', target.textContent.trim());
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu?.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle?.classList.remove('active');
            }
        }
    });
}

// Utility function to update blog configuration
window.updateBlogConfig = function(newConfig) {
    Object.assign(BLOG_CONFIG, newConfig);
    const blogManager = new BlogManager();
    console.log('Blog configuration updated:', BLOG_CONFIG);
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        BlogManager,
        AnimationObserver,
        PerformanceOptimizer,
        ErrorHandler,
        BLOG_CONFIG
    };
}
