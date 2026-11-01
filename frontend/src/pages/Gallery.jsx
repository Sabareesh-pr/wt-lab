function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&h=200&fit=crop",
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&h=200&fit=crop"
  ];

  return (
    <div className="page">
      <h1>Gallery</h1>
      <div className="gallery-grid">
        {images.map((src, index) => (
          <img key={index} src={src} alt="TechFest" />
        ))}
      </div>
    </div>
  );
}

export default Gallery;