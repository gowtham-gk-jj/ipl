// Convert number (rupees) → IPL display format
export const formatPrice = (amount) => {
  if (!amount) return "0";

  if (amount >= 10000000) {
    return (amount / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";
  }

  if (amount >= 100000) {
    return (amount / 100000).toFixed(0) + " L";
  }

  return amount;
};


// Convert IPL text → rupees
export const parsePrice = (value) => {
  if (!value) return 0;

  const val = value.toLowerCase().trim();

  if (val.includes("cr")) {
    return parseFloat(val.replace("cr", "")) * 10000000;
  }

  if (val.includes("l")) {
    return parseFloat(val.replace("l", "")) * 100000;
  }

  return Number(val);
};
