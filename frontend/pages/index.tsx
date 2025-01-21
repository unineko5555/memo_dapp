import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MemoAppABI from '../artifacts/MemoApp.json';

//note: anvilやsepoliaでデプロイしたコントラクトのアドレスを指定するが自動で取得したい
const contractAddress = "0xa39637afad8a3ea07d9c51e1141dbbd561bb42c7";

interface Memo {
  id: number;
  creator: string;
  content: string;
  timestamp: number;
}

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // プロバイダーとコントラクトの初期化
  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const _provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await _provider.getSigner();
          const _contract = new ethers.Contract(contractAddress, MemoAppABI.abi, signer);
          
          setProvider(_provider);
          setContract(_contract);
        } catch (err) {
          console.error("Error initializing provider and contract:", err);
          setError("Failed to initialize Web3 provider.");
        }
      } else {
        setError("Please install MetaMask to use this application.");
      }
    };

    init();
  }, []);

  // メモを取得する関数
  const fetchMemos = async () => {
    if (!contract) return;
    try {
      const memos = await contract.getAllMemos();
      setMemos(memos);
    } catch (err) {
      console.error("Error fetching memos:", err);
      setError("Failed to fetch memos.");
    }
  };

  // メモを作成する関数
  const createMemo = async () => {
    if (!contract || !content.trim()) return;
    try {
      setLoading(true);
      const tx = await contract.createMemo(content);
      await tx.wait();
      setContent("");
      await fetchMemos();
    } catch (err) {
      console.error("Error creating memo:", err);
      setError("Failed to create memo.");
    } finally {
      setLoading(false);
    }
  };

  // コントラクトが初期化されたらメモを取得
  useEffect(() => {
    if (contract) {
      fetchMemos();
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Decentralized Memo App
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Write a memo..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createMemo}
              disabled={loading || !content.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Memo"}
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Memos</h2>
          <ul className="space-y-4">
            {memos.map((memo, index) => (
              <li key={index} className="border-b border-gray-200 pb-4">
                <div className="text-gray-700">
                  <span className="font-medium text-blue-600">{memo.creator}</span>: {memo.content}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(Number(memo.timestamp) * 1000).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}