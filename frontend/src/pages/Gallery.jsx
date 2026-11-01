import {useRef, useState} from 'react';

const images = Array.from({length: 7}, (_, index) => `/media/gallery-${index + 1}.webp`);

export default function Gallery() {
  const [selected, setSelected] = useState(0);
  const dialog = useRef(null);
  const move = (step) => setSelected(current => (current + step + images.length) % images.length);

  return (
    <main className="page gallery-page">
      <h1>Gallery</h1>
      <p>A glimpse of campus life and celebrations.</p>
      <div className="gallery-grid">
        {images.map((src, index) => (
          <button className="gallery-thumbnail" key={src} aria-label={`Open photo ${index + 1}`} onClick={() => {setSelected(index); dialog.current.showModal();}}>
            <img src={src} alt={`Campus and festival moments ${index + 1}`} loading="lazy" decoding="async" width="600" height="400" />
          </button>
        ))}
      </div>
      <dialog className="gallery-dialog" ref={dialog} aria-label="Photo viewer" onClick={event => {if (event.target === dialog.current) dialog.current.close();}} onKeyDown={event => {if(event.key === 'ArrowLeft') move(-1); if(event.key === 'ArrowRight') move(1);}}>
        <button className="gallery-close" onClick={() => dialog.current.close()} aria-label="Close photo viewer">×</button>
        <img src={images[selected]} alt={`Campus and festival moments ${selected + 1}`} />
        <div className="gallery-controls">
          <button onClick={() => move(-1)}>← Previous</button>
          <span aria-live="polite">{selected + 1} / {images.length}</span>
          <button onClick={() => move(1)}>Next →</button>
        </div>
      </dialog>
    </main>
  );
}
