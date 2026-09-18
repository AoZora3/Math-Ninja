import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let currentHighScore = 0;

app.get('/api/high-score', (req, res) => {
  res.json({ highScore: currentHighScore });
});

app.post('/api/save-score', (req, res) => {
  const playerScore = req.body.score;
  
  if (playerScore > currentHighScore) {
    currentHighScore = playerScore;
  }
  
  res.json({ success: true, topScore: currentHighScore });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
