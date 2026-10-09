export const generateEndlessEquation = (elapsedSeconds) => {
  let operators = ['+', '-'];
  let maxNum = 20;

  if (elapsedSeconds > 30) {
    operators.push('*');
    maxNum = 50;
  }
  if (elapsedSeconds > 90) {
    operators.push('/');
    maxNum = 100;
  }

  const op = operators[Math.floor(Math.random() * operators.length)];
  let a = Math.floor(Math.random() * maxNum) + 1;
  let b = Math.floor(Math.random() * maxNum) + 1;

  if (op === '/') {
    a = a * b; 
  }

  const expression = `${a} ${op} ${b}`;
  const answer = eval(expression);

  return { expression, answer };
};