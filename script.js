document.addEventListener('DOMContentLoaded', function() {
    // Biến toàn cục
    let currentStep = 1;
    const totalSteps = 4;
    
    // Xử lý chuyển bước
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                document.getElementById(`step${currentStep}`).style.display = 'none';
                currentStep++;
                document.getElementById(`step${currentStep}`).style.display = 'block';
                updateProgressBar();
                
                // Nếu là bước cuối, hiển thị thông tin xác nhận
                if (currentStep === totalSteps) {
                    displayConfirmationInfo();
                }
            }
        });
    });
    
    // Xử lý quay lại bước trước
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById(`step${currentStep}`).style.display = 'none';
            currentStep--;
            document.getElementById(`step${currentStep}`).style.display = 'block';
            updateProgressBar();
        });
    });
    
    // Cập nhật thanh tiến trình
    function updateProgressBar() {
        const progressPercentage = (currentStep / totalSteps) * 100;
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `Bước ${currentStep}/${totalSteps}`;
    }
    
    // Kiểm tra hợp lệ trước khi chuyển bước
    function validateStep(step) {
        let isValid = true;
        
        if (step === 1) {
            // Kiểm tra thông tin bệnh nhân
            const requiredFields = ['patientName', 'patientDob', 'patientGender', 'patientHometown', 'patientId'];
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Kiểm tra lý do cấp lại
            const reasonSelected = document.querySelector('input[name="reason"]:checked');
            if (!reasonSelected) {
                alert('Vui lòng chọn lý do cấp lại giấy ra viện');
                isValid = false;
            }
        } else if (step === 2) {
            // Kiểm tra thông tin người yêu cầu
            const requesterType = document.querySelector('input[name="requesterType"]:checked').value;
            
            if (requesterType === 'patient') {
                const phoneField = document.getElementById('patientPhone');
                if (!phoneField.value.trim()) {
                    phoneField.classList.add('is-invalid');
                    isValid = false;
                } else {
                    phoneField.classList.remove('is-invalid');
                }
                
                // Trong thực tế cần kiểm tra OTP nhưng ở đây bỏ qua
            } else {
                const requiredFields = ['requesterName', 'relationship', 'requesterId', 'requesterPhone', 'requesterEmail'];
                requiredFields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (!field.value.trim()) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                // Kiểm tra file đính kèm
                const authFile = document.getElementById('authorizationFile');
                if (!authFile.files.length) {
                    authFile.classList.add('is-invalid');
                    isValid = false;
                } else {
                    authFile.classList.remove('is-invalid');
                }
            }
        } else if (step === 3) {
            // Kiểm tra phương thức nhận
            const receiveMethods = document.querySelectorAll('input[name="receiveMethod"]:checked');
            if (receiveMethods.length === 0) {
                alert('Vui lòng chọn ít nhất một phương thức nhận kết quả');
                isValid = false;
            }
            
            // Nếu chọn nhận qua bưu điện, kiểm tra địa chỉ
            const receivePost = document.getElementById('receivePost');
            if (receivePost.checked) {
                const postAddress = document.getElementById('postAddress');
                if (!postAddress.value.trim()) {
                    postAddress.classList.add('is-invalid');
                    isValid = false;
                } else {
                    postAddress.classList.remove('is-invalid');
                }
            }
            
            // Kiểm tra checkbox cam kết
            if (!document.getElementById('agreeTerms').checked) {
                alert('Vui lòng xác nhận cam kết thông tin');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Hiển thị thông tin xác nhận
    function displayConfirmationInfo() {
        // Thông tin bệnh nhân
        let patientInfoHTML = `
            <p><strong>Họ tên:</strong> ${document.getElementById('patientName').value}</p>
            <p><strong>Ngày sinh:</strong> ${document.getElementById('patientDob').value}</p>
            <p><strong>Giới tính:</strong> ${document.getElementById('patientGender').options[document.getElementById('patientGender').selectedIndex].text}</p>
            <p><strong>Quê quán:</strong> ${document.getElementById('patientHometown').value}</p>
            <p><strong>Số CMND/CCCD:</strong> ${document.getElementById('patientId').value}</p>
            <p><strong>Lý do cấp lại:</strong> ${document.querySelector('input[name="reason"]:checked').nextElementSibling.textContent}</p>
        `;
        
        document.getElementById('confirmPatientInfo').innerHTML = patientInfoHTML;
        
        // Thông tin người yêu cầu
        const requesterType = document.querySelector('input[name="requesterType"]:checked').value;
        let requesterInfoHTML = '';
        
        if (requesterType === 'patient') {
            requesterInfoHTML = `
                <p><strong>Người yêu cầu:</strong> Bệnh nhân tự nộp</p>
                <p><strong>Số điện thoại:</strong> ${document.getElementById('patientPhone').value}</p>
            `;
        } else {
            requesterInfoHTML = `
                <p><strong>Họ tên người yêu cầu:</strong> ${document.getElementById('requesterName').value}</p>
                <p><strong>Mối quan hệ:</strong> ${document.getElementById('relationship').value}</p>
                <p><strong>Số CMND/CCCD:</strong> ${document.getElementById('requesterId').value}</p>
                <p><strong>Số điện thoại:</strong> ${document.getElementById('requesterPhone').value}</p>
                <p><strong>Email:</strong> ${document.getElementById('requesterEmail').value}</p>
                <p><strong>File đính kèm:</strong> ${document.getElementById('authorizationFile').files[0].name}</p>
            `;
        }
        
        document.getElementById('confirmRequesterInfo').innerHTML = requesterInfoHTML;
        
        // Phương thức nhận kết quả
        let receiveMethodsHTML = '';
        const receiveMethods = document.querySelectorAll('input[name="receiveMethod"]:checked');
        
        receiveMethods.forEach(method => {
            receiveMethodsHTML += `<p>${method.nextElementSibling.textContent}</p>`;
            
            if (method.id === 'receivePost') {
                receiveMethodsHTML += `<p><strong>Địa chỉ nhận:</strong> ${document.getElementById('postAddress').value}</p>`;
            }
        });
        
        document.getElementById('confirmReceiveMethod').innerHTML = receiveMethodsHTML;
    }
    
    // Xử lý khi form được submit
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Trong thực tế, ở đây sẽ gửi dữ liệu đến server
        // Nhưng trong demo, chúng ta chỉ hiển thị modal thành công
        
        // Tạo mã yêu cầu ngẫu nhiên
        const requestCode = 'GV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        document.getElementById('requestCode').textContent = requestCode;
        
        // Hiển thị modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    });
    
    // Xử lý nút gửi OTP
    document.getElementById('sendOtpBtn').addEventListener('click', function() {
        const phone = document.getElementById('patientPhone').value;
        if (!phone) {
            alert('Vui lòng nhập số điện thoại');
            return;
        }
        
        // Trong thực tế, ở đây sẽ gửi yêu cầu OTP đến server
        // Nhưng trong demo, chúng ta chỉ hiển thị thông báo
        alert(`Mã OTP đã được gửi đến số điện thoại ${phone}. Mã OTP: 123456 (Demo)`);
    });
    
    // Xử lý nút in yêu cầu
    document.getElementById('printRequestBtn').addEventListener('click', function() {
        window.print();
    });
    
    // Xử lý khi chọn lý do khác
    document.querySelectorAll('input[name="reason"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherReasonText = document.getElementById('otherReasonText');
            if (this.value === 'other') {
                otherReasonText.style.display = 'block';
                otherReasonText.required = true;
            } else {
                otherReasonText.style.display = 'none';
                otherReasonText.required = false;
            }
        });
    });
    
    // Xử lý khi chọn người yêu cầu
    document.querySelectorAll('input[name="requesterType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'patient') {
                document.getElementById('patientRequesterInfo').style.display = 'block';
                document.getElementById('otherRequesterInfo').style.display = 'none';
            } else {
                document.getElementById('patientRequesterInfo').style.display = 'none';
                document.getElementById('otherRequesterInfo').style.display = 'block';
            }
        });
    });
    
    // Xử lý khi chọn nhận qua bưu điện
    document.getElementById('receivePost').addEventListener('change', function() {
        document.getElementById('postInfo').style.display = this.checked ? 'block' : 'none';
    });
});

