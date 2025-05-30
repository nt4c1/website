import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Contact from './components/Contact.jsx';
import ReactDOM from 'react-dom/client';


const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/contact', element: <Contact /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
