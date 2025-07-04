import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Report = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState("All");
  const [searchName, setSearchName] = useState("");
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/certificates")
      .then(res => {
        setCertificates(res.data);
        const unique = [...new Set(res.data.map(cert => cert.institution))];
        setInstitutions(unique);
      })
      .catch(() => toast.error("Failed to fetch certificate data"));
  }, []);

  const filtered = certificates.filter(cert =>
    (selectedInstitution === "All" || cert.institution === selectedInstitution) &&
    cert.studentName.toLowerCase().includes(searchName.toLowerCase())
  );

  const chartData = institutions.map(inst => {
    const valid = certificates.filter(c => c.institution === inst && c.status === "valid").length;
    const revoked = certificates.filter(c => c.institution === inst && c.status === "revoked").length;
    return { institution: inst, valid, revoked };
  });

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">Certificate Report</h1>
        <p className="text-gray-600">Search and filter certificate records</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          className="p-2 border rounded-lg shadow w-full"
          value={selectedInstitution}
          onChange={(e) => setSelectedInstitution(e.target.value)}
        >
          <option value="All">All Institutions</option>
          {institutions.map((inst, i) => (
            <option key={i} value={inst}>{inst}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border rounded-lg shadow w-full"
        />
      </div>

      {/* Valid vs Revoked Chart */}
      <div className="bg-gray-50 p-4 rounded shadow mb-8">
        <h3 className="text-lg font-semibold mb-2 text-center">Valid vs Revoked by Institution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <XAxis dataKey="institution" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="valid" stackId="a" fill="#22c55e" />
            <Bar dataKey="revoked" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No certificates match your filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Hash</th>
                <th className="px-4 py-2 border">Student</th>
                <th className="px-4 py-2 border">Course</th>
                <th className="px-4 py-2 border">Institution</th>
                <th className="px-4 py-2 border">Issued</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cert, index) => (
                <tr key={index} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border break-all">{cert.hash}</td>
                  <td className="px-4 py-2 border">{cert.studentName}</td>
                  <td className="px-4 py-2 border">{cert.course}</td>
                  <td className="px-4 py-2 border">{cert.institution}</td>
                  <td className="px-4 py-2 border">{new Date(cert.issuedAt).toLocaleString()}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${cert.status === "valid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {cert.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Report;
