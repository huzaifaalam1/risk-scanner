"use client";


import { useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import RiskCard from "./components/RiskCard";
import RiskSummary from "./components/RiskSummary";
import ContractSummary from "./components/ContractSummary";
import jsPDF from "jspdf";


interface Risk {
  category: string;
  riskLevel: string;
  clause: string;
  explanation: string;
}


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [filter, setFilter] = useState<"All" | "High" | "Medium" | "Low">("All");


  // Analyze uploaded file
  const handleAnalyze = async () => {
    if (!file) return;


    const formData = new FormData();
    formData.append("file", file);


    try {
      setLoading(true);


      const response = await axios.post("http://localhost:5000/analyze", formData);


      let parsed;
      if (typeof response.data.analysis === "string") {
        // Fallback: wrap raw string in a Risk object
        parsed = {
          summary: response.data.analysis,
          risks: [
            {
              category: "AI Output",
              riskLevel: "Info",
              clause: "",
              explanation: response.data.analysis,
            },
          ],
        };
      } else {
        parsed = response.data.analysis;
      }


      setRisks(parsed.risks || []);
      setSummary(parsed.summary || "");
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };


  // Download JSON
  const downloadJSON = () => {
    const data = { summary, risks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contract_risks.json";
    a.click();
    URL.revokeObjectURL(url);
  };


  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();


    doc.setFontSize(16);
    doc.text("Contract Executive Summary", 10, 20);
    doc.setFontSize(12);
    doc.text(summary || "No summary available", 10, 30);


    doc.setFontSize(16);
    doc.text("Risk Summary", 10, 50);


    risks.forEach((risk, i) => {
      const y = 60 + i * 20;
      doc.setFontSize(12);
      doc.text(`${i + 1}. ${risk.category} — ${risk.riskLevel}`, 10, y);
      doc.setFontSize(10);
      doc.text(`Clause: ${risk.clause}`, 10, y + 5);
      doc.text(`Explanation: ${risk.explanation}`, 10, y + 10);
    });


    doc.save("contract_risks.pdf");
  };


  return (
    <main className="min-h-screen p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center w-full">AI Contract Risk Scanner</h1>


      {/* File Upload */}
      <FileUpload onFileSelect={setFile} />


      {/* Analyze Button */}
      {file && (
        <button
          onClick={handleAnalyze}
          className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transform transition duration-200 font-semibold"
        >
          Analyze Contract
        </button>
      )}


      {/* Download Buttons */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={downloadJSON}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          Download JSON
        </button>
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Download PDF
        </button>
      </div>


      {/* Loading */}
      {loading && <p className="mt-6">Analyzing contract...</p>}


      {/* Filter + Results */}
      {risks.length > 0 && (
        <div className="mt-10 space-y-6">
          {/* Filter Buttons */}
          <div className="flex gap-4 mb-4">
            {["All", "High", "Medium", "Low"].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level as any)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === level ? "bg-black text-white" : "bg-gray-200 text-black"
                }`}
              >
                {level}
              </button>
            ))}
          </div>


          {/* Contract Summary */}
          {summary && <ContractSummary summary={summary} />}


          {/* Risk Summary */}
          <RiskSummary risks={risks} />


          {/* Risk Cards */}
          {risks
            .filter((r) => filter === "All" || r.riskLevel === filter)
            .map((risk, index) => (
              <RiskCard key={index} risk={risk} />
            ))}
        </div>
      )}
    </main>
  );
}