// Hàm format ngày tháng (nếu cần)
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
}


// Xử lý ẩn/hiện tùy chọn tiền mặt
function updatePaymentOptions() {
    const receiveHospital = document.getElementById('receiveHospital').checked;
    const cashOption = document.getElementById('cashPaymentOption');
    const qrContainer = document.getElementById('qrCodeContainer');

    // Nếu chọn nhận tại bệnh viện -> hiện cả 2 lựa chọn
    if (receiveHospital) {
        cashOption.style.display = 'block';
    } 
    // Ngược lại -> chỉ hiện QR, ẩn tiền mặt
    else {
        cashOption.style.display = 'none';
        document.getElementById('paymentQR').checked = true; // Tự động chọn QR
        qrContainer.style.display = 'block'; // Luôn hiện QR
    }
}

// Xử lý khi thay đổi phương thức nhận
document.querySelectorAll('input[name="receiveMethod"]').forEach(radio => {
    radio.addEventListener('change', updatePaymentOptions);
});

// Xử lý khi thay đổi phương thức thanh toán
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const qrContainer = document.getElementById('qrCodeContainer');
        qrContainer.style.display = (this.value === 'qr') ? 'block' : 'none';
    });
});

// Gọi hàm khi trang tải xong
document.addEventListener('DOMContentLoaded', updatePaymentOptions);