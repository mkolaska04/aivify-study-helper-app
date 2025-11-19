import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import studyApp from "./routes/study.js";
import authApp from "./routes/auth.js";
dotenv.config();
const app = express();
// Enable CORS for frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
// Mount routes
app.use("/api/study", studyApp);
app.use("/api/auth", authApp);
app.get("/health", (req, res) => res.json({ ok: true }));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map