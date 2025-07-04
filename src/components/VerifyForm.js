import toast from "react-hot-toast";

const VerifyForm = ({ certificateHash, setCertificateHash, contract, setCertificateData }) => {
  const verifyCertificate = async () => {
    if (!certificateHash || !contract) return;

    try {
      const certDetails = await contract.verifyCertificate(certificateHash);

      if (!certDetails || certDetails[0] === "") {
        throw new Error("Certificate not found.");
      }

      const certificateData = {
        studentName: certDetails[0],
        course: certDetails[1],
        institution: certDetails[2],
        duration: certDetails[3],
        grade: certDetails[4],
        credentialType: certDetails[5],
        issueDate: new Date(Number(certDetails[6]) * 1000).toLocaleDateString(),
        isValid: certDetails[7],
      };

      setCertificateData(certificateData);
      toast.success("Certificate Verified Successfully!");
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Verification failed or certificate not found.");
    }
  };

  return (
    <div className="container mx-auto my-8 px-6">
      <div className="bg-white p-6 shadow-lg rounded-lg text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold">Verify Certificate</h2>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            className="p-2 border rounded-lg w-full"
            placeholder="Enter Certificate Hash"
            value={certificateHash}
            onChange={(e) => setCertificateHash(e.target.value)}
          />
          <button
            onClick={verifyCertificate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
