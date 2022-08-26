import ReactDOM from 'react-dom/client';
import GlobalStyle from './styles/globalStyle';
import reportWebVitals from './reportWebVitals';
import './assets/font/font.css';
import { ThemeProvider } from 'styled-components';
import defaultTheme from './styles/theme';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <>
    <GlobalStyle />
    <ThemeProvider theme={defaultTheme}>
      <App />
    </ThemeProvider>
  </>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
