import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureCards from "./components/FeatureCards";
import VerifyForm from "./components/VerifyForm";
import CertificateDetails from "./components/CertificateDetails";
import AdminPanel from "./components/AdminPanel";
import RegulatorPanel from "./components/RegulatorPanel";
import Report from "./components/Report";
import useRole from "./hooks/useRole";
import "./App.css";

const CONTRACT_ADDRESS = "0xd83ee0e24d1399acbe379172f6d4bfc4d2b1091a";
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_studentName", "type": "string" },
      { "internalType": "string", "name": "_course", "type": "string" },
      { "internalType": "string", "name": "_institution", "type": "string" },
      { "internalType": "string", "name": "_duration", "type": "string" },
      { "internalType": "string", "name": "_grade", "type": "string" },
      { "internalType": "string", "name": "_credentialType", "type": "string" }
    ],
    "name": "issueCertificate",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "certHash", "type": "bytes32" }],
    "name": "revokeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "certHash", "type": "bytes32" }],
    "name": "verifyCertificate",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [certificateHash, setCertificateHash] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const [revokeCertHash, setRevokeCertHash] = useState("");

  const [formInputs, setFormInputs] = useState({
    studentName: "",
    course: "",
    institution: "",
    duration: "",
    grade: "",
    credentialType: ""
  });

  const role = useRole(account);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);

        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } else {
        toast.error("Please install MetaMask!");
      }
    };
    loadBlockchainData();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <Navbar account={account} />

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <HeroSection />
                  <FeatureCards />
                  <VerifyForm
                    certificateHash={certificateHash}
                    setCertificateHash={setCertificateHash}
                    contract={contract}
                    setCertificateData={setCertificateData}
                  />
                  {certificateData && (
                    <CertificateDetails
                      certificateData={certificateData}
                      certificateHash={certificateHash}
                    />
                  )}
                </div>
              }
            />

            <Route
              path="/admin"
              element={
                role === "GOVT" || role === "INSTITUTION" ? (
                  <AdminPanel
                    formInputs={formInputs}
                    setFormInputs={setFormInputs}
                    issueCertificateContract={contract}
                    revokeCertHash={revokeCertHash}
                    setRevokeCertHash={setRevokeCertHash}
                  />
                ) : (
                  <div className="text-center mt-20 px-6">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">🚫 Access Denied</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      You do not have permission to access the <strong>Admin Panel</strong>. Only authorized roles such as <code>GOVT</code> or <code>INSTITUTION</code> can issue or revoke certificates.
                    </p>
                  </div>
                )
              }
            />

            <Route
              path="/regulator"
              element={
                role === "GOVT" || role === "REGULATOR" ? (
                  <RegulatorPanel />
                ) : (
                  <div className="text-center mt-20 px-6">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">🚫 Access Denied</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      You do not have permission to access the <strong>Regulator Panel</strong>. Only <code>GOVT</code> or <code>REGULATOR</code> roles can manage institutions.
                    </p>
                  </div>
                )
              }
            />

            <Route path="/report" element={<Report />} />
          </Routes>
        </main>

        <footer className="bg-green-700 text-white text-center py-4 mt-auto shadow-inner">
          <div className="container mx-auto px-4">
            <p className="text-sm tracking-wide">
              &copy; {new Date().getFullYear()} ShikkhaChain — A Blockchain Platform for Verifiable Credentials.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
