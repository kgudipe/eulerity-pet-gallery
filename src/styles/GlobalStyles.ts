import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Fraunces:opsz,wght@9..144,600&display=swap');

  :root {
    --bg-main: #f3f7ed;
    --bg-accent: #d8ebe4;
    --surface: rgba(255, 255, 255, 0.82);
    --surface-strong: #ffffff;
    --text-main: #1f2d24;
    --text-muted: #4f6759;
    --brand: #0f766e;
    --brand-strong: #0d5f58;
    --danger: #b42318;
    --ring: #0b57d0;
    --ring-offset: #ffffff;
    --shadow: 0 10px 30px rgba(15, 38, 28, 0.08);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    margin: 0;
    min-height: 100%;
  }

  body {
    font-family: 'Space Grotesk', sans-serif;
    color: var(--text-main);
    background:
      radial-gradient(circle at 10% 0%, rgba(255, 225, 135, 0.35), transparent 40%),
      radial-gradient(circle at 90% 0%, rgba(30, 175, 143, 0.25), transparent 45%),
      linear-gradient(180deg, var(--bg-main) 0%, var(--bg-accent) 100%);
  }

  h1,
  h2,
  h3 {
    font-family: 'Fraunces', serif;
    line-height: 1.12;
    margin: 0;
  }

  p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: 3px solid var(--ring);
    outline-offset: 2px;
    box-shadow: 0 0 0 2px var(--ring-offset);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
