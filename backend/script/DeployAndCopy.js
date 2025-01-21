import { ethers } from "ethers"; // ethers v6
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // コントラクトのコンパイルとデプロイ
  execSync("forge build");
  const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // ethers v6
  const wallet = new ethers.Wallet(process.env.MY_PRIVATE_KEY, provider);

  console.log("Private Key:", process.env.MY_PRIVATE_KEY);

  const MemoAppArtifact = JSON.parse(fs.readFileSync("out/MemoApp.sol/MemoApp.json", "utf8"));
  const MemoAppFactory = new ethers.ContractFactory(MemoAppArtifact.abi, MemoAppArtifact.bytecode, wallet);
  const memoApp = await MemoAppFactory.deploy();
  // await memoApp.deployed();

  console.log("MemoApp deployed to:", memoApp.address);

  // ABIとアドレスをフロントエンドにコピー
  const artifact = {
    abi: MemoAppArtifact.abi,
    address: memoApp.address,
  };

  const frontendPath = path.join(__dirname, "../../frontend/artifacts/MemoApp.json");
  fs.writeFileSync(frontendPath, JSON.stringify(artifact, null, 2));
  console.log("ABI and address copied to frontend.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});