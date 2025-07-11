import {
  Box,
  Link,
  Paper,
  Stack,
  Button,
  Divider,
  Checkbox,
  FormGroup,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { rootPaths } from 'routes/paths';
import Image from 'components/base/Image';
import logoWithText from '/Logo-with-text.png';
import { LoginApi } from 'services/ApiLogin';
import { loginFailure, loginSuccess } from 'store/Login/LoginAction';
import { useDispatch } from 'react-redux';
import { LoginCredentials, ROLE_DIRECTOR_STAFF } from 'types/User.type';
import { jwtDecode, JwtPayload } from 'jwt-decode';

const Login = (): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [keepSignedIn, setKeepSignedIn] = useState<boolean>(false);


  const handleSubmit = async () => {
    try {
      const userCredentials: LoginCredentials = { username, password };
      const res = await LoginApi(userCredentials); // Gọi API đăng nhập
      const token = res.data.result.token;

      // Giải mã token
      const decodedToken = jwtDecode<JwtPayload & { scope?: string }>(token);
      // Lấy thời gian hết hạn
      const expiryTime = decodedToken?.exp;

      if (!expiryTime) {
        throw new Error('Token không có thời gian hết hạn.');
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpiryTime = expiryTime; // Thời gian hết hạn được lấy từ token

      // Lưu thời gian hết hạn vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('tokenCreationTime', currentTime.toString());
      localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());

      // Lưu username và password vào sessionStorage
      if (keepSignedIn) { sessionStorage.setItem('username', username); }

      // Kiểm tra quyền truy cập
      if (decodedToken && decodedToken.scope) {
        const roles = decodedToken.scope?.trim().split(' ');
        const hasAccess = roles.some((role: string) => ROLE_DIRECTOR_STAFF.includes(role));

        if (!hasAccess) {
          setError('Bạn không có quyền truy cập. Vui lòng liên hệ quản trị viên.');
          return;
        }
      } else {
        console.error("Không có thông tin vai trò.");
      }

      // Lưu thời gian đăng nhập
      const loginTime = new Date().getTime(); // Thời gian hiện tại tính bằng milliseconds
      localStorage.setItem('loginTime', loginTime.toString());

      // Gọi action loginSuccess
      dispatch(loginSuccess(token));
      navigate(rootPaths.homeRoot);
      setError(''); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đăng nhập không thành công.';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage)); 
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Box component="figure" mb={5} mx="auto" textAlign="center">
        <Link href={rootPaths.homeRoot}>
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
            Admin Login
          </Typography>
          {/* <Typography variant="h6" fontWeight={500} textAlign="center" color="text.primary">
            Don’t have an account?{' '}
            <Link href="/authentication/sign-up" underline="none">
              Sign up
            </Link>
          </Typography> */}
          {error && <Typography color="error.main">{error}</Typography>} {/* Hiển thị thông báo lỗi nếu có */}
          <TextField
            variant="filled"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Cập nhật state
            sx={{
              '.MuiFilledInput-root': {
                bgcolor: 'grey.A100',
                ':hover': {
                  bgcolor: 'background.default',
                },
                ':focus': {
                  bgcolor: 'background.default',
                },
                ':focus-within': {
                  bgcolor: 'background.default',
                },
              },
              borderRadius: 2,
            }}
          />
          <TextField
            variant="filled"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Cập nhật state
            sx={{
              '.MuiFilledInput-root': {
                bgcolor: 'grey.A100',
                ':hover': {
                  bgcolor: 'background.default',
                },
                ':focus': {
                  bgcolor: 'background.default',
                },
                ':focus-within': {
                  bgcolor: 'background.default',
                },
              },
              borderRadius: 2,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    size="small"
                    edge="end"
                    sx={{
                      mr: 2,
                    }}
                  >
                    {showPassword ? (
                      <IconifyIcon icon="el:eye-open" color="text.secondary" />
                    ) : (
                      <IconifyIcon icon="el:eye-close" color="text.primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <FormGroup sx={{ ml: 1, width: 'fit-content' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)} // Cập nhật state
                  />
                }
                label="Keep me signed in"
                sx={{
                  color: 'text.secondary',
                }}
              />
            </FormGroup>
            <Link href="/authentication/forgot-password" underline="none">
              <Typography variant="body2" color="text.secondary">
                Forgot Password?
              </Typography>
            </Link>
          </Stack>
          <Button
            onClick={handleSubmit}
            sx={{
              fontWeight: 'fontWeightRegular',
            }}
          >
            Log In
          </Button>
          <Divider />
          <Typography textAlign="center" color="text.secondary" variant="body1">
            Or sign in using:
          </Typography>
          <Stack gap={1.5} direction="row" justifyContent="space-between">
            <Button
              startIcon={<IconifyIcon icon="flat-color-icons:google" />}
              variant="outlined"
              fullWidth
              sx={{
                fontSize: 'subtitle2.fontSize',
                fontWeight: 'fontWeightRegular',
              }}
            >
              Google
            </Button>
            <Button
              startIcon={<IconifyIcon icon="logos:facebook" />}
              variant="outlined"
              fullWidth
              sx={{
                fontSize: 'subtitle2.fontSize',
                fontWeight: 'fontWeightRegular',
              }}
            >
              Facebook
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
};

export default Login;
