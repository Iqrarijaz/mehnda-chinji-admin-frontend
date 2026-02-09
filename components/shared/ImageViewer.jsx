"use client";
import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

function ImageViewer({ isOpen, onClose, images = [], initialIndex = 0 }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const containerRef = useRef(null);

    // Reset index when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    // Minimum swipe distance
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentIndex < images.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
        if (isRightSwipe && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const goToNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, currentIndex]);

    if (!images || images.length === 0) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width="100%"
            style={{ maxWidth: "100vw", top: 0, padding: 0 }}
            bodyStyle={{ padding: 0, background: "rgba(0,0,0,0.95)", height: "100vh" }}
            closable={false}
            className="image-viewer-modal"
            maskStyle={{ background: "rgba(0,0,0,0.95)" }}
        >
            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    <FaTimes size={20} />
                </button>

                {/* Image Counter */}
                <div className="absolute top-4 left-4 z-50 px-3 py-1.5 bg-white/10 rounded-full text-white text-sm">
                    {currentIndex + 1} / {images.length}
                </div>

                {/* Previous Button - Desktop */}
                {currentIndex > 0 && (
                    <button
                        onClick={goToPrevious}
                        className="hidden md:flex absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <FaChevronLeft size={24} />
                    </button>
                )}

                {/* Next Button - Desktop */}
                {currentIndex < images.length - 1 && (
                    <button
                        onClick={goToNext}
                        className="hidden md:flex absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <FaChevronRight size={24} />
                    </button>
                )}

                {/* Image */}
                <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                        draggable={false}
                    />
                </div>

                {/* Dots Indicator */}
                {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? "bg-white w-4"
                                        : "bg-white/40 hover:bg-white/60"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Swipe hint for mobile */}
                {images.length > 1 && (
                    <div className="md:hidden absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white/50 text-xs">
                        Swipe to navigate
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default ImageViewer;
