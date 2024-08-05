import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/common/root.css';

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  rootElement.style.width = '100%';
  rootElement.style.height = '100%';
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
