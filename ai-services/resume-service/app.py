from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
import io

app = FastAPI(title="Resume Intelligence Service")


def extract_text_from_pdf(data: bytes) -> str:
  reader = PdfReader(io.BytesIO(data))
  parts = []
  for page in reader.pages:
    parts.append(page.extract_text() or "")
  return "\n".join(parts)


def basic_resume_scoring(text: str):
  lowered = text.lower()

  skills_keywords = ["javascript", "react", "node", "python", "java", "sql", "docker"]
  project_keywords = ["project", "built", "developed", "implemented"]
  experience_keywords = ["experience", "intern", "engineer", "developer"]
  structure_keywords = ["education", "skills", "projects", "experience"]

  def score_for(keywords):
    hits = sum(1 for k in keywords if k in lowered)
    if hits == 0:
      return 30
    if hits >= len(keywords):
      return 95
    return 50 + int(45 * (hits / len(keywords)))

  skill_relevance = score_for(skills_keywords)
  project_depth = score_for(project_keywords)
  experience_score = score_for(experience_keywords)
  structure_score = score_for(structure_keywords)

  resume_score = (
    skill_relevance * 0.4
    + project_depth * 0.3
    + experience_score * 0.2
    + structure_score * 0.1
  )

  missing_skills = [k for k in skills_keywords if k not in lowered]

  suggestions = []
  if skill_relevance < 70:
    suggestions.append("Add more relevant technical skills with concrete examples.")
  if project_depth < 70:
    suggestions.append("Describe projects with responsibilities, tech stack and measurable outcomes.")
  if experience_score < 70:
    suggestions.append("Highlight internships, freelance work or open-source contributions.")
  if structure_score < 70:
    suggestions.append("Organize resume into clear sections like Skills, Projects and Experience.")

  return {
    "skill_relevance": round(skill_relevance, 2),
    "project_depth": round(project_depth, 2),
    "experience_score": round(experience_score, 2),
    "structure_score": round(structure_score, 2),
    "resume_score": round(resume_score, 2),
    "missing_skills": missing_skills,
    "suggestions": suggestions,
  }


@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
  if file.content_type not in ("application/pdf", "application/octet-stream"):
    raise HTTPException(status_code=400, detail="Only PDF files are supported")

  data = await file.read()
  if not data:
    raise HTTPException(status_code=400, detail="Empty file")

  try:
    text = extract_text_from_pdf(data)
  except Exception as exc:
    raise HTTPException(status_code=400, detail=f"Failed to read PDF: {exc}") from exc

  scores = basic_resume_scoring(text)
  return JSONResponse(scores)
