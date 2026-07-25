import './AboutPage.css';

const storyParagraphs = [
  'This site is all about having fun with RC planes—without spending a fortune.',
  "A few years ago I found my way back into the RC plane hobby after a long break. Like many people, life simply got in the way for a while. But once I rediscovered the hobby, I quickly remembered why I'd loved it so much.",
  "I've always had a passion for photography, so my return to flying actually started with a drone. It opened up a whole new perspective and gave me the chance to capture some amazing aerial footage.",
  'Before long, curiosity got the better of me and I bought an inexpensive electric RC plane—just to see if the flying spark was still there.',
  'It definitely was.',
  "The technology in RC aircraft has come an incredibly long way over the past 25 years. Today's models are smarter, more capable, easier to fly, and far more affordable than I ever imagined. There is also an incredible online community where people freely share their knowledge and experience.",
  'My philosophy is simple: enjoy this fantastic hobby on a shoestring budget.',
  "These days I design and build many of my own aircraft using CAD software and a 3D printer, paired with affordable motors, electronics and batteries. I love proving that you don't need expensive equipment to have an amazing time in the air.",
  'Flying at local clubs has introduced me to a great community of friendly, knowledgeable people who have helped me enormously along the way. Their encouragement has inspired me to keep learning, experimenting and trying new ideas.',
  "Through my YouTube channel and this website, I enjoy sharing what I've learned—the successes, the mistakes, the budget-friendly tips, and hopefully a few laughs along the way.",
  "Whether you're returning to the hobby after many years, just getting started, or simply looking for new ideas, I hope you'll find something here that inspires you to get out and enjoy RC flying.",
  'Thanks for stopping by, and happy flying!',
];

export function AboutPage() {
  return (
    <div className="container about-page">
      <h1>About</h1>
      {storyParagraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
