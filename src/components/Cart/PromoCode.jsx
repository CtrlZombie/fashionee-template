import React from "react";

const PromoCode = ({ promoCode, setPromoCode, onSubmit, isPromoValid }) => {
  return (
    <div className="promo-code-wrapper">
      <div className="info">
        <div className="title">You Have A Promo Code?</div>
        <div className="description">
          To receive up-to-date promotional codes, subscribe to us on social
          networks.
        </div>
      </div>
      <form className="promo-code" onSubmit={onSubmit}>
        <input
          type="text"
          name="promo-code"
          className="input"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          data-testid="promo-code-input"
        />
        <div className="button-wrapper">
          <button
            type="submit"
            className="button"
            data-testid="apply-promo-btn"
          >
            <img src="./icons/button-arrow.svg" alt="Arrow icon" />
          </button>
          <div className="vertical-line"></div>
        </div>
      </form>
      <div className="find-us">
        <div className="find-us-text">Find us here:</div>
        <div className="find-us-links">
          <div className="find-us-link">
            <a href="#">FB</a>
          </div>
          <div className="line"></div>
          <div className="find-us-link">
            <a href="#">TW</a>
          </div>
          <div className="line"></div>
          <div className="find-us-link">
            <a href="#">INS</a>
          </div>
          <div className="line"></div>
          <div className="find-us-link">
            <a href="#">PT</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCode;