import React from "react";

const ListProductCard = (props) => {
  const { name, imageUrl, price, description } = props.product;
  return (
    <div className="list-product-card">
      <div className="list-image-container">
        <img src={imageUrl} className="list-thumbnail-image"></img>
      </div>
      <div className="list-col-container">
        <h4>{name}</h4>
        <span className="price-span font-size-large">${price}</span>
        <p>{description}</p>
        <button>Details</button>
      </div>
    </div>
  );
};

export default ListProductCard;
