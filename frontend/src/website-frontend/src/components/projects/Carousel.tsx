import { useState } from 'react';
import './Carousel.css'

type CarouselProps = {
    slides: string[]
}

export const Carousel: React.FC<CarouselProps> = ({ slides }) => {
    const [index, setIndex] = useState<number>(0);
    if (!slides.length) {
        return null;
    }

    const goTo = (i: number) => {
        const next = (i + slides.length) % slides.length;
        setIndex(next);
    }

    const handlePrev = () => goTo(index - 1);
    const handleNext = () => goTo(index + 1);
    return(
        <div className="carousel">
            <div className="carousel-viewport">
                {slides.map((slide, i) => ( // use () to return a "group" of HTML elements.
                    <div
                        key={slide+ i}
                        className={`carousel-slide ${i === index ? "active" : ""}`}
                        aria-hidden={i !== index}
                    >
                        <img 
                            src={slide}
                        />
                    </div>
                ))}
            </div>
            <button 
                className='carousel-btn prev'
                type='button'
                onClick={handlePrev}
                aria-label='Previous Slide'
            >
                &lt;
            </button>
            <button 
                className='carousel-btn next'
                type='button'
                onClick={handleNext}
                aria-label='Next Slide'
            >
                &gt;
            </button>
            <div className="carousel-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        type='button'
                        className={`carousel-dot ${i === index ? 'active' : ''}`}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}