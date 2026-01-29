import { useState } from "react";


function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;

        if (formData.email.length === 0) {
            newErrors.email = "Email is required";
            isValid = false;
        }

        if (formData.password.length === 0) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = (event) => {
        // Prevent default behaviour of form which is to do complete page reload.
        event.preventDefault(); 

        if (validate()) {
            console.log('Valid Form');
        } else {
            console.log('Invalid Form');
        }
    };

    return (
        <div className="container text-center">
            <h3>Login to continue</h3>

            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        className="form-control" 
                        type='text' 
                        name="email"
                        onChange={handleChange}
                    />
                    {errors.email && (errors.email)}
                </div>

                <div>
                    <label>Password:</label>
                    <input 
                        className="form-control" 
                        type='password' 
                        name="password" 
                        onChange={handleChange}
                    />
                    {errors.password && (errors.password)}
                </div>

                <div>
                    <button className="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
