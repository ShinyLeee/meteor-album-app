import React from 'react';

// A simple facebook like card content CardLoader
// from https://codepen.io/Mestika/pen/ByNYBa
const CardLoader = () => (
  <div className="timeline-wrapper">
    <div className="timeline-item">
      <div className="animated-background facebook">
        <div className="background-masker header-top" />
        <div className="background-masker header-left" />
        <div className="background-masker header-right" />
        <div className="background-masker header-bottom" />
        <div className="background-masker subheader-left" />
        <div className="background-masker subheader-right" />
        <div className="background-masker subheader-bottom" />
        <div className="background-masker content-top" />
        <div className="background-masker content-first-end" />
        <div className="background-masker content-second-line" />
        <div className="background-masker content-second-end" />
        <div className="background-masker content-third-line" />
        <div className="background-masker content-third-end" />
      </div>
    </div>
  </div>
);

export default CardLoader;
