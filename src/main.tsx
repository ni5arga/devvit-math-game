import { Devvit } from '@devvit/public-api';

// code written by https://github.com/ni5arga/

const generateMathQuestion = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
  const answer = eval(`${num1} ${operator} ${num2}`);
  return { question: `${num1} ${operator} ${num2} = ?`, answer };
};


Devvit.configure({
  redditAPI: true,
});

Devvit.addMenuItem({
  label: 'New Math Game',
  location: 'subreddit',
  onPress: async (_, { reddit, ui }) => {
    const subreddit = await reddit.getCurrentSubreddit();
    await reddit.submitPost({
      preview: (
        <vstack padding="medium" cornerRadius="medium">
          <text style="heading" size="medium">
            Loading maths game...
          </text>
        </vstack>
      ),
      title: `${subreddit.name} Math Game`,
      subredditName: subreddit.name,
    });

    ui.showToast({
      text: `Successfully created a Math Game post!`,
      appearance: 'success',
    });
  },
});


Devvit.addCustomPostType({
  name: 'MathGame',
  render: context => {
    const [questionData, setQuestionData] = context.useState(generateMathQuestion);
    const [userAnswer, setUserAnswer] = context.useState('');
    const [score, setScore] = context.useState(0);
    const [gameOver, setGameOver] = context.useState(false);

    const handleNumberClick = (number) => {
      if (!gameOver) {
        setUserAnswer(userAnswer + number);
      }
    };

    const handleNegativeClick = () => {
      if (!gameOver && !userAnswer.includes('-')) {
        setUserAnswer('-' + userAnswer);
      }
    };

    const handleBackspaceClick = () => {
      if (!gameOver && userAnswer.length > 0) {
        setUserAnswer(userAnswer.slice(0, -1));
      }
    };

    const handleSubmitClick = () => {
      if (!gameOver) {
        const selectedAnswer = parseInt(userAnswer, 10);
        if (selectedAnswer === questionData.answer) {
          setScore(score + 10);
        } else {
          setGameOver(true);
        }
        setQuestionData(generateMathQuestion());
        setUserAnswer('');
      }
    };

    const tick = () => {
      if (!gameOver) {
        const { question, answer } = generateMathQuestion();
        setQuestionData({ question, answer });
      }
    };

    // Start the interval when the component mounts
    const updateInterval = context.useInterval(tick, 50000); // Adjust the interval as needed
    updateInterval.start();

    return (
      <vstack alignment='center middle' height='100%' gap='large'>
        {gameOver ? (
          <text size='xxlarge' weight='bold'>
            Game Over! Your Score: {score}
          </text>
        ) : (
          <>
            <text size='xxlarge' weight='bold'>
              {questionData.question}
            </text>
            <hstack alignment='center' gap='medium'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(number => (
                <button
                  key={number}
                  appearance='primary'
                  onPress={() => handleNumberClick(number)}
                >
                  {number}
                </button>
              ))}
              <button
                appearance='primary'
                onPress={handleNegativeClick}
              >
                (-)
              </button>
              <button
                appearance='primary'
                onPress={handleBackspaceClick}
              >
                ←
              </button>
            </hstack>
            <button
              appearance='primary'
              onPress={handleSubmitClick}
            >
              Submit
            </button>
            <text>{`Your Answer: ${userAnswer}`}</text>
            <text>{`Score: ${score}`}</text>
          </>
        )}
      </vstack>
    );
  },
  
});


export default Devvit;
