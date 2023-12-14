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
    const [isGameOver, setIsGameOver] = context.useState(false);

    const handleNumberClick = (number) => {
      if (!gameOver) {
        setUserAnswer(userAnswer + number);
      }
    };

    const handleClear = () => {
      setUserAnswer('');
    };

    const handleSubmitClick = () => {
      if (!gameOver) {
        const selectedAnswer = parseInt(userAnswer, 10);
        if (selectedAnswer === questionData.answer) {
          setScore(score + 10);
        } else {
          setGameOver(true);
          setIsGameOver(true);
        }
        setQuestionData(generateMathQuestion());
        setUserAnswer('');
      }
    };

    const handleRestartClick = () => {
     
      setScore(0);
      setGameOver(false);
      setIsGameOver(false);
      setQuestionData(generateMathQuestion());
      setUserAnswer('');
    };

    const tick = () => {
      if (!gameOver) {
        const { question, answer } = generateMathQuestion();
        setQuestionData({ question, answer });
      }
    };


    const updateInterval = context.useInterval(tick, 50000); 
    updateInterval.start();

    return (
      <vstack alignment='center middle' height='100%' gap='small'>
        <text size='xxlarge' weight='bold'>
          {questionData.question}
        </text>
        <hstack alignment='center' gap='small' style={{ flexWrap: 'wrap' }}>
          {[1, 2, 3].map(value => (
            <button key={value} onPress={() => handleNumberClick(value)}>
              {value}
            </button>
          ))}
        </hstack>
        <hstack alignment='center' gap='small' style={{ flexWrap: 'wrap' }}>
          {[4, 5, 6].map(value => (
            <button key={value} onPress={() => handleNumberClick(value)}>
              {value}
            </button>
          ))}
        </hstack>
        <hstack alignment='center' gap='small' style={{ flexWrap: 'wrap' }}>
          {[7, 8, 9].map(value => (
            <button key={value} onPress={() => handleNumberClick(value)}>
              {value}
            </button>
          ))}
        </hstack>
        <hstack alignment='center' gap='small' style={{ flexWrap: 'wrap' }}>
          {[0, '✓', 'C'].map(value => (
            <button
              key={value}
              onPress={() => {
                if (value === '✓') {
                  handleSubmitClick();
                } else if (value === 'C') {
                  handleClear();
                } else {
                  handleNumberClick(value);
                }
              }}
            >
              {value}
            </button>
          ))}
        </hstack>
        <text>{`Your Answer: ${userAnswer}`}</text>
        {isGameOver && (
          <vstack>
            <text size='xxlarge' weight='bold'>
              Game Over! Your Score: {score}
            </text>
            <button
              onPress={handleRestartClick}
              style={{ width: '50%' }}
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
