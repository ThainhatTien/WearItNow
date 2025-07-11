import {
  Box,
  Link,
  Paper,
  Stack,
  Button,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useState, ReactElement } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import Image from 'components/base/Image';
import logoWithText from '/Logo-with-text.png';
import { AuthService } from 'services/ApiLogin';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { forgotPasswordFailure, forgotPasswordSuccess, resetOtp, resetPasswordSuccess, setErrorMessage } from 'store/Login/LoginAction';

const Forgotpass = (): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otpVisible, setOtpVisible] = useState<boolean>(false); // Hiển thị OTP
  const [passwordVisible] = useState<boolean>(false); // Hiển thị nhập mật khẩu
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [emailError, setEmailError] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleResetOtp = async () => {
    if (!email) {
      setEmailError("Please enter a valid email.");
      return;
    }
  
    try {
      // Gửi lại yêu cầu OTP
      await AuthService.forgotPassword({ email });
      
      // Đặt lại thời gian đếm ngược (60 giây)
      setTimeLeft(60);
      
      // Reset thông báo lỗi OTP nếu có
      setOtpError("");
      dispatch(resetOtp());  // Gửi action reset OTP cho Redux (nếu cần)
      
      // Bắt đầu lại đếm ngược thời gian
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setOtpVisible(false);  // Ẩn ô nhập OTP khi hết thời gian
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);  // Dọn dẹp timer khi component unmount
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(forgotPasswordFailure("Failed to send OTP again. Please try again later."));
      } else {
        dispatch(forgotPasswordFailure("An unexpected error occurred."));
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    }

    if (!valid) return;

    const forgotPasswordRequest = { email };
    try {
      await AuthService.forgotPassword(forgotPasswordRequest);
      dispatch(forgotPasswordSuccess());
      setOtpVisible(true); // Hiển thị ô nhập OTP
      setTimeLeft(60); // Đặt thời gian còn lại là 60 giây
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(forgotPasswordFailure("Failed to send reset instructions. Please check your email."));
      } else {
        dispatch(forgotPasswordFailure("An unexpected error occurred."));
      }
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setOtpVisible(false); // Ẩn ô nhập OTP khi thời gian hết
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };
  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };
  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    let valid = true;

    if (!otp) {
      setOtpError("OTP is required.");
      valid = false;
    } else {
      setOtpError("");
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!valid) return;

    const otpRequest = { email, otp, newPassword: password };
    try {
      await AuthService.verifyForgotPasswordOtp(otpRequest);
      dispatch(resetPasswordSuccess());
      navigate('/authentication/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage("Reset password failed. Please check your code and try again."));
      } else {
        dispatch(setErrorMessage("An unexpected error occurred."));
      }
    }
  };

  return (
    <>
      <Box component="figure" mb={5} mx="auto" textAlign="center">
        <Link href="/">
          <Image src={logoWithText} alt="logo with text" height={60} />
        </Link>
      </Box>
      <Paper
        sx={{
          py: 6,
          px: { xs: 5, sm: 7.5 },
        }}
      >
        <Stack justifyContent="center" gap={5}>
          <Typography variant="h3" textAlign="center" color="text.secondary">
            Forgot Password
          </Typography>
          <Typography variant="h6" fontWeight={500} textAlign="center" color="text.primary">
            Have an account?{' '}
            <Link href="/authentication/login" underline="none">
              Log In
            </Link>
          </Typography>

          <Form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={2} width="100%">
              {!otpVisible && !passwordVisible && (
                <TextField
                  variant="filled"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  required
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-root': {
                      height: 56,
                    },
                  }}
                />
              )}

              {otpVisible && !passwordVisible && (
                <TextField
                  variant="filled"
                  label="OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  error={!!otpError}
                  helperText={otpError}
                  required
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-root': {
                      height: 56,
                    },
                  }}
                />
              )}
            </Stack>

            {otpVisible && passwordVisible && (
              <Stack direction="row" spacing={2} mt={2}>
                <TextField
                  variant="filled"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword}>
                          <IconifyIcon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-root': {
                      height: 56,
                    },
                  }}
                />

                <TextField
                  variant="filled"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowConfirmPassword}>
                          <IconifyIcon icon={showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-root': {
                      height: 56,
                    },
                  }}
                />
              </Stack>
            )}

            <Stack spacing={2} mt={4}>
              {otpVisible ? (
                <>
                  <Button variant="contained" size="large" onClick={handleResetPassword}>
                    Reset Password
                  </Button>
                  <Button variant="text" size="large" onClick={handleResetOtp} disabled={timeLeft > 0}>
                    {timeLeft > 0 ? `Resend OTP (${timeLeft}s)` : 'Resend OTP'}
                  </Button>
                </>
              ) : (
                <Button variant="contained" size="large" type="submit">
                  Send OTP
                </Button>
              )}
            </Stack>


          </Form>
        </Stack>
      </Paper>
    </>
  );
};

export default Forgotpass;
