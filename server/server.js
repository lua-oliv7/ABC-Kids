import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "data.json");

app.use(cors());
app.use(express.json());

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      students: [],
      teachers: [],
      classrooms: []
    };

    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(initialData, null, 2),
      "utf8"
    );
  }
}

function readData() {
  ensureDataFile();

  const file = fs.readFileSync(DATA_FILE, "utf8");

  return JSON.parse(file);
}

function writeData(data) {
  ensureDataFile();

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Servidor ABC-Kids funcionando!"
  });
});

app.get("/api/data", (req, res) => {
  try {
    const data = readData();

    res.json(data);
  } catch (error) {
    console.error("Erro ao ler os dados:", error);

    res.status(500).json({
      error: "Não foi possível ler os dados."
    });
  }
});

app.put("/api/data", (req, res) => {
  try {
    const data = req.body;

    writeData(data);

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);

    res.status(500).json({
      error: "Não foi possível salvar os dados."
    });
  }
});

ensureDataFile();

app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("=================================");
  console.log("   ABC-Kids - Servidor");
  console.log("=================================");
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log("");
});