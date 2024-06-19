import React, { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('authorization_level', user.authorization_level);

            if(user.authorization_level === 'Logistique') {
                navigate("/products")
            } else if(user.authorization_level === 'RH') {
                navigate("/users")
            } else if(user.authorization_level === 'production') {
                navigate("/dashboard")
            } else {
                navigate("/dashboard")
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
                <form onSubmit={handleLogin}>
                    <Input
                        container="mb-4"
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        handleChange={(e) => setEmail(e.target.value)}
                        text={email}
                    />
                    <Input
                        container="mb-6"
                        label="Password"
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        handleChange={(e) => setPassword(e.target.value)}
                        text={password}
                    />
                    <Button
                        container=""
                        classes="bg-blue-500 hover:bg-blue-600 transition duration-200"
                        handlePress={handleLogin}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;