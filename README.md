# Bhuvaneswari Subramani - Personal Website

A modern, responsive personal website built with HTML, CSS, and JavaScript featuring a vibrant yellow-gray color palette and integrated blog feeds from Dev.to and Medium.

## 🎨 Design Features

- **Modern Yellow-Gray Color Palette**: Primary yellow (#FFDA44) and gray (#7D7D7D) with balanced usage
- **Responsive Design**: Mobile-first approach with smooth animations
- **Blog Integration**: Automatically fetches latest posts from Dev.to and Medium
- **Performance Optimized**: Lazy loading, smooth scrolling, and optimized assets
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bhuvana_site
   ```

2. **Update images**
   - Replace `images/photo.jpeg` with your profile photo
   - Add `images/favicon.png` for the site favicon

3. **Configure blog feeds**
   - Edit `blog-config.json` to update usernames and settings
   - The site will automatically fetch your latest posts

4. **Deploy to S3**
   - Upload all files to your S3 bucket
   - Enable static website hosting
   - Set `index.html` as the index document

## 📁 File Structure

```
bhuvana_site/
├── index.html              # Main HTML file
├── styles.css              # CSS styles with yellow-gray theme
├── script.js               # JavaScript functionality
├── blog-config.json        # Blog configuration (easy to update)
├── README.md              # This file
└── images/
    ├── photo.jpeg         # Profile photo
    └── favicon.png        # Site favicon
```

## ⚙️ Configuration

### Blog Settings

Edit `blog-config.json` to customize blog integration:

```json
{
  "maxPosts": 3,
  "sources": {
    "devto": {
      "username": "your-devto-username",
      "enabled": true
    },
    "medium": {
      "username": "your-medium-username",
      "enabled": true
    }
  }
}
```

### Color Customization

The color palette is defined in CSS variables at the top of `styles.css`:

```css
:root {
    --primary-yellow: #FFDA44;
    --primary-gray: #7D7D7D;
    --dark-gray: #4A4A4A;
    --light-gray: #F5F5F5;
    /* ... more colors */
}
```

### Content Updates

1. **Personal Information**: Update the hero section in `index.html`
2. **About Section**: Modify the about content and highlights
3. **Experience**: Update the timeline items with your work history
4. **Achievements**: Add or modify achievement cards
5. **Social Links**: Update social media URLs in the contact section

## 🌐 Blog Integration

The website automatically fetches and displays your latest blog posts from:

- **Dev.to**: Uses the public Dev.to API
- **Medium**: Uses RSS-to-JSON conversion for Medium feeds

### Features:
- Displays top 3 most recent posts
- Shows publication date, source, and reading time
- Fallback content if APIs are unavailable
- Configurable through `blog-config.json`

### Manual Blog Updates

If you prefer manual control, you can:

1. Disable automatic fetching by setting `enabled: false` in `blog-config.json`
2. Update the `fallbackPosts` array with your featured articles
3. The site will display your manually curated posts

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🚀 S3 Deployment

### Prerequisites
- AWS account with S3 access
- S3 bucket configured for static website hosting

### Deployment Steps

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-website-bucket-name
   ```

2. **Configure Static Website Hosting**
   ```bash
   aws s3 website s3://your-website-bucket-name \
     --index-document index.html \
     --error-document error.html
   ```

3. **Upload Files**
   ```bash
   aws s3 sync . s3://your-website-bucket-name --delete
   ```

4. **Set Bucket Policy** (for public access)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-website-bucket-name/*"
       }
     ]
   }
   ```

### CloudFront Distribution (Optional)

For better performance and HTTPS:

1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure custom domain and SSL certificate
4. Update DNS records

## 🔧 Customization Guide

### Adding New Sections

1. Add HTML structure in `index.html`
2. Add corresponding styles in `styles.css`
3. Update navigation menu
4. Add smooth scrolling support in `script.js`

### Modifying Colors

1. Update CSS variables in `:root` selector
2. Ensure proper contrast ratios for accessibility
3. Test on different devices and browsers

### Performance Optimization

The website includes several performance optimizations:
- Lazy loading for images
- Minified CSS and JavaScript (in production)
- Optimized font loading
- Efficient API calls with caching

## 🐛 Troubleshooting

### Blog Posts Not Loading

1. Check browser console for API errors
2. Verify usernames in `blog-config.json`
3. Ensure CORS is properly configured
4. Fallback posts will display if APIs fail

### Mobile Menu Issues

1. Ensure JavaScript is enabled
2. Check for console errors
3. Verify viewport meta tag is present

### Styling Issues

1. Clear browser cache
2. Check CSS file is loading properly
3. Verify all image paths are correct

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For questions or support, please reach out through:
- LinkedIn: [Bhuvaneswari Subramani](https://www.linkedin.com/in/bhuvanas/)
- Twitter: [@installjournal](https://twitter.com/installjournal)
- Dev.to: [bhuvanas](https://dev.to/bhuvanas)

---

Built with ❤️ using modern web technologies and a vibrant yellow-gray color palette that radiates positivity!
