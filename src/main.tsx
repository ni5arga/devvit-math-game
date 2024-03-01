import { Devvit } from '@devvit/public-api';

// code written by https://github.com/ni5arga/

const generateMathQuestion = (operation: string | string[]) => {
  if (operation === 'mixed') {
    operation = ['+', '-', '*'][Math.floor(Math.random() * 3)];
  }
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const answer = eval(`${num1} ${operation} ${num2}`);
  return { question: `${num1} ${operation} ${num2} = ?`, answer };
};

Devvit.configure({
  redditAPI: true,
});

Devvit.addCustomPostType({
  name: 'MathGame',
  render: context => {
    const [operation, setOperation] = context.useState('+');
    const [questionData, setQuestionData] = context.useState(() => generateMathQuestion(operation));
    const [userAnswer, setUserAnswer] = context.useState('');
    const [score, setScore] = context.useState(0);
    const [gameStarted, setGameStarted] = context.useState(false);
    const [gameOver, setGameOver] = context.useState(false);
    const [isGameOver, setIsGameOver] = context.useState(false);
    const [operationChosen, setOperationChosen] = context.useState(false);

    const handleNumberClick = (number: string | number) => {
      if (gameStarted && !gameOver) {
        setUserAnswer(userAnswer + number);
      }
    };

    const handleOperationChange = (selectedOperation: string) => {
      if (!gameStarted) {
        setOperation(selectedOperation);
        setOperationChosen(true);
        startGame();
      }
    };

    const handleMixedClick = () => {
      if (!gameStarted) {
        setOperation('mixed');
        setOperationChosen(true);
        startGame();
      }
    };

    const startGame = () => {
      setGameStarted(true);
      setQuestionData(generateMathQuestion(operation));
    };

    const handleSubmitClick = () => {
      if (gameStarted && !gameOver) {
        const selectedAnswer = parseInt(userAnswer, 10);
        if (selectedAnswer === questionData.answer) {
          setScore(score + 10);
          if (operation !== 'mixed') {
            setQuestionData(generateMathQuestion(operation));
          } else {
            setQuestionData(generateMathQuestion('mixed'));
          }
          setUserAnswer('');
        } else {
          setGameOver(true);
          setIsGameOver(true);
        }
      }
    };

    const handleRestartClick = () => {
      setScore(0);
      setGameOver(false);
      setIsGameOver(false);
      setGameStarted(false);
      setOperationChosen(false);
      setQuestionData(generateMathQuestion(operation));
      setUserAnswer('');
    };

    const tick = () => {
      if (gameStarted && !gameOver) {
        const { question, answer } = generateMathQuestion(operation);
        setQuestionData({ question, answer });
      }
    };

    const updateInterval = context.useInterval(tick, 50000);
    updateInterval.start();

    return (
      <vstack alignment='center middle' height='100%' gap='small'>
        {operationChosen && !isGameOver && (
          <text>
            {`Operation Type: ${operation === 'mixed' ? 'Mixed' : operation}`}
          </text>
        )}
        {!gameStarted && !operationChosen && !isGameOver && (
          <text>
            {`Choose Operation Type`}
          </text>
        )}
        {!gameStarted && !operationChosen && !isGameOver && (
          <hstack alignment='center' gap='small'>
            {['+', '-', '*'].map((op, index) => (
              <button
                onPress={() => handleOperationChange(op)}
                key={index}
              >
                {op}
              </button>
            ))}
            <button onPress={handleMixedClick}>
              Mixed
            </button>
          </hstack>
        )}
        {gameStarted && (
          <text size='xxlarge' weight='bold'>
            {questionData.question}
          </text>
        )}
        {gameStarted && (
          <hstack alignment='center' gap='small'>
            {[1, 2, 3].map(value => (
              <button
                onPress={() => handleNumberClick(value)}
                key={value}
              >
                {value}
              </button>
            ))}
          </hstack>
        )}
        {gameStarted && (
          <hstack alignment='center' gap='small'>
            {[4, 5, 6].map(value => (
              <button
                onPress={() => handleNumberClick(value)}
                key={value}
              >
                {value}
              </button>
            ))}
          </hstack>
        )}
        {gameStarted && (
          <hstack alignment='center' gap='small'>
            {[7, 8, 9].map(value => (
              <button
                onPress={() => handleNumberClick(value)}
                key={value}
              >
                {value}
              </button>
            ))}
          </hstack>
        )}
        {gameStarted && (
          <hstack alignment='center' gap='small'>
            {[0, '(-)', '<-', '✓'].map(value => (
              <button
                onPress={() => {
                  if (value === '(-)') {
                    handleNumberClick('-');
                  } else if (value === '<-') {
                    setUserAnswer(userAnswer.slice(0, -1));
                  } else if (value === '✓') {
                    handleSubmitClick();
                  } else {
                    handleNumberClick(value);
                  }
                }}
                key={value}
              >
                {value}
              </button>
            ))}
          </hstack>
        )}
        {gameStarted && <text>{`Your Answer: ${userAnswer}`}</text>}
        {isGameOver && (
          <vstack>
            <text size='xxlarge' weight='bold'>
              Game Over! Your Score: {score}
            </text>
            <button
              onPress={handleRestartClick}
            >
              Restart
            </button>
          </vstack>
        )}
      </vstack>
    );
  },
});

export default Devvit;
