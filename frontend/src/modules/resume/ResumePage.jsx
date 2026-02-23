import { useEffect, useState } from "react";
import api from "../../api/client.js";

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await api.get("/resume/latest");
        setAnalysis(res.data.data);
      } catch (err) {
        setAnalysis(null);
      }
    }
    fetchLatest();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setError("Choose a PDF resume first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setAnalysis(res.data.data.analysis);
    } catch (err) {
      setError("Could not analyze resume. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-xl font-semibold mb-4">Resume Intelligence</h2>
      <form onSubmit={handleUpload} className="space-y-4 mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-200"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-sm font-medium"
        >
          {loading ? "Analyzing..." : "Upload and analyze"}
        </button>
      </form>
      {analysis && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Resume score</span>
            <span className="font-semibold">{analysis.resumeScore}</span>
          </div>
          <div className="flex justify-between">
            <span>Skill relevance</span>
            <span>{analysis.skillRelevance}</span>
          </div>
          <div className="flex justify-between">
            <span>Project depth</span>
            <span>{analysis.projectDepth}</span>
          </div>
          <div className="flex justify-between">
            <span>Experience</span>
            <span>{analysis.experienceScore}</span>
          </div>
          <div className="flex justify-between">
            <span>Structure</span>
            <span>{analysis.structureScore}</span>
          </div>
          {analysis.missingSkills && analysis.missingSkills.length > 0 && (
            <div>
              <p className="mt-2 font-medium">Missing skills</p>
              <p className="text-slate-300">
                {analysis.missingSkills.join(", ")}
              </p>
            </div>
          )}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div>
              <p className="mt-2 font-medium">Suggestions</p>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {analysis.suggestions.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
