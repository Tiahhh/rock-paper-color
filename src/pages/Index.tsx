import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Define what beats what and their corresponding emojis
const objectBeaters: { [key: string]: { beaters: string[], emoji: string } } = {
  "rock": {
    beaters: ["paper", "dynamite", "hammer", "drill", "pickaxe"],
    emoji: "🪨"
  },
  "paper": {
    beaters: ["scissors", "fire", "water", "shredder"],
    emoji: "📄"
  },
  "scissors": {
    beaters: ["rock", "hammer", "metal"],
    emoji: "✂️"
  },
  "fire": {
    beaters: ["water", "extinguisher", "sand"],
    emoji: "🔥"
  },
  "water": {
    beaters: ["rock", "earth", "sand"],
    emoji: "💧"
  },
};

const Index = () => {
  const [currentObject, setCurrentObject] = useState("rock");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [usedAnswers, setUsedAnswers] = useState<string[]>([]);
  const { toast } = useToast();

  console.log("Current object:", currentObject);
  console.log("Valid beaters:", objectBeaters[currentObject].beaters);
  console.log("Used answers:", usedAnswers);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = userInput.toLowerCase().trim();
    console.log("User submitted answer:", answer);

    if (usedAnswers.includes(answer)) {
      toast({
        title: "Already Used! 🔄",
        description: `You've already used "${answer}" before. Try something else!`,
        variant: "destructive",
      });
      setUserInput("");
      return;
    }

    if (objectBeaters[currentObject].beaters.includes(answer)) {
      // Correct answer
      setUsedAnswers([...usedAnswers, answer]);
      toast({
        title: "Correct! 🎉",
        description: `${answer} beats ${currentObject}!`,
      });
      setScore(score + 1);
      
      // Update high score if current score is higher
      if (score + 1 > highScore) {
        setHighScore(score + 1);
      }
      
      // If the answer exists as a key in objectBeaters, use it as next object
      if (objectBeaters[answer]) {
        setCurrentObject(answer);
      } else {
        // Wrong answer since we can't continue with this object
        if (score > highScore) {
          setHighScore(score);
        }
        toast({
          title: "Game Over! 🎮",
          description: `Great job! But we don't have any objects that can beat ${answer}. Final score: ${score}`,
          variant: "destructive",
        });
        setGameOver(true);
      }
    } else {
      // Wrong answer
      if (score > highScore) {
        setHighScore(score);
      }
      toast({
        title: "Game Over! ❌",
        description: `${answer} doesn't beat ${currentObject}. Final score: ${score}`,
        variant: "destructive",
      });
      setGameOver(true);
    }
    setUserInput("");
  };

  const handleRetry = () => {
    setCurrentObject("rock");
    setScore(0);
    setGameOver(false);
    setUserInput("");
    setUsedAnswers([]);
    toast({
      title: "New Game Started! 🎮",
      description: "What beats a rock?",
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen p-4 md:p-8">
        <ThemeToggle />
        
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            What Beats {currentObject.charAt(0).toUpperCase() + currentObject.slice(1)}?
          </h1>
          
          <Card className="p-6 mb-8">
            <div className="text-9xl text-center mb-6">
              {objectBeaters[currentObject].emoji}
            </div>
            
            <div className="text-center mb-4 space-y-2">
              <p className="text-2xl font-bold">Score: {score}</p>
              <p className="text-xl text-muted-foreground">High Score: {highScore}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`What beats ${currentObject}?`}
                disabled={gameOver}
                className="w-full"
              />
              
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={gameOver || !userInput.trim()}
                >
                  Submit
                </Button>
                
                {gameOver && (
                  <Button 
                    onClick={handleRetry}
                    variant="secondary"
                    className="w-full"
                  >
                    Retry
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;