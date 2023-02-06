import BigNumber from "bignumber.js";

const toFull = (value, decimals) =>
  new BigNumber(value)
    .times(new BigNumber(10).exponentiatedBy(decimals))
    .toFixed(0);

export const FORGES = {
  WETH: {
    limits: {
      minContrib: toFull("0.1", 18),
      maxContrib: toFull("3", 18),
      maxCapital: toFull("100", 18),
    },
  },
  USDC: {
    limits: {
      minContrib: toFull("1", 6),
      maxContrib: toFull("10000", 6),
      maxCapital: toFull("1000000", 6),
    },
  },
  WBTC: {
    limits: {
      minContrib: toFull("0.00000004", 8),
      maxContrib: toFull("10", 8),
      maxCapital: toFull("100", 8),
    },
  },
};
