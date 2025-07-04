import { jsPDF } from "jspdf";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from "@heroicons/react/solid";

const CertificateDetails = ({ certificateData, certificateHash }) => {
  const generatePDF = () => {
    const doc = new jsPDF("landscape", "mm", "a4");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Certificate Verification Report", 20, 30);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 290, 35);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Certificate Hash: ${certificateHash}`, 20, 50);
    doc.text(`Student Name: ${certificateData.studentName}`, 20, 60);
    doc.text(`Course: ${certificateData.course}`, 20, 70);
    doc.text(`Institution: ${certificateData.institution}`, 20, 80);
    doc.text(`Duration: ${certificateData.duration}`, 20, 90);
    doc.text(`Grade: ${certificateData.grade}`, 20, 100);
    doc.text(`Credential Type: ${certificateData.credentialType}`, 20, 110);
    doc.text(`Issue Date: ${certificateData.issueDate}`, 20, 120);
    doc.text(`Status: ${certificateData.isValid ? "Valid" : "Revoked"}`, 20, 130);

    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Generated on: ${currentDate}`, 20, 285);
    doc.text(`Page 1`, 270, 285, null, null, "right");

    doc.save("certificate-verification-report.pdf");
  };

  return (
    <div className="container mx-auto mt-8 px-6">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
            <InformationCircleIcon className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Certificate Details</h2>
        </div>

        <div className="space-y-4">
          <p><strong className="text-gray-700">Student Name:</strong> {certificateData.studentName}</p>
          <p><strong className="text-gray-700">Course:</strong> {certificateData.course}</p>
          <p><strong className="text-gray-700">Institution:</strong> {certificateData.institution}</p>
          <p><strong className="text-gray-700">Duration:</strong> {certificateData.duration}</p>
          <p><strong className="text-gray-700">Grade:</strong> {certificateData.grade}</p>
          <p><strong className="text-gray-700">Credential Type:</strong> {certificateData.credentialType}</p>
          <p><strong className="text-gray-700">Issue Date:</strong> {certificateData.issueDate}</p>
          <p className="flex items-center gap-2">
            <strong className="text-gray-700">Status:</strong>
            {certificateData.isValid ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            ) : (
              <XCircleIcon className="w-6 h-6 text-red-500" />
            )}
            {certificateData.isValid ? "Valid" : "Revoked"}
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={generatePDF}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Certificate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;
