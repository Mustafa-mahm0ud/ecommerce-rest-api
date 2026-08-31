const calculatePriceAfterDiscount = (price, discountPercentage) => {
  if (
    parseInt(discountPercentage, 10) === 0 ||
    discountPercentage === undefined
  )
    return undefined;

  return +(price - (price * discountPercentage) / 100).toFixed(2);
};

export default calculatePriceAfterDiscount;
