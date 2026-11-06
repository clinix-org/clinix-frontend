import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './store/reducers/store'
import 'react-toastify/dist/ReactToastify.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>      
    </Provider>,
)
