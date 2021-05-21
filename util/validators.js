module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword,
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Tên đăng nhập không được bỏ trống';
    }
    if (email.trim() === '') {
        errors.email = 'Email không được bỏ trống';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Email không hợp lệ';
        }
    }
    if (password === '') {
        errors.password = 'Mật khẩu không được để trống'
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Mật khẩu không trùng khớp';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Tên đăng nhập không được bỏ trống';
    }
    if (password.trim() === '') {
        errors.password = 'Mật khẩu không được để trống'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}