import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import { useEffect, useRef } from 'react';
import { renderJointGalery } from '../../../utils/utils.jsx';
import CertificateSlide from './slides/CertificateSlide.jsx';
import PhotoSlide from './slides/PhotoSlide.jsx';
import ReviewSlide from './slides/ReviewSlide.jsx';

function GlideContainer({
  placement,
  glideConfig,
  glideBreakpoints,
  slides,
  type,
}) {
  const glideRef = useRef(null);
  const totalPhotosNumber = slides => {
    let counter = 0;
    slides.forEach(camp => {
      counter += camp.pastGallerySize ?? 0;
    });
    return counter;
  };
  useEffect(() => {
    // double checking if component is rendered
    if (glideRef.current) {
      try {
        const glide = new Glide(glideRef.current, {
          ...glideConfig,
          breakpoints: glideBreakpoints || {
            360: { perView: 1 },
            480: { perView: 2 },
            1024: { perView: 3 },
          },
        });
        glide.mount();

        // happens after unmounting the component:
        return () => {
          glide.destroy();
        };
      } catch (error) {
        console.error('Error initializing Glide:', error);
      }
    }
  }, [glideConfig, glideBreakpoints]);

  const isTile = type === 'tile';
  const isPhoto = type === 'photo';
  const isAllPhotos = type === 'allPhotos';
  const isReview = type === 'review';

  const renderSlides = () => {
    const SlideComponent = (() => {
      if (isTile) return CertificateSlide;
      if (isPhoto) return PhotoSlide;
      if (isReview) return ReviewSlide;
      return null;
    })();

    if (SlideComponent && (isTile || isReview)) {
      return slides.map((slide, index) => (
        <SlideComponent key={index} slideData={slide} />
      ));
    } else if (SlideComponent && isPhoto) {
      return Array.from({ length: slides.size }).map((_, index) => (
        <SlideComponent key={index} photoNo={index + 1} slideData={slides} />
      ));
    } else {
      return slides.map((partner, index) => (
        <a
          key={index}
          href={partner.link}
          target='_blank'
          className={`partners__link`}
        >
          <img
            src={partner.logo}
            loading='lazy'
            alt={partner.alt}
            className={`partners__image`}
          />
        </a>
      ));
    }
  };
  const renderBullets = type => {
    const counter =
      type == 'allPhotos'
        ? totalPhotosNumber(slides)
        : ['tile', 'review', 'partner'].includes(type)
        ? slides.length
        : slides.size;

    return Array.from({ length: counter }).map((_, index) => (
      <button
        key={index}
        className='glide__bullet'
        data-glide-dir={`=${index}`}
      />
    ));
  };

  return (
    <div
      className={`glide ${placement ? `glide--${placement}` : ''}`}
      ref={glideRef}
    >
      <div className='glide__track' data-glide-el='track'>
        <ul className='glide__slides'>
          {isAllPhotos ? renderJointGalery(slides) : renderSlides()}
        </ul>
      </div>

      <div className='glide__bullets' data-glide-el='controls[nav]'>
        {renderBullets(type)}
      </div>

      <div className='glide__arrows' data-glide-el='controls'>
        <button className='glide__arrow glide__arrow--left' data-glide-dir='<'>
          <i className='fa-solid fa-chevron-left'></i>
        </button>
        <button className='glide__arrow glide__arrow--right' data-glide-dir='>'>
          <i className='fa-solid fa-chevron-right'></i>
        </button>
      </div>
    </div>
  );
}

export default GlideContainer;
