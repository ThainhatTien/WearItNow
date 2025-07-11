import React from 'react';
import {
    TextField,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Grid,
} from '@mui/material';
import { CreateUserService } from 'services/ApiUser';
import Splash from 'components/loading/Splash';
import { useFormValidation } from 'ValidateForm/useFormValidation';


interface UserFormProps {
    open: boolean;
    onUserAdded: () => void;
    onClose: () => void;
    loading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ open, onUserAdded, onClose, loading }) => {
    const { formData, errors, handleChange, validate, setFieldValue,  } = useFormValidation({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        dob: new Date(),
        gender: true, // Giá trị mặc định là true (Male)
    });

    // Định nghĩa các quy tắc kiểm tra cho các trường dữ liệu
    const validationRules = [
        { field: 'firstname', value: formData.firstname, rules: { required: true, minLength: 3 } },
        { field: 'lastname', value: formData.lastname, rules: { required: true, minLength: 3 } },
        { field: 'email', value: formData.email, rules: { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ } },
        { field: 'phone', value: formData.phone, rules: { required: true, pattern: /^[0-9]{10,12}$/ } },
        { field: 'username', value: formData.username, rules: { required: true, minLength: 5 } },
        { field: 'password', value: formData.password, rules: { required: true, minLength: 6 } },
        { field: 'dob', value: formData.dob, rules: { required: true } },
        { field: 'gender', value: formData.gender, rules: { required: true } },
    ];

    const labels = {
        firstname: 'Tên',
        lastname: 'Họ',
        email: 'Email',
        phone: 'Số điện thoại',
        username: 'Tên tài khoản',
        password: 'Mật khẩu',
        dob: 'Ngày sinh',
        gender: 'Giới tính',
    };

    const handleAddUser = async () => {
        if (loading) return; // Ngăn chặn thêm người dùng khi đang tải

        // Kiểm tra dữ liệu trước khi gửi
        const errors = validate(validationRules, labels);
        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            await CreateUserService(formData);
            onUserAdded(); // Gọi hàm khi người dùng đã thêm thành công
            onClose(); // Đóng modal
        } catch (error) {
            console.error("Error adding user:", error);
            // Có thể hiển thị thông báo lỗi cho người dùng
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add User</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Splash />
                ) : (
                    <form>
                        <Grid container spacing={2}>
                            {/* Các trường nhập liệu */}
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    label={labels.username}
                                    type="text"
                                    size='small'
                                    fullWidth
                                    value={formData.username}
                                    onChange={handleChange('username')}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label={labels.firstname}
                                    type="text"
                                    size='small'
                                    fullWidth
                                    value={formData.firstname}
                                    onChange={handleChange('firstname')}
                                    error={!!errors.firstname}
                                    helperText={errors.firstname}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label={labels.lastname}
                                    type="text"
                                    size='small'
                                    fullWidth
                                    value={formData.lastname}
                                    onChange={handleChange('lastname')}
                                    error={!!errors.lastname}
                                    helperText={errors.lastname}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label={labels.email}
                                    type="email"
                                    size='small'
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label={labels.phone}
                                    type="tel"
                                    size='small'
                                    fullWidth
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label={labels.password}
                                    type="password"
                                    size='small'
                                    fullWidth
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    margin="dense"
                                    label={labels.dob}
                                    type="date"
                                    fullWidth
                                    size='small'
                                    value={formData.dob.toISOString().split('T')[0]} // Chuyển đổi định dạng
                                    onChange={(e) => setFieldValue('dob', new Date(e.target.value))}
                                    error={!!errors.dob}
                                    helperText={errors.dob}
                                />
                            </Grid>

                            {/* Trường giới tính */}
                            <Grid item xs={12}>
                                <Box>
                                    <label>{labels.gender}</label>
                                    <RadioGroup
                                        value={formData.gender ? 'Nam' : 'Nữ'}
                                        onChange={(e) => setFieldValue('gender', e.target.value === 'Nam')}
                                        row
                                    >
                                        <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                                        <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                                    </RadioGroup>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleAddUser} disabled={loading}>
                    Add User
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserForm;
