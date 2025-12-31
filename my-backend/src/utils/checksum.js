import { getAddress } from "ethers";

const rawAddress = "0xd3d708c771c73c3314bd2531cdf0cc073e6ef340";

try {
  const checksummed = getAddress(rawAddress);
  console.log("Correct checksum address:");
  console.log(checksummed);
} catch (err) {
  console.error("Invalid address");
}
