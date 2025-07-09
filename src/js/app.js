import TimeLine from './Timeline.js';

document.addEventListener('DOMContentLoaded', () => {
  const lineContainer = document.querySelector('.line_container');
  const timeLine = new TimeLine(lineContainer);
});