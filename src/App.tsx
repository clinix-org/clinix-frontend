import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import './styles/global.css'
import { AuthContextProvider } from './context/AuthContext'
import { ProtectedRouter } from './routes/ProtectedRouter'
import { Dashboard } from './pages/Dashboard'
import { Configuracoes } from './pages/Configuracoes'
import { Medicamentos } from './pages/Medicamentos'
import { Relatorios } from './pages/Relatorios'
import { Usuarios } from './pages/Usuarios'
import { Forbidden } from './pages/Forbidden'

function App() {


    return (
        <AuthContextProvider>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/403" element={<Forbidden />} />
                <Route element={<ProtectedRouter />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/medicamentos" element={<Medicamentos />} />
                    <Route path="/relatorios" element={<Relatorios />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                </Route>
            </Routes>
        </AuthContextProvider>
    )
}

export default App
