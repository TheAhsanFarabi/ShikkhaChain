import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AdminPanel = ({
  formInputs,
  setFormInputs,
  issueCertificateContract,
  revokeCertHash,
  setRevokeCertHash,
}) => {
  const [institutions, setInstitutions] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5001/institutions")
      .then((res) => setInstitutions(res.data))
      .catch(() => toast.error("Failed to load institutions"));
  }, []);

  const issueCertificate = async () => {
    const { studentName, course, institution, duration, grade, credentialType } = formInputs;

    if (!studentName || !course || !institution || !duration || !grade || !credentialType) {
      toast.error("All fields are required");
      return;
    }

    if (!agreed) {
      toast.error("You must confirm the issuing guidelines");
      return;
    }

    if (!issueCertificateContract) {
      toast.error("Smart contract not connected");
      return;
    }

    try {
      const tx = await issueCertificateContract.issueCertificate(
        studentName,
        course,
        institution,
        duration,
        grade,
        credentialType
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find((log) => log.topics.length > 0);
      const certHash = event?.data?.substring(0, 66);

      if (certHash) {
        toast.success(
          (t) => (
            <span>
              ✅ <strong>Certificate Issued!</strong>
              <br />
              <code className="text-sm break-all">{certHash}</code>
              <br />
              <button
                className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={() => {
                  navigator.clipboard.writeText(certHash);
                  toast.dismiss(t.id);
                  toast.success("Hash copied to clipboard!");
                }}
              >
                Copy Hash
              </button>
            </span>
          ),
          { duration: 10000 }
        );

        await axios.post("http://localhost:5001/certificates", {
          hash: certHash,
          studentName,
          course,
          institution,
          duration,
          grade,
          credentialType,
          status: "valid",
          issuedAt: new Date().toISOString(),
        });

        setFormInputs({
          studentName: "",
          course: "",
          institution: "",
          duration: "",
          grade: "",
          credentialType: ""
        });
        setAgreed(false);
      } else {
        toast.error("Certificate issued, but hash not found.");
      }
    } catch (error) {
      toast.error("Issuance failed");
      console.error(error);
    }
  };

  const revokeCertificate = async () => {
    if (!revokeCertHash || !issueCertificateContract) {
      toast.error("Enter a valid certificate hash");
      return;
    }

    try {
      const tx = await issueCertificateContract.revokeCertificate(revokeCertHash);
      await tx.wait();

      await axios.put("http://localhost:5001/certificates/revoke", {
        hash: revokeCertHash,
      });

      toast.success("Certificate Revoked Successfully!");
      setRevokeCertHash("");
    } catch (error) {
      toast.error("Revocation failed");
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-100 pb-12">
      {/* ✅ Hero */}
      <div className="w-full bg-green-700 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-lg text-green-100">
          Issue and revoke academic certificates on the blockchain
        </p>
      </div>

      <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg max-w-xl">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Issue Certificate
        </h2>

        <input
          type="text"
          placeholder="Student Name (e.g., Ahsan Farabi)"
          value={formInputs.studentName}
          onChange={(e) => setFormInputs({ ...formInputs, studentName: e.target.value })}
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="text"
          placeholder="Course (e.g., Blockchain Fundamentals)"
          value={formInputs.course}
          onChange={(e) => setFormInputs({ ...formInputs, course: e.target.value })}
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <select
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formInputs.duration}
          onChange={(e) => setFormInputs({ ...formInputs, duration: e.target.value })}
        >
          <option value="">Select Duration</option>
          <option value="1 Month">1 Month</option>
          <option value="3 Months">3 Months</option>
          <option value="6 Months">6 Months</option>
          <option value="1 Year">1 Year</option>
          <option value="2 Years">2 Years</option>
          <option value="2 Years">3 Years</option>
          <option value="2 Years">4 Years</option>
        </select>

        <input
          type="text"
          placeholder="Grade (e.g., A+, Distinction, Passed)"
          value={formInputs.grade}
          onChange={(e) => setFormInputs({ ...formInputs, grade: e.target.value })}
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <select
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formInputs.credentialType}
          onChange={(e) => setFormInputs({ ...formInputs, credentialType: e.target.value })}
        >
          <option value="">Select Credential Type</option>
          <option value="Certificate">Certificate</option>
          <option value="Diploma">Diploma</option>
          <option value="Degree">Degree</option>
          <option value="Professional Certification">Professional Certification</option>
        </select>

        <select
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formInputs.institution}
          onChange={(e) => setFormInputs({ ...formInputs, institution: e.target.value })}
        >
          <option value="">Select Institution</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.name}>
              {inst.name}
            </option>
          ))}
        </select>

        {/* ✅ Confirmation Checkbox */}
        <div className="flex items-start text-sm text-gray-700 mb-4">
          <input
            id="guidelines"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 mr-2"
          />
          <label htmlFor="guidelines">
            I confirm this issuance complies with the{" "}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-blue-600 underline hover:text-blue-800"
            >
              certificate issuance guidelines
            </button>
            .
          </label>
        </div>

        <button
          onClick={issueCertificate}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Issue Certificate
        </button>

        {/* ✅ Revoke Section */}
        <h2 className="text-xl font-bold text-red-700 mt-8 mb-2">Revoke Certificate</h2>
        <input
          type="text"
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Enter Certificate Hash"
          value={revokeCertHash}
          onChange={(e) => setRevokeCertHash(e.target.value)}
        />
        <button
          onClick={revokeCertificate}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-700"
        >
          Revoke Certificate
        </button>
      </div>

      {/* ✅ Guidelines Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-green-700">
              Certificate Issuance Guidelines
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>Student details must be verified and accurate.</li>
              <li>The issuing institution must be registered in the system.</li>
              <li>Certificates must reflect actual academic achievements.</li>
              <li>Once issued, the certificate is immutable and verifiable.</li>
              <li>Revoking certificates should only be done under valid conditions.</li>
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
