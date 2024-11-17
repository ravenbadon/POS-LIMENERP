function Validation(values) {
    let error = {};
    
    // Updated patterns for testing
    const userName_pattern = /^[a-zA-Z0-9_.-]{3,20}$/; // Allows 3-20 characters (letters, numbers, _, ., -)
    const userPassword_pattern = /^.{4,}$/; // Allows any characters with a minimum length of 4


    if (values.userName === "") {
        error.userName = "Username should not be empty";
    } else if (!userName_pattern.test(values.userName)) {
        error.userName = "Username did not match";
    }

    if (values.userPassword === "") {
        error.userPassword = "Password should not be empty";
    } else if (!userPassword_pattern.test(values.userPassword)) {
        error.userPassword = "Password did not match";
    }

    console.log("Validation Check - Password:", values.userPassword);
    console.log("Validation Errors:", error); // Added for debugging

    return error;
}

export default Validation;
