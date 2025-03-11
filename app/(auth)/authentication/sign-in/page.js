'use client';

import { useState } from 'react';
import { Row, Col, Card, Form, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { Eye, EyeSlash, Person, Lock } from 'react-bootstrap-icons';
import Link from 'next/link';
import Cookies from 'js-cookie';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      Cookies.set('auth_token', data.token, { expires: 1 });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100" style={{ background: '#f0f2f5' }}>
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="shadow-lg rounded-4 border-0">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <Link href="/">
                <Image src="/images/brand/logo/logo-primary.svg" className="mb-3" alt="Logo" width={120} />
              </Link>
              <h5 className="mb-4">Welcome Back! Please sign in to your account.</h5>
            </div>
            {success && <Alert variant="success">Successfully signed in! Redirecting...</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label><Person size={20} className="me-2" /> Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label><Lock size={20} className="me-2" /> Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="shadow-sm"
                  />
                  <div 
                    className="position-absolute top-50 end-0 translate-middle-y pe-3" 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading} className="rounded-3">
                  {loading ? (
                    <><Spinner animation="border" size="sm" /> Signing In...</>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>

              <div className="d-md-flex justify-content-between mt-4">
                <Link href="/authentication/sign-up" className="fs-5 text-primary text-decoration-none">
                  <Button variant="outline-primary" className="w-100 rounded-3 shadow-sm">
                    Create an Account
                  </Button>
                </Link>
                <Link href="/authentication/forgot-password" className="text-inherit fs-5 text-decoration-none">
                  <Button variant="link" className="w-100 text-secondary text-decoration-none">
                    Forgot Password?
                  </Button>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
