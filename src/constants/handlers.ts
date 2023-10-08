export const titleCase = (val) => {
  if (val) {
    val = val.trim();
    let sentence = val.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    sentence = sentence.join(' ');
    return sentence;
  } else {
    return null;
  }
};

export const verificationCode = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const timeNowMilliseconds = (): number => {
  return new Date(Date.now()).getTime();
};
